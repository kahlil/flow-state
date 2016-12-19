"use strict";
require('es6-shim');
require('rxjs/add/operator/filter');
require('rxjs/add/operator/map');
require('rxjs/add/operator/scan');
require('rxjs/add/operator/publishReplay');
require('rxjs/add/operator/combineLatest');
require('rxjs/add/operator/do');
require('rxjs/add/observable/of');
var oddstream_1 = require('./oddstream');
var oddstream_2 = require('./oddstream');
exports.Oddstream = oddstream_2.Oddstream;
function createOddstream() {
    return new oddstream_1.Oddstream();
}
exports.createOddstream = createOddstream;
//# sourceMappingURL=index.js.map