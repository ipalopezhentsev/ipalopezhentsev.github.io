---
layout: post
title: Thoughts on lambdas and review of "Java 8 Lambdas&#58; Pragmatic Functional Programming" by Richard Warburton
date: 2014-08-27 23:30
categories: java lambda functional review book
---
This may be surprising to many, but actually lambdas appeared in Lisp in 1959! Then something happened and for a long time they were obscure and absent from major languages like C, C++ and Java.
To C# credit, it was arguably the first 'large' and 'serious' platform that added and popularised lambda functions in 2007.

I know I'm not scientifically right and there were other languages having them but this is my gut feeling and a personal story - as originally a C# developer, since the time I started to use them in 2007/2008 I never looked back and was really uncomfortable using Java which did not have lambdas at the time. I saw the same trend with other .NET devs & libraries - in a couple of years lambdas and LINQ to Objects were used very widely, the feature has been well received.

The book that really helped me understand the philosophy of lambda functions and associated changes to core libraries was [LINQ Pocket Reference](http://www.albahari.com/PocketRef/) by [Joseph & Ben Albahari](http://www.albahari.com). It was short and to the point. It assumed you know C# and want to learn just the new bits. A couple of chapters - and you already were proficient in the topic.

When Java 8 came out this spring, I was very excited - now I could use the same techniques but on another, more mature platform! What I needed, was the equivalent of Albahari's book. And I found its equivalent in quality - [Java 8 Lambdas](http://shop.oreilly.com/product/0636920030713.do?cmp=af-prog-books-videos-product_cj_9781491900154_7470410) by [Richard Warburton](http://insightfullogic.com/blog/).

I could really stop here - the book is amazing. If you know Java and need to understand quickly what all the noise about Java 8 is, buy it. If you still need additional clarifications, read on.

Like each good educational book, it presents content in order of increasing complexity and gives something working quite soon. Already by the **Chapter 2** you will understand what lambdas are and the basic syntax.

But lambdas themselves are very simple, their true use comes only with the new core library features and that's what new concept of Stream is all about. It is described in **Chapter 3** that introduces notion of external vs internal iteration and lists problems of external one (it is what you are accustomed to while writing procedural code, numerous nested ```for``` loops that get in the way of business logic). Finally, it gives the solution in the shape of Streams. They help to hide the iterations under meaningful business operations. There you'll see what the real use of lambdas is.

**Chapters 4 and 5** finish teaching you the core lambdas, with stuff like Optional and writing a custom collector for operation on Stream's.

**Chapter 6** introduces parallel processing and shows how a change of several symbols can transform your single threaded code to parallel one. Just one word of caution: in my tests, transforming certain CPU-bound procedural code to use parallel streams didn't actually speed up anything at all - the code actually became slower! So pay attention to this and benchmark if you are getting any benefit. From my practice, I got much better parallelisation results from the equivalent feature of .NET (Parallel LINQ). Actually, there is an article that looks in detail why parallel Stream processing in Java is problematic - [A Java™ Fork-Join Calamity](http://coopsoft.com/ar/CalamityArticle.html).

**Chapter 8** shows how design pattern implementations become easier with Java 8. Also it introduces Behavior Driven Development (BDD) - that's what I like about this book, to illustrate various points it often introduces  you to unrelated concepts that widen your horizons. Also there is an example of how to create your mini-DSL (Domain Specific Language) in the shape of Fluent API.

The chapter finishes with the description of SOLID principles and how Java 8 helps to uphold them.

**Chapter 9** introduces continuations (Completable Futures) and how they are improved in Java 8 with lambdas. Then it goes to non-blocking I/O and reactive programming (extension of completable futures to streams of events instead of single event). To fully knock you down, it introduces Vert.x, a library that can help you write asynchronous network applications.

**All in all, the book is a very gripping read that is very effective in teaching you. Highly recommended!**

If you would like to support this blog, please buy the book on Amazon using the link below. Thanks!

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=httpipalopezh-20&marketplace=amazon&region=US&placement=1449370772&asins=1449370772&linkId=JKKFTBSQZQMTJFKE&show_border=true&link_opens_in_new_window=true">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=httpipalopezh-20&marketplace=amazon&region=US&placement=0596519249&asins=0596519249&linkId=3IZVU3XR65IEZEYB&show_border=true&link_opens_in_new_window=true">
</iframe>
