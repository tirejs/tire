# Tire

Tire is a lightweight JavaScript library for modern browsers. The syntax is inspired from jQuery. The goal of Tire is to create a small library for modern browsers (also work in older that isn't to bad) with a minified size of 10kb and a gziped size under 5kb (right now it's under 4kb).

Tire is under development right now and have no stable version.

Tire will use SemVer, please visist [http://semver.org/](http://semver.org/).

## Browser support 

* Chrome
* Safari 4
* Internet Explorer 8
* Firefox 3.5
* Opera 10

Mobile browsers will be added later.

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

1. create an [issue](https://github.com/Frozzare/tire/issues) on github so the community can comment on your idea
2. fork `tire` in github
3. create a new branch `git checkout -b my_branch`
4. create tests for the changes you made
5. make sure you pass both existing and newly inserted tests
6. commit your changes
7. push to your branch `git push origin my_branch`
8. create a pull request