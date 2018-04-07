'use strict';

/*
 * lru cache
*/
var md5 = require('blueimp-md5');
var LRU = require('lru-cache');

module.exports = function (params) {
	var options = {
		max: 300,
		length: function length(n, key) {
			return n * 2 + key.length;
		},
		dispose: function dispose(key, value) {},
		maxAge: 24 * 60 * 60 * 1000
	};

	options = _.merge(options, params);
	var cache = LRU(options);

	return {
		setOptions: function setOptions(props) {
			var opts = _.merge(options, props);
			cache = LRU(opts);
		},
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
		ifid: function ifid(key, callback) {
			if (typeof key == 'string') {
				var tmp = cache.has(md5(key));
				return tmp ? tmp : function () {
					return typeof callback == 'function' ? callback() : undefined;
				}();
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
};
//# sourceMappingURL=../../maps/fkpcore/modules/cache.js.map
