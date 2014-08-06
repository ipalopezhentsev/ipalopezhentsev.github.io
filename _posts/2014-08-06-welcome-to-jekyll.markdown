---
layout: post
title:  "Slow handling of CLOB data in Oracle/JDBC"
date:   2014-08-06 15:54:38
categories: java jdbc
---

{% highlight java %}
@Test
public void testMemoryUsage() {
    final int n = 300_000_000;
    int[] arr = new int[n];
    for (int i = 0; i < n; i++) {
        arr[i] = i;
    }
    Integer sum = Arrays.stream(arr).reduce(0, Integer::sum);
    System.out.println(sum);
}
{% endhighlight %}

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

Check out the [Jekyll docs][jekyll] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll's GitHub repo][jekyll-gh].

[jekyll-gh]: https://github.com/jekyll/jekyll
[jekyll]:    http://jekyllrb.com
