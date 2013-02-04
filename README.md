Tire [![Build Status](https://travis-ci.org/tirejs/tire.png?branch=master)](https://travis-ci.org/tirejs/tire)
========

Tire is a lightweight JavaScript library for modern browsers. The goal is to create a framework that's around 12-15kb minified and 5kb minified and gzipped. The syntax is inspired from jQuery. It is modular so you can extend it however you like, also replace our features with your own. 

Fixes for older browsers increase the file size and we don't want that. So if you like a library to support Internet Explorer 6 or 7, Tire isn't for you. 

That said, all features can probably be rewritten/extended to add support for old browsers. In that case, you have to create a fork of Tire and fix it yourself.

## Browser support 

* Chrome
* Safari 4.0.5
* Internet Explorer 8
* Firefox 3.5
* Opera 10

#### Older browsers

Tire may work in older browsers but is not tested in older than the above.

## Build

```sh
npm install -g grunt
make
```

On Windows
  
```sh
npm install -g grunt
grunt.cmd
```

## Test

Install `connect` via `npm` and start the server. This will create a local server (on port 3000) so the ajax tests don't failes.
Be sure to build tire first or all tests will fail!

```sh
npm install
node server.js
```
  
## Contribute

Everyone is welcome to contribute with patches, bug-fixes and new features

1. create an [issue](https://github.com/tirejs/tire/issues) on github so the community can comment on your idea
2. fork `tire` in github
3. create a new branch `git checkout -b my_branch`
4. create tests for the changes you made
5. make sure you pass both existing and newly inserted tests
6. commit your changes
7. push to your branch `git push origin my_branch`
8. create a pull request
