var Buffer    = require('safe-buffer').Buffer;
var common    = require('../../common');
var test      = require('utest');
var assert    = require('assert');
var PreparedStatement = common.PreparedStatement;

/*
PreparedStatement.prototype._makeExecuteStmt
PreparedStatement.prototype._makeSetStatement
PreparedStatement.prototype.bindParameter
PreparedStatement.prototype.cb_bindParamsToBeExec
PreparedStatement.prototype.defineParameterTypes
*/