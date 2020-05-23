---
layout: post
title: Beware of CLOBs in Oracle and JDBC
date: 2014-08-06 20:16
categories: java jdbc oracle
---
Recently I was working on a Java program that queries a large Oracle database and pushes its contents to subscribers (that later publish it to downstream systems).

First I made a slight but non-obvious error in database reading code and as result my code was 120x TIMES slower than it needs to be.

What was so foolish that would slow down database reading this way?

*It was CLOB's reading*.

Let me explain. One table I'm reading from stores values in so-called [Entity-Attribute-Value model](https://en.wikipedia.org/wiki/Entity–attribute–value_model). That is, instead of storing properties of one entity as type-safe columns inside one row in database table, you instead break down that information to several rows, each row having 'name of column', 'type of column' and 'value of column' columns. It is a common pattern and has its pros and cons which we are not interested in right now - I did not have control over database schema.

'Normal' storage (Param1 is NUMERIC, Param2 is VARCHAR):

  ID | Param1 | Param2
:---:|--------|--------
  1  |  123   | "Test"

Entity-attribute-storage, classic variant, content is equivalent to table above:

  ID | ParamName | Type      | Value
:---:|-----------|-----------|------------
  1  | "Param1"  | "INTEGER" |   "123"
  1  | "Param2"  | "STRING"  |   "Test"

Here, Value column has VARCHAR type in Oracle and client has to use info in ParamType column to understand how to parse this value. Primary key in this case becomes (ID, ParamName).

I had to work with modification of such storage approach, when there were several Value columns, each having its own type in Oracle. Supposedly, people creating it wanted to introduce more type safety. Note there is also CLOB type column.

  ID | ParamName | Type      | IntValue | StringValue | *CLOBValue*
:---:|-----------|-----------|----------|-------------|-------------
  1  | "Param1"  | "INTEGER" |   123	| NULL	  	  | NULL
  1  | "Param2"  | "STRING"  |   NULL   | "Test"	  | NULL
  1  | "Param3"  | "CLOB"    |   NULL	| NULL 		  | "Long CLOB field"

I had to write JDBC code that reads info from that table. I decided to condense all that value fields into one string field on the SQL side in order to save on network transfer volume. As I had Type column, I would have all the info on client to parse string value. As common denominator in this example is CLOB column, I decided to convert everything to CLOB before sending to client. I realised it would bring some non-optimality like 10-20% but I definitely did not expect it to be _120x_!

Here's the SQL query I was using:

```sql
SELECT  ID, ParamName, Type,
    CASE
        WHEN Type='INTEGER'
            THEN TO_CLOB(CAST(IntValue AS VARCHAR))
        WHEN Type='STRING'
            THEN TO_CLOB(StringValue)
        WHEN Type='CLOB'
            THEN CLOBValue
    END AS Value
FROM TABLE t
```
Then JDBC code was reading CLOBValue from result set, turning it to string and parsing according to Type column.

It was abysmally slow. It seems CLOB values are very heavyweight and should really be processed as special case. I had to change it in this way:

```sql
SELECT  ID, ParamName, Type,
    CASE
        WHEN Type='INTEGER'
            THEN CAST(IntValue AS VARCHAR)
        WHEN Type='STRING'
            THEN StringValue
        WHEN Type='CLOB'
            THEN NULL
    END AS StringValue,
    CASE
        WHEN Type='CLOB'
            THEN CLOBValue
        ELSE NULL
    END AS CLOBValue,
FROM TABLE t
```
So Java code would have to read Type column and then either read from StringValue or from CLOBValue column. This allowed to hide rare cases of CLOBs and improve overall reading speed by 120 times.

I used Java 8, Oracle 11 and native Oracle JDBC driver.

## Summary
Always treat CLOB columns as special case. They are very ineffective for reading (well, probably just for everything).
