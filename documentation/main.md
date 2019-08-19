## Functions

<dl>
<dt><a href="#createConnection">createConnection(config)</a> ⇒ <code>Connection</code></dt>
<dd><p>Create a new Connection instance.</p>
</dd>
<dt><a href="#createPool">createPool(config)</a> ⇒ <code>Pool</code></dt>
<dd><p>Create a new Pool instance.</p>
</dd>
<dt><a href="#createPoolCluster">createPoolCluster([config])</a> ⇒ <code>PoolCluster</code></dt>
<dd><p>Create a new PoolCluster instance.</p>
</dd>
<dt><a href="#createQuery">createQuery(sql, [values], [callback])</a> ⇒ <code>Query</code></dt>
<dd><p>Create a new Query instance.</p>
</dd>
<dt><a href="#escape">escape(value, [stringifyObjects], [timeZone])</a> ⇒ <code>string</code></dt>
<dd><p>Escape a value for SQL.</p>
</dd>
<dt><a href="#escapeId">escapeId(value, [forbidQualified])</a> ⇒ <code>string</code></dt>
<dd><p>Escape an identifier for SQL.</p>
</dd>
<dt><a href="#format">format(sql, [values], [stringifyObjects], [timeZone])</a> ⇒ <code>string</code></dt>
<dd><p>Format SQL and replacement values into a SQL string.</p>
</dd>
<dt><a href="#raw">raw(sql)</a> ⇒ <code>object</code></dt>
<dd><p>Wrap raw SQL strings from escape overriding.</p>
</dd>
</dl>

<a name="createConnection"></a>

## createConnection(config) ⇒ <code>Connection</code>
Create a new Connection instance.

**Kind**: global function  
**Returns**: <code>Connection</code> - A new MySQL connection  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> \| <code>string</code> | Configuration or connection string for new MySQL connection |

<a name="createPool"></a>

## createPool(config) ⇒ <code>Pool</code>
Create a new Pool instance.

**Kind**: global function  
**Returns**: <code>Pool</code> - A new MySQL pool  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> \| <code>string</code> | Configuration or connection string for new MySQL connections |

<a name="createPoolCluster"></a>

## createPoolCluster([config]) ⇒ <code>PoolCluster</code>
Create a new PoolCluster instance.

**Kind**: global function  
**Returns**: <code>PoolCluster</code> - New MySQL pool cluster  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>object</code> | Configuration for pool cluster |

<a name="createQuery"></a>

## createQuery(sql, [values], [callback]) ⇒ <code>Query</code>
Create a new Query instance.

**Kind**: global function  
**Returns**: <code>Query</code> - New query object  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| sql | <code>string</code> | The SQL for the query |
| [values] | <code>array</code> | Any values to insert into placeholders in sql |
| [callback] | <code>function</code> | The callback to use when query is complete |

<a name="escape"></a>

## escape(value, [stringifyObjects], [timeZone]) ⇒ <code>string</code>
Escape a value for SQL.

**Kind**: global function  
**Returns**: <code>string</code> - Escaped string value  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>\*</code> |  | The value to escape |
| [stringifyObjects] | <code>boolean</code> | <code>false</code> | Setting if objects should be stringified |
| [timeZone] | <code>string</code> | <code>&quot;local&quot;</code> | Setting for time zone to use for Date conversion |

<a name="escapeId"></a>

## escapeId(value, [forbidQualified]) ⇒ <code>string</code>
Escape an identifier for SQL.

**Kind**: global function  
**Returns**: <code>string</code> - Escaped string value  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>\*</code> |  | The value to escape |
| [forbidQualified] | <code>boolean</code> | <code>false</code> | Setting to treat '.' as part of identifier |

<a name="format"></a>

## format(sql, [values], [stringifyObjects], [timeZone]) ⇒ <code>string</code>
Format SQL and replacement values into a SQL string.

**Kind**: global function  
**Returns**: <code>string</code> - Formatted SQL string  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sql | <code>string</code> |  | The SQL for the query |
| [values] | <code>array</code> |  | Any values to insert into placeholders in sql |
| [stringifyObjects] | <code>boolean</code> | <code>false</code> | Setting if objects should be stringified |
| [timeZone] | <code>string</code> | <code>&quot;local&quot;</code> | Setting for time zone to use for Date conversion |

<a name="raw"></a>

## raw(sql) ⇒ <code>object</code>
Wrap raw SQL strings from escape overriding.

**Kind**: global function  
**Returns**: <code>object</code> - Wrapped object  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| sql | <code>string</code> | The raw SQL |

