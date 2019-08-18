/**
 * Returns a prepared statement that handels prepares statements witout the
 * binary protocol
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
 * Set the type of parameters, that are accepted for this prepared statement
 * @param {String} typeStr 'A string in the format of accepted prepared types,
 * eg. 'ssiid'
 * @return {undefined}
 */
PreparedStatement.prototype._defineParameterTypes = function (typeStr) {
  // @todo unit test
  /** @type Array */
  var prepTypes = typeStr.split();
  /** @type Number */
  var i = 0;
  /** @type Number */
  var iLen = prepTypes.length;
  this._parameters = [];
  for (i; i < iLen; i += 1) {
    switch (prepTypes[i]) {
      case 'i':
        this._parameters[i] = 'i';
        break;
      case 'd':
        this._parameters[i] = 'd';
        break;
      case 's':
        this._parameters[i] = 's';
        break;
      case 'b':
        throw new TypeError('type b (blob) not implemented, yet');
      default:
        throw new TypeError('found unknown type ' + prepTypes[i] + ' while binding parameters');
    }
  }
};

/**
 * Bind the parameters for the prepared statement.
 * This method expects at least two arguments. The type string with the prepared
 * types. 'i' are integer (number), 'd' are doubles (number), 's' are strings
 * The following arguments will be bound to 1...n parameters and type
 * @example PreparedStatement('i', 0)
 * @example PreparedStatement('sdi', 'a string', 1.4, 1)
 * @arguments {...String|Number}
 * @return {undefined}
 */
PreparedStatement.prototype.bind_param = function () {
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
  if (typeof this.parameters === 'undefined') {
    this.parameters = this._defineParameterTypes(typeStr);
  }
  params.forEach(this._bindParamsToBeExec);
  // assign values via SET @a, @b ... @aaa
};

PreparedStatement.prototype._bindParamsToBeExec = function (element, index, arr) {
  // check type
  // push onto vaalues stack
};

/**
 * Closes the prepared statement
 * Alias of PreparedStatement.deallocate()
 * @param {queryCallback} callback cb for the result
 * @return {undefined}
 */
PreparedStatement.prototype.close = function (callback) {
  // @todo intergration test
  this.deallocate(callback);
};

/**
 * Closes the prepared statement
 * @param {queryCallback} callback cb vor the result
 * @return {undefined}
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
 * Execute the prepared statement with the currently bound variables
 * @param {queryCallback} callback cb to recieve the result of the statement
 * function (error, resutls, fields) {}
 * @return {undefined}
 */
PreparedStatement.prototype.execute = function (callback) {
  // @todo integration tests
  this.connection.query('EXECUTE stmt1 USING @a, @b;', callback);
};

/**
 *
 * @param {String} sqlStr String that contains the to-be-prepared SQL statement
 * @param {queryCallback} callback cb for the result
 * function (error, resutls, fields) {}
 * @return {undefined}
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
      'PREPARE stmt', String(this._prepStmtNum),
      ' FROM \'', this.SQLstr, '\';'
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