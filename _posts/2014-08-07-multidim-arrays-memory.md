---
layout: post
title: Optimising Java multidimensional arrays memory usage
date: 2014-08-07 00:02
categories: java C# memory
---
Recently, our team had to use COM interop from Java. We chose [COM4J](https://github.com/kohsuke/com4j) library. Unfortunately, it did not support multidimensional SAFEARRAY's that were used in interfaces of our COM components. A colleague of mine implemented this support in COM4J and we observed one funny and edifying case I want to describe.

*The content that follows is Java specific, no knowledge of COM is required.*

We had to pass data to COM component as 2D arrays of special form:

ParamName|ParamValue
---------|----------
Param1	 | Value1
Param2	 | Value2
...		   | ...

So it's like dictionary, first column stores names of parameters, second stores values. There are always two columns and arbitrary (often quite large) number of parameter names (rows). Each such matrix represents one business object and there were hundred thousands of them in our app.

In Java it looked this way:

```java
final int nParams = 1000;
Object[][] inputData = new Object[nParams][2];
```

So I wrote the same code passing such tables to COM in .NET and Java and noticed Java takes much more memory, failing out of heap.

But when we started to pass transposed matrix from Java, memory usage got back to normal (JNI part of COM4J mapper had to be modified, so that it still passes non-transposed matrix that our COM expects):

```java
final int nParams = 1000;
Object[][] inputData = new Object[2][nParams];
```

## Why is this so?

Now let me explain this effect. Java does not have proper multidimensional arrays. What I mean by *proper* are ones that are memory and CPU effective (remember, data laying next to each other in memory also improves CPU performance due to cache effectiveness).

A 2D array in Java is array of arrays, alternative name is jagged array:

```java
final int nRows = 1000;
final int nCols = 1000;
int[][] arrIntJagged = new int[nRows][];
for (int i=0;i<nRows;i++) {
	arrIntJagged[i] = new int[nCols];
}
```


So let's get back to my original transpoed and non-transposed Java arrays.

### Case 1. Many rows, few columns
In first case I had

```java
Object[1000][2]
```

Effectively these are 1000 arrays of size 2 each.
Object[2] takes (without sizes of actual Objects stored inside the array):

* 4 bytes for length
* 8 bytes for JVM structures
* array of 2 4-bytes pointers to underlying Objects. Note that even on 64-bit systems heaps of size less than 32GB store pointers as 4 bytes due to [Compressed OOPs](https://wikis.oracle.com/display/HotSpotInternals/CompressedOops)
* We have 20 bytes so far, they are padded to 24 bytes so that it is aligned on 8 byte boundary as required by JVM
* 1000 such obects take 24 000 bytes

Now take into account array of first dimension, [1000]:

* 4 bytes for length
* 8 bytes for JVM structures
* array of 1000 4-byte pointers to lower-dimension arrays that are described above
* We have size (4 + 8 + 1000*4)=4 012 so far. It's all padded to 4 016 to align on 8 bytes boundary.

So total is 24 000 + 4 016 = 28 016 bytes.

### Case 2. Few rows, many columns

In another, more optimal case, I had

```java
Object[2][1000]
```

Let's see why it is more memory effective:

* Object[1000] takes 4 016 bytes (again, see above). We have two of them, so 8 032 bytes.
* Object[2] takes 24 bytes.


So total is 8 032 + 24 = 8 056 bytes.

*That is 28 016 / 8 056 ~ 3.48x memory efficiency just by storing transposed matrix!*
The more non-square your matrix is, the higher the ratio will be. Note this does not take into account size taken by Object's that are in the matrix, if we do account for them, the ration will be less impressive, but still pronounced.

## How is it in C#?

In C# there are two types of multidimensional arrays:

```csharp
const int nRows = 1000;
const int nCols = 1000;

//memory and CPU effective array
int[,] arrInt = new int[nRows,nCols];

//jagged array, like in Java
int[][] arrIntJagged = new int[nRows];
for (int i=0;i<nRows;i++) {
	arrInt[i] = new int[nCols];
}
```
In case of non-jagged array, compiler knows length of each row (and widths are not changing from row to row) so it can store all the values consecutively in one-dimensional array and address element of i'th row and j'th column as (i*width+j) element of underlying array.

This gives better data locality (more chance for the data to get to CPU cache) and small storage requirements (nCols*nRows*sizeof(element)). On the other hand, it makes it impossible for each row to have varying length.

## Can Java have non-jagged arrays?

Yes, fortunately there are 3rd party libraries like [Colt](https://dst.lbl.gov/ACSSoftware/colt/api/cern/colt/matrix/package-summary.html#Overview) that provide abstractions for Double and Object based matrices that are stored as one continuous block in memory and addressed as (i*width+j) approach. So if you don't want bothering with transposed matrices as described above, just add Colt dependency to your app.

But if you plan to use matrices seriously, consider reading this useful [performance benchmark of different Java matrix libraries](https://code.google.com/p/java-matrix-benchmark/wiki/RuntimeCorei7v2600_2013_10), Colt is not necessarily the fastest of them.

## Summary

* If you have to store multidimensional matrices in Java, study their typical number of rows and columns. If number of rows is significantly higher than number of columns, store the matrices in transposed form and access it with reverse order of indices. That would allow to save memory significantly.
* Alternatively, there is [Colt](https://dst.lbl.gov/ACSSoftware/colt/api/cern/colt/matrix/package-summary.html#Overview) library for storing multidimensional matrices continuously. Others are available too.
* C# is more effective for multidimensional arrays than pure Java and in places is better suited for COM interop as both are Microsoft technologies and existing Java interop libraries have deficiencies (see bugs in COM4J tracker)
