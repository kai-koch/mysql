## Classes

<dl>
<dt><a href="#PreparedStatement">PreparedStatement</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#queryCallback">queryCallback</a> : <code>function</code></dt>
<dd><p>The queryCallback Function is supplied to the callback in
connection.query(sql, callback) to get the result of a query</p>
</dd>
<dt><a href="#forEachCallback">forEachCallback</a> : <code>function</code></dt>
<dd><p>Callback to use in an array.forEach() call</p>
</dd>
</dl>

<a name="PreparedStatement"></a>

## PreparedStatement
**Kind**: global class  

* [PreparedStatement](#PreparedStatement)
    * [new PreparedStatement(connection)](#new_PreparedStatement_new)
    * [.SQLstr](#PreparedStatement+SQLstr) : <code>String</code>
    * [._prepStmtNum](#PreparedStatement+_prepStmtNum) : <code>Number</code>
    * [.connection](#PreparedStatement+connection) : <code>Connection</code>
    * [.debug](#PreparedStatement+debug) : <code>Boolean</code>
    * [.executeStatement](#PreparedStatement+executeStatement) : <code>String</code>
    * [.parameterTypes](#PreparedStatement+parameterTypes) : <code>Array.&lt;String&gt;</code>
    * [.prepValues](#PreparedStatement+prepValues) : <code>Array.&lt;String&gt;</code>
    * [._end()](#PreparedStatement+_end) ⇒ <code>undefined</code>
    * [._getVarname(stmtNr, varNr)](#PreparedStatement+_getVarname) ⇒ <code>String</code>
    * [._makeExecuteStmt()](#PreparedStatement+_makeExecuteStmt) ⇒ <code>String</code>
        * [~i](#PreparedStatement+_makeExecuteStmt..i) : <code>Number</code>
        * [~iLen](#PreparedStatement+_makeExecuteStmt..iLen) : <code>Number</code>
        * [~varNames](#PreparedStatement+_makeExecuteStmt..varNames) : <code>Array</code>
    * [._makeSetStmt()](#PreparedStatement+_makeSetStmt) ⇒ <code>String</code>
    * [.bindParameter()](#PreparedStatement+bindParameter) ⇒ <code>undefined</code>
        * [~typeStr](#PreparedStatement+bindParameter..typeStr) : <code>String</code>
        * [~callback](#PreparedStatement+bindParameter..callback) : [<code>queryCallback</code>](#queryCallback)
        * [~params](#PreparedStatement+bindParameter..params) : <code>Array</code>
    * [.cb_bindParamsToBeExec(element, index)](#PreparedStatement+cb_bindParamsToBeExec) ⇒ <code>undefined</code>
    * [.close(callback)](#PreparedStatement+close) ⇒ <code>undefined</code>
    * [.deallocate(callback)](#PreparedStatement+deallocate) ⇒ <code>undefined</code>
    * [.defineParameterTypes(typeStr)](#PreparedStatement+defineParameterTypes) ⇒ <code>undefined</code>
        * [~prepTypes](#PreparedStatement+defineParameterTypes..prepTypes) : <code>Array</code>
        * [~i](#PreparedStatement+defineParameterTypes..i) : <code>Number</code>
        * [~iLen](#PreparedStatement+defineParameterTypes..iLen) : <code>Number</code>
    * [.execute(callback)](#PreparedStatement+execute) ⇒ <code>undefined</code>
    * [.prepare(sqlStr, callback)](#PreparedStatement+prepare) ⇒ <code>undefined</code>

<a name="new_PreparedStatement_new"></a>

### new PreparedStatement(connection)
Returns a PreparedStatement, that handels server-side prepares witout
using the binary protocol

**Returns**: [<code>PreparedStatement</code>](#PreparedStatement) - The Prepared Statement bound to the connection  

| Param | Type | Description |
| --- | --- | --- |
| connection | <code>Connection</code> | The Connection to which this prepared statement will be bound |

<a name="PreparedStatement+SQLstr"></a>

### preparedStatement.SQLstr : <code>String</code>
**Kind**: instance property of [<code>PreparedStatement</code>](#PreparedStatement)  
<a name="PreparedStatement+_prepStmtNum"></a>

### preparedStatement.\_prepStmtNum : <code>Number</code>
**Kind**: instance property of [<code>PreparedStatement</code>](#PreparedStatement)  
<a name="PreparedStatement+connection"></a>

### preparedStatement.connection : <code>Connection</code>
**Kind**: instance property of [<code>PreparedStatement</code>](#PreparedStatement)  
<a name="PreparedStatement+debug"></a>

### preparedStatement.debug : <code>Boolean</code>
**Kind**: instance property of [<code>PreparedStatement</code>](#PreparedStatement)  
<a name="PreparedStatement+executeStatement"></a>

### preparedStatement.executeStatement : <code>String</code>
**Kind**: instance property of [<code>PreparedStatement</code>](#PreparedStatement)  
<a name="PreparedStatement+parameterTypes"></a>

### preparedStatement.parameterTypes : <code>Array.&lt;String&gt;</code>
**Kind**: instance property of [<code>PreparedStatement</code>](#PreparedStatement)  
<a name="PreparedStatement+prepValues"></a>

### preparedStatement.prepValues : <code>Array.&lt;String&gt;</code>
**Kind**: instance property of [<code>PreparedStatement</code>](#PreparedStatement)  
<a name="PreparedStatement+_end"></a>

### preparedStatement.\_end() ⇒ <code>undefined</code>
The method is called by Connection.end for each PreparedStatement, to enqueue
the DEALOCATE-query to free up server-side ressources. Reference to and in
the parrent Connection will be removed, when no error occurs. Console output
is only shown, if this.debug is true.

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
<a name="PreparedStatement+_getVarname"></a>

### preparedStatement.\_getVarname(stmtNr, varNr) ⇒ <code>String</code>
Create a unique variable name for the PreparedStatrment

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
**Returns**: <code>String</code> - eg. '@val_1_3'  

| Param | Type | Description |
| --- | --- | --- |
| stmtNr | <code>Number</code> | Index in the Connection._preparedStatements stack |
| varNr | <code>Number</code> | Number of the current variable |

<a name="PreparedStatement+_makeExecuteStmt"></a>

### preparedStatement.\_makeExecuteStmt() ⇒ <code>String</code>
Make the EXECUTE statement SQL

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
**Returns**: <code>String</code> - SQL-String: EXECUTE stmt1 USING @val_1_1[,@val_1_2 ...];  

* [._makeExecuteStmt()](#PreparedStatement+_makeExecuteStmt) ⇒ <code>String</code>
    * [~i](#PreparedStatement+_makeExecuteStmt..i) : <code>Number</code>
    * [~iLen](#PreparedStatement+_makeExecuteStmt..iLen) : <code>Number</code>
    * [~varNames](#PreparedStatement+_makeExecuteStmt..varNames) : <code>Array</code>

<a name="PreparedStatement+_makeExecuteStmt..i"></a>

#### _makeExecuteStmt~i : <code>Number</code>
**Kind**: inner property of [<code>\_makeExecuteStmt</code>](#PreparedStatement+_makeExecuteStmt)  
<a name="PreparedStatement+_makeExecuteStmt..iLen"></a>

#### _makeExecuteStmt~iLen : <code>Number</code>
**Kind**: inner property of [<code>\_makeExecuteStmt</code>](#PreparedStatement+_makeExecuteStmt)  
<a name="PreparedStatement+_makeExecuteStmt..varNames"></a>

#### _makeExecuteStmt~varNames : <code>Array</code>
**Kind**: inner property of [<code>\_makeExecuteStmt</code>](#PreparedStatement+_makeExecuteStmt)  
<a name="PreparedStatement+_makeSetStmt"></a>

### preparedStatement.\_makeSetStmt() ⇒ <code>String</code>
Make the Set statement with the current bound variabls

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
**Returns**: <code>String</code> - SQL-String: SET @val_1_1=value1[, @val_1_2=value2, ...];  
<a name="PreparedStatement+bindParameter"></a>

### preparedStatement.bindParameter() ⇒ <code>undefined</code>
Binds the parameters for the prepared statement.
This method expects at least three arguments:
the type string with the prepared types, 'i' are integer (number),
'd' are doubles (number), 's' are strings, 'b' are blobs as buffer;
a queryCallback;
and as many additional arguments as there are types in the types string.

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
**Throws**:

- <code>TypeError</code> Throws TypeErrors, when a passed argument is not the
 correct type or missing or the value arguments do not match the expected
 count

**Arguments**: <code>(String\|queryCallback\|Number\|Buffer)</code>  
**Example**  
```js
bindParameter('i', callback, 0)
```
**Example**  
```js
PreparedStatement('sdi', callback, 'a string', 1.4, 1)
```
**Example**  
```js
PreparedStatement('ib', callback, 1, [aBuffer])
```

* [.bindParameter()](#PreparedStatement+bindParameter) ⇒ <code>undefined</code>
    * [~typeStr](#PreparedStatement+bindParameter..typeStr) : <code>String</code>
    * [~callback](#PreparedStatement+bindParameter..callback) : [<code>queryCallback</code>](#queryCallback)
    * [~params](#PreparedStatement+bindParameter..params) : <code>Array</code>

<a name="PreparedStatement+bindParameter..typeStr"></a>

#### bindParameter~typeStr : <code>String</code>
**Kind**: inner property of [<code>bindParameter</code>](#PreparedStatement+bindParameter)  
<a name="PreparedStatement+bindParameter..callback"></a>

#### bindParameter~callback : [<code>queryCallback</code>](#queryCallback)
**Kind**: inner property of [<code>bindParameter</code>](#PreparedStatement+bindParameter)  
<a name="PreparedStatement+bindParameter..params"></a>

#### bindParameter~params : <code>Array</code>
**Kind**: inner property of [<code>bindParameter</code>](#PreparedStatement+bindParameter)  
<a name="PreparedStatement+cb_bindParamsToBeExec"></a>

### preparedStatement.cb\_bindParamsToBeExec(element, index) ⇒ <code>undefined</code>
ForEach Callback to go over each value-element, that is to be a prepared
statement variable. Supported prepared types are i = Integer (Number),
d = double (Number), s = String, b = Blob (Buffer)

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
**Throws**:

- <code>TypeError</code> Throws TypeError, if an element deviates from the
 expected prepare type or when an unknown type is encountered


| Param | Type | Description |
| --- | --- | --- |
| element | <code>Number</code> \| <code>String</code> \| <code>Buffer</code> | An value, that is to be used in the  prepared statement |
| index | <code>Number</code> | Index of the element in the array and in the this.parameterTypes array |

<a name="PreparedStatement+close"></a>

### preparedStatement.close(callback) ⇒ <code>undefined</code>
Closes the prepared statement
Alias of PreparedStatement.deallocate()

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
**Throws**:

- <code>TypeError</code> Throws TypeError if the argument is not a function


| Param | Type | Description |
| --- | --- | --- |
| callback | [<code>queryCallback</code>](#queryCallback) | cb for the result |

<a name="PreparedStatement+deallocate"></a>

### preparedStatement.deallocate(callback) ⇒ <code>undefined</code>
Closes the prepared statement and removes reference in and to the parrent
connection

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
**Throws**:

- <code>TypeError</code> Throws TypeError if the argument is not a function


| Param | Type | Description |
| --- | --- | --- |
| callback | [<code>queryCallback</code>](#queryCallback) | cb vor the result |

<a name="PreparedStatement+defineParameterTypes"></a>

### preparedStatement.defineParameterTypes(typeStr) ⇒ <code>undefined</code>
Set the type of parameters, that are accepted for this prepared statement

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
**Throws**:

- <code>TypeError</code> Throws TypeError if argument is not a string or a prepare
 Type is unknown


| Param | Type | Description |
| --- | --- | --- |
| typeStr | <code>String</code> | A string in the format of accepted prepared types. |

**Example**  
```js
typStr = 'ssiidb'
```

* [.defineParameterTypes(typeStr)](#PreparedStatement+defineParameterTypes) ⇒ <code>undefined</code>
    * [~prepTypes](#PreparedStatement+defineParameterTypes..prepTypes) : <code>Array</code>
    * [~i](#PreparedStatement+defineParameterTypes..i) : <code>Number</code>
    * [~iLen](#PreparedStatement+defineParameterTypes..iLen) : <code>Number</code>

<a name="PreparedStatement+defineParameterTypes..prepTypes"></a>

#### defineParameterTypes~prepTypes : <code>Array</code>
**Kind**: inner property of [<code>defineParameterTypes</code>](#PreparedStatement+defineParameterTypes)  
<a name="PreparedStatement+defineParameterTypes..i"></a>

#### defineParameterTypes~i : <code>Number</code>
**Kind**: inner property of [<code>defineParameterTypes</code>](#PreparedStatement+defineParameterTypes)  
<a name="PreparedStatement+defineParameterTypes..iLen"></a>

#### defineParameterTypes~iLen : <code>Number</code>
**Kind**: inner property of [<code>defineParameterTypes</code>](#PreparedStatement+defineParameterTypes)  
<a name="PreparedStatement+execute"></a>

### preparedStatement.execute(callback) ⇒ <code>undefined</code>
Execute the prepared statement with the currently bound variables

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  

| Param | Type | Description |
| --- | --- | --- |
| callback | [<code>queryCallback</code>](#queryCallback) | cb to recieve the result of the statement |

<a name="PreparedStatement+prepare"></a>

### preparedStatement.prepare(sqlStr, callback) ⇒ <code>undefined</code>
Send the SQL-statement to be prepared to the server

**Kind**: instance method of [<code>PreparedStatement</code>](#PreparedStatement)  
**Throws**:

- <code>TypeError</code> Throws TypeError if the arguments are not of the expected
 types


| Param | Type | Description |
| --- | --- | --- |
| sqlStr | <code>String</code> | String that contains the to-be-prepared SQL statement |
| callback | [<code>queryCallback</code>](#queryCallback) | Cb for the result of the operation |

<a name="queryCallback"></a>

## queryCallback : <code>function</code>
The queryCallback Function is supplied to the callback in
connection.query(sql, callback) to get the result of a query

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>error</code> | of the operation. null, if no error |
| results | <code>Array</code> | Resultset of the query, as array of row-objects |
| fields | <code>Array</code> | An Array of Fields, if applicable |

<a name="forEachCallback"></a>

## forEachCallback : <code>function</code>
Callback to use in an array.forEach() call

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>\*</code> | Current element of the array |
| index | <code>Number</code> | Index of the element in the array |
| arr | <code>Array</code> | The array by refernce |

