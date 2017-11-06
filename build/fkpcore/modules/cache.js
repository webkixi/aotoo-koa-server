'use strict';

/*
 * lru cache
*/
var md5 = require('blueimp-md5');
var LRU = require('lru-cache'),
    options = { max: 300,
	length: function length(n, key) {
		return n * 2 + key.length;
	},
	dispose: function dispose(key, value) {},
	maxAge: 24 * 60 * 60 * 1000 };

if (typeof Configs != 'undefined') {
	options = Aotoo.merge(options, Configs.cache);
}
var cache = LRU(options);

var cac = {
	has: function has(key) {
		if (_.isString(key)) {
			key = md5(key);
		}
		return cache.has(key);
	},
	get: function get(key) {
		if (_.isString(key)) {
			key = md5(key);
		}
		return cache.get(key);
	},
	set: function set(key, value, maxAge) {
		if (_.isString(key)) {
			key = md5(key);
		}
		return cache.set(key, value, maxAge);
	},
	peek: function peek(key) {
		if (_.isString(key)) {
			key = md5(key);
		}
		return cache.peek(key);
	},
	del: function del(key) {
		if (_.isString(key)) {
			key = md5(key);
		}
		return cache.del(key);
	},
	ifid: function ifid(id, callback) {
		if (cac.has(id)) {
			return cac.get(id);
		} else {
			if (typeof callback === 'function') {
				return callback();
			}
		}
	},
	reset: cache.reset,
	forEach: cache.forEach,
	rforEach: cache.rforEach,
	keys: cache.keys,
	values: cache.values,
	length: cache.length,
	itemCount: cache.itemCount,
	dump: cache.dump,
	load: cache.load,
	prune: cache.prune
};

module.exports = cac;
//# sourceMappingURL=../../maps/fkpcore/modules/cache.js.map
