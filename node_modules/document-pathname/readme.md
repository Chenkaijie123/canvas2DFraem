# document-pathname [![Build Status](https://travis-ci.org/bendrucker/document-pathname.svg?branch=master)](https://travis-ci.org/bendrucker/document-pathname)

> Simple interface to `document.location.pathname` that returns `/` in Node


## Install

```
$ npm install --save document-pathname
```


## Usage

```js
var pathname = require('document-pathname')
pathname()
//=> '/the/path' in a browser
//=> '/' in node
```

## License

MIT © [Ben Drucker](http://bendrucker.me)
