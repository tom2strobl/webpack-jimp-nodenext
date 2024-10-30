# jimp true ESM webpack bundling issue reproduction

When trying to bundle jimp with webpack in a configuration that outputs full ESM, the following error is thrown:

```
node:util:290
    throw new ERR_INVALID_ARG_TYPE('superCtor.prototype',
          ^

TypeError [ERR_INVALID_ARG_TYPE]: The "superCtor.prototype" property must be of type object. Received undefined
    at Module.inherits (node:util:290:11)
    at ./node_modules/pngjs/lib/chunkstream.js (file:///Users/myname/dev/jimp-nodenext/main.bundle.dev.js:15981:6)
    at __webpack_require__ (file:///Users/myname/dev/jimp-nodenext/main.bundle.dev.js:45536:41)
    at ./node_modules/pngjs/lib/parser-async.js (file:///Users/myname/dev/jimp-nodenext/main.bundle.dev.js:17191:19)
    at __webpack_require__ (file:///Users/myname/dev/jimp-nodenext/main.bundle.dev.js:45536:41)
    at ./node_modules/pngjs/lib/png.js (file:///Users/myname/dev/jimp-nodenext/main.bundle.dev.js:17814:14)
    at __webpack_require__ (file:///Users/myname/dev/jimp-nodenext/main.bundle.dev.js:45536:41)
    at ./node_modules/@jimp/js-png/dist/esm/index.js (file:///Users/myname/dev/jimp-nodenext/main.bundle.dev.js:31862:63)
    at __webpack_require__ (file:///Users/myname/dev/jimp-nodenext/main.bundle.dev.js:45536:41)
    at ./node_modules/jimp/dist/esm/index.js (file:///Users/myname/dev/jimp-nodenext/main.bundle.dev.js:39797:70) {
  code: 'ERR_INVALID_ARG_TYPE'
}
```

The origin seems to be upstream in `pngjs` which is a dependency of `jimp`, to be exact in the `chunkstream.js` file:
https://github.com/pngjs/pngjs/blob/c565210c602527eb459f857eeb78183997482d5b/lib/chunkstream.js#L18

At first I thought maybe it's related to `util.inherits` being deprecated, but it seems to be a different issue as the same error is thrown in node 18.

The final ESM bundle has this in it:

```javascript
let Stream = __webpack_require__(/*! stream */ "stream");
util.inherits(ChunkStream, Stream);
```

util.inherits wants a Stream.prototype as the second argument, but the bundled code is passing Stream itself without a prototype: Manually logging `Stream.prototype` yields `undefined`, and logging `Stream` yields:

```
[Module: null prototype] {
  Duplex: [Function: Duplex] {
    fromWeb: [Function (anonymous)],
    toWeb: [Function (anonymous)],
    from: [Function (anonymous)]
  },
  PassThrough: [Function: PassThrough],
  Readable: [Function: Readable] {
    ReadableState: [Function: ReadableState],
    _fromList: [Function: fromList],
    from: [Function (anonymous)],
    fromWeb: [Function (anonymous)],
    toWeb: [Function (anonymous)],
    wrap: [Function (anonymous)]
  },
  ...
```

## Versions

node 20.17.0 (but also tested with v18.1.0 to see if it has to do with util.inherits deprecation)
webpack 5.95
jimp 1.6.0

## Steps to reproduce

```
npm install
npm run reproduce
```
