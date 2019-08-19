/* global Buffer, console */
var SqlString = require('./protocol/SqlString');
/**
 * Returns a PreparedStatement, that handels server-side prepares witout
 * using the binary protocol
 * @param {Connection} connection The Connection to which this prepared
 * statement will be bound
 * @return {PreparedStatement} The Prepared Statement bound to the connection
 * @constructs PreparedStatement
 */
function PreparedStatement(connection) {
  /** @type {String} */
  this.SQLstr = '';
  /** @type {Number} */
  this._prepStmtNum = connection._preparedStatements.length;
  /** @type {Connection} */
  this.connection = connection;
  /** @type {Boolean} */
  this.debug = false;
  /** @type {String} */
  this.executeStatement = '';
  /** @type {String[]} */
  this.parameterTypes = [];
  /** @type {String[]} */
  this.prepValues = [];
}

/**
 * The method is called by Connection.end for each PreparedStatement, to enqueue
 * the DEALOCATE-query to free up server-side ressources. Reference to and in
 * the parrent Connection will be removed, when no error occurs. Console output
 * is only shown, if this.debug is true.
 * @returns {undefined}
 */
PreparedStatement.prototype._end = function () {
  // @todo intergartion test
  if (this.debug) {
    this.deallocate(function (err, result, fields) {
      if (err) {
        console.log('PreparedStatement._end() error: ', err);
      }
      if (result) {
        console.log('PreparedStatement._end() result: ', result);
      }
      if (fields) {
        console.log('PreparedStatement._end() fields: ', fields);
      }
    });
  } else {
    this.deallocate(function () {});
  }
};

/**
 * Create a unique variable name for the PreparedStatrment
 * @param {Number} stmtNr Index in the Connection._preparedStatements stack
 * @param {Number} varNr Number of the current variable
 * @returns {String} eg. '@val_1_3'
 */
PreparedStatement.prototype._getVarname = function (stmtNr, varNr) {
  // @todo unit test
  return ['@val_', stmtNr, '_', varNr].join('');
};

/**
 * Make the EXECUTE statement SQL
 * @return {String} SQL-String: EXECUTE stmt1 USING @val_1_1[,@val_1_2 ...];
 */
PreparedStatement.prototype._makeExecuteStmt = function () {
  // @todo unit test
  /** @type Number */
  var i = 0;
  /** @type Number */
  var iLen = this.parameterTypes.length;
  /** @type Array */
  var varNames = [];
  for (i; i < iLen; i += 1) {
    varNames.push(this._getVarname(this._prepStmtNum, i));
  }
  return 'EXECUTE stmt' + this._prepStmtNum + ' USING '
      + varNames.join(', ') + ';';
};

/**
 * Make the Set statement with the current bound variabls
 * @return {String} SQL-String: SET @val_1_1=value1[, @val_1_2=value2, ...];
 */
PreparedStatement.prototype._makeSetStmt = function() {
  // @todo unit test
  var vals = [];
  var i = 0;
  var iLen = this.prepValues.length;
  for (i; i < iLen; i += 1) {
    vals.push(
      [this._getVarname(this._prepStmtNum, i), ' = ', this.prepValues[i]
      ].join('')
    );
  }
  return 'SET ' + vals.join(', ') + ';';
};

/**
 * Binds the parameters for the prepared statement.
 * This method expects at least three arguments:
 * the type string with the prepared types, 'i' are integer (number),
 * 'd' are doubles (number), 's' are strings, 'b' are blobs as buffer;
 * a queryCallback;
 * and as many additional arguments as there are types in the types string.
 * @example bindParameter('i', callback, 0)
 * @example PreparedStatement('sdi', callback, 'a string', 1.4, 1)
 * @example PreparedStatement('ib', callback, 1, [aBuffer])
 * @arguments {(String|queryCallback|Number|Buffer)}
 * @return {undefined}
 * @throws {TypeError} Throws TypeErrors, when a passed argument is not the
 *  correct type or missing or the value arguments do not match the expected
 *  count
 */
PreparedStatement.prototype.bindParameter = function () {
  // @todo unit test
  if (arguments.length < 3) {
    throw new TypeError('too few arguments given to bindParameter');
  }
  /** @type String */
  var typeStr = arguments[0];
  /** @type queryCallback */
  var callback = arguments[1];
  /** @type Array */
  var params = [].slice.call(arguments, 2);
  if (typeStr.length < 1 || typeof typeStr !== 'string') {
    throw new TypeError('first argument must be a string');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('2nd argument must be a function');
  }
  if (0 === params.length) {
    throw new TypeError(
      'at least 1 parameter must be bound to the prepared statement'
    );
  }
  if (this.parameterTypes.length === 1) {
    this.parameterTypes = this.defineParameterTypes(typeStr);
  }
  this.prepValues = [];
  if (!this.connection) {
    // has this PreparedStatement already been ended or destroyed
    callback(
      new Error('the connection to the server has been terminated'), null, null
    );
  } else {
    params.forEach(this.cb_bindParamsToBeExec);
    if (this.prepValues.length !== this.parameterTypes.length) {
      throw new TypeError('parameter count does not match prepared type count');
    }
    this.connection.query(this._makeSetStmt(), callback);
  }
};

/**
 * ForEach Callback to go over each value-element, that is to be a prepared
 * statement variable. Supported prepared types are i = Integer (Number),
 * d = double (Number), s = String, b = Blob (Buffer)
 * @param {Number|String|Buffer} element An value, that is to be used in the
 *  prepared statement
 * @param {Number} index Index of the element in the array and in the
 * this.parameterTypes array
 * @return {undefined}
 * @throws {TypeError} Throws TypeError, if an element deviates from the
 *  expected prepare type or when an unknown type is encountered
 */
PreparedStatement.prototype.cb_bindParamsToBeExec = function (element, index) {
  // @todo unit test
  switch (this.parameterTypes[index]) {
    case 'i':
      if (Number.isSafeInteger(element)) {
        this.prepValues.push(element + '');
      } else {
        throw new TypeError('prepared value[' + index + '] is not an integer');
      }
      break;
    case 'd':
      if (typeof element === 'number') {
        this.prepValues.push(element + '');
      } else {
        throw new TypeError('prepared value[' + index + '] is not a double');
      }
    case 's':
      if (typeof element === 'string') {
        this.prepValues.push(SqlString.escape(element));
      } else {
        throw new TypeError('prepared value[' + index + '] is not a string');
      }
    case 'b':
      if (Buffer.isBuffer(element)) {
        this.prepValues.push('X\'' + element.toString('hex') + '\'');
      } else {
        throw new TypeError('prepared Value[' + index + '] is not a buffer');
      }
    default:
      throw new TypeError('unknown type in parameters array - index ' + index);
  }
};

/**
 * Closes the prepared statement
 * Alias of PreparedStatement.deallocate()
 * @param {queryCallback} callback cb for the result
 * @return {undefined}
 * @throws {TypeError} Throws TypeError if the argument is not a function
 */
PreparedStatement.prototype.close = function (callback) {
  // @todo intergration test
  this.deallocate(callback);
};

/**
 * Closes the prepared statement and removes reference in and to the parrent
 * connection
 * @param {queryCallback} callback cb vor the result
 * @return {undefined}
 * @throws {TypeError} Throws TypeError if the argument is not a function
 */
PreparedStatement.prototype.deallocate = function (callback) {
  // @todo integration test
  if (typeof callback !== 'function') {
    throw new TypeError('argument callback must be a function');
  }
  if (!this.connection) {
    // has this PreparedStatement already been ended or destroyed
    callback(
      new Error('the connection to the server has been terminated'), null, null
    );
  } else {
    this.connection.query(
      ['DEALLOCATE PREPARE stmt', String(this._prepStmtNum), ';'].join(''),
      function (err, results, fields) {
        /** @type PreparedStatement */
        var that = this;
        if (!err) {
          // if no error has occured during de-allocating:
          // delete references to this PreparedStatement to avoid memory leaks
          that.connection._preparedStatements[that._prepStmtNum] = null;
          // delete reference to the injected Connection to avoid memory leaks
          that.connection = null;
        }
        callback(err, results, fields);
      }
    );
  }
};

/**
 * Set the type of parameters, that are accepted for this prepared statement
 * @param {String} typeStr A string in the format of accepted prepared types.
 * @example typStr = 'ssiidb'
 * @return {undefined}
 * @throws {TypeError} Throws TypeError if argument is not a string or a prepare
 *  Type is unknown
 */
PreparedStatement.prototype.defineParameterTypes = function (typeStr) {
  // @todo unit test
  /** @type Array */
  var prepTypes = typeStr.split();
  /** @type Number */
  var i = 0;
  /** @type Number */
  var iLen = prepTypes.length;
  if (typeof typeStr !== 'string') {
    throw new TypeError('defineParameterTypes expects argument to be a string');
  }
  this.parameterTypes = [];
  for (i; i < iLen; i += 1) {
    switch (prepTypes[i]) {
      case 'i':
        this.parameterTypes[i] = 'i';
        break;
      case 'd':
        this.parameterTypes[i] = 'd';
        break;
      case 's':
        this.parameterTypes[i] = 's';
        break;
      case 'b':
        this.parameterTypes[i] = 'b';
        break;
      default:
        throw new TypeError('found unknown prepType ' + prepTypes[i]
          + ' while binding parameters');
    }
  }
  this.executeStatement = this._makeExecuteStmt();
};

/**
 * Execute the prepared statement with the currently bound variables
 * @param {queryCallback} callback cb to recieve the result of the statement
 * @return {undefined}
 */
PreparedStatement.prototype.execute = function (callback) {
  // @todo integration tests
  if (!this.connection) {
    // has this PreparedStatement already been ended or destroyed
    callback(
      new Error('the connection to the server has been terminated'), null, null
    );
  } else {
    this.connection.query(this.executeStatement, callback);
  }
};

/**
 * Send the SQL-statement to be prepared to the server
 * @param {String} sqlStr String that contains the to-be-prepared SQL statement
 * @param {queryCallback} callback Cb for the result of the operation
 * @return {undefined}
 * @throws {TypeError} Throws TypeError if the arguments are not of the expected
 *  types
 */
PreparedStatement.prototype.prepare = function (sqlStr, callback) {
  // @todo integration test
  if (typeof sqlStr !== 'string') {
    throw new TypeError('argument callback must be a string');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('argument callback must be a function');
  }
  this.SQLstr = sqlStr;
  if (!this.connection) {
    // has this PreparedStatement already been ended or destroyed
    callback(
      new Error('the connection to the server has been terminated'), null, null
    );
  } else {
    this.connection.query(
      [
        'PREPARE stmt', this._prepStmtNum + '', ' FROM ',
        this.connnection.escape(this.SQLstr), ';'
      ].join(''),
      callback
    );
  }
};

module.exports = PreparedStatement;
/**
 * The queryCallback Function is supplied to the callback in
 * connection.query(sql, callback) to get the result of a query
 * @callback queryCallback
 * @param {error} error of the operation. null, if no error
 * @param {Array} results Resultset of the query, as array of row-objects
 * @param {Array} fields An Array of Fields, if applicable
 */
/**
 * Callback to use in an array.forEach() call
 * @callback forEachCallback
 * @param {*} element Current element of the array
 * @param {Number} index Index of the element in the array
 * @param {Array} arr The array by refernce
 */
