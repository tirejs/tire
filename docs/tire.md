# Tire

Tire is a lightweight JavaScript library for modern browsers. The syntax is inspired from jQuery.

Tire is under development right now and have no stable version.

## Why did we create Tire?

Well, why would you load in jQuery when you don't use it all? It's just a uncesseary kilobytes you load to do simple stuff like `addClass` or `hide`. Tire methods names is the same as for jQuery, people is experience with them and why replace good method names? Tire does not support all the method jQuery.

## Browser support

* Chrome
* Safari 4
* Internet Explorer 8
* Firefox 3.5
* Opera 10

### Older browsers

Tire may work in older browsers but is not tested in older than the above.


## Selectors

```javascript
$('#foo') // returns the element with the id foo

$('.bar') // returns all elements with the class name bar.

$('p') // returns all elements with the tag name p.
```

That's the basic selectors, Tire does support Sizzle if Sizzle exists. For more advanced selectors Tire does support `document.querySelectorAll`, but it will only work if the browser you are using support it.

```javascript
$('input[type=text]') // returns all input elements with the type text.

$('a, div') // returns all a and div elements;

$('ul li') // returns all li elements that are inside an ul tag.

$('ol > li') // the same as above but for ol tag.
```



