---
layout: post
title: How to speed up hash search 6 times
date: 2014-11-21 23:00
categories: algorithms optimization
---
We often take for granted that hash tables provide best performance when doing search by arbitrary (e.g. string) key.

To query for a key in hash table is O(1) operation. But what does this actually mean? Only that there is some constant C that for any N number of elements in table number of operations needed to find value by 1 key is less than this C, i.e. it's independent of N and has a cap.

But different implementations of this O(1) search may have different values of this C, thus having quite different performance!

That is why it is possible to massively outperform standard hash tables for some specific key lookups. Let me describe one real life problem I sped up using this way.
