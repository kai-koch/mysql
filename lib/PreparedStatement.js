/* global Buffer */
/**
 * Returns a PreparedStatement, that handels server-side prepares witout using
 * the binary protocol
 * @param {Connection} connection The Connection this prepared statement will be
 * bound to
 * @return {PreparedStatement} The Prepared Statement working in one connection
 * @constructs PreparedStatement
 */
function PreparedStatement(connection) {
  /** @type Connection */
  this.connection = connection;
  /** @type Number */
  this._prepStmtNum = this.connection._preparedStatements.length;
}

/**
 * Make the Execute Statement SQL
 * @return {String} SQL-String EXECUTE stmt1 USING @val_1_1[,@val_1_2 ...]
 */
PreparedStatement.prototype._makeExecuteStmt = function () {
  // @todo unit test
  /** @type Number */
  var i = 0;
  /** @type Number */
  var iLen = this._parameterTypes.length;
  /** @type Array */
  var varNames = [];
  for (i; i < iLen; i += 1) {
    varNames.push(['@val_', this._prepStmtNum, '_', i].join(''));
  }
  return 'EXECUTE stmt' + this._prepStmtNum + ' USING ' + varNames.join(', ');
};

/**
 * Make the Set statement with the current bound variabls
 * @return {String} SQL-String SET @val_1_1=value1[, @val_1_2=value2, ...]
 */
PreparedStatement.prototype._makeSetStatement = function() {
  // @todo unit test
  var vals = [];
  var i = 0;
  var iLen = this.prepValues.length;
  for (i; i < iLen; i += 1) {
    vals.push(
      ['@val_', this._prepStmtNum, '_', i, ' = ', this.prepValues[i]].join('')
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
 * @arguments {...String|queryCallback|Number|Buffer}
 * @return {undefined}
 * @throws {TypeError}
 */
PreparedStatement.prototype.bindParameter = function () {
  // @todo unit test
  if (arguments.length < 3) {
    throw new TypeError('too few arguments given to bind_param');
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
  if (typeof this.parameterTypes === 'undefined') {
    this.parameterTypes = this.defineParameterTypes(typeStr);
  }
  /** @type Array */
  this.prepValues = [];
  params.forEach(this.cb_bindParamsToBeExec);
  if (this.prepValues.length === this.parameterTypes.length) {
    throw new TypeError('parameter count does not match prepared type count');
  }
  this.connection.query(this._makeSetStatement(), callback);
};

/**
 * ForEach Callback to go over each value-element, that is to be a prepared
 * statement variable. Supported prepared types are i = Integer (Number),
 * d = double (Number), s = String, b = Blob (Buffer)
 * @param {Number|String|Buffer} element An value, that is to be used in the
 *  prepared statement
 * @param {Number} index Index of the element in the array and in the
 *  _parameterTypes array
 * @return {undefined}
 * @throws {TypeError}
 */
PreparedStatement.prototype.cb_bindParamsToBeExec = function (element, index) {
  // @todo unit test
  switch (this._parameterTypes[index]) {
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
        this.prepValues.push(this.connection.escape(element));
      } else {
        throw new TypeError('prepared value[' + index + '] is not a string');
      }
    case 'b':
      if (Buffer.isBuffer(element)) {
        this.prepValues.push(this.connection.escape(element.toString('hex')));
      } else {
        throw new TypeError('prepared Value[' + index + '] is not a buffer');
      }
    default:
      throw new TypeError('unknown type in _parameters array - index ' + index);
  }
};

/**
 * Closes the prepared statement
 * Alias of PreparedStatement.deallocate()
 * @param {queryCallback} callback cb for the result
 * @return {undefined}
 * @throws {TypeError}
 */
PreparedStatement.prototype.close = function (callback) {
  // @todo intergration test
  this.deallocate(callback);
};

/**
 * Closes the prepared statement
 * @param {queryCallback} callback cb vor the result
 * @return {undefined}
 * @throws {TypeError}
 */
PreparedStatement.prototype.deallocate = function (callback) {
  // @todo integration test
  if (typeof callback !== 'function') {
    throw new TypeError('argument callback must be a function');
  }
  this.connection.query(
    ['DEALLOCATE PREPARE stmt', String(this._prepStmtNum), ';'].join(''),
    callback
  );
};

/**
 * Set the type of parameters, that are accepted for this prepared statement
 * @param {String} typeStr 'A string in the format of accepted prepared types,
 * eg. 'ssiidb'
 * @return {undefined}
 * @throws {TypeError}
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
  this._parameterTypes = [];
  for (i; i < iLen; i += 1) {
    switch (prepTypes[i]) {
      case 'i':
        this._parameterTypes[i] = 'i';
        break;
      case 'd':
        this._parameterTypes[i] = 'd';
        break;
      case 's':
        this._parameterTypes[i] = 's';
        break;
      case 'b':
        this._parameterTypes[i] = 'b';
      default:
        throw new TypeError('found unknown prepType ' + prepTypes[i]
          + ' while binding parameters');
    }
  }
  /** @type String */
  this.executeStatement = this._makeExecuteStmt();
};

/**
 * Execute the prepared statement with the currently bound variables
 * @param {queryCallback} callback cb to recieve the result of the statement
 * @return {undefined}
 */
PreparedStatement.prototype.execute = function (callback) {
  // @todo integration tests
  this.connection.query(this.executeStatement, callback);
};

/**
 *
 * @param {String} sqlStr String that contains the to-be-prepared SQL statement
 * @param {queryCallback} callback cb for the result
 * function (error, resutls, fields) {}
 * @return {undefined}
 * @throws {TypeError}
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
  this.connection.query(
    [
      'PREPARE stmt', this._prepStmtNum + '',
      ' FROM \'', this.connection.escape(this.SQLstr), '\';'
    ].join(''),
    callback
  );
};
module.exports = PreparedStatement;
/**
 * The queryCallback Function is supplied to the callback in
 * connection.query(sql, callback) to get the result of a query
 * @callback queryCallback
 * @param {error} error of the operation. null, if no error
 * @param {Array} results Resultset of the query, as Array of row-objects
 * @param {Array} fields An Array of Fields, if applicable
 */