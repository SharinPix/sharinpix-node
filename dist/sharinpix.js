(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["sharinpix"] = factory();
	else
		root["sharinpix"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var Promise, Sharinpix, _options, _singleton, async, fastCsv, jsrsasign, path, superagent, url;

	jsrsasign = __webpack_require__(7);

	superagent = __webpack_require__(13);

	url = __webpack_require__(19);

	path = __webpack_require__(25);

	async = __webpack_require__(26);

	fastCsv = __webpack_require__(28);

	Promise = __webpack_require__(71);

	Sharinpix = function () {
	  function Sharinpix(options1) {
	    this.options = options1;
	  }

	  Sharinpix.prototype.api_url = function (path) {
	    return "" + this.options.endpoint + path;
	  };

	  Sharinpix.prototype.post = function (endpoint, body, claims) {
	    if (claims == null) {
	      claims = {
	        admin: true
	      };
	    }
	    return superagent.post(this.api_url(endpoint)).set('Authorization', "Token token=\"" + this.token(claims) + "\"").set('Accept', 'application/json').send(body).then(function (res) {
	      return res.body;
	    });
	  };

	  Sharinpix.prototype.get = function (endpoint, claims) {
	    if (claims == null) {
	      claims = {
	        admin: true
	      };
	    }
	    return superagent.get(this.api_url(endpoint)).set('Authorization', "Token token=\"" + this.token(claims) + "\"").set('Accept', 'application/json').then(function (res) {
	      return res.body;
	    });
	  };

	  Sharinpix.prototype["delete"] = function (endpoint, claims) {
	    if (claims == null) {
	      claims = {
	        admin: true
	      };
	    }
	    return new Promise(function (_this) {
	      return function (resolve, reject) {
	        return superagent["delete"](_this.api_url(endpoint)).set('Authorization', "Token token=\"" + _this.token(claims) + "\"").set('Accept', 'application/json').end(function (res) {
	          if (res.status === 404 || res.status === 201) {
	            resolve(true);
	          }
	          return reject(false, res);
	        });
	      };
	    }(this));
	  };

	  Sharinpix.prototype.token = function (claims) {
	    var token;
	    claims["iss"] = this.options.id;
	    token = jsrsasign.jws.JWS.sign(null, {
	      alg: "HS256",
	      cty: "JWT"
	    }, JSON.stringify(claims), {
	      rstr: this.options.secret
	    });
	    return token;
	  };

	  Sharinpix.prototype.image_delete = function (image_id) {
	    return this["delete"]("/images/" + image_id);
	  };

	  Sharinpix.prototype.upload = function (image, album_id, metadatas) {
	    var claims;
	    if (metadatas == null) {
	      metadatas = {};
	    }
	    claims = {
	      "abilities": {}
	    };
	    claims["abilities"][album_id] = {
	      "Access": {
	        see: true,
	        image_upload: true
	      }
	    };
	    return this.get("/albums/" + album_id, claims).then(function (album) {
	      var key, ref, request, value;
	      request = superagent.post(album.upload_form.url);
	      ref = album.upload_form.params;
	      for (key in ref) {
	        value = ref[key];
	        request.field(key, value);
	      }
	      if (typeof File !== "undefined" && File !== null && image instanceof File) {
	        request.field('file', image);
	      } else {
	        request.attach('file', image);
	      }
	      return request.then(function (res) {
	        return res.body;
	      });
	    }).then(function (_this) {
	      return function (cloudinary) {
	        return _this.post("/albums/" + album_id + "/images", {
	          cloudinary: cloudinary,
	          album_id: album_id,
	          metadatas: metadatas
	        }, claims).then(function (res) {
	          return res;
	        });
	      };
	    }(this));
	  };

	  Sharinpix.prototype["import"] = function (url, album_id, metadatas) {
	    if (metadatas == null) {
	      metadatas = {};
	    }
	    return this.post("/imports", {
	      import_type: 'url',
	      album_id: album_id,
	      url: url,
	      metadatas: metadatas
	    }, claims);
	  };

	  Sharinpix.prototype.multiupload = function (csv_string, multiupload_callback) {
	    var uploads;
	    uploads = [];
	    return fastCsv.fromString(csv_string).on('data', function (_this) {
	      return function (data) {
	        var album_id, file_path;
	        file_path = data[0];
	        album_id = data[1];
	        if (file_path && album_id) {
	          return uploads.push(async.reflect(function (callback) {
	            if (file_path.slice(0, 4) === 'http') {
	              return _this["import"](file_path, album_id).then(function (res) {
	                return callback(null, res);
	              })["catch"](function (err) {
	                return callback(err);
	              });
	            } else {
	              if (!path.isAbsolute(file_path)) {
	                file_path = path.join(csv_path, "../" + file_path);
	              }
	              return _this.upload(file_path, album_id).then(function (image) {
	                return callback(null, image);
	              })["catch"](function (err) {
	                return callback(err);
	              });
	            }
	          }));
	        }
	      };
	    }(this)).on('end', function () {
	      return async.parallelLimit(uploads, 2, multiupload_callback);
	    });
	  };

	  return Sharinpix;
	}();

	_options = void 0;

	Sharinpix.configure = function (options) {
	  var auth, infos, k, v;
	  if (_options == null) {
	    _options = {};
	    if (typeof process !== "undefined" && process !== null && process.env != null && process.env['SHARINPIX_URL'] != null) {
	      Sharinpix.configure(process.env['SHARINPIX_URL']);
	    }
	  }
	  if (options != null) {
	    if (typeof options === 'string') {
	      infos = url.parse(options);
	      auth = infos.auth.split(':');
	      _options.endpoint = "https://" + infos.hostname + infos.pathname;
	      _options.id = auth[0];
	      _options.secret = auth[1];
	    } else if (options instanceof Object) {
	      for (k in options) {
	        v = options[k];
	        _options[k] = v;
	      }
	    }
	  }
	  return _options;
	};

	_singleton = void 0;

	Sharinpix.get_instance = function () {
	  if (_singleton != null) {
	    return _singleton;
	  }
	  return _singleton = new Sharinpix(Sharinpix.configure());
	};

	Sharinpix["import"] = function () {
	  var ref;
	  return (ref = Sharinpix.get_instance())["import"].apply(ref, arguments);
	};

	Sharinpix.upload = function () {
	  var ref;
	  return (ref = Sharinpix.get_instance()).upload.apply(ref, arguments);
	};

	Sharinpix.multiupload = function () {
	  var ref;
	  return (ref = Sharinpix.get_instance()).multiupload.apply(ref, arguments);
	};

	Sharinpix.image_delete = function () {
	  var ref;
	  return (ref = Sharinpix.get_instance()).image_delete.apply(ref, arguments);
	};

	module.exports = Sharinpix;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {
	var navigator = {};
	navigator.userAgent = false;

	var window = {};
	/*
	 * jsrsasign 5.0.12 (c) 2010-2016 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */

	/*
	yahoo-min.js
	Copyright (c) 2011, Yahoo! Inc. All rights reserved.
	Code licensed under the BSD License:
	http://developer.yahoo.com/yui/license.html
	version: 2.9.0
	*/
	if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}YAHOO.namespace=function(){var b=arguments,g=null,e,c,f;for(e=0;e<b.length;e=e+1){f=(""+b[e]).split(".");g=YAHOO;for(c=(f[0]=="YAHOO")?1:0;c<f.length;c=c+1){g[f[c]]=g[f[c]]||{};g=g[f[c]];}}return g;};YAHOO.log=function(d,a,c){var b=YAHOO.widget.Logger;if(b&&b.log){return b.log(d,a,c);}else{return false;}};YAHOO.register=function(a,f,e){var k=YAHOO.env.modules,c,j,h,g,d;if(!k[a]){k[a]={versions:[],builds:[]};}c=k[a];j=e.version;h=e.build;g=YAHOO.env.listeners;c.name=a;c.version=j;c.build=h;c.versions.push(j);c.builds.push(h);c.mainClass=f;for(d=0;d<g.length;d=d+1){g[d](c);}if(f){f.VERSION=j;f.BUILD=h;}else{YAHOO.log("mainClass is undefined for module "+a,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(a){return YAHOO.env.modules[a]||null;};YAHOO.env.parseUA=function(d){var e=function(i){var j=0;return parseFloat(i.replace(/\./g,function(){return(j++==1)?"":".";}));},h=navigator,g={ie:0,opera:0,gecko:0,webkit:0,chrome:0,mobile:null,air:0,ipad:0,iphone:0,ipod:0,ios:null,android:0,webos:0,caja:h&&h.cajaVersion,secure:false,os:null},c=d||(navigator&&navigator.userAgent),f=window&&window.location,b=f&&f.href,a;g.secure=b&&(b.toLowerCase().indexOf("https")===0);if(c){if((/windows|win32/i).test(c)){g.os="windows";}else{if((/macintosh/i).test(c)){g.os="macintosh";}else{if((/rhino/i).test(c)){g.os="rhino";}}}if((/KHTML/).test(c)){g.webkit=1;}a=c.match(/AppleWebKit\/([^\s]*)/);if(a&&a[1]){g.webkit=e(a[1]);if(/ Mobile\//.test(c)){g.mobile="Apple";a=c.match(/OS ([^\s]*)/);if(a&&a[1]){a=e(a[1].replace("_","."));}g.ios=a;g.ipad=g.ipod=g.iphone=0;a=c.match(/iPad|iPod|iPhone/);if(a&&a[0]){g[a[0].toLowerCase()]=g.ios;}}else{a=c.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/);if(a){g.mobile=a[0];}if(/webOS/.test(c)){g.mobile="WebOS";a=c.match(/webOS\/([^\s]*);/);if(a&&a[1]){g.webos=e(a[1]);}}if(/ Android/.test(c)){g.mobile="Android";a=c.match(/Android ([^\s]*);/);if(a&&a[1]){g.android=e(a[1]);}}}a=c.match(/Chrome\/([^\s]*)/);if(a&&a[1]){g.chrome=e(a[1]);}else{a=c.match(/AdobeAIR\/([^\s]*)/);if(a){g.air=a[0];}}}if(!g.webkit){a=c.match(/Opera[\s\/]([^\s]*)/);if(a&&a[1]){g.opera=e(a[1]);a=c.match(/Version\/([^\s]*)/);if(a&&a[1]){g.opera=e(a[1]);}a=c.match(/Opera Mini[^;]*/);if(a){g.mobile=a[0];}}else{a=c.match(/MSIE\s([^;]*)/);if(a&&a[1]){g.ie=e(a[1]);}else{a=c.match(/Gecko\/([^\s]*)/);if(a){g.gecko=1;a=c.match(/rv:([^\s\)]*)/);if(a&&a[1]){g.gecko=e(a[1]);}}}}}}return g;};YAHOO.env.ua=YAHOO.env.parseUA();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var b=YAHOO_config.listener,a=YAHOO.env.listeners,d=true,c;if(b){for(c=0;c<a.length;c++){if(a[c]==b){d=false;break;}}if(d){a.push(b);}}}})();YAHOO.lang=YAHOO.lang||{};(function(){var f=YAHOO.lang,a=Object.prototype,c="[object Array]",h="[object Function]",i="[object Object]",b=[],g={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;","`":"&#x60;"},d=["toString","valueOf"],e={isArray:function(j){return a.toString.apply(j)===c;},isBoolean:function(j){return typeof j==="boolean";},isFunction:function(j){return(typeof j==="function")||a.toString.apply(j)===h;},isNull:function(j){return j===null;},isNumber:function(j){return typeof j==="number"&&isFinite(j);},isObject:function(j){return(j&&(typeof j==="object"||f.isFunction(j)))||false;},isString:function(j){return typeof j==="string";},isUndefined:function(j){return typeof j==="undefined";},_IEEnumFix:(YAHOO.env.ua.ie)?function(l,k){var j,n,m;for(j=0;j<d.length;j=j+1){n=d[j];m=k[n];if(f.isFunction(m)&&m!=a[n]){l[n]=m;}}}:function(){},escapeHTML:function(j){return j.replace(/[&<>"'\/`]/g,function(k){return g[k];});},extend:function(m,n,l){if(!n||!m){throw new Error("extend failed, please check that "+"all dependencies are included.");}var k=function(){},j;k.prototype=n.prototype;m.prototype=new k();m.prototype.constructor=m;m.superclass=n.prototype;if(n.prototype.constructor==a.constructor){n.prototype.constructor=n;}if(l){for(j in l){if(f.hasOwnProperty(l,j)){m.prototype[j]=l[j];}}f._IEEnumFix(m.prototype,l);}},augmentObject:function(n,m){if(!m||!n){throw new Error("Absorb failed, verify dependencies.");}var j=arguments,l,o,k=j[2];if(k&&k!==true){for(l=2;l<j.length;l=l+1){n[j[l]]=m[j[l]];}}else{for(o in m){if(k||!(o in n)){n[o]=m[o];}}f._IEEnumFix(n,m);}return n;},augmentProto:function(m,l){if(!l||!m){throw new Error("Augment failed, verify dependencies.");}var j=[m.prototype,l.prototype],k;for(k=2;k<arguments.length;k=k+1){j.push(arguments[k]);}f.augmentObject.apply(this,j);return m;},dump:function(j,p){var l,n,r=[],t="{...}",k="f(){...}",q=", ",m=" => ";if(!f.isObject(j)){return j+"";}else{if(j instanceof Date||("nodeType" in j&&"tagName" in j)){return j;}else{if(f.isFunction(j)){return k;}}}p=(f.isNumber(p))?p:3;if(f.isArray(j)){r.push("[");for(l=0,n=j.length;l<n;l=l+1){if(f.isObject(j[l])){r.push((p>0)?f.dump(j[l],p-1):t);}else{r.push(j[l]);}r.push(q);}if(r.length>1){r.pop();}r.push("]");}else{r.push("{");for(l in j){if(f.hasOwnProperty(j,l)){r.push(l+m);if(f.isObject(j[l])){r.push((p>0)?f.dump(j[l],p-1):t);}else{r.push(j[l]);}r.push(q);}}if(r.length>1){r.pop();}r.push("}");}return r.join("");},substitute:function(x,y,E,l){var D,C,B,G,t,u,F=[],p,z=x.length,A="dump",r=" ",q="{",m="}",n,w;for(;;){D=x.lastIndexOf(q,z);if(D<0){break;}C=x.indexOf(m,D);if(D+1>C){break;}p=x.substring(D+1,C);G=p;u=null;B=G.indexOf(r);if(B>-1){u=G.substring(B+1);G=G.substring(0,B);}t=y[G];if(E){t=E(G,t,u);}if(f.isObject(t)){if(f.isArray(t)){t=f.dump(t,parseInt(u,10));}else{u=u||"";n=u.indexOf(A);if(n>-1){u=u.substring(4);}w=t.toString();if(w===i||n>-1){t=f.dump(t,parseInt(u,10));}else{t=w;}}}else{if(!f.isString(t)&&!f.isNumber(t)){t="~-"+F.length+"-~";F[F.length]=p;}}x=x.substring(0,D)+t+x.substring(C+1);if(l===false){z=D-1;}}for(D=F.length-1;D>=0;D=D-1){x=x.replace(new RegExp("~-"+D+"-~"),"{"+F[D]+"}","g");}return x;},trim:function(j){try{return j.replace(/^\s+|\s+$/g,"");}catch(k){return j;
	}},merge:function(){var n={},k=arguments,j=k.length,m;for(m=0;m<j;m=m+1){f.augmentObject(n,k[m],true);}return n;},later:function(t,k,u,n,p){t=t||0;k=k||{};var l=u,s=n,q,j;if(f.isString(u)){l=k[u];}if(!l){throw new TypeError("method undefined");}if(!f.isUndefined(n)&&!f.isArray(s)){s=[n];}q=function(){l.apply(k,s||b);};j=(p)?setInterval(q,t):setTimeout(q,t);return{interval:p,cancel:function(){if(this.interval){clearInterval(j);}else{clearTimeout(j);}}};},isValue:function(j){return(f.isObject(j)||f.isString(j)||f.isNumber(j)||f.isBoolean(j));}};f.hasOwnProperty=(a.hasOwnProperty)?function(j,k){return j&&j.hasOwnProperty&&j.hasOwnProperty(k);}:function(j,k){return !f.isUndefined(j[k])&&j.constructor.prototype[k]!==j[k];};e.augmentObject(f,e,true);YAHOO.util.Lang=f;f.augment=f.augmentProto;YAHOO.augment=f.augmentProto;YAHOO.extend=f.extend;})();YAHOO.register("yahoo",YAHOO,{version:"2.9.0",build:"2800"});

	/*! CryptoJS v3.1.2 core-fix.js
	 * code.google.com/p/crypto-js
	 * (c) 2009-2013 by Jeff Mott. All rights reserved.
	 * code.google.com/p/crypto-js/wiki/License
	 * THIS IS FIX of 'core.js' to fix Hmac issue.
	 * https://code.google.com/p/crypto-js/issues/detail?id=84
	 * https://crypto-js.googlecode.com/svn-history/r667/branches/3.x/src/core.js
	 */
	var CryptoJS=CryptoJS||(function(e,g){var a={};var b=a.lib={};var j=b.Base=(function(){function n(){}return{extend:function(p){n.prototype=this;var o=new n();if(p){o.mixIn(p)}if(!o.hasOwnProperty("init")){o.init=function(){o.$super.init.apply(this,arguments)}}o.init.prototype=o;o.$super=this;return o},create:function(){var o=this.extend();o.init.apply(o,arguments);return o},init:function(){},mixIn:function(p){for(var o in p){if(p.hasOwnProperty(o)){this[o]=p[o]}}if(p.hasOwnProperty("toString")){this.toString=p.toString}},clone:function(){return this.init.prototype.extend(this)}}}());var l=b.WordArray=j.extend({init:function(o,n){o=this.words=o||[];if(n!=g){this.sigBytes=n}else{this.sigBytes=o.length*4}},toString:function(n){return(n||h).stringify(this)},concat:function(t){var q=this.words;var p=t.words;var n=this.sigBytes;var s=t.sigBytes;this.clamp();if(n%4){for(var r=0;r<s;r++){var o=(p[r>>>2]>>>(24-(r%4)*8))&255;q[(n+r)>>>2]|=o<<(24-((n+r)%4)*8)}}else{for(var r=0;r<s;r+=4){q[(n+r)>>>2]=p[r>>>2]}}this.sigBytes+=s;return this},clamp:function(){var o=this.words;var n=this.sigBytes;o[n>>>2]&=4294967295<<(32-(n%4)*8);o.length=e.ceil(n/4)},clone:function(){var n=j.clone.call(this);n.words=this.words.slice(0);return n},random:function(p){var o=[];for(var n=0;n<p;n+=4){o.push((e.random()*4294967296)|0)}return new l.init(o,p)}});var m=a.enc={};var h=m.Hex={stringify:function(p){var r=p.words;var o=p.sigBytes;var q=[];for(var n=0;n<o;n++){var s=(r[n>>>2]>>>(24-(n%4)*8))&255;q.push((s>>>4).toString(16));q.push((s&15).toString(16))}return q.join("")},parse:function(p){var n=p.length;var q=[];for(var o=0;o<n;o+=2){q[o>>>3]|=parseInt(p.substr(o,2),16)<<(24-(o%8)*4)}return new l.init(q,n/2)}};var d=m.Latin1={stringify:function(q){var r=q.words;var p=q.sigBytes;var n=[];for(var o=0;o<p;o++){var s=(r[o>>>2]>>>(24-(o%4)*8))&255;n.push(String.fromCharCode(s))}return n.join("")},parse:function(p){var n=p.length;var q=[];for(var o=0;o<n;o++){q[o>>>2]|=(p.charCodeAt(o)&255)<<(24-(o%4)*8)}return new l.init(q,n)}};var c=m.Utf8={stringify:function(n){try{return decodeURIComponent(escape(d.stringify(n)))}catch(o){throw new Error("Malformed UTF-8 data")}},parse:function(n){return d.parse(unescape(encodeURIComponent(n)))}};var i=b.BufferedBlockAlgorithm=j.extend({reset:function(){this._data=new l.init();this._nDataBytes=0},_append:function(n){if(typeof n=="string"){n=c.parse(n)}this._data.concat(n);this._nDataBytes+=n.sigBytes},_process:function(w){var q=this._data;var x=q.words;var n=q.sigBytes;var t=this.blockSize;var v=t*4;var u=n/v;if(w){u=e.ceil(u)}else{u=e.max((u|0)-this._minBufferSize,0)}var s=u*t;var r=e.min(s*4,n);if(s){for(var p=0;p<s;p+=t){this._doProcessBlock(x,p)}var o=x.splice(0,s);q.sigBytes-=r}return new l.init(o,r)},clone:function(){var n=j.clone.call(this);n._data=this._data.clone();return n},_minBufferSize:0});var f=b.Hasher=i.extend({cfg:j.extend(),init:function(n){this.cfg=this.cfg.extend(n);this.reset()},reset:function(){i.reset.call(this);this._doReset()},update:function(n){this._append(n);this._process();return this},finalize:function(n){if(n){this._append(n)}var o=this._doFinalize();return o},blockSize:512/32,_createHelper:function(n){return function(p,o){return new n.init(o).finalize(p)}},_createHmacHelper:function(n){return function(p,o){return new k.HMAC.init(n,o).finalize(p)}}});var k=a.algo={};return a}(Math));
	/*
	CryptoJS v3.1.2 x64-core-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(g){var a=CryptoJS,f=a.lib,e=f.Base,h=f.WordArray,a=a.x64={};a.Word=e.extend({init:function(b,c){this.high=b;this.low=c}});a.WordArray=e.extend({init:function(b,c){b=this.words=b||[];this.sigBytes=c!=g?c:8*b.length},toX32:function(){for(var b=this.words,c=b.length,a=[],d=0;d<c;d++){var e=b[d];a.push(e.high);a.push(e.low)}return h.create(a,this.sigBytes)},clone:function(){for(var b=e.clone.call(this),c=b.words=this.words.slice(0),a=c.length,d=0;d<a;d++)c[d]=c[d].clone();return b}})})();

	/*
	CryptoJS v3.1.2 cipher-core-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	CryptoJS.lib.Cipher||function(u){var g=CryptoJS,f=g.lib,k=f.Base,l=f.WordArray,q=f.BufferedBlockAlgorithm,r=g.enc.Base64,v=g.algo.EvpKDF,n=f.Cipher=q.extend({cfg:k.extend(),createEncryptor:function(a,b){return this.create(this._ENC_XFORM_MODE,a,b)},createDecryptor:function(a,b){return this.create(this._DEC_XFORM_MODE,a,b)},init:function(a,b,c){this.cfg=this.cfg.extend(c);this._xformMode=a;this._key=b;this.reset()},reset:function(){q.reset.call(this);this._doReset()},process:function(a){this._append(a);
	return this._process()},finalize:function(a){a&&this._append(a);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(a){return{encrypt:function(b,c,d){return("string"==typeof c?s:j).encrypt(a,b,c,d)},decrypt:function(b,c,d){return("string"==typeof c?s:j).decrypt(a,b,c,d)}}}});f.StreamCipher=n.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var m=g.mode={},t=function(a,b,c){var d=this._iv;d?this._iv=u:d=this._prevBlock;for(var e=
	0;e<c;e++)a[b+e]^=d[e]},h=(f.BlockCipherMode=k.extend({createEncryptor:function(a,b){return this.Encryptor.create(a,b)},createDecryptor:function(a,b){return this.Decryptor.create(a,b)},init:function(a,b){this._cipher=a;this._iv=b}})).extend();h.Encryptor=h.extend({processBlock:function(a,b){var c=this._cipher,d=c.blockSize;t.call(this,a,b,d);c.encryptBlock(a,b);this._prevBlock=a.slice(b,b+d)}});h.Decryptor=h.extend({processBlock:function(a,b){var c=this._cipher,d=c.blockSize,e=a.slice(b,b+d);c.decryptBlock(a,
	b);t.call(this,a,b,d);this._prevBlock=e}});m=m.CBC=h;h=(g.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,e=[],f=0;f<c;f+=4)e.push(d);c=l.create(e,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};f.BlockCipher=n.extend({cfg:n.cfg.extend({mode:m,padding:h}),reset:function(){n.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;
	this._mode=c.call(a,this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var p=f.CipherParams=k.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),m=(g.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;
	return(a?l.create([1398893684,1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=l.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return p.create({ciphertext:a,salt:c})}},j=f.SerializableCipher=k.extend({cfg:k.extend({format:m}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var e=a.createEncryptor(c,d);b=e.finalize(b);e=e.cfg;return p.create({ciphertext:b,key:c,iv:e.iv,algorithm:a,mode:e.mode,padding:e.padding,
	blockSize:a.blockSize,formatter:d.format})},decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),g=(g.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=l.random(8));a=v.create({keySize:b+c}).compute(a,d);c=l.create(a.words.slice(b),4*c);a.sigBytes=4*b;return p.create({key:a,iv:c,salt:d})}},s=f.PasswordBasedCipher=j.extend({cfg:j.cfg.extend({kdf:g}),encrypt:function(a,
	b,c,d){d=this.cfg.extend(d);c=d.kdf.execute(c,a.keySize,a.ivSize);d.iv=c.iv;a=j.encrypt.call(this,a,b,c.key,d);a.mixIn(c);return a},decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);c=d.kdf.execute(c,a.keySize,a.ivSize,b.salt);d.iv=c.iv;return j.decrypt.call(this,a,b,c.key,d)}})}();

	/*
	CryptoJS v3.1.2 aes-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(){for(var q=CryptoJS,x=q.lib.BlockCipher,r=q.algo,j=[],y=[],z=[],A=[],B=[],C=[],s=[],u=[],v=[],w=[],g=[],k=0;256>k;k++)g[k]=128>k?k<<1:k<<1^283;for(var n=0,l=0,k=0;256>k;k++){var f=l^l<<1^l<<2^l<<3^l<<4,f=f>>>8^f&255^99;j[n]=f;y[f]=n;var t=g[n],D=g[t],E=g[D],b=257*g[f]^16843008*f;z[n]=b<<24|b>>>8;A[n]=b<<16|b>>>16;B[n]=b<<8|b>>>24;C[n]=b;b=16843009*E^65537*D^257*t^16843008*n;s[f]=b<<24|b>>>8;u[f]=b<<16|b>>>16;v[f]=b<<8|b>>>24;w[f]=b;n?(n=t^g[g[g[E^t]]],l^=g[g[l]]):n=l=1}var F=[0,1,2,4,8,
	16,32,64,128,27,54],r=r.AES=x.extend({_doReset:function(){for(var c=this._key,e=c.words,a=c.sigBytes/4,c=4*((this._nRounds=a+6)+1),b=this._keySchedule=[],h=0;h<c;h++)if(h<a)b[h]=e[h];else{var d=b[h-1];h%a?6<a&&4==h%a&&(d=j[d>>>24]<<24|j[d>>>16&255]<<16|j[d>>>8&255]<<8|j[d&255]):(d=d<<8|d>>>24,d=j[d>>>24]<<24|j[d>>>16&255]<<16|j[d>>>8&255]<<8|j[d&255],d^=F[h/a|0]<<24);b[h]=b[h-a]^d}e=this._invKeySchedule=[];for(a=0;a<c;a++)h=c-a,d=a%4?b[h]:b[h-4],e[a]=4>a||4>=h?d:s[j[d>>>24]]^u[j[d>>>16&255]]^v[j[d>>>
	8&255]]^w[j[d&255]]},encryptBlock:function(c,e){this._doCryptBlock(c,e,this._keySchedule,z,A,B,C,j)},decryptBlock:function(c,e){var a=c[e+1];c[e+1]=c[e+3];c[e+3]=a;this._doCryptBlock(c,e,this._invKeySchedule,s,u,v,w,y);a=c[e+1];c[e+1]=c[e+3];c[e+3]=a},_doCryptBlock:function(c,e,a,b,h,d,j,m){for(var n=this._nRounds,f=c[e]^a[0],g=c[e+1]^a[1],k=c[e+2]^a[2],p=c[e+3]^a[3],l=4,t=1;t<n;t++)var q=b[f>>>24]^h[g>>>16&255]^d[k>>>8&255]^j[p&255]^a[l++],r=b[g>>>24]^h[k>>>16&255]^d[p>>>8&255]^j[f&255]^a[l++],s=
	b[k>>>24]^h[p>>>16&255]^d[f>>>8&255]^j[g&255]^a[l++],p=b[p>>>24]^h[f>>>16&255]^d[g>>>8&255]^j[k&255]^a[l++],f=q,g=r,k=s;q=(m[f>>>24]<<24|m[g>>>16&255]<<16|m[k>>>8&255]<<8|m[p&255])^a[l++];r=(m[g>>>24]<<24|m[k>>>16&255]<<16|m[p>>>8&255]<<8|m[f&255])^a[l++];s=(m[k>>>24]<<24|m[p>>>16&255]<<16|m[f>>>8&255]<<8|m[g&255])^a[l++];p=(m[p>>>24]<<24|m[f>>>16&255]<<16|m[g>>>8&255]<<8|m[k&255])^a[l++];c[e]=q;c[e+1]=r;c[e+2]=s;c[e+3]=p},keySize:8});q.AES=x._createHelper(r)})();

	/*
	CryptoJS v3.1.2 tripledes-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(){function j(b,c){var a=(this._lBlock>>>b^this._rBlock)&c;this._rBlock^=a;this._lBlock^=a<<b}function l(b,c){var a=(this._rBlock>>>b^this._lBlock)&c;this._lBlock^=a;this._rBlock^=a<<b}var h=CryptoJS,e=h.lib,n=e.WordArray,e=e.BlockCipher,g=h.algo,q=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],p=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,
	55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],r=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],s=[{"0":8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,
	2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,
	1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{"0":1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,
	75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,
	276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{"0":260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,
	14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,
	17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{"0":2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,
	98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,
	1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{"0":128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,
	10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,
	83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{"0":268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,
	2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{"0":1048576,
	16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,
	496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{"0":134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,
	2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,
	2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],t=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],m=g.DES=e.extend({_doReset:function(){for(var b=this._key.words,c=[],a=0;56>a;a++){var f=q[a]-1;c[a]=b[f>>>5]>>>31-f%32&1}b=this._subKeys=[];for(f=0;16>f;f++){for(var d=b[f]=[],e=r[f],a=0;24>a;a++)d[a/6|0]|=c[(p[a]-1+e)%28]<<31-a%6,d[4+(a/6|0)]|=c[28+(p[a+24]-1+e)%28]<<31-a%6;d[0]=d[0]<<1|d[0]>>>31;for(a=1;7>a;a++)d[a]>>>=
	4*(a-1)+3;d[7]=d[7]<<5|d[7]>>>27}c=this._invSubKeys=[];for(a=0;16>a;a++)c[a]=b[15-a]},encryptBlock:function(b,c){this._doCryptBlock(b,c,this._subKeys)},decryptBlock:function(b,c){this._doCryptBlock(b,c,this._invSubKeys)},_doCryptBlock:function(b,c,a){this._lBlock=b[c];this._rBlock=b[c+1];j.call(this,4,252645135);j.call(this,16,65535);l.call(this,2,858993459);l.call(this,8,16711935);j.call(this,1,1431655765);for(var f=0;16>f;f++){for(var d=a[f],e=this._lBlock,h=this._rBlock,g=0,k=0;8>k;k++)g|=s[k][((h^
	d[k])&t[k])>>>0];this._lBlock=h;this._rBlock=e^g}a=this._lBlock;this._lBlock=this._rBlock;this._rBlock=a;j.call(this,1,1431655765);l.call(this,8,16711935);l.call(this,2,858993459);j.call(this,16,65535);j.call(this,4,252645135);b[c]=this._lBlock;b[c+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});h.DES=e._createHelper(m);g=g.TripleDES=e.extend({_doReset:function(){var b=this._key.words;this._des1=m.createEncryptor(n.create(b.slice(0,2)));this._des2=m.createEncryptor(n.create(b.slice(2,4)));this._des3=
	m.createEncryptor(n.create(b.slice(4,6)))},encryptBlock:function(b,c){this._des1.encryptBlock(b,c);this._des2.decryptBlock(b,c);this._des3.encryptBlock(b,c)},decryptBlock:function(b,c){this._des3.decryptBlock(b,c);this._des2.encryptBlock(b,c);this._des1.decryptBlock(b,c)},keySize:6,ivSize:2,blockSize:2});h.TripleDES=e._createHelper(g)})();

	/*
	CryptoJS v3.1.2 enc-base64-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
	e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();

	/*
	CryptoJS v3.1.2 md5-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(E){function h(a,f,g,j,p,h,k){a=a+(f&g|~f&j)+p+k;return(a<<h|a>>>32-h)+f}function k(a,f,g,j,p,h,k){a=a+(f&j|g&~j)+p+k;return(a<<h|a>>>32-h)+f}function l(a,f,g,j,h,k,l){a=a+(f^g^j)+h+l;return(a<<k|a>>>32-k)+f}function n(a,f,g,j,h,k,l){a=a+(g^(f|~j))+h+l;return(a<<k|a>>>32-k)+f}for(var r=CryptoJS,q=r.lib,F=q.WordArray,s=q.Hasher,q=r.algo,a=[],t=0;64>t;t++)a[t]=4294967296*E.abs(E.sin(t+1))|0;q=q.MD5=s.extend({_doReset:function(){this._hash=new F.init([1732584193,4023233417,2562383102,271733878])},
	_doProcessBlock:function(m,f){for(var g=0;16>g;g++){var j=f+g,p=m[j];m[j]=(p<<8|p>>>24)&16711935|(p<<24|p>>>8)&4278255360}var g=this._hash.words,j=m[f+0],p=m[f+1],q=m[f+2],r=m[f+3],s=m[f+4],t=m[f+5],u=m[f+6],v=m[f+7],w=m[f+8],x=m[f+9],y=m[f+10],z=m[f+11],A=m[f+12],B=m[f+13],C=m[f+14],D=m[f+15],b=g[0],c=g[1],d=g[2],e=g[3],b=h(b,c,d,e,j,7,a[0]),e=h(e,b,c,d,p,12,a[1]),d=h(d,e,b,c,q,17,a[2]),c=h(c,d,e,b,r,22,a[3]),b=h(b,c,d,e,s,7,a[4]),e=h(e,b,c,d,t,12,a[5]),d=h(d,e,b,c,u,17,a[6]),c=h(c,d,e,b,v,22,a[7]),
	b=h(b,c,d,e,w,7,a[8]),e=h(e,b,c,d,x,12,a[9]),d=h(d,e,b,c,y,17,a[10]),c=h(c,d,e,b,z,22,a[11]),b=h(b,c,d,e,A,7,a[12]),e=h(e,b,c,d,B,12,a[13]),d=h(d,e,b,c,C,17,a[14]),c=h(c,d,e,b,D,22,a[15]),b=k(b,c,d,e,p,5,a[16]),e=k(e,b,c,d,u,9,a[17]),d=k(d,e,b,c,z,14,a[18]),c=k(c,d,e,b,j,20,a[19]),b=k(b,c,d,e,t,5,a[20]),e=k(e,b,c,d,y,9,a[21]),d=k(d,e,b,c,D,14,a[22]),c=k(c,d,e,b,s,20,a[23]),b=k(b,c,d,e,x,5,a[24]),e=k(e,b,c,d,C,9,a[25]),d=k(d,e,b,c,r,14,a[26]),c=k(c,d,e,b,w,20,a[27]),b=k(b,c,d,e,B,5,a[28]),e=k(e,b,
	c,d,q,9,a[29]),d=k(d,e,b,c,v,14,a[30]),c=k(c,d,e,b,A,20,a[31]),b=l(b,c,d,e,t,4,a[32]),e=l(e,b,c,d,w,11,a[33]),d=l(d,e,b,c,z,16,a[34]),c=l(c,d,e,b,C,23,a[35]),b=l(b,c,d,e,p,4,a[36]),e=l(e,b,c,d,s,11,a[37]),d=l(d,e,b,c,v,16,a[38]),c=l(c,d,e,b,y,23,a[39]),b=l(b,c,d,e,B,4,a[40]),e=l(e,b,c,d,j,11,a[41]),d=l(d,e,b,c,r,16,a[42]),c=l(c,d,e,b,u,23,a[43]),b=l(b,c,d,e,x,4,a[44]),e=l(e,b,c,d,A,11,a[45]),d=l(d,e,b,c,D,16,a[46]),c=l(c,d,e,b,q,23,a[47]),b=n(b,c,d,e,j,6,a[48]),e=n(e,b,c,d,v,10,a[49]),d=n(d,e,b,c,
	C,15,a[50]),c=n(c,d,e,b,t,21,a[51]),b=n(b,c,d,e,A,6,a[52]),e=n(e,b,c,d,r,10,a[53]),d=n(d,e,b,c,y,15,a[54]),c=n(c,d,e,b,p,21,a[55]),b=n(b,c,d,e,w,6,a[56]),e=n(e,b,c,d,D,10,a[57]),d=n(d,e,b,c,u,15,a[58]),c=n(c,d,e,b,B,21,a[59]),b=n(b,c,d,e,s,6,a[60]),e=n(e,b,c,d,z,10,a[61]),d=n(d,e,b,c,q,15,a[62]),c=n(c,d,e,b,x,21,a[63]);g[0]=g[0]+b|0;g[1]=g[1]+c|0;g[2]=g[2]+d|0;g[3]=g[3]+e|0},_doFinalize:function(){var a=this._data,f=a.words,g=8*this._nDataBytes,j=8*a.sigBytes;f[j>>>5]|=128<<24-j%32;var h=E.floor(g/
	4294967296);f[(j+64>>>9<<4)+15]=(h<<8|h>>>24)&16711935|(h<<24|h>>>8)&4278255360;f[(j+64>>>9<<4)+14]=(g<<8|g>>>24)&16711935|(g<<24|g>>>8)&4278255360;a.sigBytes=4*(f.length+1);this._process();a=this._hash;f=a.words;for(g=0;4>g;g++)j=f[g],f[g]=(j<<8|j>>>24)&16711935|(j<<24|j>>>8)&4278255360;return a},clone:function(){var a=s.clone.call(this);a._hash=this._hash.clone();return a}});r.MD5=s._createHelper(q);r.HmacMD5=s._createHmacHelper(q)})(Math);

	/*
	CryptoJS v3.1.2 sha1-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(){var k=CryptoJS,b=k.lib,m=b.WordArray,l=b.Hasher,d=[],b=k.algo.SHA1=l.extend({_doReset:function(){this._hash=new m.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(n,p){for(var a=this._hash.words,e=a[0],f=a[1],h=a[2],j=a[3],b=a[4],c=0;80>c;c++){if(16>c)d[c]=n[p+c]|0;else{var g=d[c-3]^d[c-8]^d[c-14]^d[c-16];d[c]=g<<1|g>>>31}g=(e<<5|e>>>27)+b+d[c];g=20>c?g+((f&h|~f&j)+1518500249):40>c?g+((f^h^j)+1859775393):60>c?g+((f&h|f&j|h&j)-1894007588):g+((f^h^
	j)-899497514);b=j;j=h;h=f<<30|f>>>2;f=e;e=g}a[0]=a[0]+e|0;a[1]=a[1]+f|0;a[2]=a[2]+h|0;a[3]=a[3]+j|0;a[4]=a[4]+b|0},_doFinalize:function(){var b=this._data,d=b.words,a=8*this._nDataBytes,e=8*b.sigBytes;d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=Math.floor(a/4294967296);d[(e+64>>>9<<4)+15]=a;b.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var b=l.clone.call(this);b._hash=this._hash.clone();return b}});k.SHA1=l._createHelper(b);k.HmacSHA1=l._createHmacHelper(b)})();

	/*
	CryptoJS v3.1.2 sha256-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(k){for(var g=CryptoJS,h=g.lib,v=h.WordArray,j=h.Hasher,h=g.algo,s=[],t=[],u=function(q){return 4294967296*(q-(q|0))|0},l=2,b=0;64>b;){var d;a:{d=l;for(var w=k.sqrt(d),r=2;r<=w;r++)if(!(d%r)){d=!1;break a}d=!0}d&&(8>b&&(s[b]=u(k.pow(l,0.5))),t[b]=u(k.pow(l,1/3)),b++);l++}var n=[],h=h.SHA256=j.extend({_doReset:function(){this._hash=new v.init(s.slice(0))},_doProcessBlock:function(q,h){for(var a=this._hash.words,c=a[0],d=a[1],b=a[2],k=a[3],f=a[4],g=a[5],j=a[6],l=a[7],e=0;64>e;e++){if(16>e)n[e]=
	q[h+e]|0;else{var m=n[e-15],p=n[e-2];n[e]=((m<<25|m>>>7)^(m<<14|m>>>18)^m>>>3)+n[e-7]+((p<<15|p>>>17)^(p<<13|p>>>19)^p>>>10)+n[e-16]}m=l+((f<<26|f>>>6)^(f<<21|f>>>11)^(f<<7|f>>>25))+(f&g^~f&j)+t[e]+n[e];p=((c<<30|c>>>2)^(c<<19|c>>>13)^(c<<10|c>>>22))+(c&d^c&b^d&b);l=j;j=g;g=f;f=k+m|0;k=b;b=d;d=c;c=m+p|0}a[0]=a[0]+c|0;a[1]=a[1]+d|0;a[2]=a[2]+b|0;a[3]=a[3]+k|0;a[4]=a[4]+f|0;a[5]=a[5]+g|0;a[6]=a[6]+j|0;a[7]=a[7]+l|0},_doFinalize:function(){var d=this._data,b=d.words,a=8*this._nDataBytes,c=8*d.sigBytes;
	b[c>>>5]|=128<<24-c%32;b[(c+64>>>9<<4)+14]=k.floor(a/4294967296);b[(c+64>>>9<<4)+15]=a;d.sigBytes=4*b.length;this._process();return this._hash},clone:function(){var b=j.clone.call(this);b._hash=this._hash.clone();return b}});g.SHA256=j._createHelper(h);g.HmacSHA256=j._createHmacHelper(h)})(Math);

	/*
	CryptoJS v3.1.2 sha224-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(){var b=CryptoJS,d=b.lib.WordArray,a=b.algo,c=a.SHA256,a=a.SHA224=c.extend({_doReset:function(){this._hash=new d.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var a=c._doFinalize.call(this);a.sigBytes-=4;return a}});b.SHA224=c._createHelper(a);b.HmacSHA224=c._createHmacHelper(a)})();

	/*
	CryptoJS v3.1.2 sha512-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(){function a(){return d.create.apply(d,arguments)}for(var n=CryptoJS,r=n.lib.Hasher,e=n.x64,d=e.Word,T=e.WordArray,e=n.algo,ea=[a(1116352408,3609767458),a(1899447441,602891725),a(3049323471,3964484399),a(3921009573,2173295548),a(961987163,4081628472),a(1508970993,3053834265),a(2453635748,2937671579),a(2870763221,3664609560),a(3624381080,2734883394),a(310598401,1164996542),a(607225278,1323610764),a(1426881987,3590304994),a(1925078388,4068182383),a(2162078206,991336113),a(2614888103,633803317),
	a(3248222580,3479774868),a(3835390401,2666613458),a(4022224774,944711139),a(264347078,2341262773),a(604807628,2007800933),a(770255983,1495990901),a(1249150122,1856431235),a(1555081692,3175218132),a(1996064986,2198950837),a(2554220882,3999719339),a(2821834349,766784016),a(2952996808,2566594879),a(3210313671,3203337956),a(3336571891,1034457026),a(3584528711,2466948901),a(113926993,3758326383),a(338241895,168717936),a(666307205,1188179964),a(773529912,1546045734),a(1294757372,1522805485),a(1396182291,
	2643833823),a(1695183700,2343527390),a(1986661051,1014477480),a(2177026350,1206759142),a(2456956037,344077627),a(2730485921,1290863460),a(2820302411,3158454273),a(3259730800,3505952657),a(3345764771,106217008),a(3516065817,3606008344),a(3600352804,1432725776),a(4094571909,1467031594),a(275423344,851169720),a(430227734,3100823752),a(506948616,1363258195),a(659060556,3750685593),a(883997877,3785050280),a(958139571,3318307427),a(1322822218,3812723403),a(1537002063,2003034995),a(1747873779,3602036899),
	a(1955562222,1575990012),a(2024104815,1125592928),a(2227730452,2716904306),a(2361852424,442776044),a(2428436474,593698344),a(2756734187,3733110249),a(3204031479,2999351573),a(3329325298,3815920427),a(3391569614,3928383900),a(3515267271,566280711),a(3940187606,3454069534),a(4118630271,4000239992),a(116418474,1914138554),a(174292421,2731055270),a(289380356,3203993006),a(460393269,320620315),a(685471733,587496836),a(852142971,1086792851),a(1017036298,365543100),a(1126000580,2618297676),a(1288033470,
	3409855158),a(1501505948,4234509866),a(1607167915,987167468),a(1816402316,1246189591)],v=[],w=0;80>w;w++)v[w]=a();e=e.SHA512=r.extend({_doReset:function(){this._hash=new T.init([new d.init(1779033703,4089235720),new d.init(3144134277,2227873595),new d.init(1013904242,4271175723),new d.init(2773480762,1595750129),new d.init(1359893119,2917565137),new d.init(2600822924,725511199),new d.init(528734635,4215389547),new d.init(1541459225,327033209)])},_doProcessBlock:function(a,d){for(var f=this._hash.words,
	F=f[0],e=f[1],n=f[2],r=f[3],G=f[4],H=f[5],I=f[6],f=f[7],w=F.high,J=F.low,X=e.high,K=e.low,Y=n.high,L=n.low,Z=r.high,M=r.low,$=G.high,N=G.low,aa=H.high,O=H.low,ba=I.high,P=I.low,ca=f.high,Q=f.low,k=w,g=J,z=X,x=K,A=Y,y=L,U=Z,B=M,l=$,h=N,R=aa,C=O,S=ba,D=P,V=ca,E=Q,m=0;80>m;m++){var s=v[m];if(16>m)var j=s.high=a[d+2*m]|0,b=s.low=a[d+2*m+1]|0;else{var j=v[m-15],b=j.high,p=j.low,j=(b>>>1|p<<31)^(b>>>8|p<<24)^b>>>7,p=(p>>>1|b<<31)^(p>>>8|b<<24)^(p>>>7|b<<25),u=v[m-2],b=u.high,c=u.low,u=(b>>>19|c<<13)^(b<<
	3|c>>>29)^b>>>6,c=(c>>>19|b<<13)^(c<<3|b>>>29)^(c>>>6|b<<26),b=v[m-7],W=b.high,t=v[m-16],q=t.high,t=t.low,b=p+b.low,j=j+W+(b>>>0<p>>>0?1:0),b=b+c,j=j+u+(b>>>0<c>>>0?1:0),b=b+t,j=j+q+(b>>>0<t>>>0?1:0);s.high=j;s.low=b}var W=l&R^~l&S,t=h&C^~h&D,s=k&z^k&A^z&A,T=g&x^g&y^x&y,p=(k>>>28|g<<4)^(k<<30|g>>>2)^(k<<25|g>>>7),u=(g>>>28|k<<4)^(g<<30|k>>>2)^(g<<25|k>>>7),c=ea[m],fa=c.high,da=c.low,c=E+((h>>>14|l<<18)^(h>>>18|l<<14)^(h<<23|l>>>9)),q=V+((l>>>14|h<<18)^(l>>>18|h<<14)^(l<<23|h>>>9))+(c>>>0<E>>>0?1:
	0),c=c+t,q=q+W+(c>>>0<t>>>0?1:0),c=c+da,q=q+fa+(c>>>0<da>>>0?1:0),c=c+b,q=q+j+(c>>>0<b>>>0?1:0),b=u+T,s=p+s+(b>>>0<u>>>0?1:0),V=S,E=D,S=R,D=C,R=l,C=h,h=B+c|0,l=U+q+(h>>>0<B>>>0?1:0)|0,U=A,B=y,A=z,y=x,z=k,x=g,g=c+b|0,k=q+s+(g>>>0<c>>>0?1:0)|0}J=F.low=J+g;F.high=w+k+(J>>>0<g>>>0?1:0);K=e.low=K+x;e.high=X+z+(K>>>0<x>>>0?1:0);L=n.low=L+y;n.high=Y+A+(L>>>0<y>>>0?1:0);M=r.low=M+B;r.high=Z+U+(M>>>0<B>>>0?1:0);N=G.low=N+h;G.high=$+l+(N>>>0<h>>>0?1:0);O=H.low=O+C;H.high=aa+R+(O>>>0<C>>>0?1:0);P=I.low=P+D;
	I.high=ba+S+(P>>>0<D>>>0?1:0);Q=f.low=Q+E;f.high=ca+V+(Q>>>0<E>>>0?1:0)},_doFinalize:function(){var a=this._data,d=a.words,f=8*this._nDataBytes,e=8*a.sigBytes;d[e>>>5]|=128<<24-e%32;d[(e+128>>>10<<5)+30]=Math.floor(f/4294967296);d[(e+128>>>10<<5)+31]=f;a.sigBytes=4*d.length;this._process();return this._hash.toX32()},clone:function(){var a=r.clone.call(this);a._hash=this._hash.clone();return a},blockSize:32});n.SHA512=r._createHelper(e);n.HmacSHA512=r._createHmacHelper(e)})();

	/*
	CryptoJS v3.1.2 sha384-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(){var c=CryptoJS,a=c.x64,b=a.Word,e=a.WordArray,a=c.algo,d=a.SHA512,a=a.SHA384=d.extend({_doReset:function(){this._hash=new e.init([new b.init(3418070365,3238371032),new b.init(1654270250,914150663),new b.init(2438529370,812702999),new b.init(355462360,4144912697),new b.init(1731405415,4290775857),new b.init(2394180231,1750603025),new b.init(3675008525,1694076839),new b.init(1203062813,3204075428)])},_doFinalize:function(){var a=d._doFinalize.call(this);a.sigBytes-=16;return a}});c.SHA384=
	d._createHelper(a);c.HmacSHA384=d._createHmacHelper(a)})();

	/*
	CryptoJS v3.1.2 ripemd160-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	/*

	(c) 2012 by Cedric Mesnil. All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	(function(){var q=CryptoJS,d=q.lib,n=d.WordArray,p=d.Hasher,d=q.algo,x=n.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),y=n.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),z=n.create([11,14,15,12,
	5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),A=n.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),B=n.create([0,1518500249,1859775393,2400959708,2840853838]),C=n.create([1352829926,1548603684,1836072691,
	2053994217,0]),d=d.RIPEMD160=p.extend({_doReset:function(){this._hash=n.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(e,v){for(var b=0;16>b;b++){var c=v+b,f=e[c];e[c]=(f<<8|f>>>24)&16711935|(f<<24|f>>>8)&4278255360}var c=this._hash.words,f=B.words,d=C.words,n=x.words,q=y.words,p=z.words,w=A.words,t,g,h,j,r,u,k,l,m,s;u=t=c[0];k=g=c[1];l=h=c[2];m=j=c[3];s=r=c[4];for(var a,b=0;80>b;b+=1)a=t+e[v+n[b]]|0,a=16>b?a+((g^h^j)+f[0]):32>b?a+((g&h|~g&j)+f[1]):48>b?
	a+(((g|~h)^j)+f[2]):64>b?a+((g&j|h&~j)+f[3]):a+((g^(h|~j))+f[4]),a|=0,a=a<<p[b]|a>>>32-p[b],a=a+r|0,t=r,r=j,j=h<<10|h>>>22,h=g,g=a,a=u+e[v+q[b]]|0,a=16>b?a+((k^(l|~m))+d[0]):32>b?a+((k&m|l&~m)+d[1]):48>b?a+(((k|~l)^m)+d[2]):64>b?a+((k&l|~k&m)+d[3]):a+((k^l^m)+d[4]),a|=0,a=a<<w[b]|a>>>32-w[b],a=a+s|0,u=s,s=m,m=l<<10|l>>>22,l=k,k=a;a=c[1]+h+m|0;c[1]=c[2]+j+s|0;c[2]=c[3]+r+u|0;c[3]=c[4]+t+k|0;c[4]=c[0]+g+l|0;c[0]=a},_doFinalize:function(){var e=this._data,d=e.words,b=8*this._nDataBytes,c=8*e.sigBytes;
	d[c>>>5]|=128<<24-c%32;d[(c+64>>>9<<4)+14]=(b<<8|b>>>24)&16711935|(b<<24|b>>>8)&4278255360;e.sigBytes=4*(d.length+1);this._process();e=this._hash;d=e.words;for(b=0;5>b;b++)c=d[b],d[b]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return e},clone:function(){var d=p.clone.call(this);d._hash=this._hash.clone();return d}});q.RIPEMD160=p._createHelper(d);q.HmacRIPEMD160=p._createHmacHelper(d)})(Math);

	/*
	CryptoJS v3.1.2 hmac-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(){var c=CryptoJS,k=c.enc.Utf8;c.algo.HMAC=c.lib.Base.extend({init:function(a,b){a=this._hasher=new a.init;"string"==typeof b&&(b=k.parse(b));var c=a.blockSize,e=4*c;b.sigBytes>e&&(b=a.finalize(b));b.clamp();for(var f=this._oKey=b.clone(),g=this._iKey=b.clone(),h=f.words,j=g.words,d=0;d<c;d++)h[d]^=1549556828,j[d]^=909522486;f.sigBytes=g.sigBytes=e;this.reset()},reset:function(){var a=this._hasher;a.reset();a.update(this._iKey)},update:function(a){this._hasher.update(a);return this},finalize:function(a){var b=
	this._hasher;a=b.finalize(a);b.reset();return b.finalize(this._oKey.clone().concat(a))}})})();

	/*
	CryptoJS v3.1.2 pbkdf2-min.js
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	(function(){var b=CryptoJS,a=b.lib,d=a.Base,m=a.WordArray,a=b.algo,q=a.HMAC,l=a.PBKDF2=d.extend({cfg:d.extend({keySize:4,hasher:a.SHA1,iterations:1}),init:function(a){this.cfg=this.cfg.extend(a)},compute:function(a,b){for(var c=this.cfg,f=q.create(c.hasher,a),g=m.create(),d=m.create([1]),l=g.words,r=d.words,n=c.keySize,c=c.iterations;l.length<n;){var h=f.update(b).finalize(d);f.reset();for(var j=h.words,s=j.length,k=h,p=1;p<c;p++){k=f.finalize(k);f.reset();for(var t=k.words,e=0;e<s;e++)j[e]^=t[e]}g.concat(h);
	r[0]++}g.sigBytes=4*n;return g}});b.PBKDF2=function(a,b,c){return l.create(c).compute(a,b)}})();

	/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
	var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var b64pad="=";function hex2b64(d){var b;var e;var a="";for(b=0;b+3<=d.length;b+=3){e=parseInt(d.substring(b,b+3),16);a+=b64map.charAt(e>>6)+b64map.charAt(e&63)}if(b+1==d.length){e=parseInt(d.substring(b,b+1),16);a+=b64map.charAt(e<<2)}else{if(b+2==d.length){e=parseInt(d.substring(b,b+2),16);a+=b64map.charAt(e>>2)+b64map.charAt((e&3)<<4)}}if(b64pad){while((a.length&3)>0){a+=b64pad}}return a}function b64tohex(f){var d="";var e;var b=0;var c;var a;for(e=0;e<f.length;++e){if(f.charAt(e)==b64pad){break}a=b64map.indexOf(f.charAt(e));if(a<0){continue}if(b==0){d+=int2char(a>>2);c=a&3;b=1}else{if(b==1){d+=int2char((c<<2)|(a>>4));c=a&15;b=2}else{if(b==2){d+=int2char(c);d+=int2char(a>>2);c=a&3;b=3}else{d+=int2char((c<<2)|(a>>4));d+=int2char(a&15);b=0}}}}if(b==1){d+=int2char(c<<2)}return d}function b64toBA(e){var d=b64tohex(e);var c;var b=new Array();for(c=0;2*c<d.length;++c){b[c]=parseInt(d.substring(2*c,2*c+2),16)}return b};
	/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
	var dbits;var canary=244837814094590;var j_lm=((canary&16777215)==15715070);function BigInteger(e,d,f){if(e!=null){if("number"==typeof e){this.fromNumber(e,d,f)}else{if(d==null&&"string"!=typeof e){this.fromString(e,256)}else{this.fromString(e,d)}}}}function nbi(){return new BigInteger(null)}function am1(f,a,b,e,h,g){while(--g>=0){var d=a*this[f++]+b[e]+h;h=Math.floor(d/67108864);b[e++]=d&67108863}return h}function am2(f,q,r,e,o,a){var k=q&32767,p=q>>15;while(--a>=0){var d=this[f]&32767;var g=this[f++]>>15;var b=p*d+g*k;d=k*d+((b&32767)<<15)+r[e]+(o&1073741823);o=(d>>>30)+(b>>>15)+p*g+(o>>>30);r[e++]=d&1073741823}return o}function am3(f,q,r,e,o,a){var k=q&16383,p=q>>14;while(--a>=0){var d=this[f]&16383;var g=this[f++]>>14;var b=p*d+g*k;d=k*d+((b&16383)<<14)+r[e]+o;o=(d>>28)+(b>>14)+p*g;r[e++]=d&268435455}return o}if(j_lm&&(navigator.appName=="Microsoft Internet Explorer")){BigInteger.prototype.am=am2;dbits=30}else{if(j_lm&&(navigator.appName!="Netscape")){BigInteger.prototype.am=am1;dbits=26}else{BigInteger.prototype.am=am3;dbits=28}}BigInteger.prototype.DB=dbits;BigInteger.prototype.DM=((1<<dbits)-1);BigInteger.prototype.DV=(1<<dbits);var BI_FP=52;BigInteger.prototype.FV=Math.pow(2,BI_FP);BigInteger.prototype.F1=BI_FP-dbits;BigInteger.prototype.F2=2*dbits-BI_FP;var BI_RM="0123456789abcdefghijklmnopqrstuvwxyz";var BI_RC=new Array();var rr,vv;rr="0".charCodeAt(0);for(vv=0;vv<=9;++vv){BI_RC[rr++]=vv}rr="a".charCodeAt(0);for(vv=10;vv<36;++vv){BI_RC[rr++]=vv}rr="A".charCodeAt(0);for(vv=10;vv<36;++vv){BI_RC[rr++]=vv}function int2char(a){return BI_RM.charAt(a)}function intAt(b,a){var d=BI_RC[b.charCodeAt(a)];return(d==null)?-1:d}function bnpCopyTo(b){for(var a=this.t-1;a>=0;--a){b[a]=this[a]}b.t=this.t;b.s=this.s}function bnpFromInt(a){this.t=1;this.s=(a<0)?-1:0;if(a>0){this[0]=a}else{if(a<-1){this[0]=a+this.DV}else{this.t=0}}}function nbv(a){var b=nbi();b.fromInt(a);return b}function bnpFromString(h,c){var e;if(c==16){e=4}else{if(c==8){e=3}else{if(c==256){e=8}else{if(c==2){e=1}else{if(c==32){e=5}else{if(c==4){e=2}else{this.fromRadix(h,c);return}}}}}}this.t=0;this.s=0;var g=h.length,d=false,f=0;while(--g>=0){var a=(e==8)?h[g]&255:intAt(h,g);if(a<0){if(h.charAt(g)=="-"){d=true}continue}d=false;if(f==0){this[this.t++]=a}else{if(f+e>this.DB){this[this.t-1]|=(a&((1<<(this.DB-f))-1))<<f;this[this.t++]=(a>>(this.DB-f))}else{this[this.t-1]|=a<<f}}f+=e;if(f>=this.DB){f-=this.DB}}if(e==8&&(h[0]&128)!=0){this.s=-1;if(f>0){this[this.t-1]|=((1<<(this.DB-f))-1)<<f}}this.clamp();if(d){BigInteger.ZERO.subTo(this,this)}}function bnpClamp(){var a=this.s&this.DM;while(this.t>0&&this[this.t-1]==a){--this.t}}function bnToString(c){if(this.s<0){return"-"+this.negate().toString(c)}var e;if(c==16){e=4}else{if(c==8){e=3}else{if(c==2){e=1}else{if(c==32){e=5}else{if(c==4){e=2}else{return this.toRadix(c)}}}}}var g=(1<<e)-1,l,a=false,h="",f=this.t;var j=this.DB-(f*this.DB)%e;if(f-->0){if(j<this.DB&&(l=this[f]>>j)>0){a=true;h=int2char(l)}while(f>=0){if(j<e){l=(this[f]&((1<<j)-1))<<(e-j);l|=this[--f]>>(j+=this.DB-e)}else{l=(this[f]>>(j-=e))&g;if(j<=0){j+=this.DB;--f}}if(l>0){a=true}if(a){h+=int2char(l)}}}return a?h:"0"}function bnNegate(){var a=nbi();BigInteger.ZERO.subTo(this,a);return a}function bnAbs(){return(this.s<0)?this.negate():this}function bnCompareTo(b){var d=this.s-b.s;if(d!=0){return d}var c=this.t;d=c-b.t;if(d!=0){return(this.s<0)?-d:d}while(--c>=0){if((d=this[c]-b[c])!=0){return d}}return 0}function nbits(a){var c=1,b;if((b=a>>>16)!=0){a=b;c+=16}if((b=a>>8)!=0){a=b;c+=8}if((b=a>>4)!=0){a=b;c+=4}if((b=a>>2)!=0){a=b;c+=2}if((b=a>>1)!=0){a=b;c+=1}return c}function bnBitLength(){if(this.t<=0){return 0}return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM))}function bnpDLShiftTo(c,b){var a;for(a=this.t-1;a>=0;--a){b[a+c]=this[a]}for(a=c-1;a>=0;--a){b[a]=0}b.t=this.t+c;b.s=this.s}function bnpDRShiftTo(c,b){for(var a=c;a<this.t;++a){b[a-c]=this[a]}b.t=Math.max(this.t-c,0);b.s=this.s}function bnpLShiftTo(j,e){var b=j%this.DB;var a=this.DB-b;var g=(1<<a)-1;var f=Math.floor(j/this.DB),h=(this.s<<b)&this.DM,d;for(d=this.t-1;d>=0;--d){e[d+f+1]=(this[d]>>a)|h;h=(this[d]&g)<<b}for(d=f-1;d>=0;--d){e[d]=0}e[f]=h;e.t=this.t+f+1;e.s=this.s;e.clamp()}function bnpRShiftTo(g,d){d.s=this.s;var e=Math.floor(g/this.DB);if(e>=this.t){d.t=0;return}var b=g%this.DB;var a=this.DB-b;var f=(1<<b)-1;d[0]=this[e]>>b;for(var c=e+1;c<this.t;++c){d[c-e-1]|=(this[c]&f)<<a;d[c-e]=this[c]>>b}if(b>0){d[this.t-e-1]|=(this.s&f)<<a}d.t=this.t-e;d.clamp()}function bnpSubTo(d,f){var e=0,g=0,b=Math.min(d.t,this.t);while(e<b){g+=this[e]-d[e];f[e++]=g&this.DM;g>>=this.DB}if(d.t<this.t){g-=d.s;while(e<this.t){g+=this[e];f[e++]=g&this.DM;g>>=this.DB}g+=this.s}else{g+=this.s;while(e<d.t){g-=d[e];f[e++]=g&this.DM;g>>=this.DB}g-=d.s}f.s=(g<0)?-1:0;if(g<-1){f[e++]=this.DV+g}else{if(g>0){f[e++]=g}}f.t=e;f.clamp()}function bnpMultiplyTo(c,e){var b=this.abs(),f=c.abs();var d=b.t;e.t=d+f.t;while(--d>=0){e[d]=0}for(d=0;d<f.t;++d){e[d+b.t]=b.am(0,f[d],e,d,0,b.t)}e.s=0;e.clamp();if(this.s!=c.s){BigInteger.ZERO.subTo(e,e)}}function bnpSquareTo(d){var a=this.abs();var b=d.t=2*a.t;while(--b>=0){d[b]=0}for(b=0;b<a.t-1;++b){var e=a.am(b,a[b],d,2*b,0,1);if((d[b+a.t]+=a.am(b+1,2*a[b],d,2*b+1,e,a.t-b-1))>=a.DV){d[b+a.t]-=a.DV;d[b+a.t+1]=1}}if(d.t>0){d[d.t-1]+=a.am(b,a[b],d,2*b,0,1)}d.s=0;d.clamp()}function bnpDivRemTo(n,h,g){var w=n.abs();if(w.t<=0){return}var k=this.abs();if(k.t<w.t){if(h!=null){h.fromInt(0)}if(g!=null){this.copyTo(g)}return}if(g==null){g=nbi()}var d=nbi(),a=this.s,l=n.s;var v=this.DB-nbits(w[w.t-1]);if(v>0){w.lShiftTo(v,d);k.lShiftTo(v,g)}else{w.copyTo(d);k.copyTo(g)}var p=d.t;var b=d[p-1];if(b==0){return}var o=b*(1<<this.F1)+((p>1)?d[p-2]>>this.F2:0);var A=this.FV/o,z=(1<<this.F1)/o,x=1<<this.F2;var u=g.t,s=u-p,f=(h==null)?nbi():h;d.dlShiftTo(s,f);if(g.compareTo(f)>=0){g[g.t++]=1;g.subTo(f,g)}BigInteger.ONE.dlShiftTo(p,f);f.subTo(d,d);while(d.t<p){d[d.t++]=0}while(--s>=0){var c=(g[--u]==b)?this.DM:Math.floor(g[u]*A+(g[u-1]+x)*z);if((g[u]+=d.am(0,c,g,s,0,p))<c){d.dlShiftTo(s,f);g.subTo(f,g);while(g[u]<--c){g.subTo(f,g)}}}if(h!=null){g.drShiftTo(p,h);if(a!=l){BigInteger.ZERO.subTo(h,h)}}g.t=p;g.clamp();if(v>0){g.rShiftTo(v,g)}if(a<0){BigInteger.ZERO.subTo(g,g)}}function bnMod(b){var c=nbi();this.abs().divRemTo(b,null,c);if(this.s<0&&c.compareTo(BigInteger.ZERO)>0){b.subTo(c,c)}return c}function Classic(a){this.m=a}function cConvert(a){if(a.s<0||a.compareTo(this.m)>=0){return a.mod(this.m)}else{return a}}function cRevert(a){return a}function cReduce(a){a.divRemTo(this.m,null,a)}function cMulTo(a,c,b){a.multiplyTo(c,b);this.reduce(b)}function cSqrTo(a,b){a.squareTo(b);this.reduce(b)}Classic.prototype.convert=cConvert;Classic.prototype.revert=cRevert;Classic.prototype.reduce=cReduce;Classic.prototype.mulTo=cMulTo;Classic.prototype.sqrTo=cSqrTo;function bnpInvDigit(){if(this.t<1){return 0}var a=this[0];if((a&1)==0){return 0}var b=a&3;b=(b*(2-(a&15)*b))&15;b=(b*(2-(a&255)*b))&255;b=(b*(2-(((a&65535)*b)&65535)))&65535;b=(b*(2-a*b%this.DV))%this.DV;return(b>0)?this.DV-b:-b}function Montgomery(a){this.m=a;this.mp=a.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<(a.DB-15))-1;this.mt2=2*a.t}function montConvert(a){var b=nbi();a.abs().dlShiftTo(this.m.t,b);b.divRemTo(this.m,null,b);if(a.s<0&&b.compareTo(BigInteger.ZERO)>0){this.m.subTo(b,b)}return b}function montRevert(a){var b=nbi();a.copyTo(b);this.reduce(b);return b}function montReduce(a){while(a.t<=this.mt2){a[a.t++]=0}for(var c=0;c<this.m.t;++c){var b=a[c]&32767;var d=(b*this.mpl+(((b*this.mph+(a[c]>>15)*this.mpl)&this.um)<<15))&a.DM;b=c+this.m.t;a[b]+=this.m.am(0,d,a,c,0,this.m.t);while(a[b]>=a.DV){a[b]-=a.DV;a[++b]++}}a.clamp();a.drShiftTo(this.m.t,a);if(a.compareTo(this.m)>=0){a.subTo(this.m,a)}}function montSqrTo(a,b){a.squareTo(b);this.reduce(b)}function montMulTo(a,c,b){a.multiplyTo(c,b);this.reduce(b)}Montgomery.prototype.convert=montConvert;Montgomery.prototype.revert=montRevert;Montgomery.prototype.reduce=montReduce;Montgomery.prototype.mulTo=montMulTo;Montgomery.prototype.sqrTo=montSqrTo;function bnpIsEven(){return((this.t>0)?(this[0]&1):this.s)==0}function bnpExp(h,j){if(h>4294967295||h<1){return BigInteger.ONE}var f=nbi(),a=nbi(),d=j.convert(this),c=nbits(h)-1;d.copyTo(f);while(--c>=0){j.sqrTo(f,a);if((h&(1<<c))>0){j.mulTo(a,d,f)}else{var b=f;f=a;a=b}}return j.revert(f)}function bnModPowInt(b,a){var c;if(b<256||a.isEven()){c=new Classic(a)}else{c=new Montgomery(a)}return this.exp(b,c)}BigInteger.prototype.copyTo=bnpCopyTo;BigInteger.prototype.fromInt=bnpFromInt;BigInteger.prototype.fromString=bnpFromString;BigInteger.prototype.clamp=bnpClamp;BigInteger.prototype.dlShiftTo=bnpDLShiftTo;BigInteger.prototype.drShiftTo=bnpDRShiftTo;BigInteger.prototype.lShiftTo=bnpLShiftTo;BigInteger.prototype.rShiftTo=bnpRShiftTo;BigInteger.prototype.subTo=bnpSubTo;BigInteger.prototype.multiplyTo=bnpMultiplyTo;BigInteger.prototype.squareTo=bnpSquareTo;BigInteger.prototype.divRemTo=bnpDivRemTo;BigInteger.prototype.invDigit=bnpInvDigit;BigInteger.prototype.isEven=bnpIsEven;BigInteger.prototype.exp=bnpExp;BigInteger.prototype.toString=bnToString;BigInteger.prototype.negate=bnNegate;BigInteger.prototype.abs=bnAbs;BigInteger.prototype.compareTo=bnCompareTo;BigInteger.prototype.bitLength=bnBitLength;BigInteger.prototype.mod=bnMod;BigInteger.prototype.modPowInt=bnModPowInt;BigInteger.ZERO=nbv(0);BigInteger.ONE=nbv(1);
	/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
	function bnClone(){var a=nbi();this.copyTo(a);return a}function bnIntValue(){if(this.s<0){if(this.t==1){return this[0]-this.DV}else{if(this.t==0){return -1}}}else{if(this.t==1){return this[0]}else{if(this.t==0){return 0}}}return((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0]}function bnByteValue(){return(this.t==0)?this.s:(this[0]<<24)>>24}function bnShortValue(){return(this.t==0)?this.s:(this[0]<<16)>>16}function bnpChunkSize(a){return Math.floor(Math.LN2*this.DB/Math.log(a))}function bnSigNum(){if(this.s<0){return -1}else{if(this.t<=0||(this.t==1&&this[0]<=0)){return 0}else{return 1}}}function bnpToRadix(c){if(c==null){c=10}if(this.signum()==0||c<2||c>36){return"0"}var f=this.chunkSize(c);var e=Math.pow(c,f);var i=nbv(e),j=nbi(),h=nbi(),g="";this.divRemTo(i,j,h);while(j.signum()>0){g=(e+h.intValue()).toString(c).substr(1)+g;j.divRemTo(i,j,h)}return h.intValue().toString(c)+g}function bnpFromRadix(m,h){this.fromInt(0);if(h==null){h=10}var f=this.chunkSize(h);var g=Math.pow(h,f),e=false,a=0,l=0;for(var c=0;c<m.length;++c){var k=intAt(m,c);if(k<0){if(m.charAt(c)=="-"&&this.signum()==0){e=true}continue}l=h*l+k;if(++a>=f){this.dMultiply(g);this.dAddOffset(l,0);a=0;l=0}}if(a>0){this.dMultiply(Math.pow(h,a));this.dAddOffset(l,0)}if(e){BigInteger.ZERO.subTo(this,this)}}function bnpFromNumber(f,e,h){if("number"==typeof e){if(f<2){this.fromInt(1)}else{this.fromNumber(f,h);if(!this.testBit(f-1)){this.bitwiseTo(BigInteger.ONE.shiftLeft(f-1),op_or,this)}if(this.isEven()){this.dAddOffset(1,0)}while(!this.isProbablePrime(e)){this.dAddOffset(2,0);if(this.bitLength()>f){this.subTo(BigInteger.ONE.shiftLeft(f-1),this)}}}}else{var d=new Array(),g=f&7;d.length=(f>>3)+1;e.nextBytes(d);if(g>0){d[0]&=((1<<g)-1)}else{d[0]=0}this.fromString(d,256)}}function bnToByteArray(){var b=this.t,c=new Array();c[0]=this.s;var e=this.DB-(b*this.DB)%8,f,a=0;if(b-->0){if(e<this.DB&&(f=this[b]>>e)!=(this.s&this.DM)>>e){c[a++]=f|(this.s<<(this.DB-e))}while(b>=0){if(e<8){f=(this[b]&((1<<e)-1))<<(8-e);f|=this[--b]>>(e+=this.DB-8)}else{f=(this[b]>>(e-=8))&255;if(e<=0){e+=this.DB;--b}}if((f&128)!=0){f|=-256}if(a==0&&(this.s&128)!=(f&128)){++a}if(a>0||f!=this.s){c[a++]=f}}}return c}function bnEquals(b){return(this.compareTo(b)==0)}function bnMin(b){return(this.compareTo(b)<0)?this:b}function bnMax(b){return(this.compareTo(b)>0)?this:b}function bnpBitwiseTo(c,h,e){var d,g,b=Math.min(c.t,this.t);for(d=0;d<b;++d){e[d]=h(this[d],c[d])}if(c.t<this.t){g=c.s&this.DM;for(d=b;d<this.t;++d){e[d]=h(this[d],g)}e.t=this.t}else{g=this.s&this.DM;for(d=b;d<c.t;++d){e[d]=h(g,c[d])}e.t=c.t}e.s=h(this.s,c.s);e.clamp()}function op_and(a,b){return a&b}function bnAnd(b){var c=nbi();this.bitwiseTo(b,op_and,c);return c}function op_or(a,b){return a|b}function bnOr(b){var c=nbi();this.bitwiseTo(b,op_or,c);return c}function op_xor(a,b){return a^b}function bnXor(b){var c=nbi();this.bitwiseTo(b,op_xor,c);return c}function op_andnot(a,b){return a&~b}function bnAndNot(b){var c=nbi();this.bitwiseTo(b,op_andnot,c);return c}function bnNot(){var b=nbi();for(var a=0;a<this.t;++a){b[a]=this.DM&~this[a]}b.t=this.t;b.s=~this.s;return b}function bnShiftLeft(b){var a=nbi();if(b<0){this.rShiftTo(-b,a)}else{this.lShiftTo(b,a)}return a}function bnShiftRight(b){var a=nbi();if(b<0){this.lShiftTo(-b,a)}else{this.rShiftTo(b,a)}return a}function lbit(a){if(a==0){return -1}var b=0;if((a&65535)==0){a>>=16;b+=16}if((a&255)==0){a>>=8;b+=8}if((a&15)==0){a>>=4;b+=4}if((a&3)==0){a>>=2;b+=2}if((a&1)==0){++b}return b}function bnGetLowestSetBit(){for(var a=0;a<this.t;++a){if(this[a]!=0){return a*this.DB+lbit(this[a])}}if(this.s<0){return this.t*this.DB}return -1}function cbit(a){var b=0;while(a!=0){a&=a-1;++b}return b}function bnBitCount(){var c=0,a=this.s&this.DM;for(var b=0;b<this.t;++b){c+=cbit(this[b]^a)}return c}function bnTestBit(b){var a=Math.floor(b/this.DB);if(a>=this.t){return(this.s!=0)}return((this[a]&(1<<(b%this.DB)))!=0)}function bnpChangeBit(c,b){var a=BigInteger.ONE.shiftLeft(c);this.bitwiseTo(a,b,a);return a}function bnSetBit(a){return this.changeBit(a,op_or)}function bnClearBit(a){return this.changeBit(a,op_andnot)}function bnFlipBit(a){return this.changeBit(a,op_xor)}function bnpAddTo(d,f){var e=0,g=0,b=Math.min(d.t,this.t);while(e<b){g+=this[e]+d[e];f[e++]=g&this.DM;g>>=this.DB}if(d.t<this.t){g+=d.s;while(e<this.t){g+=this[e];f[e++]=g&this.DM;g>>=this.DB}g+=this.s}else{g+=this.s;while(e<d.t){g+=d[e];f[e++]=g&this.DM;g>>=this.DB}g+=d.s}f.s=(g<0)?-1:0;if(g>0){f[e++]=g}else{if(g<-1){f[e++]=this.DV+g}}f.t=e;f.clamp()}function bnAdd(b){var c=nbi();this.addTo(b,c);return c}function bnSubtract(b){var c=nbi();this.subTo(b,c);return c}function bnMultiply(b){var c=nbi();this.multiplyTo(b,c);return c}function bnSquare(){var a=nbi();this.squareTo(a);return a}function bnDivide(b){var c=nbi();this.divRemTo(b,c,null);return c}function bnRemainder(b){var c=nbi();this.divRemTo(b,null,c);return c}function bnDivideAndRemainder(b){var d=nbi(),c=nbi();this.divRemTo(b,d,c);return new Array(d,c)}function bnpDMultiply(a){this[this.t]=this.am(0,a-1,this,0,0,this.t);++this.t;this.clamp()}function bnpDAddOffset(b,a){if(b==0){return}while(this.t<=a){this[this.t++]=0}this[a]+=b;while(this[a]>=this.DV){this[a]-=this.DV;if(++a>=this.t){this[this.t++]=0}++this[a]}}function NullExp(){}function nNop(a){return a}function nMulTo(a,c,b){a.multiplyTo(c,b)}function nSqrTo(a,b){a.squareTo(b)}NullExp.prototype.convert=nNop;NullExp.prototype.revert=nNop;NullExp.prototype.mulTo=nMulTo;NullExp.prototype.sqrTo=nSqrTo;function bnPow(a){return this.exp(a,new NullExp())}function bnpMultiplyLowerTo(b,f,e){var d=Math.min(this.t+b.t,f);e.s=0;e.t=d;while(d>0){e[--d]=0}var c;for(c=e.t-this.t;d<c;++d){e[d+this.t]=this.am(0,b[d],e,d,0,this.t)}for(c=Math.min(b.t,f);d<c;++d){this.am(0,b[d],e,d,0,f-d)}e.clamp()}function bnpMultiplyUpperTo(b,e,d){--e;var c=d.t=this.t+b.t-e;d.s=0;while(--c>=0){d[c]=0}for(c=Math.max(e-this.t,0);c<b.t;++c){d[this.t+c-e]=this.am(e-c,b[c],d,0,0,this.t+c-e)}d.clamp();d.drShiftTo(1,d)}function Barrett(a){this.r2=nbi();this.q3=nbi();BigInteger.ONE.dlShiftTo(2*a.t,this.r2);this.mu=this.r2.divide(a);this.m=a}function barrettConvert(a){if(a.s<0||a.t>2*this.m.t){return a.mod(this.m)}else{if(a.compareTo(this.m)<0){return a}else{var b=nbi();a.copyTo(b);this.reduce(b);return b}}}function barrettRevert(a){return a}function barrettReduce(a){a.drShiftTo(this.m.t-1,this.r2);if(a.t>this.m.t+1){a.t=this.m.t+1;a.clamp()}this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);while(a.compareTo(this.r2)<0){a.dAddOffset(1,this.m.t+1)}a.subTo(this.r2,a);while(a.compareTo(this.m)>=0){a.subTo(this.m,a)}}function barrettSqrTo(a,b){a.squareTo(b);this.reduce(b)}function barrettMulTo(a,c,b){a.multiplyTo(c,b);this.reduce(b)}Barrett.prototype.convert=barrettConvert;Barrett.prototype.revert=barrettRevert;Barrett.prototype.reduce=barrettReduce;Barrett.prototype.mulTo=barrettMulTo;Barrett.prototype.sqrTo=barrettSqrTo;function bnModPow(q,f){var o=q.bitLength(),h,b=nbv(1),v;if(o<=0){return b}else{if(o<18){h=1}else{if(o<48){h=3}else{if(o<144){h=4}else{if(o<768){h=5}else{h=6}}}}}if(o<8){v=new Classic(f)}else{if(f.isEven()){v=new Barrett(f)}else{v=new Montgomery(f)}}var p=new Array(),d=3,s=h-1,a=(1<<h)-1;p[1]=v.convert(this);if(h>1){var A=nbi();v.sqrTo(p[1],A);while(d<=a){p[d]=nbi();v.mulTo(A,p[d-2],p[d]);d+=2}}var l=q.t-1,x,u=true,c=nbi(),y;o=nbits(q[l])-1;while(l>=0){if(o>=s){x=(q[l]>>(o-s))&a}else{x=(q[l]&((1<<(o+1))-1))<<(s-o);if(l>0){x|=q[l-1]>>(this.DB+o-s)}}d=h;while((x&1)==0){x>>=1;--d}if((o-=d)<0){o+=this.DB;--l}if(u){p[x].copyTo(b);u=false}else{while(d>1){v.sqrTo(b,c);v.sqrTo(c,b);d-=2}if(d>0){v.sqrTo(b,c)}else{y=b;b=c;c=y}v.mulTo(c,p[x],b)}while(l>=0&&(q[l]&(1<<o))==0){v.sqrTo(b,c);y=b;b=c;c=y;if(--o<0){o=this.DB-1;--l}}}return v.revert(b)}function bnGCD(c){var b=(this.s<0)?this.negate():this.clone();var h=(c.s<0)?c.negate():c.clone();if(b.compareTo(h)<0){var e=b;b=h;h=e}var d=b.getLowestSetBit(),f=h.getLowestSetBit();if(f<0){return b}if(d<f){f=d}if(f>0){b.rShiftTo(f,b);h.rShiftTo(f,h)}while(b.signum()>0){if((d=b.getLowestSetBit())>0){b.rShiftTo(d,b)}if((d=h.getLowestSetBit())>0){h.rShiftTo(d,h)}if(b.compareTo(h)>=0){b.subTo(h,b);b.rShiftTo(1,b)}else{h.subTo(b,h);h.rShiftTo(1,h)}}if(f>0){h.lShiftTo(f,h)}return h}function bnpModInt(e){if(e<=0){return 0}var c=this.DV%e,b=(this.s<0)?e-1:0;if(this.t>0){if(c==0){b=this[0]%e}else{for(var a=this.t-1;a>=0;--a){b=(c*b+this[a])%e}}}return b}function bnModInverse(f){var j=f.isEven();if((this.isEven()&&j)||f.signum()==0){return BigInteger.ZERO}var i=f.clone(),h=this.clone();var g=nbv(1),e=nbv(0),l=nbv(0),k=nbv(1);while(i.signum()!=0){while(i.isEven()){i.rShiftTo(1,i);if(j){if(!g.isEven()||!e.isEven()){g.addTo(this,g);e.subTo(f,e)}g.rShiftTo(1,g)}else{if(!e.isEven()){e.subTo(f,e)}}e.rShiftTo(1,e)}while(h.isEven()){h.rShiftTo(1,h);if(j){if(!l.isEven()||!k.isEven()){l.addTo(this,l);k.subTo(f,k)}l.rShiftTo(1,l)}else{if(!k.isEven()){k.subTo(f,k)}}k.rShiftTo(1,k)}if(i.compareTo(h)>=0){i.subTo(h,i);if(j){g.subTo(l,g)}e.subTo(k,e)}else{h.subTo(i,h);if(j){l.subTo(g,l)}k.subTo(e,k)}}if(h.compareTo(BigInteger.ONE)!=0){return BigInteger.ZERO}if(k.compareTo(f)>=0){return k.subtract(f)}if(k.signum()<0){k.addTo(f,k)}else{return k}if(k.signum()<0){return k.add(f)}else{return k}}var lowprimes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];var lplim=(1<<26)/lowprimes[lowprimes.length-1];function bnIsProbablePrime(e){var d,b=this.abs();if(b.t==1&&b[0]<=lowprimes[lowprimes.length-1]){for(d=0;d<lowprimes.length;++d){if(b[0]==lowprimes[d]){return true}}return false}if(b.isEven()){return false}d=1;while(d<lowprimes.length){var a=lowprimes[d],c=d+1;while(c<lowprimes.length&&a<lplim){a*=lowprimes[c++]}a=b.modInt(a);while(d<c){if(a%lowprimes[d++]==0){return false}}}return b.millerRabin(e)}function bnpMillerRabin(f){var g=this.subtract(BigInteger.ONE);var c=g.getLowestSetBit();if(c<=0){return false}var h=g.shiftRight(c);f=(f+1)>>1;if(f>lowprimes.length){f=lowprimes.length}var b=nbi();for(var e=0;e<f;++e){b.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);var l=b.modPow(h,this);if(l.compareTo(BigInteger.ONE)!=0&&l.compareTo(g)!=0){var d=1;while(d++<c&&l.compareTo(g)!=0){l=l.modPowInt(2,this);if(l.compareTo(BigInteger.ONE)==0){return false}}if(l.compareTo(g)!=0){return false}}}return true}BigInteger.prototype.chunkSize=bnpChunkSize;BigInteger.prototype.toRadix=bnpToRadix;BigInteger.prototype.fromRadix=bnpFromRadix;BigInteger.prototype.fromNumber=bnpFromNumber;BigInteger.prototype.bitwiseTo=bnpBitwiseTo;BigInteger.prototype.changeBit=bnpChangeBit;BigInteger.prototype.addTo=bnpAddTo;BigInteger.prototype.dMultiply=bnpDMultiply;BigInteger.prototype.dAddOffset=bnpDAddOffset;BigInteger.prototype.multiplyLowerTo=bnpMultiplyLowerTo;BigInteger.prototype.multiplyUpperTo=bnpMultiplyUpperTo;BigInteger.prototype.modInt=bnpModInt;BigInteger.prototype.millerRabin=bnpMillerRabin;BigInteger.prototype.clone=bnClone;BigInteger.prototype.intValue=bnIntValue;BigInteger.prototype.byteValue=bnByteValue;BigInteger.prototype.shortValue=bnShortValue;BigInteger.prototype.signum=bnSigNum;BigInteger.prototype.toByteArray=bnToByteArray;BigInteger.prototype.equals=bnEquals;BigInteger.prototype.min=bnMin;BigInteger.prototype.max=bnMax;BigInteger.prototype.and=bnAnd;BigInteger.prototype.or=bnOr;BigInteger.prototype.xor=bnXor;BigInteger.prototype.andNot=bnAndNot;BigInteger.prototype.not=bnNot;BigInteger.prototype.shiftLeft=bnShiftLeft;BigInteger.prototype.shiftRight=bnShiftRight;BigInteger.prototype.getLowestSetBit=bnGetLowestSetBit;BigInteger.prototype.bitCount=bnBitCount;BigInteger.prototype.testBit=bnTestBit;BigInteger.prototype.setBit=bnSetBit;BigInteger.prototype.clearBit=bnClearBit;BigInteger.prototype.flipBit=bnFlipBit;BigInteger.prototype.add=bnAdd;BigInteger.prototype.subtract=bnSubtract;BigInteger.prototype.multiply=bnMultiply;BigInteger.prototype.divide=bnDivide;BigInteger.prototype.remainder=bnRemainder;BigInteger.prototype.divideAndRemainder=bnDivideAndRemainder;BigInteger.prototype.modPow=bnModPow;BigInteger.prototype.modInverse=bnModInverse;BigInteger.prototype.pow=bnPow;BigInteger.prototype.gcd=bnGCD;BigInteger.prototype.isProbablePrime=bnIsProbablePrime;BigInteger.prototype.square=bnSquare;
	/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
	function Arcfour(){this.i=0;this.j=0;this.S=new Array()}function ARC4init(d){var c,a,b;for(c=0;c<256;++c){this.S[c]=c}a=0;for(c=0;c<256;++c){a=(a+this.S[c]+d[c%d.length])&255;b=this.S[c];this.S[c]=this.S[a];this.S[a]=b}this.i=0;this.j=0}function ARC4next(){var a;this.i=(this.i+1)&255;this.j=(this.j+this.S[this.i])&255;a=this.S[this.i];this.S[this.i]=this.S[this.j];this.S[this.j]=a;return this.S[(a+this.S[this.i])&255]}Arcfour.prototype.init=ARC4init;Arcfour.prototype.next=ARC4next;function prng_newstate(){return new Arcfour()}var rng_psize=256;
	/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
	var rng_state;var rng_pool;var rng_pptr;function rng_seed_int(a){rng_pool[rng_pptr++]^=a&255;rng_pool[rng_pptr++]^=(a>>8)&255;rng_pool[rng_pptr++]^=(a>>16)&255;rng_pool[rng_pptr++]^=(a>>24)&255;if(rng_pptr>=rng_psize){rng_pptr-=rng_psize}}function rng_seed_time(){rng_seed_int(new Date().getTime())}if(rng_pool==null){rng_pool=new Array();rng_pptr=0;var t;if(window.crypto&&window.crypto.getRandomValues){var ua=new Uint8Array(32);window.crypto.getRandomValues(ua);for(t=0;t<32;++t){rng_pool[rng_pptr++]=ua[t]}}if(navigator.appName=="Netscape"&&navigator.appVersion<"5"&&window.crypto){var z=window.crypto.random(32);for(t=0;t<z.length;++t){rng_pool[rng_pptr++]=z.charCodeAt(t)&255}}while(rng_pptr<rng_psize){t=Math.floor(65536*Math.random());rng_pool[rng_pptr++]=t>>>8;rng_pool[rng_pptr++]=t&255}rng_pptr=0;rng_seed_time()}function rng_get_byte(){if(rng_state==null){rng_seed_time();rng_state=prng_newstate();rng_state.init(rng_pool);for(rng_pptr=0;rng_pptr<rng_pool.length;++rng_pptr){rng_pool[rng_pptr]=0}rng_pptr=0}return rng_state.next()}function rng_get_bytes(b){var a;for(a=0;a<b.length;++a){b[a]=rng_get_byte()}}function SecureRandom(){}SecureRandom.prototype.nextBytes=rng_get_bytes;
	/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
	function parseBigInt(b,a){return new BigInteger(b,a)}function linebrk(c,d){var a="";var b=0;while(b+d<c.length){a+=c.substring(b,b+d)+"\n";b+=d}return a+c.substring(b,c.length)}function byte2Hex(a){if(a<16){return"0"+a.toString(16)}else{return a.toString(16)}}function pkcs1pad2(e,h){if(h<e.length+11){alert("Message too long for RSA");return null}var g=new Array();var d=e.length-1;while(d>=0&&h>0){var f=e.charCodeAt(d--);if(f<128){g[--h]=f}else{if((f>127)&&(f<2048)){g[--h]=(f&63)|128;g[--h]=(f>>6)|192}else{g[--h]=(f&63)|128;g[--h]=((f>>6)&63)|128;g[--h]=(f>>12)|224}}}g[--h]=0;var b=new SecureRandom();var a=new Array();while(h>2){a[0]=0;while(a[0]==0){b.nextBytes(a)}g[--h]=a[0]}g[--h]=2;g[--h]=0;return new BigInteger(g)}function oaep_mgf1_arr(c,a,e){var b="",d=0;while(b.length<a){b+=e(String.fromCharCode.apply(String,c.concat([(d&4278190080)>>24,(d&16711680)>>16,(d&65280)>>8,d&255])));d+=1}return b}var SHA1_SIZE=20;function oaep_pad(l,a,c){if(l.length+2*SHA1_SIZE+2>a){throw"Message too long for RSA"}var h="",d;for(d=0;d<a-l.length-2*SHA1_SIZE-2;d+=1){h+="\x00"}var e=rstr_sha1("")+h+"\x01"+l;var f=new Array(SHA1_SIZE);new SecureRandom().nextBytes(f);var g=oaep_mgf1_arr(f,e.length,c||rstr_sha1);var k=[];for(d=0;d<e.length;d+=1){k[d]=e.charCodeAt(d)^g.charCodeAt(d)}var j=oaep_mgf1_arr(k,f.length,rstr_sha1);var b=[0];for(d=0;d<f.length;d+=1){b[d+1]=f[d]^j.charCodeAt(d)}return new BigInteger(b.concat(k))}function RSAKey(){this.n=null;this.e=0;this.d=null;this.p=null;this.q=null;this.dmp1=null;this.dmq1=null;this.coeff=null}function RSASetPublic(b,a){this.isPublic=true;if(typeof b!=="string"){this.n=b;this.e=a}else{if(b!=null&&a!=null&&b.length>0&&a.length>0){this.n=parseBigInt(b,16);this.e=parseInt(a,16)}else{alert("Invalid RSA public key")}}}function RSADoPublic(a){return a.modPowInt(this.e,this.n)}function RSAEncrypt(d){var a=pkcs1pad2(d,(this.n.bitLength()+7)>>3);if(a==null){return null}var e=this.doPublic(a);if(e==null){return null}var b=e.toString(16);if((b.length&1)==0){return b}else{return"0"+b}}function RSAEncryptOAEP(e,d){var a=oaep_pad(e,(this.n.bitLength()+7)>>3,d);if(a==null){return null}var f=this.doPublic(a);if(f==null){return null}var b=f.toString(16);if((b.length&1)==0){return b}else{return"0"+b}}RSAKey.prototype.doPublic=RSADoPublic;RSAKey.prototype.setPublic=RSASetPublic;RSAKey.prototype.encrypt=RSAEncrypt;RSAKey.prototype.encryptOAEP=RSAEncryptOAEP;RSAKey.prototype.type="RSA";
	/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
	function pkcs1unpad2(g,j){var a=g.toByteArray();var f=0;while(f<a.length&&a[f]==0){++f}if(a.length-f!=j-1||a[f]!=2){return null}++f;while(a[f]!=0){if(++f>=a.length){return null}}var e="";while(++f<a.length){var h=a[f]&255;if(h<128){e+=String.fromCharCode(h)}else{if((h>191)&&(h<224)){e+=String.fromCharCode(((h&31)<<6)|(a[f+1]&63));++f}else{e+=String.fromCharCode(((h&15)<<12)|((a[f+1]&63)<<6)|(a[f+2]&63));f+=2}}}return e}function oaep_mgf1_str(c,a,e){var b="",d=0;while(b.length<a){b+=e(c+String.fromCharCode.apply(String,[(d&4278190080)>>24,(d&16711680)>>16,(d&65280)>>8,d&255]));d+=1}return b}var SHA1_SIZE=20;function oaep_unpad(l,b,e){l=l.toByteArray();var f;for(f=0;f<l.length;f+=1){l[f]&=255}while(l.length<b){l.unshift(0)}l=String.fromCharCode.apply(String,l);if(l.length<2*SHA1_SIZE+2){throw"Cipher too short"}var c=l.substr(1,SHA1_SIZE);var o=l.substr(SHA1_SIZE+1);var m=oaep_mgf1_str(o,SHA1_SIZE,e||rstr_sha1);var h=[],f;for(f=0;f<c.length;f+=1){h[f]=c.charCodeAt(f)^m.charCodeAt(f)}var j=oaep_mgf1_str(String.fromCharCode.apply(String,h),l.length-SHA1_SIZE,rstr_sha1);var g=[];for(f=0;f<o.length;f+=1){g[f]=o.charCodeAt(f)^j.charCodeAt(f)}g=String.fromCharCode.apply(String,g);if(g.substr(0,SHA1_SIZE)!==rstr_sha1("")){throw"Hash mismatch"}g=g.substr(SHA1_SIZE);var a=g.indexOf("\x01");var k=(a!=-1)?g.substr(0,a).lastIndexOf("\x00"):-1;if(k+1!=a){throw"Malformed data"}return g.substr(a+1)}function RSASetPrivate(c,a,b){this.isPrivate=true;if(typeof c!=="string"){this.n=c;this.e=a;this.d=b}else{if(c!=null&&a!=null&&c.length>0&&a.length>0){this.n=parseBigInt(c,16);this.e=parseInt(a,16);this.d=parseBigInt(b,16)}else{alert("Invalid RSA private key")}}}function RSASetPrivateEx(g,d,e,c,b,a,h,f){this.isPrivate=true;if(g==null){throw"RSASetPrivateEx N == null"}if(d==null){throw"RSASetPrivateEx E == null"}if(g.length==0){throw"RSASetPrivateEx N.length == 0"}if(d.length==0){throw"RSASetPrivateEx E.length == 0"}if(g!=null&&d!=null&&g.length>0&&d.length>0){this.n=parseBigInt(g,16);this.e=parseInt(d,16);this.d=parseBigInt(e,16);this.p=parseBigInt(c,16);this.q=parseBigInt(b,16);this.dmp1=parseBigInt(a,16);this.dmq1=parseBigInt(h,16);this.coeff=parseBigInt(f,16)}else{alert("Invalid RSA private key in RSASetPrivateEx")}}function RSAGenerate(b,i){var a=new SecureRandom();var f=b>>1;this.e=parseInt(i,16);var c=new BigInteger(i,16);for(;;){for(;;){this.p=new BigInteger(b-f,1,a);if(this.p.subtract(BigInteger.ONE).gcd(c).compareTo(BigInteger.ONE)==0&&this.p.isProbablePrime(10)){break}}for(;;){this.q=new BigInteger(f,1,a);if(this.q.subtract(BigInteger.ONE).gcd(c).compareTo(BigInteger.ONE)==0&&this.q.isProbablePrime(10)){break}}if(this.p.compareTo(this.q)<=0){var h=this.p;this.p=this.q;this.q=h}var g=this.p.subtract(BigInteger.ONE);var d=this.q.subtract(BigInteger.ONE);var e=g.multiply(d);if(e.gcd(c).compareTo(BigInteger.ONE)==0){this.n=this.p.multiply(this.q);this.d=c.modInverse(e);this.dmp1=this.d.mod(g);this.dmq1=this.d.mod(d);this.coeff=this.q.modInverse(this.p);break}}}function RSADoPrivate(a){if(this.p==null||this.q==null){return a.modPow(this.d,this.n)}var c=a.mod(this.p).modPow(this.dmp1,this.p);var b=a.mod(this.q).modPow(this.dmq1,this.q);while(c.compareTo(b)<0){c=c.add(this.p)}return c.subtract(b).multiply(this.coeff).mod(this.p).multiply(this.q).add(b)}function RSADecrypt(b){var d=parseBigInt(b,16);var a=this.doPrivate(d);if(a==null){return null}return pkcs1unpad2(a,(this.n.bitLength()+7)>>3)}function RSADecryptOAEP(d,b){var e=parseBigInt(d,16);var a=this.doPrivate(e);if(a==null){return null}return oaep_unpad(a,(this.n.bitLength()+7)>>3,b)}RSAKey.prototype.doPrivate=RSADoPrivate;RSAKey.prototype.setPrivate=RSASetPrivate;RSAKey.prototype.setPrivateEx=RSASetPrivateEx;RSAKey.prototype.generate=RSAGenerate;RSAKey.prototype.decrypt=RSADecrypt;RSAKey.prototype.decryptOAEP=RSADecryptOAEP;
	/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
	function ECFieldElementFp(b,a){this.x=a;this.q=b}function feFpEquals(a){if(a==this){return true}return(this.q.equals(a.q)&&this.x.equals(a.x))}function feFpToBigInteger(){return this.x}function feFpNegate(){return new ECFieldElementFp(this.q,this.x.negate().mod(this.q))}function feFpAdd(a){return new ECFieldElementFp(this.q,this.x.add(a.toBigInteger()).mod(this.q))}function feFpSubtract(a){return new ECFieldElementFp(this.q,this.x.subtract(a.toBigInteger()).mod(this.q))}function feFpMultiply(a){return new ECFieldElementFp(this.q,this.x.multiply(a.toBigInteger()).mod(this.q))}function feFpSquare(){return new ECFieldElementFp(this.q,this.x.square().mod(this.q))}function feFpDivide(a){return new ECFieldElementFp(this.q,this.x.multiply(a.toBigInteger().modInverse(this.q)).mod(this.q))}ECFieldElementFp.prototype.equals=feFpEquals;ECFieldElementFp.prototype.toBigInteger=feFpToBigInteger;ECFieldElementFp.prototype.negate=feFpNegate;ECFieldElementFp.prototype.add=feFpAdd;ECFieldElementFp.prototype.subtract=feFpSubtract;ECFieldElementFp.prototype.multiply=feFpMultiply;ECFieldElementFp.prototype.square=feFpSquare;ECFieldElementFp.prototype.divide=feFpDivide;function ECPointFp(c,a,d,b){this.curve=c;this.x=a;this.y=d;if(b==null){this.z=BigInteger.ONE}else{this.z=b}this.zinv=null}function pointFpGetX(){if(this.zinv==null){this.zinv=this.z.modInverse(this.curve.q)}return this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q))}function pointFpGetY(){if(this.zinv==null){this.zinv=this.z.modInverse(this.curve.q)}return this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q))}function pointFpEquals(a){if(a==this){return true}if(this.isInfinity()){return a.isInfinity()}if(a.isInfinity()){return this.isInfinity()}var c,b;c=a.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(a.z)).mod(this.curve.q);if(!c.equals(BigInteger.ZERO)){return false}b=a.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(a.z)).mod(this.curve.q);return b.equals(BigInteger.ZERO)}function pointFpIsInfinity(){if((this.x==null)&&(this.y==null)){return true}return this.z.equals(BigInteger.ZERO)&&!this.y.toBigInteger().equals(BigInteger.ZERO)}function pointFpNegate(){return new ECPointFp(this.curve,this.x,this.y.negate(),this.z)}function pointFpAdd(l){if(this.isInfinity()){return l}if(l.isInfinity()){return this}var p=l.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(l.z)).mod(this.curve.q);var o=l.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(l.z)).mod(this.curve.q);if(BigInteger.ZERO.equals(o)){if(BigInteger.ZERO.equals(p)){return this.twice()}return this.curve.getInfinity()}var j=new BigInteger("3");var e=this.x.toBigInteger();var n=this.y.toBigInteger();var c=l.x.toBigInteger();var k=l.y.toBigInteger();var m=o.square();var i=m.multiply(o);var d=e.multiply(m);var g=p.square().multiply(this.z);var a=g.subtract(d.shiftLeft(1)).multiply(l.z).subtract(i).multiply(o).mod(this.curve.q);var h=d.multiply(j).multiply(p).subtract(n.multiply(i)).subtract(g.multiply(p)).multiply(l.z).add(p.multiply(i)).mod(this.curve.q);var f=i.multiply(this.z).multiply(l.z).mod(this.curve.q);return new ECPointFp(this.curve,this.curve.fromBigInteger(a),this.curve.fromBigInteger(h),f)}function pointFpTwice(){if(this.isInfinity()){return this}if(this.y.toBigInteger().signum()==0){return this.curve.getInfinity()}var g=new BigInteger("3");var c=this.x.toBigInteger();var h=this.y.toBigInteger();var e=h.multiply(this.z);var j=e.multiply(h).mod(this.curve.q);var i=this.curve.a.toBigInteger();var k=c.square().multiply(g);if(!BigInteger.ZERO.equals(i)){k=k.add(this.z.square().multiply(i))}k=k.mod(this.curve.q);var b=k.square().subtract(c.shiftLeft(3).multiply(j)).shiftLeft(1).multiply(e).mod(this.curve.q);var f=k.multiply(g).multiply(c).subtract(j.shiftLeft(1)).shiftLeft(2).multiply(j).subtract(k.square().multiply(k)).mod(this.curve.q);var d=e.square().multiply(e).shiftLeft(3).mod(this.curve.q);return new ECPointFp(this.curve,this.curve.fromBigInteger(b),this.curve.fromBigInteger(f),d)}function pointFpMultiply(b){if(this.isInfinity()){return this}if(b.signum()==0){return this.curve.getInfinity()}var g=b;var f=g.multiply(new BigInteger("3"));var l=this.negate();var d=this;var c;for(c=f.bitLength()-2;c>0;--c){d=d.twice();var a=f.testBit(c);var j=g.testBit(c);if(a!=j){d=d.add(a?this:l)}}return d}function pointFpMultiplyTwo(c,a,b){var d;if(c.bitLength()>b.bitLength()){d=c.bitLength()-1}else{d=b.bitLength()-1}var f=this.curve.getInfinity();var e=this.add(a);while(d>=0){f=f.twice();if(c.testBit(d)){if(b.testBit(d)){f=f.add(e)}else{f=f.add(this)}}else{if(b.testBit(d)){f=f.add(a)}}--d}return f}ECPointFp.prototype.getX=pointFpGetX;ECPointFp.prototype.getY=pointFpGetY;ECPointFp.prototype.equals=pointFpEquals;ECPointFp.prototype.isInfinity=pointFpIsInfinity;ECPointFp.prototype.negate=pointFpNegate;ECPointFp.prototype.add=pointFpAdd;ECPointFp.prototype.twice=pointFpTwice;ECPointFp.prototype.multiply=pointFpMultiply;ECPointFp.prototype.multiplyTwo=pointFpMultiplyTwo;function ECCurveFp(e,d,c){this.q=e;this.a=this.fromBigInteger(d);this.b=this.fromBigInteger(c);this.infinity=new ECPointFp(this,null,null)}function curveFpGetQ(){return this.q}function curveFpGetA(){return this.a}function curveFpGetB(){return this.b}function curveFpEquals(a){if(a==this){return true}return(this.q.equals(a.q)&&this.a.equals(a.a)&&this.b.equals(a.b))}function curveFpGetInfinity(){return this.infinity}function curveFpFromBigInteger(a){return new ECFieldElementFp(this.q,a)}function curveFpDecodePointHex(d){switch(parseInt(d.substr(0,2),16)){case 0:return this.infinity;case 2:case 3:return null;case 4:case 6:case 7:var a=(d.length-2)/2;var c=d.substr(2,a);var b=d.substr(a+2,a);return new ECPointFp(this,this.fromBigInteger(new BigInteger(c,16)),this.fromBigInteger(new BigInteger(b,16)));default:return null}}ECCurveFp.prototype.getQ=curveFpGetQ;ECCurveFp.prototype.getA=curveFpGetA;ECCurveFp.prototype.getB=curveFpGetB;ECCurveFp.prototype.equals=curveFpEquals;ECCurveFp.prototype.getInfinity=curveFpGetInfinity;ECCurveFp.prototype.fromBigInteger=curveFpFromBigInteger;ECCurveFp.prototype.decodePointHex=curveFpDecodePointHex;
	/*! (c) Stefan Thomas | https://github.com/bitcoinjs/bitcoinjs-lib
	 */
	ECFieldElementFp.prototype.getByteLength=function(){return Math.floor((this.toBigInteger().bitLength()+7)/8)};ECPointFp.prototype.getEncoded=function(c){var d=function(h,f){var g=h.toByteArrayUnsigned();if(f<g.length){g=g.slice(g.length-f)}else{while(f>g.length){g.unshift(0)}}return g};var a=this.getX().toBigInteger();var e=this.getY().toBigInteger();var b=d(a,32);if(c){if(e.isEven()){b.unshift(2)}else{b.unshift(3)}}else{b.unshift(4);b=b.concat(d(e,32))}return b};ECPointFp.decodeFrom=function(g,c){var f=c[0];var e=c.length-1;var d=c.slice(1,1+e/2);var b=c.slice(1+e/2,1+e);d.unshift(0);b.unshift(0);var a=new BigInteger(d);var h=new BigInteger(b);return new ECPointFp(g,g.fromBigInteger(a),g.fromBigInteger(h))};ECPointFp.decodeFromHex=function(g,c){var f=c.substr(0,2);var e=c.length-2;var d=c.substr(2,e/2);var b=c.substr(2+e/2,e/2);var a=new BigInteger(d,16);var h=new BigInteger(b,16);return new ECPointFp(g,g.fromBigInteger(a),g.fromBigInteger(h))};ECPointFp.prototype.add2D=function(c){if(this.isInfinity()){return c}if(c.isInfinity()){return this}if(this.x.equals(c.x)){if(this.y.equals(c.y)){return this.twice()}return this.curve.getInfinity()}var g=c.x.subtract(this.x);var e=c.y.subtract(this.y);var a=e.divide(g);var d=a.square().subtract(this.x).subtract(c.x);var f=a.multiply(this.x.subtract(d)).subtract(this.y);return new ECPointFp(this.curve,d,f)};ECPointFp.prototype.twice2D=function(){if(this.isInfinity()){return this}if(this.y.toBigInteger().signum()==0){return this.curve.getInfinity()}var b=this.curve.fromBigInteger(BigInteger.valueOf(2));var e=this.curve.fromBigInteger(BigInteger.valueOf(3));var a=this.x.square().multiply(e).add(this.curve.a).divide(this.y.multiply(b));var c=a.square().subtract(this.x.multiply(b));var d=a.multiply(this.x.subtract(c)).subtract(this.y);return new ECPointFp(this.curve,c,d)};ECPointFp.prototype.multiply2D=function(b){if(this.isInfinity()){return this}if(b.signum()==0){return this.curve.getInfinity()}var g=b;var f=g.multiply(new BigInteger("3"));var l=this.negate();var d=this;var c;for(c=f.bitLength()-2;c>0;--c){d=d.twice();var a=f.testBit(c);var j=g.testBit(c);if(a!=j){d=d.add2D(a?this:l)}}return d};ECPointFp.prototype.isOnCurve=function(){var d=this.getX().toBigInteger();var i=this.getY().toBigInteger();var f=this.curve.getA().toBigInteger();var c=this.curve.getB().toBigInteger();var h=this.curve.getQ();var e=i.multiply(i).mod(h);var g=d.multiply(d).multiply(d).add(f.multiply(d)).add(c).mod(h);return e.equals(g)};ECPointFp.prototype.toString=function(){return"("+this.getX().toBigInteger().toString()+","+this.getY().toBigInteger().toString()+")"};ECPointFp.prototype.validate=function(){var c=this.curve.getQ();if(this.isInfinity()){throw new Error("Point is at infinity.")}var a=this.getX().toBigInteger();var b=this.getY().toBigInteger();if(a.compareTo(BigInteger.ONE)<0||a.compareTo(c.subtract(BigInteger.ONE))>0){throw new Error("x coordinate out of bounds")}if(b.compareTo(BigInteger.ONE)<0||b.compareTo(c.subtract(BigInteger.ONE))>0){throw new Error("y coordinate out of bounds")}if(!this.isOnCurve()){throw new Error("Point is not on the curve.")}if(this.multiply(c).isInfinity()){throw new Error("Point is not a scalar multiple of G.")}return true};
	/*! Mike Samuel (c) 2009 | code.google.com/p/json-sans-eval
	 */
	var jsonParse=(function(){var e="(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)";var j='(?:[^\\0-\\x08\\x0a-\\x1f"\\\\]|\\\\(?:["/\\\\bfnrt]|u[0-9A-Fa-f]{4}))';var i='(?:"'+j+'*")';var d=new RegExp("(?:false|true|null|[\\{\\}\\[\\]]|"+e+"|"+i+")","g");var k=new RegExp("\\\\(?:([^u])|u(.{4}))","g");var g={'"':'"',"/":"/","\\":"\\",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"};function h(l,m,n){return m?g[m]:String.fromCharCode(parseInt(n,16))}var c=new String("");var a="\\";var f={"{":Object,"[":Array};var b=Object.hasOwnProperty;return function(u,q){var p=u.match(d);var x;var v=p[0];var l=false;if("{"===v){x={}}else{if("["===v){x=[]}else{x=[];l=true}}var t;var r=[x];for(var o=1-l,m=p.length;o<m;++o){v=p[o];var w;switch(v.charCodeAt(0)){default:w=r[0];w[t||w.length]=+(v);t=void 0;break;case 34:v=v.substring(1,v.length-1);if(v.indexOf(a)!==-1){v=v.replace(k,h)}w=r[0];if(!t){if(w instanceof Array){t=w.length}else{t=v||c;break}}w[t]=v;t=void 0;break;case 91:w=r[0];r.unshift(w[t||w.length]=[]);t=void 0;break;case 93:r.shift();break;case 102:w=r[0];w[t||w.length]=false;t=void 0;break;case 110:w=r[0];w[t||w.length]=null;t=void 0;break;case 116:w=r[0];w[t||w.length]=true;t=void 0;break;case 123:w=r[0];r.unshift(w[t||w.length]={});t=void 0;break;case 125:r.shift();break}}if(l){if(r.length!==1){throw new Error()}x=x[0]}else{if(r.length){throw new Error()}}if(q){var s=function(C,B){var D=C[B];if(D&&typeof D==="object"){var n=null;for(var z in D){if(b.call(D,z)&&D!==C){var y=s(D,z);if(y!==void 0){D[z]=y}else{if(!n){n=[]}n.push(z)}}}if(n){for(var A=n.length;--A>=0;){delete D[n[A]]}}}return q.call(C,B,D)};x=s({"":x},"")}return x}})();
	/*! asn1-1.0.9.js (c) 2013-2015 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	if(typeof KJUR=="undefined"||!KJUR){KJUR={}}if(typeof KJUR.asn1=="undefined"||!KJUR.asn1){KJUR.asn1={}}KJUR.asn1.ASN1Util=new function(){this.integerToByteHex=function(a){var b=a.toString(16);if((b.length%2)==1){b="0"+b}return b};this.bigIntToMinTwosComplementsHex=function(j){var f=j.toString(16);if(f.substr(0,1)!="-"){if(f.length%2==1){f="0"+f}else{if(!f.match(/^[0-7]/)){f="00"+f}}}else{var a=f.substr(1);var e=a.length;if(e%2==1){e+=1}else{if(!f.match(/^[0-7]/)){e+=2}}var g="";for(var d=0;d<e;d++){g+="f"}var c=new BigInteger(g,16);var b=c.xor(j).add(BigInteger.ONE);f=b.toString(16).replace(/^-/,"")}return f};this.getPEMStringFromHex=function(a,b){var c=KJUR.asn1;var f=CryptoJS.enc.Hex.parse(a);var d=CryptoJS.enc.Base64.stringify(f);var e=d.replace(/(.{64})/g,"$1\r\n");e=e.replace(/\r\n$/,"");return"-----BEGIN "+b+"-----\r\n"+e+"\r\n-----END "+b+"-----\r\n"};this.newObject=function(b){var g=KJUR.asn1;var k=Object.keys(b);if(k.length!=1){throw"key of param shall be only one."}var j=k[0];if(":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":"+j+":")==-1){throw"undefined key: "+j}if(j=="bool"){return new g.DERBoolean(b[j])}if(j=="int"){return new g.DERInteger(b[j])}if(j=="bitstr"){return new g.DERBitString(b[j])}if(j=="octstr"){return new g.DEROctetString(b[j])}if(j=="null"){return new g.DERNull(b[j])}if(j=="oid"){return new g.DERObjectIdentifier(b[j])}if(j=="enum"){return new g.DEREnumerated(b[j])}if(j=="utf8str"){return new g.DERUTF8String(b[j])}if(j=="numstr"){return new g.DERNumericString(b[j])}if(j=="prnstr"){return new g.DERPrintableString(b[j])}if(j=="telstr"){return new g.DERTeletexString(b[j])}if(j=="ia5str"){return new g.DERIA5String(b[j])}if(j=="utctime"){return new g.DERUTCTime(b[j])}if(j=="gentime"){return new g.DERGeneralizedTime(b[j])}if(j=="seq"){var m=b[j];var h=[];for(var e=0;e<m.length;e++){var l=g.ASN1Util.newObject(m[e]);h.push(l)}return new g.DERSequence({array:h})}if(j=="set"){var m=b[j];var h=[];for(var e=0;e<m.length;e++){var l=g.ASN1Util.newObject(m[e]);h.push(l)}return new g.DERSet({array:h})}if(j=="tag"){var c=b[j];if(Object.prototype.toString.call(c)==="[object Array]"&&c.length==3){var d=g.ASN1Util.newObject(c[2]);return new g.DERTaggedObject({tag:c[0],explicit:c[1],obj:d})}else{var f={};if(c.explicit!==undefined){f.explicit=c.explicit}if(c.tag!==undefined){f.tag=c.tag}if(c.obj===undefined){throw"obj shall be specified for 'tag'."}f.obj=g.ASN1Util.newObject(c.obj);return new g.DERTaggedObject(f)}}};this.jsonToASN1HEX=function(b){var a=this.newObject(b);return a.getEncodedHex()}};KJUR.asn1.ASN1Util.oidHexToInt=function(a){var j="";var k=parseInt(a.substr(0,2),16);var d=Math.floor(k/40);var c=k%40;var j=d+"."+c;var e="";for(var f=2;f<a.length;f+=2){var g=parseInt(a.substr(f,2),16);var h=("00000000"+g.toString(2)).slice(-8);e=e+h.substr(1,7);if(h.substr(0,1)=="0"){var b=new BigInteger(e,2);j=j+"."+b.toString(10);e=""}}return j};KJUR.asn1.ASN1Util.oidIntToHex=function(f){var e=function(a){var k=a.toString(16);if(k.length==1){k="0"+k}return k};var d=function(o){var n="";var k=new BigInteger(o,10);var a=k.toString(2);var l=7-a.length%7;if(l==7){l=0}var q="";for(var m=0;m<l;m++){q+="0"}a=q+a;for(var m=0;m<a.length-1;m+=7){var p=a.substr(m,7);if(m!=a.length-7){p="1"+p}n+=e(parseInt(p,2))}return n};if(!f.match(/^[0-9.]+$/)){throw"malformed oid string: "+f}var g="";var b=f.split(".");var j=parseInt(b[0])*40+parseInt(b[1]);g+=e(j);b.splice(0,2);for(var c=0;c<b.length;c++){g+=d(b[c])}return g};KJUR.asn1.ASN1Object=function(){var c=true;var b=null;var d="00";var e="00";var a="";this.getLengthHexFromValue=function(){if(typeof this.hV=="undefined"||this.hV==null){throw"this.hV is null or undefined."}if(this.hV.length%2==1){throw"value hex must be even length: n="+a.length+",v="+this.hV}var i=this.hV.length/2;var h=i.toString(16);if(h.length%2==1){h="0"+h}if(i<128){return h}else{var g=h.length/2;if(g>15){throw"ASN.1 length too long to represent by 8x: n = "+i.toString(16)}var f=128+g;return f.toString(16)+h}};this.getEncodedHex=function(){if(this.hTLV==null||this.isModified){this.hV=this.getFreshValueHex();this.hL=this.getLengthHexFromValue();this.hTLV=this.hT+this.hL+this.hV;this.isModified=false}return this.hTLV};this.getValueHex=function(){this.getEncodedHex();return this.hV};this.getFreshValueHex=function(){return""}};KJUR.asn1.DERAbstractString=function(c){KJUR.asn1.DERAbstractString.superclass.constructor.call(this);var b=null;var a=null;this.getString=function(){return this.s};this.setString=function(d){this.hTLV=null;this.isModified=true;this.s=d;this.hV=stohex(this.s)};this.setStringHex=function(d){this.hTLV=null;this.isModified=true;this.s=null;this.hV=d};this.getFreshValueHex=function(){return this.hV};if(typeof c!="undefined"){if(typeof c=="string"){this.setString(c)}else{if(typeof c.str!="undefined"){this.setString(c.str)}else{if(typeof c.hex!="undefined"){this.setStringHex(c.hex)}}}}};YAHOO.lang.extend(KJUR.asn1.DERAbstractString,KJUR.asn1.ASN1Object);KJUR.asn1.DERAbstractTime=function(c){KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);var b=null;var a=null;this.localDateToUTC=function(f){utc=f.getTime()+(f.getTimezoneOffset()*60000);var e=new Date(utc);return e};this.formatDate=function(m,o,e){var g=this.zeroPadding;var n=this.localDateToUTC(m);var p=String(n.getFullYear());if(o=="utc"){p=p.substr(2,2)}var l=g(String(n.getMonth()+1),2);var q=g(String(n.getDate()),2);var h=g(String(n.getHours()),2);var i=g(String(n.getMinutes()),2);var j=g(String(n.getSeconds()),2);var r=p+l+q+h+i+j;if(e===true){var f=n.getMilliseconds();if(f!=0){var k=g(String(f),3);k=k.replace(/[0]+$/,"");r=r+"."+k}}return r+"Z"};this.zeroPadding=function(e,d){if(e.length>=d){return e}return new Array(d-e.length+1).join("0")+e};this.getString=function(){return this.s};this.setString=function(d){this.hTLV=null;this.isModified=true;this.s=d;this.hV=stohex(d)};this.setByDateValue=function(h,j,e,d,f,g){var i=new Date(Date.UTC(h,j-1,e,d,f,g,0));this.setByDate(i)};this.getFreshValueHex=function(){return this.hV}};YAHOO.lang.extend(KJUR.asn1.DERAbstractTime,KJUR.asn1.ASN1Object);KJUR.asn1.DERAbstractStructured=function(b){KJUR.asn1.DERAbstractString.superclass.constructor.call(this);var a=null;this.setByASN1ObjectArray=function(c){this.hTLV=null;this.isModified=true;this.asn1Array=c};this.appendASN1Object=function(c){this.hTLV=null;this.isModified=true;this.asn1Array.push(c)};this.asn1Array=new Array();if(typeof b!="undefined"){if(typeof b.array!="undefined"){this.asn1Array=b.array}}};YAHOO.lang.extend(KJUR.asn1.DERAbstractStructured,KJUR.asn1.ASN1Object);KJUR.asn1.DERBoolean=function(){KJUR.asn1.DERBoolean.superclass.constructor.call(this);this.hT="01";this.hTLV="0101ff"};YAHOO.lang.extend(KJUR.asn1.DERBoolean,KJUR.asn1.ASN1Object);KJUR.asn1.DERInteger=function(a){KJUR.asn1.DERInteger.superclass.constructor.call(this);this.hT="02";this.setByBigInteger=function(b){this.hTLV=null;this.isModified=true;this.hV=KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(b)};this.setByInteger=function(c){var b=new BigInteger(String(c),10);this.setByBigInteger(b)};this.setValueHex=function(b){this.hV=b};this.getFreshValueHex=function(){return this.hV};if(typeof a!="undefined"){if(typeof a.bigint!="undefined"){this.setByBigInteger(a.bigint)}else{if(typeof a["int"]!="undefined"){this.setByInteger(a["int"])}else{if(typeof a=="number"){this.setByInteger(a)}else{if(typeof a.hex!="undefined"){this.setValueHex(a.hex)}}}}}};YAHOO.lang.extend(KJUR.asn1.DERInteger,KJUR.asn1.ASN1Object);KJUR.asn1.DERBitString=function(a){KJUR.asn1.DERBitString.superclass.constructor.call(this);this.hT="03";this.setHexValueIncludingUnusedBits=function(b){this.hTLV=null;this.isModified=true;this.hV=b};this.setUnusedBitsAndHexValue=function(b,d){if(b<0||7<b){throw"unused bits shall be from 0 to 7: u = "+b}var c="0"+b;this.hTLV=null;this.isModified=true;this.hV=c+d};this.setByBinaryString=function(e){e=e.replace(/0+$/,"");var f=8-e.length%8;if(f==8){f=0}for(var g=0;g<=f;g++){e+="0"}var j="";for(var g=0;g<e.length-1;g+=8){var d=e.substr(g,8);var c=parseInt(d,2).toString(16);if(c.length==1){c="0"+c}j+=c}this.hTLV=null;this.isModified=true;this.hV="0"+f+j};this.setByBooleanArray=function(d){var c="";for(var b=0;b<d.length;b++){if(d[b]==true){c+="1"}else{c+="0"}}this.setByBinaryString(c)};this.newFalseArray=function(d){var b=new Array(d);for(var c=0;c<d;c++){b[c]=false}return b};this.getFreshValueHex=function(){return this.hV};if(typeof a!="undefined"){if(typeof a=="string"&&a.toLowerCase().match(/^[0-9a-f]+$/)){this.setHexValueIncludingUnusedBits(a)}else{if(typeof a.hex!="undefined"){this.setHexValueIncludingUnusedBits(a.hex)}else{if(typeof a.bin!="undefined"){this.setByBinaryString(a.bin)}else{if(typeof a.array!="undefined"){this.setByBooleanArray(a.array)}}}}}};YAHOO.lang.extend(KJUR.asn1.DERBitString,KJUR.asn1.ASN1Object);KJUR.asn1.DEROctetString=function(a){KJUR.asn1.DEROctetString.superclass.constructor.call(this,a);this.hT="04"};YAHOO.lang.extend(KJUR.asn1.DEROctetString,KJUR.asn1.DERAbstractString);KJUR.asn1.DERNull=function(){KJUR.asn1.DERNull.superclass.constructor.call(this);this.hT="05";this.hTLV="0500"};YAHOO.lang.extend(KJUR.asn1.DERNull,KJUR.asn1.ASN1Object);KJUR.asn1.DERObjectIdentifier=function(c){var b=function(d){var e=d.toString(16);if(e.length==1){e="0"+e}return e};var a=function(k){var j="";var e=new BigInteger(k,10);var d=e.toString(2);var f=7-d.length%7;if(f==7){f=0}var m="";for(var g=0;g<f;g++){m+="0"}d=m+d;for(var g=0;g<d.length-1;g+=7){var l=d.substr(g,7);if(g!=d.length-7){l="1"+l}j+=b(parseInt(l,2))}return j};KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);this.hT="06";this.setValueHex=function(d){this.hTLV=null;this.isModified=true;this.s=null;this.hV=d};this.setValueOidString=function(f){if(!f.match(/^[0-9.]+$/)){throw"malformed oid string: "+f}var g="";var d=f.split(".");var j=parseInt(d[0])*40+parseInt(d[1]);g+=b(j);d.splice(0,2);for(var e=0;e<d.length;e++){g+=a(d[e])}this.hTLV=null;this.isModified=true;this.s=null;this.hV=g};this.setValueName=function(e){if(typeof KJUR.asn1.x509.OID.name2oidList[e]!="undefined"){var d=KJUR.asn1.x509.OID.name2oidList[e];this.setValueOidString(d)}else{throw"DERObjectIdentifier oidName undefined: "+e}};this.getFreshValueHex=function(){return this.hV};if(typeof c!="undefined"){if(typeof c=="string"&&c.match(/^[0-2].[0-9.]+$/)){this.setValueOidString(c)}else{if(KJUR.asn1.x509.OID.name2oidList[c]!==undefined){this.setValueOidString(KJUR.asn1.x509.OID.name2oidList[c])}else{if(typeof c.oid!="undefined"){this.setValueOidString(c.oid)}else{if(typeof c.hex!="undefined"){this.setValueHex(c.hex)}else{if(typeof c.name!="undefined"){this.setValueName(c.name)}}}}}}};YAHOO.lang.extend(KJUR.asn1.DERObjectIdentifier,KJUR.asn1.ASN1Object);KJUR.asn1.DEREnumerated=function(a){KJUR.asn1.DEREnumerated.superclass.constructor.call(this);this.hT="0a";this.setByBigInteger=function(b){this.hTLV=null;this.isModified=true;this.hV=KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(b)};this.setByInteger=function(c){var b=new BigInteger(String(c),10);this.setByBigInteger(b)};this.setValueHex=function(b){this.hV=b};this.getFreshValueHex=function(){return this.hV};if(typeof a!="undefined"){if(typeof a["int"]!="undefined"){this.setByInteger(a["int"])}else{if(typeof a=="number"){this.setByInteger(a)}else{if(typeof a.hex!="undefined"){this.setValueHex(a.hex)}}}}};YAHOO.lang.extend(KJUR.asn1.DEREnumerated,KJUR.asn1.ASN1Object);KJUR.asn1.DERUTF8String=function(a){KJUR.asn1.DERUTF8String.superclass.constructor.call(this,a);this.hT="0c"};YAHOO.lang.extend(KJUR.asn1.DERUTF8String,KJUR.asn1.DERAbstractString);KJUR.asn1.DERNumericString=function(a){KJUR.asn1.DERNumericString.superclass.constructor.call(this,a);this.hT="12"};YAHOO.lang.extend(KJUR.asn1.DERNumericString,KJUR.asn1.DERAbstractString);KJUR.asn1.DERPrintableString=function(a){KJUR.asn1.DERPrintableString.superclass.constructor.call(this,a);this.hT="13"};YAHOO.lang.extend(KJUR.asn1.DERPrintableString,KJUR.asn1.DERAbstractString);KJUR.asn1.DERTeletexString=function(a){KJUR.asn1.DERTeletexString.superclass.constructor.call(this,a);this.hT="14"};YAHOO.lang.extend(KJUR.asn1.DERTeletexString,KJUR.asn1.DERAbstractString);KJUR.asn1.DERIA5String=function(a){KJUR.asn1.DERIA5String.superclass.constructor.call(this,a);this.hT="16"};YAHOO.lang.extend(KJUR.asn1.DERIA5String,KJUR.asn1.DERAbstractString);KJUR.asn1.DERUTCTime=function(a){KJUR.asn1.DERUTCTime.superclass.constructor.call(this,a);this.hT="17";this.setByDate=function(b){this.hTLV=null;this.isModified=true;this.date=b;this.s=this.formatDate(this.date,"utc");this.hV=stohex(this.s)};this.getFreshValueHex=function(){if(typeof this.date=="undefined"&&typeof this.s=="undefined"){this.date=new Date();this.s=this.formatDate(this.date,"utc");this.hV=stohex(this.s)}return this.hV};if(a!==undefined){if(a.str!==undefined){this.setString(a.str)}else{if(typeof a=="string"&&a.match(/^[0-9]{12}Z$/)){this.setString(a)}else{if(a.hex!==undefined){this.setStringHex(a.hex)}else{if(a.date!==undefined){this.setByDate(a.date)}}}}}};YAHOO.lang.extend(KJUR.asn1.DERUTCTime,KJUR.asn1.DERAbstractTime);KJUR.asn1.DERGeneralizedTime=function(a){KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this,a);this.hT="18";this.withMillis=false;this.setByDate=function(b){this.hTLV=null;this.isModified=true;this.date=b;this.s=this.formatDate(this.date,"gen",this.withMillis);this.hV=stohex(this.s)};this.getFreshValueHex=function(){if(this.date===undefined&&this.s===undefined){this.date=new Date();this.s=this.formatDate(this.date,"gen",this.withMillis);this.hV=stohex(this.s)}return this.hV};if(a!==undefined){if(a.str!==undefined){this.setString(a.str)}else{if(typeof a=="string"&&a.match(/^[0-9]{14}Z$/)){this.setString(a)}else{if(a.hex!==undefined){this.setStringHex(a.hex)}else{if(a.date!==undefined){this.setByDate(a.date)}}}}if(a.millis===true){this.withMillis=true}}};YAHOO.lang.extend(KJUR.asn1.DERGeneralizedTime,KJUR.asn1.DERAbstractTime);KJUR.asn1.DERSequence=function(a){KJUR.asn1.DERSequence.superclass.constructor.call(this,a);this.hT="30";this.getFreshValueHex=function(){var c="";for(var b=0;b<this.asn1Array.length;b++){var d=this.asn1Array[b];c+=d.getEncodedHex()}this.hV=c;return this.hV}};YAHOO.lang.extend(KJUR.asn1.DERSequence,KJUR.asn1.DERAbstractStructured);KJUR.asn1.DERSet=function(a){KJUR.asn1.DERSet.superclass.constructor.call(this,a);this.hT="31";this.sortFlag=true;this.getFreshValueHex=function(){var b=new Array();for(var c=0;c<this.asn1Array.length;c++){var d=this.asn1Array[c];b.push(d.getEncodedHex())}if(this.sortFlag==true){b.sort()}this.hV=b.join("");return this.hV};if(typeof a!="undefined"){if(typeof a.sortflag!="undefined"&&a.sortflag==false){this.sortFlag=false}}};YAHOO.lang.extend(KJUR.asn1.DERSet,KJUR.asn1.DERAbstractStructured);KJUR.asn1.DERTaggedObject=function(a){KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);this.hT="a0";this.hV="";this.isExplicit=true;this.asn1Object=null;this.setASN1Object=function(b,c,d){this.hT=c;this.isExplicit=b;this.asn1Object=d;if(this.isExplicit){this.hV=this.asn1Object.getEncodedHex();this.hTLV=null;this.isModified=true}else{this.hV=null;this.hTLV=d.getEncodedHex();this.hTLV=this.hTLV.replace(/^../,c);this.isModified=false}};this.getFreshValueHex=function(){return this.hV};if(typeof a!="undefined"){if(typeof a.tag!="undefined"){this.hT=a.tag}if(typeof a.explicit!="undefined"){this.isExplicit=a.explicit}if(typeof a.obj!="undefined"){this.asn1Object=a.obj;this.setASN1Object(this.isExplicit,this.hT,this.asn1Object)}}};YAHOO.lang.extend(KJUR.asn1.DERTaggedObject,KJUR.asn1.ASN1Object);
	/*! asn1hex-1.1.6.js (c) 2012-2015 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	var ASN1HEX=new function(){this.getByteLengthOfL_AtObj=function(b,c){if(b.substring(c+2,c+3)!="8"){return 1}var a=parseInt(b.substring(c+3,c+4));if(a==0){return -1}if(0<a&&a<10){return a+1}return -2};this.getHexOfL_AtObj=function(b,c){var a=this.getByteLengthOfL_AtObj(b,c);if(a<1){return""}return b.substring(c+2,c+2+a*2)};this.getIntOfL_AtObj=function(c,d){var b=this.getHexOfL_AtObj(c,d);if(b==""){return -1}var a;if(parseInt(b.substring(0,1))<8){a=new BigInteger(b,16)}else{a=new BigInteger(b.substring(2),16)}return a.intValue()};this.getStartPosOfV_AtObj=function(b,c){var a=this.getByteLengthOfL_AtObj(b,c);if(a<0){return a}return c+(a+1)*2};this.getHexOfV_AtObj=function(c,d){var b=this.getStartPosOfV_AtObj(c,d);var a=this.getIntOfL_AtObj(c,d);return c.substring(b,b+a*2)};this.getHexOfTLV_AtObj=function(c,e){var b=c.substr(e,2);var d=this.getHexOfL_AtObj(c,e);var a=this.getHexOfV_AtObj(c,e);return b+d+a};this.getPosOfNextSibling_AtObj=function(c,d){var b=this.getStartPosOfV_AtObj(c,d);var a=this.getIntOfL_AtObj(c,d);return b+a*2};this.getPosArrayOfChildren_AtObj=function(f,j){var c=new Array();var i=this.getStartPosOfV_AtObj(f,j);c.push(i);var b=this.getIntOfL_AtObj(f,j);var g=i;var d=0;while(1){var e=this.getPosOfNextSibling_AtObj(f,g);if(e==null||(e-i>=(b*2))){break}if(d>=200){break}c.push(e);g=e;d++}return c};this.getNthChildIndex_AtObj=function(d,b,e){var c=this.getPosArrayOfChildren_AtObj(d,b);return c[e]};this.getDecendantIndexByNthList=function(e,d,c){if(c.length==0){return d}var f=c.shift();var b=this.getPosArrayOfChildren_AtObj(e,d);return this.getDecendantIndexByNthList(e,b[f],c)};this.getDecendantHexTLVByNthList=function(d,c,b){var a=this.getDecendantIndexByNthList(d,c,b);return this.getHexOfTLV_AtObj(d,a)};this.getDecendantHexVByNthList=function(d,c,b){var a=this.getDecendantIndexByNthList(d,c,b);return this.getHexOfV_AtObj(d,a)}};ASN1HEX.getVbyList=function(d,c,b,e){var a=this.getDecendantIndexByNthList(d,c,b);if(a===undefined){throw"can't find nthList object"}if(e!==undefined){if(d.substr(a,2)!=e){throw"checking tag doesn't match: "+d.substr(a,2)+"!="+e}}return this.getHexOfV_AtObj(d,a)};ASN1HEX.hextooidstr=function(e){var h=function(b,a){if(b.length>=a){return b}return new Array(a-b.length+1).join("0")+b};var l=[];var o=e.substr(0,2);var f=parseInt(o,16);l[0]=new String(Math.floor(f/40));l[1]=new String(f%40);var m=e.substr(2);var k=[];for(var g=0;g<m.length/2;g++){k.push(parseInt(m.substr(g*2,2),16))}var j=[];var d="";for(var g=0;g<k.length;g++){if(k[g]&128){d=d+h((k[g]&127).toString(2),7)}else{d=d+h((k[g]&127).toString(2),7);j.push(new String(parseInt(d,2)));d=""}}var n=l.join(".");if(j.length>0){n=n+"."+j.join(".")}return n};ASN1HEX.dump=function(e,c,k,g){var o=function(w,i){if(w.length<=i*2){return w}else{var v=w.substr(0,i)+"..(total "+w.length/2+"bytes).."+w.substr(w.length-i,i);return v}};if(c===undefined){c={ommit_long_octet:32}}if(k===undefined){k=0}if(g===undefined){g=""}var r=c.ommit_long_octet;if(e.substr(k,2)=="01"){var h=ASN1HEX.getHexOfV_AtObj(e,k);if(h=="00"){return g+"BOOLEAN FALSE\n"}else{return g+"BOOLEAN TRUE\n"}}if(e.substr(k,2)=="02"){var h=ASN1HEX.getHexOfV_AtObj(e,k);return g+"INTEGER "+o(h,r)+"\n"}if(e.substr(k,2)=="03"){var h=ASN1HEX.getHexOfV_AtObj(e,k);return g+"BITSTRING "+o(h,r)+"\n"}if(e.substr(k,2)=="04"){var h=ASN1HEX.getHexOfV_AtObj(e,k);if(ASN1HEX.isASN1HEX(h)){var j=g+"OCTETSTRING, encapsulates\n";j=j+ASN1HEX.dump(h,c,0,g+"  ");return j}else{return g+"OCTETSTRING "+o(h,r)+"\n"}}if(e.substr(k,2)=="05"){return g+"NULL\n"}if(e.substr(k,2)=="06"){var l=ASN1HEX.getHexOfV_AtObj(e,k);var a=KJUR.asn1.ASN1Util.oidHexToInt(l);var n=KJUR.asn1.x509.OID.oid2name(a);var b=a.replace(/\./g," ");if(n!=""){return g+"ObjectIdentifier "+n+" ("+b+")\n"}else{return g+"ObjectIdentifier ("+b+")\n"}}if(e.substr(k,2)=="0c"){return g+"UTF8String '"+hextoutf8(ASN1HEX.getHexOfV_AtObj(e,k))+"'\n"}if(e.substr(k,2)=="13"){return g+"PrintableString '"+hextoutf8(ASN1HEX.getHexOfV_AtObj(e,k))+"'\n"}if(e.substr(k,2)=="14"){return g+"TeletexString '"+hextoutf8(ASN1HEX.getHexOfV_AtObj(e,k))+"'\n"}if(e.substr(k,2)=="16"){return g+"IA5String '"+hextoutf8(ASN1HEX.getHexOfV_AtObj(e,k))+"'\n"}if(e.substr(k,2)=="17"){return g+"UTCTime "+hextoutf8(ASN1HEX.getHexOfV_AtObj(e,k))+"\n"}if(e.substr(k,2)=="18"){return g+"GeneralizedTime "+hextoutf8(ASN1HEX.getHexOfV_AtObj(e,k))+"\n"}if(e.substr(k,2)=="30"){if(e.substr(k,4)=="3000"){return g+"SEQUENCE {}\n"}var j=g+"SEQUENCE\n";var d=ASN1HEX.getPosArrayOfChildren_AtObj(e,k);var f=c;if((d.length==2||d.length==3)&&e.substr(d[0],2)=="06"&&e.substr(d[d.length-1],2)=="04"){var t=ASN1HEX.getHexOfV_AtObj(e,d[0]);var a=KJUR.asn1.ASN1Util.oidHexToInt(t);var n=KJUR.asn1.x509.OID.oid2name(a);var p=JSON.parse(JSON.stringify(c));p.x509ExtName=n;f=p}for(var q=0;q<d.length;q++){j=j+ASN1HEX.dump(e,f,d[q],g+"  ")}return j}if(e.substr(k,2)=="31"){var j=g+"SET\n";var d=ASN1HEX.getPosArrayOfChildren_AtObj(e,k);for(var q=0;q<d.length;q++){j=j+ASN1HEX.dump(e,c,d[q],g+"  ")}return j}var u=parseInt(e.substr(k,2),16);if((u&128)!=0){var m=u&31;if((u&32)!=0){var j=g+"["+m+"]\n";var d=ASN1HEX.getPosArrayOfChildren_AtObj(e,k);for(var q=0;q<d.length;q++){j=j+ASN1HEX.dump(e,c,d[q],g+"  ")}return j}else{var h=ASN1HEX.getHexOfV_AtObj(e,k);if(h.substr(0,8)=="68747470"){h=hextoutf8(h)}if(c.x509ExtName==="subjectAltName"&&m==2){h=hextoutf8(h)}var j=g+"["+m+"] "+h+"\n";return j}}return g+"UNKNOWN("+e.substr(k,2)+") "+ASN1HEX.getHexOfV_AtObj(e,k)+"\n"};ASN1HEX.isASN1HEX=function(d){if(d.length%2==1){return false}var c=ASN1HEX.getIntOfL_AtObj(d,0);var b=d.substr(0,2);var e=ASN1HEX.getHexOfL_AtObj(d,0);var a=d.length-b.length-e.length;if(a==c*2){return true}return false};
	/*! asn1x509-1.0.14.js (c) 2013-2015 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	if(typeof KJUR=="undefined"||!KJUR){KJUR={}}if(typeof KJUR.asn1=="undefined"||!KJUR.asn1){KJUR.asn1={}}if(typeof KJUR.asn1.x509=="undefined"||!KJUR.asn1.x509){KJUR.asn1.x509={}}KJUR.asn1.x509.Certificate=function(g){KJUR.asn1.x509.Certificate.superclass.constructor.call(this);var b=null;var d=null;var f=null;var c=null;var a=null;var e=null;this.setRsaPrvKeyByPEMandPass=function(i,k){var h=PKCS5PKEY.getDecryptedKeyHex(i,k);var j=new RSAKey();j.readPrivateKeyFromASN1HexString(h);this.prvKey=j};this.sign=function(){this.asn1SignatureAlg=this.asn1TBSCert.asn1SignatureAlg;sig=new KJUR.crypto.Signature({alg:"SHA1withRSA"});sig.init(this.prvKey);sig.updateHex(this.asn1TBSCert.getEncodedHex());this.hexSig=sig.sign();this.asn1Sig=new KJUR.asn1.DERBitString({hex:"00"+this.hexSig});var h=new KJUR.asn1.DERSequence({array:[this.asn1TBSCert,this.asn1SignatureAlg,this.asn1Sig]});this.hTLV=h.getEncodedHex();this.isModified=false};this.setSignatureHex=function(h){this.asn1SignatureAlg=this.asn1TBSCert.asn1SignatureAlg;this.hexSig=h;this.asn1Sig=new KJUR.asn1.DERBitString({hex:"00"+this.hexSig});var i=new KJUR.asn1.DERSequence({array:[this.asn1TBSCert,this.asn1SignatureAlg,this.asn1Sig]});this.hTLV=i.getEncodedHex();this.isModified=false};this.getEncodedHex=function(){if(this.isModified==false&&this.hTLV!=null){return this.hTLV}throw"not signed yet"};this.getPEMString=function(){var j=this.getEncodedHex();var h=CryptoJS.enc.Hex.parse(j);var i=CryptoJS.enc.Base64.stringify(h);var k=i.replace(/(.{64})/g,"$1\r\n");return"-----BEGIN CERTIFICATE-----\r\n"+k+"\r\n-----END CERTIFICATE-----\r\n"};if(typeof g!="undefined"){if(typeof g.tbscertobj!="undefined"){this.asn1TBSCert=g.tbscertobj}if(typeof g.prvkeyobj!="undefined"){this.prvKey=g.prvkeyobj}else{if(typeof g.rsaprvkey!="undefined"){this.prvKey=g.rsaprvkey}else{if((typeof g.rsaprvpem!="undefined")&&(typeof g.rsaprvpas!="undefined")){this.setRsaPrvKeyByPEMandPass(g.rsaprvpem,g.rsaprvpas)}}}}};YAHOO.lang.extend(KJUR.asn1.x509.Certificate,KJUR.asn1.ASN1Object);KJUR.asn1.x509.TBSCertificate=function(a){KJUR.asn1.x509.TBSCertificate.superclass.constructor.call(this);this._initialize=function(){this.asn1Array=new Array();this.asn1Version=new KJUR.asn1.DERTaggedObject({obj:new KJUR.asn1.DERInteger({"int":2})});this.asn1SerialNumber=null;this.asn1SignatureAlg=null;this.asn1Issuer=null;this.asn1NotBefore=null;this.asn1NotAfter=null;this.asn1Subject=null;this.asn1SubjPKey=null;this.extensionsArray=new Array()};this.setSerialNumberByParam=function(b){this.asn1SerialNumber=new KJUR.asn1.DERInteger(b)};this.setSignatureAlgByParam=function(b){this.asn1SignatureAlg=new KJUR.asn1.x509.AlgorithmIdentifier(b)};this.setIssuerByParam=function(b){this.asn1Issuer=new KJUR.asn1.x509.X500Name(b)};this.setNotBeforeByParam=function(b){this.asn1NotBefore=new KJUR.asn1.x509.Time(b)};this.setNotAfterByParam=function(b){this.asn1NotAfter=new KJUR.asn1.x509.Time(b)};this.setSubjectByParam=function(b){this.asn1Subject=new KJUR.asn1.x509.X500Name(b)};this.setSubjectPublicKeyByParam=function(b){this.asn1SubjPKey=new KJUR.asn1.x509.SubjectPublicKeyInfo(b)};this.setSubjectPublicKeyByGetKey=function(c){var b=KEYUTIL.getKey(c);this.asn1SubjPKey=new KJUR.asn1.x509.SubjectPublicKeyInfo(b)};this.appendExtension=function(b){this.extensionsArray.push(b)};this.appendExtensionByName=function(d,b){if(d.toLowerCase()=="basicconstraints"){var c=new KJUR.asn1.x509.BasicConstraints(b);this.appendExtension(c)}else{if(d.toLowerCase()=="keyusage"){var c=new KJUR.asn1.x509.KeyUsage(b);this.appendExtension(c)}else{if(d.toLowerCase()=="crldistributionpoints"){var c=new KJUR.asn1.x509.CRLDistributionPoints(b);this.appendExtension(c)}else{if(d.toLowerCase()=="extkeyusage"){var c=new KJUR.asn1.x509.ExtKeyUsage(b);this.appendExtension(c)}else{if(d.toLowerCase()=="authoritykeyidentifier"){var c=new KJUR.asn1.x509.AuthorityKeyIdentifier(b);this.appendExtension(c)}else{throw"unsupported extension name: "+d}}}}}};this.getEncodedHex=function(){if(this.asn1NotBefore==null||this.asn1NotAfter==null){throw"notBefore and/or notAfter not set"}var c=new KJUR.asn1.DERSequence({array:[this.asn1NotBefore,this.asn1NotAfter]});this.asn1Array=new Array();this.asn1Array.push(this.asn1Version);this.asn1Array.push(this.asn1SerialNumber);this.asn1Array.push(this.asn1SignatureAlg);this.asn1Array.push(this.asn1Issuer);this.asn1Array.push(c);this.asn1Array.push(this.asn1Subject);this.asn1Array.push(this.asn1SubjPKey);if(this.extensionsArray.length>0){var d=new KJUR.asn1.DERSequence({array:this.extensionsArray});var b=new KJUR.asn1.DERTaggedObject({explicit:true,tag:"a3",obj:d});this.asn1Array.push(b)}var e=new KJUR.asn1.DERSequence({array:this.asn1Array});this.hTLV=e.getEncodedHex();this.isModified=false;return this.hTLV};this._initialize()};YAHOO.lang.extend(KJUR.asn1.x509.TBSCertificate,KJUR.asn1.ASN1Object);KJUR.asn1.x509.Extension=function(b){KJUR.asn1.x509.Extension.superclass.constructor.call(this);var a=null;this.getEncodedHex=function(){var f=new KJUR.asn1.DERObjectIdentifier({oid:this.oid});var e=new KJUR.asn1.DEROctetString({hex:this.getExtnValueHex()});var d=new Array();d.push(f);if(this.critical){d.push(new KJUR.asn1.DERBoolean())}d.push(e);var c=new KJUR.asn1.DERSequence({array:d});return c.getEncodedHex()};this.critical=false;if(typeof b!="undefined"){if(typeof b.critical!="undefined"){this.critical=b.critical}}};YAHOO.lang.extend(KJUR.asn1.x509.Extension,KJUR.asn1.ASN1Object);KJUR.asn1.x509.KeyUsage=function(a){KJUR.asn1.x509.KeyUsage.superclass.constructor.call(this,a);this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()};this.oid="2.5.29.15";if(typeof a!="undefined"){if(typeof a.bin!="undefined"){this.asn1ExtnValue=new KJUR.asn1.DERBitString(a)}}};YAHOO.lang.extend(KJUR.asn1.x509.KeyUsage,KJUR.asn1.x509.Extension);KJUR.asn1.x509.BasicConstraints=function(c){KJUR.asn1.x509.BasicConstraints.superclass.constructor.call(this,c);var a=false;var b=-1;this.getExtnValueHex=function(){var e=new Array();if(this.cA){e.push(new KJUR.asn1.DERBoolean())}if(this.pathLen>-1){e.push(new KJUR.asn1.DERInteger({"int":this.pathLen}))}var d=new KJUR.asn1.DERSequence({array:e});this.asn1ExtnValue=d;return this.asn1ExtnValue.getEncodedHex()};this.oid="2.5.29.19";this.cA=false;this.pathLen=-1;if(typeof c!="undefined"){if(typeof c.cA!="undefined"){this.cA=c.cA}if(typeof c.pathLen!="undefined"){this.pathLen=c.pathLen}}};YAHOO.lang.extend(KJUR.asn1.x509.BasicConstraints,KJUR.asn1.x509.Extension);KJUR.asn1.x509.CRLDistributionPoints=function(a){KJUR.asn1.x509.CRLDistributionPoints.superclass.constructor.call(this,a);this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()};this.setByDPArray=function(b){this.asn1ExtnValue=new KJUR.asn1.DERSequence({array:b})};this.setByOneURI=function(e){var b=new KJUR.asn1.x509.GeneralNames([{uri:e}]);var d=new KJUR.asn1.x509.DistributionPointName(b);var c=new KJUR.asn1.x509.DistributionPoint({dpobj:d});this.setByDPArray([c])};this.oid="2.5.29.31";if(typeof a!="undefined"){if(typeof a.array!="undefined"){this.setByDPArray(a.array)}else{if(typeof a.uri!="undefined"){this.setByOneURI(a.uri)}}}};YAHOO.lang.extend(KJUR.asn1.x509.CRLDistributionPoints,KJUR.asn1.x509.Extension);KJUR.asn1.x509.ExtKeyUsage=function(a){KJUR.asn1.x509.ExtKeyUsage.superclass.constructor.call(this,a);this.setPurposeArray=function(b){this.asn1ExtnValue=new KJUR.asn1.DERSequence();for(var c=0;c<b.length;c++){var d=new KJUR.asn1.DERObjectIdentifier(b[c]);this.asn1ExtnValue.appendASN1Object(d)}};this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()};this.oid="2.5.29.37";if(typeof a!="undefined"){if(typeof a.array!="undefined"){this.setPurposeArray(a.array)}}};YAHOO.lang.extend(KJUR.asn1.x509.ExtKeyUsage,KJUR.asn1.x509.Extension);KJUR.asn1.x509.AuthorityKeyIdentifier=function(a){KJUR.asn1.x509.AuthorityKeyIdentifier.superclass.constructor.call(this,a);this.asn1KID=null;this.asn1CertIssuer=null;this.asn1CertSN=null;this.getExtnValueHex=function(){var c=new Array();if(this.asn1KID){c.push(new KJUR.asn1.DERTaggedObject({explicit:false,tag:"80",obj:this.asn1KID}))}if(this.asn1CertIssuer){c.push(new KJUR.asn1.DERTaggedObject({explicit:false,tag:"a1",obj:this.asn1CertIssuer}))}if(this.asn1CertSN){c.push(new KJUR.asn1.DERTaggedObject({explicit:false,tag:"82",obj:this.asn1CertSN}))}var b=new KJUR.asn1.DERSequence({array:c});this.asn1ExtnValue=b;return this.asn1ExtnValue.getEncodedHex()};this.setKIDByParam=function(b){this.asn1KID=new KJUR.asn1.DEROctetString(b)};this.setCertIssuerByParam=function(b){this.asn1CertIssuer=new KJUR.asn1.x509.X500Name(b)};this.setCertSNByParam=function(b){this.asn1CertSN=new KJUR.asn1.DERInteger(b)};this.oid="2.5.29.35";if(typeof a!="undefined"){if(typeof a.kid!="undefined"){this.setKIDByParam(a.kid)}if(typeof a.issuer!="undefined"){this.setCertIssuerByParam(a.issuer)}if(typeof a.sn!="undefined"){this.setCertSNByParam(a.sn)}}};YAHOO.lang.extend(KJUR.asn1.x509.AuthorityKeyIdentifier,KJUR.asn1.x509.Extension);KJUR.asn1.x509.CRL=function(f){KJUR.asn1.x509.CRL.superclass.constructor.call(this);var a=null;var c=null;var e=null;var b=null;var d=null;this.setRsaPrvKeyByPEMandPass=function(h,j){var g=PKCS5PKEY.getDecryptedKeyHex(h,j);var i=new RSAKey();i.readPrivateKeyFromASN1HexString(g);this.rsaPrvKey=i};this.sign=function(){this.asn1SignatureAlg=this.asn1TBSCertList.asn1SignatureAlg;sig=new KJUR.crypto.Signature({alg:"SHA1withRSA",prov:"cryptojs/jsrsa"});sig.initSign(this.rsaPrvKey);sig.updateHex(this.asn1TBSCertList.getEncodedHex());this.hexSig=sig.sign();this.asn1Sig=new KJUR.asn1.DERBitString({hex:"00"+this.hexSig});var g=new KJUR.asn1.DERSequence({array:[this.asn1TBSCertList,this.asn1SignatureAlg,this.asn1Sig]});this.hTLV=g.getEncodedHex();this.isModified=false};this.getEncodedHex=function(){if(this.isModified==false&&this.hTLV!=null){return this.hTLV}throw"not signed yet"};this.getPEMString=function(){var i=this.getEncodedHex();var g=CryptoJS.enc.Hex.parse(i);var h=CryptoJS.enc.Base64.stringify(g);var j=h.replace(/(.{64})/g,"$1\r\n");return"-----BEGIN X509 CRL-----\r\n"+j+"\r\n-----END X509 CRL-----\r\n"};if(typeof f!="undefined"){if(typeof f.tbsobj!="undefined"){this.asn1TBSCertList=f.tbsobj}if(typeof f.rsaprvkey!="undefined"){this.rsaPrvKey=f.rsaprvkey}if((typeof f.rsaprvpem!="undefined")&&(typeof f.rsaprvpas!="undefined")){this.setRsaPrvKeyByPEMandPass(f.rsaprvpem,f.rsaprvpas)}}};YAHOO.lang.extend(KJUR.asn1.x509.CRL,KJUR.asn1.ASN1Object);KJUR.asn1.x509.TBSCertList=function(b){KJUR.asn1.x509.TBSCertList.superclass.constructor.call(this);var a=null;this.setSignatureAlgByParam=function(c){this.asn1SignatureAlg=new KJUR.asn1.x509.AlgorithmIdentifier(c)};this.setIssuerByParam=function(c){this.asn1Issuer=new KJUR.asn1.x509.X500Name(c)};this.setThisUpdateByParam=function(c){this.asn1ThisUpdate=new KJUR.asn1.x509.Time(c)};this.setNextUpdateByParam=function(c){this.asn1NextUpdate=new KJUR.asn1.x509.Time(c)};this.addRevokedCert=function(c,d){var f={};if(c!=undefined&&c!=null){f.sn=c}if(d!=undefined&&d!=null){f.time=d}var e=new KJUR.asn1.x509.CRLEntry(f);this.aRevokedCert.push(e)};this.getEncodedHex=function(){this.asn1Array=new Array();if(this.asn1Version!=null){this.asn1Array.push(this.asn1Version)}this.asn1Array.push(this.asn1SignatureAlg);this.asn1Array.push(this.asn1Issuer);this.asn1Array.push(this.asn1ThisUpdate);if(this.asn1NextUpdate!=null){this.asn1Array.push(this.asn1NextUpdate)}if(this.aRevokedCert.length>0){var c=new KJUR.asn1.DERSequence({array:this.aRevokedCert});this.asn1Array.push(c)}var d=new KJUR.asn1.DERSequence({array:this.asn1Array});this.hTLV=d.getEncodedHex();this.isModified=false;return this.hTLV};this._initialize=function(){this.asn1Version=null;this.asn1SignatureAlg=null;this.asn1Issuer=null;this.asn1ThisUpdate=null;this.asn1NextUpdate=null;this.aRevokedCert=new Array()};this._initialize()};YAHOO.lang.extend(KJUR.asn1.x509.TBSCertList,KJUR.asn1.ASN1Object);KJUR.asn1.x509.CRLEntry=function(c){KJUR.asn1.x509.CRLEntry.superclass.constructor.call(this);var b=null;var a=null;this.setCertSerial=function(d){this.sn=new KJUR.asn1.DERInteger(d)};this.setRevocationDate=function(d){this.time=new KJUR.asn1.x509.Time(d)};this.getEncodedHex=function(){var d=new KJUR.asn1.DERSequence({array:[this.sn,this.time]});this.TLV=d.getEncodedHex();return this.TLV};if(typeof c!="undefined"){if(typeof c.time!="undefined"){this.setRevocationDate(c.time)}if(typeof c.sn!="undefined"){this.setCertSerial(c.sn)}}};YAHOO.lang.extend(KJUR.asn1.x509.CRLEntry,KJUR.asn1.ASN1Object);KJUR.asn1.x509.X500Name=function(b){KJUR.asn1.x509.X500Name.superclass.constructor.call(this);this.asn1Array=new Array();this.setByString=function(c){var d=c.split("/");d.shift();for(var e=0;e<d.length;e++){this.asn1Array.push(new KJUR.asn1.x509.RDN({str:d[e]}))}};this.setByObject=function(e){for(var c in e){if(e.hasOwnProperty(c)){var d=new KJUR.asn1.x509.RDN({str:c+"="+e[c]});this.asn1Array?this.asn1Array.push(d):this.asn1Array=[d]}}};this.getEncodedHex=function(){if(typeof this.hTLV=="string"){return this.hTLV}var c=new KJUR.asn1.DERSequence({array:this.asn1Array});this.hTLV=c.getEncodedHex();return this.hTLV};if(typeof b!="undefined"){if(typeof b.str!="undefined"){this.setByString(b.str)}else{if(typeof b==="object"){this.setByObject(b)}}if(typeof b.certissuer!="undefined"){var a=new X509();a.hex=X509.pemToHex(b.certissuer);this.hTLV=a.getIssuerHex()}if(typeof b.certsubject!="undefined"){var a=new X509();a.hex=X509.pemToHex(b.certsubject);this.hTLV=a.getSubjectHex()}}};YAHOO.lang.extend(KJUR.asn1.x509.X500Name,KJUR.asn1.ASN1Object);KJUR.asn1.x509.RDN=function(a){KJUR.asn1.x509.RDN.superclass.constructor.call(this);this.asn1Array=new Array();this.addByString=function(b){this.asn1Array.push(new KJUR.asn1.x509.AttributeTypeAndValue({str:b}))};this.getEncodedHex=function(){var b=new KJUR.asn1.DERSet({array:this.asn1Array});this.TLV=b.getEncodedHex();return this.TLV};if(typeof a!="undefined"){if(typeof a.str!="undefined"){this.addByString(a.str)}}};YAHOO.lang.extend(KJUR.asn1.x509.RDN,KJUR.asn1.ASN1Object);KJUR.asn1.x509.AttributeTypeAndValue=function(b){KJUR.asn1.x509.AttributeTypeAndValue.superclass.constructor.call(this);var d=null;var c=null;var a="utf8";this.setByString=function(e){if(e.match(/^([^=]+)=(.+)$/)){this.setByAttrTypeAndValueStr(RegExp.$1,RegExp.$2)}else{throw"malformed attrTypeAndValueStr: "+e}};this.setByAttrTypeAndValueStr=function(g,f){this.typeObj=KJUR.asn1.x509.OID.atype2obj(g);var e=a;if(g=="C"){e="prn"}this.valueObj=this.getValueObj(e,f)};this.getValueObj=function(f,e){if(f=="utf8"){return new KJUR.asn1.DERUTF8String({str:e})}if(f=="prn"){return new KJUR.asn1.DERPrintableString({str:e})}if(f=="tel"){return new KJUR.asn1.DERTeletexString({str:e})}if(f=="ia5"){return new KJUR.asn1.DERIA5String({str:e})}throw"unsupported directory string type: type="+f+" value="+e};this.getEncodedHex=function(){var e=new KJUR.asn1.DERSequence({array:[this.typeObj,this.valueObj]});this.TLV=e.getEncodedHex();return this.TLV};if(typeof b!="undefined"){if(typeof b.str!="undefined"){this.setByString(b.str)}}};YAHOO.lang.extend(KJUR.asn1.x509.AttributeTypeAndValue,KJUR.asn1.ASN1Object);KJUR.asn1.x509.SubjectPublicKeyInfo=function(d){KJUR.asn1.x509.SubjectPublicKeyInfo.superclass.constructor.call(this);var b=null;var c=null;var a=null;this.setRSAKey=function(e){if(!RSAKey.prototype.isPrototypeOf(e)){throw"argument is not RSAKey instance"}this.rsaKey=e;var g=new KJUR.asn1.DERInteger({bigint:e.n});var f=new KJUR.asn1.DERInteger({"int":e.e});var i=new KJUR.asn1.DERSequence({array:[g,f]});var h=i.getEncodedHex();this.asn1AlgId=new KJUR.asn1.x509.AlgorithmIdentifier({name:"rsaEncryption"});this.asn1SubjPKey=new KJUR.asn1.DERBitString({hex:"00"+h})};this.setRSAPEM=function(g){if(g.match(/-----BEGIN PUBLIC KEY-----/)){var n=g;n=n.replace(/^-----[^-]+-----/,"");n=n.replace(/-----[^-]+-----\s*$/,"");var m=n.replace(/\s+/g,"");var f=CryptoJS.enc.Base64.parse(m);var i=CryptoJS.enc.Hex.stringify(f);var k=_rsapem_getHexValueArrayOfChildrenFromHex(i);var h=k[1];var l=h.substr(2);var e=_rsapem_getHexValueArrayOfChildrenFromHex(l);var j=new RSAKey();j.setPublic(e[0],e[1]);this.setRSAKey(j)}else{throw"key not supported"}};this.getASN1Object=function(){if(this.asn1AlgId==null||this.asn1SubjPKey==null){throw"algId and/or subjPubKey not set"}var e=new KJUR.asn1.DERSequence({array:[this.asn1AlgId,this.asn1SubjPKey]});return e};this.getEncodedHex=function(){var e=this.getASN1Object();this.hTLV=e.getEncodedHex();return this.hTLV};this._setRSAKey=function(e){var g=KJUR.asn1.ASN1Util.newObject({seq:[{"int":{bigint:e.n}},{"int":{"int":e.e}}]});var f=g.getEncodedHex();this.asn1AlgId=new KJUR.asn1.x509.AlgorithmIdentifier({name:"rsaEncryption"});this.asn1SubjPKey=new KJUR.asn1.DERBitString({hex:"00"+f})};this._setEC=function(e){var f=new KJUR.asn1.DERObjectIdentifier({name:e.curveName});this.asn1AlgId=new KJUR.asn1.x509.AlgorithmIdentifier({name:"ecPublicKey",asn1params:f});this.asn1SubjPKey=new KJUR.asn1.DERBitString({hex:"00"+e.pubKeyHex})};this._setDSA=function(e){var f=new KJUR.asn1.ASN1Util.newObject({seq:[{"int":{bigint:e.p}},{"int":{bigint:e.q}},{"int":{bigint:e.g}}]});this.asn1AlgId=new KJUR.asn1.x509.AlgorithmIdentifier({name:"dsa",asn1params:f});var g=new KJUR.asn1.DERInteger({bigint:e.y});this.asn1SubjPKey=new KJUR.asn1.DERBitString({hex:"00"+g.getEncodedHex()})};if(typeof d!="undefined"){if(typeof RSAKey!="undefined"&&d instanceof RSAKey){this._setRSAKey(d)}else{if(typeof KJUR.crypto.ECDSA!="undefined"&&d instanceof KJUR.crypto.ECDSA){this._setEC(d)}else{if(typeof KJUR.crypto.DSA!="undefined"&&d instanceof KJUR.crypto.DSA){this._setDSA(d)}else{if(typeof d.rsakey!="undefined"){this.setRSAKey(d.rsakey)}else{if(typeof d.rsapem!="undefined"){this.setRSAPEM(d.rsapem)}}}}}}};YAHOO.lang.extend(KJUR.asn1.x509.SubjectPublicKeyInfo,KJUR.asn1.ASN1Object);KJUR.asn1.x509.Time=function(c){KJUR.asn1.x509.Time.superclass.constructor.call(this);var b=null;var a=null;this.setTimeParams=function(d){this.timeParams=d};this.getEncodedHex=function(){var d=null;if(this.timeParams!=null){if(this.type=="utc"){d=new KJUR.asn1.DERUTCTime(this.timeParams)}else{d=new KJUR.asn1.DERGeneralizedTime(this.timeParams)}}else{if(this.type=="utc"){d=new KJUR.asn1.DERUTCTime()}else{d=new KJUR.asn1.DERGeneralizedTime()}}this.TLV=d.getEncodedHex();return this.TLV};this.type="utc";if(typeof c!="undefined"){if(typeof c.type!="undefined"){this.type=c.type}else{if(typeof c.str!="undefined"){if(c.str.match(/^[0-9]{12}Z$/)){this.type="utc"}if(c.str.match(/^[0-9]{14}Z$/)){this.type="gen"}}}this.timeParams=c}};YAHOO.lang.extend(KJUR.asn1.x509.Time,KJUR.asn1.ASN1Object);KJUR.asn1.x509.AlgorithmIdentifier=function(e){KJUR.asn1.x509.AlgorithmIdentifier.superclass.constructor.call(this);var a=null;var d=null;var b=null;var c=false;this.getEncodedHex=function(){if(this.nameAlg==null&&this.asn1Alg==null){throw"algorithm not specified"}if(this.nameAlg!=null&&this.asn1Alg==null){this.asn1Alg=KJUR.asn1.x509.OID.name2obj(this.nameAlg)}var f=[this.asn1Alg];if(!this.paramEmpty){f.push(this.asn1Params)}var g=new KJUR.asn1.DERSequence({array:f});this.hTLV=g.getEncodedHex();return this.hTLV};if(typeof e!="undefined"){if(typeof e.name!="undefined"){this.nameAlg=e.name}if(typeof e.asn1params!="undefined"){this.asn1Params=e.asn1params}if(typeof e.paramempty!="undefined"){this.paramEmpty=e.paramempty}}if(this.asn1Params==null){this.asn1Params=new KJUR.asn1.DERNull()}};YAHOO.lang.extend(KJUR.asn1.x509.AlgorithmIdentifier,KJUR.asn1.ASN1Object);KJUR.asn1.x509.GeneralName=function(d){KJUR.asn1.x509.GeneralName.superclass.constructor.call(this);var c=null;var b=null;var a={rfc822:"81",dns:"82",dn:"a4",uri:"86"};this.explicit=false;this.setByParam=function(k){var j=null;var g=null;if(typeof k=="undefined"){return}if(typeof k.rfc822!="undefined"){this.type="rfc822";g=new KJUR.asn1.DERIA5String({str:k[this.type]})}if(typeof k.dns!="undefined"){this.type="dns";g=new KJUR.asn1.DERIA5String({str:k[this.type]})}if(typeof k.uri!="undefined"){this.type="uri";g=new KJUR.asn1.DERIA5String({str:k[this.type]})}if(typeof k.certissuer!="undefined"){this.type="dn";this.explicit=true;var h=k.certissuer;var f=null;if(h.match(/^[0-9A-Fa-f]+$/)){f==h}if(h.indexOf("-----BEGIN ")!=-1){f=X509.pemToHex(h)}if(f==null){throw"certissuer param not cert"}var e=new X509();e.hex=f;var i=e.getIssuerHex();g=new KJUR.asn1.ASN1Object();g.hTLV=i}if(typeof k.certsubj!="undefined"){this.type="dn";this.explicit=true;var h=k.certsubj;var f=null;if(h.match(/^[0-9A-Fa-f]+$/)){f==h}if(h.indexOf("-----BEGIN ")!=-1){f=X509.pemToHex(h)}if(f==null){throw"certsubj param not cert"}var e=new X509();e.hex=f;var i=e.getSubjectHex();g=new KJUR.asn1.ASN1Object();g.hTLV=i}if(this.type==null){throw"unsupported type in params="+k}this.asn1Obj=new KJUR.asn1.DERTaggedObject({explicit:this.explicit,tag:a[this.type],obj:g})};this.getEncodedHex=function(){return this.asn1Obj.getEncodedHex()};if(typeof d!="undefined"){this.setByParam(d)}};YAHOO.lang.extend(KJUR.asn1.x509.GeneralName,KJUR.asn1.ASN1Object);KJUR.asn1.x509.GeneralNames=function(b){KJUR.asn1.x509.GeneralNames.superclass.constructor.call(this);var a=null;this.setByParamArray=function(e){for(var c=0;c<e.length;c++){var d=new KJUR.asn1.x509.GeneralName(e[c]);this.asn1Array.push(d)}};this.getEncodedHex=function(){var c=new KJUR.asn1.DERSequence({array:this.asn1Array});return c.getEncodedHex()};this.asn1Array=new Array();if(typeof b!="undefined"){this.setByParamArray(b)}};YAHOO.lang.extend(KJUR.asn1.x509.GeneralNames,KJUR.asn1.ASN1Object);KJUR.asn1.x509.DistributionPointName=function(b){KJUR.asn1.x509.DistributionPointName.superclass.constructor.call(this);var e=null;var c=null;var a=null;var d=null;this.getEncodedHex=function(){if(this.type!="full"){throw"currently type shall be 'full': "+this.type}this.asn1Obj=new KJUR.asn1.DERTaggedObject({explicit:false,tag:this.tag,obj:this.asn1V});this.hTLV=this.asn1Obj.getEncodedHex();return this.hTLV};if(typeof b!="undefined"){if(KJUR.asn1.x509.GeneralNames.prototype.isPrototypeOf(b)){this.type="full";this.tag="a0";this.asn1V=b}else{throw"This class supports GeneralNames only as argument"}}};YAHOO.lang.extend(KJUR.asn1.x509.DistributionPointName,KJUR.asn1.ASN1Object);KJUR.asn1.x509.DistributionPoint=function(b){KJUR.asn1.x509.DistributionPoint.superclass.constructor.call(this);var a=null;this.getEncodedHex=function(){var c=new KJUR.asn1.DERSequence();if(this.asn1DP!=null){var d=new KJUR.asn1.DERTaggedObject({explicit:true,tag:"a0",obj:this.asn1DP});c.appendASN1Object(d)}this.hTLV=c.getEncodedHex();return this.hTLV};if(typeof b!="undefined"){if(typeof b.dpobj!="undefined"){this.asn1DP=b.dpobj}}};YAHOO.lang.extend(KJUR.asn1.x509.DistributionPoint,KJUR.asn1.ASN1Object);KJUR.asn1.x509.OID=new function(a){this.atype2oidList={C:"2.5.4.6",O:"2.5.4.10",OU:"2.5.4.11",ST:"2.5.4.8",L:"2.5.4.7",CN:"2.5.4.3",SN:"2.5.4.4",DN:"2.5.4.49",DC:"0.9.2342.19200300.100.1.25",};this.name2oidList={sha1:"1.3.14.3.2.26",sha256:"2.16.840.1.101.3.4.2.1",sha384:"2.16.840.1.101.3.4.2.2",sha512:"2.16.840.1.101.3.4.2.3",sha224:"2.16.840.1.101.3.4.2.4",md5:"1.2.840.113549.2.5",md2:"1.3.14.7.2.2.1",ripemd160:"1.3.36.3.2.1",MD2withRSA:"1.2.840.113549.1.1.2",MD4withRSA:"1.2.840.113549.1.1.3",MD5withRSA:"1.2.840.113549.1.1.4",SHA1withRSA:"1.2.840.113549.1.1.5",SHA224withRSA:"1.2.840.113549.1.1.14",SHA256withRSA:"1.2.840.113549.1.1.11",SHA384withRSA:"1.2.840.113549.1.1.12",SHA512withRSA:"1.2.840.113549.1.1.13",SHA1withECDSA:"1.2.840.10045.4.1",SHA224withECDSA:"1.2.840.10045.4.3.1",SHA256withECDSA:"1.2.840.10045.4.3.2",SHA384withECDSA:"1.2.840.10045.4.3.3",SHA512withECDSA:"1.2.840.10045.4.3.4",dsa:"1.2.840.10040.4.1",SHA1withDSA:"1.2.840.10040.4.3",SHA224withDSA:"2.16.840.1.101.3.4.3.1",SHA256withDSA:"2.16.840.1.101.3.4.3.2",rsaEncryption:"1.2.840.113549.1.1.1",countryName:"2.5.4.6",organization:"2.5.4.10",organizationalUnit:"2.5.4.11",stateOrProvinceName:"2.5.4.8",locality:"2.5.4.7",commonName:"2.5.4.3",subjectKeyIdentifier:"2.5.29.14",keyUsage:"2.5.29.15",subjectAltName:"2.5.29.17",basicConstraints:"2.5.29.19",nameConstraints:"2.5.29.30",cRLDistributionPoints:"2.5.29.31",certificatePolicies:"2.5.29.32",authorityKeyIdentifier:"2.5.29.35",policyConstraints:"2.5.29.36",extKeyUsage:"2.5.29.37",authorityInfoAccess:"1.3.6.1.5.5.7.1.1",anyExtendedKeyUsage:"2.5.29.37.0",serverAuth:"1.3.6.1.5.5.7.3.1",clientAuth:"1.3.6.1.5.5.7.3.2",codeSigning:"1.3.6.1.5.5.7.3.3",emailProtection:"1.3.6.1.5.5.7.3.4",timeStamping:"1.3.6.1.5.5.7.3.8",ocspSigning:"1.3.6.1.5.5.7.3.9",ecPublicKey:"1.2.840.10045.2.1",secp256r1:"1.2.840.10045.3.1.7",secp256k1:"1.3.132.0.10",secp384r1:"1.3.132.0.34",pkcs5PBES2:"1.2.840.113549.1.5.13",pkcs5PBKDF2:"1.2.840.113549.1.5.12","des-EDE3-CBC":"1.2.840.113549.3.7",data:"1.2.840.113549.1.7.1","signed-data":"1.2.840.113549.1.7.2","enveloped-data":"1.2.840.113549.1.7.3","digested-data":"1.2.840.113549.1.7.5","encrypted-data":"1.2.840.113549.1.7.6","authenticated-data":"1.2.840.113549.1.9.16.1.2",tstinfo:"1.2.840.113549.1.9.16.1.4",};this.objCache={};this.name2obj=function(b){if(typeof this.objCache[b]!="undefined"){return this.objCache[b]}if(typeof this.name2oidList[b]=="undefined"){throw"Name of ObjectIdentifier not defined: "+b}var c=this.name2oidList[b];var d=new KJUR.asn1.DERObjectIdentifier({oid:c});this.objCache[b]=d;return d};this.atype2obj=function(b){if(typeof this.objCache[b]!="undefined"){return this.objCache[b]}if(typeof this.atype2oidList[b]=="undefined"){throw"AttributeType name undefined: "+b}var c=this.atype2oidList[b];var d=new KJUR.asn1.DERObjectIdentifier({oid:c});this.objCache[b]=d;return d}};KJUR.asn1.x509.OID.oid2name=function(b){var c=KJUR.asn1.x509.OID.name2oidList;for(var a in c){if(c[a]==b){return a}}return""};KJUR.asn1.x509.OID.name2oid=function(a){var b=KJUR.asn1.x509.OID.name2oidList;if(b[a]===undefined){return""}return b[a]};KJUR.asn1.x509.X509Util=new function(){this.getPKCS8PubKeyPEMfromRSAKey=function(i){var h=null;var f=KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(i.n);var j=KJUR.asn1.ASN1Util.integerToByteHex(i.e);var a=new KJUR.asn1.DERInteger({hex:f});var g=new KJUR.asn1.DERInteger({hex:j});var l=new KJUR.asn1.DERSequence({array:[a,g]});var c=l.getEncodedHex();var d=new KJUR.asn1.x509.AlgorithmIdentifier({name:"rsaEncryption"});var b=new KJUR.asn1.DERBitString({hex:"00"+c});var k=new KJUR.asn1.DERSequence({array:[d,b]});var e=k.getEncodedHex();var h=KJUR.asn1.ASN1Util.getPEMStringFromHex(e,"PUBLIC KEY");return h}};KJUR.asn1.x509.X509Util.newCertPEM=function(f){var c=KJUR.asn1.x509;var e=new c.TBSCertificate();if(f.serial!==undefined){e.setSerialNumberByParam(f.serial)}else{throw"serial number undefined."}if(typeof f.sigalg.name=="string"){e.setSignatureAlgByParam(f.sigalg)}else{throw"unproper signature algorithm name"}if(f.issuer!==undefined){e.setIssuerByParam(f.issuer)}else{throw"issuer name undefined."}if(f.notbefore!==undefined){e.setNotBeforeByParam(f.notbefore)}else{throw"notbefore undefined."}if(f.notafter!==undefined){e.setNotAfterByParam(f.notafter)}else{throw"notafter undefined."}if(f.subject!==undefined){e.setSubjectByParam(f.subject)}else{throw"subject name undefined."}if(f.sbjpubkey!==undefined){e.setSubjectPublicKeyByGetKey(f.sbjpubkey)}else{throw"subject public key undefined."}if(f.ext!==undefined&&f.ext.length!==undefined){for(var b=0;b<f.ext.length;b++){for(key in f.ext[b]){e.appendExtensionByName(key,f.ext[b][key])}}}if(f.cakey===undefined&&f.sighex===undefined){throw"param cakey and sighex undefined."}var d=null;var a=null;if(f.cakey){d=KEYUTIL.getKey.apply(null,f.cakey);a=new c.Certificate({tbscertobj:e,prvkeyobj:d});a.sign()}if(f.sighex){a=new c.Certificate({tbscertobj:e});a.setSignatureHex(f.sighex)}return a.getPEMString()};
	/*! asn1cms-1.0.2.js (c) 2013-2014 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	if(typeof KJUR=="undefined"||!KJUR){KJUR={}}if(typeof KJUR.asn1=="undefined"||!KJUR.asn1){KJUR.asn1={}}if(typeof KJUR.asn1.cms=="undefined"||!KJUR.asn1.cms){KJUR.asn1.cms={}}KJUR.asn1.cms.Attribute=function(b){KJUR.asn1.cms.Attribute.superclass.constructor.call(this);var a=[];this.getEncodedHex=function(){var f,e,c;f=new KJUR.asn1.DERObjectIdentifier({oid:this.attrTypeOid});e=new KJUR.asn1.DERSet({array:this.valueList});try{e.getEncodedHex()}catch(d){throw"fail valueSet.getEncodedHex in Attribute(1)/"+d}c=new KJUR.asn1.DERSequence({array:[f,e]});try{this.hTLV=c.getEncodedHex()}catch(d){throw"failed seq.getEncodedHex in Attribute(2)/"+d}return this.hTLV}};YAHOO.lang.extend(KJUR.asn1.cms.Attribute,KJUR.asn1.ASN1Object);KJUR.asn1.cms.ContentType=function(b){KJUR.asn1.cms.ContentType.superclass.constructor.call(this);this.attrTypeOid="1.2.840.113549.1.9.3";var a=null;if(typeof b!="undefined"){var a=new KJUR.asn1.DERObjectIdentifier(b);this.valueList=[a]}};YAHOO.lang.extend(KJUR.asn1.cms.ContentType,KJUR.asn1.cms.Attribute);KJUR.asn1.cms.MessageDigest=function(e){KJUR.asn1.cms.MessageDigest.superclass.constructor.call(this);this.attrTypeOid="1.2.840.113549.1.9.4";if(typeof e!="undefined"){if(e.eciObj instanceof KJUR.asn1.cms.EncapsulatedContentInfo&&typeof e.hashAlg=="string"){var b=e.eciObj.eContentValueHex;var a=e.hashAlg;var c=KJUR.crypto.Util.hashHex(b,a);var d=new KJUR.asn1.DEROctetString({hex:c});d.getEncodedHex();this.valueList=[d]}else{var d=new KJUR.asn1.DEROctetString(e);d.getEncodedHex();this.valueList=[d]}}};YAHOO.lang.extend(KJUR.asn1.cms.MessageDigest,KJUR.asn1.cms.Attribute);KJUR.asn1.cms.SigningTime=function(c){KJUR.asn1.cms.SigningTime.superclass.constructor.call(this);this.attrTypeOid="1.2.840.113549.1.9.5";if(typeof c!="undefined"){var a=new KJUR.asn1.x509.Time(c);try{a.getEncodedHex()}catch(b){throw"SigningTime.getEncodedHex() failed/"+b}this.valueList=[a]}};YAHOO.lang.extend(KJUR.asn1.cms.SigningTime,KJUR.asn1.cms.Attribute);KJUR.asn1.cms.SigningCertificate=function(d){KJUR.asn1.cms.SigningCertificate.superclass.constructor.call(this);this.attrTypeOid="1.2.840.113549.1.9.16.2.12";var a=KJUR.asn1;var c=KJUR.asn1.cms;var b=KJUR.crypto;this.setCerts=function(l){var j=[];for(var h=0;h<l.length;h++){var f=KEYUTIL.getHexFromPEM(l[h]);var e=b.Util.hashHex(f,"sha1");var m=new a.DEROctetString({hex:e});m.getEncodedHex();var k=new c.IssuerAndSerialNumber({cert:l[h]});k.getEncodedHex();var n=new a.DERSequence({array:[m,k]});n.getEncodedHex();j.push(n)}var g=new a.DERSequence({array:j});g.getEncodedHex();this.valueList=[g]};if(typeof d!="undefined"){if(typeof d.array=="object"){this.setCerts(d.array)}}};YAHOO.lang.extend(KJUR.asn1.cms.SigningCertificate,KJUR.asn1.cms.Attribute);KJUR.asn1.cms.SigningCertificateV2=function(e){KJUR.asn1.cms.SigningCertificateV2.superclass.constructor.call(this);this.attrTypeOid="1.2.840.113549.1.9.16.2.47";var b=KJUR.asn1;var f=KJUR.asn1.x509;var d=KJUR.asn1.cms;var c=KJUR.crypto;this.setCerts=function(p,h){var n=[];for(var l=0;l<p.length;l++){var j=KEYUTIL.getHexFromPEM(p[l]);var r=[];if(h!="sha256"){r.push(new f.AlgorithmIdentifier({name:h}))}var g=c.Util.hashHex(j,h);var q=new b.DEROctetString({hex:g});q.getEncodedHex();r.push(q);var m=new d.IssuerAndSerialNumber({cert:p[l]});m.getEncodedHex();r.push(m);var o=new b.DERSequence({array:r});o.getEncodedHex();n.push(o)}var k=new b.DERSequence({array:n});k.getEncodedHex();this.valueList=[k]};if(typeof e!="undefined"){if(typeof e.array=="object"){var a="sha256";if(typeof e.hashAlg=="string"){a=e.hashAlg}this.setCerts(e.array,a)}}};YAHOO.lang.extend(KJUR.asn1.cms.SigningCertificateV2,KJUR.asn1.cms.Attribute);KJUR.asn1.cms.IssuerAndSerialNumber=function(c){KJUR.asn1.cms.IssuerAndSerialNumber.superclass.constructor.call(this);var e=null;var b=null;var a=KJUR.asn1;var d=a.x509;this.setByCertPEM=function(i){var g=KEYUTIL.getHexFromPEM(i);var f=new X509();f.hex=g;var j=f.getIssuerHex();this.dIssuer=new d.X500Name();this.dIssuer.hTLV=j;var h=f.getSerialNumberHex();this.dSerial=new a.DERInteger({hex:h})};this.getEncodedHex=function(){var f=new KJUR.asn1.DERSequence({array:[this.dIssuer,this.dSerial]});this.hTLV=f.getEncodedHex();return this.hTLV};if(typeof c!="undefined"){if(typeof c=="string"&&c.indexOf("-----BEGIN ")!=-1){this.setByCertPEM(c)}if(c.issuer&&c.serial){if(c.issuer instanceof KJUR.asn1.x509.X500Name){this.dIssuer=c.issuer}else{this.dIssuer=new KJUR.asn1.x509.X500Name(c.issuer)}if(c.serial instanceof KJUR.asn1.DERInteger){this.dSerial=c.serial}else{this.dSerial=new KJUR.asn1.DERInteger(c.serial)}}if(typeof c.cert=="string"){this.setByCertPEM(c.cert)}}};YAHOO.lang.extend(KJUR.asn1.cms.IssuerAndSerialNumber,KJUR.asn1.ASN1Object);KJUR.asn1.cms.AttributeList=function(a){KJUR.asn1.cms.AttributeList.superclass.constructor.call(this);this.list=new Array();this.sortFlag=true;this.add=function(b){if(b instanceof KJUR.asn1.cms.Attribute){this.list.push(b)}};this.length=function(){return this.list.length};this.clear=function(){this.list=new Array();this.hTLV=null;this.hV=null};this.getEncodedHex=function(){if(typeof this.hTLV=="string"){return this.hTLV}var b=new KJUR.asn1.DERSet({array:this.list,sortflag:this.sortFlag});this.hTLV=b.getEncodedHex();return this.hTLV};if(typeof a!="undefined"){if(typeof a.sortflag!="undefined"&&a.sortflag==false){this.sortFlag=false}}};YAHOO.lang.extend(KJUR.asn1.cms.AttributeList,KJUR.asn1.ASN1Object);KJUR.asn1.cms.SignerInfo=function(c){KJUR.asn1.cms.SignerInfo.superclass.constructor.call(this);var a=KJUR.asn1;var b=KJUR.asn1.cms;var d=KJUR.asn1.x509;this.dCMSVersion=new a.DERInteger({"int":1});this.dSignerIdentifier=null;this.dDigestAlgorithm=null;this.dSignedAttrs=new b.AttributeList();this.dSigAlg=null;this.dSig=null;this.dUnsignedAttrs=new b.AttributeList();this.setSignerIdentifier=function(f){if(typeof f=="string"&&f.indexOf("CERTIFICATE")!=-1&&f.indexOf("BEGIN")!=-1&&f.indexOf("END")!=-1){var e=f;this.dSignerIdentifier=new b.IssuerAndSerialNumber({cert:f})}};this.setForContentAndHash=function(e){if(typeof e!="undefined"){if(e.eciObj instanceof KJUR.asn1.cms.EncapsulatedContentInfo){this.dSignedAttrs.add(new b.ContentType({oid:"1.2.840.113549.1.7.1"}));this.dSignedAttrs.add(new b.MessageDigest({eciObj:e.eciObj,hashAlg:e.hashAlg}))}if(typeof e.sdObj!="undefined"&&e.sdObj instanceof KJUR.asn1.cms.SignedData){if(e.sdObj.digestAlgNameList.join(":").indexOf(e.hashAlg)==-1){e.sdObj.digestAlgNameList.push(e.hashAlg)}}if(typeof e.hashAlg=="string"){this.dDigestAlgorithm=new d.AlgorithmIdentifier({name:e.hashAlg})}}};this.sign=function(j,f){this.dSigAlg=new d.AlgorithmIdentifier({name:f});var g=this.dSignedAttrs.getEncodedHex();var e=KEYUTIL.getKey(j);var i=new KJUR.crypto.Signature({alg:f});i.init(e);i.updateHex(g);var h=i.sign();this.dSig=new a.DEROctetString({hex:h})};this.addUnsigned=function(e){this.hTLV=null;this.dUnsignedAttrs.hTLV=null;this.dUnsignedAttrs.add(e)};this.getEncodedHex=function(){if(this.dSignedAttrs instanceof KJUR.asn1.cms.AttributeList&&this.dSignedAttrs.length()==0){throw"SignedAttrs length = 0 (empty)"}var e=new a.DERTaggedObject({obj:this.dSignedAttrs,tag:"a0",explicit:false});var h=null;if(this.dUnsignedAttrs.length()>0){h=new a.DERTaggedObject({obj:this.dUnsignedAttrs,tag:"a1",explicit:false})}var g=[this.dCMSVersion,this.dSignerIdentifier,this.dDigestAlgorithm,e,this.dSigAlg,this.dSig,];if(h!=null){g.push(h)}var f=new a.DERSequence({array:g});this.hTLV=f.getEncodedHex();return this.hTLV}};YAHOO.lang.extend(KJUR.asn1.cms.SignerInfo,KJUR.asn1.ASN1Object);KJUR.asn1.cms.EncapsulatedContentInfo=function(c){KJUR.asn1.cms.EncapsulatedContentInfo.superclass.constructor.call(this);var a=KJUR.asn1;var b=KJUR.asn1.cms;var d=KJUR.asn1.x509;this.dEContentType=new a.DERObjectIdentifier({name:"data"});this.dEContent=null;this.isDetached=false;this.eContentValueHex=null;this.setContentType=function(e){if(e.match(/^[0-2][.][0-9.]+$/)){this.dEContentType=new a.DERObjectIdentifier({oid:e})}else{this.dEContentType=new a.DERObjectIdentifier({name:e})}};this.setContentValue=function(e){if(typeof e!="undefined"){if(typeof e.hex=="string"){this.eContentValueHex=e.hex}else{if(typeof e.str=="string"){this.eContentValueHex=utf8tohex(e.str)}}}};this.setContentValueHex=function(e){this.eContentValueHex=e};this.setContentValueStr=function(e){this.eContentValueHex=utf8tohex(e)};this.getEncodedHex=function(){if(typeof this.eContentValueHex!="string"){throw"eContentValue not yet set"}var g=new a.DEROctetString({hex:this.eContentValueHex});this.dEContent=new a.DERTaggedObject({obj:g,tag:"a0",explicit:true});var e=[this.dEContentType];if(!this.isDetached){e.push(this.dEContent)}var f=new a.DERSequence({array:e});this.hTLV=f.getEncodedHex();return this.hTLV}};YAHOO.lang.extend(KJUR.asn1.cms.EncapsulatedContentInfo,KJUR.asn1.ASN1Object);KJUR.asn1.cms.ContentInfo=function(c){KJUR.asn1.cms.ContentInfo.superclass.constructor.call(this);var a=KJUR.asn1;var b=KJUR.asn1.cms;var d=KJUR.asn1.x509;this.dContentType=null;this.dContent=null;this.setContentType=function(e){if(typeof e=="string"){this.dContentType=d.OID.name2obj(e)}};this.getEncodedHex=function(){var f=new a.DERTaggedObject({obj:this.dContent,tag:"a0",explicit:true});var e=new a.DERSequence({array:[this.dContentType,f]});this.hTLV=e.getEncodedHex();return this.hTLV};if(typeof c!="undefined"){if(c.type){this.setContentType(c.type)}if(c.obj&&c.obj instanceof a.ASN1Object){this.dContent=c.obj}}};YAHOO.lang.extend(KJUR.asn1.cms.ContentInfo,KJUR.asn1.ASN1Object);KJUR.asn1.cms.SignedData=function(c){KJUR.asn1.cms.SignedData.superclass.constructor.call(this);var a=KJUR.asn1;var b=KJUR.asn1.cms;var d=KJUR.asn1.x509;this.dCMSVersion=new a.DERInteger({"int":1});this.dDigestAlgs=null;this.digestAlgNameList=[];this.dEncapContentInfo=new b.EncapsulatedContentInfo();this.dCerts=null;this.certificateList=[];this.crlList=[];this.signerInfoList=[new b.SignerInfo()];this.addCertificatesByPEM=function(e){var f=KEYUTIL.getHexFromPEM(e);var g=new a.ASN1Object();g.hTLV=f;this.certificateList.push(g)};this.getEncodedHex=function(){if(typeof this.hTLV=="string"){return this.hTLV}if(this.dDigestAlgs==null){var k=[];for(var j=0;j<this.digestAlgNameList.length;j++){var h=this.digestAlgNameList[j];var m=new d.AlgorithmIdentifier({name:h});k.push(m)}this.dDigestAlgs=new a.DERSet({array:k})}var e=[this.dCMSVersion,this.dDigestAlgs,this.dEncapContentInfo];if(this.dCerts==null){if(this.certificateList.length>0){var l=new a.DERSet({array:this.certificateList});this.dCerts=new a.DERTaggedObject({obj:l,tag:"a0",explicit:false})}}if(this.dCerts!=null){e.push(this.dCerts)}var g=new a.DERSet({array:this.signerInfoList});e.push(g);var f=new a.DERSequence({array:e});this.hTLV=f.getEncodedHex();return this.hTLV};this.getContentInfo=function(){this.getEncodedHex();var e=new b.ContentInfo({type:"signed-data",obj:this});return e};this.getContentInfoEncodedHex=function(){var e=this.getContentInfo();var f=e.getEncodedHex();return f};this.getPEM=function(){var e=this.getContentInfoEncodedHex();var f=a.ASN1Util.getPEMStringFromHex(e,"CMS");return f}};YAHOO.lang.extend(KJUR.asn1.cms.SignedData,KJUR.asn1.ASN1Object);KJUR.asn1.cms.CMSUtil=new function(){};KJUR.asn1.cms.CMSUtil.newSignedData=function(a){var h=KJUR.asn1.cms;var g=KJUR.asn1.cades;var f=new h.SignedData();f.dEncapContentInfo.setContentValue(a.content);if(typeof a.certs=="object"){for(var b=0;b<a.certs.length;b++){f.addCertificatesByPEM(a.certs[b])}}f.signerInfoList=[];for(var b=0;b<a.signerInfos.length;b++){var d=a.signerInfos[b];var c=new h.SignerInfo();c.setSignerIdentifier(d.signerCert);c.setForContentAndHash({sdObj:f,eciObj:f.dEncapContentInfo,hashAlg:d.hashAlg});for(attrName in d.sAttr){var j=d.sAttr[attrName];if(attrName=="SigningTime"){var e=new h.SigningTime(j);c.dSignedAttrs.add(e)}if(attrName=="SigningCertificate"){var e=new h.SigningCertificate(j);c.dSignedAttrs.add(e)}if(attrName=="SigningCertificateV2"){var e=new h.SigningCertificateV2(j);c.dSignedAttrs.add(e)}if(attrName=="SignaturePolicyIdentifier"){var e=new g.SignaturePolicyIdentifier(j);c.dSignedAttrs.add(e)}}c.sign(d.signerPrvKey,d.sigAlg);f.signerInfoList.push(c)}return f};
	/*! asn1tsp-1.0.1.js (c) 2014 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	if(typeof KJUR=="undefined"||!KJUR){KJUR={}}if(typeof KJUR.asn1=="undefined"||!KJUR.asn1){KJUR.asn1={}}if(typeof KJUR.asn1.tsp=="undefined"||!KJUR.asn1.tsp){KJUR.asn1.tsp={}}KJUR.asn1.tsp.Accuracy=function(b){KJUR.asn1.tsp.Accuracy.superclass.constructor.call(this);var a=KJUR.asn1;this.seconds=null;this.millis=null;this.micros=null;this.getEncodedHex=function(){var e=null;var g=null;var i=null;var c=[];if(this.seconds!=null){e=new a.DERInteger({"int":this.seconds});c.push(e)}if(this.millis!=null){var h=new a.DERInteger({"int":this.millis});g=new a.DERTaggedObject({obj:h,tag:"80",explicit:false});c.push(g)}if(this.micros!=null){var f=new a.DERInteger({"int":this.micros});i=new a.DERTaggedObject({obj:f,tag:"81",explicit:false});c.push(i)}var d=new a.DERSequence({array:c});this.hTLV=d.getEncodedHex();return this.hTLV};if(typeof b!="undefined"){if(typeof b.seconds=="number"){this.seconds=b.seconds}if(typeof b.millis=="number"){this.millis=b.millis}if(typeof b.micros=="number"){this.micros=b.micros}}};YAHOO.lang.extend(KJUR.asn1.tsp.Accuracy,KJUR.asn1.ASN1Object);KJUR.asn1.tsp.MessageImprint=function(b){KJUR.asn1.tsp.MessageImprint.superclass.constructor.call(this);var a=KJUR.asn1;var c=KJUR.asn1.x509;this.dHashAlg=null;this.dHashValue=null;this.getEncodedHex=function(){if(typeof this.hTLV=="string"){return this.hTLV}var d=new a.DERSequence({array:[this.dHashAlg,this.dHashValue]});return d.getEncodedHex()};if(typeof b!="undefined"){if(typeof b.hashAlg=="string"){this.dHashAlg=new c.AlgorithmIdentifier({name:b.hashAlg})}if(typeof b.hashValue=="string"){this.dHashValue=new a.DEROctetString({hex:b.hashValue})}}};YAHOO.lang.extend(KJUR.asn1.tsp.MessageImprint,KJUR.asn1.ASN1Object);KJUR.asn1.tsp.TimeStampReq=function(c){KJUR.asn1.tsp.TimeStampReq.superclass.constructor.call(this);var a=KJUR.asn1;var b=KJUR.asn1.tsp;this.dVersion=new a.DERInteger({"int":1});this.dMessageImprint=null;this.dPolicy=null;this.dNonce=null;this.certReq=true;this.setMessageImprint=function(d){if(d instanceof KJUR.asn1.tsp.MessageImprint){this.dMessageImprint=d;return}if(typeof d=="object"){this.dMessageImprint=new b.MessageImprint(d)}};this.getEncodedHex=function(){if(this.dMessageImprint==null){throw"messageImprint shall be specified"}var d=[this.dVersion,this.dMessageImprint];if(this.dPolicy!=null){d.push(this.dPolicy)}if(this.dNonce!=null){d.push(this.dNonce)}if(this.certReq){d.push(new a.DERBoolean())}var e=new a.DERSequence({array:d});this.hTLV=e.getEncodedHex();return this.hTLV};if(typeof c!="undefined"){if(typeof c.mi=="object"){this.setMessageImprint(c.mi)}if(typeof c.policy=="object"){this.dPolicy=new a.DERObjectIdentifier(c.policy)}if(typeof c.nonce=="object"){this.dNonce=new a.DERInteger(c.nonce)}if(typeof c.certreq=="boolean"){this.certReq=c.certreq}}};YAHOO.lang.extend(KJUR.asn1.tsp.TimeStampReq,KJUR.asn1.ASN1Object);KJUR.asn1.tsp.TSTInfo=function(c){KJUR.asn1.tsp.TSTInfo.superclass.constructor.call(this);var a=KJUR.asn1;var d=KJUR.asn1.x509;var b=KJUR.asn1.tsp;this.dVersion=new a.DERInteger({"int":1});this.dPolicy=null;this.dMessageImprint=null;this.dSerialNumber=null;this.dGenTime=null;this.dAccuracy=null;this.dOrdering=null;this.dNonce=null;this.dTsa=null;this.getEncodedHex=function(){var e=[this.dVersion];if(this.dPolicy==null){throw"policy shall be specified."}e.push(this.dPolicy);if(this.dMessageImprint==null){throw"messageImprint shall be specified."}e.push(this.dMessageImprint);if(this.dSerialNumber==null){throw"serialNumber shall be specified."}e.push(this.dSerialNumber);if(this.dGenTime==null){throw"genTime shall be specified."}e.push(this.dGenTime);if(this.dAccuracy!=null){e.push(this.dAccuracy)}if(this.dOrdering!=null){e.push(this.dOrdering)}if(this.dNonce!=null){e.push(this.dNonce)}if(this.dTsa!=null){e.push(this.dTsa)}var f=new a.DERSequence({array:e});this.hTLV=f.getEncodedHex();return this.hTLV};if(typeof c!="undefined"){if(typeof c.policy=="string"){if(!c.policy.match(/^[0-9.]+$/)){throw"policy shall be oid like 0.1.4.134"}this.dPolicy=new a.DERObjectIdentifier({oid:c.policy})}if(typeof c.messageImprint!="undefined"){this.dMessageImprint=new b.MessageImprint(c.messageImprint)}if(typeof c.serialNumber!="undefined"){this.dSerialNumber=new a.DERInteger(c.serialNumber)}if(typeof c.genTime!="undefined"){this.dGenTime=new a.DERGeneralizedTime(c.genTime)}if(typeof c.accuracy!="undefind"){this.dAccuracy=new b.Accuracy(c.accuracy)}if(typeof c.ordering!="undefined"&&c.ordering==true){this.dOrdering=new a.DERBoolean()}if(typeof c.nonce!="undefined"){this.dNonce=new a.DERInteger(c.nonce)}if(typeof c.tsa!="undefined"){this.dTsa=new d.X500Name(c.tsa)}}};YAHOO.lang.extend(KJUR.asn1.tsp.TSTInfo,KJUR.asn1.ASN1Object);KJUR.asn1.tsp.TimeStampResp=function(c){KJUR.asn1.tsp.TimeStampResp.superclass.constructor.call(this);var a=KJUR.asn1;var b=KJUR.asn1.tsp;this.dStatus=null;this.dTST=null;this.getEncodedHex=function(){if(this.dStatus==null){throw"status shall be specified"}var d=[this.dStatus];if(this.dTST!=null){d.push(this.dTST)}var e=new a.DERSequence({array:d});this.hTLV=e.getEncodedHex();return this.hTLV};if(typeof c!="undefined"){if(typeof c.status=="object"){this.dStatus=new b.PKIStatusInfo(c.status)}if(typeof c.tst!="undefined"&&c.tst instanceof KJUR.asn1.ASN1Object){this.dTST=c.tst.getContentInfo()}}};YAHOO.lang.extend(KJUR.asn1.tsp.TimeStampResp,KJUR.asn1.ASN1Object);KJUR.asn1.tsp.PKIStatusInfo=function(c){KJUR.asn1.tsp.PKIStatusInfo.superclass.constructor.call(this);var a=KJUR.asn1;var b=KJUR.asn1.tsp;this.dStatus=null;this.dStatusString=null;this.dFailureInfo=null;this.getEncodedHex=function(){if(this.dStatus==null){throw"status shall be specified"}var d=[this.dStatus];if(this.dStatusString!=null){d.push(this.dStatusString)}if(this.dFailureInfo!=null){d.push(this.dFailureInfo)}var e=new a.DERSequence({array:d});this.hTLV=e.getEncodedHex();return this.hTLV};if(typeof c!="undefined"){if(typeof c.status=="object"){this.dStatus=new b.PKIStatus(c.status)}if(typeof c.statstr=="object"){this.dStatusString=new b.PKIFreeText({array:c.statstr})}if(typeof c.failinfo=="object"){this.dFailureInfo=new b.PKIFailureInfo(c.failinfo)}}};YAHOO.lang.extend(KJUR.asn1.tsp.PKIStatusInfo,KJUR.asn1.ASN1Object);KJUR.asn1.tsp.PKIStatus=function(e){KJUR.asn1.tsp.PKIStatus.superclass.constructor.call(this);var a=KJUR.asn1;var b=KJUR.asn1.tsp;var d=null;this.getEncodedHex=function(){this.hTLV=this.dStatus.getEncodedHex();return this.hTLV};if(typeof e!="undefined"){if(typeof e.name!="undefined"){var c=b.PKIStatus.valueList;if(typeof c[e.name]=="undefined"){throw"name undefined: "+e.name}this.dStatus=new a.DERInteger({"int":c[e.name]})}else{this.dStatus=new a.DERInteger(e)}}};YAHOO.lang.extend(KJUR.asn1.tsp.PKIStatus,KJUR.asn1.ASN1Object);KJUR.asn1.tsp.PKIStatus.valueList={granted:0,grantedWithMods:1,rejection:2,waiting:3,revocationWarning:4,revocationNotification:5};KJUR.asn1.tsp.PKIFreeText=function(b){KJUR.asn1.tsp.PKIFreeText.superclass.constructor.call(this);var a=KJUR.asn1;this.textList=[];this.getEncodedHex=function(){var c=[];for(var e=0;e<this.textList.length;e++){c.push(new a.DERUTF8String({str:this.textList[e]}))}var d=new a.DERSequence({array:c});this.hTLV=d.getEncodedHex();return this.hTLV};if(typeof b!="undefined"){if(typeof b.array=="object"){this.textList=b.array}}};YAHOO.lang.extend(KJUR.asn1.tsp.PKIFreeText,KJUR.asn1.ASN1Object);KJUR.asn1.tsp.PKIFailureInfo=function(d){KJUR.asn1.tsp.PKIFailureInfo.superclass.constructor.call(this);var a=KJUR.asn1;var b=KJUR.asn1.tsp;this.value=null;this.getEncodedHex=function(){if(this.value==null){throw"value shall be specified"}var e=new Number(this.value).toString(2);var f=new a.DERBitString();f.setByBinaryString(e);this.hTLV=f.getEncodedHex();return this.hTLV};if(typeof d!="undefined"){if(typeof d.name=="string"){var c=b.PKIFailureInfo.valueList;if(typeof c[d.name]=="undefined"){throw"name undefined: "+d.name}this.value=c[d.name]}else{if(typeof d["int"]=="number"){this.value=d["int"]}}}};YAHOO.lang.extend(KJUR.asn1.tsp.PKIFailureInfo,KJUR.asn1.ASN1Object);KJUR.asn1.tsp.PKIFailureInfo.valueList={badAlg:0,badRequest:2,badDataFormat:5,timeNotAvailable:14,unacceptedPolicy:15,unacceptedExtension:16,addInfoNotAvailable:17,systemFailure:25};KJUR.asn1.tsp.AbstractTSAAdapter=function(a){this.getTSTHex=function(c,b){throw"not implemented yet"}};KJUR.asn1.tsp.SimpleTSAAdapter=function(a){KJUR.asn1.tsp.SimpleTSAAdapter.superclass.constructor.call(this);this.params=null;this.serial=0;this.getTSTHex=function(c,b){var e=KJUR.crypto.Util.hashHex(c,b);this.params.tstInfo.messageImprint={hashAlg:b,hashValue:e};this.params.tstInfo.serialNumber={"int":this.serial++};var d=Math.floor(Math.random()*1000000000);this.params.tstInfo.nonce={"int":d};var f=KJUR.asn1.tsp.TSPUtil.newTimeStampToken(this.params);return f.getContentInfoEncodedHex()};if(typeof a!="undefined"){this.params=a}};YAHOO.lang.extend(KJUR.asn1.tsp.SimpleTSAAdapter,KJUR.asn1.tsp.AbstractTSAAdapter);KJUR.asn1.tsp.FixedTSAAdapter=function(a){KJUR.asn1.tsp.FixedTSAAdapter.superclass.constructor.call(this);this.params=null;this.getTSTHex=function(c,b){var d=KJUR.crypto.Util.hashHex(c,b);this.params.tstInfo.messageImprint={hashAlg:b,hashValue:d};var e=KJUR.asn1.tsp.TSPUtil.newTimeStampToken(this.params);return e.getContentInfoEncodedHex()};if(typeof a!="undefined"){this.params=a}};YAHOO.lang.extend(KJUR.asn1.tsp.FixedTSAAdapter,KJUR.asn1.tsp.AbstractTSAAdapter);KJUR.asn1.tsp.TSPUtil=new function(){};KJUR.asn1.tsp.TSPUtil.newTimeStampToken=function(b){var j=KJUR.asn1.cms;var a=KJUR.asn1.tsp;var g=new j.SignedData();var e=new a.TSTInfo(b.tstInfo);var f=e.getEncodedHex();g.dEncapContentInfo.setContentValue({hex:f});g.dEncapContentInfo.setContentType("tstinfo");if(typeof b.certs=="object"){for(var c=0;c<b.certs.length;c++){g.addCertificatesByPEM(b.certs[c])}}var d=g.signerInfoList[0];d.setSignerIdentifier(b.signerCert);d.setForContentAndHash({sdObj:g,eciObj:g.dEncapContentInfo,hashAlg:b.hashAlg});var h=new j.SigningCertificate({array:[b.signerCert]});d.dSignedAttrs.add(h);d.sign(b.signerPrvKey,b.sigAlg);return g};KJUR.asn1.tsp.TSPUtil.parseTimeStampReq=function(d){var f={};f.certreq=false;var h=ASN1HEX.getPosArrayOfChildren_AtObj(d,0);if(h.length<2){throw"TimeStampReq must have at least 2 items"}var c=ASN1HEX.getHexOfTLV_AtObj(d,h[1]);f.mi=KJUR.asn1.tsp.TSPUtil.parseMessageImprint(c);for(var e=2;e<h.length;e++){var b=h[e];var a=d.substr(b,2);if(a=="06"){var g=ASN1HEX.getHexOfV_AtObj(d,b);f.policy=ASN1HEX.hextooidstr(g)}if(a=="02"){f.nonce=ASN1HEX.getHexOfV_AtObj(d,b)}if(a=="01"){f.certreq=true}}return f};KJUR.asn1.tsp.TSPUtil.parseMessageImprint=function(c){var h={};if(c.substr(0,2)!="30"){throw"head of messageImprint hex shall be '30'"}var a=ASN1HEX.getPosArrayOfChildren_AtObj(c,0);var i=ASN1HEX.getDecendantIndexByNthList(c,0,[0,0]);var d=ASN1HEX.getHexOfV_AtObj(c,i);var e=ASN1HEX.hextooidstr(d);var g=KJUR.asn1.x509.OID.oid2name(e);if(g==""){throw"hashAlg name undefined: "+e}var b=g;var f=ASN1HEX.getDecendantIndexByNthList(c,0,[1]);h.hashAlg=b;h.hashValue=ASN1HEX.getHexOfV_AtObj(c,f);return h};
	/*! asn1cades-1.0.0.js (c) 2013-2014 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	if(typeof KJUR=="undefined"||!KJUR){KJUR={}}if(typeof KJUR.asn1=="undefined"||!KJUR.asn1){KJUR.asn1={}}if(typeof KJUR.asn1.cades=="undefined"||!KJUR.asn1.cades){KJUR.asn1.cades={}}KJUR.asn1.cades.SignaturePolicyIdentifier=function(e){KJUR.asn1.cades.SignaturePolicyIdentifier.superclass.constructor.call(this);this.attrTypeOid="1.2.840.113549.1.9.16.2.15";var b=KJUR.asn1;var d=KJUR.asn1.cades;if(typeof e!="undefined"){if(typeof e.oid=="string"&&typeof e.hash=="object"){var f=new b.DERObjectIdentifier({oid:e.oid});var a=new d.OtherHashAlgAndValue(e.hash);var c=new b.DERSequence({array:[f,a]});this.valueList=[c]}}};YAHOO.lang.extend(KJUR.asn1.cades.SignaturePolicyIdentifier,KJUR.asn1.cms.Attribute);KJUR.asn1.cades.OtherHashAlgAndValue=function(b){KJUR.asn1.cades.OtherHashAlgAndValue.superclass.constructor.call(this);var a=KJUR.asn1;var c=KJUR.asn1.x509;this.dAlg=null;this.dHash=null;this.getEncodedHex=function(){var d=new a.DERSequence({array:[this.dAlg,this.dHash]});this.hTLV=d.getEncodedHex();return this.hTLV};if(typeof b!="undefined"){if(typeof b.alg=="string"&&typeof b.hash=="string"){this.dAlg=new c.AlgorithmIdentifier({name:b.alg});this.dHash=new a.DEROctetString({hex:b.hash})}}};YAHOO.lang.extend(KJUR.asn1.cades.OtherHashAlgAndValue,KJUR.asn1.ASN1Object);KJUR.asn1.cades.SignatureTimeStamp=function(c){KJUR.asn1.cades.SignatureTimeStamp.superclass.constructor.call(this);this.attrTypeOid="1.2.840.113549.1.9.16.2.14";this.tstHex=null;var a=KJUR.asn1;if(typeof c!="undefined"){if(typeof c.res!="undefined"){if(typeof c.res=="string"&&c.res.match(/^[0-9A-Fa-f]+$/)){}else{if(c.res instanceof KJUR.asn1.ASN1Object){}else{throw"res param shall be ASN1Object or hex string"}}}if(typeof c.tst!="undefined"){if(typeof c.tst=="string"&&c.tst.match(/^[0-9A-Fa-f]+$/)){var b=new a.ASN1Object();this.tstHex=c.tst;b.hTLV=this.tstHex;b.getEncodedHex();this.valueList=[b]}else{if(c.tst instanceof KJUR.asn1.ASN1Object){}else{throw"tst param shall be ASN1Object or hex string"}}}}};YAHOO.lang.extend(KJUR.asn1.cades.SignatureTimeStamp,KJUR.asn1.cms.Attribute);KJUR.asn1.cades.CompleteCertificateRefs=function(c){KJUR.asn1.cades.CompleteCertificateRefs.superclass.constructor.call(this);this.attrTypeOid="1.2.840.113549.1.9.16.2.21";var a=KJUR.asn1;var b=KJUR.asn1.cades;this.setByArray=function(d){this.valueList=[];for(var e=0;e<d.length;e++){var f=new b.OtherCertID(d[e]);this.valueList.push(f)}};if(typeof c!="undefined"){if(typeof c=="object"&&typeof c.length=="number"){this.setByArray(c)}}};YAHOO.lang.extend(KJUR.asn1.cades.CompleteCertificateRefs,KJUR.asn1.cms.Attribute);KJUR.asn1.cades.OtherCertID=function(d){KJUR.asn1.cades.OtherCertID.superclass.constructor.call(this);var a=KJUR.asn1;var c=KJUR.asn1.cms;var b=KJUR.asn1.cades;this.hasIssuerSerial=true;this.dOtherCertHash=null;this.dIssuerSerial=null;this.setByCertPEM=function(e){this.dOtherCertHash=new b.OtherHash(e);if(this.hasIssuerSerial){this.dIssuerSerial=new c.IssuerAndSerialNumber(e)}};this.getEncodedHex=function(){if(this.hTLV!=null){return this.hTLV}if(this.dOtherCertHash==null){throw"otherCertHash not set"}var e=[this.dOtherCertHash];if(this.dIssuerSerial!=null){e.push(this.dIssuerSerial)}var f=new a.DERSequence({array:e});this.hTLV=f.getEncodedHex();return this.hTLV};if(typeof d!="undefined"){if(typeof d=="string"&&d.indexOf("-----BEGIN ")!=-1){this.setByCertPEM(d)}if(typeof d=="object"){if(d.hasis===false){this.hasIssuerSerial=false}if(typeof d.cert=="string"){this.setByCertPEM(d.cert)}}}};YAHOO.lang.extend(KJUR.asn1.cades.OtherCertID,KJUR.asn1.ASN1Object);KJUR.asn1.cades.OtherHash=function(c){KJUR.asn1.cades.OtherHash.superclass.constructor.call(this);var a=KJUR.asn1;var b=KJUR.asn1.cades;this.alg="sha256";this.dOtherHash=null;this.setByCertPEM=function(d){if(d.indexOf("-----BEGIN ")==-1){throw"certPEM not to seem PEM format"}var e=X509.pemToHex(d);var f=KJUR.crypto.Util.hashHex(e,this.alg);this.dOtherHash=new b.OtherHashAlgAndValue({alg:this.alg,hash:f})};this.getEncodedHex=function(){if(this.dOtherHash==null){throw"OtherHash not set"}return this.dOtherHash.getEncodedHex()};if(typeof c!="undefined"){if(typeof c=="string"){if(c.indexOf("-----BEGIN ")!=-1){this.setByCertPEM(c)}else{if(c.match(/^[0-9A-Fa-f]+$/)){this.dOtherHash=new a.DEROctetString({hex:c})}else{throw"unsupported string value for params"}}}else{if(typeof c=="object"){if(typeof c.cert=="string"){if(typeof c.alg=="string"){this.alg=c.alg}this.setByCertPEM(c.cert)}else{this.dOtherHash=new b.OtherHashAlgAndValue(c)}}}}};YAHOO.lang.extend(KJUR.asn1.cades.OtherHash,KJUR.asn1.ASN1Object);KJUR.asn1.cades.CAdESUtil=new function(){};KJUR.asn1.cades.CAdESUtil.addSigTS=function(c,b,a){};KJUR.asn1.cades.CAdESUtil.parseSignedDataForAddingUnsigned=function(d){var q=KJUR.asn1;var p=KJUR.asn1.cms;var c=KJUR.asn1.cades.CAdESUtil;var a={};if(ASN1HEX.getDecendantHexTLVByNthList(d,0,[0])!="06092a864886f70d010702"){throw"hex is not CMS SignedData"}var s=ASN1HEX.getDecendantIndexByNthList(d,0,[1,0]);var b=ASN1HEX.getPosArrayOfChildren_AtObj(d,s);if(b.length<4){throw"num of SignedData elem shall be 4 at least"}var f=b.shift();a.version=ASN1HEX.getHexOfTLV_AtObj(d,f);var l=b.shift();a.algs=ASN1HEX.getHexOfTLV_AtObj(d,l);var m=b.shift();a.encapcontent=ASN1HEX.getHexOfTLV_AtObj(d,m);a.certs=null;a.revs=null;a.si=[];var n=b.shift();if(d.substr(n,2)=="a0"){a.certs=ASN1HEX.getHexOfTLV_AtObj(d,n);n=b.shift()}if(d.substr(n,2)=="a1"){a.revs=ASN1HEX.getHexOfTLV_AtObj(d,n);n=b.shift()}var k=n;if(d.substr(k,2)!="31"){throw"Can't find signerInfos"}var j=ASN1HEX.getPosArrayOfChildren_AtObj(d,k);for(var h=0;h<j.length;h++){var o=j[h];var e=c.parseSignerInfoForAddingUnsigned(d,o,h);a.si[h]=e}var g=null;a.obj=new p.SignedData();g=new q.ASN1Object();g.hTLV=a.version;a.obj.dCMSVersion=g;g=new q.ASN1Object();g.hTLV=a.algs;a.obj.dDigestAlgs=g;g=new q.ASN1Object();g.hTLV=a.encapcontent;a.obj.dEncapContentInfo=g;g=new q.ASN1Object();g.hTLV=a.certs;a.obj.dCerts=g;a.obj.signerInfoList=[];for(var h=0;h<a.si.length;h++){a.obj.signerInfoList.push(a.si[h].obj)}return a};KJUR.asn1.cades.CAdESUtil.parseSignerInfoForAddingUnsigned=function(d,k,a){var m=KJUR.asn1;var l=KJUR.asn1.cms;var b={};var e=ASN1HEX.getPosArrayOfChildren_AtObj(d,k);if(e.length!=6){throw"not supported items for SignerInfo (!=6)"}var f=e.shift();b.version=ASN1HEX.getHexOfTLV_AtObj(d,f);var n=e.shift();b.si=ASN1HEX.getHexOfTLV_AtObj(d,n);var h=e.shift();b.digalg=ASN1HEX.getHexOfTLV_AtObj(d,h);var c=e.shift();b.sattrs=ASN1HEX.getHexOfTLV_AtObj(d,c);var i=e.shift();b.sigalg=ASN1HEX.getHexOfTLV_AtObj(d,i);var j=e.shift();b.sig=ASN1HEX.getHexOfTLV_AtObj(d,j);b.sigval=ASN1HEX.getHexOfV_AtObj(d,j);var g=null;b.obj=new l.SignerInfo();g=new m.ASN1Object();g.hTLV=b.version;b.obj.dCMSVersion=g;g=new m.ASN1Object();g.hTLV=b.si;b.obj.dSignerIdentifier=g;g=new m.ASN1Object();g.hTLV=b.digalg;b.obj.dDigestAlgorithm=g;g=new m.ASN1Object();g.hTLV=b.sattrs;b.obj.dSignedAttrs=g;g=new m.ASN1Object();g.hTLV=b.sigalg;b.obj.dSigAlg=g;g=new m.ASN1Object();g.hTLV=b.sig;b.obj.dSig=g;b.obj.dUnsignedAttrs=new l.AttributeList();return b};
	/*! asn1csr-1.0.0.js (c) 2015 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	if(typeof KJUR.asn1.csr=="undefined"||!KJUR.asn1.csr){KJUR.asn1.csr={}}KJUR.asn1.csr.CertificationRequest=function(f){KJUR.asn1.csr.CertificationRequest.superclass.constructor.call(this);var b=null;var d=null;var e=null;var c=null;var a=null;this.sign=function(i,h){if(this.prvKey==null){this.prvKey=h}this.asn1SignatureAlg=new KJUR.asn1.x509.AlgorithmIdentifier({name:i});sig=new KJUR.crypto.Signature({alg:i});sig.initSign(this.prvKey);sig.updateHex(this.asn1CSRInfo.getEncodedHex());this.hexSig=sig.sign();this.asn1Sig=new KJUR.asn1.DERBitString({hex:"00"+this.hexSig});var g=new KJUR.asn1.DERSequence({array:[this.asn1CSRInfo,this.asn1SignatureAlg,this.asn1Sig]});this.hTLV=g.getEncodedHex();this.isModified=false};this.getPEMString=function(){var g=KJUR.asn1.ASN1Util.getPEMStringFromHex(this.getEncodedHex(),"CERTIFICATE REQUEST");return g};this.getEncodedHex=function(){if(this.isModified==false&&this.hTLV!=null){return this.hTLV}throw"not signed yet"};if(typeof f!="undefined"){if(typeof f.csrinfo!="undefined"){this.asn1CSRInfo=f.csrinfo}}};YAHOO.lang.extend(KJUR.asn1.csr.CertificationRequest,KJUR.asn1.ASN1Object);KJUR.asn1.csr.CertificationRequestInfo=function(a){KJUR.asn1.csr.CertificationRequestInfo.superclass.constructor.call(this);this._initialize=function(){this.asn1Array=new Array();this.asn1Version=new KJUR.asn1.DERInteger({"int":0});this.asn1Subject=null;this.asn1SubjPKey=null;this.extensionsArray=new Array()};this.setSubjectByParam=function(b){this.asn1Subject=new KJUR.asn1.x509.X500Name(b)};this.setSubjectPublicKeyByGetKey=function(c){var b=KEYUTIL.getKey(c);this.asn1SubjPKey=new KJUR.asn1.x509.SubjectPublicKeyInfo(b)};this.getEncodedHex=function(){this.asn1Array=new Array();this.asn1Array.push(this.asn1Version);this.asn1Array.push(this.asn1Subject);this.asn1Array.push(this.asn1SubjPKey);var c=new KJUR.asn1.DERSequence({array:this.extensionsArray});var b=new KJUR.asn1.DERTaggedObject({explicit:false,tag:"a0",obj:c});this.asn1Array.push(b);var d=new KJUR.asn1.DERSequence({array:this.asn1Array});this.hTLV=d.getEncodedHex();this.isModified=false;return this.hTLV};this._initialize()};YAHOO.lang.extend(KJUR.asn1.csr.CertificationRequestInfo,KJUR.asn1.ASN1Object);KJUR.asn1.csr.CSRUtil=new function(){};KJUR.asn1.csr.CSRUtil.newCSRPEM=function(f){var c=KJUR.asn1.csr;if(f.subject===undefined){throw"parameter subject undefined"}if(f.sbjpubkey===undefined){throw"parameter sbjpubkey undefined"}if(f.sigalg===undefined){throw"parameter sigalg undefined"}if(f.sbjprvkey===undefined){throw"parameter sbjpubkey undefined"}var b=new c.CertificationRequestInfo();b.setSubjectByParam(f.subject);b.setSubjectPublicKeyByGetKey(f.sbjpubkey);var d=new c.CertificationRequest({csrinfo:b});var a=KEYUTIL.getKey(f.sbjprvkey);d.sign(f.sigalg,a);var e=d.getPEMString();return e};
	/*! base64x-1.1.6 (c) 2012-2015 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	function Base64x(){}function stoBA(d){var b=new Array();for(var c=0;c<d.length;c++){b[c]=d.charCodeAt(c)}return b}function BAtos(b){var d="";for(var c=0;c<b.length;c++){d=d+String.fromCharCode(b[c])}return d}function BAtohex(b){var e="";for(var d=0;d<b.length;d++){var c=b[d].toString(16);if(c.length==1){c="0"+c}e=e+c}return e}function stohex(a){return BAtohex(stoBA(a))}function stob64(a){return hex2b64(stohex(a))}function stob64u(a){return b64tob64u(hex2b64(stohex(a)))}function b64utos(a){return BAtos(b64toBA(b64utob64(a)))}function b64tob64u(a){a=a.replace(/\=/g,"");a=a.replace(/\+/g,"-");a=a.replace(/\//g,"_");return a}function b64utob64(a){if(a.length%4==2){a=a+"=="}else{if(a.length%4==3){a=a+"="}}a=a.replace(/-/g,"+");a=a.replace(/_/g,"/");return a}function hextob64u(a){if(a.length%2==1){a="0"+a}return b64tob64u(hex2b64(a))}function b64utohex(a){return b64tohex(b64utob64(a))}var utf8tob64u,b64utoutf8;if(typeof Buffer==="function"){utf8tob64u=function(a){return b64tob64u(new Buffer(a,"utf8").toString("base64"))};b64utoutf8=function(a){return new Buffer(b64utob64(a),"base64").toString("utf8")}}else{utf8tob64u=function(a){return hextob64u(uricmptohex(encodeURIComponentAll(a)))};b64utoutf8=function(a){return decodeURIComponent(hextouricmp(b64utohex(a)))}}function utf8tob64(a){return hex2b64(uricmptohex(encodeURIComponentAll(a)))}function b64toutf8(a){return decodeURIComponent(hextouricmp(b64tohex(a)))}function utf8tohex(a){return uricmptohex(encodeURIComponentAll(a))}function hextoutf8(a){return decodeURIComponent(hextouricmp(a))}function hextorstr(c){var b="";for(var a=0;a<c.length-1;a+=2){b+=String.fromCharCode(parseInt(c.substr(a,2),16))}return b}function rstrtohex(c){var a="";for(var b=0;b<c.length;b++){a+=("0"+c.charCodeAt(b).toString(16)).slice(-2)}return a}function hextob64(a){return hex2b64(a)}function hextob64nl(b){var a=hextob64(b);var c=a.replace(/(.{64})/g,"$1\r\n");c=c.replace(/\r\n$/,"");return c}function b64nltohex(b){var a=b.replace(/[^0-9A-Za-z\/+=]*/g,"");var c=b64tohex(a);return c}function uricmptohex(a){return a.replace(/%/g,"")}function hextouricmp(a){return a.replace(/(..)/g,"%$1")}function encodeURIComponentAll(a){var d=encodeURIComponent(a);var b="";for(var c=0;c<d.length;c++){if(d[c]=="%"){b=b+d.substr(c,3);c=c+2}else{b=b+"%"+stohex(d[c])}}return b}function newline_toUnix(a){a=a.replace(/\r\n/mg,"\n");return a}function newline_toDos(a){a=a.replace(/\r\n/mg,"\n");a=a.replace(/\n/mg,"\r\n");return a}function intarystrtohex(b){b=b.replace(/^\s*\[\s*/,"");b=b.replace(/\s*\]\s*$/,"");b=b.replace(/\s*/g,"");try{var c=b.split(/,/).map(function(g,e,h){var f=parseInt(g);if(f<0||255<f){throw"integer not in range 0-255"}var d=("00"+f.toString(16)).slice(-2);return d}).join("");return c}catch(a){throw"malformed integer array string: "+a}}var strdiffidx=function(c,a){var d=c.length;if(c.length>a.length){d=a.length}for(var b=0;b<d;b++){if(c.charCodeAt(b)!=a.charCodeAt(b)){return b}}if(c.length!=a.length){return d}return -1};
	/*! crypto-1.1.8.js (c) 2013-2016 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	if(typeof KJUR=="undefined"||!KJUR){KJUR={}}if(typeof KJUR.crypto=="undefined"||!KJUR.crypto){KJUR.crypto={}}KJUR.crypto.Util=new function(){this.DIGESTINFOHEAD={sha1:"3021300906052b0e03021a05000414",sha224:"302d300d06096086480165030402040500041c",sha256:"3031300d060960864801650304020105000420",sha384:"3041300d060960864801650304020205000430",sha512:"3051300d060960864801650304020305000440",md2:"3020300c06082a864886f70d020205000410",md5:"3020300c06082a864886f70d020505000410",ripemd160:"3021300906052b2403020105000414",};this.DEFAULTPROVIDER={md5:"cryptojs",sha1:"cryptojs",sha224:"cryptojs",sha256:"cryptojs",sha384:"cryptojs",sha512:"cryptojs",ripemd160:"cryptojs",hmacmd5:"cryptojs",hmacsha1:"cryptojs",hmacsha224:"cryptojs",hmacsha256:"cryptojs",hmacsha384:"cryptojs",hmacsha512:"cryptojs",hmacripemd160:"cryptojs",MD5withRSA:"cryptojs/jsrsa",SHA1withRSA:"cryptojs/jsrsa",SHA224withRSA:"cryptojs/jsrsa",SHA256withRSA:"cryptojs/jsrsa",SHA384withRSA:"cryptojs/jsrsa",SHA512withRSA:"cryptojs/jsrsa",RIPEMD160withRSA:"cryptojs/jsrsa",MD5withECDSA:"cryptojs/jsrsa",SHA1withECDSA:"cryptojs/jsrsa",SHA224withECDSA:"cryptojs/jsrsa",SHA256withECDSA:"cryptojs/jsrsa",SHA384withECDSA:"cryptojs/jsrsa",SHA512withECDSA:"cryptojs/jsrsa",RIPEMD160withECDSA:"cryptojs/jsrsa",SHA1withDSA:"cryptojs/jsrsa",SHA224withDSA:"cryptojs/jsrsa",SHA256withDSA:"cryptojs/jsrsa",MD5withRSAandMGF1:"cryptojs/jsrsa",SHA1withRSAandMGF1:"cryptojs/jsrsa",SHA224withRSAandMGF1:"cryptojs/jsrsa",SHA256withRSAandMGF1:"cryptojs/jsrsa",SHA384withRSAandMGF1:"cryptojs/jsrsa",SHA512withRSAandMGF1:"cryptojs/jsrsa",RIPEMD160withRSAandMGF1:"cryptojs/jsrsa",};this.CRYPTOJSMESSAGEDIGESTNAME={md5:CryptoJS.algo.MD5,sha1:CryptoJS.algo.SHA1,sha224:CryptoJS.algo.SHA224,sha256:CryptoJS.algo.SHA256,sha384:CryptoJS.algo.SHA384,sha512:CryptoJS.algo.SHA512,ripemd160:CryptoJS.algo.RIPEMD160};this.getDigestInfoHex=function(a,b){if(typeof this.DIGESTINFOHEAD[b]=="undefined"){throw"alg not supported in Util.DIGESTINFOHEAD: "+b}return this.DIGESTINFOHEAD[b]+a};this.getPaddedDigestInfoHex=function(h,a,j){var c=this.getDigestInfoHex(h,a);var d=j/4;if(c.length+22>d){throw"key is too short for SigAlg: keylen="+j+","+a}var b="0001";var k="00"+c;var g="";var l=d-b.length-k.length;for(var f=0;f<l;f+=2){g+="ff"}var e=b+g+k;return e};this.hashString=function(a,c){var b=new KJUR.crypto.MessageDigest({alg:c});return b.digestString(a)};this.hashHex=function(b,c){var a=new KJUR.crypto.MessageDigest({alg:c});return a.digestHex(b)};this.sha1=function(a){var b=new KJUR.crypto.MessageDigest({alg:"sha1",prov:"cryptojs"});return b.digestString(a)};this.sha256=function(a){var b=new KJUR.crypto.MessageDigest({alg:"sha256",prov:"cryptojs"});return b.digestString(a)};this.sha256Hex=function(a){var b=new KJUR.crypto.MessageDigest({alg:"sha256",prov:"cryptojs"});return b.digestHex(a)};this.sha512=function(a){var b=new KJUR.crypto.MessageDigest({alg:"sha512",prov:"cryptojs"});return b.digestString(a)};this.sha512Hex=function(a){var b=new KJUR.crypto.MessageDigest({alg:"sha512",prov:"cryptojs"});return b.digestHex(a)};this.md5=function(a){var b=new KJUR.crypto.MessageDigest({alg:"md5",prov:"cryptojs"});return b.digestString(a)};this.ripemd160=function(a){var b=new KJUR.crypto.MessageDigest({alg:"ripemd160",prov:"cryptojs"});return b.digestString(a)};this.getCryptoJSMDByName=function(a){}};KJUR.crypto.MessageDigest=function(c){var b=null;var a=null;var d=null;this.setAlgAndProvider=function(g,f){if(g!=null&&f===undefined){f=KJUR.crypto.Util.DEFAULTPROVIDER[g]}if(":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(g)!=-1&&f=="cryptojs"){try{this.md=KJUR.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[g].create()}catch(e){throw"setAlgAndProvider hash alg set fail alg="+g+"/"+e}this.updateString=function(h){this.md.update(h)};this.updateHex=function(h){var i=CryptoJS.enc.Hex.parse(h);this.md.update(i)};this.digest=function(){var h=this.md.finalize();return h.toString(CryptoJS.enc.Hex)};this.digestString=function(h){this.updateString(h);return this.digest()};this.digestHex=function(h){this.updateHex(h);return this.digest()}}if(":sha256:".indexOf(g)!=-1&&f=="sjcl"){try{this.md=new sjcl.hash.sha256()}catch(e){throw"setAlgAndProvider hash alg set fail alg="+g+"/"+e}this.updateString=function(h){this.md.update(h)};this.updateHex=function(i){var h=sjcl.codec.hex.toBits(i);this.md.update(h)};this.digest=function(){var h=this.md.finalize();return sjcl.codec.hex.fromBits(h)};this.digestString=function(h){this.updateString(h);return this.digest()};this.digestHex=function(h){this.updateHex(h);return this.digest()}}};this.updateString=function(e){throw"updateString(str) not supported for this alg/prov: "+this.algName+"/"+this.provName};this.updateHex=function(e){throw"updateHex(hex) not supported for this alg/prov: "+this.algName+"/"+this.provName};this.digest=function(){throw"digest() not supported for this alg/prov: "+this.algName+"/"+this.provName};this.digestString=function(e){throw"digestString(str) not supported for this alg/prov: "+this.algName+"/"+this.provName};this.digestHex=function(e){throw"digestHex(hex) not supported for this alg/prov: "+this.algName+"/"+this.provName};if(c!==undefined){if(c.alg!==undefined){this.algName=c.alg;if(c.prov===undefined){this.provName=KJUR.crypto.Util.DEFAULTPROVIDER[this.algName]}this.setAlgAndProvider(this.algName,this.provName)}}};KJUR.crypto.Mac=function(d){var f=null;var c=null;var a=null;var e=null;var b=null;this.setAlgAndProvider=function(k,i){k=k.toLowerCase();if(k==null){k="hmacsha1"}k=k.toLowerCase();if(k.substr(0,4)!="hmac"){throw"setAlgAndProvider unsupported HMAC alg: "+k}if(i===undefined){i=KJUR.crypto.Util.DEFAULTPROVIDER[k]}this.algProv=k+"/"+i;var g=k.substr(4);if(":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(g)!=-1&&i=="cryptojs"){try{var j=KJUR.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[g];this.mac=CryptoJS.algo.HMAC.create(j,this.pass)}catch(h){throw"setAlgAndProvider hash alg set fail hashAlg="+g+"/"+h}this.updateString=function(l){this.mac.update(l)};this.updateHex=function(l){var m=CryptoJS.enc.Hex.parse(l);this.mac.update(m)};this.doFinal=function(){var l=this.mac.finalize();return l.toString(CryptoJS.enc.Hex)};this.doFinalString=function(l){this.updateString(l);return this.doFinal()};this.doFinalHex=function(l){this.updateHex(l);return this.doFinal()}}};this.updateString=function(g){throw"updateString(str) not supported for this alg/prov: "+this.algProv};this.updateHex=function(g){throw"updateHex(hex) not supported for this alg/prov: "+this.algProv};this.doFinal=function(){throw"digest() not supported for this alg/prov: "+this.algProv};this.doFinalString=function(g){throw"digestString(str) not supported for this alg/prov: "+this.algProv};this.doFinalHex=function(g){throw"digestHex(hex) not supported for this alg/prov: "+this.algProv};this.setPassword=function(h){if(typeof h=="string"){var g=h;if(h.length%2==1||!h.match(/^[0-9A-Fa-f]+$/)){g=rstrtohex(h)}this.pass=CryptoJS.enc.Hex.parse(g);return}if(typeof h!="object"){throw"KJUR.crypto.Mac unsupported password type: "+h}var g=null;if(h.hex!==undefined){if(h.hex.length%2!=0||!h.hex.match(/^[0-9A-Fa-f]+$/)){throw"Mac: wrong hex password: "+h.hex}g=h.hex}if(h.utf8!==undefined){g=utf8tohex(h.utf8)}if(h.rstr!==undefined){g=rstrtohex(h.rstr)}if(h.b64!==undefined){g=b64tohex(h.b64)}if(h.b64u!==undefined){g=b64utohex(h.b64u)}if(g==null){throw"KJUR.crypto.Mac unsupported password type: "+h}this.pass=CryptoJS.enc.Hex.parse(g)};if(d!==undefined){if(d.pass!==undefined){this.setPassword(d.pass)}if(d.alg!==undefined){this.algName=d.alg;if(d.prov===undefined){this.provName=KJUR.crypto.Util.DEFAULTPROVIDER[this.algName]}this.setAlgAndProvider(this.algName,this.provName)}}};KJUR.crypto.Signature=function(o){var q=null;var n=null;var r=null;var c=null;var l=null;var d=null;var k=null;var h=null;var p=null;var e=null;var b=-1;var g=null;var j=null;var a=null;var i=null;var f=null;this._setAlgNames=function(){if(this.algName.match(/^(.+)with(.+)$/)){this.mdAlgName=RegExp.$1.toLowerCase();this.pubkeyAlgName=RegExp.$2.toLowerCase()}};this._zeroPaddingOfSignature=function(x,w){var v="";var t=w/4-x.length;for(var u=0;u<t;u++){v=v+"0"}return v+x};this.setAlgAndProvider=function(u,t){this._setAlgNames();if(t!="cryptojs/jsrsa"){throw"provider not supported: "+t}if(":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(this.mdAlgName)!=-1){try{this.md=new KJUR.crypto.MessageDigest({alg:this.mdAlgName})}catch(s){throw"setAlgAndProvider hash alg set fail alg="+this.mdAlgName+"/"+s}this.init=function(w,x){var y=null;try{if(x===undefined){y=KEYUTIL.getKey(w)}else{y=KEYUTIL.getKey(w,x)}}catch(v){throw"init failed:"+v}if(y.isPrivate===true){this.prvKey=y;this.state="SIGN"}else{if(y.isPublic===true){this.pubKey=y;this.state="VERIFY"}else{throw"init failed.:"+y}}};this.initSign=function(v){if(typeof v.ecprvhex=="string"&&typeof v.eccurvename=="string"){this.ecprvhex=v.ecprvhex;this.eccurvename=v.eccurvename}else{this.prvKey=v}this.state="SIGN"};this.initVerifyByPublicKey=function(v){if(typeof v.ecpubhex=="string"&&typeof v.eccurvename=="string"){this.ecpubhex=v.ecpubhex;this.eccurvename=v.eccurvename}else{if(v instanceof KJUR.crypto.ECDSA){this.pubKey=v}else{if(v instanceof RSAKey){this.pubKey=v}}}this.state="VERIFY"};this.initVerifyByCertificatePEM=function(v){var w=new X509();w.readCertPEM(v);this.pubKey=w.subjectPublicKeyRSA;this.state="VERIFY"};this.updateString=function(v){this.md.updateString(v)};this.updateHex=function(v){this.md.updateHex(v)};this.sign=function(){this.sHashHex=this.md.digest();if(typeof this.ecprvhex!="undefined"&&typeof this.eccurvename!="undefined"){var v=new KJUR.crypto.ECDSA({curve:this.eccurvename});this.hSign=v.signHex(this.sHashHex,this.ecprvhex)}else{if(this.prvKey instanceof RSAKey&&this.pubkeyAlgName=="rsaandmgf1"){this.hSign=this.prvKey.signWithMessageHashPSS(this.sHashHex,this.mdAlgName,this.pssSaltLen)}else{if(this.prvKey instanceof RSAKey&&this.pubkeyAlgName=="rsa"){this.hSign=this.prvKey.signWithMessageHash(this.sHashHex,this.mdAlgName)}else{if(this.prvKey instanceof KJUR.crypto.ECDSA){this.hSign=this.prvKey.signWithMessageHash(this.sHashHex)}else{if(this.prvKey instanceof KJUR.crypto.DSA){this.hSign=this.prvKey.signWithMessageHash(this.sHashHex)}else{throw"Signature: unsupported public key alg: "+this.pubkeyAlgName}}}}}return this.hSign};this.signString=function(v){this.updateString(v);return this.sign()};this.signHex=function(v){this.updateHex(v);return this.sign()};this.verify=function(v){this.sHashHex=this.md.digest();if(typeof this.ecpubhex!="undefined"&&typeof this.eccurvename!="undefined"){var w=new KJUR.crypto.ECDSA({curve:this.eccurvename});return w.verifyHex(this.sHashHex,v,this.ecpubhex)}else{if(this.pubKey instanceof RSAKey&&this.pubkeyAlgName=="rsaandmgf1"){return this.pubKey.verifyWithMessageHashPSS(this.sHashHex,v,this.mdAlgName,this.pssSaltLen)}else{if(this.pubKey instanceof RSAKey&&this.pubkeyAlgName=="rsa"){return this.pubKey.verifyWithMessageHash(this.sHashHex,v)}else{if(this.pubKey instanceof KJUR.crypto.ECDSA){return this.pubKey.verifyWithMessageHash(this.sHashHex,v)}else{if(this.pubKey instanceof KJUR.crypto.DSA){return this.pubKey.verifyWithMessageHash(this.sHashHex,v)}else{throw"Signature: unsupported public key alg: "+this.pubkeyAlgName}}}}}}}};this.init=function(s,t){throw"init(key, pass) not supported for this alg:prov="+this.algProvName};this.initVerifyByPublicKey=function(s){throw"initVerifyByPublicKey(rsaPubKeyy) not supported for this alg:prov="+this.algProvName};this.initVerifyByCertificatePEM=function(s){throw"initVerifyByCertificatePEM(certPEM) not supported for this alg:prov="+this.algProvName};this.initSign=function(s){throw"initSign(prvKey) not supported for this alg:prov="+this.algProvName};this.updateString=function(s){throw"updateString(str) not supported for this alg:prov="+this.algProvName};this.updateHex=function(s){throw"updateHex(hex) not supported for this alg:prov="+this.algProvName};this.sign=function(){throw"sign() not supported for this alg:prov="+this.algProvName};this.signString=function(s){throw"digestString(str) not supported for this alg:prov="+this.algProvName};this.signHex=function(s){throw"digestHex(hex) not supported for this alg:prov="+this.algProvName};this.verify=function(s){throw"verify(hSigVal) not supported for this alg:prov="+this.algProvName};this.initParams=o;if(o!==undefined){if(o.alg!==undefined){this.algName=o.alg;if(o.prov===undefined){this.provName=KJUR.crypto.Util.DEFAULTPROVIDER[this.algName]}else{this.provName=o.prov}this.algProvName=this.algName+":"+this.provName;this.setAlgAndProvider(this.algName,this.provName);this._setAlgNames()}if(o.psssaltlen!==undefined){this.pssSaltLen=o.psssaltlen}if(o.prvkeypem!==undefined){if(o.prvkeypas!==undefined){throw"both prvkeypem and prvkeypas parameters not supported"}else{try{var q=new RSAKey();q.readPrivateKeyFromPEMString(o.prvkeypem);this.initSign(q)}catch(m){throw"fatal error to load pem private key: "+m}}}}};KJUR.crypto.OID=new function(){this.oidhex2name={"2a864886f70d010101":"rsaEncryption","2a8648ce3d0201":"ecPublicKey","2a8648ce380401":"dsa","2a8648ce3d030107":"secp256r1","2b8104001f":"secp192k1","2b81040021":"secp224r1","2b8104000a":"secp256k1","2b81040023":"secp521r1","2b81040022":"secp384r1","2a8648ce380403":"SHA1withDSA","608648016503040301":"SHA224withDSA","608648016503040302":"SHA256withDSA",}};
	/*! ecdsa-modified-1.0.4.js (c) Stephan Thomas, Kenji Urushima | github.com/bitcoinjs/bitcoinjs-lib/blob/master/LICENSE
	 */
	if(typeof KJUR=="undefined"||!KJUR){KJUR={}}if(typeof KJUR.crypto=="undefined"||!KJUR.crypto){KJUR.crypto={}}KJUR.crypto.ECDSA=function(h){var e="secp256r1";var g=null;var b=null;var f=null;var a=new SecureRandom();var d=null;this.type="EC";function c(s,o,r,n){var j=Math.max(o.bitLength(),n.bitLength());var t=s.add2D(r);var q=s.curve.getInfinity();for(var p=j-1;p>=0;--p){q=q.twice2D();q.z=BigInteger.ONE;if(o.testBit(p)){if(n.testBit(p)){q=q.add2D(t)}else{q=q.add2D(s)}}else{if(n.testBit(p)){q=q.add2D(r)}}}return q}this.getBigRandom=function(i){return new BigInteger(i.bitLength(),a).mod(i.subtract(BigInteger.ONE)).add(BigInteger.ONE)};this.setNamedCurve=function(i){this.ecparams=KJUR.crypto.ECParameterDB.getByName(i);this.prvKeyHex=null;this.pubKeyHex=null;this.curveName=i};this.setPrivateKeyHex=function(i){this.isPrivate=true;this.prvKeyHex=i};this.setPublicKeyHex=function(i){this.isPublic=true;this.pubKeyHex=i};this.generateKeyPairHex=function(){var k=this.ecparams.n;var n=this.getBigRandom(k);var l=this.ecparams.G.multiply(n);var q=l.getX().toBigInteger();var o=l.getY().toBigInteger();var i=this.ecparams.keylen/4;var m=("0000000000"+n.toString(16)).slice(-i);var r=("0000000000"+q.toString(16)).slice(-i);var p=("0000000000"+o.toString(16)).slice(-i);var j="04"+r+p;this.setPrivateKeyHex(m);this.setPublicKeyHex(j);return{ecprvhex:m,ecpubhex:j}};this.signWithMessageHash=function(i){return this.signHex(i,this.prvKeyHex)};this.signHex=function(o,j){var t=new BigInteger(j,16);var l=this.ecparams.n;var q=new BigInteger(o,16);do{var m=this.getBigRandom(l);var u=this.ecparams.G;var p=u.multiply(m);var i=p.getX().toBigInteger().mod(l)}while(i.compareTo(BigInteger.ZERO)<=0);var v=m.modInverse(l).multiply(q.add(t.multiply(i))).mod(l);return KJUR.crypto.ECDSA.biRSSigToASN1Sig(i,v)};this.sign=function(m,u){var q=u;var j=this.ecparams.n;var p=BigInteger.fromByteArrayUnsigned(m);do{var l=this.getBigRandom(j);var t=this.ecparams.G;var o=t.multiply(l);var i=o.getX().toBigInteger().mod(j)}while(i.compareTo(BigInteger.ZERO)<=0);var v=l.modInverse(j).multiply(p.add(q.multiply(i))).mod(j);return this.serializeSig(i,v)};this.verifyWithMessageHash=function(j,i){return this.verifyHex(j,i,this.pubKeyHex)};this.verifyHex=function(m,i,p){var l,j;var o=KJUR.crypto.ECDSA.parseSigHex(i);l=o.r;j=o.s;var k;k=ECPointFp.decodeFromHex(this.ecparams.curve,p);var n=new BigInteger(m,16);return this.verifyRaw(n,l,j,k)};this.verify=function(o,p,j){var l,i;if(Bitcoin.Util.isArray(p)){var n=this.parseSig(p);l=n.r;i=n.s}else{if("object"===typeof p&&p.r&&p.s){l=p.r;i=p.s}else{throw"Invalid value for signature"}}var k;if(j instanceof ECPointFp){k=j}else{if(Bitcoin.Util.isArray(j)){k=ECPointFp.decodeFrom(this.ecparams.curve,j)}else{throw"Invalid format for pubkey value, must be byte array or ECPointFp"}}var m=BigInteger.fromByteArrayUnsigned(o);return this.verifyRaw(m,l,i,k)};this.verifyRaw=function(o,i,w,m){var l=this.ecparams.n;var u=this.ecparams.G;if(i.compareTo(BigInteger.ONE)<0||i.compareTo(l)>=0){return false}if(w.compareTo(BigInteger.ONE)<0||w.compareTo(l)>=0){return false}var p=w.modInverse(l);var k=o.multiply(p).mod(l);var j=i.multiply(p).mod(l);var q=u.multiply(k).add(m.multiply(j));var t=q.getX().toBigInteger().mod(l);return t.equals(i)};this.serializeSig=function(k,j){var l=k.toByteArraySigned();var i=j.toByteArraySigned();var m=[];m.push(2);m.push(l.length);m=m.concat(l);m.push(2);m.push(i.length);m=m.concat(i);m.unshift(m.length);m.unshift(48);return m};this.parseSig=function(n){var m;if(n[0]!=48){throw new Error("Signature not a valid DERSequence")}m=2;if(n[m]!=2){throw new Error("First element in signature must be a DERInteger")}var l=n.slice(m+2,m+2+n[m+1]);m+=2+n[m+1];if(n[m]!=2){throw new Error("Second element in signature must be a DERInteger")}var i=n.slice(m+2,m+2+n[m+1]);m+=2+n[m+1];var k=BigInteger.fromByteArrayUnsigned(l);var j=BigInteger.fromByteArrayUnsigned(i);return{r:k,s:j}};this.parseSigCompact=function(m){if(m.length!==65){throw"Signature has the wrong length"}var j=m[0]-27;if(j<0||j>7){throw"Invalid signature type"}var o=this.ecparams.n;var l=BigInteger.fromByteArrayUnsigned(m.slice(1,33)).mod(o);var k=BigInteger.fromByteArrayUnsigned(m.slice(33,65)).mod(o);return{r:l,s:k,i:j}};if(h!==undefined){if(h.curve!==undefined){this.curveName=h.curve}}if(this.curveName===undefined){this.curveName=e}this.setNamedCurve(this.curveName);if(h!==undefined){if(h.prv!==undefined){this.setPrivateKeyHex(h.prv)}if(h.pub!==undefined){this.setPublicKeyHex(h.pub)}}};KJUR.crypto.ECDSA.parseSigHex=function(a){var b=KJUR.crypto.ECDSA.parseSigHexInHexRS(a);var d=new BigInteger(b.r,16);var c=new BigInteger(b.s,16);return{r:d,s:c}};KJUR.crypto.ECDSA.parseSigHexInHexRS=function(c){if(c.substr(0,2)!="30"){throw"signature is not a ASN.1 sequence"}var b=ASN1HEX.getPosArrayOfChildren_AtObj(c,0);if(b.length!=2){throw"number of signature ASN.1 sequence elements seem wrong"}var g=b[0];var f=b[1];if(c.substr(g,2)!="02"){throw"1st item of sequene of signature is not ASN.1 integer"}if(c.substr(f,2)!="02"){throw"2nd item of sequene of signature is not ASN.1 integer"}var e=ASN1HEX.getHexOfV_AtObj(c,g);var d=ASN1HEX.getHexOfV_AtObj(c,f);return{r:e,s:d}};KJUR.crypto.ECDSA.asn1SigToConcatSig=function(c){var d=KJUR.crypto.ECDSA.parseSigHexInHexRS(c);var b=d.r;var a=d.s;if(b.substr(0,2)=="00"&&(((b.length/2)*8)%(16*8))==8){b=b.substr(2)}if(a.substr(0,2)=="00"&&(((a.length/2)*8)%(16*8))==8){a=a.substr(2)}if((((b.length/2)*8)%(16*8))!=0){throw"unknown ECDSA sig r length error"}if((((a.length/2)*8)%(16*8))!=0){throw"unknown ECDSA sig s length error"}return b+a};KJUR.crypto.ECDSA.concatSigToASN1Sig=function(a){if((((a.length/2)*8)%(16*8))!=0){throw"unknown ECDSA concatinated r-s sig  length error"}var c=a.substr(0,a.length/2);var b=a.substr(a.length/2);return KJUR.crypto.ECDSA.hexRSSigToASN1Sig(c,b)};KJUR.crypto.ECDSA.hexRSSigToASN1Sig=function(b,a){var d=new BigInteger(b,16);var c=new BigInteger(a,16);return KJUR.crypto.ECDSA.biRSSigToASN1Sig(d,c)};KJUR.crypto.ECDSA.biRSSigToASN1Sig=function(e,c){var b=new KJUR.asn1.DERInteger({bigint:e});var a=new KJUR.asn1.DERInteger({bigint:c});var d=new KJUR.asn1.DERSequence({array:[b,a]});return d.getEncodedHex()};
	/*! ecparam-1.0.0.js (c) 2013 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	if(typeof KJUR=="undefined"||!KJUR){KJUR={}}if(typeof KJUR.crypto=="undefined"||!KJUR.crypto){KJUR.crypto={}}KJUR.crypto.ECParameterDB=new function(){var b={};var c={};function a(d){return new BigInteger(d,16)}this.getByName=function(e){var d=e;if(typeof c[d]!="undefined"){d=c[e]}if(typeof b[d]!="undefined"){return b[d]}throw"unregistered EC curve name: "+d};this.regist=function(A,l,o,g,m,e,j,f,k,u,d,x){b[A]={};var s=a(o);var z=a(g);var y=a(m);var t=a(e);var w=a(j);var r=new ECCurveFp(s,z,y);var q=r.decodePointHex("04"+f+k);b[A]["name"]=A;b[A]["keylen"]=l;b[A]["curve"]=r;b[A]["G"]=q;b[A]["n"]=t;b[A]["h"]=w;b[A]["oid"]=d;b[A]["info"]=x;for(var v=0;v<u.length;v++){c[u[v]]=A}}};KJUR.crypto.ECParameterDB.regist("secp128r1",128,"FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF","FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC","E87579C11079F43DD824993C2CEE5ED3","FFFFFFFE0000000075A30D1B9038A115","1","161FF7528B899B2D0C28607CA52C5B86","CF5AC8395BAFEB13C02DA292DDED7A83",[],"","secp128r1 : SECG curve over a 128 bit prime field");KJUR.crypto.ECParameterDB.regist("secp160k1",160,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73","0","7","0100000000000000000001B8FA16DFAB9ACA16B6B3","1","3B4C382CE37AA192A4019E763036F4F5DD4D7EBB","938CF935318FDCED6BC28286531733C3F03C4FEE",[],"","secp160k1 : SECG curve over a 160 bit prime field");KJUR.crypto.ECParameterDB.regist("secp160r1",160,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC","1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45","0100000000000000000001F4C8F927AED3CA752257","1","4A96B5688EF573284664698968C38BB913CBFC82","23A628553168947D59DCC912042351377AC5FB32",[],"","secp160r1 : SECG curve over a 160 bit prime field");KJUR.crypto.ECParameterDB.regist("secp192k1",192,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37","0","3","FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D","1","DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D","9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D",[]);KJUR.crypto.ECParameterDB.regist("secp192r1",192,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC","64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1","FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831","1","188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012","07192B95FFC8DA78631011ED6B24CDD573F977A11E794811",[]);KJUR.crypto.ECParameterDB.regist("secp224r1",224,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE","B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4","FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D","1","B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21","BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34",[]);KJUR.crypto.ECParameterDB.regist("secp256k1",256,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F","0","7","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141","1","79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798","483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8",[]);KJUR.crypto.ECParameterDB.regist("secp256r1",256,"FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF","FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC","5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B","FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551","1","6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296","4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5",["NIST P-256","P-256","prime256v1"]);KJUR.crypto.ECParameterDB.regist("secp384r1",384,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFC","B3312FA7E23EE7E4988E056BE3F82D19181D9C6EFE8141120314088F5013875AC656398D8A2ED19D2A85C8EDD3EC2AEF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC7634D81F4372DDF581A0DB248B0A77AECEC196ACCC52973","1","AA87CA22BE8B05378EB1C71EF320AD746E1D3B628BA79B9859F741E082542A385502F25DBF55296C3A545E3872760AB7","3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f",["NIST P-384","P-384"]);KJUR.crypto.ECParameterDB.regist("secp521r1",521,"1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC","051953EB9618E1C9A1F929A21A0B68540EEA2DA725B99B315F3B8B489918EF109E156193951EC7E937B1652C0BD3BB1BF073573DF883D2C34F1EF451FD46B503F00","1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409","1","C6858E06B70404E9CD9E3ECB662395B4429C648139053FB521F828AF606B4D3DBAA14B5E77EFE75928FE1DC127A2FFA8DE3348B3C1856A429BF97E7E31C2E5BD66","011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650",["NIST P-521","P-521"]);
	/*! dsa-modified-1.0.1.js (c) Recurity Labs GmbH, Kenji Urushimma | github.com/openpgpjs/openpgpjs/blob/master/LICENSE
	 */
	if(typeof KJUR=="undefined"||!KJUR){KJUR={}}if(typeof KJUR.crypto=="undefined"||!KJUR.crypto){KJUR.crypto={}}KJUR.crypto.DSA=function(){this.p=null;this.q=null;this.g=null;this.y=null;this.x=null;this.type="DSA";this.setPrivate=function(z,w,v,A,u){this.isPrivate=true;this.p=z;this.q=w;this.g=v;this.y=A;this.x=u};this.setPublic=function(w,v,u,z){this.isPublic=true;this.p=w;this.q=v;this.g=u;this.y=z;this.x=null};this.signWithMessageHash=function(z){var v=this.p;var u=this.q;var C=this.g;var D=this.y;var E=this.x;var A=z.substr(0,u.bitLength()/4);var B=new BigInteger(z,16);var w=n(BigInteger.ONE.add(BigInteger.ONE),u.subtract(BigInteger.ONE));var G=(C.modPow(w,v)).mod(u);var F=(w.modInverse(u).multiply(B.add(E.multiply(G)))).mod(u);var H=KJUR.asn1.ASN1Util.jsonToASN1HEX({seq:[{"int":{bigint:G}},{"int":{bigint:F}}]});return H};this.verifyWithMessageHash=function(C,B){var z=this.p;var u=this.q;var G=this.g;var H=this.y;var E=this.parseASN1Signature(B);var K=E[0];var J=E[1];var C=C.substr(0,u.bitLength()/4);var D=new BigInteger(C,16);if(BigInteger.ZERO.compareTo(K)>0||K.compareTo(u)>0||BigInteger.ZERO.compareTo(J)>0||J.compareTo(u)>0){throw"invalid DSA signature"}var I=J.modInverse(u);var A=D.multiply(I).mod(u);var v=K.multiply(I).mod(u);var F=G.modPow(A,z).multiply(H.modPow(v,z)).mod(z).mod(u);return F.compareTo(K)==0};this.parseASN1Signature=function(u){try{var y=new BigInteger(ASN1HEX.getVbyList(u,0,[0],"02"),16);var v=new BigInteger(ASN1HEX.getVbyList(u,0,[1],"02"),16);return[y,v]}catch(w){throw"malformed DSA signature"}};function d(E,w,B,v,u,C){var z=KJUR.crypto.Util.hashString(w,E.toLowerCase());var z=z.substr(0,u.bitLength()/4);var A=new BigInteger(z,16);var y=n(BigInteger.ONE.add(BigInteger.ONE),u.subtract(BigInteger.ONE));var F=(B.modPow(y,v)).mod(u);var D=(y.modInverse(u).multiply(A.add(C.multiply(F)))).mod(u);var G=new Array();G[0]=F;G[1]=D;return G}function r(v){var u=openpgp.config.config.prefer_hash_algorithm;switch(Math.round(v.bitLength()/8)){case 20:if(u!=2&&u>11&&u!=10&&u<8){return 2}return u;case 28:if(u>11&&u<8){return 11}return u;case 32:if(u>10&&u<8){return 8}return u;default:util.print_debug("DSA select hash algorithm: returning null for an unknown length of q");return null}}this.select_hash_algorithm=r;function m(I,K,J,B,z,u,F,G){var C=KJUR.crypto.Util.hashString(B,I.toLowerCase());var C=C.substr(0,u.bitLength()/4);var D=new BigInteger(C,16);if(BigInteger.ZERO.compareTo(K)>0||K.compareTo(u)>0||BigInteger.ZERO.compareTo(J)>0||J.compareTo(u)>0){util.print_error("invalid DSA Signature");return null}var H=J.modInverse(u);var A=D.multiply(H).mod(u);var v=K.multiply(H).mod(u);var E=F.modPow(A,z).multiply(G.modPow(v,z)).mod(z).mod(u);return E.compareTo(K)==0}function a(z){var A=new BigInteger(z,primeCenterie);var y=j(q,512);var u=t(p,q,z);var v;do{v=new BigInteger(q.bitCount(),rand)}while(x.compareTo(BigInteger.ZERO)!=1&&x.compareTo(q)!=-1);var w=g.modPow(x,p);return{x:v,q:A,p:y,g:u,y:w}}function j(y,z,w){if(z%64!=0){return false}var u;var v;do{u=w(bitcount,true);v=u.subtract(BigInteger.ONE);u=u.subtract(v.remainder(y))}while(!u.isProbablePrime(primeCenterie)||u.bitLength()!=l);return u}function t(B,z,A,w){var u=B.subtract(BigInteger.ONE);var y=u.divide(z);var v;do{v=w(A)}while(v.compareTo(u)!=-1&&v.compareTo(BigInteger.ONE)!=1);return v.modPow(y,B)}function o(w,y,u){var v;do{v=u(y,false)}while(v.compareTo(w)!=-1&&v.compareTo(BigInteger.ZERO)!=1);return v}function i(v,w){k=o(v);var u=g.modPow(k,w).mod(v);return u}function h(B,w,y,v,z,u){var A=B(v);s=(w.modInverse(z).multiply(A.add(u.multiply(y)))).mod(z);return s}this.sign=d;this.verify=m;function n(w,u){if(u.compareTo(w)<=0){return}var v=u.subtract(w);var y=e(v.bitLength());while(y>v){y=e(v.bitLength())}return w.add(y)}function e(w){if(w<0){return null}var u=Math.floor((w+7)/8);var v=c(u);if(w%8>0){v=String.fromCharCode((Math.pow(2,w%8)-1)&v.charCodeAt(0))+v.substring(1)}return new BigInteger(f(v),16)}function c(w){var u="";for(var v=0;v<w;v++){u+=String.fromCharCode(b())}return u}function b(){var u=new Uint32Array(1);window.crypto.getRandomValues(u);return u[0]&255}function f(y){if(y==null){return""}var v=[];var w=y.length;var z=0;var u;while(z<w){u=y[z++].charCodeAt().toString(16);while(u.length<2){u="0"+u}v.push(""+u)}return v.join("")}this.getRandomBigIntegerInRange=n;this.getRandomBigInteger=e;this.getRandomBytes=c};
	/*! pkcs5pkey-1.0.6.js (c) 2013-2014 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	var PKCS5PKEY=function(){var c=function(n,p,o){return i(CryptoJS.AES,n,p,o)};var d=function(n,p,o){return i(CryptoJS.TripleDES,n,p,o)};var i=function(q,v,s,o){var p=CryptoJS.enc.Hex.parse(v);var u=CryptoJS.enc.Hex.parse(s);var n=CryptoJS.enc.Hex.parse(o);var r={};r.key=u;r.iv=n;r.ciphertext=p;var t=q.decrypt(r,u,{iv:n});return CryptoJS.enc.Hex.stringify(t)};var j=function(n,p,o){return e(CryptoJS.AES,n,p,o)};var m=function(n,p,o){return e(CryptoJS.TripleDES,n,p,o)};var e=function(s,x,v,p){var r=CryptoJS.enc.Hex.parse(x);var w=CryptoJS.enc.Hex.parse(v);var o=CryptoJS.enc.Hex.parse(p);var n={};var u=s.encrypt(r,w,{iv:o});var q=CryptoJS.enc.Hex.parse(u.toString());var t=CryptoJS.enc.Base64.stringify(q);return t};var g={"AES-256-CBC":{proc:c,eproc:j,keylen:32,ivlen:16},"AES-192-CBC":{proc:c,eproc:j,keylen:24,ivlen:16},"AES-128-CBC":{proc:c,eproc:j,keylen:16,ivlen:16},"DES-EDE3-CBC":{proc:d,eproc:m,keylen:24,ivlen:8}};var b=function(n){return g[n]["proc"]};var k=function(n){var p=CryptoJS.lib.WordArray.random(n);var o=CryptoJS.enc.Hex.stringify(p);return o};var l=function(q){var r={};if(q.match(new RegExp("DEK-Info: ([^,]+),([0-9A-Fa-f]+)","m"))){r.cipher=RegExp.$1;r.ivsalt=RegExp.$2}if(q.match(new RegExp("-----BEGIN ([A-Z]+) PRIVATE KEY-----"))){r.type=RegExp.$1}var p=-1;var t=0;if(q.indexOf("\r\n\r\n")!=-1){p=q.indexOf("\r\n\r\n");t=2}if(q.indexOf("\n\n")!=-1){p=q.indexOf("\n\n");t=1}var o=q.indexOf("-----END");if(p!=-1&&o!=-1){var n=q.substring(p+t*2,o-t);n=n.replace(/\s+/g,"");r.data=n}return r};var h=function(o,w,n){var t=n.substring(0,16);var r=CryptoJS.enc.Hex.parse(t);var p=CryptoJS.enc.Utf8.parse(w);var s=g[o]["keylen"]+g[o]["ivlen"];var v="";var u=null;for(;;){var q=CryptoJS.algo.MD5.create();if(u!=null){q.update(u)}q.update(p);q.update(r);u=q.finalize();v=v+CryptoJS.enc.Hex.stringify(u);if(v.length>=s*2){break}}var x={};x.keyhex=v.substr(0,g[o]["keylen"]*2);x.ivhex=v.substr(g[o]["keylen"]*2,g[o]["ivlen"]*2);return x};var a=function(n,t,p,u){var q=CryptoJS.enc.Base64.parse(n);var o=CryptoJS.enc.Hex.stringify(q);var s=g[t]["proc"];var r=s(o,p,u);return r};var f=function(n,q,o,s){var p=g[q]["eproc"];var r=p(n,o,s);return r};return{version:"1.0.5",getHexFromPEM:function(o,r){var p=o;if(p.indexOf("BEGIN "+r)==-1){throw"can't find PEM header: "+r}p=p.replace("-----BEGIN "+r+"-----","");p=p.replace("-----END "+r+"-----","");var q=p.replace(/\s+/g,"");var n=b64tohex(q);return n},getDecryptedKeyHexByKeyIV:function(o,r,q,p){var n=b(r);return n(o,q,p)},parsePKCS5PEM:function(n){return l(n)},getKeyAndUnusedIvByPasscodeAndIvsalt:function(o,n,p){return h(o,n,p)},decryptKeyB64:function(n,p,o,q){return a(n,p,o,q)},getDecryptedKeyHex:function(w,v){var o=l(w);var r=o.type;var p=o.cipher;var n=o.ivsalt;var q=o.data;var u=h(p,v,n);var t=u.keyhex;var s=a(q,p,t,n);return s},getRSAKeyFromEncryptedPKCS5PEM:function(p,o){var q=this.getDecryptedKeyHex(p,o);var n=new RSAKey();n.readPrivateKeyFromASN1HexString(q);return n},getEryptedPKCS5PEMFromPrvKeyHex:function(q,x,r,p){var n="";if(typeof r=="undefined"||r==null){r="AES-256-CBC"}if(typeof g[r]=="undefined"){throw"PKCS5PKEY unsupported algorithm: "+r}if(typeof p=="undefined"||p==null){var t=g[r]["ivlen"];var s=k(t);p=s.toUpperCase()}var w=h(r,x,p);var v=w.keyhex;var u=f(q,r,v,p);var o=u.replace(/(.{64})/g,"$1\r\n");var n="-----BEGIN RSA PRIVATE KEY-----\r\n";n+="Proc-Type: 4,ENCRYPTED\r\n";n+="DEK-Info: "+r+","+p+"\r\n";n+="\r\n";n+=o;n+="\r\n-----END RSA PRIVATE KEY-----\r\n";return n},getEryptedPKCS5PEMFromRSAKey:function(C,D,o,s){var A=new KJUR.asn1.DERInteger({"int":0});var v=new KJUR.asn1.DERInteger({bigint:C.n});var z=new KJUR.asn1.DERInteger({"int":C.e});var B=new KJUR.asn1.DERInteger({bigint:C.d});var t=new KJUR.asn1.DERInteger({bigint:C.p});var r=new KJUR.asn1.DERInteger({bigint:C.q});var y=new KJUR.asn1.DERInteger({bigint:C.dmp1});var u=new KJUR.asn1.DERInteger({bigint:C.dmq1});var x=new KJUR.asn1.DERInteger({bigint:C.coeff});var E=new KJUR.asn1.DERSequence({array:[A,v,z,B,t,r,y,u,x]});var w=E.getEncodedHex();return this.getEryptedPKCS5PEMFromPrvKeyHex(w,D,o,s)},newEncryptedPKCS5PEM:function(n,o,r,s){if(typeof o=="undefined"||o==null){o=1024}if(typeof r=="undefined"||r==null){r="10001"}var p=new RSAKey();p.generate(o,r);var q=null;if(typeof s=="undefined"||s==null){q=this.getEncryptedPKCS5PEMFromRSAKey(pkey,n)}else{q=this.getEncryptedPKCS5PEMFromRSAKey(pkey,n,s)}return q},getRSAKeyFromPlainPKCS8PEM:function(p){if(p.match(/ENCRYPTED/)){throw"pem shall be not ENCRYPTED"}var o=this.getHexFromPEM(p,"PRIVATE KEY");var n=this.getRSAKeyFromPlainPKCS8Hex(o);return n},getRSAKeyFromPlainPKCS8Hex:function(q){var p=ASN1HEX.getPosArrayOfChildren_AtObj(q,0);if(p.length!=3){throw"outer DERSequence shall have 3 elements: "+p.length}var o=ASN1HEX.getHexOfTLV_AtObj(q,p[1]);if(o!="300d06092a864886f70d0101010500"){throw"PKCS8 AlgorithmIdentifier is not rsaEnc: "+o}var o=ASN1HEX.getHexOfTLV_AtObj(q,p[1]);var r=ASN1HEX.getHexOfTLV_AtObj(q,p[2]);var s=ASN1HEX.getHexOfV_AtObj(r,0);var n=new RSAKey();n.readPrivateKeyFromASN1HexString(s);return n},parseHexOfEncryptedPKCS8:function(u){var q={};var p=ASN1HEX.getPosArrayOfChildren_AtObj(u,0);if(p.length!=2){throw"malformed format: SEQUENCE(0).items != 2: "+p.length}q.ciphertext=ASN1HEX.getHexOfV_AtObj(u,p[1]);var w=ASN1HEX.getPosArrayOfChildren_AtObj(u,p[0]);if(w.length!=2){throw"malformed format: SEQUENCE(0.0).items != 2: "+w.length}if(ASN1HEX.getHexOfV_AtObj(u,w[0])!="2a864886f70d01050d"){throw"this only supports pkcs5PBES2"}var n=ASN1HEX.getPosArrayOfChildren_AtObj(u,w[1]);if(w.length!=2){throw"malformed format: SEQUENCE(0.0.1).items != 2: "+n.length}var o=ASN1HEX.getPosArrayOfChildren_AtObj(u,n[1]);if(o.length!=2){throw"malformed format: SEQUENCE(0.0.1.1).items != 2: "+o.length}if(ASN1HEX.getHexOfV_AtObj(u,o[0])!="2a864886f70d0307"){throw"this only supports TripleDES"}q.encryptionSchemeAlg="TripleDES";q.encryptionSchemeIV=ASN1HEX.getHexOfV_AtObj(u,o[1]);var r=ASN1HEX.getPosArrayOfChildren_AtObj(u,n[0]);if(r.length!=2){throw"malformed format: SEQUENCE(0.0.1.0).items != 2: "+r.length}if(ASN1HEX.getHexOfV_AtObj(u,r[0])!="2a864886f70d01050c"){throw"this only supports pkcs5PBKDF2"}var v=ASN1HEX.getPosArrayOfChildren_AtObj(u,r[1]);if(v.length<2){throw"malformed format: SEQUENCE(0.0.1.0.1).items < 2: "+v.length}q.pbkdf2Salt=ASN1HEX.getHexOfV_AtObj(u,v[0]);var s=ASN1HEX.getHexOfV_AtObj(u,v[1]);try{q.pbkdf2Iter=parseInt(s,16)}catch(t){throw"malformed format pbkdf2Iter: "+s}return q},getPBKDF2KeyHexFromParam:function(s,n){var r=CryptoJS.enc.Hex.parse(s.pbkdf2Salt);var o=s.pbkdf2Iter;var q=CryptoJS.PBKDF2(n,r,{keySize:192/32,iterations:o});var p=CryptoJS.enc.Hex.stringify(q);return p},getPlainPKCS8HexFromEncryptedPKCS8PEM:function(v,w){var p=this.getHexFromPEM(v,"ENCRYPTED PRIVATE KEY");var n=this.parseHexOfEncryptedPKCS8(p);var s=PKCS5PKEY.getPBKDF2KeyHexFromParam(n,w);var t={};t.ciphertext=CryptoJS.enc.Hex.parse(n.ciphertext);var r=CryptoJS.enc.Hex.parse(s);var q=CryptoJS.enc.Hex.parse(n.encryptionSchemeIV);var u=CryptoJS.TripleDES.decrypt(t,r,{iv:q});var o=CryptoJS.enc.Hex.stringify(u);return o},getRSAKeyFromEncryptedPKCS8PEM:function(q,p){var o=this.getPlainPKCS8HexFromEncryptedPKCS8PEM(q,p);var n=this.getRSAKeyFromPlainPKCS8Hex(o);return n},getKeyFromEncryptedPKCS8PEM:function(q,o){var n=this.getPlainPKCS8HexFromEncryptedPKCS8PEM(q,o);var p=this.getKeyFromPlainPrivatePKCS8Hex(n);return p},parsePlainPrivatePKCS8Hex:function(q){var o={};o.algparam=null;if(q.substr(0,2)!="30"){throw"malformed plain PKCS8 private key(code:001)"}var p=ASN1HEX.getPosArrayOfChildren_AtObj(q,0);if(p.length!=3){throw"malformed plain PKCS8 private key(code:002)"}if(q.substr(p[1],2)!="30"){throw"malformed PKCS8 private key(code:003)"}var n=ASN1HEX.getPosArrayOfChildren_AtObj(q,p[1]);if(n.length!=2){throw"malformed PKCS8 private key(code:004)"}if(q.substr(n[0],2)!="06"){throw"malformed PKCS8 private key(code:005)"}o.algoid=ASN1HEX.getHexOfV_AtObj(q,n[0]);if(q.substr(n[1],2)=="06"){o.algparam=ASN1HEX.getHexOfV_AtObj(q,n[1])}if(q.substr(p[2],2)!="04"){throw"malformed PKCS8 private key(code:006)"}o.keyidx=ASN1HEX.getStartPosOfV_AtObj(q,p[2]);return o},getKeyFromPlainPrivatePKCS8PEM:function(o){var n=this.getHexFromPEM(o,"PRIVATE KEY");var p=this.getKeyFromPlainPrivatePKCS8Hex(n);return p},getKeyFromPlainPrivatePKCS8Hex:function(n){var p=this.parsePlainPrivatePKCS8Hex(n);if(p.algoid=="2a864886f70d010101"){this.parsePrivateRawRSAKeyHexAtObj(n,p);var o=p.key;var q=new RSAKey();q.setPrivateEx(o.n,o.e,o.d,o.p,o.q,o.dp,o.dq,o.co);return q}else{if(p.algoid=="2a8648ce3d0201"){this.parsePrivateRawECKeyHexAtObj(n,p);if(KJUR.crypto.OID.oidhex2name[p.algparam]===undefined){throw"KJUR.crypto.OID.oidhex2name undefined: "+p.algparam}var r=KJUR.crypto.OID.oidhex2name[p.algparam];var q=new KJUR.crypto.ECDSA({curve:r,prv:p.key});return q}else{throw"unsupported private key algorithm"}}},getRSAKeyFromPublicPKCS8PEM:function(o){var p=this.getHexFromPEM(o,"PUBLIC KEY");var n=this.getRSAKeyFromPublicPKCS8Hex(p);return n},getKeyFromPublicPKCS8PEM:function(o){var p=this.getHexFromPEM(o,"PUBLIC KEY");var n=this.getKeyFromPublicPKCS8Hex(p);return n},getKeyFromPublicPKCS8Hex:function(o){var n=this.parsePublicPKCS8Hex(o);if(n.algoid=="2a864886f70d010101"){var r=this.parsePublicRawRSAKeyHex(n.key);var p=new RSAKey();p.setPublic(r.n,r.e);return p}else{if(n.algoid=="2a8648ce3d0201"){if(KJUR.crypto.OID.oidhex2name[n.algparam]===undefined){throw"KJUR.crypto.OID.oidhex2name undefined: "+n.algparam}var q=KJUR.crypto.OID.oidhex2name[n.algparam];var p=new KJUR.crypto.ECDSA({curve:q,pub:n.key});return p}else{throw"unsupported public key algorithm"}}},parsePublicRawRSAKeyHex:function(p){var n={};if(p.substr(0,2)!="30"){throw"malformed RSA key(code:001)"}var o=ASN1HEX.getPosArrayOfChildren_AtObj(p,0);if(o.length!=2){throw"malformed RSA key(code:002)"}if(p.substr(o[0],2)!="02"){throw"malformed RSA key(code:003)"}n.n=ASN1HEX.getHexOfV_AtObj(p,o[0]);if(p.substr(o[1],2)!="02"){throw"malformed RSA key(code:004)"}n.e=ASN1HEX.getHexOfV_AtObj(p,o[1]);return n},parsePrivateRawRSAKeyHexAtObj:function(o,q){var p=q.keyidx;if(o.substr(p,2)!="30"){throw"malformed RSA private key(code:001)"}var n=ASN1HEX.getPosArrayOfChildren_AtObj(o,p);if(n.length!=9){throw"malformed RSA private key(code:002)"}q.key={};q.key.n=ASN1HEX.getHexOfV_AtObj(o,n[1]);q.key.e=ASN1HEX.getHexOfV_AtObj(o,n[2]);q.key.d=ASN1HEX.getHexOfV_AtObj(o,n[3]);q.key.p=ASN1HEX.getHexOfV_AtObj(o,n[4]);q.key.q=ASN1HEX.getHexOfV_AtObj(o,n[5]);q.key.dp=ASN1HEX.getHexOfV_AtObj(o,n[6]);q.key.dq=ASN1HEX.getHexOfV_AtObj(o,n[7]);q.key.co=ASN1HEX.getHexOfV_AtObj(o,n[8])},parsePrivateRawECKeyHexAtObj:function(o,q){var p=q.keyidx;if(o.substr(p,2)!="30"){throw"malformed ECC private key(code:001)"}var n=ASN1HEX.getPosArrayOfChildren_AtObj(o,p);if(n.length!=3){throw"malformed ECC private key(code:002)"}if(o.substr(n[1],2)!="04"){throw"malformed ECC private key(code:003)"}q.key=ASN1HEX.getHexOfV_AtObj(o,n[1])},parsePublicPKCS8Hex:function(q){var o={};o.algparam=null;var p=ASN1HEX.getPosArrayOfChildren_AtObj(q,0);if(p.length!=2){throw"outer DERSequence shall have 2 elements: "+p.length}var r=p[0];if(q.substr(r,2)!="30"){throw"malformed PKCS8 public key(code:001)"}var n=ASN1HEX.getPosArrayOfChildren_AtObj(q,r);if(n.length!=2){throw"malformed PKCS8 public key(code:002)"}if(q.substr(n[0],2)!="06"){throw"malformed PKCS8 public key(code:003)"}o.algoid=ASN1HEX.getHexOfV_AtObj(q,n[0]);if(q.substr(n[1],2)=="06"){o.algparam=ASN1HEX.getHexOfV_AtObj(q,n[1])}if(q.substr(p[1],2)!="03"){throw"malformed PKCS8 public key(code:004)"}o.key=ASN1HEX.getHexOfV_AtObj(q,p[1]).substr(2);return o},getRSAKeyFromPublicPKCS8Hex:function(r){var q=ASN1HEX.getPosArrayOfChildren_AtObj(r,0);if(q.length!=2){throw"outer DERSequence shall have 2 elements: "+q.length}var p=ASN1HEX.getHexOfTLV_AtObj(r,q[0]);if(p!="300d06092a864886f70d0101010500"){throw"PKCS8 AlgorithmId is not rsaEncryption"}if(r.substr(q[1],2)!="03"){throw"PKCS8 Public Key is not BITSTRING encapslated."}var t=ASN1HEX.getStartPosOfV_AtObj(r,q[1])+2;if(r.substr(t,2)!="30"){throw"PKCS8 Public Key is not SEQUENCE."}var n=ASN1HEX.getPosArrayOfChildren_AtObj(r,t);if(n.length!=2){throw"inner DERSequence shall have 2 elements: "+n.length}if(r.substr(n[0],2)!="02"){throw"N is not ASN.1 INTEGER"}if(r.substr(n[1],2)!="02"){throw"E is not ASN.1 INTEGER"}var u=ASN1HEX.getHexOfV_AtObj(r,n[0]);var s=ASN1HEX.getHexOfV_AtObj(r,n[1]);var o=new RSAKey();o.setPublic(u,s);return o},}}();
	/*! keyutil-1.0.12.js (c) 2013-2015 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	var KEYUTIL=function(){var d=function(p,r,q){return k(CryptoJS.AES,p,r,q)};var e=function(p,r,q){return k(CryptoJS.TripleDES,p,r,q)};var a=function(p,r,q){return k(CryptoJS.DES,p,r,q)};var k=function(s,x,u,q){var r=CryptoJS.enc.Hex.parse(x);var w=CryptoJS.enc.Hex.parse(u);var p=CryptoJS.enc.Hex.parse(q);var t={};t.key=w;t.iv=p;t.ciphertext=r;var v=s.decrypt(t,w,{iv:p});return CryptoJS.enc.Hex.stringify(v)};var l=function(p,r,q){return g(CryptoJS.AES,p,r,q)};var o=function(p,r,q){return g(CryptoJS.TripleDES,p,r,q)};var f=function(p,r,q){return g(CryptoJS.DES,p,r,q)};var g=function(t,y,v,q){var s=CryptoJS.enc.Hex.parse(y);var x=CryptoJS.enc.Hex.parse(v);var p=CryptoJS.enc.Hex.parse(q);var w=t.encrypt(s,x,{iv:p});var r=CryptoJS.enc.Hex.parse(w.toString());var u=CryptoJS.enc.Base64.stringify(r);return u};var i={"AES-256-CBC":{proc:d,eproc:l,keylen:32,ivlen:16},"AES-192-CBC":{proc:d,eproc:l,keylen:24,ivlen:16},"AES-128-CBC":{proc:d,eproc:l,keylen:16,ivlen:16},"DES-EDE3-CBC":{proc:e,eproc:o,keylen:24,ivlen:8},"DES-CBC":{proc:a,eproc:f,keylen:8,ivlen:8}};var c=function(p){return i[p]["proc"]};var m=function(p){var r=CryptoJS.lib.WordArray.random(p);var q=CryptoJS.enc.Hex.stringify(r);return q};var n=function(t){var u={};if(t.match(new RegExp("DEK-Info: ([^,]+),([0-9A-Fa-f]+)","m"))){u.cipher=RegExp.$1;u.ivsalt=RegExp.$2}if(t.match(new RegExp("-----BEGIN ([A-Z]+) PRIVATE KEY-----"))){u.type=RegExp.$1}var r=-1;var v=0;if(t.indexOf("\r\n\r\n")!=-1){r=t.indexOf("\r\n\r\n");v=2}if(t.indexOf("\n\n")!=-1){r=t.indexOf("\n\n");v=1}var q=t.indexOf("-----END");if(r!=-1&&q!=-1){var p=t.substring(r+v*2,q-v);p=p.replace(/\s+/g,"");u.data=p}return u};var j=function(q,y,p){var v=p.substring(0,16);var t=CryptoJS.enc.Hex.parse(v);var r=CryptoJS.enc.Utf8.parse(y);var u=i[q]["keylen"]+i[q]["ivlen"];var x="";var w=null;for(;;){var s=CryptoJS.algo.MD5.create();if(w!=null){s.update(w)}s.update(r);s.update(t);w=s.finalize();x=x+CryptoJS.enc.Hex.stringify(w);if(x.length>=u*2){break}}var z={};z.keyhex=x.substr(0,i[q]["keylen"]*2);z.ivhex=x.substr(i[q]["keylen"]*2,i[q]["ivlen"]*2);return z};var b=function(p,v,r,w){var s=CryptoJS.enc.Base64.parse(p);var q=CryptoJS.enc.Hex.stringify(s);var u=i[v]["proc"];var t=u(q,r,w);return t};var h=function(p,s,q,u){var r=i[s]["eproc"];var t=r(p,q,u);return t};return{version:"1.0.0",getHexFromPEM:function(q,u){var r=q;if(r.indexOf("-----BEGIN ")==-1){throw"can't find PEM header: "+u}if(typeof u=="string"&&u!=""){r=r.replace("-----BEGIN "+u+"-----","");r=r.replace("-----END "+u+"-----","")}else{r=r.replace(/-----BEGIN [^-]+-----/,"");r=r.replace(/-----END [^-]+-----/,"")}var t=r.replace(/\s+/g,"");var p=b64tohex(t);return p},getDecryptedKeyHexByKeyIV:function(q,t,s,r){var p=c(t);return p(q,s,r)},parsePKCS5PEM:function(p){return n(p)},getKeyAndUnusedIvByPasscodeAndIvsalt:function(q,p,r){return j(q,p,r)},decryptKeyB64:function(p,r,q,s){return b(p,r,q,s)},getDecryptedKeyHex:function(y,x){var q=n(y);var t=q.type;var r=q.cipher;var p=q.ivsalt;var s=q.data;var w=j(r,x,p);var v=w.keyhex;var u=b(s,r,v,p);return u},getRSAKeyFromEncryptedPKCS5PEM:function(r,q){var s=this.getDecryptedKeyHex(r,q);var p=new RSAKey();p.readPrivateKeyFromASN1HexString(s);return p},getEncryptedPKCS5PEMFromPrvKeyHex:function(x,s,A,t,r){var p="";if(typeof t=="undefined"||t==null){t="AES-256-CBC"}if(typeof i[t]=="undefined"){throw"KEYUTIL unsupported algorithm: "+t}if(typeof r=="undefined"||r==null){var v=i[t]["ivlen"];var u=m(v);r=u.toUpperCase()}var z=j(t,A,r);var y=z.keyhex;var w=h(s,t,y,r);var q=w.replace(/(.{64})/g,"$1\r\n");var p="-----BEGIN "+x+" PRIVATE KEY-----\r\n";p+="Proc-Type: 4,ENCRYPTED\r\n";p+="DEK-Info: "+t+","+r+"\r\n";p+="\r\n";p+=q;p+="\r\n-----END "+x+" PRIVATE KEY-----\r\n";return p},getEncryptedPKCS5PEMFromRSAKey:function(D,E,r,t){var B=new KJUR.asn1.DERInteger({"int":0});var w=new KJUR.asn1.DERInteger({bigint:D.n});var A=new KJUR.asn1.DERInteger({"int":D.e});var C=new KJUR.asn1.DERInteger({bigint:D.d});var u=new KJUR.asn1.DERInteger({bigint:D.p});var s=new KJUR.asn1.DERInteger({bigint:D.q});var z=new KJUR.asn1.DERInteger({bigint:D.dmp1});var v=new KJUR.asn1.DERInteger({bigint:D.dmq1});var y=new KJUR.asn1.DERInteger({bigint:D.coeff});var F=new KJUR.asn1.DERSequence({array:[B,w,A,C,u,s,z,v,y]});var x=F.getEncodedHex();return this.getEncryptedPKCS5PEMFromPrvKeyHex("RSA",x,E,r,t)},newEncryptedPKCS5PEM:function(p,q,t,u){if(typeof q=="undefined"||q==null){q=1024}if(typeof t=="undefined"||t==null){t="10001"}var r=new RSAKey();r.generate(q,t);var s=null;if(typeof u=="undefined"||u==null){s=this.getEncryptedPKCS5PEMFromRSAKey(r,p)}else{s=this.getEncryptedPKCS5PEMFromRSAKey(r,p,u)}return s},getRSAKeyFromPlainPKCS8PEM:function(r){if(r.match(/ENCRYPTED/)){throw"pem shall be not ENCRYPTED"}var q=this.getHexFromPEM(r,"PRIVATE KEY");var p=this.getRSAKeyFromPlainPKCS8Hex(q);return p},getRSAKeyFromPlainPKCS8Hex:function(s){var r=ASN1HEX.getPosArrayOfChildren_AtObj(s,0);if(r.length!=3){throw"outer DERSequence shall have 3 elements: "+r.length}var q=ASN1HEX.getHexOfTLV_AtObj(s,r[1]);if(q!="300d06092a864886f70d0101010500"){throw"PKCS8 AlgorithmIdentifier is not rsaEnc: "+q}var q=ASN1HEX.getHexOfTLV_AtObj(s,r[1]);var t=ASN1HEX.getHexOfTLV_AtObj(s,r[2]);var u=ASN1HEX.getHexOfV_AtObj(t,0);var p=new RSAKey();p.readPrivateKeyFromASN1HexString(u);return p},parseHexOfEncryptedPKCS8:function(w){var s={};var r=ASN1HEX.getPosArrayOfChildren_AtObj(w,0);if(r.length!=2){throw"malformed format: SEQUENCE(0).items != 2: "+r.length}s.ciphertext=ASN1HEX.getHexOfV_AtObj(w,r[1]);var y=ASN1HEX.getPosArrayOfChildren_AtObj(w,r[0]);if(y.length!=2){throw"malformed format: SEQUENCE(0.0).items != 2: "+y.length}if(ASN1HEX.getHexOfV_AtObj(w,y[0])!="2a864886f70d01050d"){throw"this only supports pkcs5PBES2"}var p=ASN1HEX.getPosArrayOfChildren_AtObj(w,y[1]);if(y.length!=2){throw"malformed format: SEQUENCE(0.0.1).items != 2: "+p.length}var q=ASN1HEX.getPosArrayOfChildren_AtObj(w,p[1]);if(q.length!=2){throw"malformed format: SEQUENCE(0.0.1.1).items != 2: "+q.length}if(ASN1HEX.getHexOfV_AtObj(w,q[0])!="2a864886f70d0307"){throw"this only supports TripleDES"}s.encryptionSchemeAlg="TripleDES";s.encryptionSchemeIV=ASN1HEX.getHexOfV_AtObj(w,q[1]);var t=ASN1HEX.getPosArrayOfChildren_AtObj(w,p[0]);if(t.length!=2){throw"malformed format: SEQUENCE(0.0.1.0).items != 2: "+t.length}if(ASN1HEX.getHexOfV_AtObj(w,t[0])!="2a864886f70d01050c"){throw"this only supports pkcs5PBKDF2"}var x=ASN1HEX.getPosArrayOfChildren_AtObj(w,t[1]);if(x.length<2){throw"malformed format: SEQUENCE(0.0.1.0.1).items < 2: "+x.length}s.pbkdf2Salt=ASN1HEX.getHexOfV_AtObj(w,x[0]);var u=ASN1HEX.getHexOfV_AtObj(w,x[1]);try{s.pbkdf2Iter=parseInt(u,16)}catch(v){throw"malformed format pbkdf2Iter: "+u}return s},getPBKDF2KeyHexFromParam:function(u,p){var t=CryptoJS.enc.Hex.parse(u.pbkdf2Salt);var q=u.pbkdf2Iter;var s=CryptoJS.PBKDF2(p,t,{keySize:192/32,iterations:q});var r=CryptoJS.enc.Hex.stringify(s);return r},getPlainPKCS8HexFromEncryptedPKCS8PEM:function(x,y){var r=this.getHexFromPEM(x,"ENCRYPTED PRIVATE KEY");var p=this.parseHexOfEncryptedPKCS8(r);var u=KEYUTIL.getPBKDF2KeyHexFromParam(p,y);var v={};v.ciphertext=CryptoJS.enc.Hex.parse(p.ciphertext);var t=CryptoJS.enc.Hex.parse(u);var s=CryptoJS.enc.Hex.parse(p.encryptionSchemeIV);var w=CryptoJS.TripleDES.decrypt(v,t,{iv:s});var q=CryptoJS.enc.Hex.stringify(w);return q},getRSAKeyFromEncryptedPKCS8PEM:function(s,r){var q=this.getPlainPKCS8HexFromEncryptedPKCS8PEM(s,r);var p=this.getRSAKeyFromPlainPKCS8Hex(q);return p},getKeyFromEncryptedPKCS8PEM:function(s,q){var p=this.getPlainPKCS8HexFromEncryptedPKCS8PEM(s,q);var r=this.getKeyFromPlainPrivatePKCS8Hex(p);return r},parsePlainPrivatePKCS8Hex:function(s){var q={};q.algparam=null;if(s.substr(0,2)!="30"){throw"malformed plain PKCS8 private key(code:001)"}var r=ASN1HEX.getPosArrayOfChildren_AtObj(s,0);if(r.length!=3){throw"malformed plain PKCS8 private key(code:002)"}if(s.substr(r[1],2)!="30"){throw"malformed PKCS8 private key(code:003)"}var p=ASN1HEX.getPosArrayOfChildren_AtObj(s,r[1]);if(p.length!=2){throw"malformed PKCS8 private key(code:004)"}if(s.substr(p[0],2)!="06"){throw"malformed PKCS8 private key(code:005)"}q.algoid=ASN1HEX.getHexOfV_AtObj(s,p[0]);if(s.substr(p[1],2)=="06"){q.algparam=ASN1HEX.getHexOfV_AtObj(s,p[1])}if(s.substr(r[2],2)!="04"){throw"malformed PKCS8 private key(code:006)"}q.keyidx=ASN1HEX.getStartPosOfV_AtObj(s,r[2]);return q},getKeyFromPlainPrivatePKCS8PEM:function(q){var p=this.getHexFromPEM(q,"PRIVATE KEY");var r=this.getKeyFromPlainPrivatePKCS8Hex(p);return r},getKeyFromPlainPrivatePKCS8Hex:function(p){var w=this.parsePlainPrivatePKCS8Hex(p);if(w.algoid=="2a864886f70d010101"){this.parsePrivateRawRSAKeyHexAtObj(p,w);var u=w.key;var z=new RSAKey();z.setPrivateEx(u.n,u.e,u.d,u.p,u.q,u.dp,u.dq,u.co);return z}else{if(w.algoid=="2a8648ce3d0201"){this.parsePrivateRawECKeyHexAtObj(p,w);if(KJUR.crypto.OID.oidhex2name[w.algparam]===undefined){throw"KJUR.crypto.OID.oidhex2name undefined: "+w.algparam}var v=KJUR.crypto.OID.oidhex2name[w.algparam];var z=new KJUR.crypto.ECDSA({curve:v});z.setPublicKeyHex(w.pubkey);z.setPrivateKeyHex(w.key);z.isPublic=false;return z}else{if(w.algoid=="2a8648ce380401"){var t=ASN1HEX.getVbyList(p,0,[1,1,0],"02");var s=ASN1HEX.getVbyList(p,0,[1,1,1],"02");var y=ASN1HEX.getVbyList(p,0,[1,1,2],"02");var B=ASN1HEX.getVbyList(p,0,[2,0],"02");var r=new BigInteger(t,16);var q=new BigInteger(s,16);var x=new BigInteger(y,16);var A=new BigInteger(B,16);var z=new KJUR.crypto.DSA();z.setPrivate(r,q,x,null,A);return z}else{throw"unsupported private key algorithm"}}}},getRSAKeyFromPublicPKCS8PEM:function(q){var r=this.getHexFromPEM(q,"PUBLIC KEY");var p=this.getRSAKeyFromPublicPKCS8Hex(r);return p},getKeyFromPublicPKCS8PEM:function(q){var r=this.getHexFromPEM(q,"PUBLIC KEY");var p=this.getKeyFromPublicPKCS8Hex(r);return p},getKeyFromPublicPKCS8Hex:function(q){var p=this.parsePublicPKCS8Hex(q);if(p.algoid=="2a864886f70d010101"){var u=this.parsePublicRawRSAKeyHex(p.key);var r=new RSAKey();r.setPublic(u.n,u.e);return r}else{if(p.algoid=="2a8648ce3d0201"){if(KJUR.crypto.OID.oidhex2name[p.algparam]===undefined){throw"KJUR.crypto.OID.oidhex2name undefined: "+p.algparam}var s=KJUR.crypto.OID.oidhex2name[p.algparam];var r=new KJUR.crypto.ECDSA({curve:s,pub:p.key});return r}else{if(p.algoid=="2a8648ce380401"){var t=p.algparam;var v=ASN1HEX.getHexOfV_AtObj(p.key,0);var r=new KJUR.crypto.DSA();r.setPublic(new BigInteger(t.p,16),new BigInteger(t.q,16),new BigInteger(t.g,16),new BigInteger(v,16));return r}else{throw"unsupported public key algorithm"}}}},parsePublicRawRSAKeyHex:function(r){var p={};if(r.substr(0,2)!="30"){throw"malformed RSA key(code:001)"}var q=ASN1HEX.getPosArrayOfChildren_AtObj(r,0);if(q.length!=2){throw"malformed RSA key(code:002)"}if(r.substr(q[0],2)!="02"){throw"malformed RSA key(code:003)"}p.n=ASN1HEX.getHexOfV_AtObj(r,q[0]);if(r.substr(q[1],2)!="02"){throw"malformed RSA key(code:004)"}p.e=ASN1HEX.getHexOfV_AtObj(r,q[1]);return p},parsePrivateRawRSAKeyHexAtObj:function(q,s){var r=s.keyidx;if(q.substr(r,2)!="30"){throw"malformed RSA private key(code:001)"}var p=ASN1HEX.getPosArrayOfChildren_AtObj(q,r);if(p.length!=9){throw"malformed RSA private key(code:002)"}s.key={};s.key.n=ASN1HEX.getHexOfV_AtObj(q,p[1]);s.key.e=ASN1HEX.getHexOfV_AtObj(q,p[2]);s.key.d=ASN1HEX.getHexOfV_AtObj(q,p[3]);s.key.p=ASN1HEX.getHexOfV_AtObj(q,p[4]);s.key.q=ASN1HEX.getHexOfV_AtObj(q,p[5]);s.key.dp=ASN1HEX.getHexOfV_AtObj(q,p[6]);s.key.dq=ASN1HEX.getHexOfV_AtObj(q,p[7]);s.key.co=ASN1HEX.getHexOfV_AtObj(q,p[8])},parsePrivateRawECKeyHexAtObj:function(p,t){var q=t.keyidx;var r=ASN1HEX.getVbyList(p,q,[1],"04");var s=ASN1HEX.getVbyList(p,q,[2,0],"03").substr(2);t.key=r;t.pubkey=s},parsePublicPKCS8Hex:function(s){var q={};q.algparam=null;var r=ASN1HEX.getPosArrayOfChildren_AtObj(s,0);if(r.length!=2){throw"outer DERSequence shall have 2 elements: "+r.length}var t=r[0];if(s.substr(t,2)!="30"){throw"malformed PKCS8 public key(code:001)"}var p=ASN1HEX.getPosArrayOfChildren_AtObj(s,t);if(p.length!=2){throw"malformed PKCS8 public key(code:002)"}if(s.substr(p[0],2)!="06"){throw"malformed PKCS8 public key(code:003)"}q.algoid=ASN1HEX.getHexOfV_AtObj(s,p[0]);if(s.substr(p[1],2)=="06"){q.algparam=ASN1HEX.getHexOfV_AtObj(s,p[1])}else{if(s.substr(p[1],2)=="30"){q.algparam={};q.algparam.p=ASN1HEX.getVbyList(s,p[1],[0],"02");q.algparam.q=ASN1HEX.getVbyList(s,p[1],[1],"02");q.algparam.g=ASN1HEX.getVbyList(s,p[1],[2],"02")}}if(s.substr(r[1],2)!="03"){throw"malformed PKCS8 public key(code:004)"}q.key=ASN1HEX.getHexOfV_AtObj(s,r[1]).substr(2);return q},getRSAKeyFromPublicPKCS8Hex:function(t){var s=ASN1HEX.getPosArrayOfChildren_AtObj(t,0);if(s.length!=2){throw"outer DERSequence shall have 2 elements: "+s.length}var r=ASN1HEX.getHexOfTLV_AtObj(t,s[0]);if(r!="300d06092a864886f70d0101010500"){throw"PKCS8 AlgorithmId is not rsaEncryption"}if(t.substr(s[1],2)!="03"){throw"PKCS8 Public Key is not BITSTRING encapslated."}var v=ASN1HEX.getStartPosOfV_AtObj(t,s[1])+2;if(t.substr(v,2)!="30"){throw"PKCS8 Public Key is not SEQUENCE."}var p=ASN1HEX.getPosArrayOfChildren_AtObj(t,v);if(p.length!=2){throw"inner DERSequence shall have 2 elements: "+p.length}if(t.substr(p[0],2)!="02"){throw"N is not ASN.1 INTEGER"}if(t.substr(p[1],2)!="02"){throw"E is not ASN.1 INTEGER"}var w=ASN1HEX.getHexOfV_AtObj(t,p[0]);var u=ASN1HEX.getHexOfV_AtObj(t,p[1]);var q=new RSAKey();q.setPublic(w,u);return q},}}();KEYUTIL.getKey=function(f,e,h){if(typeof RSAKey!="undefined"&&f instanceof RSAKey){return f}if(typeof KJUR.crypto.ECDSA!="undefined"&&f instanceof KJUR.crypto.ECDSA){return f}if(typeof KJUR.crypto.DSA!="undefined"&&f instanceof KJUR.crypto.DSA){return f}if(f.curve!==undefined&&f.xy!==undefined&&f.d===undefined){return new KJUR.crypto.ECDSA({pub:f.xy,curve:f.curve})}if(f.curve!==undefined&&f.d!==undefined){return new KJUR.crypto.ECDSA({prv:f.d,curve:f.curve})}if(f.kty===undefined&&f.n!==undefined&&f.e!==undefined&&f.d===undefined){var w=new RSAKey();w.setPublic(f.n,f.e);return w}if(f.kty===undefined&&f.n!==undefined&&f.e!==undefined&&f.d!==undefined&&f.p!==undefined&&f.q!==undefined&&f.dp!==undefined&&f.dq!==undefined&&f.co!==undefined&&f.qi===undefined){var w=new RSAKey();w.setPrivateEx(f.n,f.e,f.d,f.p,f.q,f.dp,f.dq,f.co);return w}if(f.kty===undefined&&f.n!==undefined&&f.e!==undefined&&f.d!==undefined&&f.p===undefined){var w=new RSAKey();w.setPrivate(f.n,f.e,f.d);return w}if(f.p!==undefined&&f.q!==undefined&&f.g!==undefined&&f.y!==undefined&&f.x===undefined){var w=new KJUR.crypto.DSA();w.setPublic(f.p,f.q,f.g,f.y);return w}if(f.p!==undefined&&f.q!==undefined&&f.g!==undefined&&f.y!==undefined&&f.x!==undefined){var w=new KJUR.crypto.DSA();w.setPrivate(f.p,f.q,f.g,f.y,f.x);return w}if(f.kty==="RSA"&&f.n!==undefined&&f.e!==undefined&&f.d===undefined){var w=new RSAKey();w.setPublic(b64utohex(f.n),b64utohex(f.e));return w}if(f.kty==="RSA"&&f.n!==undefined&&f.e!==undefined&&f.d!==undefined&&f.p!==undefined&&f.q!==undefined&&f.dp!==undefined&&f.dq!==undefined&&f.qi!==undefined){var w=new RSAKey();w.setPrivateEx(b64utohex(f.n),b64utohex(f.e),b64utohex(f.d),b64utohex(f.p),b64utohex(f.q),b64utohex(f.dp),b64utohex(f.dq),b64utohex(f.qi));return w}if(f.kty==="RSA"&&f.n!==undefined&&f.e!==undefined&&f.d!==undefined){var w=new RSAKey();w.setPrivate(b64utohex(f.n),b64utohex(f.e),b64utohex(f.d));return w}if(f.kty==="EC"&&f.crv!==undefined&&f.x!==undefined&&f.y!==undefined&&f.d===undefined){var d=new KJUR.crypto.ECDSA({curve:f.crv});var l=d.ecparams.keylen/4;var r=("0000000000"+b64utohex(f.x)).slice(-l);var n=("0000000000"+b64utohex(f.y)).slice(-l);var m="04"+r+n;d.setPublicKeyHex(m);return d}if(f.kty==="EC"&&f.crv!==undefined&&f.x!==undefined&&f.y!==undefined&&f.d!==undefined){var d=new KJUR.crypto.ECDSA({curve:f.crv});var l=d.ecparams.keylen/4;var a=("0000000000"+b64utohex(f.d)).slice(-l);d.setPrivateKeyHex(a);return d}if(f.indexOf("-END CERTIFICATE-",0)!=-1||f.indexOf("-END X509 CERTIFICATE-",0)!=-1||f.indexOf("-END TRUSTED CERTIFICATE-",0)!=-1){return X509.getPublicKeyFromCertPEM(f)}if(h==="pkcs8pub"){return KEYUTIL.getKeyFromPublicPKCS8Hex(f)}if(f.indexOf("-END PUBLIC KEY-")!=-1){return KEYUTIL.getKeyFromPublicPKCS8PEM(f)}if(h==="pkcs5prv"){var w=new RSAKey();w.readPrivateKeyFromASN1HexString(f);return w}if(h==="pkcs5prv"){var w=new RSAKey();w.readPrivateKeyFromASN1HexString(f);return w}if(f.indexOf("-END RSA PRIVATE KEY-")!=-1&&f.indexOf("4,ENCRYPTED")==-1){var i=KEYUTIL.getHexFromPEM(f,"RSA PRIVATE KEY");return KEYUTIL.getKey(i,null,"pkcs5prv")}if(f.indexOf("-END DSA PRIVATE KEY-")!=-1&&f.indexOf("4,ENCRYPTED")==-1){var u=this.getHexFromPEM(f,"DSA PRIVATE KEY");var t=ASN1HEX.getVbyList(u,0,[1],"02");var s=ASN1HEX.getVbyList(u,0,[2],"02");var v=ASN1HEX.getVbyList(u,0,[3],"02");var j=ASN1HEX.getVbyList(u,0,[4],"02");var k=ASN1HEX.getVbyList(u,0,[5],"02");var w=new KJUR.crypto.DSA();w.setPrivate(new BigInteger(t,16),new BigInteger(s,16),new BigInteger(v,16),new BigInteger(j,16),new BigInteger(k,16));return w}if(f.indexOf("-END PRIVATE KEY-")!=-1){return KEYUTIL.getKeyFromPlainPrivatePKCS8PEM(f)}if(f.indexOf("-END RSA PRIVATE KEY-")!=-1&&f.indexOf("4,ENCRYPTED")!=-1){return KEYUTIL.getRSAKeyFromEncryptedPKCS5PEM(f,e)}if(f.indexOf("-END EC PRIVATE KEY-")!=-1&&f.indexOf("4,ENCRYPTED")!=-1){var u=KEYUTIL.getDecryptedKeyHex(f,e);var w=ASN1HEX.getVbyList(u,0,[1],"04");var c=ASN1HEX.getVbyList(u,0,[2,0],"06");var o=ASN1HEX.getVbyList(u,0,[3,0],"03").substr(2);var b="";if(KJUR.crypto.OID.oidhex2name[c]!==undefined){b=KJUR.crypto.OID.oidhex2name[c]}else{throw"undefined OID(hex) in KJUR.crypto.OID: "+c}var d=new KJUR.crypto.ECDSA({name:b});d.setPublicKeyHex(o);d.setPrivateKeyHex(w);d.isPublic=false;return d}if(f.indexOf("-END DSA PRIVATE KEY-")!=-1&&f.indexOf("4,ENCRYPTED")!=-1){var u=KEYUTIL.getDecryptedKeyHex(f,e);var t=ASN1HEX.getVbyList(u,0,[1],"02");var s=ASN1HEX.getVbyList(u,0,[2],"02");var v=ASN1HEX.getVbyList(u,0,[3],"02");var j=ASN1HEX.getVbyList(u,0,[4],"02");var k=ASN1HEX.getVbyList(u,0,[5],"02");var w=new KJUR.crypto.DSA();w.setPrivate(new BigInteger(t,16),new BigInteger(s,16),new BigInteger(v,16),new BigInteger(j,16),new BigInteger(k,16));return w}if(f.indexOf("-END ENCRYPTED PRIVATE KEY-")!=-1){return KEYUTIL.getKeyFromEncryptedPKCS8PEM(f,e)}throw"not supported argument"};KEYUTIL.generateKeypair=function(a,c){if(a=="RSA"){var b=c;var h=new RSAKey();h.generate(b,"10001");h.isPrivate=true;h.isPublic=true;var f=new RSAKey();var e=h.n.toString(16);var i=h.e.toString(16);f.setPublic(e,i);f.isPrivate=false;f.isPublic=true;var k={};k.prvKeyObj=h;k.pubKeyObj=f;return k}else{if(a=="EC"){var d=c;var g=new KJUR.crypto.ECDSA({curve:d});var j=g.generateKeyPairHex();var h=new KJUR.crypto.ECDSA({curve:d});h.setPrivateKeyHex(j.ecprvhex);h.isPrivate=true;h.isPublic=false;var f=new KJUR.crypto.ECDSA({curve:d});f.setPublicKeyHex(j.ecpubhex);f.isPrivate=false;f.isPublic=true;var k={};k.prvKeyObj=h;k.pubKeyObj=f;return k}else{throw"unknown algorithm: "+a}}};KEYUTIL.getPEM=function(a,r,o,g,j){var v=KJUR.asn1;var u=KJUR.crypto;function p(s){var w=KJUR.asn1.ASN1Util.newObject({seq:[{"int":0},{"int":{bigint:s.n}},{"int":s.e},{"int":{bigint:s.d}},{"int":{bigint:s.p}},{"int":{bigint:s.q}},{"int":{bigint:s.dmp1}},{"int":{bigint:s.dmq1}},{"int":{bigint:s.coeff}}]});return w}function q(w){var s=KJUR.asn1.ASN1Util.newObject({seq:[{"int":1},{octstr:{hex:w.prvKeyHex}},{tag:["a0",true,{oid:{name:w.curveName}}]},{tag:["a1",true,{bitstr:{hex:"00"+w.pubKeyHex}}]}]});return s}function n(s){var w=KJUR.asn1.ASN1Util.newObject({seq:[{"int":0},{"int":{bigint:s.p}},{"int":{bigint:s.q}},{"int":{bigint:s.g}},{"int":{bigint:s.y}},{"int":{bigint:s.x}}]});return w}if(((typeof RSAKey!="undefined"&&a instanceof RSAKey)||(typeof u.DSA!="undefined"&&a instanceof u.DSA)||(typeof u.ECDSA!="undefined"&&a instanceof u.ECDSA))&&a.isPublic==true&&(r===undefined||r=="PKCS8PUB")){var t=new KJUR.asn1.x509.SubjectPublicKeyInfo(a);var m=t.getEncodedHex();return v.ASN1Util.getPEMStringFromHex(m,"PUBLIC KEY")}if(r=="PKCS1PRV"&&typeof RSAKey!="undefined"&&a instanceof RSAKey&&(o===undefined||o==null)&&a.isPrivate==true){var t=p(a);var m=t.getEncodedHex();return v.ASN1Util.getPEMStringFromHex(m,"RSA PRIVATE KEY")}if(r=="PKCS1PRV"&&typeof RSAKey!="undefined"&&a instanceof KJUR.crypto.ECDSA&&(o===undefined||o==null)&&a.isPrivate==true){var f=new KJUR.asn1.DERObjectIdentifier({name:a.curveName});var l=f.getEncodedHex();var e=q(a);var k=e.getEncodedHex();var i="";i+=v.ASN1Util.getPEMStringFromHex(l,"EC PARAMETERS");i+=v.ASN1Util.getPEMStringFromHex(k,"EC PRIVATE KEY");return i}if(r=="PKCS1PRV"&&typeof KJUR.crypto.DSA!="undefined"&&a instanceof KJUR.crypto.DSA&&(o===undefined||o==null)&&a.isPrivate==true){var t=n(a);var m=t.getEncodedHex();return v.ASN1Util.getPEMStringFromHex(m,"DSA PRIVATE KEY")}if(r=="PKCS5PRV"&&typeof RSAKey!="undefined"&&a instanceof RSAKey&&(o!==undefined&&o!=null)&&a.isPrivate==true){var t=p(a);var m=t.getEncodedHex();if(g===undefined){g="DES-EDE3-CBC"}return this.getEncryptedPKCS5PEMFromPrvKeyHex("RSA",m,o,g)}if(r=="PKCS5PRV"&&typeof KJUR.crypto.ECDSA!="undefined"&&a instanceof KJUR.crypto.ECDSA&&(o!==undefined&&o!=null)&&a.isPrivate==true){var t=q(a);var m=t.getEncodedHex();if(g===undefined){g="DES-EDE3-CBC"}return this.getEncryptedPKCS5PEMFromPrvKeyHex("EC",m,o,g)}if(r=="PKCS5PRV"&&typeof KJUR.crypto.DSA!="undefined"&&a instanceof KJUR.crypto.DSA&&(o!==undefined&&o!=null)&&a.isPrivate==true){var t=n(a);var m=t.getEncodedHex();if(g===undefined){g="DES-EDE3-CBC"}return this.getEncryptedPKCS5PEMFromPrvKeyHex("DSA",m,o,g)}var h=function(w,s){var y=b(w,s);var x=new KJUR.asn1.ASN1Util.newObject({seq:[{seq:[{oid:{name:"pkcs5PBES2"}},{seq:[{seq:[{oid:{name:"pkcs5PBKDF2"}},{seq:[{octstr:{hex:y.pbkdf2Salt}},{"int":y.pbkdf2Iter}]}]},{seq:[{oid:{name:"des-EDE3-CBC"}},{octstr:{hex:y.encryptionSchemeIV}}]}]}]},{octstr:{hex:y.ciphertext}}]});return x.getEncodedHex()};var b=function(D,E){var x=100;var C=CryptoJS.lib.WordArray.random(8);var B="DES-EDE3-CBC";var s=CryptoJS.lib.WordArray.random(8);var y=CryptoJS.PBKDF2(E,C,{keySize:192/32,iterations:x});var z=CryptoJS.enc.Hex.parse(D);var A=CryptoJS.TripleDES.encrypt(z,y,{iv:s})+"";var w={};w.ciphertext=A;w.pbkdf2Salt=CryptoJS.enc.Hex.stringify(C);w.pbkdf2Iter=x;w.encryptionSchemeAlg=B;w.encryptionSchemeIV=CryptoJS.enc.Hex.stringify(s);return w};if(r=="PKCS8PRV"&&typeof RSAKey!="undefined"&&a instanceof RSAKey&&a.isPrivate==true){var d=p(a);var c=d.getEncodedHex();var t=KJUR.asn1.ASN1Util.newObject({seq:[{"int":0},{seq:[{oid:{name:"rsaEncryption"}},{"null":true}]},{octstr:{hex:c}}]});var m=t.getEncodedHex();if(o===undefined||o==null){return v.ASN1Util.getPEMStringFromHex(m,"PRIVATE KEY")}else{var k=h(m,o);return v.ASN1Util.getPEMStringFromHex(k,"ENCRYPTED PRIVATE KEY")}}if(r=="PKCS8PRV"&&typeof KJUR.crypto.ECDSA!="undefined"&&a instanceof KJUR.crypto.ECDSA&&a.isPrivate==true){var d=new KJUR.asn1.ASN1Util.newObject({seq:[{"int":1},{octstr:{hex:a.prvKeyHex}},{tag:["a1",true,{bitstr:{hex:"00"+a.pubKeyHex}}]}]});var c=d.getEncodedHex();var t=KJUR.asn1.ASN1Util.newObject({seq:[{"int":0},{seq:[{oid:{name:"ecPublicKey"}},{oid:{name:a.curveName}}]},{octstr:{hex:c}}]});var m=t.getEncodedHex();if(o===undefined||o==null){return v.ASN1Util.getPEMStringFromHex(m,"PRIVATE KEY")}else{var k=h(m,o);return v.ASN1Util.getPEMStringFromHex(k,"ENCRYPTED PRIVATE KEY")}}if(r=="PKCS8PRV"&&typeof KJUR.crypto.DSA!="undefined"&&a instanceof KJUR.crypto.DSA&&a.isPrivate==true){var d=new KJUR.asn1.DERInteger({bigint:a.x});var c=d.getEncodedHex();var t=KJUR.asn1.ASN1Util.newObject({seq:[{"int":0},{seq:[{oid:{name:"dsa"}},{seq:[{"int":{bigint:a.p}},{"int":{bigint:a.q}},{"int":{bigint:a.g}}]}]},{octstr:{hex:c}}]});var m=t.getEncodedHex();if(o===undefined||o==null){return v.ASN1Util.getPEMStringFromHex(m,"PRIVATE KEY")}else{var k=h(m,o);return v.ASN1Util.getPEMStringFromHex(k,"ENCRYPTED PRIVATE KEY")}}throw"unsupported object nor format"};KEYUTIL.getKeyFromCSRPEM=function(b){var a=KEYUTIL.getHexFromPEM(b,"CERTIFICATE REQUEST");var c=KEYUTIL.getKeyFromCSRHex(a);return c};KEYUTIL.getKeyFromCSRHex=function(a){var c=KEYUTIL.parseCSRHex(a);var b=KEYUTIL.getKey(c.p8pubkeyhex,null,"pkcs8pub");return b};KEYUTIL.parseCSRHex=function(c){var b={};var e=c;if(e.substr(0,2)!="30"){throw"malformed CSR(code:001)"}var d=ASN1HEX.getPosArrayOfChildren_AtObj(e,0);if(d.length<1){throw"malformed CSR(code:002)"}if(e.substr(d[0],2)!="30"){throw"malformed CSR(code:003)"}var a=ASN1HEX.getPosArrayOfChildren_AtObj(e,d[0]);if(a.length<3){throw"malformed CSR(code:004)"}b.p8pubkeyhex=ASN1HEX.getHexOfTLV_AtObj(e,a[2]);return b};
	/*! rsapem-1.1.js (c) 2012 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	function _rsapem_pemToBase64(b){var a=b;a=a.replace("-----BEGIN RSA PRIVATE KEY-----","");a=a.replace("-----END RSA PRIVATE KEY-----","");a=a.replace(/[ \n]+/g,"");return a}function _rsapem_getPosArrayOfChildrenFromHex(d){var j=new Array();var k=ASN1HEX.getStartPosOfV_AtObj(d,0);var f=ASN1HEX.getPosOfNextSibling_AtObj(d,k);var h=ASN1HEX.getPosOfNextSibling_AtObj(d,f);var b=ASN1HEX.getPosOfNextSibling_AtObj(d,h);var l=ASN1HEX.getPosOfNextSibling_AtObj(d,b);var e=ASN1HEX.getPosOfNextSibling_AtObj(d,l);var g=ASN1HEX.getPosOfNextSibling_AtObj(d,e);var c=ASN1HEX.getPosOfNextSibling_AtObj(d,g);var i=ASN1HEX.getPosOfNextSibling_AtObj(d,c);j.push(k,f,h,b,l,e,g,c,i);return j}function _rsapem_getHexValueArrayOfChildrenFromHex(i){var o=_rsapem_getPosArrayOfChildrenFromHex(i);var r=ASN1HEX.getHexOfV_AtObj(i,o[0]);var f=ASN1HEX.getHexOfV_AtObj(i,o[1]);var j=ASN1HEX.getHexOfV_AtObj(i,o[2]);var k=ASN1HEX.getHexOfV_AtObj(i,o[3]);var c=ASN1HEX.getHexOfV_AtObj(i,o[4]);var b=ASN1HEX.getHexOfV_AtObj(i,o[5]);var h=ASN1HEX.getHexOfV_AtObj(i,o[6]);var g=ASN1HEX.getHexOfV_AtObj(i,o[7]);var l=ASN1HEX.getHexOfV_AtObj(i,o[8]);var m=new Array();m.push(r,f,j,k,c,b,h,g,l);return m}function _rsapem_readPrivateKeyFromASN1HexString(c){var b=_rsapem_getHexValueArrayOfChildrenFromHex(c);this.setPrivateEx(b[1],b[2],b[3],b[4],b[5],b[6],b[7],b[8])}function _rsapem_readPrivateKeyFromPEMString(e){var c=_rsapem_pemToBase64(e);var d=b64tohex(c);var b=_rsapem_getHexValueArrayOfChildrenFromHex(d);this.setPrivateEx(b[1],b[2],b[3],b[4],b[5],b[6],b[7],b[8])}RSAKey.prototype.readPrivateKeyFromPEMString=_rsapem_readPrivateKeyFromPEMString;RSAKey.prototype.readPrivateKeyFromASN1HexString=_rsapem_readPrivateKeyFromASN1HexString;
	/*! rsasign-1.2.7.js (c) 2012 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	var _RE_HEXDECONLY=new RegExp("");_RE_HEXDECONLY.compile("[^0-9a-f]","gi");function _rsasign_getHexPaddedDigestInfoForString(d,e,a){var b=function(f){return KJUR.crypto.Util.hashString(f,a)};var c=b(d);return KJUR.crypto.Util.getPaddedDigestInfoHex(c,a,e)}function _zeroPaddingOfSignature(e,d){var c="";var a=d/4-e.length;for(var b=0;b<a;b++){c=c+"0"}return c+e}function _rsasign_signString(d,a){var b=function(e){return KJUR.crypto.Util.hashString(e,a)};var c=b(d);return this.signWithMessageHash(c,a)}function _rsasign_signWithMessageHash(e,c){var f=KJUR.crypto.Util.getPaddedDigestInfoHex(e,c,this.n.bitLength());var b=parseBigInt(f,16);var d=this.doPrivate(b);var a=d.toString(16);return _zeroPaddingOfSignature(a,this.n.bitLength())}function _rsasign_signStringWithSHA1(a){return _rsasign_signString.call(this,a,"sha1")}function _rsasign_signStringWithSHA256(a){return _rsasign_signString.call(this,a,"sha256")}function pss_mgf1_str(c,a,e){var b="",d=0;while(b.length<a){b+=hextorstr(e(rstrtohex(c+String.fromCharCode.apply(String,[(d&4278190080)>>24,(d&16711680)>>16,(d&65280)>>8,d&255]))));d+=1}return b}function _rsasign_signStringPSS(e,a,d){var c=function(f){return KJUR.crypto.Util.hashHex(f,a)};var b=c(rstrtohex(e));if(d===undefined){d=-1}return this.signWithMessageHashPSS(b,a,d)}function _rsasign_signWithMessageHashPSS(l,a,k){var b=hextorstr(l);var g=b.length;var m=this.n.bitLength()-1;var c=Math.ceil(m/8);var d;var o=function(i){return KJUR.crypto.Util.hashHex(i,a)};if(k===-1||k===undefined){k=g}else{if(k===-2){k=c-g-2}else{if(k<-2){throw"invalid salt length"}}}if(c<(g+k+2)){throw"data too long"}var f="";if(k>0){f=new Array(k);new SecureRandom().nextBytes(f);f=String.fromCharCode.apply(String,f)}var n=hextorstr(o(rstrtohex("\x00\x00\x00\x00\x00\x00\x00\x00"+b+f)));var j=[];for(d=0;d<c-k-g-2;d+=1){j[d]=0}var e=String.fromCharCode.apply(String,j)+"\x01"+f;var h=pss_mgf1_str(n,e.length,o);var q=[];for(d=0;d<e.length;d+=1){q[d]=e.charCodeAt(d)^h.charCodeAt(d)}var p=(65280>>(8*c-m))&255;q[0]&=~p;for(d=0;d<g;d++){q.push(n.charCodeAt(d))}q.push(188);return _zeroPaddingOfSignature(this.doPrivate(new BigInteger(q)).toString(16),this.n.bitLength())}function _rsasign_getDecryptSignatureBI(a,d,c){var b=new RSAKey();b.setPublic(d,c);var e=b.doPublic(a);return e}function _rsasign_getHexDigestInfoFromSig(a,c,b){var e=_rsasign_getDecryptSignatureBI(a,c,b);var d=e.toString(16).replace(/^1f+00/,"");return d}function _rsasign_getAlgNameAndHashFromHexDisgestInfo(f){for(var e in KJUR.crypto.Util.DIGESTINFOHEAD){var d=KJUR.crypto.Util.DIGESTINFOHEAD[e];var b=d.length;if(f.substring(0,b)==d){var c=[e,f.substring(b)];return c}}return[]}function _rsasign_verifySignatureWithArgs(f,b,g,j){var e=_rsasign_getHexDigestInfoFromSig(b,g,j);var h=_rsasign_getAlgNameAndHashFromHexDisgestInfo(e);if(h.length==0){return false}var d=h[0];var i=h[1];var a=function(k){return KJUR.crypto.Util.hashString(k,d)};var c=a(f);return(i==c)}function _rsasign_verifyHexSignatureForMessage(c,b){var d=parseBigInt(c,16);var a=_rsasign_verifySignatureWithArgs(b,d,this.n.toString(16),this.e.toString(16));return a}function _rsasign_verifyString(f,j){j=j.replace(_RE_HEXDECONLY,"");j=j.replace(/[ \n]+/g,"");var b=parseBigInt(j,16);if(b.bitLength()>this.n.bitLength()){return 0}var i=this.doPublic(b);var e=i.toString(16).replace(/^1f+00/,"");var g=_rsasign_getAlgNameAndHashFromHexDisgestInfo(e);if(g.length==0){return false}var d=g[0];var h=g[1];var a=function(k){return KJUR.crypto.Util.hashString(k,d)};var c=a(f);return(h==c)}function _rsasign_verifyWithMessageHash(e,a){a=a.replace(_RE_HEXDECONLY,"");a=a.replace(/[ \n]+/g,"");var b=parseBigInt(a,16);if(b.bitLength()>this.n.bitLength()){return 0}var h=this.doPublic(b);var g=h.toString(16).replace(/^1f+00/,"");var c=_rsasign_getAlgNameAndHashFromHexDisgestInfo(g);if(c.length==0){return false}var d=c[0];var f=c[1];return(f==e)}function _rsasign_verifyStringPSS(c,b,a,f){var e=function(g){return KJUR.crypto.Util.hashHex(g,a)};var d=e(rstrtohex(c));if(f===undefined){f=-1}return this.verifyWithMessageHashPSS(d,b,a,f)}function _rsasign_verifyWithMessageHashPSS(f,s,l,c){var k=new BigInteger(s,16);if(k.bitLength()>this.n.bitLength()){return false}var r=function(i){return KJUR.crypto.Util.hashHex(i,l)};var j=hextorstr(f);var h=j.length;var g=this.n.bitLength()-1;var m=Math.ceil(g/8);var q;if(c===-1||c===undefined){c=h}else{if(c===-2){c=m-h-2}else{if(c<-2){throw"invalid salt length"}}}if(m<(h+c+2)){throw"data too long"}var a=this.doPublic(k).toByteArray();for(q=0;q<a.length;q+=1){a[q]&=255}while(a.length<m){a.unshift(0)}if(a[m-1]!==188){throw"encoded message does not end in 0xbc"}a=String.fromCharCode.apply(String,a);var d=a.substr(0,m-h-1);var e=a.substr(d.length,h);var p=(65280>>(8*m-g))&255;if((d.charCodeAt(0)&p)!==0){throw"bits beyond keysize not zero"}var n=pss_mgf1_str(e,d.length,r);var o=[];for(q=0;q<d.length;q+=1){o[q]=d.charCodeAt(q)^n.charCodeAt(q)}o[0]&=~p;var b=m-h-c-2;for(q=0;q<b;q+=1){if(o[q]!==0){throw"leftmost octets not zero"}}if(o[b]!==1){throw"0x01 marker not found"}return e===hextorstr(r(rstrtohex("\x00\x00\x00\x00\x00\x00\x00\x00"+j+String.fromCharCode.apply(String,o.slice(-c)))))}RSAKey.prototype.signWithMessageHash=_rsasign_signWithMessageHash;RSAKey.prototype.signString=_rsasign_signString;RSAKey.prototype.signStringWithSHA1=_rsasign_signStringWithSHA1;RSAKey.prototype.signStringWithSHA256=_rsasign_signStringWithSHA256;RSAKey.prototype.sign=_rsasign_signString;RSAKey.prototype.signWithSHA1=_rsasign_signStringWithSHA1;RSAKey.prototype.signWithSHA256=_rsasign_signStringWithSHA256;RSAKey.prototype.signWithMessageHashPSS=_rsasign_signWithMessageHashPSS;RSAKey.prototype.signStringPSS=_rsasign_signStringPSS;RSAKey.prototype.signPSS=_rsasign_signStringPSS;RSAKey.SALT_LEN_HLEN=-1;RSAKey.SALT_LEN_MAX=-2;RSAKey.prototype.verifyWithMessageHash=_rsasign_verifyWithMessageHash;RSAKey.prototype.verifyString=_rsasign_verifyString;RSAKey.prototype.verifyHexSignatureForMessage=_rsasign_verifyHexSignatureForMessage;RSAKey.prototype.verify=_rsasign_verifyString;RSAKey.prototype.verifyHexSignatureForByteArrayMessage=_rsasign_verifyHexSignatureForMessage;RSAKey.prototype.verifyWithMessageHashPSS=_rsasign_verifyWithMessageHashPSS;RSAKey.prototype.verifyStringPSS=_rsasign_verifyStringPSS;RSAKey.prototype.verifyPSS=_rsasign_verifyStringPSS;RSAKey.SALT_LEN_RECOVER=-2;
	/*! x509-1.1.9.js (c) 2012-2016 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	function X509(){this.subjectPublicKeyRSA=null;this.subjectPublicKeyRSA_hN=null;this.subjectPublicKeyRSA_hE=null;this.hex=null;this.getSerialNumberHex=function(){return ASN1HEX.getDecendantHexVByNthList(this.hex,0,[0,1])};this.getSignatureAlgorithmField=function(){var b=ASN1HEX.getDecendantHexVByNthList(this.hex,0,[0,2,0]);var a=KJUR.asn1.ASN1Util.oidHexToInt(b);var c=KJUR.asn1.x509.OID.oid2name(a);return c};this.getIssuerHex=function(){return ASN1HEX.getDecendantHexTLVByNthList(this.hex,0,[0,3])};this.getIssuerString=function(){return X509.hex2dn(ASN1HEX.getDecendantHexTLVByNthList(this.hex,0,[0,3]))};this.getSubjectHex=function(){return ASN1HEX.getDecendantHexTLVByNthList(this.hex,0,[0,5])};this.getSubjectString=function(){return X509.hex2dn(ASN1HEX.getDecendantHexTLVByNthList(this.hex,0,[0,5]))};this.getNotBefore=function(){var a=ASN1HEX.getDecendantHexVByNthList(this.hex,0,[0,4,0]);a=a.replace(/(..)/g,"%$1");a=decodeURIComponent(a);return a};this.getNotAfter=function(){var a=ASN1HEX.getDecendantHexVByNthList(this.hex,0,[0,4,1]);a=a.replace(/(..)/g,"%$1");a=decodeURIComponent(a);return a};this.readCertPEM=function(c){var e=X509.pemToHex(c);var b=X509.getPublicKeyHexArrayFromCertHex(e);var d=new RSAKey();d.setPublic(b[0],b[1]);this.subjectPublicKeyRSA=d;this.subjectPublicKeyRSA_hN=b[0];this.subjectPublicKeyRSA_hE=b[1];this.hex=e};this.readCertPEMWithoutRSAInit=function(c){var d=X509.pemToHex(c);var b=X509.getPublicKeyHexArrayFromCertHex(d);this.subjectPublicKeyRSA.setPublic(b[0],b[1]);this.subjectPublicKeyRSA_hN=b[0];this.subjectPublicKeyRSA_hE=b[1];this.hex=d};this.getInfo=function(){var p="Basic Fields\n";p+="  serial number: "+this.getSerialNumberHex()+"\n";p+="  signature algorithm: "+this.getSignatureAlgorithmField()+"\n";p+="  issuer: "+this.getIssuerString()+"\n";p+="  notBefore: "+this.getNotBefore()+"\n";p+="  notAfter: "+this.getNotAfter()+"\n";p+="  subject: "+this.getSubjectString()+"\n";p+="  subject public key info: \n";var j=X509.getSubjectPublicKeyInfoPosFromCertHex(this.hex);var d=ASN1HEX.getHexOfTLV_AtObj(this.hex,j);var n=KEYUTIL.getKey(d,null,"pkcs8pub");if(n instanceof RSAKey){p+="    key algorithm: RSA\n";p+="    n="+n.n.toString(16).substr(0,16)+"...\n";p+="    e="+n.e.toString(16)+"\n"}p+="X509v3 Extensions:\n";var m=X509.getV3ExtInfoListOfCertHex(this.hex);for(var e=0;e<m.length;e++){var b=m[e];var o=KJUR.asn1.x509.OID.oid2name(b.oid);if(o===""){o=b.oid}var k="";if(b.critical===true){k="CRITICAL"}p+="  "+o+" "+k+":\n";if(o==="basicConstraints"){var g=X509.getExtBasicConstraints(this.hex);if(g.cA===undefined){p+="    {}\n"}else{p+="    cA=true";if(g.pathLen!==undefined){p+=", pathLen="+g.pathLen}p+="\n"}}else{if(o==="keyUsage"){p+="    "+X509.getExtKeyUsageString(this.hex)+"\n"}else{if(o==="subjectKeyIdentifier"){p+="    "+X509.getExtSubjectKeyIdentifier(this.hex)+"\n"}else{if(o==="authorityKeyIdentifier"){var a=X509.getExtAuthorityKeyIdentifier(this.hex);if(a.kid!==undefined){p+="    kid="+a.kid+"\n"}}else{if(o==="extKeyUsage"){var h=X509.getExtExtKeyUsageName(this.hex);p+="    "+h.join(", ")+"\n"}else{if(o==="subjectAltName"){var f=X509.getExtSubjectAltName(this.hex);p+="    "+f.join(", ")+"\n"}else{if(o==="cRLDistributionPoints"){var l=X509.getExtCRLDistributionPointsURI(this.hex);p+="    "+l+"\n"}else{if(o==="authorityInfoAccess"){var c=X509.getExtAIAInfo(this.hex);if(c.ocsp!==undefined){p+="    ocsp: "+c.ocsp.join(",")+"\n"}if(c.caissuer!==undefined){p+="    caissuer: "+c.caissuer.join(",")+"\n"}}}}}}}}}}p+="signature algorithm: "+X509.getSignatureAlgorithmName(this.hex)+"\n";p+="signature: "+X509.getSignatureValueHex(this.hex).substr(0,16)+"...\n";return p}}X509.pemToBase64=function(a){var b=a;b=b.replace("-----BEGIN CERTIFICATE-----","");b=b.replace("-----END CERTIFICATE-----","");b=b.replace(/[ \n]+/g,"");return b};X509.pemToHex=function(a){var c=X509.pemToBase64(a);var b=b64tohex(c);return b};X509.getSubjectPublicKeyPosFromCertHex=function(f){var e=X509.getSubjectPublicKeyInfoPosFromCertHex(f);if(e==-1){return -1}var b=ASN1HEX.getPosArrayOfChildren_AtObj(f,e);if(b.length!=2){return -1}var d=b[1];if(f.substring(d,d+2)!="03"){return -1}var c=ASN1HEX.getStartPosOfV_AtObj(f,d);if(f.substring(c,c+2)!="00"){return -1}return c+2};X509.getSubjectPublicKeyInfoPosFromCertHex=function(d){var c=ASN1HEX.getStartPosOfV_AtObj(d,0);var b=ASN1HEX.getPosArrayOfChildren_AtObj(d,c);if(b.length<1){return -1}if(d.substring(b[0],b[0]+10)=="a003020102"){if(b.length<6){return -1}return b[6]}else{if(b.length<5){return -1}return b[5]}};X509.getPublicKeyHexArrayFromCertHex=function(f){var e=X509.getSubjectPublicKeyPosFromCertHex(f);var b=ASN1HEX.getPosArrayOfChildren_AtObj(f,e);if(b.length!=2){return[]}var d=ASN1HEX.getHexOfV_AtObj(f,b[0]);var c=ASN1HEX.getHexOfV_AtObj(f,b[1]);if(d!=null&&c!=null){return[d,c]}else{return[]}};X509.getHexTbsCertificateFromCert=function(b){var a=ASN1HEX.getStartPosOfV_AtObj(b,0);return a};X509.getPublicKeyHexArrayFromCertPEM=function(c){var d=X509.pemToHex(c);var b=X509.getPublicKeyHexArrayFromCertHex(d);return b};X509.hex2dn=function(e){var f="";var c=ASN1HEX.getPosArrayOfChildren_AtObj(e,0);for(var d=0;d<c.length;d++){var b=ASN1HEX.getHexOfTLV_AtObj(e,c[d]);f=f+"/"+X509.hex2rdn(b)}return f};X509.hex2rdn=function(a){var f=ASN1HEX.getDecendantHexTLVByNthList(a,0,[0,0]);var e=ASN1HEX.getDecendantHexVByNthList(a,0,[0,1]);var c="";try{c=X509.DN_ATTRHEX[f]}catch(b){c=f}e=e.replace(/(..)/g,"%$1");var d=decodeURIComponent(e);return c+"="+d};X509.DN_ATTRHEX={"0603550406":"C","060355040a":"O","060355040b":"OU","0603550403":"CN","0603550405":"SN","0603550408":"ST","0603550407":"L","0603550409":"streetAddress","060355040f":"businessCategory","0603550411":"postalCode","060b2b0601040182373c020102":"jurisdictionOfIncorporationSP","060b2b0601040182373c020103":"jurisdictionOfIncorporationC",};X509.getPublicKeyFromCertPEM=function(f){var c=X509.getPublicKeyInfoPropOfCertPEM(f);if(c.algoid=="2a864886f70d010101"){var i=KEYUTIL.parsePublicRawRSAKeyHex(c.keyhex);var j=new RSAKey();j.setPublic(i.n,i.e);return j}else{if(c.algoid=="2a8648ce3d0201"){var e=KJUR.crypto.OID.oidhex2name[c.algparam];var j=new KJUR.crypto.ECDSA({curve:e,info:c.keyhex});j.setPublicKeyHex(c.keyhex);return j}else{if(c.algoid=="2a8648ce380401"){var b=ASN1HEX.getVbyList(c.algparam,0,[0],"02");var a=ASN1HEX.getVbyList(c.algparam,0,[1],"02");var d=ASN1HEX.getVbyList(c.algparam,0,[2],"02");var h=ASN1HEX.getHexOfV_AtObj(c.keyhex,0);h=h.substr(2);var j=new KJUR.crypto.DSA();j.setPublic(new BigInteger(b,16),new BigInteger(a,16),new BigInteger(d,16),new BigInteger(h,16));return j}else{throw"unsupported key"}}}};X509.getPublicKeyInfoPropOfCertPEM=function(e){var i={};i.algparam=null;var f=X509.pemToHex(e);var d=ASN1HEX.getPosArrayOfChildren_AtObj(f,0);if(d.length!=3){throw"malformed X.509 certificate PEM (code:001)"}if(f.substr(d[0],2)!="30"){throw"malformed X.509 certificate PEM (code:002)"}var c=ASN1HEX.getPosArrayOfChildren_AtObj(f,d[0]);var g=6;if(f.substr(c[0],2)!=="a0"){g=5}if(c.length<g+1){throw"malformed X.509 certificate PEM (code:003)"}var a=ASN1HEX.getPosArrayOfChildren_AtObj(f,c[g]);if(a.length!=2){throw"malformed X.509 certificate PEM (code:004)"}var h=ASN1HEX.getPosArrayOfChildren_AtObj(f,a[0]);if(h.length!=2){throw"malformed X.509 certificate PEM (code:005)"}i.algoid=ASN1HEX.getHexOfV_AtObj(f,h[0]);if(f.substr(h[1],2)=="06"){i.algparam=ASN1HEX.getHexOfV_AtObj(f,h[1])}else{if(f.substr(h[1],2)=="30"){i.algparam=ASN1HEX.getHexOfTLV_AtObj(f,h[1])}}if(f.substr(a[1],2)!="03"){throw"malformed X.509 certificate PEM (code:006)"}var b=ASN1HEX.getHexOfV_AtObj(f,a[1]);i.keyhex=b.substr(2);return i};X509.getPublicKeyInfoPosOfCertHEX=function(c){var b=ASN1HEX.getPosArrayOfChildren_AtObj(c,0);if(b.length!=3){throw"malformed X.509 certificate PEM (code:001)"}if(c.substr(b[0],2)!="30"){throw"malformed X.509 certificate PEM (code:002)"}var a=ASN1HEX.getPosArrayOfChildren_AtObj(c,b[0]);if(a.length<7){throw"malformed X.509 certificate PEM (code:003)"}return a[6]};X509.getV3ExtInfoListOfCertHex=function(g){var b=ASN1HEX.getPosArrayOfChildren_AtObj(g,0);if(b.length!=3){throw"malformed X.509 certificate PEM (code:001)"}if(g.substr(b[0],2)!="30"){throw"malformed X.509 certificate PEM (code:002)"}var a=ASN1HEX.getPosArrayOfChildren_AtObj(g,b[0]);if(a.length<8){throw"malformed X.509 certificate PEM (code:003)"}if(g.substr(a[7],2)!="a3"){throw"malformed X.509 certificate PEM (code:004)"}var h=ASN1HEX.getPosArrayOfChildren_AtObj(g,a[7]);if(h.length!=1){throw"malformed X.509 certificate PEM (code:005)"}if(g.substr(h[0],2)!="30"){throw"malformed X.509 certificate PEM (code:006)"}var f=ASN1HEX.getPosArrayOfChildren_AtObj(g,h[0]);var e=f.length;var d=new Array(e);for(var c=0;c<e;c++){d[c]=X509.getV3ExtItemInfo_AtObj(g,f[c])}return d};X509.getV3ExtItemInfo_AtObj=function(f,g){var e={};e.posTLV=g;var b=ASN1HEX.getPosArrayOfChildren_AtObj(f,g);if(b.length!=2&&b.length!=3){throw"malformed X.509v3 Ext (code:001)"}if(f.substr(b[0],2)!="06"){throw"malformed X.509v3 Ext (code:002)"}var d=ASN1HEX.getHexOfV_AtObj(f,b[0]);e.oid=ASN1HEX.hextooidstr(d);e.critical=false;if(b.length==3){e.critical=true}var c=b[b.length-1];if(f.substr(c,2)!="04"){throw"malformed X.509v3 Ext (code:003)"}e.posV=ASN1HEX.getStartPosOfV_AtObj(f,c);return e};X509.getHexOfTLV_V3ExtValue=function(b,a){var c=X509.getPosOfTLV_V3ExtValue(b,a);if(c==-1){return null}return ASN1HEX.getHexOfTLV_AtObj(b,c)};X509.getHexOfV_V3ExtValue=function(b,a){var c=X509.getPosOfTLV_V3ExtValue(b,a);if(c==-1){return null}return ASN1HEX.getHexOfV_AtObj(b,c)};X509.getPosOfTLV_V3ExtValue=function(f,b){var d=b;if(!b.match(/^[0-9.]+$/)){d=KJUR.asn1.x509.OID.name2oid(b)}if(d==""){return -1}var c=X509.getV3ExtInfoListOfCertHex(f);for(var a=0;a<c.length;a++){var e=c[a];if(e.oid==d){return e.posV}}return -1};X509.getExtBasicConstraints=function(d){var a=X509.getHexOfV_V3ExtValue(d,"basicConstraints");if(a===null){return null}if(a===""){return{}}if(a==="0101ff"){return{cA:true}}if(a.substr(0,8)==="0101ff02"){var c=ASN1HEX.getHexOfV_AtObj(a,6);var b=parseInt(c,16);return{cA:true,pathLen:b}}throw"unknown error"};X509.KEYUSAGE_NAME=["digitalSignature","nonRepudiation","keyEncipherment","dataEncipherment","keyAgreement","keyCertSign","cRLSign","encipherOnly","decipherOnly"];X509.getExtKeyUsageBin=function(d){var b=X509.getHexOfV_V3ExtValue(d,"keyUsage");if(b==""){return""}if(b.length%2!=0||b.length<=2){throw"malformed key usage value"}var a=parseInt(b.substr(0,2));var c=parseInt(b.substr(2),16).toString(2);return c.substr(0,c.length-a)};X509.getExtKeyUsageString=function(e){var d=X509.getExtKeyUsageBin(e);var b=new Array();for(var c=0;c<d.length;c++){if(d.substr(c,1)=="1"){b.push(X509.KEYUSAGE_NAME[c])}}return b.join(",")};X509.getExtSubjectKeyIdentifier=function(b){var a=X509.getHexOfV_V3ExtValue(b,"subjectKeyIdentifier");return a};X509.getExtAuthorityKeyIdentifier=function(f){var b={};var e=X509.getHexOfTLV_V3ExtValue(f,"authorityKeyIdentifier");if(e===null){return null}var c=ASN1HEX.getPosArrayOfChildren_AtObj(e,0);for(var d=0;d<c.length;d++){if(e.substr(c[d],2)==="80"){b.kid=ASN1HEX.getHexOfV_AtObj(e,c[d])}}return b};X509.getExtExtKeyUsageName=function(k){var b=new Array();var f=X509.getHexOfTLV_V3ExtValue(k,"extKeyUsage");if(f===null){return null}var c=ASN1HEX.getPosArrayOfChildren_AtObj(f,0);for(var e=0;e<c.length;e++){var j=ASN1HEX.getHexOfV_AtObj(f,c[e]);var g=KJUR.asn1.ASN1Util.oidHexToInt(j);var d=KJUR.asn1.x509.OID.oid2name(g);b.push(d)}return b};X509.getExtSubjectAltName=function(g){var b=new Array();var f=X509.getHexOfTLV_V3ExtValue(g,"subjectAltName");var c=ASN1HEX.getPosArrayOfChildren_AtObj(f,0);for(var e=0;e<c.length;e++){if(f.substr(c[e],2)==="82"){var d=hextoutf8(ASN1HEX.getHexOfV_AtObj(f,c[e]));b.push(d)}}return b};X509.getExtCRLDistributionPointsURI=function(n){var p=new Array();var k=X509.getHexOfTLV_V3ExtValue(n,"cRLDistributionPoints");var o=ASN1HEX.getPosArrayOfChildren_AtObj(k,0);for(var g=0;g<o.length;g++){var l=ASN1HEX.getHexOfTLV_AtObj(k,o[g]);var b=ASN1HEX.getPosArrayOfChildren_AtObj(l,0);for(var e=0;e<b.length;e++){if(l.substr(b[e],2)==="a0"){var f=ASN1HEX.getHexOfV_AtObj(l,b[e]);if(f.substr(0,2)==="a0"){var c=ASN1HEX.getHexOfV_AtObj(f,0);if(c.substr(0,2)==="86"){var m=ASN1HEX.getHexOfV_AtObj(c,0);var d=hextoutf8(m);p.push(d)}}}}}return p};X509.getExtAIAInfo=function(g){var j={};j.ocsp=[];j.caissuer=[];var h=X509.getPosOfTLV_V3ExtValue(g,"authorityInfoAccess");if(h==-1){return null}if(g.substr(h,2)!="30"){throw"malformed AIA Extn Value"}var d=ASN1HEX.getPosArrayOfChildren_AtObj(g,h);for(var c=0;c<d.length;c++){var a=d[c];var b=ASN1HEX.getPosArrayOfChildren_AtObj(g,a);if(b.length!=2){throw"malformed AccessDescription of AIA Extn"}var e=b[0];var f=b[1];if(ASN1HEX.getHexOfV_AtObj(g,e)=="2b06010505073001"){if(g.substr(f,2)=="86"){j.ocsp.push(hextoutf8(ASN1HEX.getHexOfV_AtObj(g,f)))}}if(ASN1HEX.getHexOfV_AtObj(g,e)=="2b06010505073002"){if(g.substr(f,2)=="86"){j.caissuer.push(hextoutf8(ASN1HEX.getHexOfV_AtObj(g,f)))}}}return j};X509.getSignatureAlgorithmName=function(d){var b=ASN1HEX.getDecendantHexVByNthList(d,0,[1,0]);var a=KJUR.asn1.ASN1Util.oidHexToInt(b);var c=KJUR.asn1.x509.OID.oid2name(a);return c};X509.getSignatureValueHex=function(b){var a=ASN1HEX.getDecendantHexVByNthList(b,0,[2]);if(a.substr(0,2)!=="00"){throw"can't get signature value"}return a.substr(2)};X509.getSerialNumberHex=function(a){return ASN1HEX.getDecendantHexVByNthList(a,0,[0,1])};
	/*! jws-3.3.4 (c) 2013-2016 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	if(typeof KJUR=="undefined"||!KJUR){KJUR={}}if(typeof KJUR.jws=="undefined"||!KJUR.jws){KJUR.jws={}}KJUR.jws.JWS=function(){var a=KJUR.jws.JWS;this.parseJWS=function(e,g){if((this.parsedJWS!==undefined)&&(g||(this.parsedJWS.sigvalH!==undefined))){return}if(e.match(/^([^.]+)\.([^.]+)\.([^.]+)$/)==null){throw"JWS signature is not a form of 'Head.Payload.SigValue'."}var h=RegExp.$1;var c=RegExp.$2;var i=RegExp.$3;var k=h+"."+c;this.parsedJWS={};this.parsedJWS.headB64U=h;this.parsedJWS.payloadB64U=c;this.parsedJWS.sigvalB64U=i;this.parsedJWS.si=k;if(!g){var f=b64utohex(i);var d=parseBigInt(f,16);this.parsedJWS.sigvalH=f;this.parsedJWS.sigvalBI=d}var b=b64utoutf8(h);var j=b64utoutf8(c);this.parsedJWS.headS=b;this.parsedJWS.payloadS=j;if(!a.isSafeJSONString(b,this.parsedJWS,"headP")){throw"malformed JSON string for JWS Head: "+b}}};KJUR.jws.JWS.sign=function(a,i,c,m,l){var k=KJUR.jws.JWS;var q,e,j;if(typeof i!="string"&&typeof i!="object"){throw"spHeader must be JSON string or object: "+i}if(typeof i=="object"){e=i;q=JSON.stringify(e)}if(typeof i=="string"){q=i;if(!k.isSafeJSONString(q)){throw"JWS Head is not safe JSON string: "+q}e=k.readSafeJSONString(q)}j=c;if(typeof c=="object"){j=JSON.stringify(c)}if((a==""||a==null)&&e.alg!==undefined){a=e.alg}if((a!=""&&a!=null)&&e.alg===undefined){e.alg=a;q=JSON.stringify(e)}if(a!==e.alg){throw"alg and sHeader.alg doesn't match: "+a+"!="+e.alg}var d=null;if(k.jwsalg2sigalg[a]===undefined){throw"unsupported alg name: "+a}else{d=k.jwsalg2sigalg[a]}var b=utf8tob64u(q);var g=utf8tob64u(j);var o=b+"."+g;var n="";if(d.substr(0,4)=="Hmac"){if(m===undefined){throw"mac key shall be specified for HS* alg"}var h=new KJUR.crypto.Mac({alg:d,prov:"cryptojs",pass:m});h.updateString(o);n=h.doFinal()}else{if(d.indexOf("withECDSA")!=-1){var p=new KJUR.crypto.Signature({alg:d});p.init(m,l);p.updateString(o);hASN1Sig=p.sign();n=KJUR.crypto.ECDSA.asn1SigToConcatSig(hASN1Sig)}else{if(d!="none"){var p=new KJUR.crypto.Signature({alg:d});p.init(m,l);p.updateString(o);n=p.sign()}}}var f=hextob64u(n);return o+"."+f};KJUR.jws.JWS.verify=function(p,t,j){var m=KJUR.jws.JWS;var q=p.split(".");var d=q[0];var l=q[1];var b=d+"."+l;var r=b64utohex(q[2]);var i=m.readSafeJSONString(b64utoutf8(q[0]));var h=null;var s=null;if(i.alg===undefined){throw"algorithm not specified in header"}else{h=i.alg;s=h.substr(0,2)}if(j!=null&&Object.prototype.toString.call(j)==="[object Array]"&&j.length>0){var c=":"+j.join(":")+":";if(c.indexOf(":"+h+":")==-1){throw"algorithm '"+h+"' not accepted in the list"}}if(h!="none"&&t===null){throw"key shall be specified to verify."}if(typeof t=="string"&&t.indexOf("-----BEGIN ")!=-1){t=KEYUTIL.getKey(t)}if(s=="RS"||s=="PS"){if(!(t instanceof RSAKey)){throw"key shall be a RSAKey obj for RS* and PS* algs"}}if(s=="ES"){if(!(t instanceof KJUR.crypto.ECDSA)){throw"key shall be a ECDSA obj for ES* algs"}}if(h=="none"){}var n=null;if(m.jwsalg2sigalg[i.alg]===undefined){throw"unsupported alg name: "+h}else{n=m.jwsalg2sigalg[h]}if(n=="none"){throw"not supported"}else{if(n.substr(0,4)=="Hmac"){var k=null;if(t===undefined){throw"hexadecimal key shall be specified for HMAC"}var g=new KJUR.crypto.Mac({alg:n,pass:t});g.updateString(b);k=g.doFinal();return r==k}else{if(n.indexOf("withECDSA")!=-1){var f=null;try{f=KJUR.crypto.ECDSA.concatSigToASN1Sig(r)}catch(o){return false}var e=new KJUR.crypto.Signature({alg:n});e.init(t);e.updateString(b);return e.verify(f)}else{var e=new KJUR.crypto.Signature({alg:n});e.init(t);e.updateString(b);return e.verify(r)}}}};KJUR.jws.JWS.parse=function(g){var c=g.split(".");var b={};var f,e,d;if(c.length!=2&&c.length!=3){throw"malformed sJWS: wrong number of '.' splitted elements"}f=c[0];e=c[1];if(c.length==3){d=c[2]}b.headerObj=KJUR.jws.JWS.readSafeJSONString(b64utoutf8(f));b.payloadObj=KJUR.jws.JWS.readSafeJSONString(b64utoutf8(e));b.headerPP=JSON.stringify(b.headerObj,null,"  ");if(b.payloadObj==null){b.payloadPP=b64utoutf8(e)}else{b.payloadPP=JSON.stringify(b.payloadObj,null,"  ")}if(d!==undefined){b.sigHex=b64utohex(d)}return b};KJUR.jws.JWS.verifyJWT=function(d,j,l){var h=KJUR.jws.JWS;var i=d.split(".");var c=i[0];var g=i[1];var m=c+"."+g;var k=b64utohex(i[2]);var f=h.readSafeJSONString(b64utoutf8(c));var e=h.readSafeJSONString(b64utoutf8(g));if(f.alg===undefined){return false}if(l.alg===undefined){throw"acceptField.alg shall be specified"}if(!h.inArray(f.alg,l.alg)){return false}if(e.iss!==undefined&&typeof l.iss==="object"){if(!h.inArray(e.iss,l.iss)){return false}}if(e.sub!==undefined&&typeof l.sub==="object"){if(!h.inArray(e.sub,l.sub)){return false}}if(e.aud!==undefined&&typeof l.aud==="object"){if(typeof e.aud=="string"){if(!h.inArray(e.aud,l.aud)){return false}}else{if(typeof e.aud=="object"){if(!h.includedArray(e.aud,l.aud)){return false}}}}var b=KJUR.jws.IntDate.getNow();if(l.verifyAt!==undefined&&typeof l.verifyAt==="number"){b=l.verifyAt}if(l.gracePeriod===undefined||typeof l.gracePeriod!=="number"){l.gracePeriod=0}if(e.exp!==undefined&&typeof e.exp=="number"){if(e.exp+l.gracePeriod<b){return false}}if(e.nbf!==undefined&&typeof e.nbf=="number"){if(b<e.nbf-l.gracePeriod){return false}}if(e.iat!==undefined&&typeof e.iat=="number"){if(b<e.iat-l.gracePeriod){return false}}if(e.jti!==undefined&&l.jti!==undefined){if(e.jti!==l.jti){return false}}if(!KJUR.jws.JWS.verify(d,j,l.alg)){return false}return true};KJUR.jws.JWS.includedArray=function(b,a){var d=KJUR.jws.JWS.inArray;if(b===null){return false}if(typeof b!=="object"){return false}if(typeof b.length!=="number"){return false}for(var c=0;c<b.length;c++){if(!d(b[c],a)){return false}}return true};KJUR.jws.JWS.inArray=function(d,b){if(b===null){return false}if(typeof b!=="object"){return false}if(typeof b.length!=="number"){return false}for(var c=0;c<b.length;c++){if(b[c]==d){return true}}return false};KJUR.jws.JWS.jwsalg2sigalg={HS256:"HmacSHA256",HS384:"HmacSHA384",HS512:"HmacSHA512",RS256:"SHA256withRSA",RS384:"SHA384withRSA",RS512:"SHA512withRSA",ES256:"SHA256withECDSA",ES384:"SHA384withECDSA",PS256:"SHA256withRSAandMGF1",PS384:"SHA384withRSAandMGF1",PS512:"SHA512withRSAandMGF1",none:"none",};KJUR.jws.JWS.isSafeJSONString=function(c,b,d){var e=null;try{e=jsonParse(c);if(typeof e!="object"){return 0}if(e.constructor===Array){return 0}if(b){b[d]=e}return 1}catch(a){return 0}};KJUR.jws.JWS.readSafeJSONString=function(b){var c=null;try{c=jsonParse(b);if(typeof c!="object"){return null}if(c.constructor===Array){return null}return c}catch(a){return null}};KJUR.jws.JWS.getEncodedSignatureValueFromJWS=function(a){if(a.match(/^[^.]+\.[^.]+\.([^.]+)$/)==null){throw"JWS signature is not a form of 'Head.Payload.SigValue'."}return RegExp.$1};KJUR.jws.JWS.getJWKthumbprint=function(d){if(d.kty!=="RSA"&&d.kty!=="EC"&&d.kty!=="oct"){throw"unsupported algorithm for JWK Thumprint"}var a="{";if(d.kty==="RSA"){if(typeof d.n!="string"||typeof d.e!="string"){throw"wrong n and e value for RSA key"}a+='"e":"'+d.e+'",';a+='"kty":"'+d.kty+'",';a+='"n":"'+d.n+'"}'}else{if(d.kty==="EC"){if(typeof d.crv!="string"||typeof d.x!="string"||typeof d.y!="string"){throw"wrong crv, x and y value for EC key"}a+='"crv":"'+d.crv+'",';a+='"kty":"'+d.kty+'",';a+='"x":"'+d.x+'",';a+='"y":"'+d.y+'"}'}else{if(d.kty==="oct"){if(typeof d.k!="string"){throw"wrong k value for oct(symmetric) key"}a+='"kty":"'+d.kty+'",';a+='"k":"'+d.k+'"}'}}}var b=rstrtohex(a);var c=KJUR.crypto.Util.hashHex(b,"sha256");var e=hextob64u(c);return e};KJUR.jws.IntDate={};KJUR.jws.IntDate.get=function(a){if(a=="now"){return KJUR.jws.IntDate.getNow()}else{if(a=="now + 1hour"){return KJUR.jws.IntDate.getNow()+60*60}else{if(a=="now + 1day"){return KJUR.jws.IntDate.getNow()+60*60*24}else{if(a=="now + 1month"){return KJUR.jws.IntDate.getNow()+60*60*24*30}else{if(a=="now + 1year"){return KJUR.jws.IntDate.getNow()+60*60*24*365}else{if(a.match(/Z$/)){return KJUR.jws.IntDate.getZulu(a)}else{if(a.match(/^[0-9]+$/)){return parseInt(a)}}}}}}}throw"unsupported format: "+a};KJUR.jws.IntDate.getZulu=function(l){var k;if(k=l.match(/(\d+)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)Z/)){var b=RegExp.$1;var i=parseInt(b);if(b.length==4){}else{if(b.length==2){if(50<=i&&i<100){i=1900+i}else{if(0<=i&&i<50){i=2000+i}else{throw"malformed year string for UTCTime"}}}else{throw"malformed year string"}}var g=parseInt(RegExp.$2)-1;var j=parseInt(RegExp.$3);var c=parseInt(RegExp.$4);var e=parseInt(RegExp.$5);var f=parseInt(RegExp.$6);var h=new Date(Date.UTC(i,g,j,c,e,f));return ~~(h/1000)}throw"unsupported format: "+l};KJUR.jws.IntDate.getNow=function(){var a=~~(new Date()/1000);return a};KJUR.jws.IntDate.intDate2UTCString=function(a){var b=new Date(a*1000);return b.toUTCString()};KJUR.jws.IntDate.intDate2Zulu=function(e){var i=new Date(e*1000);var h=("0000"+i.getUTCFullYear()).slice(-4);var g=("00"+(i.getUTCMonth()+1)).slice(-2);var b=("00"+i.getUTCDate()).slice(-2);var a=("00"+i.getUTCHours()).slice(-2);var c=("00"+i.getUTCMinutes()).slice(-2);var f=("00"+i.getUTCSeconds()).slice(-2);return h+g+b+a+c+f+"Z"};
	/*! jwsjs-2.0.1 (c) 2010-2015 Kenji Urushima | kjur.github.com/jsjws/license
	 */
	if(typeof KJUR=="undefined"||!KJUR){KJUR={}}if(typeof KJUR.jws=="undefined"||!KJUR.jws){KJUR.jws={}}KJUR.jws.JWSJS=function(){var a=KJUR.jws.JWS;this.aHeader=[];this.sPayload="";this.aSignature=[];this.init=function(){this.aHeader=[];this.sPayload="";this.aSignature=[]};this.initWithJWS=function(c){this.init();var b=new KJUR.jws.JWS();b.parseJWS(c);this.aHeader.push(b.parsedJWS.headB64U);this.sPayload=b.parsedJWS.payloadB64U;this.aSignature.push(b.parsedJWS.sigvalB64U)};this.addSignatureByHeaderKey=function(e,b){var d=b64utoutf8(this.sPayload);var c=new KJUR.jws.JWS();var f=c.generateJWSByP1PrvKey(e,d,b);this.aHeader.push(c.parsedJWS.headB64U);this.aSignature.push(c.parsedJWS.sigvalB64U)};this.addSignatureByHeaderPayloadKey=function(e,d,b){var c=new KJUR.jws.JWS();var f=c.generateJWSByP1PrvKey(e,d,b);this.aHeader.push(c.parsedJWS.headB64U);this.sPayload=c.parsedJWS.payloadB64U;this.aSignature.push(c.parsedJWS.sigvalB64U)};this.verifyWithCerts=function(c){if(this.aHeader.length!=c.length){throw"num headers does not match with num certs"}if(this.aSignature.length!=c.length){throw"num signatures does not match with num certs"}var k=this.sPayload;var g="";for(var d=0;d<c.length;d++){var e=c[d];var f=this.aHeader[d];var m=this.aSignature[d];var b=f+"."+k+"."+m;var j=new KJUR.jws.JWS();try{var l=j.verifyJWSByPemX509Cert(b,e);if(l!=1){g+=(d+1)+"th signature unmatch. "}}catch(h){g+=(d+1)+"th signature fail("+h+"). "}}if(g==""){return 1}else{throw g}};this.readJWSJS=function(b){var c=a.readSafeJSONString(b);if(c==null){throw"argument is not JSON string: "+b}this.aHeader=c.headers;this.sPayload=c.payload;this.aSignature=c.signatures};this.getJSON=function(){return{headers:this.aHeader,payload:this.sPayload,signatures:this.aSignature}};this.isEmpty=function(){if(this.aHeader.length==0){return 1}return 0}};
	/*! nodeutil-1.0.0 (c) 2015 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
	function readFileUTF8(a){return __webpack_require__(12).readFileSync(a,"utf8")}function readFileHexByBin(c){var b=__webpack_require__(7);var a=__webpack_require__(12);return b.rstrtohex(a.readFileSync(c,"binary"))}function readFile(b){var a=__webpack_require__(12);return a.readFileSync(b,"binary")}function saveFile(c,b){var a=__webpack_require__(12);a.writeFileSync(c,b,"binary")}function saveFileBinByHex(e,b){var a=__webpack_require__(12);var c=__webpack_require__(7);var d=c.hextorstr(b);a.writeFileSync(e,d,"binary")};
	exports.SecureRandom = SecureRandom;
	exports.rng_seed_time = rng_seed_time;

	exports.BigInteger = BigInteger;
	exports.RSAKey = RSAKey;
	exports.ECDSA = KJUR.crypto.ECDSA;
	exports.DSA = KJUR.crypto.DSA;
	exports.Signature = KJUR.crypto.Signature;
	exports.MessageDigest = KJUR.crypto.MessageDigest;
	exports.Mac = KJUR.crypto.Mac;
	exports.KEYUTIL = KEYUTIL;
	exports.ASN1HEX = ASN1HEX;
	exports.X509 = X509;
	exports.CryptoJS = CryptoJS;

	// ext/base64.js
	exports.b64tohex = b64tohex;
	exports.b64toBA = b64toBA;

	// base64x.js
	exports.stoBA = stoBA;
	exports.BAtos = BAtos;
	exports.BAtohex = BAtohex;
	exports.stohex = stohex;
	exports.stob64 = stob64;
	exports.stob64u = stob64u;
	exports.b64utos = b64utos;
	exports.b64tob64u = b64tob64u;
	exports.b64utob64 = b64utob64;
	exports.hex2b64 = hex2b64;
	exports.hextob64u = hextob64u;
	exports.b64utohex = b64utohex;
	exports.b64tohex = b64tohex;
	exports.utf8tob64u = utf8tob64u;
	exports.b64utoutf8 = b64utoutf8;
	exports.utf8tob64 = utf8tob64;
	exports.b64toutf8 = b64toutf8;
	exports.utf8tohex = utf8tohex;
	exports.hextoutf8 = hextoutf8;
	exports.hextorstr = hextorstr;
	exports.rstrtohex = rstrtohex;
	exports.newline_toUnix = newline_toUnix;
	exports.newline_toDos = newline_toDos;
	exports.intarystrtohex = intarystrtohex;
	exports.strdiffidx = strdiffidx;

	exports.crypto = KJUR.crypto;
	exports.asn1 = KJUR.asn1;
	exports.jws = KJUR.jws;

	exports.readFileUTF8 = readFileUTF8;
	exports.readFileHexByBin = readFileHexByBin;
	exports.readFile = readFile;
	exports.saveFile = saveFile;
	exports.saveFileBinByHex = saveFileBinByHex;


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(9)
	var ieee754 = __webpack_require__(10)
	var isArray = __webpack_require__(11)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()

	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192 // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}

	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)

	  var actual = that.write(string, encoding)

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len)
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8'

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true

	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0

	  if (this === target) return 0

	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)

	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }

	  return len
	}

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0

	  if (!val) val = 0

	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }

	  return this
	}

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer, (function() { return this; }())))

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict'

	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray

	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}

	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63

	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}

	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return (b64.length * 3 / 4) - placeHoldersCount(b64)
	}

	function toByteArray (b64) {
	  var i, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)

	  arr = new Arr((len * 3 / 4) - placeHolders)

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len

	  var L = 0

	  for (i = 0; i < l; i += 4) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }

	  parts.push(output)

	  return parts.join('')
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 11 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Emitter = __webpack_require__(14);
	var reduce = __webpack_require__(15);
	var requestBase = __webpack_require__(16);
	var isObject = __webpack_require__(17);

	/**
	 * Root reference for iframes.
	 */

	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  root = this;
	}

	/**
	 * Noop.
	 */

	function noop(){};

	/**
	 * Expose `request`.
	 */

	var request = module.exports = __webpack_require__(18).bind(null, Request);

	/**
	 * Determine XHR.
	 */

	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  return false;
	};

	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */

	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */

	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    if (null != obj[key]) {
	      pushEncodedKeyValuePair(pairs, key, obj[key]);
	    }
	  }
	  return pairs.join('&');
	}

	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */

	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (Array.isArray(val)) {
	    return val.forEach(function(v) {
	      pushEncodedKeyValuePair(pairs, key, v);
	    });
	  } else if (isObject(val)) {
	    for(var subkey in val) {
	      pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
	    }
	    return;
	  }
	  pairs.push(encodeURIComponent(key)
	    + '=' + encodeURIComponent(val));
	}

	/**
	 * Expose serialization method.
	 */

	 request.serializeObject = serialize;

	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */

	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var pair;
	  var pos;

	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    pos = pair.indexOf('=');
	    if (pos == -1) {
	      obj[decodeURIComponent(pair)] = '';
	    } else {
	      obj[decodeURIComponent(pair.slice(0, pos))] =
	        decodeURIComponent(pair.slice(pos + 1));
	    }
	  }

	  return obj;
	}

	/**
	 * Expose parser.
	 */

	request.parseString = parseString;

	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */

	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};

	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */

	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };

	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */

	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};

	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;

	  lines.pop(); // trailing CRLF

	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }

	  return fields;
	}

	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */

	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}

	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function type(str){
	  return str.split(/ *; */).shift();
	};

	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function params(str){
	  return reduce(str.split(/ *; */), function(obj, str){
	    var parts = str.split(/ *= */)
	      , key = parts.shift()
	      , val = parts.shift();

	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};

	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */

	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this._setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this._setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this._parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}

	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};

	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */

	Response.prototype._setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);

	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};

	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */

	Response.prototype._parseBody = function(str){
	  var parse = request.parse[this.type];
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};

	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */

	Response.prototype._setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }

	  var type = status / 100 | 0;

	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;

	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;

	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};

	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */

	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;

	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;

	  return err;
	};

	/**
	 * Expose `Response`.
	 */

	request.Response = Response;

	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */

	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;

	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      // issue #876: return the http status code if the response parsing fails
	      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
	      return self.callback(err);
	    }

	    self.emit('response', res);

	    if (err) {
	      return self.callback(err, res);
	    }

	    try {
	      if (res.status >= 200 && res.status < 300) {
	        return self.callback(err, res);
	      }

	      var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	      new_err.original = err;
	      new_err.response = res;
	      new_err.status = res.status;

	      self.callback(new_err, res);
	    } catch(e) {
	      self.callback(e); // #985 touching res may cause INVALID_STATE_ERR on old Android
	    }
	  });
	}

	/**
	 * Mixin `Emitter` and `requestBase`.
	 */

	Emitter(Request.prototype);
	for (var key in requestBase) {
	  Request.prototype[key] = requestBase[key];
	}

	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};

	/**
	 * Set responseType to `val`. Presently valid responseTypes are 'blob' and
	 * 'arraybuffer'.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};

	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.auth = function(user, pass, options){
	  if (!options) {
	    options = {
	      type: 'basic'
	    }
	  }

	  switch (options.type) {
	    case 'basic':
	      var str = btoa(user + ':' + pass);
	      this.set('Authorization', 'Basic ' + str);
	    break;

	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	  }
	  return this;
	};

	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/

	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};

	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.attach = function(field, file, filename){
	  this._getFormData().append(field, file, filename || file.name);
	  return this;
	};

	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};

	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */

	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};

	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */

	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;

	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;

	  this.callback(err);
	};

	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */

	Request.prototype._timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};

	/**
	 * Compose querystring to append to req.url
	 *
	 * @api private
	 */

	Request.prototype._appendQueryString = function(){
	  var query = this._query.join('&');
	  if (query) {
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }
	};

	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var timeout = this._timeout;
	  var data = this._formData || this._data;

	  // store callback
	  this._callback = fn || noop;

	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;

	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }

	    if (0 == status) {
	      if (self.timedout) return self._timeoutError();
	      if (self._aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };

	  // progress
	  var handleProgress = function(e){
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = 'download';
	    self.emit('progress', e);
	  };
	  if (this.hasListeners('progress')) {
	    xhr.onprogress = handleProgress;
	  }
	  try {
	    if (xhr.upload && this.hasListeners('progress')) {
	      xhr.upload.onprogress = handleProgress;
	    }
	  } catch(e) {
	    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	    // Reported here:
	    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	  }

	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }

	  // querystring
	  this._appendQueryString();

	  // initiate request
	  if (this.username && this.password) {
	    xhr.open(this.method, this.url, true, this.username, this.password);
	  } else {
	    xhr.open(this.method, this.url, true);
	  }

	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;

	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }

	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }

	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }

	  // send stuff
	  this.emit('request', this);

	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};


	/**
	 * Expose `Request`.
	 */

	request.Request = Request;

	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * OPTIONS query to `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.options = function(url, data, fn){
	  var req = request('OPTIONS', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	function del(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};

	request['del'] = del;
	request['delete'] = del;

	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	if (true) {
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 15 */
/***/ function(module, exports) {

	
	/**
	 * Reduce `arr` with `fn`.
	 *
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Mixed} initial
	 *
	 * TODO: combatible error handling?
	 */

	module.exports = function(arr, fn, initial){  
	  var idx = 0;
	  var len = arr.length;
	  var curr = arguments.length == 3
	    ? initial
	    : arr[idx++];

	  while (idx < len) {
	    curr = fn.call(null, curr, arr[idx], ++idx, arr);
	  }
	  
	  return curr;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(17);

	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.clearTimeout = function _clearTimeout(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};

	/**
	 * Override default response body parser
	 *
	 * This function will be called to convert incoming data into request.body
	 *
	 * @param {Function}
	 * @api public
	 */

	exports.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};

	/**
	 * Override default request body serializer
	 *
	 * This function will be called to convert data set via .send or .attach into payload to send
	 *
	 * @param {Function}
	 * @api public
	 */

	exports.serialize = function serialize(fn){
	  this._serializer = fn;
	  return this;
	};

	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.timeout = function timeout(ms){
	  this._timeout = ms;
	  return this;
	};

	/**
	 * Promise support
	 *
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @return {Request}
	 */

	exports.then = function then(resolve, reject) {
	  if (!this._fullfilledPromise) {
	    var self = this;
	    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
	      self.end(function(err, res){
	        if (err) innerReject(err); else innerResolve(res);
	      });
	    });
	  }
	  return this._fullfilledPromise.then(resolve, reject);
	}

	/**
	 * Allow for extension
	 */

	exports.use = function use(fn) {
	  fn(this);
	  return this;
	}


	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	exports.get = function(field){
	  return this._header[field.toLowerCase()];
	};

	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */

	exports.getHeader = exports.get;

	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};

	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	exports.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};

	/**
	 * Write the field `name` and `val` for "multipart/form-data"
	 * request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	exports.field = function(name, val) {
	  this._getFormData().append(name, val);
	  return this;
	};

	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	exports.abort = function(){
	  if (this._aborted) {
	    return this;
	  }
	  this._aborted = true;
	  this.xhr && this.xhr.abort(); // browser
	  this.req && this.req.abort(); // node
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};

	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */

	exports.withCredentials = function(){
	  // This is browser-only functionality. Node side is no-op.
	  this._withCredentials = true;
	  return this;
	};

	/**
	 * Set the max redirects to `n`. Does noting in browser XHR implementation.
	 *
	 * @param {Number} n
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.redirects = function(n){
	  this._maxRedirects = n;
	  return this;
	};

	/**
	 * Convert to a plain javascript object (not JSON string) of scalar properties.
	 * Note as this method is designed to return a useful non-this value,
	 * it cannot be chained.
	 *
	 * @return {Object} describing method, url, and data of this request
	 * @api public
	 */

	exports.toJSON = function(){
	  return {
	    method: this.method,
	    url: this.url,
	    data: this._data
	  };
	};

	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	exports._isHost = function _isHost(obj) {
	  var str = {}.toString.call(obj);

	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}

	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	 *      request.post('/user')
	 *        .send('name=tobi')
	 *        .send('species=ferret')
	 *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.send = function(data){
	  var obj = isObject(data);
	  var type = this._header['content-type'];

	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    // default to x-www-form-urlencoded
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }

	  if (!obj || this._isHost(data)) return this;

	  // default to json
	  if (!type) this.type('json');
	  return this;
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(obj) {
	  return null !== obj && 'object' === typeof obj;
	}

	module.exports = isObject;


/***/ },
/* 18 */
/***/ function(module, exports) {

	// The node and browser modules expose versions of this with the
	// appropriate constructor function bound as first argument
	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */

	function request(RequestConstructor, method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new RequestConstructor('GET', method).end(url);
	  }

	  // url first
	  if (2 == arguments.length) {
	    return new RequestConstructor('GET', method);
	  }

	  return new RequestConstructor(method, url);
	}

	module.exports = request;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var punycode = __webpack_require__(20);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(22);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	            'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  Object.keys(this).forEach(function(k) {
	    result[k] = this[k];
	  }, this);

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    Object.keys(relative).forEach(function(k) {
	      if (k !== 'protocol')
	        result[k] = relative[k];
	    });

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      Object.keys(relative).forEach(function(k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!isNull(result.pathname) || !isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!isNull(result.pathname) || !isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};

	function isString(arg) {
	  return typeof arg === "string";
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return  arg == null;
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)(module), (function() { return this; }())))

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(23);
	exports.encode = exports.stringify = __webpack_require__(24);


/***/ },
/* 23 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ },
/* 24 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, process, global, module) {(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.async = global.async || {})));
	}(this, (function (exports) { 'use strict';

	function slice(arrayLike, start) {
	    start = start|0;
	    var newLen = Math.max(arrayLike.length - start, 0);
	    var newArr = Array(newLen);
	    for(var idx = 0; idx < newLen; idx++)  {
	        newArr[idx] = arrayLike[start + idx];
	    }
	    return newArr;
	}

	var initialParams = function (fn) {
	    return function (/*...args, callback*/) {
	        var args = slice(arguments);
	        var callback = args.pop();
	        fn.call(this, args, callback);
	    };
	};

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
	var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

	function fallback(fn) {
	    setTimeout(fn, 0);
	}

	function wrap(defer) {
	    return function (fn/*, ...args*/) {
	        var args = slice(arguments, 1);
	        defer(function () {
	            fn.apply(null, args);
	        });
	    };
	}

	var _defer;

	if (hasSetImmediate) {
	    _defer = setImmediate;
	} else if (hasNextTick) {
	    _defer = process.nextTick;
	} else {
	    _defer = fallback;
	}

	var setImmediate$1 = wrap(_defer);

	/**
	 * Take a sync function and make it async, passing its return value to a
	 * callback. This is useful for plugging sync functions into a waterfall,
	 * series, or other async functions. Any arguments passed to the generated
	 * function will be passed to the wrapped function (except for the final
	 * callback argument). Errors thrown will be passed to the callback.
	 *
	 * If the function passed to `asyncify` returns a Promise, that promises's
	 * resolved/rejected state will be used to call the callback, rather than simply
	 * the synchronous return value.
	 *
	 * This also means you can asyncify ES2017 `async` functions.
	 *
	 * @name asyncify
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @alias wrapSync
	 * @category Util
	 * @param {Function} func - The synchronous function, or Promise-returning
	 * function to convert to an {@link AsyncFunction}.
	 * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
	 * invoked with `(args..., callback)`.
	 * @example
	 *
	 * // passing a regular synchronous function
	 * async.waterfall([
	 *     async.apply(fs.readFile, filename, "utf8"),
	 *     async.asyncify(JSON.parse),
	 *     function (data, next) {
	 *         // data is the result of parsing the text.
	 *         // If there was a parsing error, it would have been caught.
	 *     }
	 * ], callback);
	 *
	 * // passing a function returning a promise
	 * async.waterfall([
	 *     async.apply(fs.readFile, filename, "utf8"),
	 *     async.asyncify(function (contents) {
	 *         return db.model.create(contents);
	 *     }),
	 *     function (model, next) {
	 *         // `model` is the instantiated model object.
	 *         // If there was an error, this function would be skipped.
	 *     }
	 * ], callback);
	 *
	 * // es2017 example, though `asyncify` is not needed if your JS environment
	 * // supports async functions out of the box
	 * var q = async.queue(async.asyncify(async function(file) {
	 *     var intermediateStep = await processFile(file);
	 *     return await somePromise(intermediateStep)
	 * }));
	 *
	 * q.push(files);
	 */
	function asyncify(func) {
	    return initialParams(function (args, callback) {
	        var result;
	        try {
	            result = func.apply(this, args);
	        } catch (e) {
	            return callback(e);
	        }
	        // if result is Promise object
	        if (isObject(result) && typeof result.then === 'function') {
	            result.then(function(value) {
	                invokeCallback(callback, null, value);
	            }, function(err) {
	                invokeCallback(callback, err.message ? err : new Error(err));
	            });
	        } else {
	            callback(null, result);
	        }
	    });
	}

	function invokeCallback(callback, error, value) {
	    try {
	        callback(error, value);
	    } catch (e) {
	        setImmediate$1(rethrow, e);
	    }
	}

	function rethrow(error) {
	    throw error;
	}

	var supportsSymbol = typeof Symbol === 'function';

	function isAsync(fn) {
	    return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
	}

	function wrapAsync(asyncFn) {
	    return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
	}

	function applyEach$1(eachfn) {
	    return function(fns/*, ...args*/) {
	        var args = slice(arguments, 1);
	        var go = initialParams(function(args, callback) {
	            var that = this;
	            return eachfn(fns, function (fn, cb) {
	                wrapAsync(fn).apply(that, args.concat(cb));
	            }, callback);
	        });
	        if (args.length) {
	            return go.apply(this, args);
	        }
	        else {
	            return go;
	        }
	    };
	}

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	/** Built-in value references. */
	var Symbol$1 = root.Symbol;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
	      tag = value[symToStringTag$1];

	  try {
	    value[symToStringTag$1] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag$1] = tag;
	    } else {
	      delete value[symToStringTag$1];
	    }
	  }
	  return result;
	}

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$1.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString$1.call(value);
	}

	/** `Object#toString` result references. */
	var nullTag = '[object Null]';
	var undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  value = Object(value);
	  return (symToStringTag && symToStringTag in value)
	    ? getRawTag(value)
	    : objectToString(value);
	}

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]';
	var funcTag = '[object Function]';
	var genTag = '[object GeneratorFunction]';
	var proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}

	// A temporary value used to identify if the loop should be broken.
	// See #1064, #1293
	var breakLoop = {};

	/**
	 * This method returns `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.3.0
	 * @category Util
	 * @example
	 *
	 * _.times(2, _.noop);
	 * // => [undefined, undefined]
	 */
	function noop() {
	  // No operation performed.
	}

	function once(fn) {
	    return function () {
	        if (fn === null) return;
	        var callFn = fn;
	        fn = null;
	        callFn.apply(this, arguments);
	    };
	}

	var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

	var getIterator = function (coll) {
	    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
	};

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike(value) && baseGetTag(value) == argsTag;
	}

	/** Used for built-in method references. */
	var objectProto$3 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
	  return isObjectLike(value) && hasOwnProperty$2.call(value, 'callee') &&
	    !propertyIsEnumerable.call(value, 'callee');
	};

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER$1 = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER$1 : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}

	/** `Object#toString` result references. */
	var argsTag$1 = '[object Arguments]';
	var arrayTag = '[object Array]';
	var boolTag = '[object Boolean]';
	var dateTag = '[object Date]';
	var errorTag = '[object Error]';
	var funcTag$1 = '[object Function]';
	var mapTag = '[object Map]';
	var numberTag = '[object Number]';
	var objectTag = '[object Object]';
	var regexpTag = '[object RegExp]';
	var setTag = '[object Set]';
	var stringTag = '[object String]';
	var weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]';
	var dataViewTag = '[object DataView]';
	var float32Tag = '[object Float32Array]';
	var float64Tag = '[object Float64Array]';
	var int8Tag = '[object Int8Array]';
	var int16Tag = '[object Int16Array]';
	var int32Tag = '[object Int32Array]';
	var uint8Tag = '[object Uint8Array]';
	var uint8ClampedTag = '[object Uint8ClampedArray]';
	var uint16Tag = '[object Uint16Array]';
	var uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	}

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	/** Detect free variable `exports`. */
	var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports$1 && freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    return freeProcess && freeProcess.binding('util');
	  } catch (e) {}
	}());

	/* Node.js helper references. */
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

	/** Used for built-in method references. */
	var objectProto$2 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray(value),
	      isArg = !isArr && isArguments(value),
	      isBuff = !isArr && !isArg && isBuffer(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? baseTimes(value.length, String) : [],
	      length = result.length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty$1.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/** Used for built-in method references. */
	var objectProto$5 = Object.prototype;

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

	  return value === proto;
	}

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = overArg(Object.keys, Object);

	/** Used for built-in method references. */
	var objectProto$4 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!isPrototype(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}

	function createArrayIterator(coll) {
	    var i = -1;
	    var len = coll.length;
	    return function next() {
	        return ++i < len ? {value: coll[i], key: i} : null;
	    }
	}

	function createES2015Iterator(iterator) {
	    var i = -1;
	    return function next() {
	        var item = iterator.next();
	        if (item.done)
	            return null;
	        i++;
	        return {value: item.value, key: i};
	    }
	}

	function createObjectIterator(obj) {
	    var okeys = keys(obj);
	    var i = -1;
	    var len = okeys.length;
	    return function next() {
	        var key = okeys[++i];
	        return i < len ? {value: obj[key], key: key} : null;
	    };
	}

	function iterator(coll) {
	    if (isArrayLike(coll)) {
	        return createArrayIterator(coll);
	    }

	    var iterator = getIterator(coll);
	    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
	}

	function onlyOnce(fn) {
	    return function() {
	        if (fn === null) throw new Error("Callback was already called.");
	        var callFn = fn;
	        fn = null;
	        callFn.apply(this, arguments);
	    };
	}

	function _eachOfLimit(limit) {
	    return function (obj, iteratee, callback) {
	        callback = once(callback || noop);
	        if (limit <= 0 || !obj) {
	            return callback(null);
	        }
	        var nextElem = iterator(obj);
	        var done = false;
	        var running = 0;

	        function iterateeCallback(err, value) {
	            running -= 1;
	            if (err) {
	                done = true;
	                callback(err);
	            }
	            else if (value === breakLoop || (done && running <= 0)) {
	                done = true;
	                return callback(null);
	            }
	            else {
	                replenish();
	            }
	        }

	        function replenish () {
	            while (running < limit && !done) {
	                var elem = nextElem();
	                if (elem === null) {
	                    done = true;
	                    if (running <= 0) {
	                        callback(null);
	                    }
	                    return;
	                }
	                running += 1;
	                iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
	            }
	        }

	        replenish();
	    };
	}

	/**
	 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
	 * time.
	 *
	 * @name eachOfLimit
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.eachOf]{@link module:Collections.eachOf}
	 * @alias forEachOfLimit
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {AsyncFunction} iteratee - An async function to apply to each
	 * item in `coll`. The `key` is the item's key, or index in the case of an
	 * array.
	 * Invoked with (item, key, callback).
	 * @param {Function} [callback] - A callback which is called when all
	 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	 */
	function eachOfLimit(coll, limit, iteratee, callback) {
	    _eachOfLimit(limit)(coll, wrapAsync(iteratee), callback);
	}

	function doLimit(fn, limit) {
	    return function (iterable, iteratee, callback) {
	        return fn(iterable, limit, iteratee, callback);
	    };
	}

	// eachOf implementation optimized for array-likes
	function eachOfArrayLike(coll, iteratee, callback) {
	    callback = once(callback || noop);
	    var index = 0,
	        completed = 0,
	        length = coll.length;
	    if (length === 0) {
	        callback(null);
	    }

	    function iteratorCallback(err, value) {
	        if (err) {
	            callback(err);
	        } else if ((++completed === length) || value === breakLoop) {
	            callback(null);
	        }
	    }

	    for (; index < length; index++) {
	        iteratee(coll[index], index, onlyOnce(iteratorCallback));
	    }
	}

	// a generic version of eachOf which can handle array, object, and iterator cases.
	var eachOfGeneric = doLimit(eachOfLimit, Infinity);

	/**
	 * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
	 * to the iteratee.
	 *
	 * @name eachOf
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @alias forEachOf
	 * @category Collection
	 * @see [async.each]{@link module:Collections.each}
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - A function to apply to each
	 * item in `coll`.
	 * The `key` is the item's key, or index in the case of an array.
	 * Invoked with (item, key, callback).
	 * @param {Function} [callback] - A callback which is called when all
	 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	 * @example
	 *
	 * var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
	 * var configs = {};
	 *
	 * async.forEachOf(obj, function (value, key, callback) {
	 *     fs.readFile(__dirname + value, "utf8", function (err, data) {
	 *         if (err) return callback(err);
	 *         try {
	 *             configs[key] = JSON.parse(data);
	 *         } catch (e) {
	 *             return callback(e);
	 *         }
	 *         callback();
	 *     });
	 * }, function (err) {
	 *     if (err) console.error(err.message);
	 *     // configs is now a map of JSON data
	 *     doSomethingWith(configs);
	 * });
	 */
	var eachOf = function(coll, iteratee, callback) {
	    var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
	    eachOfImplementation(coll, wrapAsync(iteratee), callback);
	};

	function doParallel(fn) {
	    return function (obj, iteratee, callback) {
	        return fn(eachOf, obj, wrapAsync(iteratee), callback);
	    };
	}

	function _asyncMap(eachfn, arr, iteratee, callback) {
	    callback = callback || noop;
	    arr = arr || [];
	    var results = [];
	    var counter = 0;
	    var _iteratee = wrapAsync(iteratee);

	    eachfn(arr, function (value, _, callback) {
	        var index = counter++;
	        _iteratee(value, function (err, v) {
	            results[index] = v;
	            callback(err);
	        });
	    }, function (err) {
	        callback(err, results);
	    });
	}

	/**
	 * Produces a new collection of values by mapping each value in `coll` through
	 * the `iteratee` function. The `iteratee` is called with an item from `coll`
	 * and a callback for when it has finished processing. Each of these callback
	 * takes 2 arguments: an `error`, and the transformed item from `coll`. If
	 * `iteratee` passes an error to its callback, the main `callback` (for the
	 * `map` function) is immediately called with the error.
	 *
	 * Note, that since this function applies the `iteratee` to each item in
	 * parallel, there is no guarantee that the `iteratee` functions will complete
	 * in order. However, the results array will be in the same order as the
	 * original `coll`.
	 *
	 * If `map` is passed an Object, the results will be an Array.  The results
	 * will roughly be in the order of the original Objects' keys (but this can
	 * vary across JavaScript engines).
	 *
	 * @name map
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - An async function to apply to each item in
	 * `coll`.
	 * The iteratee should complete with the transformed item.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called when all `iteratee`
	 * functions have finished, or an error occurs. Results is an Array of the
	 * transformed items from the `coll`. Invoked with (err, results).
	 * @example
	 *
	 * async.map(['file1','file2','file3'], fs.stat, function(err, results) {
	 *     // results is now an array of stats for each file
	 * });
	 */
	var map = doParallel(_asyncMap);

	/**
	 * Applies the provided arguments to each function in the array, calling
	 * `callback` after all functions have completed. If you only provide the first
	 * argument, `fns`, then it will return a function which lets you pass in the
	 * arguments as if it were a single function call. If more arguments are
	 * provided, `callback` is required while `args` is still optional.
	 *
	 * @name applyEach
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @param {Array|Iterable|Object} fns - A collection of {@link AsyncFunction}s
	 * to all call with the same arguments
	 * @param {...*} [args] - any number of separate arguments to pass to the
	 * function.
	 * @param {Function} [callback] - the final argument should be the callback,
	 * called when all functions have completed processing.
	 * @returns {Function} - If only the first argument, `fns`, is provided, it will
	 * return a function which lets you pass in the arguments as if it were a single
	 * function call. The signature is `(..args, callback)`. If invoked with any
	 * arguments, `callback` is required.
	 * @example
	 *
	 * async.applyEach([enableSearch, updateSchema], 'bucket', callback);
	 *
	 * // partial application example:
	 * async.each(
	 *     buckets,
	 *     async.applyEach([enableSearch, updateSchema]),
	 *     callback
	 * );
	 */
	var applyEach = applyEach$1(map);

	function doParallelLimit(fn) {
	    return function (obj, limit, iteratee, callback) {
	        return fn(_eachOfLimit(limit), obj, wrapAsync(iteratee), callback);
	    };
	}

	/**
	 * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
	 *
	 * @name mapLimit
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.map]{@link module:Collections.map}
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {AsyncFunction} iteratee - An async function to apply to each item in
	 * `coll`.
	 * The iteratee should complete with the transformed item.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called when all `iteratee`
	 * functions have finished, or an error occurs. Results is an array of the
	 * transformed items from the `coll`. Invoked with (err, results).
	 */
	var mapLimit = doParallelLimit(_asyncMap);

	/**
	 * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
	 *
	 * @name mapSeries
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.map]{@link module:Collections.map}
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - An async function to apply to each item in
	 * `coll`.
	 * The iteratee should complete with the transformed item.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called when all `iteratee`
	 * functions have finished, or an error occurs. Results is an array of the
	 * transformed items from the `coll`. Invoked with (err, results).
	 */
	var mapSeries = doLimit(mapLimit, 1);

	/**
	 * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
	 *
	 * @name applyEachSeries
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.applyEach]{@link module:ControlFlow.applyEach}
	 * @category Control Flow
	 * @param {Array|Iterable|Object} fns - A collection of {@link AsyncFunction}s to all
	 * call with the same arguments
	 * @param {...*} [args] - any number of separate arguments to pass to the
	 * function.
	 * @param {Function} [callback] - the final argument should be the callback,
	 * called when all functions have completed processing.
	 * @returns {Function} - If only the first argument is provided, it will return
	 * a function which lets you pass in the arguments as if it were a single
	 * function call.
	 */
	var applyEachSeries = applyEach$1(mapSeries);

	/**
	 * Creates a continuation function with some arguments already applied.
	 *
	 * Useful as a shorthand when combined with other control flow functions. Any
	 * arguments passed to the returned function are added to the arguments
	 * originally passed to apply.
	 *
	 * @name apply
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @category Util
	 * @param {Function} fn - The function you want to eventually apply all
	 * arguments to. Invokes with (arguments...).
	 * @param {...*} arguments... - Any number of arguments to automatically apply
	 * when the continuation is called.
	 * @returns {Function} the partially-applied function
	 * @example
	 *
	 * // using apply
	 * async.parallel([
	 *     async.apply(fs.writeFile, 'testfile1', 'test1'),
	 *     async.apply(fs.writeFile, 'testfile2', 'test2')
	 * ]);
	 *
	 *
	 * // the same process without using apply
	 * async.parallel([
	 *     function(callback) {
	 *         fs.writeFile('testfile1', 'test1', callback);
	 *     },
	 *     function(callback) {
	 *         fs.writeFile('testfile2', 'test2', callback);
	 *     }
	 * ]);
	 *
	 * // It's possible to pass any number of additional arguments when calling the
	 * // continuation:
	 *
	 * node> var fn = async.apply(sys.puts, 'one');
	 * node> fn('two', 'three');
	 * one
	 * two
	 * three
	 */
	var apply = function(fn/*, ...args*/) {
	    var args = slice(arguments, 1);
	    return function(/*callArgs*/) {
	        var callArgs = slice(arguments);
	        return fn.apply(null, args.concat(callArgs));
	    };
	};

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	/**
	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return object && baseFor(object, iteratee, keys);
	}

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */
	function baseIsNaN(value) {
	  return value !== value;
	}

	/**
	 * A specialized version of `_.indexOf` which performs strict equality
	 * comparisons of values, i.e. `===`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function strictIndexOf(array, value, fromIndex) {
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  return value === value
	    ? strictIndexOf(array, value, fromIndex)
	    : baseFindIndex(array, baseIsNaN, fromIndex);
	}

	/**
	 * Determines the best order for running the {@link AsyncFunction}s in `tasks`, based on
	 * their requirements. Each function can optionally depend on other functions
	 * being completed first, and each function is run as soon as its requirements
	 * are satisfied.
	 *
	 * If any of the {@link AsyncFunction}s pass an error to their callback, the `auto` sequence
	 * will stop. Further tasks will not execute (so any other functions depending
	 * on it will not run), and the main `callback` is immediately called with the
	 * error.
	 *
	 * {@link AsyncFunction}s also receive an object containing the results of functions which
	 * have completed so far as the first argument, if they have dependencies. If a
	 * task function has no dependencies, it will only be passed a callback.
	 *
	 * @name auto
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @param {Object} tasks - An object. Each of its properties is either a
	 * function or an array of requirements, with the {@link AsyncFunction} itself the last item
	 * in the array. The object's key of a property serves as the name of the task
	 * defined by that property, i.e. can be used when specifying requirements for
	 * other tasks. The function receives one or two arguments:
	 * * a `results` object, containing the results of the previously executed
	 *   functions, only passed if the task has any dependencies,
	 * * a `callback(err, result)` function, which must be called when finished,
	 *   passing an `error` (which can be `null`) and the result of the function's
	 *   execution.
	 * @param {number} [concurrency=Infinity] - An optional `integer` for
	 * determining the maximum number of tasks that can be run in parallel. By
	 * default, as many as possible.
	 * @param {Function} [callback] - An optional callback which is called when all
	 * the tasks have been completed. It receives the `err` argument if any `tasks`
	 * pass an error to their callback. Results are always returned; however, if an
	 * error occurs, no further `tasks` will be performed, and the results object
	 * will only contain partial results. Invoked with (err, results).
	 * @returns undefined
	 * @example
	 *
	 * async.auto({
	 *     // this function will just be passed a callback
	 *     readData: async.apply(fs.readFile, 'data.txt', 'utf-8'),
	 *     showData: ['readData', function(results, cb) {
	 *         // results.readData is the file's contents
	 *         // ...
	 *     }]
	 * }, callback);
	 *
	 * async.auto({
	 *     get_data: function(callback) {
	 *         console.log('in get_data');
	 *         // async code to get some data
	 *         callback(null, 'data', 'converted to array');
	 *     },
	 *     make_folder: function(callback) {
	 *         console.log('in make_folder');
	 *         // async code to create a directory to store a file in
	 *         // this is run at the same time as getting the data
	 *         callback(null, 'folder');
	 *     },
	 *     write_file: ['get_data', 'make_folder', function(results, callback) {
	 *         console.log('in write_file', JSON.stringify(results));
	 *         // once there is some data and the directory exists,
	 *         // write the data to a file in the directory
	 *         callback(null, 'filename');
	 *     }],
	 *     email_link: ['write_file', function(results, callback) {
	 *         console.log('in email_link', JSON.stringify(results));
	 *         // once the file is written let's email a link to it...
	 *         // results.write_file contains the filename returned by write_file.
	 *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
	 *     }]
	 * }, function(err, results) {
	 *     console.log('err = ', err);
	 *     console.log('results = ', results);
	 * });
	 */
	var auto = function (tasks, concurrency, callback) {
	    if (typeof concurrency === 'function') {
	        // concurrency is optional, shift the args.
	        callback = concurrency;
	        concurrency = null;
	    }
	    callback = once(callback || noop);
	    var keys$$1 = keys(tasks);
	    var numTasks = keys$$1.length;
	    if (!numTasks) {
	        return callback(null);
	    }
	    if (!concurrency) {
	        concurrency = numTasks;
	    }

	    var results = {};
	    var runningTasks = 0;
	    var hasError = false;

	    var listeners = Object.create(null);

	    var readyTasks = [];

	    // for cycle detection:
	    var readyToCheck = []; // tasks that have been identified as reachable
	    // without the possibility of returning to an ancestor task
	    var uncheckedDependencies = {};

	    baseForOwn(tasks, function (task, key) {
	        if (!isArray(task)) {
	            // no dependencies
	            enqueueTask(key, [task]);
	            readyToCheck.push(key);
	            return;
	        }

	        var dependencies = task.slice(0, task.length - 1);
	        var remainingDependencies = dependencies.length;
	        if (remainingDependencies === 0) {
	            enqueueTask(key, task);
	            readyToCheck.push(key);
	            return;
	        }
	        uncheckedDependencies[key] = remainingDependencies;

	        arrayEach(dependencies, function (dependencyName) {
	            if (!tasks[dependencyName]) {
	                throw new Error('async.auto task `' + key +
	                    '` has a non-existent dependency `' +
	                    dependencyName + '` in ' +
	                    dependencies.join(', '));
	            }
	            addListener(dependencyName, function () {
	                remainingDependencies--;
	                if (remainingDependencies === 0) {
	                    enqueueTask(key, task);
	                }
	            });
	        });
	    });

	    checkForDeadlocks();
	    processQueue();

	    function enqueueTask(key, task) {
	        readyTasks.push(function () {
	            runTask(key, task);
	        });
	    }

	    function processQueue() {
	        if (readyTasks.length === 0 && runningTasks === 0) {
	            return callback(null, results);
	        }
	        while(readyTasks.length && runningTasks < concurrency) {
	            var run = readyTasks.shift();
	            run();
	        }

	    }

	    function addListener(taskName, fn) {
	        var taskListeners = listeners[taskName];
	        if (!taskListeners) {
	            taskListeners = listeners[taskName] = [];
	        }

	        taskListeners.push(fn);
	    }

	    function taskComplete(taskName) {
	        var taskListeners = listeners[taskName] || [];
	        arrayEach(taskListeners, function (fn) {
	            fn();
	        });
	        processQueue();
	    }


	    function runTask(key, task) {
	        if (hasError) return;

	        var taskCallback = onlyOnce(function(err, result) {
	            runningTasks--;
	            if (arguments.length > 2) {
	                result = slice(arguments, 1);
	            }
	            if (err) {
	                var safeResults = {};
	                baseForOwn(results, function(val, rkey) {
	                    safeResults[rkey] = val;
	                });
	                safeResults[key] = result;
	                hasError = true;
	                listeners = Object.create(null);

	                callback(err, safeResults);
	            } else {
	                results[key] = result;
	                taskComplete(key);
	            }
	        });

	        runningTasks++;
	        var taskFn = wrapAsync(task[task.length - 1]);
	        if (task.length > 1) {
	            taskFn(results, taskCallback);
	        } else {
	            taskFn(taskCallback);
	        }
	    }

	    function checkForDeadlocks() {
	        // Kahn's algorithm
	        // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
	        // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
	        var currentTask;
	        var counter = 0;
	        while (readyToCheck.length) {
	            currentTask = readyToCheck.pop();
	            counter++;
	            arrayEach(getDependents(currentTask), function (dependent) {
	                if (--uncheckedDependencies[dependent] === 0) {
	                    readyToCheck.push(dependent);
	                }
	            });
	        }

	        if (counter !== numTasks) {
	            throw new Error(
	                'async.auto cannot execute tasks due to a recursive dependency'
	            );
	        }
	    }

	    function getDependents(taskName) {
	        var result = [];
	        baseForOwn(tasks, function (task, key) {
	            if (isArray(task) && baseIndexOf(task, taskName, 0) >= 0) {
	                result.push(key);
	            }
	        });
	        return result;
	    }
	};

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && baseGetTag(value) == symbolTag);
	}

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
	var symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return arrayMap(value, baseToString) + '';
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;

	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = end > length ? length : end;
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;

	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}

	/**
	 * Casts `array` to a slice if it's needed.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {number} start The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the cast slice.
	 */
	function castSlice(array, start, end) {
	  var length = array.length;
	  end = end === undefined ? length : end;
	  return (!start && end >= length) ? array : baseSlice(array, start, end);
	}

	/**
	 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
	 * that is not found in the character symbols.
	 *
	 * @private
	 * @param {Array} strSymbols The string symbols to inspect.
	 * @param {Array} chrSymbols The character symbols to find.
	 * @returns {number} Returns the index of the last unmatched string symbol.
	 */
	function charsEndIndex(strSymbols, chrSymbols) {
	  var index = strSymbols.length;

	  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	  return index;
	}

	/**
	 * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
	 * that is not found in the character symbols.
	 *
	 * @private
	 * @param {Array} strSymbols The string symbols to inspect.
	 * @param {Array} chrSymbols The character symbols to find.
	 * @returns {number} Returns the index of the first unmatched string symbol.
	 */
	function charsStartIndex(strSymbols, chrSymbols) {
	  var index = -1,
	      length = strSymbols.length;

	  while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	  return index;
	}

	/**
	 * Converts an ASCII `string` to an array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function asciiToArray(string) {
	  return string.split('');
	}

	/** Used to compose unicode character classes. */
	var rsAstralRange = '\\ud800-\\udfff';
	var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23';
	var rsComboSymbolsRange = '\\u20d0-\\u20f0';
	var rsVarRange = '\\ufe0e\\ufe0f';

	/** Used to compose unicode capture groups. */
	var rsZWJ = '\\u200d';

	/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
	var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

	/**
	 * Checks if `string` contains Unicode symbols.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
	 */
	function hasUnicode(string) {
	  return reHasUnicode.test(string);
	}

	/** Used to compose unicode character classes. */
	var rsAstralRange$1 = '\\ud800-\\udfff';
	var rsComboMarksRange$1 = '\\u0300-\\u036f\\ufe20-\\ufe23';
	var rsComboSymbolsRange$1 = '\\u20d0-\\u20f0';
	var rsVarRange$1 = '\\ufe0e\\ufe0f';

	/** Used to compose unicode capture groups. */
	var rsAstral = '[' + rsAstralRange$1 + ']';
	var rsCombo = '[' + rsComboMarksRange$1 + rsComboSymbolsRange$1 + ']';
	var rsFitz = '\\ud83c[\\udffb-\\udfff]';
	var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
	var rsNonAstral = '[^' + rsAstralRange$1 + ']';
	var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
	var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
	var rsZWJ$1 = '\\u200d';

	/** Used to compose unicode regexes. */
	var reOptMod = rsModifier + '?';
	var rsOptVar = '[' + rsVarRange$1 + ']?';
	var rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
	var rsSeq = rsOptVar + reOptMod + rsOptJoin;
	var rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

	/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
	var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

	/**
	 * Converts a Unicode `string` to an array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function unicodeToArray(string) {
	  return string.match(reUnicode) || [];
	}

	/**
	 * Converts `string` to an array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function stringToArray(string) {
	  return hasUnicode(string)
	    ? unicodeToArray(string)
	    : asciiToArray(string);
	}

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/**
	 * Removes leading and trailing whitespace or specified characters from `string`.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category String
	 * @param {string} [string=''] The string to trim.
	 * @param {string} [chars=whitespace] The characters to trim.
	 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	 * @returns {string} Returns the trimmed string.
	 * @example
	 *
	 * _.trim('  abc  ');
	 * // => 'abc'
	 *
	 * _.trim('-_-abc-_-', '_-');
	 * // => 'abc'
	 *
	 * _.map(['  foo  ', '  bar  '], _.trim);
	 * // => ['foo', 'bar']
	 */
	function trim(string, chars, guard) {
	  string = toString(string);
	  if (string && (guard || chars === undefined)) {
	    return string.replace(reTrim, '');
	  }
	  if (!string || !(chars = baseToString(chars))) {
	    return string;
	  }
	  var strSymbols = stringToArray(string),
	      chrSymbols = stringToArray(chars),
	      start = charsStartIndex(strSymbols, chrSymbols),
	      end = charsEndIndex(strSymbols, chrSymbols) + 1;

	  return castSlice(strSymbols, start, end).join('');
	}

	var FN_ARGS = /^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
	var FN_ARG_SPLIT = /,/;
	var FN_ARG = /(=.+)?(\s*)$/;
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

	function parseParams(func) {
	    func = func.toString().replace(STRIP_COMMENTS, '');
	    func = func.match(FN_ARGS)[2].replace(' ', '');
	    func = func ? func.split(FN_ARG_SPLIT) : [];
	    func = func.map(function (arg){
	        return trim(arg.replace(FN_ARG, ''));
	    });
	    return func;
	}

	/**
	 * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
	 * tasks are specified as parameters to the function, after the usual callback
	 * parameter, with the parameter names matching the names of the tasks it
	 * depends on. This can provide even more readable task graphs which can be
	 * easier to maintain.
	 *
	 * If a final callback is specified, the task results are similarly injected,
	 * specified as named parameters after the initial error parameter.
	 *
	 * The autoInject function is purely syntactic sugar and its semantics are
	 * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
	 *
	 * @name autoInject
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.auto]{@link module:ControlFlow.auto}
	 * @category Control Flow
	 * @param {Object} tasks - An object, each of whose properties is an {@link AsyncFunction} of
	 * the form 'func([dependencies...], callback). The object's key of a property
	 * serves as the name of the task defined by that property, i.e. can be used
	 * when specifying requirements for other tasks.
	 * * The `callback` parameter is a `callback(err, result)` which must be called
	 *   when finished, passing an `error` (which can be `null`) and the result of
	 *   the function's execution. The remaining parameters name other tasks on
	 *   which the task is dependent, and the results from those tasks are the
	 *   arguments of those parameters.
	 * @param {Function} [callback] - An optional callback which is called when all
	 * the tasks have been completed. It receives the `err` argument if any `tasks`
	 * pass an error to their callback, and a `results` object with any completed
	 * task results, similar to `auto`.
	 * @example
	 *
	 * //  The example from `auto` can be rewritten as follows:
	 * async.autoInject({
	 *     get_data: function(callback) {
	 *         // async code to get some data
	 *         callback(null, 'data', 'converted to array');
	 *     },
	 *     make_folder: function(callback) {
	 *         // async code to create a directory to store a file in
	 *         // this is run at the same time as getting the data
	 *         callback(null, 'folder');
	 *     },
	 *     write_file: function(get_data, make_folder, callback) {
	 *         // once there is some data and the directory exists,
	 *         // write the data to a file in the directory
	 *         callback(null, 'filename');
	 *     },
	 *     email_link: function(write_file, callback) {
	 *         // once the file is written let's email a link to it...
	 *         // write_file contains the filename returned by write_file.
	 *         callback(null, {'file':write_file, 'email':'user@example.com'});
	 *     }
	 * }, function(err, results) {
	 *     console.log('err = ', err);
	 *     console.log('email_link = ', results.email_link);
	 * });
	 *
	 * // If you are using a JS minifier that mangles parameter names, `autoInject`
	 * // will not work with plain functions, since the parameter names will be
	 * // collapsed to a single letter identifier.  To work around this, you can
	 * // explicitly specify the names of the parameters your task function needs
	 * // in an array, similar to Angular.js dependency injection.
	 *
	 * // This still has an advantage over plain `auto`, since the results a task
	 * // depends on are still spread into arguments.
	 * async.autoInject({
	 *     //...
	 *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
	 *         callback(null, 'filename');
	 *     }],
	 *     email_link: ['write_file', function(write_file, callback) {
	 *         callback(null, {'file':write_file, 'email':'user@example.com'});
	 *     }]
	 *     //...
	 * }, function(err, results) {
	 *     console.log('err = ', err);
	 *     console.log('email_link = ', results.email_link);
	 * });
	 */
	function autoInject(tasks, callback) {
	    var newTasks = {};

	    baseForOwn(tasks, function (taskFn, key) {
	        var params;
	        var fnIsAsync = isAsync(taskFn);
	        var hasNoDeps =
	            (!fnIsAsync && taskFn.length === 1) ||
	            (fnIsAsync && taskFn.length === 0);

	        if (isArray(taskFn)) {
	            params = taskFn.slice(0, -1);
	            taskFn = taskFn[taskFn.length - 1];

	            newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
	        } else if (hasNoDeps) {
	            // no dependencies, use the function as-is
	            newTasks[key] = taskFn;
	        } else {
	            params = parseParams(taskFn);
	            if (taskFn.length === 0 && !fnIsAsync && params.length === 0) {
	                throw new Error("autoInject task functions require explicit parameters.");
	            }

	            // remove callback param
	            if (!fnIsAsync) params.pop();

	            newTasks[key] = params.concat(newTask);
	        }

	        function newTask(results, taskCb) {
	            var newArgs = arrayMap(params, function (name) {
	                return results[name];
	            });
	            newArgs.push(taskCb);
	            wrapAsync(taskFn).apply(null, newArgs);
	        }
	    });

	    auto(newTasks, callback);
	}

	// Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
	// used for queues. This implementation assumes that the node provided by the user can be modified
	// to adjust the next and last properties. We implement only the minimal functionality
	// for queue support.
	function DLL() {
	    this.head = this.tail = null;
	    this.length = 0;
	}

	function setInitial(dll, node) {
	    dll.length = 1;
	    dll.head = dll.tail = node;
	}

	DLL.prototype.removeLink = function(node) {
	    if (node.prev) node.prev.next = node.next;
	    else this.head = node.next;
	    if (node.next) node.next.prev = node.prev;
	    else this.tail = node.prev;

	    node.prev = node.next = null;
	    this.length -= 1;
	    return node;
	};

	DLL.prototype.empty = function () {
	    while(this.head) this.shift();
	    return this;
	};

	DLL.prototype.insertAfter = function(node, newNode) {
	    newNode.prev = node;
	    newNode.next = node.next;
	    if (node.next) node.next.prev = newNode;
	    else this.tail = newNode;
	    node.next = newNode;
	    this.length += 1;
	};

	DLL.prototype.insertBefore = function(node, newNode) {
	    newNode.prev = node.prev;
	    newNode.next = node;
	    if (node.prev) node.prev.next = newNode;
	    else this.head = newNode;
	    node.prev = newNode;
	    this.length += 1;
	};

	DLL.prototype.unshift = function(node) {
	    if (this.head) this.insertBefore(this.head, node);
	    else setInitial(this, node);
	};

	DLL.prototype.push = function(node) {
	    if (this.tail) this.insertAfter(this.tail, node);
	    else setInitial(this, node);
	};

	DLL.prototype.shift = function() {
	    return this.head && this.removeLink(this.head);
	};

	DLL.prototype.pop = function() {
	    return this.tail && this.removeLink(this.tail);
	};

	DLL.prototype.toArray = function () {
	    var arr = Array(this.length);
	    var curr = this.head;
	    for(var idx = 0; idx < this.length; idx++) {
	        arr[idx] = curr.data;
	        curr = curr.next;
	    }
	    return arr;
	};

	DLL.prototype.remove = function (testFn) {
	    var curr = this.head;
	    while(!!curr) {
	        var next = curr.next;
	        if (testFn(curr)) {
	            this.removeLink(curr);
	        }
	        curr = next;
	    }
	    return this;
	};

	function queue(worker, concurrency, payload) {
	    if (concurrency == null) {
	        concurrency = 1;
	    }
	    else if(concurrency === 0) {
	        throw new Error('Concurrency must not be zero');
	    }

	    var _worker = wrapAsync(worker);
	    var numRunning = 0;
	    var workersList = [];

	    function _insert(data, insertAtFront, callback) {
	        if (callback != null && typeof callback !== 'function') {
	            throw new Error('task callback must be a function');
	        }
	        q.started = true;
	        if (!isArray(data)) {
	            data = [data];
	        }
	        if (data.length === 0 && q.idle()) {
	            // call drain immediately if there are no tasks
	            return setImmediate$1(function() {
	                q.drain();
	            });
	        }

	        for (var i = 0, l = data.length; i < l; i++) {
	            var item = {
	                data: data[i],
	                callback: callback || noop
	            };

	            if (insertAtFront) {
	                q._tasks.unshift(item);
	            } else {
	                q._tasks.push(item);
	            }
	        }
	        setImmediate$1(q.process);
	    }

	    function _next(tasks) {
	        return function(err){
	            numRunning -= 1;

	            for (var i = 0, l = tasks.length; i < l; i++) {
	                var task = tasks[i];

	                var index = baseIndexOf(workersList, task, 0);
	                if (index >= 0) {
	                    workersList.splice(index, 1);
	                }

	                task.callback.apply(task, arguments);

	                if (err != null) {
	                    q.error(err, task.data);
	                }
	            }

	            if (numRunning <= (q.concurrency - q.buffer) ) {
	                q.unsaturated();
	            }

	            if (q.idle()) {
	                q.drain();
	            }
	            q.process();
	        };
	    }

	    var isProcessing = false;
	    var q = {
	        _tasks: new DLL(),
	        concurrency: concurrency,
	        payload: payload,
	        saturated: noop,
	        unsaturated:noop,
	        buffer: concurrency / 4,
	        empty: noop,
	        drain: noop,
	        error: noop,
	        started: false,
	        paused: false,
	        push: function (data, callback) {
	            _insert(data, false, callback);
	        },
	        kill: function () {
	            q.drain = noop;
	            q._tasks.empty();
	        },
	        unshift: function (data, callback) {
	            _insert(data, true, callback);
	        },
	        remove: function (testFn) {
	            q._tasks.remove(testFn);
	        },
	        process: function () {
	            // Avoid trying to start too many processing operations. This can occur
	            // when callbacks resolve synchronously (#1267).
	            if (isProcessing) {
	                return;
	            }
	            isProcessing = true;
	            while(!q.paused && numRunning < q.concurrency && q._tasks.length){
	                var tasks = [], data = [];
	                var l = q._tasks.length;
	                if (q.payload) l = Math.min(l, q.payload);
	                for (var i = 0; i < l; i++) {
	                    var node = q._tasks.shift();
	                    tasks.push(node);
	                    workersList.push(node);
	                    data.push(node.data);
	                }

	                numRunning += 1;

	                if (q._tasks.length === 0) {
	                    q.empty();
	                }

	                if (numRunning === q.concurrency) {
	                    q.saturated();
	                }

	                var cb = onlyOnce(_next(tasks));
	                _worker(data, cb);
	            }
	            isProcessing = false;
	        },
	        length: function () {
	            return q._tasks.length;
	        },
	        running: function () {
	            return numRunning;
	        },
	        workersList: function () {
	            return workersList;
	        },
	        idle: function() {
	            return q._tasks.length + numRunning === 0;
	        },
	        pause: function () {
	            q.paused = true;
	        },
	        resume: function () {
	            if (q.paused === false) { return; }
	            q.paused = false;
	            setImmediate$1(q.process);
	        }
	    };
	    return q;
	}

	/**
	 * A cargo of tasks for the worker function to complete. Cargo inherits all of
	 * the same methods and event callbacks as [`queue`]{@link module:ControlFlow.queue}.
	 * @typedef {Object} CargoObject
	 * @memberOf module:ControlFlow
	 * @property {Function} length - A function returning the number of items
	 * waiting to be processed. Invoke like `cargo.length()`.
	 * @property {number} payload - An `integer` for determining how many tasks
	 * should be process per round. This property can be changed after a `cargo` is
	 * created to alter the payload on-the-fly.
	 * @property {Function} push - Adds `task` to the `queue`. The callback is
	 * called once the `worker` has finished processing the task. Instead of a
	 * single task, an array of `tasks` can be submitted. The respective callback is
	 * used for every task in the list. Invoke like `cargo.push(task, [callback])`.
	 * @property {Function} saturated - A callback that is called when the
	 * `queue.length()` hits the concurrency and further tasks will be queued.
	 * @property {Function} empty - A callback that is called when the last item
	 * from the `queue` is given to a `worker`.
	 * @property {Function} drain - A callback that is called when the last item
	 * from the `queue` has returned from the `worker`.
	 * @property {Function} idle - a function returning false if there are items
	 * waiting or being processed, or true if not. Invoke like `cargo.idle()`.
	 * @property {Function} pause - a function that pauses the processing of tasks
	 * until `resume()` is called. Invoke like `cargo.pause()`.
	 * @property {Function} resume - a function that resumes the processing of
	 * queued tasks when the queue is paused. Invoke like `cargo.resume()`.
	 * @property {Function} kill - a function that removes the `drain` callback and
	 * empties remaining tasks from the queue forcing it to go idle. Invoke like `cargo.kill()`.
	 */

	/**
	 * Creates a `cargo` object with the specified payload. Tasks added to the
	 * cargo will be processed altogether (up to the `payload` limit). If the
	 * `worker` is in progress, the task is queued until it becomes available. Once
	 * the `worker` has completed some tasks, each callback of those tasks is
	 * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
	 * for how `cargo` and `queue` work.
	 *
	 * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
	 * at a time, cargo passes an array of tasks to a single worker, repeating
	 * when the worker is finished.
	 *
	 * @name cargo
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.queue]{@link module:ControlFlow.queue}
	 * @category Control Flow
	 * @param {AsyncFunction} worker - An asynchronous function for processing an array
	 * of queued tasks. Invoked with `(tasks, callback)`.
	 * @param {number} [payload=Infinity] - An optional `integer` for determining
	 * how many tasks should be processed per round; if omitted, the default is
	 * unlimited.
	 * @returns {module:ControlFlow.CargoObject} A cargo object to manage the tasks. Callbacks can
	 * attached as certain properties to listen for specific events during the
	 * lifecycle of the cargo and inner queue.
	 * @example
	 *
	 * // create a cargo object with payload 2
	 * var cargo = async.cargo(function(tasks, callback) {
	 *     for (var i=0; i<tasks.length; i++) {
	 *         console.log('hello ' + tasks[i].name);
	 *     }
	 *     callback();
	 * }, 2);
	 *
	 * // add some items
	 * cargo.push({name: 'foo'}, function(err) {
	 *     console.log('finished processing foo');
	 * });
	 * cargo.push({name: 'bar'}, function(err) {
	 *     console.log('finished processing bar');
	 * });
	 * cargo.push({name: 'baz'}, function(err) {
	 *     console.log('finished processing baz');
	 * });
	 */
	function cargo(worker, payload) {
	    return queue(worker, 1, payload);
	}

	/**
	 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
	 *
	 * @name eachOfSeries
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.eachOf]{@link module:Collections.eachOf}
	 * @alias forEachOfSeries
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - An async function to apply to each item in
	 * `coll`.
	 * Invoked with (item, key, callback).
	 * @param {Function} [callback] - A callback which is called when all `iteratee`
	 * functions have finished, or an error occurs. Invoked with (err).
	 */
	var eachOfSeries = doLimit(eachOfLimit, 1);

	/**
	 * Reduces `coll` into a single value using an async `iteratee` to return each
	 * successive step. `memo` is the initial state of the reduction. This function
	 * only operates in series.
	 *
	 * For performance reasons, it may make sense to split a call to this function
	 * into a parallel map, and then use the normal `Array.prototype.reduce` on the
	 * results. This function is for situations where each step in the reduction
	 * needs to be async; if you can get the data before reducing it, then it's
	 * probably a good idea to do so.
	 *
	 * @name reduce
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @alias inject
	 * @alias foldl
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {*} memo - The initial state of the reduction.
	 * @param {AsyncFunction} iteratee - A function applied to each item in the
	 * array to produce the next step in the reduction.
	 * The `iteratee` should complete with the next state of the reduction.
	 * If the iteratee complete with an error, the reduction is stopped and the
	 * main `callback` is immediately called with the error.
	 * Invoked with (memo, item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Result is the reduced value. Invoked with
	 * (err, result).
	 * @example
	 *
	 * async.reduce([1,2,3], 0, function(memo, item, callback) {
	 *     // pointless async:
	 *     process.nextTick(function() {
	 *         callback(null, memo + item)
	 *     });
	 * }, function(err, result) {
	 *     // result is now equal to the last value of memo, which is 6
	 * });
	 */
	function reduce(coll, memo, iteratee, callback) {
	    callback = once(callback || noop);
	    var _iteratee = wrapAsync(iteratee);
	    eachOfSeries(coll, function(x, i, callback) {
	        _iteratee(memo, x, function(err, v) {
	            memo = v;
	            callback(err);
	        });
	    }, function(err) {
	        callback(err, memo);
	    });
	}

	/**
	 * Version of the compose function that is more natural to read. Each function
	 * consumes the return value of the previous function. It is the equivalent of
	 * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
	 *
	 * Each function is executed with the `this` binding of the composed function.
	 *
	 * @name seq
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.compose]{@link module:ControlFlow.compose}
	 * @category Control Flow
	 * @param {...AsyncFunction} functions - the asynchronous functions to compose
	 * @returns {Function} a function that composes the `functions` in order
	 * @example
	 *
	 * // Requires lodash (or underscore), express3 and dresende's orm2.
	 * // Part of an app, that fetches cats of the logged user.
	 * // This example uses `seq` function to avoid overnesting and error
	 * // handling clutter.
	 * app.get('/cats', function(request, response) {
	 *     var User = request.models.User;
	 *     async.seq(
	 *         _.bind(User.get, User),  // 'User.get' has signature (id, callback(err, data))
	 *         function(user, fn) {
	 *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
	 *         }
	 *     )(req.session.user_id, function (err, cats) {
	 *         if (err) {
	 *             console.error(err);
	 *             response.json({ status: 'error', message: err.message });
	 *         } else {
	 *             response.json({ status: 'ok', message: 'Cats found', data: cats });
	 *         }
	 *     });
	 * });
	 */
	function seq(/*...functions*/) {
	    var _functions = arrayMap(arguments, wrapAsync);
	    return function(/*...args*/) {
	        var args = slice(arguments);
	        var that = this;

	        var cb = args[args.length - 1];
	        if (typeof cb == 'function') {
	            args.pop();
	        } else {
	            cb = noop;
	        }

	        reduce(_functions, args, function(newargs, fn, cb) {
	            fn.apply(that, newargs.concat(function(err/*, ...nextargs*/) {
	                var nextargs = slice(arguments, 1);
	                cb(err, nextargs);
	            }));
	        },
	        function(err, results) {
	            cb.apply(that, [err].concat(results));
	        });
	    };
	}

	/**
	 * Creates a function which is a composition of the passed asynchronous
	 * functions. Each function consumes the return value of the function that
	 * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
	 * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
	 *
	 * Each function is executed with the `this` binding of the composed function.
	 *
	 * @name compose
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @param {...AsyncFunction} functions - the asynchronous functions to compose
	 * @returns {Function} an asynchronous function that is the composed
	 * asynchronous `functions`
	 * @example
	 *
	 * function add1(n, callback) {
	 *     setTimeout(function () {
	 *         callback(null, n + 1);
	 *     }, 10);
	 * }
	 *
	 * function mul3(n, callback) {
	 *     setTimeout(function () {
	 *         callback(null, n * 3);
	 *     }, 10);
	 * }
	 *
	 * var add1mul3 = async.compose(mul3, add1);
	 * add1mul3(4, function (err, result) {
	 *     // result now equals 15
	 * });
	 */
	var compose = function(/*...args*/) {
	    return seq.apply(null, slice(arguments).reverse());
	};

	var _concat = Array.prototype.concat;

	/**
	 * The same as [`concat`]{@link module:Collections.concat} but runs a maximum of `limit` async operations at a time.
	 *
	 * @name concatLimit
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.concat]{@link module:Collections.concat}
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
	 * which should use an array as its result. Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished, or an error occurs. Results is an array
	 * containing the concatenated results of the `iteratee` function. Invoked with
	 * (err, results).
	 */
	var concatLimit = function(coll, limit, iteratee, callback) {
	    callback = callback || noop;
	    var _iteratee = wrapAsync(iteratee);
	    mapLimit(coll, limit, function(val, callback) {
	        _iteratee(val, function(err /*, ...args*/) {
	            if (err) return callback(err);
	            return callback(null, slice(arguments, 1));
	        });
	    }, function(err, mapResults) {
	        var result = [];
	        for (var i = 0; i < mapResults.length; i++) {
	            if (mapResults[i]) {
	                result = _concat.apply(result, mapResults[i]);
	            }
	        }

	        return callback(err, result);
	    });
	};

	/**
	 * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
	 * the concatenated list. The `iteratee`s are called in parallel, and the
	 * results are concatenated as they return. There is no guarantee that the
	 * results array will be returned in the original order of `coll` passed to the
	 * `iteratee` function.
	 *
	 * @name concat
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
	 * which should use an array as its result. Invoked with (item, callback).
	 * @param {Function} [callback(err)] - A callback which is called after all the
	 * `iteratee` functions have finished, or an error occurs. Results is an array
	 * containing the concatenated results of the `iteratee` function. Invoked with
	 * (err, results).
	 * @example
	 *
	 * async.concat(['dir1','dir2','dir3'], fs.readdir, function(err, files) {
	 *     // files is now a list of filenames that exist in the 3 directories
	 * });
	 */
	var concat = doLimit(concatLimit, Infinity);

	/**
	 * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
	 *
	 * @name concatSeries
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.concat]{@link module:Collections.concat}
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`.
	 * The iteratee should complete with an array an array of results.
	 * Invoked with (item, callback).
	 * @param {Function} [callback(err)] - A callback which is called after all the
	 * `iteratee` functions have finished, or an error occurs. Results is an array
	 * containing the concatenated results of the `iteratee` function. Invoked with
	 * (err, results).
	 */
	var concatSeries = doLimit(concatLimit, 1);

	/**
	 * Returns a function that when called, calls-back with the values provided.
	 * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
	 * [`auto`]{@link module:ControlFlow.auto}.
	 *
	 * @name constant
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @category Util
	 * @param {...*} arguments... - Any number of arguments to automatically invoke
	 * callback with.
	 * @returns {AsyncFunction} Returns a function that when invoked, automatically
	 * invokes the callback with the previous given arguments.
	 * @example
	 *
	 * async.waterfall([
	 *     async.constant(42),
	 *     function (value, next) {
	 *         // value === 42
	 *     },
	 *     //...
	 * ], callback);
	 *
	 * async.waterfall([
	 *     async.constant(filename, "utf8"),
	 *     fs.readFile,
	 *     function (fileData, next) {
	 *         //...
	 *     }
	 *     //...
	 * ], callback);
	 *
	 * async.auto({
	 *     hostname: async.constant("https://server.net/"),
	 *     port: findFreePort,
	 *     launchServer: ["hostname", "port", function (options, cb) {
	 *         startServer(options, cb);
	 *     }],
	 *     //...
	 * }, callback);
	 */
	var constant = function(/*...values*/) {
	    var values = slice(arguments);
	    var args = [null].concat(values);
	    return function (/*...ignoredArgs, callback*/) {
	        var callback = arguments[arguments.length - 1];
	        return callback.apply(this, args);
	    };
	};

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	function _createTester(check, getResult) {
	    return function(eachfn, arr, iteratee, cb) {
	        cb = cb || noop;
	        var testPassed = false;
	        var testResult;
	        eachfn(arr, function(value, _, callback) {
	            iteratee(value, function(err, result) {
	                if (err) {
	                    callback(err);
	                } else if (check(result) && !testResult) {
	                    testPassed = true;
	                    testResult = getResult(true, value);
	                    callback(null, breakLoop);
	                } else {
	                    callback();
	                }
	            });
	        }, function(err) {
	            if (err) {
	                cb(err);
	            } else {
	                cb(null, testPassed ? testResult : getResult(false));
	            }
	        });
	    };
	}

	function _findGetResult(v, x) {
	    return x;
	}

	/**
	 * Returns the first value in `coll` that passes an async truth test. The
	 * `iteratee` is applied in parallel, meaning the first iteratee to return
	 * `true` will fire the detect `callback` with that result. That means the
	 * result might not be the first item in the original `coll` (in terms of order)
	 * that passes the test.

	 * If order within the original `coll` is important, then look at
	 * [`detectSeries`]{@link module:Collections.detectSeries}.
	 *
	 * @name detect
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @alias find
	 * @category Collections
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
	 * The iteratee must complete with a boolean value as its result.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called as soon as any
	 * iteratee returns `true`, or after all the `iteratee` functions have finished.
	 * Result will be the first item in the array that passes the truth test
	 * (iteratee) or the value `undefined` if none passed. Invoked with
	 * (err, result).
	 * @example
	 *
	 * async.detect(['file1','file2','file3'], function(filePath, callback) {
	 *     fs.access(filePath, function(err) {
	 *         callback(null, !err)
	 *     });
	 * }, function(err, result) {
	 *     // result now equals the first file in the list that exists
	 * });
	 */
	var detect = doParallel(_createTester(identity, _findGetResult));

	/**
	 * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
	 * time.
	 *
	 * @name detectLimit
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.detect]{@link module:Collections.detect}
	 * @alias findLimit
	 * @category Collections
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
	 * The iteratee must complete with a boolean value as its result.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called as soon as any
	 * iteratee returns `true`, or after all the `iteratee` functions have finished.
	 * Result will be the first item in the array that passes the truth test
	 * (iteratee) or the value `undefined` if none passed. Invoked with
	 * (err, result).
	 */
	var detectLimit = doParallelLimit(_createTester(identity, _findGetResult));

	/**
	 * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
	 *
	 * @name detectSeries
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.detect]{@link module:Collections.detect}
	 * @alias findSeries
	 * @category Collections
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
	 * The iteratee must complete with a boolean value as its result.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called as soon as any
	 * iteratee returns `true`, or after all the `iteratee` functions have finished.
	 * Result will be the first item in the array that passes the truth test
	 * (iteratee) or the value `undefined` if none passed. Invoked with
	 * (err, result).
	 */
	var detectSeries = doLimit(detectLimit, 1);

	function consoleFunc(name) {
	    return function (fn/*, ...args*/) {
	        var args = slice(arguments, 1);
	        args.push(function (err/*, ...args*/) {
	            var args = slice(arguments, 1);
	            if (typeof console === 'object') {
	                if (err) {
	                    if (console.error) {
	                        console.error(err);
	                    }
	                } else if (console[name]) {
	                    arrayEach(args, function (x) {
	                        console[name](x);
	                    });
	                }
	            }
	        });
	        wrapAsync(fn).apply(null, args);
	    };
	}

	/**
	 * Logs the result of an [`async` function]{@link AsyncFunction} to the
	 * `console` using `console.dir` to display the properties of the resulting object.
	 * Only works in Node.js or in browsers that support `console.dir` and
	 * `console.error` (such as FF and Chrome).
	 * If multiple arguments are returned from the async function,
	 * `console.dir` is called on each argument in order.
	 *
	 * @name dir
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @category Util
	 * @param {AsyncFunction} function - The function you want to eventually apply
	 * all arguments to.
	 * @param {...*} arguments... - Any number of arguments to apply to the function.
	 * @example
	 *
	 * // in a module
	 * var hello = function(name, callback) {
	 *     setTimeout(function() {
	 *         callback(null, {hello: name});
	 *     }, 1000);
	 * };
	 *
	 * // in the node repl
	 * node> async.dir(hello, 'world');
	 * {hello: 'world'}
	 */
	var dir = consoleFunc('dir');

	/**
	 * The post-check version of [`during`]{@link module:ControlFlow.during}. To reflect the difference in
	 * the order of operations, the arguments `test` and `fn` are switched.
	 *
	 * Also a version of [`doWhilst`]{@link module:ControlFlow.doWhilst} with asynchronous `test` function.
	 * @name doDuring
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.during]{@link module:ControlFlow.during}
	 * @category Control Flow
	 * @param {AsyncFunction} fn - An async function which is called each time
	 * `test` passes. Invoked with (callback).
	 * @param {AsyncFunction} test - asynchronous truth test to perform before each
	 * execution of `fn`. Invoked with (...args, callback), where `...args` are the
	 * non-error args from the previous callback of `fn`.
	 * @param {Function} [callback] - A callback which is called after the test
	 * function has failed and repeated execution of `fn` has stopped. `callback`
	 * will be passed an error if one occurred, otherwise `null`.
	 */
	function doDuring(fn, test, callback) {
	    callback = onlyOnce(callback || noop);
	    var _fn = wrapAsync(fn);
	    var _test = wrapAsync(test);

	    function next(err/*, ...args*/) {
	        if (err) return callback(err);
	        var args = slice(arguments, 1);
	        args.push(check);
	        _test.apply(this, args);
	    }

	    function check(err, truth) {
	        if (err) return callback(err);
	        if (!truth) return callback(null);
	        _fn(next);
	    }

	    check(null, true);

	}

	/**
	 * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
	 * the order of operations, the arguments `test` and `iteratee` are switched.
	 *
	 * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
	 *
	 * @name doWhilst
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.whilst]{@link module:ControlFlow.whilst}
	 * @category Control Flow
	 * @param {AsyncFunction} iteratee - A function which is called each time `test`
	 * passes. Invoked with (callback).
	 * @param {Function} test - synchronous truth test to perform after each
	 * execution of `iteratee`. Invoked with any non-error callback results of
	 * `iteratee`.
	 * @param {Function} [callback] - A callback which is called after the test
	 * function has failed and repeated execution of `iteratee` has stopped.
	 * `callback` will be passed an error and any arguments passed to the final
	 * `iteratee`'s callback. Invoked with (err, [results]);
	 */
	function doWhilst(iteratee, test, callback) {
	    callback = onlyOnce(callback || noop);
	    var _iteratee = wrapAsync(iteratee);
	    var next = function(err/*, ...args*/) {
	        if (err) return callback(err);
	        var args = slice(arguments, 1);
	        if (test.apply(this, args)) return _iteratee(next);
	        callback.apply(null, [null].concat(args));
	    };
	    _iteratee(next);
	}

	/**
	 * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
	 * argument ordering differs from `until`.
	 *
	 * @name doUntil
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
	 * @category Control Flow
	 * @param {AsyncFunction} iteratee - An async function which is called each time
	 * `test` fails. Invoked with (callback).
	 * @param {Function} test - synchronous truth test to perform after each
	 * execution of `iteratee`. Invoked with any non-error callback results of
	 * `iteratee`.
	 * @param {Function} [callback] - A callback which is called after the test
	 * function has passed and repeated execution of `iteratee` has stopped. `callback`
	 * will be passed an error and any arguments passed to the final `iteratee`'s
	 * callback. Invoked with (err, [results]);
	 */
	function doUntil(iteratee, test, callback) {
	    doWhilst(iteratee, function() {
	        return !test.apply(this, arguments);
	    }, callback);
	}

	/**
	 * Like [`whilst`]{@link module:ControlFlow.whilst}, except the `test` is an asynchronous function that
	 * is passed a callback in the form of `function (err, truth)`. If error is
	 * passed to `test` or `fn`, the main callback is immediately called with the
	 * value of the error.
	 *
	 * @name during
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.whilst]{@link module:ControlFlow.whilst}
	 * @category Control Flow
	 * @param {AsyncFunction} test - asynchronous truth test to perform before each
	 * execution of `fn`. Invoked with (callback).
	 * @param {AsyncFunction} fn - An async function which is called each time
	 * `test` passes. Invoked with (callback).
	 * @param {Function} [callback] - A callback which is called after the test
	 * function has failed and repeated execution of `fn` has stopped. `callback`
	 * will be passed an error, if one occurred, otherwise `null`.
	 * @example
	 *
	 * var count = 0;
	 *
	 * async.during(
	 *     function (callback) {
	 *         return callback(null, count < 5);
	 *     },
	 *     function (callback) {
	 *         count++;
	 *         setTimeout(callback, 1000);
	 *     },
	 *     function (err) {
	 *         // 5 seconds have passed
	 *     }
	 * );
	 */
	function during(test, fn, callback) {
	    callback = onlyOnce(callback || noop);
	    var _fn = wrapAsync(fn);
	    var _test = wrapAsync(test);

	    function next(err) {
	        if (err) return callback(err);
	        _test(check);
	    }

	    function check(err, truth) {
	        if (err) return callback(err);
	        if (!truth) return callback(null);
	        _fn(next);
	    }

	    _test(check);
	}

	function _withoutIndex(iteratee) {
	    return function (value, index, callback) {
	        return iteratee(value, callback);
	    };
	}

	/**
	 * Applies the function `iteratee` to each item in `coll`, in parallel.
	 * The `iteratee` is called with an item from the list, and a callback for when
	 * it has finished. If the `iteratee` passes an error to its `callback`, the
	 * main `callback` (for the `each` function) is immediately called with the
	 * error.
	 *
	 * Note, that since this function applies `iteratee` to each item in parallel,
	 * there is no guarantee that the iteratee functions will complete in order.
	 *
	 * @name each
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @alias forEach
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - An async function to apply to
	 * each item in `coll`. Invoked with (item, callback).
	 * The array index is not passed to the iteratee.
	 * If you need the index, use `eachOf`.
	 * @param {Function} [callback] - A callback which is called when all
	 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	 * @example
	 *
	 * // assuming openFiles is an array of file names and saveFile is a function
	 * // to save the modified contents of that file:
	 *
	 * async.each(openFiles, saveFile, function(err){
	 *   // if any of the saves produced an error, err would equal that error
	 * });
	 *
	 * // assuming openFiles is an array of file names
	 * async.each(openFiles, function(file, callback) {
	 *
	 *     // Perform operation on file here.
	 *     console.log('Processing file ' + file);
	 *
	 *     if( file.length > 32 ) {
	 *       console.log('This file name is too long');
	 *       callback('File name too long');
	 *     } else {
	 *       // Do work to process file here
	 *       console.log('File processed');
	 *       callback();
	 *     }
	 * }, function(err) {
	 *     // if any of the file processing produced an error, err would equal that error
	 *     if( err ) {
	 *       // One of the iterations produced an error.
	 *       // All processing will now stop.
	 *       console.log('A file failed to process');
	 *     } else {
	 *       console.log('All files have been processed successfully');
	 *     }
	 * });
	 */
	function eachLimit(coll, iteratee, callback) {
	    eachOf(coll, _withoutIndex(wrapAsync(iteratee)), callback);
	}

	/**
	 * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
	 *
	 * @name eachLimit
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.each]{@link module:Collections.each}
	 * @alias forEachLimit
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {AsyncFunction} iteratee - An async function to apply to each item in
	 * `coll`.
	 * The array index is not passed to the iteratee.
	 * If you need the index, use `eachOfLimit`.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called when all
	 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	 */
	function eachLimit$1(coll, limit, iteratee, callback) {
	    _eachOfLimit(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
	}

	/**
	 * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
	 *
	 * @name eachSeries
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.each]{@link module:Collections.each}
	 * @alias forEachSeries
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - An async function to apply to each
	 * item in `coll`.
	 * The array index is not passed to the iteratee.
	 * If you need the index, use `eachOfSeries`.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called when all
	 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
	 */
	var eachSeries = doLimit(eachLimit$1, 1);

	/**
	 * Wrap an async function and ensure it calls its callback on a later tick of
	 * the event loop.  If the function already calls its callback on a next tick,
	 * no extra deferral is added. This is useful for preventing stack overflows
	 * (`RangeError: Maximum call stack size exceeded`) and generally keeping
	 * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
	 * contained. ES2017 `async` functions are returned as-is -- they are immune
	 * to Zalgo's corrupting influences, as they always resolve on a later tick.
	 *
	 * @name ensureAsync
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @category Util
	 * @param {AsyncFunction} fn - an async function, one that expects a node-style
	 * callback as its last argument.
	 * @returns {AsyncFunction} Returns a wrapped function with the exact same call
	 * signature as the function passed in.
	 * @example
	 *
	 * function sometimesAsync(arg, callback) {
	 *     if (cache[arg]) {
	 *         return callback(null, cache[arg]); // this would be synchronous!!
	 *     } else {
	 *         doSomeIO(arg, callback); // this IO would be asynchronous
	 *     }
	 * }
	 *
	 * // this has a risk of stack overflows if many results are cached in a row
	 * async.mapSeries(args, sometimesAsync, done);
	 *
	 * // this will defer sometimesAsync's callback if necessary,
	 * // preventing stack overflows
	 * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
	 */
	function ensureAsync(fn) {
	    if (isAsync(fn)) return fn;
	    return initialParams(function (args, callback) {
	        var sync = true;
	        args.push(function () {
	            var innerArgs = arguments;
	            if (sync) {
	                setImmediate$1(function () {
	                    callback.apply(null, innerArgs);
	                });
	            } else {
	                callback.apply(null, innerArgs);
	            }
	        });
	        fn.apply(this, args);
	        sync = false;
	    });
	}

	function notId(v) {
	    return !v;
	}

	/**
	 * Returns `true` if every element in `coll` satisfies an async test. If any
	 * iteratee call returns `false`, the main `callback` is immediately called.
	 *
	 * @name every
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @alias all
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
	 * in the collection in parallel.
	 * The iteratee must complete with a boolean result value.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Result will be either `true` or `false`
	 * depending on the values of the async tests. Invoked with (err, result).
	 * @example
	 *
	 * async.every(['file1','file2','file3'], function(filePath, callback) {
	 *     fs.access(filePath, function(err) {
	 *         callback(null, !err)
	 *     });
	 * }, function(err, result) {
	 *     // if result is true then every file exists
	 * });
	 */
	var every = doParallel(_createTester(notId, notId));

	/**
	 * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
	 *
	 * @name everyLimit
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.every]{@link module:Collections.every}
	 * @alias allLimit
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
	 * in the collection in parallel.
	 * The iteratee must complete with a boolean result value.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Result will be either `true` or `false`
	 * depending on the values of the async tests. Invoked with (err, result).
	 */
	var everyLimit = doParallelLimit(_createTester(notId, notId));

	/**
	 * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
	 *
	 * @name everySeries
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.every]{@link module:Collections.every}
	 * @alias allSeries
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
	 * in the collection in series.
	 * The iteratee must complete with a boolean result value.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Result will be either `true` or `false`
	 * depending on the values of the async tests. Invoked with (err, result).
	 */
	var everySeries = doLimit(everyLimit, 1);

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	function filterArray(eachfn, arr, iteratee, callback) {
	    var truthValues = new Array(arr.length);
	    eachfn(arr, function (x, index, callback) {
	        iteratee(x, function (err, v) {
	            truthValues[index] = !!v;
	            callback(err);
	        });
	    }, function (err) {
	        if (err) return callback(err);
	        var results = [];
	        for (var i = 0; i < arr.length; i++) {
	            if (truthValues[i]) results.push(arr[i]);
	        }
	        callback(null, results);
	    });
	}

	function filterGeneric(eachfn, coll, iteratee, callback) {
	    var results = [];
	    eachfn(coll, function (x, index, callback) {
	        iteratee(x, function (err, v) {
	            if (err) {
	                callback(err);
	            } else {
	                if (v) {
	                    results.push({index: index, value: x});
	                }
	                callback();
	            }
	        });
	    }, function (err) {
	        if (err) {
	            callback(err);
	        } else {
	            callback(null, arrayMap(results.sort(function (a, b) {
	                return a.index - b.index;
	            }), baseProperty('value')));
	        }
	    });
	}

	function _filter(eachfn, coll, iteratee, callback) {
	    var filter = isArrayLike(coll) ? filterArray : filterGeneric;
	    filter(eachfn, coll, wrapAsync(iteratee), callback || noop);
	}

	/**
	 * Returns a new array of all the values in `coll` which pass an async truth
	 * test. This operation is performed in parallel, but the results array will be
	 * in the same order as the original.
	 *
	 * @name filter
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @alias select
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	 * with a boolean argument once it has completed. Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Invoked with (err, results).
	 * @example
	 *
	 * async.filter(['file1','file2','file3'], function(filePath, callback) {
	 *     fs.access(filePath, function(err) {
	 *         callback(null, !err)
	 *     });
	 * }, function(err, results) {
	 *     // results now equals an array of the existing files
	 * });
	 */
	var filter = doParallel(_filter);

	/**
	 * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
	 * time.
	 *
	 * @name filterLimit
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.filter]{@link module:Collections.filter}
	 * @alias selectLimit
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	 * with a boolean argument once it has completed. Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Invoked with (err, results).
	 */
	var filterLimit = doParallelLimit(_filter);

	/**
	 * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
	 *
	 * @name filterSeries
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.filter]{@link module:Collections.filter}
	 * @alias selectSeries
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
	 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
	 * with a boolean argument once it has completed. Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Invoked with (err, results)
	 */
	var filterSeries = doLimit(filterLimit, 1);

	/**
	 * Calls the asynchronous function `fn` with a callback parameter that allows it
	 * to call itself again, in series, indefinitely.

	 * If an error is passed to the callback then `errback` is called with the
	 * error, and execution stops, otherwise it will never be called.
	 *
	 * @name forever
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @param {AsyncFunction} fn - an async function to call repeatedly.
	 * Invoked with (next).
	 * @param {Function} [errback] - when `fn` passes an error to it's callback,
	 * this function will be called, and execution stops. Invoked with (err).
	 * @example
	 *
	 * async.forever(
	 *     function(next) {
	 *         // next is suitable for passing to things that need a callback(err [, whatever]);
	 *         // it will result in this function being called again.
	 *     },
	 *     function(err) {
	 *         // if next is called with a value in its first parameter, it will appear
	 *         // in here as 'err', and execution will stop.
	 *     }
	 * );
	 */
	function forever(fn, errback) {
	    var done = onlyOnce(errback || noop);
	    var task = wrapAsync(ensureAsync(fn));

	    function next(err) {
	        if (err) return done(err);
	        task(next);
	    }
	    next();
	}

	/**
	 * The same as [`groupBy`]{@link module:Collections.groupBy} but runs a maximum of `limit` async operations at a time.
	 *
	 * @name groupByLimit
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.groupBy]{@link module:Collections.groupBy}
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {AsyncFunction} iteratee - An async function to apply to each item in
	 * `coll`.
	 * The iteratee should complete with a `key` to group the value under.
	 * Invoked with (value, callback).
	 * @param {Function} [callback] - A callback which is called when all `iteratee`
	 * functions have finished, or an error occurs. Result is an `Object` whoses
	 * properties are arrays of values which returned the corresponding key.
	 */
	var groupByLimit = function(coll, limit, iteratee, callback) {
	    callback = callback || noop;
	    var _iteratee = wrapAsync(iteratee);
	    mapLimit(coll, limit, function(val, callback) {
	        _iteratee(val, function(err, key) {
	            if (err) return callback(err);
	            return callback(null, {key: key, val: val});
	        });
	    }, function(err, mapResults) {
	        var result = {};
	        // from MDN, handle object having an `hasOwnProperty` prop
	        var hasOwnProperty = Object.prototype.hasOwnProperty;

	        for (var i = 0; i < mapResults.length; i++) {
	            if (mapResults[i]) {
	                var key = mapResults[i].key;
	                var val = mapResults[i].val;

	                if (hasOwnProperty.call(result, key)) {
	                    result[key].push(val);
	                } else {
	                    result[key] = [val];
	                }
	            }
	        }

	        return callback(err, result);
	    });
	};

	/**
	 * Returns a new object, where each value corresponds to an array of items, from
	 * `coll`, that returned the corresponding key. That is, the keys of the object
	 * correspond to the values passed to the `iteratee` callback.
	 *
	 * Note: Since this function applies the `iteratee` to each item in parallel,
	 * there is no guarantee that the `iteratee` functions will complete in order.
	 * However, the values for each key in the `result` will be in the same order as
	 * the original `coll`. For Objects, the values will roughly be in the order of
	 * the original Objects' keys (but this can vary across JavaScript engines).
	 *
	 * @name groupBy
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - An async function to apply to each item in
	 * `coll`.
	 * The iteratee should complete with a `key` to group the value under.
	 * Invoked with (value, callback).
	 * @param {Function} [callback] - A callback which is called when all `iteratee`
	 * functions have finished, or an error occurs. Result is an `Object` whoses
	 * properties are arrays of values which returned the corresponding key.
	 * @example
	 *
	 * async.groupBy(['userId1', 'userId2', 'userId3'], function(userId, callback) {
	 *     db.findById(userId, function(err, user) {
	 *         if (err) return callback(err);
	 *         return callback(null, user.age);
	 *     });
	 * }, function(err, result) {
	 *     // result is object containing the userIds grouped by age
	 *     // e.g. { 30: ['userId1', 'userId3'], 42: ['userId2']};
	 * });
	 */
	var groupBy = doLimit(groupByLimit, Infinity);

	/**
	 * The same as [`groupBy`]{@link module:Collections.groupBy} but runs only a single async operation at a time.
	 *
	 * @name groupBySeries
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.groupBy]{@link module:Collections.groupBy}
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {AsyncFunction} iteratee - An async function to apply to each item in
	 * `coll`.
	 * The iteratee should complete with a `key` to group the value under.
	 * Invoked with (value, callback).
	 * @param {Function} [callback] - A callback which is called when all `iteratee`
	 * functions have finished, or an error occurs. Result is an `Object` whoses
	 * properties are arrays of values which returned the corresponding key.
	 */
	var groupBySeries = doLimit(groupByLimit, 1);

	/**
	 * Logs the result of an `async` function to the `console`. Only works in
	 * Node.js or in browsers that support `console.log` and `console.error` (such
	 * as FF and Chrome). If multiple arguments are returned from the async
	 * function, `console.log` is called on each argument in order.
	 *
	 * @name log
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @category Util
	 * @param {AsyncFunction} function - The function you want to eventually apply
	 * all arguments to.
	 * @param {...*} arguments... - Any number of arguments to apply to the function.
	 * @example
	 *
	 * // in a module
	 * var hello = function(name, callback) {
	 *     setTimeout(function() {
	 *         callback(null, 'hello ' + name);
	 *     }, 1000);
	 * };
	 *
	 * // in the node repl
	 * node> async.log(hello, 'world');
	 * 'hello world'
	 */
	var log = consoleFunc('log');

	/**
	 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
	 * time.
	 *
	 * @name mapValuesLimit
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.mapValues]{@link module:Collections.mapValues}
	 * @category Collection
	 * @param {Object} obj - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {AsyncFunction} iteratee - A function to apply to each value and key
	 * in `coll`.
	 * The iteratee should complete with the transformed value as its result.
	 * Invoked with (value, key, callback).
	 * @param {Function} [callback] - A callback which is called when all `iteratee`
	 * functions have finished, or an error occurs. `result` is a new object consisting
	 * of each key from `obj`, with each transformed value on the right-hand side.
	 * Invoked with (err, result).
	 */
	function mapValuesLimit(obj, limit, iteratee, callback) {
	    callback = once(callback || noop);
	    var newObj = {};
	    var _iteratee = wrapAsync(iteratee);
	    eachOfLimit(obj, limit, function(val, key, next) {
	        _iteratee(val, key, function (err, result) {
	            if (err) return next(err);
	            newObj[key] = result;
	            next();
	        });
	    }, function (err) {
	        callback(err, newObj);
	    });
	}

	/**
	 * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
	 *
	 * Produces a new Object by mapping each value of `obj` through the `iteratee`
	 * function. The `iteratee` is called each `value` and `key` from `obj` and a
	 * callback for when it has finished processing. Each of these callbacks takes
	 * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
	 * passes an error to its callback, the main `callback` (for the `mapValues`
	 * function) is immediately called with the error.
	 *
	 * Note, the order of the keys in the result is not guaranteed.  The keys will
	 * be roughly in the order they complete, (but this is very engine-specific)
	 *
	 * @name mapValues
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @category Collection
	 * @param {Object} obj - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - A function to apply to each value and key
	 * in `coll`.
	 * The iteratee should complete with the transformed value as its result.
	 * Invoked with (value, key, callback).
	 * @param {Function} [callback] - A callback which is called when all `iteratee`
	 * functions have finished, or an error occurs. `result` is a new object consisting
	 * of each key from `obj`, with each transformed value on the right-hand side.
	 * Invoked with (err, result).
	 * @example
	 *
	 * async.mapValues({
	 *     f1: 'file1',
	 *     f2: 'file2',
	 *     f3: 'file3'
	 * }, function (file, key, callback) {
	 *   fs.stat(file, callback);
	 * }, function(err, result) {
	 *     // result is now a map of stats for each file, e.g.
	 *     // {
	 *     //     f1: [stats for file1],
	 *     //     f2: [stats for file2],
	 *     //     f3: [stats for file3]
	 *     // }
	 * });
	 */

	var mapValues = doLimit(mapValuesLimit, Infinity);

	/**
	 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
	 *
	 * @name mapValuesSeries
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.mapValues]{@link module:Collections.mapValues}
	 * @category Collection
	 * @param {Object} obj - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - A function to apply to each value and key
	 * in `coll`.
	 * The iteratee should complete with the transformed value as its result.
	 * Invoked with (value, key, callback).
	 * @param {Function} [callback] - A callback which is called when all `iteratee`
	 * functions have finished, or an error occurs. `result` is a new object consisting
	 * of each key from `obj`, with each transformed value on the right-hand side.
	 * Invoked with (err, result).
	 */
	var mapValuesSeries = doLimit(mapValuesLimit, 1);

	function has(obj, key) {
	    return key in obj;
	}

	/**
	 * Caches the results of an async function. When creating a hash to store
	 * function results against, the callback is omitted from the hash and an
	 * optional hash function can be used.
	 *
	 * If no hash function is specified, the first argument is used as a hash key,
	 * which may work reasonably if it is a string or a data type that converts to a
	 * distinct string. Note that objects and arrays will not behave reasonably.
	 * Neither will cases where the other arguments are significant. In such cases,
	 * specify your own hash function.
	 *
	 * The cache of results is exposed as the `memo` property of the function
	 * returned by `memoize`.
	 *
	 * @name memoize
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @category Util
	 * @param {AsyncFunction} fn - The async function to proxy and cache results from.
	 * @param {Function} hasher - An optional function for generating a custom hash
	 * for storing results. It has all the arguments applied to it apart from the
	 * callback, and must be synchronous.
	 * @returns {AsyncFunction} a memoized version of `fn`
	 * @example
	 *
	 * var slow_fn = function(name, callback) {
	 *     // do something
	 *     callback(null, result);
	 * };
	 * var fn = async.memoize(slow_fn);
	 *
	 * // fn can now be used as if it were slow_fn
	 * fn('some name', function() {
	 *     // callback
	 * });
	 */
	function memoize(fn, hasher) {
	    var memo = Object.create(null);
	    var queues = Object.create(null);
	    hasher = hasher || identity;
	    var _fn = wrapAsync(fn);
	    var memoized = initialParams(function memoized(args, callback) {
	        var key = hasher.apply(null, args);
	        if (has(memo, key)) {
	            setImmediate$1(function() {
	                callback.apply(null, memo[key]);
	            });
	        } else if (has(queues, key)) {
	            queues[key].push(callback);
	        } else {
	            queues[key] = [callback];
	            _fn.apply(null, args.concat(function(/*args*/) {
	                var args = slice(arguments);
	                memo[key] = args;
	                var q = queues[key];
	                delete queues[key];
	                for (var i = 0, l = q.length; i < l; i++) {
	                    q[i].apply(null, args);
	                }
	            }));
	        }
	    });
	    memoized.memo = memo;
	    memoized.unmemoized = fn;
	    return memoized;
	}

	/**
	 * Calls `callback` on a later loop around the event loop. In Node.js this just
	 * calls `setImmediate`.  In the browser it will use `setImmediate` if
	 * available, otherwise `setTimeout(callback, 0)`, which means other higher
	 * priority events may precede the execution of `callback`.
	 *
	 * This is used internally for browser-compatibility purposes.
	 *
	 * @name nextTick
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @alias setImmediate
	 * @category Util
	 * @param {Function} callback - The function to call on a later loop around
	 * the event loop. Invoked with (args...).
	 * @param {...*} args... - any number of additional arguments to pass to the
	 * callback on the next tick.
	 * @example
	 *
	 * var call_order = [];
	 * async.nextTick(function() {
	 *     call_order.push('two');
	 *     // call_order now equals ['one','two']
	 * });
	 * call_order.push('one');
	 *
	 * async.setImmediate(function (a, b, c) {
	 *     // a, b, and c equal 1, 2, and 3
	 * }, 1, 2, 3);
	 */
	var _defer$1;

	if (hasNextTick) {
	    _defer$1 = process.nextTick;
	} else if (hasSetImmediate) {
	    _defer$1 = setImmediate;
	} else {
	    _defer$1 = fallback;
	}

	var nextTick = wrap(_defer$1);

	function _parallel(eachfn, tasks, callback) {
	    callback = callback || noop;
	    var results = isArrayLike(tasks) ? [] : {};

	    eachfn(tasks, function (task, key, callback) {
	        wrapAsync(task)(function (err, result) {
	            if (arguments.length > 2) {
	                result = slice(arguments, 1);
	            }
	            results[key] = result;
	            callback(err);
	        });
	    }, function (err) {
	        callback(err, results);
	    });
	}

	/**
	 * Run the `tasks` collection of functions in parallel, without waiting until
	 * the previous function has completed. If any of the functions pass an error to
	 * its callback, the main `callback` is immediately called with the value of the
	 * error. Once the `tasks` have completed, the results are passed to the final
	 * `callback` as an array.
	 *
	 * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
	 * parallel execution of code.  If your tasks do not use any timers or perform
	 * any I/O, they will actually be executed in series.  Any synchronous setup
	 * sections for each task will happen one after the other.  JavaScript remains
	 * single-threaded.
	 *
	 * **Hint:** Use [`reflect`]{@link module:Utils.reflect} to continue the
	 * execution of other tasks when a task fails.
	 *
	 * It is also possible to use an object instead of an array. Each property will
	 * be run as a function and the results will be passed to the final `callback`
	 * as an object instead of an array. This can be a more readable way of handling
	 * results from {@link async.parallel}.
	 *
	 * @name parallel
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @param {Array|Iterable|Object} tasks - A collection of
	 * [async functions]{@link AsyncFunction} to run.
	 * Each async function can complete with any number of optional `result` values.
	 * @param {Function} [callback] - An optional callback to run once all the
	 * functions have completed successfully. This function gets a results array
	 * (or object) containing all the result arguments passed to the task callbacks.
	 * Invoked with (err, results).
	 *
	 * @example
	 * async.parallel([
	 *     function(callback) {
	 *         setTimeout(function() {
	 *             callback(null, 'one');
	 *         }, 200);
	 *     },
	 *     function(callback) {
	 *         setTimeout(function() {
	 *             callback(null, 'two');
	 *         }, 100);
	 *     }
	 * ],
	 * // optional callback
	 * function(err, results) {
	 *     // the results array will equal ['one','two'] even though
	 *     // the second function had a shorter timeout.
	 * });
	 *
	 * // an example using an object instead of an array
	 * async.parallel({
	 *     one: function(callback) {
	 *         setTimeout(function() {
	 *             callback(null, 1);
	 *         }, 200);
	 *     },
	 *     two: function(callback) {
	 *         setTimeout(function() {
	 *             callback(null, 2);
	 *         }, 100);
	 *     }
	 * }, function(err, results) {
	 *     // results is now equals to: {one: 1, two: 2}
	 * });
	 */
	function parallelLimit(tasks, callback) {
	    _parallel(eachOf, tasks, callback);
	}

	/**
	 * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
	 * time.
	 *
	 * @name parallelLimit
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.parallel]{@link module:ControlFlow.parallel}
	 * @category Control Flow
	 * @param {Array|Iterable|Object} tasks - A collection of
	 * [async functions]{@link AsyncFunction} to run.
	 * Each async function can complete with any number of optional `result` values.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {Function} [callback] - An optional callback to run once all the
	 * functions have completed successfully. This function gets a results array
	 * (or object) containing all the result arguments passed to the task callbacks.
	 * Invoked with (err, results).
	 */
	function parallelLimit$1(tasks, limit, callback) {
	    _parallel(_eachOfLimit(limit), tasks, callback);
	}

	/**
	 * A queue of tasks for the worker function to complete.
	 * @typedef {Object} QueueObject
	 * @memberOf module:ControlFlow
	 * @property {Function} length - a function returning the number of items
	 * waiting to be processed. Invoke with `queue.length()`.
	 * @property {boolean} started - a boolean indicating whether or not any
	 * items have been pushed and processed by the queue.
	 * @property {Function} running - a function returning the number of items
	 * currently being processed. Invoke with `queue.running()`.
	 * @property {Function} workersList - a function returning the array of items
	 * currently being processed. Invoke with `queue.workersList()`.
	 * @property {Function} idle - a function returning false if there are items
	 * waiting or being processed, or true if not. Invoke with `queue.idle()`.
	 * @property {number} concurrency - an integer for determining how many `worker`
	 * functions should be run in parallel. This property can be changed after a
	 * `queue` is created to alter the concurrency on-the-fly.
	 * @property {Function} push - add a new task to the `queue`. Calls `callback`
	 * once the `worker` has finished processing the task. Instead of a single task,
	 * a `tasks` array can be submitted. The respective callback is used for every
	 * task in the list. Invoke with `queue.push(task, [callback])`,
	 * @property {Function} unshift - add a new task to the front of the `queue`.
	 * Invoke with `queue.unshift(task, [callback])`.
	 * @property {Function} remove - remove items from the queue that match a test
	 * function.  The test function will be passed an object with a `data` property,
	 * and a `priority` property, if this is a
	 * [priorityQueue]{@link module:ControlFlow.priorityQueue} object.
	 * Invoked with `queue.remove(testFn)`, where `testFn` is of the form
	 * `function ({data, priority}) {}` and returns a Boolean.
	 * @property {Function} saturated - a callback that is called when the number of
	 * running workers hits the `concurrency` limit, and further tasks will be
	 * queued.
	 * @property {Function} unsaturated - a callback that is called when the number
	 * of running workers is less than the `concurrency` & `buffer` limits, and
	 * further tasks will not be queued.
	 * @property {number} buffer - A minimum threshold buffer in order to say that
	 * the `queue` is `unsaturated`.
	 * @property {Function} empty - a callback that is called when the last item
	 * from the `queue` is given to a `worker`.
	 * @property {Function} drain - a callback that is called when the last item
	 * from the `queue` has returned from the `worker`.
	 * @property {Function} error - a callback that is called when a task errors.
	 * Has the signature `function(error, task)`.
	 * @property {boolean} paused - a boolean for determining whether the queue is
	 * in a paused state.
	 * @property {Function} pause - a function that pauses the processing of tasks
	 * until `resume()` is called. Invoke with `queue.pause()`.
	 * @property {Function} resume - a function that resumes the processing of
	 * queued tasks when the queue is paused. Invoke with `queue.resume()`.
	 * @property {Function} kill - a function that removes the `drain` callback and
	 * empties remaining tasks from the queue forcing it to go idle. No more tasks
	 * should be pushed to the queue after calling this function. Invoke with `queue.kill()`.
	 */

	/**
	 * Creates a `queue` object with the specified `concurrency`. Tasks added to the
	 * `queue` are processed in parallel (up to the `concurrency` limit). If all
	 * `worker`s are in progress, the task is queued until one becomes available.
	 * Once a `worker` completes a `task`, that `task`'s callback is called.
	 *
	 * @name queue
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @param {AsyncFunction} worker - An async function for processing a queued task.
	 * If you want to handle errors from an individual task, pass a callback to
	 * `q.push()`. Invoked with (task, callback).
	 * @param {number} [concurrency=1] - An `integer` for determining how many
	 * `worker` functions should be run in parallel.  If omitted, the concurrency
	 * defaults to `1`.  If the concurrency is `0`, an error is thrown.
	 * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can
	 * attached as certain properties to listen for specific events during the
	 * lifecycle of the queue.
	 * @example
	 *
	 * // create a queue object with concurrency 2
	 * var q = async.queue(function(task, callback) {
	 *     console.log('hello ' + task.name);
	 *     callback();
	 * }, 2);
	 *
	 * // assign a callback
	 * q.drain = function() {
	 *     console.log('all items have been processed');
	 * };
	 *
	 * // add some items to the queue
	 * q.push({name: 'foo'}, function(err) {
	 *     console.log('finished processing foo');
	 * });
	 * q.push({name: 'bar'}, function (err) {
	 *     console.log('finished processing bar');
	 * });
	 *
	 * // add some items to the queue (batch-wise)
	 * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
	 *     console.log('finished processing item');
	 * });
	 *
	 * // add some items to the front of the queue
	 * q.unshift({name: 'bar'}, function (err) {
	 *     console.log('finished processing bar');
	 * });
	 */
	var queue$1 = function (worker, concurrency) {
	    var _worker = wrapAsync(worker);
	    return queue(function (items, cb) {
	        _worker(items[0], cb);
	    }, concurrency, 1);
	};

	/**
	 * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
	 * completed in ascending priority order.
	 *
	 * @name priorityQueue
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.queue]{@link module:ControlFlow.queue}
	 * @category Control Flow
	 * @param {AsyncFunction} worker - An async function for processing a queued task.
	 * If you want to handle errors from an individual task, pass a callback to
	 * `q.push()`.
	 * Invoked with (task, callback).
	 * @param {number} concurrency - An `integer` for determining how many `worker`
	 * functions should be run in parallel.  If omitted, the concurrency defaults to
	 * `1`.  If the concurrency is `0`, an error is thrown.
	 * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are two
	 * differences between `queue` and `priorityQueue` objects:
	 * * `push(task, priority, [callback])` - `priority` should be a number. If an
	 *   array of `tasks` is given, all tasks will be assigned the same priority.
	 * * The `unshift` method was removed.
	 */
	var priorityQueue = function(worker, concurrency) {
	    // Start with a normal queue
	    var q = queue$1(worker, concurrency);

	    // Override push to accept second parameter representing priority
	    q.push = function(data, priority, callback) {
	        if (callback == null) callback = noop;
	        if (typeof callback !== 'function') {
	            throw new Error('task callback must be a function');
	        }
	        q.started = true;
	        if (!isArray(data)) {
	            data = [data];
	        }
	        if (data.length === 0) {
	            // call drain immediately if there are no tasks
	            return setImmediate$1(function() {
	                q.drain();
	            });
	        }

	        priority = priority || 0;
	        var nextNode = q._tasks.head;
	        while (nextNode && priority >= nextNode.priority) {
	            nextNode = nextNode.next;
	        }

	        for (var i = 0, l = data.length; i < l; i++) {
	            var item = {
	                data: data[i],
	                priority: priority,
	                callback: callback
	            };

	            if (nextNode) {
	                q._tasks.insertBefore(nextNode, item);
	            } else {
	                q._tasks.push(item);
	            }
	        }
	        setImmediate$1(q.process);
	    };

	    // Remove unshift function
	    delete q.unshift;

	    return q;
	};

	/**
	 * Runs the `tasks` array of functions in parallel, without waiting until the
	 * previous function has completed. Once any of the `tasks` complete or pass an
	 * error to its callback, the main `callback` is immediately called. It's
	 * equivalent to `Promise.race()`.
	 *
	 * @name race
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @param {Array} tasks - An array containing [async functions]{@link AsyncFunction}
	 * to run. Each function can complete with an optional `result` value.
	 * @param {Function} callback - A callback to run once any of the functions have
	 * completed. This function gets an error or result from the first function that
	 * completed. Invoked with (err, result).
	 * @returns undefined
	 * @example
	 *
	 * async.race([
	 *     function(callback) {
	 *         setTimeout(function() {
	 *             callback(null, 'one');
	 *         }, 200);
	 *     },
	 *     function(callback) {
	 *         setTimeout(function() {
	 *             callback(null, 'two');
	 *         }, 100);
	 *     }
	 * ],
	 * // main callback
	 * function(err, result) {
	 *     // the result will be equal to 'two' as it finishes earlier
	 * });
	 */
	function race(tasks, callback) {
	    callback = once(callback || noop);
	    if (!isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
	    if (!tasks.length) return callback();
	    for (var i = 0, l = tasks.length; i < l; i++) {
	        wrapAsync(tasks[i])(callback);
	    }
	}

	/**
	 * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
	 *
	 * @name reduceRight
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.reduce]{@link module:Collections.reduce}
	 * @alias foldr
	 * @category Collection
	 * @param {Array} array - A collection to iterate over.
	 * @param {*} memo - The initial state of the reduction.
	 * @param {AsyncFunction} iteratee - A function applied to each item in the
	 * array to produce the next step in the reduction.
	 * The `iteratee` should complete with the next state of the reduction.
	 * If the iteratee complete with an error, the reduction is stopped and the
	 * main `callback` is immediately called with the error.
	 * Invoked with (memo, item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Result is the reduced value. Invoked with
	 * (err, result).
	 */
	function reduceRight (array, memo, iteratee, callback) {
	    var reversed = slice(array).reverse();
	    reduce(reversed, memo, iteratee, callback);
	}

	/**
	 * Wraps the async function in another function that always completes with a
	 * result object, even when it errors.
	 *
	 * The result object has either the property `error` or `value`.
	 *
	 * @name reflect
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @category Util
	 * @param {AsyncFunction} fn - The async function you want to wrap
	 * @returns {Function} - A function that always passes null to it's callback as
	 * the error. The second argument to the callback will be an `object` with
	 * either an `error` or a `value` property.
	 * @example
	 *
	 * async.parallel([
	 *     async.reflect(function(callback) {
	 *         // do some stuff ...
	 *         callback(null, 'one');
	 *     }),
	 *     async.reflect(function(callback) {
	 *         // do some more stuff but error ...
	 *         callback('bad stuff happened');
	 *     }),
	 *     async.reflect(function(callback) {
	 *         // do some more stuff ...
	 *         callback(null, 'two');
	 *     })
	 * ],
	 * // optional callback
	 * function(err, results) {
	 *     // values
	 *     // results[0].value = 'one'
	 *     // results[1].error = 'bad stuff happened'
	 *     // results[2].value = 'two'
	 * });
	 */
	function reflect(fn) {
	    var _fn = wrapAsync(fn);
	    return initialParams(function reflectOn(args, reflectCallback) {
	        args.push(function callback(error, cbArg) {
	            if (error) {
	                reflectCallback(null, { error: error });
	            } else {
	                var value;
	                if (arguments.length <= 2) {
	                    value = cbArg;
	                } else {
	                    value = slice(arguments, 1);
	                }
	                reflectCallback(null, { value: value });
	            }
	        });

	        return _fn.apply(this, args);
	    });
	}

	function reject$1(eachfn, arr, iteratee, callback) {
	    _filter(eachfn, arr, function(value, cb) {
	        iteratee(value, function(err, v) {
	            cb(err, !v);
	        });
	    }, callback);
	}

	/**
	 * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
	 *
	 * @name reject
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.filter]{@link module:Collections.filter}
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {Function} iteratee - An async truth test to apply to each item in
	 * `coll`.
	 * The should complete with a boolean value as its `result`.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Invoked with (err, results).
	 * @example
	 *
	 * async.reject(['file1','file2','file3'], function(filePath, callback) {
	 *     fs.access(filePath, function(err) {
	 *         callback(null, !err)
	 *     });
	 * }, function(err, results) {
	 *     // results now equals an array of missing files
	 *     createFiles(results);
	 * });
	 */
	var reject = doParallel(reject$1);

	/**
	 * A helper function that wraps an array or an object of functions with `reflect`.
	 *
	 * @name reflectAll
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @see [async.reflect]{@link module:Utils.reflect}
	 * @category Util
	 * @param {Array|Object|Iterable} tasks - The collection of
	 * [async functions]{@link AsyncFunction} to wrap in `async.reflect`.
	 * @returns {Array} Returns an array of async functions, each wrapped in
	 * `async.reflect`
	 * @example
	 *
	 * let tasks = [
	 *     function(callback) {
	 *         setTimeout(function() {
	 *             callback(null, 'one');
	 *         }, 200);
	 *     },
	 *     function(callback) {
	 *         // do some more stuff but error ...
	 *         callback(new Error('bad stuff happened'));
	 *     },
	 *     function(callback) {
	 *         setTimeout(function() {
	 *             callback(null, 'two');
	 *         }, 100);
	 *     }
	 * ];
	 *
	 * async.parallel(async.reflectAll(tasks),
	 * // optional callback
	 * function(err, results) {
	 *     // values
	 *     // results[0].value = 'one'
	 *     // results[1].error = Error('bad stuff happened')
	 *     // results[2].value = 'two'
	 * });
	 *
	 * // an example using an object instead of an array
	 * let tasks = {
	 *     one: function(callback) {
	 *         setTimeout(function() {
	 *             callback(null, 'one');
	 *         }, 200);
	 *     },
	 *     two: function(callback) {
	 *         callback('two');
	 *     },
	 *     three: function(callback) {
	 *         setTimeout(function() {
	 *             callback(null, 'three');
	 *         }, 100);
	 *     }
	 * };
	 *
	 * async.parallel(async.reflectAll(tasks),
	 * // optional callback
	 * function(err, results) {
	 *     // values
	 *     // results.one.value = 'one'
	 *     // results.two.error = 'two'
	 *     // results.three.value = 'three'
	 * });
	 */
	function reflectAll(tasks) {
	    var results;
	    if (isArray(tasks)) {
	        results = arrayMap(tasks, reflect);
	    } else {
	        results = {};
	        baseForOwn(tasks, function(task, key) {
	            results[key] = reflect.call(this, task);
	        });
	    }
	    return results;
	}

	/**
	 * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
	 * time.
	 *
	 * @name rejectLimit
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.reject]{@link module:Collections.reject}
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {Function} iteratee - An async truth test to apply to each item in
	 * `coll`.
	 * The should complete with a boolean value as its `result`.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Invoked with (err, results).
	 */
	var rejectLimit = doParallelLimit(reject$1);

	/**
	 * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
	 *
	 * @name rejectSeries
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.reject]{@link module:Collections.reject}
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {Function} iteratee - An async truth test to apply to each item in
	 * `coll`.
	 * The should complete with a boolean value as its `result`.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Invoked with (err, results).
	 */
	var rejectSeries = doLimit(rejectLimit, 1);

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant$1(value) {
	  return function() {
	    return value;
	  };
	}

	/**
	 * Attempts to get a successful response from `task` no more than `times` times
	 * before returning an error. If the task is successful, the `callback` will be
	 * passed the result of the successful task. If all attempts fail, the callback
	 * will be passed the error and result (if any) of the final attempt.
	 *
	 * @name retry
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @see [async.retryable]{@link module:ControlFlow.retryable}
	 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
	 * object with `times` and `interval` or a number.
	 * * `times` - The number of attempts to make before giving up.  The default
	 *   is `5`.
	 * * `interval` - The time to wait between retries, in milliseconds.  The
	 *   default is `0`. The interval may also be specified as a function of the
	 *   retry count (see example).
	 * * `errorFilter` - An optional synchronous function that is invoked on
	 *   erroneous result. If it returns `true` the retry attempts will continue;
	 *   if the function returns `false` the retry flow is aborted with the current
	 *   attempt's error and result being returned to the final callback.
	 *   Invoked with (err).
	 * * If `opts` is a number, the number specifies the number of times to retry,
	 *   with the default interval of `0`.
	 * @param {AsyncFunction} task - An async function to retry.
	 * Invoked with (callback).
	 * @param {Function} [callback] - An optional callback which is called when the
	 * task has succeeded, or after the final failed attempt. It receives the `err`
	 * and `result` arguments of the last attempt at completing the `task`. Invoked
	 * with (err, results).
	 *
	 * @example
	 *
	 * // The `retry` function can be used as a stand-alone control flow by passing
	 * // a callback, as shown below:
	 *
	 * // try calling apiMethod 3 times
	 * async.retry(3, apiMethod, function(err, result) {
	 *     // do something with the result
	 * });
	 *
	 * // try calling apiMethod 3 times, waiting 200 ms between each retry
	 * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
	 *     // do something with the result
	 * });
	 *
	 * // try calling apiMethod 10 times with exponential backoff
	 * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
	 * async.retry({
	 *   times: 10,
	 *   interval: function(retryCount) {
	 *     return 50 * Math.pow(2, retryCount);
	 *   }
	 * }, apiMethod, function(err, result) {
	 *     // do something with the result
	 * });
	 *
	 * // try calling apiMethod the default 5 times no delay between each retry
	 * async.retry(apiMethod, function(err, result) {
	 *     // do something with the result
	 * });
	 *
	 * // try calling apiMethod only when error condition satisfies, all other
	 * // errors will abort the retry control flow and return to final callback
	 * async.retry({
	 *   errorFilter: function(err) {
	 *     return err.message === 'Temporary error'; // only retry on a specific error
	 *   }
	 * }, apiMethod, function(err, result) {
	 *     // do something with the result
	 * });
	 *
	 * // It can also be embedded within other control flow functions to retry
	 * // individual methods that are not as reliable, like this:
	 * async.auto({
	 *     users: api.getUsers.bind(api),
	 *     payments: async.retryable(3, api.getPayments.bind(api))
	 * }, function(err, results) {
	 *     // do something with the results
	 * });
	 *
	 */
	function retry(opts, task, callback) {
	    var DEFAULT_TIMES = 5;
	    var DEFAULT_INTERVAL = 0;

	    var options = {
	        times: DEFAULT_TIMES,
	        intervalFunc: constant$1(DEFAULT_INTERVAL)
	    };

	    function parseTimes(acc, t) {
	        if (typeof t === 'object') {
	            acc.times = +t.times || DEFAULT_TIMES;

	            acc.intervalFunc = typeof t.interval === 'function' ?
	                t.interval :
	                constant$1(+t.interval || DEFAULT_INTERVAL);

	            acc.errorFilter = t.errorFilter;
	        } else if (typeof t === 'number' || typeof t === 'string') {
	            acc.times = +t || DEFAULT_TIMES;
	        } else {
	            throw new Error("Invalid arguments for async.retry");
	        }
	    }

	    if (arguments.length < 3 && typeof opts === 'function') {
	        callback = task || noop;
	        task = opts;
	    } else {
	        parseTimes(options, opts);
	        callback = callback || noop;
	    }

	    if (typeof task !== 'function') {
	        throw new Error("Invalid arguments for async.retry");
	    }

	    var _task = wrapAsync(task);

	    var attempt = 1;
	    function retryAttempt() {
	        _task(function(err) {
	            if (err && attempt++ < options.times &&
	                (typeof options.errorFilter != 'function' ||
	                    options.errorFilter(err))) {
	                setTimeout(retryAttempt, options.intervalFunc(attempt));
	            } else {
	                callback.apply(null, arguments);
	            }
	        });
	    }

	    retryAttempt();
	}

	/**
	 * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method
	 * wraps a task and makes it retryable, rather than immediately calling it
	 * with retries.
	 *
	 * @name retryable
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.retry]{@link module:ControlFlow.retry}
	 * @category Control Flow
	 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
	 * options, exactly the same as from `retry`
	 * @param {AsyncFunction} task - the asynchronous function to wrap.
	 * This function will be passed any arguments passed to the returned wrapper.
	 * Invoked with (...args, callback).
	 * @returns {AsyncFunction} The wrapped function, which when invoked, will
	 * retry on an error, based on the parameters specified in `opts`.
	 * This function will accept the same parameters as `task`.
	 * @example
	 *
	 * async.auto({
	 *     dep1: async.retryable(3, getFromFlakyService),
	 *     process: ["dep1", async.retryable(3, function (results, cb) {
	 *         maybeProcessData(results.dep1, cb);
	 *     })]
	 * }, callback);
	 */
	var retryable = function (opts, task) {
	    if (!task) {
	        task = opts;
	        opts = null;
	    }
	    var _task = wrapAsync(task);
	    return initialParams(function (args, callback) {
	        function taskFn(cb) {
	            _task.apply(null, args.concat(cb));
	        }

	        if (opts) retry(opts, taskFn, callback);
	        else retry(taskFn, callback);

	    });
	};

	/**
	 * Run the functions in the `tasks` collection in series, each one running once
	 * the previous function has completed. If any functions in the series pass an
	 * error to its callback, no more functions are run, and `callback` is
	 * immediately called with the value of the error. Otherwise, `callback`
	 * receives an array of results when `tasks` have completed.
	 *
	 * It is also possible to use an object instead of an array. Each property will
	 * be run as a function, and the results will be passed to the final `callback`
	 * as an object instead of an array. This can be a more readable way of handling
	 *  results from {@link async.series}.
	 *
	 * **Note** that while many implementations preserve the order of object
	 * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
	 * explicitly states that
	 *
	 * > The mechanics and order of enumerating the properties is not specified.
	 *
	 * So if you rely on the order in which your series of functions are executed,
	 * and want this to work on all platforms, consider using an array.
	 *
	 * @name series
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @param {Array|Iterable|Object} tasks - A collection containing
	 * [async functions]{@link AsyncFunction} to run in series.
	 * Each function can complete with any number of optional `result` values.
	 * @param {Function} [callback] - An optional callback to run once all the
	 * functions have completed. This function gets a results array (or object)
	 * containing all the result arguments passed to the `task` callbacks. Invoked
	 * with (err, result).
	 * @example
	 * async.series([
	 *     function(callback) {
	 *         // do some stuff ...
	 *         callback(null, 'one');
	 *     },
	 *     function(callback) {
	 *         // do some more stuff ...
	 *         callback(null, 'two');
	 *     }
	 * ],
	 * // optional callback
	 * function(err, results) {
	 *     // results is now equal to ['one', 'two']
	 * });
	 *
	 * async.series({
	 *     one: function(callback) {
	 *         setTimeout(function() {
	 *             callback(null, 1);
	 *         }, 200);
	 *     },
	 *     two: function(callback){
	 *         setTimeout(function() {
	 *             callback(null, 2);
	 *         }, 100);
	 *     }
	 * }, function(err, results) {
	 *     // results is now equal to: {one: 1, two: 2}
	 * });
	 */
	function series(tasks, callback) {
	    _parallel(eachOfSeries, tasks, callback);
	}

	/**
	 * Returns `true` if at least one element in the `coll` satisfies an async test.
	 * If any iteratee call returns `true`, the main `callback` is immediately
	 * called.
	 *
	 * @name some
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @alias any
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
	 * in the collections in parallel.
	 * The iteratee should complete with a boolean `result` value.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called as soon as any
	 * iteratee returns `true`, or after all the iteratee functions have finished.
	 * Result will be either `true` or `false` depending on the values of the async
	 * tests. Invoked with (err, result).
	 * @example
	 *
	 * async.some(['file1','file2','file3'], function(filePath, callback) {
	 *     fs.access(filePath, function(err) {
	 *         callback(null, !err)
	 *     });
	 * }, function(err, result) {
	 *     // if result is true then at least one of the files exists
	 * });
	 */
	var some = doParallel(_createTester(Boolean, identity));

	/**
	 * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
	 *
	 * @name someLimit
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.some]{@link module:Collections.some}
	 * @alias anyLimit
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
	 * in the collections in parallel.
	 * The iteratee should complete with a boolean `result` value.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called as soon as any
	 * iteratee returns `true`, or after all the iteratee functions have finished.
	 * Result will be either `true` or `false` depending on the values of the async
	 * tests. Invoked with (err, result).
	 */
	var someLimit = doParallelLimit(_createTester(Boolean, identity));

	/**
	 * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
	 *
	 * @name someSeries
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @see [async.some]{@link module:Collections.some}
	 * @alias anySeries
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - An async truth test to apply to each item
	 * in the collections in series.
	 * The iteratee should complete with a boolean `result` value.
	 * Invoked with (item, callback).
	 * @param {Function} [callback] - A callback which is called as soon as any
	 * iteratee returns `true`, or after all the iteratee functions have finished.
	 * Result will be either `true` or `false` depending on the values of the async
	 * tests. Invoked with (err, result).
	 */
	var someSeries = doLimit(someLimit, 1);

	/**
	 * Sorts a list by the results of running each `coll` value through an async
	 * `iteratee`.
	 *
	 * @name sortBy
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {AsyncFunction} iteratee - An async function to apply to each item in
	 * `coll`.
	 * The iteratee should complete with a value to use as the sort criteria as
	 * its `result`.
	 * Invoked with (item, callback).
	 * @param {Function} callback - A callback which is called after all the
	 * `iteratee` functions have finished, or an error occurs. Results is the items
	 * from the original `coll` sorted by the values returned by the `iteratee`
	 * calls. Invoked with (err, results).
	 * @example
	 *
	 * async.sortBy(['file1','file2','file3'], function(file, callback) {
	 *     fs.stat(file, function(err, stats) {
	 *         callback(err, stats.mtime);
	 *     });
	 * }, function(err, results) {
	 *     // results is now the original array of files sorted by
	 *     // modified date
	 * });
	 *
	 * // By modifying the callback parameter the
	 * // sorting order can be influenced:
	 *
	 * // ascending order
	 * async.sortBy([1,9,3,5], function(x, callback) {
	 *     callback(null, x);
	 * }, function(err,result) {
	 *     // result callback
	 * });
	 *
	 * // descending order
	 * async.sortBy([1,9,3,5], function(x, callback) {
	 *     callback(null, x*-1);    //<- x*-1 instead of x, turns the order around
	 * }, function(err,result) {
	 *     // result callback
	 * });
	 */
	function sortBy (coll, iteratee, callback) {
	    var _iteratee = wrapAsync(iteratee);
	    map(coll, function (x, callback) {
	        _iteratee(x, function (err, criteria) {
	            if (err) return callback(err);
	            callback(null, {value: x, criteria: criteria});
	        });
	    }, function (err, results) {
	        if (err) return callback(err);
	        callback(null, arrayMap(results.sort(comparator), baseProperty('value')));
	    });

	    function comparator(left, right) {
	        var a = left.criteria, b = right.criteria;
	        return a < b ? -1 : a > b ? 1 : 0;
	    }
	}

	/**
	 * Sets a time limit on an asynchronous function. If the function does not call
	 * its callback within the specified milliseconds, it will be called with a
	 * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
	 *
	 * @name timeout
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @category Util
	 * @param {AsyncFunction} asyncFn - The async function to limit in time.
	 * @param {number} milliseconds - The specified time limit.
	 * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
	 * to timeout Error for more information..
	 * @returns {AsyncFunction} Returns a wrapped function that can be used with any
	 * of the control flow functions.
	 * Invoke this function with the same parameters as you would `asyncFunc`.
	 * @example
	 *
	 * function myFunction(foo, callback) {
	 *     doAsyncTask(foo, function(err, data) {
	 *         // handle errors
	 *         if (err) return callback(err);
	 *
	 *         // do some stuff ...
	 *
	 *         // return processed data
	 *         return callback(null, data);
	 *     });
	 * }
	 *
	 * var wrapped = async.timeout(myFunction, 1000);
	 *
	 * // call `wrapped` as you would `myFunction`
	 * wrapped({ bar: 'bar' }, function(err, data) {
	 *     // if `myFunction` takes < 1000 ms to execute, `err`
	 *     // and `data` will have their expected values
	 *
	 *     // else `err` will be an Error with the code 'ETIMEDOUT'
	 * });
	 */
	function timeout(asyncFn, milliseconds, info) {
	    var fn = wrapAsync(asyncFn);

	    return initialParams(function (args, callback) {
	        var timedOut = false;
	        var timer;

	        function timeoutCallback() {
	            var name = asyncFn.name || 'anonymous';
	            var error  = new Error('Callback function "' + name + '" timed out.');
	            error.code = 'ETIMEDOUT';
	            if (info) {
	                error.info = info;
	            }
	            timedOut = true;
	            callback(error);
	        }

	        args.push(function () {
	            if (!timedOut) {
	                callback.apply(null, arguments);
	                clearTimeout(timer);
	            }
	        });

	        // setup timer and call original function
	        timer = setTimeout(timeoutCallback, milliseconds);
	        fn.apply(null, args);
	    });
	}

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeCeil = Math.ceil;
	var nativeMax = Math.max;

	/**
	 * The base implementation of `_.range` and `_.rangeRight` which doesn't
	 * coerce arguments.
	 *
	 * @private
	 * @param {number} start The start of the range.
	 * @param {number} end The end of the range.
	 * @param {number} step The value to increment or decrement by.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Array} Returns the range of numbers.
	 */
	function baseRange(start, end, step, fromRight) {
	  var index = -1,
	      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
	      result = Array(length);

	  while (length--) {
	    result[fromRight ? length : ++index] = start;
	    start += step;
	  }
	  return result;
	}

	/**
	 * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
	 * time.
	 *
	 * @name timesLimit
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.times]{@link module:ControlFlow.times}
	 * @category Control Flow
	 * @param {number} count - The number of times to run the function.
	 * @param {number} limit - The maximum number of async operations at a time.
	 * @param {AsyncFunction} iteratee - The async function to call `n` times.
	 * Invoked with the iteration index and a callback: (n, next).
	 * @param {Function} callback - see [async.map]{@link module:Collections.map}.
	 */
	function timeLimit(count, limit, iteratee, callback) {
	    var _iteratee = wrapAsync(iteratee);
	    mapLimit(baseRange(0, count, 1), limit, _iteratee, callback);
	}

	/**
	 * Calls the `iteratee` function `n` times, and accumulates results in the same
	 * manner you would use with [map]{@link module:Collections.map}.
	 *
	 * @name times
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.map]{@link module:Collections.map}
	 * @category Control Flow
	 * @param {number} n - The number of times to run the function.
	 * @param {AsyncFunction} iteratee - The async function to call `n` times.
	 * Invoked with the iteration index and a callback: (n, next).
	 * @param {Function} callback - see {@link module:Collections.map}.
	 * @example
	 *
	 * // Pretend this is some complicated async factory
	 * var createUser = function(id, callback) {
	 *     callback(null, {
	 *         id: 'user' + id
	 *     });
	 * };
	 *
	 * // generate 5 users
	 * async.times(5, function(n, next) {
	 *     createUser(n, function(err, user) {
	 *         next(err, user);
	 *     });
	 * }, function(err, users) {
	 *     // we should now have 5 users
	 * });
	 */
	var times = doLimit(timeLimit, Infinity);

	/**
	 * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
	 *
	 * @name timesSeries
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.times]{@link module:ControlFlow.times}
	 * @category Control Flow
	 * @param {number} n - The number of times to run the function.
	 * @param {AsyncFunction} iteratee - The async function to call `n` times.
	 * Invoked with the iteration index and a callback: (n, next).
	 * @param {Function} callback - see {@link module:Collections.map}.
	 */
	var timesSeries = doLimit(timeLimit, 1);

	/**
	 * A relative of `reduce`.  Takes an Object or Array, and iterates over each
	 * element in series, each step potentially mutating an `accumulator` value.
	 * The type of the accumulator defaults to the type of collection passed in.
	 *
	 * @name transform
	 * @static
	 * @memberOf module:Collections
	 * @method
	 * @category Collection
	 * @param {Array|Iterable|Object} coll - A collection to iterate over.
	 * @param {*} [accumulator] - The initial state of the transform.  If omitted,
	 * it will default to an empty Object or Array, depending on the type of `coll`
	 * @param {AsyncFunction} iteratee - A function applied to each item in the
	 * collection that potentially modifies the accumulator.
	 * Invoked with (accumulator, item, key, callback).
	 * @param {Function} [callback] - A callback which is called after all the
	 * `iteratee` functions have finished. Result is the transformed accumulator.
	 * Invoked with (err, result).
	 * @example
	 *
	 * async.transform([1,2,3], function(acc, item, index, callback) {
	 *     // pointless async:
	 *     process.nextTick(function() {
	 *         acc.push(item * 2)
	 *         callback(null)
	 *     });
	 * }, function(err, result) {
	 *     // result is now equal to [2, 4, 6]
	 * });
	 *
	 * @example
	 *
	 * async.transform({a: 1, b: 2, c: 3}, function (obj, val, key, callback) {
	 *     setImmediate(function () {
	 *         obj[key] = val * 2;
	 *         callback();
	 *     })
	 * }, function (err, result) {
	 *     // result is equal to {a: 2, b: 4, c: 6}
	 * })
	 */
	function transform (coll, accumulator, iteratee, callback) {
	    if (arguments.length <= 3) {
	        callback = iteratee;
	        iteratee = accumulator;
	        accumulator = isArray(coll) ? [] : {};
	    }
	    callback = once(callback || noop);
	    var _iteratee = wrapAsync(iteratee);

	    eachOf(coll, function(v, k, cb) {
	        _iteratee(accumulator, v, k, cb);
	    }, function(err) {
	        callback(err, accumulator);
	    });
	}

	/**
	 * It runs each task in series but stops whenever any of the functions were
	 * successful. If one of the tasks were successful, the `callback` will be
	 * passed the result of the successful task. If all tasks fail, the callback
	 * will be passed the error and result (if any) of the final attempt.
	 *
	 * @name tryEach
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @param {Array|Iterable|Object} tasks - A collection containing functions to
	 * run, each function is passed a `callback(err, result)` it must call on
	 * completion with an error `err` (which can be `null`) and an optional `result`
	 * value.
	 * @param {Function} [callback] - An optional callback which is called when one
	 * of the tasks has succeeded, or all have failed. It receives the `err` and
	 * `result` arguments of the last attempt at completing the `task`. Invoked with
	 * (err, results).
	 * @example
	 * async.try([
	 *     function getDataFromFirstWebsite(callback) {
	 *         // Try getting the data from the first website
	 *         callback(err, data);
	 *     },
	 *     function getDataFromSecondWebsite(callback) {
	 *         // First website failed,
	 *         // Try getting the data from the backup website
	 *         callback(err, data);
	 *     }
	 * ],
	 * // optional callback
	 * function(err, results) {
	 *     Now do something with the data.
	 * });
	 *
	 */
	function tryEach(tasks, callback) {
	    var error = null;
	    var result;
	    callback = callback || noop;
	    eachSeries(tasks, function(task, callback) {
	        wrapAsync(task)(function (err, res/*, ...args*/) {
	            if (arguments.length > 2) {
	                result = slice(arguments, 1);
	            } else {
	                result = res;
	            }
	            error = err;
	            callback(!err);
	        });
	    }, function () {
	        callback(error, result);
	    });
	}

	/**
	 * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
	 * unmemoized form. Handy for testing.
	 *
	 * @name unmemoize
	 * @static
	 * @memberOf module:Utils
	 * @method
	 * @see [async.memoize]{@link module:Utils.memoize}
	 * @category Util
	 * @param {AsyncFunction} fn - the memoized function
	 * @returns {AsyncFunction} a function that calls the original unmemoized function
	 */
	function unmemoize(fn) {
	    return function () {
	        return (fn.unmemoized || fn).apply(null, arguments);
	    };
	}

	/**
	 * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
	 * stopped, or an error occurs.
	 *
	 * @name whilst
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @param {Function} test - synchronous truth test to perform before each
	 * execution of `iteratee`. Invoked with ().
	 * @param {AsyncFunction} iteratee - An async function which is called each time
	 * `test` passes. Invoked with (callback).
	 * @param {Function} [callback] - A callback which is called after the test
	 * function has failed and repeated execution of `iteratee` has stopped. `callback`
	 * will be passed an error and any arguments passed to the final `iteratee`'s
	 * callback. Invoked with (err, [results]);
	 * @returns undefined
	 * @example
	 *
	 * var count = 0;
	 * async.whilst(
	 *     function() { return count < 5; },
	 *     function(callback) {
	 *         count++;
	 *         setTimeout(function() {
	 *             callback(null, count);
	 *         }, 1000);
	 *     },
	 *     function (err, n) {
	 *         // 5 seconds have passed, n = 5
	 *     }
	 * );
	 */
	function whilst(test, iteratee, callback) {
	    callback = onlyOnce(callback || noop);
	    var _iteratee = wrapAsync(iteratee);
	    if (!test()) return callback(null);
	    var next = function(err/*, ...args*/) {
	        if (err) return callback(err);
	        if (test()) return _iteratee(next);
	        var args = slice(arguments, 1);
	        callback.apply(null, [null].concat(args));
	    };
	    _iteratee(next);
	}

	/**
	 * Repeatedly call `iteratee` until `test` returns `true`. Calls `callback` when
	 * stopped, or an error occurs. `callback` will be passed an error and any
	 * arguments passed to the final `iteratee`'s callback.
	 *
	 * The inverse of [whilst]{@link module:ControlFlow.whilst}.
	 *
	 * @name until
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @see [async.whilst]{@link module:ControlFlow.whilst}
	 * @category Control Flow
	 * @param {Function} test - synchronous truth test to perform before each
	 * execution of `iteratee`. Invoked with ().
	 * @param {AsyncFunction} iteratee - An async function which is called each time
	 * `test` fails. Invoked with (callback).
	 * @param {Function} [callback] - A callback which is called after the test
	 * function has passed and repeated execution of `iteratee` has stopped. `callback`
	 * will be passed an error and any arguments passed to the final `iteratee`'s
	 * callback. Invoked with (err, [results]);
	 */
	function until(test, iteratee, callback) {
	    whilst(function() {
	        return !test.apply(this, arguments);
	    }, iteratee, callback);
	}

	/**
	 * Runs the `tasks` array of functions in series, each passing their results to
	 * the next in the array. However, if any of the `tasks` pass an error to their
	 * own callback, the next function is not executed, and the main `callback` is
	 * immediately called with the error.
	 *
	 * @name waterfall
	 * @static
	 * @memberOf module:ControlFlow
	 * @method
	 * @category Control Flow
	 * @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
	 * to run.
	 * Each function should complete with any number of `result` values.
	 * The `result` values will be passed as arguments, in order, to the next task.
	 * @param {Function} [callback] - An optional callback to run once all the
	 * functions have completed. This will be passed the results of the last task's
	 * callback. Invoked with (err, [results]).
	 * @returns undefined
	 * @example
	 *
	 * async.waterfall([
	 *     function(callback) {
	 *         callback(null, 'one', 'two');
	 *     },
	 *     function(arg1, arg2, callback) {
	 *         // arg1 now equals 'one' and arg2 now equals 'two'
	 *         callback(null, 'three');
	 *     },
	 *     function(arg1, callback) {
	 *         // arg1 now equals 'three'
	 *         callback(null, 'done');
	 *     }
	 * ], function (err, result) {
	 *     // result now equals 'done'
	 * });
	 *
	 * // Or, with named functions:
	 * async.waterfall([
	 *     myFirstFunction,
	 *     mySecondFunction,
	 *     myLastFunction,
	 * ], function (err, result) {
	 *     // result now equals 'done'
	 * });
	 * function myFirstFunction(callback) {
	 *     callback(null, 'one', 'two');
	 * }
	 * function mySecondFunction(arg1, arg2, callback) {
	 *     // arg1 now equals 'one' and arg2 now equals 'two'
	 *     callback(null, 'three');
	 * }
	 * function myLastFunction(arg1, callback) {
	 *     // arg1 now equals 'three'
	 *     callback(null, 'done');
	 * }
	 */
	var waterfall = function(tasks, callback) {
	    callback = once(callback || noop);
	    if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
	    if (!tasks.length) return callback();
	    var taskIndex = 0;

	    function nextTask(args) {
	        var task = wrapAsync(tasks[taskIndex++]);
	        args.push(onlyOnce(next));
	        task.apply(null, args);
	    }

	    function next(err/*, ...args*/) {
	        if (err || taskIndex === tasks.length) {
	            return callback.apply(null, arguments);
	        }
	        nextTask(slice(arguments, 1));
	    }

	    nextTask([]);
	};

	/**
	 * An "async function" in the context of Async is an asynchronous function with
	 * a variable number of parameters, with the final parameter being a callback.
	 * (`function (arg1, arg2, ..., callback) {}`)
	 * The final callback is of the form `callback(err, results...)`, which must be
	 * called once the function is completed.  The callback should be called with a
	 * Error as its first argument to signal that an error occurred.
	 * Otherwise, if no error occurred, it should be called with `null` as the first
	 * argument, and any additional `result` arguments that may apply, to signal
	 * successful completion.
	 * The callback must be called exactly once, ideally on a later tick of the
	 * JavaScript event loop.
	 *
	 * This type of function is also referred to as a "Node-style async function",
	 * or a "continuation passing-style function" (CPS). Most of the methods of this
	 * library are themselves CPS/Node-style async functions, or functions that
	 * return CPS/Node-style async functions.
	 *
	 * Wherever we accept a Node-style async function, we also directly accept an
	 * [ES2017 `async` function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}.
	 * In this case, the `async` function will not be passed a final callback
	 * argument, and any thrown error will be used as the `err` argument of the
	 * implicit callback, and the return value will be used as the `result` value.
	 * (i.e. a `rejected` of the returned Promise becomes the `err` callback
	 * argument, and a `resolved` value becomes the `result`.)
	 *
	 * Note, due to JavaScript limitations, we can only detect native `async`
	 * functions and not transpilied implementations.
	 * Your environment must have `async`/`await` support for this to work.
	 * (e.g. Node > v7.6, or a recent version of a modern browser).
	 * If you are using `async` functions through a transpiler (e.g. Babel), you
	 * must still wrap the function with [asyncify]{@link module:Utils.asyncify},
	 * because the `async function` will be compiled to an ordinary function that
	 * returns a promise.
	 *
	 * @typedef {Function} AsyncFunction
	 * @static
	 */

	/**
	 * Async is a utility module which provides straight-forward, powerful functions
	 * for working with asynchronous JavaScript. Although originally designed for
	 * use with [Node.js](http://nodejs.org) and installable via
	 * `npm install --save async`, it can also be used directly in the browser.
	 * @module async
	 * @see AsyncFunction
	 */


	/**
	 * A collection of `async` functions for manipulating collections, such as
	 * arrays and objects.
	 * @module Collections
	 */

	/**
	 * A collection of `async` functions for controlling the flow through a script.
	 * @module ControlFlow
	 */

	/**
	 * A collection of `async` utility functions.
	 * @module Utils
	 */

	var index = {
	    applyEach: applyEach,
	    applyEachSeries: applyEachSeries,
	    apply: apply,
	    asyncify: asyncify,
	    auto: auto,
	    autoInject: autoInject,
	    cargo: cargo,
	    compose: compose,
	    concat: concat,
	    concatLimit: concatLimit,
	    concatSeries: concatSeries,
	    constant: constant,
	    detect: detect,
	    detectLimit: detectLimit,
	    detectSeries: detectSeries,
	    dir: dir,
	    doDuring: doDuring,
	    doUntil: doUntil,
	    doWhilst: doWhilst,
	    during: during,
	    each: eachLimit,
	    eachLimit: eachLimit$1,
	    eachOf: eachOf,
	    eachOfLimit: eachOfLimit,
	    eachOfSeries: eachOfSeries,
	    eachSeries: eachSeries,
	    ensureAsync: ensureAsync,
	    every: every,
	    everyLimit: everyLimit,
	    everySeries: everySeries,
	    filter: filter,
	    filterLimit: filterLimit,
	    filterSeries: filterSeries,
	    forever: forever,
	    groupBy: groupBy,
	    groupByLimit: groupByLimit,
	    groupBySeries: groupBySeries,
	    log: log,
	    map: map,
	    mapLimit: mapLimit,
	    mapSeries: mapSeries,
	    mapValues: mapValues,
	    mapValuesLimit: mapValuesLimit,
	    mapValuesSeries: mapValuesSeries,
	    memoize: memoize,
	    nextTick: nextTick,
	    parallel: parallelLimit,
	    parallelLimit: parallelLimit$1,
	    priorityQueue: priorityQueue,
	    queue: queue$1,
	    race: race,
	    reduce: reduce,
	    reduceRight: reduceRight,
	    reflect: reflect,
	    reflectAll: reflectAll,
	    reject: reject,
	    rejectLimit: rejectLimit,
	    rejectSeries: rejectSeries,
	    retry: retry,
	    retryable: retryable,
	    seq: seq,
	    series: series,
	    setImmediate: setImmediate$1,
	    some: some,
	    someLimit: someLimit,
	    someSeries: someSeries,
	    sortBy: sortBy,
	    timeout: timeout,
	    times: times,
	    timesLimit: timeLimit,
	    timesSeries: timesSeries,
	    transform: transform,
	    tryEach: tryEach,
	    unmemoize: unmemoize,
	    until: until,
	    waterfall: waterfall,
	    whilst: whilst,

	    // aliases
	    all: every,
	    any: some,
	    forEach: eachLimit,
	    forEachSeries: eachSeries,
	    forEachLimit: eachLimit$1,
	    forEachOf: eachOf,
	    forEachOfSeries: eachOfSeries,
	    forEachOfLimit: eachOfLimit,
	    inject: reduce,
	    foldl: reduce,
	    foldr: reduceRight,
	    select: filter,
	    selectLimit: filterLimit,
	    selectSeries: filterSeries,
	    wrapSync: asyncify
	};

	exports['default'] = index;
	exports.applyEach = applyEach;
	exports.applyEachSeries = applyEachSeries;
	exports.apply = apply;
	exports.asyncify = asyncify;
	exports.auto = auto;
	exports.autoInject = autoInject;
	exports.cargo = cargo;
	exports.compose = compose;
	exports.concat = concat;
	exports.concatLimit = concatLimit;
	exports.concatSeries = concatSeries;
	exports.constant = constant;
	exports.detect = detect;
	exports.detectLimit = detectLimit;
	exports.detectSeries = detectSeries;
	exports.dir = dir;
	exports.doDuring = doDuring;
	exports.doUntil = doUntil;
	exports.doWhilst = doWhilst;
	exports.during = during;
	exports.each = eachLimit;
	exports.eachLimit = eachLimit$1;
	exports.eachOf = eachOf;
	exports.eachOfLimit = eachOfLimit;
	exports.eachOfSeries = eachOfSeries;
	exports.eachSeries = eachSeries;
	exports.ensureAsync = ensureAsync;
	exports.every = every;
	exports.everyLimit = everyLimit;
	exports.everySeries = everySeries;
	exports.filter = filter;
	exports.filterLimit = filterLimit;
	exports.filterSeries = filterSeries;
	exports.forever = forever;
	exports.groupBy = groupBy;
	exports.groupByLimit = groupByLimit;
	exports.groupBySeries = groupBySeries;
	exports.log = log;
	exports.map = map;
	exports.mapLimit = mapLimit;
	exports.mapSeries = mapSeries;
	exports.mapValues = mapValues;
	exports.mapValuesLimit = mapValuesLimit;
	exports.mapValuesSeries = mapValuesSeries;
	exports.memoize = memoize;
	exports.nextTick = nextTick;
	exports.parallel = parallelLimit;
	exports.parallelLimit = parallelLimit$1;
	exports.priorityQueue = priorityQueue;
	exports.queue = queue$1;
	exports.race = race;
	exports.reduce = reduce;
	exports.reduceRight = reduceRight;
	exports.reflect = reflect;
	exports.reflectAll = reflectAll;
	exports.reject = reject;
	exports.rejectLimit = rejectLimit;
	exports.rejectSeries = rejectSeries;
	exports.retry = retry;
	exports.retryable = retryable;
	exports.seq = seq;
	exports.series = series;
	exports.setImmediate = setImmediate$1;
	exports.some = some;
	exports.someLimit = someLimit;
	exports.someSeries = someSeries;
	exports.sortBy = sortBy;
	exports.timeout = timeout;
	exports.times = times;
	exports.timesLimit = timeLimit;
	exports.timesSeries = timesSeries;
	exports.transform = transform;
	exports.tryEach = tryEach;
	exports.unmemoize = unmemoize;
	exports.until = until;
	exports.waterfall = waterfall;
	exports.whilst = whilst;
	exports.all = every;
	exports.allLimit = everyLimit;
	exports.allSeries = everySeries;
	exports.any = some;
	exports.anyLimit = someLimit;
	exports.anySeries = someSeries;
	exports.find = detect;
	exports.findLimit = detectLimit;
	exports.findSeries = detectSeries;
	exports.forEach = eachLimit;
	exports.forEachSeries = eachSeries;
	exports.forEachLimit = eachLimit$1;
	exports.forEachOf = eachOf;
	exports.forEachOfSeries = eachOfSeries;
	exports.forEachOfLimit = eachOfLimit;
	exports.inject = reduce;
	exports.foldl = reduce;
	exports.foldr = reduceRight;
	exports.select = filter;
	exports.selectLimit = filterLimit;
	exports.selectSeries = filterSeries;
	exports.wrapSync = asyncify;

	Object.defineProperty(exports, '__esModule', { value: true });

	})));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27).setImmediate, __webpack_require__(6), (function() { return this; }()), __webpack_require__(21)(module)))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(6).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27).setImmediate, __webpack_require__(27).clearImmediate))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(29);

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @projectName fast-csv
	 * @github https://github.com/C2FO/fast-csv
	 * @includeDoc [Change Log] ../History.md
	 * @header [../README.md]
	 */

	var fs = __webpack_require__(12),
	    parser = __webpack_require__(30),
	    formatter = __webpack_require__(68);

	function csv() {
	    return parser.apply(void 0, arguments);
	}

	csv.parse = csv;
	csv.fromString = parser.fromString;
	csv.fromPath = parser.fromPath;
	csv.fromStream = parser.fromStream;
	csv.format = formatter;
	csv.write = formatter.write;
	csv.writeToStream = formatter.writeToStream;
	csv.writeToString = formatter.writeToString;
	csv.writeToBuffer = formatter.writeToBuffer;
	csv.writeToPath = formatter.writeToPath;
	csv.createWriteStream = formatter.createWriteStream;
	csv.createReadStream = formatter.createWriteStream;

	module.exports = csv;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var extended = __webpack_require__(31),
	    out = process.stdout,
	    stream = __webpack_require__(44),
	    fs = __webpack_require__(12),
	    ParserStream = __webpack_require__(61);


	function parse(options) {
	    return new ParserStream(options);
	}

	function fromStream(stream, options) {
	    return stream.pipe(new ParserStream(options));
	}

	function fromPath(location, options) {
	    return fs.createReadStream(location).pipe(new ParserStream(options));
	}

	function fromString(string, options) {
	    var rs = new stream.Readable();
	    rs.push(string);
	    rs.push(null);
	    return rs.pipe(new ParserStream(options));
	}

	parse.fromStream = fromStream;
	parse.fromPath = fromPath;
	parse.fromString = fromString;
	module.exports = parse;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {var is = __webpack_require__(32),
	    hasOwn = Object.prototype.hasOwnProperty;
	module.exports = __webpack_require__(33)()
	    .register(is)
	    .register(__webpack_require__(38))
	    .register(__webpack_require__(41))
	    .register("LINE_BREAK", __webpack_require__(43).EOL)
	    .register("asyncEach", function (arr, iter, cb) {


	        (function asyncIterator(i, l, rows, cb) {
	            if (++i < l) {
	                iter(rows[i], function (err) {
	                    if (err) {
	                        cb(err);
	                    } else {
	                        if ((i % 100) === 0) {
	                            //dont overflow the stack
	                            setImmediate(function () {
	                                asyncIterator(i, l, rows, cb);
	                            });
	                        } else {
	                            asyncIterator(i, l, rows, cb);
	                        }
	                    }
	                });
	            } else {
	                //get out of stack
	                cb(null, arr);
	            }
	        }(-1, arr.length, arr, cb));
	    })
	    .register("spreadArgs", function spreadArgs(f, args, scope) {
	        var ret;
	        switch ((args || []).length) {
	            case 0:
	                ret = f.call(scope);
	                break;
	            case 1:
	                ret = f.call(scope, args[0]);
	                break;
	            case 2:
	                ret = f.call(scope, args[0], args[1]);
	                break;
	            case 3:
	                ret = f.call(scope, args[0], args[1], args[2]);
	                break;
	            default:
	                ret = f.apply(scope, args);
	        }
	        return ret;
	    })
	    .register("keys", function (obj) {
	        var ret = [];
	        for (var i in obj) {
	            if (hasOwn.call(obj, i)) {
	                ret.push(i);
	            }
	        }
	        return ret;
	    });
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27).setImmediate))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {(function () {
	    "use strict";

	    function defineIsa(extended) {

	        var pSlice = Array.prototype.slice;

	        var hasOwn = Object.prototype.hasOwnProperty;
	        var toStr = Object.prototype.toString;

	        function argsToArray(args, slice) {
	            var i = -1, j = 0, l = args.length, ret = [];
	            slice = slice || 0;
	            i += slice;
	            while (++i < l) {
	                ret[j++] = args[i];
	            }
	            return ret;
	        }

	        function keys(obj) {
	            var ret = [];
	            for (var i in obj) {
	                if (hasOwn.call(obj, i)) {
	                    ret.push(i);
	                }
	            }
	            return ret;
	        }

	        //taken from node js assert.js
	        //https://github.com/joyent/node/blob/master/lib/assert.js
	        function deepEqual(actual, expected) {
	            // 7.1. All identical values are equivalent, as determined by ===.
	            if (actual === expected) {
	                return true;

	            } else if (typeof Buffer !== "undefined" && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
	                if (actual.length !== expected.length) {
	                    return false;
	                }
	                for (var i = 0; i < actual.length; i++) {
	                    if (actual[i] !== expected[i]) {
	                        return false;
	                    }
	                }
	                return true;

	                // 7.2. If the expected value is a Date object, the actual value is
	                // equivalent if it is also a Date object that refers to the same time.
	            } else if (isDate(actual) && isDate(expected)) {
	                return actual.getTime() === expected.getTime();

	                // 7.3 If the expected value is a RegExp object, the actual value is
	                // equivalent if it is also a RegExp object with the same source and
	                // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	            } else if (isRegExp(actual) && isRegExp(expected)) {
	                return actual.source === expected.source &&
	                    actual.global === expected.global &&
	                    actual.multiline === expected.multiline &&
	                    actual.lastIndex === expected.lastIndex &&
	                    actual.ignoreCase === expected.ignoreCase;

	                // 7.4. Other pairs that do not both pass typeof value == 'object',
	                // equivalence is determined by ==.
	            } else if (isString(actual) && isString(expected) && actual !== expected) {
	                return false;
	            } else if (typeof actual !== 'object' && typeof expected !== 'object') {
	                return actual === expected;

	                // 7.5 For all other Object pairs, including Array objects, equivalence is
	                // determined by having the same number of owned properties (as verified
	                // with Object.prototype.hasOwnProperty.call), the same set of keys
	                // (although not necessarily the same order), equivalent values for every
	                // corresponding key, and an identical 'prototype' property. Note: this
	                // accounts for both named and indexed properties on Arrays.
	            } else {
	                return objEquiv(actual, expected);
	            }
	        }


	        function objEquiv(a, b) {
	            var key;
	            if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) {
	                return false;
	            }
	            // an identical 'prototype' property.
	            if (a.prototype !== b.prototype) {
	                return false;
	            }
	            //~~~I've managed to break Object.keys through screwy arguments passing.
	            //   Converting to array solves the problem.
	            if (isArguments(a)) {
	                if (!isArguments(b)) {
	                    return false;
	                }
	                a = pSlice.call(a);
	                b = pSlice.call(b);
	                return deepEqual(a, b);
	            }
	            try {
	                var ka = keys(a),
	                    kb = keys(b),
	                    i;
	                // having the same number of owned properties (keys incorporates
	                // hasOwnProperty)
	                if (ka.length !== kb.length) {
	                    return false;
	                }
	                //the same set of keys (although not necessarily the same order),
	                ka.sort();
	                kb.sort();
	                //~~~cheap key test
	                for (i = ka.length - 1; i >= 0; i--) {
	                    if (ka[i] !== kb[i]) {
	                        return false;
	                    }
	                }
	                //equivalent values for every corresponding key, and
	                //~~~possibly expensive deep test
	                for (i = ka.length - 1; i >= 0; i--) {
	                    key = ka[i];
	                    if (!deepEqual(a[key], b[key])) {
	                        return false;
	                    }
	                }
	            } catch (e) {//happens when one is a string literal and the other isn't
	                return false;
	            }
	            return true;
	        }


	        var isFunction = function (obj) {
	            return toStr.call(obj) === '[object Function]';
	        };

	        //ie hack
	        if ("undefined" !== typeof window && !isFunction(window.alert)) {
	            (function (alert) {
	                isFunction = function (obj) {
	                    return toStr.call(obj) === '[object Function]' || obj === alert;
	                };
	            }(window.alert));
	        }

	        function isObject(obj) {
	            var undef;
	            return obj !== null && typeof obj === "object";
	        }

	        function isHash(obj) {
	            var ret = isObject(obj);
	            return ret && obj.constructor === Object && !obj.nodeType && !obj.setInterval;
	        }

	        function isEmpty(object) {
	            if (isArguments(object)) {
	                return object.length === 0;
	            } else if (isObject(object)) {
	                return keys(object).length === 0;
	            } else if (isString(object) || isArray(object)) {
	                return object.length === 0;
	            }
	            return true;
	        }

	        function isBoolean(obj) {
	            return obj === true || obj === false || toStr.call(obj) === "[object Boolean]";
	        }

	        function isUndefined(obj) {
	            return typeof obj === 'undefined';
	        }

	        function isDefined(obj) {
	            return !isUndefined(obj);
	        }

	        function isUndefinedOrNull(obj) {
	            return isUndefined(obj) || isNull(obj);
	        }

	        function isNull(obj) {
	            return obj === null;
	        }


	        var isArguments = function _isArguments(object) {
	            return toStr.call(object) === '[object Arguments]';
	        };

	        if (!isArguments(arguments)) {
	            isArguments = function _isArguments(obj) {
	                return !!(obj && hasOwn.call(obj, "callee"));
	            };
	        }


	        function isInstanceOf(obj, clazz) {
	            if (isFunction(clazz)) {
	                return obj instanceof clazz;
	            } else {
	                return false;
	            }
	        }

	        function isRegExp(obj) {
	            return toStr.call(obj) === '[object RegExp]';
	        }

	        var isArray = Array.isArray || function isArray(obj) {
	            return toStr.call(obj) === "[object Array]";
	        };

	        function isDate(obj) {
	            return toStr.call(obj) === '[object Date]';
	        }

	        function isString(obj) {
	            return toStr.call(obj) === '[object String]';
	        }

	        function isNumber(obj) {
	            return toStr.call(obj) === '[object Number]';
	        }

	        function isTrue(obj) {
	            return obj === true;
	        }

	        function isFalse(obj) {
	            return obj === false;
	        }

	        function isNotNull(obj) {
	            return !isNull(obj);
	        }

	        function isEq(obj, obj2) {
	            /*jshint eqeqeq:false*/
	            return obj == obj2;
	        }

	        function isNeq(obj, obj2) {
	            /*jshint eqeqeq:false*/
	            return obj != obj2;
	        }

	        function isSeq(obj, obj2) {
	            return obj === obj2;
	        }

	        function isSneq(obj, obj2) {
	            return obj !== obj2;
	        }

	        function isIn(obj, arr) {
	            if ((isArray(arr) && Array.prototype.indexOf) || isString(arr)) {
	                return arr.indexOf(obj) > -1;
	            } else if (isArray(arr)) {
	                for (var i = 0, l = arr.length; i < l; i++) {
	                    if (isEq(obj, arr[i])) {
	                        return true;
	                    }
	                }
	            }
	            return false;
	        }

	        function isNotIn(obj, arr) {
	            return !isIn(obj, arr);
	        }

	        function isLt(obj, obj2) {
	            return obj < obj2;
	        }

	        function isLte(obj, obj2) {
	            return obj <= obj2;
	        }

	        function isGt(obj, obj2) {
	            return obj > obj2;
	        }

	        function isGte(obj, obj2) {
	            return obj >= obj2;
	        }

	        function isLike(obj, reg) {
	            if (isString(reg)) {
	                return ("" + obj).match(reg) !== null;
	            } else if (isRegExp(reg)) {
	                return reg.test(obj);
	            }
	            return false;
	        }

	        function isNotLike(obj, reg) {
	            return !isLike(obj, reg);
	        }

	        function contains(arr, obj) {
	            return isIn(obj, arr);
	        }

	        function notContains(arr, obj) {
	            return !isIn(obj, arr);
	        }

	        function containsAt(arr, obj, index) {
	            if (isArray(arr) && arr.length > index) {
	                return isEq(arr[index], obj);
	            }
	            return false;
	        }

	        function notContainsAt(arr, obj, index) {
	            if (isArray(arr)) {
	                return !isEq(arr[index], obj);
	            }
	            return false;
	        }

	        function has(obj, prop) {
	            return hasOwn.call(obj, prop);
	        }

	        function notHas(obj, prop) {
	            return !has(obj, prop);
	        }

	        function length(obj, l) {
	            if (has(obj, "length")) {
	                return obj.length === l;
	            }
	            return false;
	        }

	        function notLength(obj, l) {
	            if (has(obj, "length")) {
	                return obj.length !== l;
	            }
	            return false;
	        }

	        var isa = {
	            isFunction: isFunction,
	            isObject: isObject,
	            isEmpty: isEmpty,
	            isHash: isHash,
	            isNumber: isNumber,
	            isString: isString,
	            isDate: isDate,
	            isArray: isArray,
	            isBoolean: isBoolean,
	            isUndefined: isUndefined,
	            isDefined: isDefined,
	            isUndefinedOrNull: isUndefinedOrNull,
	            isNull: isNull,
	            isArguments: isArguments,
	            instanceOf: isInstanceOf,
	            isRegExp: isRegExp,
	            deepEqual: deepEqual,
	            isTrue: isTrue,
	            isFalse: isFalse,
	            isNotNull: isNotNull,
	            isEq: isEq,
	            isNeq: isNeq,
	            isSeq: isSeq,
	            isSneq: isSneq,
	            isIn: isIn,
	            isNotIn: isNotIn,
	            isLt: isLt,
	            isLte: isLte,
	            isGt: isGt,
	            isGte: isGte,
	            isLike: isLike,
	            isNotLike: isNotLike,
	            contains: contains,
	            notContains: notContains,
	            has: has,
	            notHas: notHas,
	            isLength: length,
	            isNotLength: notLength,
	            containsAt: containsAt,
	            notContainsAt: notContainsAt
	        };

	        var tester = {
	            constructor: function () {
	                this._testers = [];
	            },

	            noWrap: {
	                tester: function () {
	                    var testers = this._testers;
	                    return function tester(value) {
	                        var isa = false;
	                        for (var i = 0, l = testers.length; i < l && !isa; i++) {
	                            isa = testers[i](value);
	                        }
	                        return isa;
	                    };
	                }
	            }
	        };

	        var switcher = {
	            constructor: function () {
	                this._cases = [];
	                this.__default = null;
	            },

	            def: function (val, fn) {
	                this.__default = fn;
	            },

	            noWrap: {
	                switcher: function () {
	                    var testers = this._cases, __default = this.__default;
	                    return function tester() {
	                        var handled = false, args = argsToArray(arguments), caseRet;
	                        for (var i = 0, l = testers.length; i < l && !handled; i++) {
	                            caseRet = testers[i](args);
	                            if (caseRet.length > 1) {
	                                if (caseRet[1] || caseRet[0]) {
	                                    return caseRet[1];
	                                }
	                            }
	                        }
	                        if (!handled && __default) {
	                            return  __default.apply(this, args);
	                        }
	                    };
	                }
	            }
	        };

	        function addToTester(func) {
	            tester[func] = function isaTester() {
	                this._testers.push(isa[func]);
	            };
	        }

	        function addToSwitcher(func) {
	            switcher[func] = function isaTester() {
	                var args = argsToArray(arguments, 1), isFunc = isa[func], handler, doBreak = true;
	                if (args.length <= isFunc.length - 1) {
	                    throw new TypeError("A handler must be defined when calling using switch");
	                } else {
	                    handler = args.pop();
	                    if (isBoolean(handler)) {
	                        doBreak = handler;
	                        handler = args.pop();
	                    }
	                }
	                if (!isFunction(handler)) {
	                    throw new TypeError("handler must be defined");
	                }
	                this._cases.push(function (testArgs) {
	                    if (isFunc.apply(isa, testArgs.concat(args))) {
	                        return [doBreak, handler.apply(this, testArgs)];
	                    }
	                    return [false];
	                });
	            };
	        }

	        for (var i in isa) {
	            if (hasOwn.call(isa, i)) {
	                addToSwitcher(i);
	                addToTester(i);
	            }
	        }

	        var is = extended.define(isa).expose(isa);
	        is.tester = extended.define(tester);
	        is.switcher = extended.define(switcher);
	        return is;

	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineIsa(__webpack_require__(33));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended"], function (extended) {
	            return defineIsa(extended);
	        });
	    } else {
	        this.isExtended = defineIsa(this.extended);
	    }

	}).call(this);


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";
	    /*global extender is, dateExtended*/

	    function defineExtended(extender) {


	        var merge = (function merger() {
	            function _merge(target, source) {
	                var name, s;
	                for (name in source) {
	                    if (source.hasOwnProperty(name)) {
	                        s = source[name];
	                        if (!(name in target) || (target[name] !== s)) {
	                            target[name] = s;
	                        }
	                    }
	                }
	                return target;
	            }

	            return function merge(obj) {
	                if (!obj) {
	                    obj = {};
	                }
	                for (var i = 1, l = arguments.length; i < l; i++) {
	                    _merge(obj, arguments[i]);
	                }
	                return obj; // Object
	            };
	        }());

	        function getExtended() {

	            var loaded = {};


	            //getInitial instance;
	            var extended = extender.define();
	            extended.expose({
	                register: function register(alias, extendWith) {
	                    if (!extendWith) {
	                        extendWith = alias;
	                        alias = null;
	                    }
	                    var type = typeof extendWith;
	                    if (alias) {
	                        extended[alias] = extendWith;
	                    } else if (extendWith && type === "function") {
	                        extended.extend(extendWith);
	                    } else if (type === "object") {
	                        extended.expose(extendWith);
	                    } else {
	                        throw new TypeError("extended.register must be called with an extender function");
	                    }
	                    return extended;
	                },

	                define: function () {
	                    return extender.define.apply(extender, arguments);
	                }
	            });

	            return extended;
	        }

	        function extended() {
	            return getExtended();
	        }

	        extended.define = function define() {
	            return extender.define.apply(extender, arguments);
	        };

	        return extended;
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineExtended(__webpack_require__(34));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extender"], function (extender) {
	            return defineExtended(extender);
	        });
	    } else {
	        this.extended = defineExtended(this.extender);
	    }

	}).call(this);








/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(35);

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    /*jshint strict:false*/


	    /**
	     *
	     * @projectName extender
	     * @github http://github.com/doug-martin/extender
	     * @header
	     * [![build status](https://secure.travis-ci.org/doug-martin/extender.png)](http://travis-ci.org/doug-martin/extender)
	     * # Extender
	     *
	     * `extender` is a library that helps in making chainable APIs, by creating a function that accepts different values and returns an object decorated with functions based on the type.
	     *
	     * ## Why Is Extender Different?
	     *
	     * Extender is different than normal chaining because is does more than return `this`. It decorates your values in a type safe manner.
	     *
	     * For example if you return an array from a string based method then the returned value will be decorated with array methods and not the string methods. This allow you as the developer to focus on your API and not worrying about how to properly build and connect your API.
	     *
	     *
	     * ## Installation
	     *
	     * ```
	     * npm install extender
	     * ```
	     *
	     * Or [download the source](https://raw.github.com/doug-martin/extender/master/extender.js) ([minified](https://raw.github.com/doug-martin/extender/master/extender-min.js))
	     *
	     * **Note** `extender` depends on [`declare.js`](http://doug-martin.github.com/declare.js/).
	     *
	     * ### Requirejs
	     *
	     * To use with requirejs place the `extend` source in the root scripts directory
	     *
	     * ```javascript
	     *
	     * define(["extender"], function(extender){
	     * });
	     *
	     * ```
	     *
	     *
	     * ## Usage
	     *
	     * **`extender.define(tester, decorations)`**
	     *
	     * To create your own extender call the `extender.define` function.
	     *
	     * This function accepts an optional tester which is used to determine a value should be decorated with the specified `decorations`
	     *
	     * ```javascript
	     * function isString(obj) {
	     *     return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
	     * }
	     *
	     *
	     * var myExtender = extender.define(isString, {
	     *		multiply: function (str, times) {
	     *			var ret = str;
	     *			for (var i = 1; i < times; i++) {
	     *				ret += str;
	     *			}
	     *			return ret;
	     *		},
	     *		toArray: function (str, delim) {
	     *			delim = delim || "";
	     *			return str.split(delim);
	     *		}
	     *	});
	     *
	     * myExtender("hello").multiply(2).value(); //hellohello
	     *
	     * ```
	     *
	     * If you do not specify a tester function and just pass in an object of `functions` then all values passed in will be decorated with methods.
	     *
	     * ```javascript
	     *
	     * function isUndefined(obj) {
	     *     var undef;
	     *     return obj === undef;
	     * }
	     *
	     * function isUndefinedOrNull(obj) {
	     *	var undef;
	     *     return obj === undef || obj === null;
	     * }
	     *
	     * function isArray(obj) {
	     *     return Object.prototype.toString.call(obj) === "[object Array]";
	     * }
	     *
	     * function isBoolean(obj) {
	     *     var undef, type = typeof obj;
	     *     return !isUndefinedOrNull(obj) && type === "boolean" || type === "Boolean";
	     * }
	     *
	     * function isString(obj) {
	     *     return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
	     * }
	     *
	     * var myExtender = extender.define({
	     *	isUndefined : isUndefined,
	     *	isUndefinedOrNull : isUndefinedOrNull,
	     *	isArray : isArray,
	     *	isBoolean : isBoolean,
	     *	isString : isString
	     * });
	     *
	     * ```
	     *
	     * To use
	     *
	     * ```
	     * var undef;
	     * myExtender("hello").isUndefined().value(); //false
	     * myExtender(undef).isUndefined().value(); //true
	     * ```
	     *
	     * You can also chain extenders so that they accept multiple types and decorates accordingly.
	     *
	     * ```javascript
	     * myExtender
	     *     .define(isArray, {
	     *		pluck: function (arr, m) {
	     *			var ret = [];
	     *			for (var i = 0, l = arr.length; i < l; i++) {
	     *				ret.push(arr[i][m]);
	     *			}
	     *			return ret;
	     *		}
	     *	})
	     *     .define(isBoolean, {
	     *		invert: function (val) {
	     *			return !val;
	     *		}
	     *	});
	     *
	     * myExtender([{a: "a"},{a: "b"},{a: "c"}]).pluck("a").value(); //["a", "b", "c"]
	     * myExtender("I love javascript!").toArray(/\s+/).pluck("0"); //["I", "l", "j"]
	     *
	     * ```
	     *
	     * Notice that we reuse the same extender as defined above.
	     *
	     * **Return Values**
	     *
	     * When creating an extender if you return a value from one of the decoration functions then that value will also be decorated. If you do not return any values then the extender will be returned.
	     *
	     * **Default decoration methods**
	     *
	     * By default every value passed into an extender is decorated with the following methods.
	     *
	     * * `value` : The value this extender represents.
	     * * `eq(otherValue)` : Tests strict equality of the currently represented value to the `otherValue`
	     * * `neq(oterValue)` : Tests strict inequality of the currently represented value.
	     * * `print` : logs the current value to the console.
	     *
	     * **Extender initialization**
	     *
	     * When creating an extender you can also specify a constructor which will be invoked with the current value.
	     *
	     * ```javascript
	     * myExtender.define(isString, {
	     *	constructor : function(val){
	     *     //set our value to the string trimmed
	     *		this._value = val.trimRight().trimLeft();
	     *	}
	     * });
	     * ```
	     *
	     * **`noWrap`**
	     *
	     * `extender` also allows you to specify methods that should not have the value wrapped providing a cleaner exit function other than `value()`.
	     *
	     * For example suppose you have an API that allows you to build a validator, rather than forcing the user to invoke the `value` method you could add a method called `validator` which makes more syntactic sense.
	     *
	     * ```
	     *
	     * var myValidator = extender.define({
	     *     //chainable validation methods
	     *     //...
	     *     //end chainable validation methods
	     *
	     *     noWrap : {
	     *         validator : function(){
	     *             //return your validator
	     *         }
	     *     }
	     * });
	     *
	     * myValidator().isNotNull().isEmailAddress().validator(); //now you dont need to call .value()
	     *
	     *
	     * ```
	     * **`extender.extend(extendr)`**
	     *
	     * You may also compose extenders through the use of `extender.extend(extender)`, which will return an entirely new extender that is the composition of extenders.
	     *
	     * Suppose you have the following two extenders.
	     *
	     * ```javascript
	     * var myExtender = extender
	     *        .define({
	     *            isFunction: is.function,
	     *            isNumber: is.number,
	     *            isString: is.string,
	     *            isDate: is.date,
	     *            isArray: is.array,
	     *            isBoolean: is.boolean,
	     *            isUndefined: is.undefined,
	     *            isDefined: is.defined,
	     *            isUndefinedOrNull: is.undefinedOrNull,
	     *            isNull: is.null,
	     *            isArguments: is.arguments,
	     *            isInstanceOf: is.instanceOf,
	     *            isRegExp: is.regExp
	     *        });
	     * var myExtender2 = extender.define(is.array, {
	     *     pluck: function (arr, m) {
	     *         var ret = [];
	     *         for (var i = 0, l = arr.length; i < l; i++) {
	     *             ret.push(arr[i][m]);
	     *         }
	     *         return ret;
	     *     },
	     *
	     *     noWrap: {
	     *         pluckPlain: function (arr, m) {
	     *             var ret = [];
	     *             for (var i = 0, l = arr.length; i < l; i++) {
	     *                 ret.push(arr[i][m]);
	     *             }
	     *             return ret;
	     *         }
	     *     }
	     * });
	     *
	     *
	     * ```
	     *
	     * And you do not want to alter either of them but instead what to create a third that is the union of the two.
	     *
	     *
	     * ```javascript
	     * var composed = extender.extend(myExtender).extend(myExtender2);
	     * ```
	     * So now you can use the new extender with the joined functionality if `myExtender` and `myExtender2`.
	     *
	     * ```javascript
	     * var extended = composed([
	     *      {a: "a"},
	     *      {a: "b"},
	     *      {a: "c"}
	     * ]);
	     * extended.isArray().value(); //true
	     * extended.pluck("a").value(); // ["a", "b", "c"]);
	     *
	     * ```
	     *
	     * **Note** `myExtender` and `myExtender2` will **NOT** be altered.
	     *
	     * **`extender.expose(methods)`**
	     *
	     * The `expose` method allows you to add methods to your extender that are not wrapped or automatically chained by exposing them on the extender directly.
	     *
	     * ```
	     * var isMethods = {
	     *      isFunction: is.function,
	     *      isNumber: is.number,
	     *      isString: is.string,
	     *      isDate: is.date,
	     *      isArray: is.array,
	     *      isBoolean: is.boolean,
	     *      isUndefined: is.undefined,
	     *      isDefined: is.defined,
	     *      isUndefinedOrNull: is.undefinedOrNull,
	     *      isNull: is.null,
	     *      isArguments: is.arguments,
	     *      isInstanceOf: is.instanceOf,
	     *      isRegExp: is.regExp
	     * };
	     *
	     * var myExtender = extender.define(isMethods).expose(isMethods);
	     *
	     * myExtender.isArray([]); //true
	     * myExtender([]).isArray([]).value(); //true
	     *
	     * ```
	     *
	     *
	     * **Using `instanceof`**
	     *
	     * When using extenders you can test if a value is an `instanceof` of an extender by using the instanceof operator.
	     *
	     * ```javascript
	     * var str = myExtender("hello");
	     *
	     * str instanceof myExtender; //true
	     * ```
	     *
	     * ## Examples
	     *
	     * To see more examples click [here](https://github.com/doug-martin/extender/tree/master/examples)
	     */
	    function defineExtender(declare) {


	        var slice = Array.prototype.slice, undef;

	        function indexOf(arr, item) {
	            if (arr && arr.length) {
	                for (var i = 0, l = arr.length; i < l; i++) {
	                    if (arr[i] === item) {
	                        return i;
	                    }
	                }
	            }
	            return -1;
	        }

	        function isArray(obj) {
	            return Object.prototype.toString.call(obj) === "[object Array]";
	        }

	        var merge = (function merger() {
	            function _merge(target, source, exclude) {
	                var name, s;
	                for (name in source) {
	                    if (source.hasOwnProperty(name) && indexOf(exclude, name) === -1) {
	                        s = source[name];
	                        if (!(name in target) || (target[name] !== s)) {
	                            target[name] = s;
	                        }
	                    }
	                }
	                return target;
	            }

	            return function merge(obj) {
	                if (!obj) {
	                    obj = {};
	                }
	                var l = arguments.length;
	                var exclude = arguments[arguments.length - 1];
	                if (isArray(exclude)) {
	                    l--;
	                } else {
	                    exclude = [];
	                }
	                for (var i = 1; i < l; i++) {
	                    _merge(obj, arguments[i], exclude);
	                }
	                return obj; // Object
	            };
	        }());


	        function extender(supers) {
	            supers = supers || [];
	            var Base = declare({
	                instance: {
	                    constructor: function (value) {
	                        this._value = value;
	                    },

	                    value: function () {
	                        return this._value;
	                    },

	                    eq: function eq(val) {
	                        return this["__extender__"](this._value === val);
	                    },

	                    neq: function neq(other) {
	                        return this["__extender__"](this._value !== other);
	                    },
	                    print: function () {
	                        console.log(this._value);
	                        return this;
	                    }
	                }
	            }), defined = [];

	            function addMethod(proto, name, func) {
	                if ("function" !== typeof func) {
	                    throw new TypeError("when extending type you must provide a function");
	                }
	                var extendedMethod;
	                if (name === "constructor") {
	                    extendedMethod = function () {
	                        this._super(arguments);
	                        func.apply(this, arguments);
	                    };
	                } else {
	                    extendedMethod = function extendedMethod() {
	                        var args = slice.call(arguments);
	                        args.unshift(this._value);
	                        var ret = func.apply(this, args);
	                        return ret !== undef ? this["__extender__"](ret) : this;
	                    };
	                }
	                proto[name] = extendedMethod;
	            }

	            function addNoWrapMethod(proto, name, func) {
	                if ("function" !== typeof func) {
	                    throw new TypeError("when extending type you must provide a function");
	                }
	                var extendedMethod;
	                if (name === "constructor") {
	                    extendedMethod = function () {
	                        this._super(arguments);
	                        func.apply(this, arguments);
	                    };
	                } else {
	                    extendedMethod = function extendedMethod() {
	                        var args = slice.call(arguments);
	                        args.unshift(this._value);
	                        return func.apply(this, args);
	                    };
	                }
	                proto[name] = extendedMethod;
	            }

	            function decorateProto(proto, decoration, nowrap) {
	                for (var i in decoration) {
	                    if (decoration.hasOwnProperty(i)) {
	                        if (i !== "getters" && i !== "setters") {
	                            if (i === "noWrap") {
	                                decorateProto(proto, decoration[i], true);
	                            } else if (nowrap) {
	                                addNoWrapMethod(proto, i, decoration[i]);
	                            } else {
	                                addMethod(proto, i, decoration[i]);
	                            }
	                        } else {
	                            proto[i] = decoration[i];
	                        }
	                    }
	                }
	            }

	            function _extender(obj) {
	                var ret = obj, i, l;
	                if (!(obj instanceof Base)) {
	                    var OurBase = Base;
	                    for (i = 0, l = defined.length; i < l; i++) {
	                        var definer = defined[i];
	                        if (definer[0](obj)) {
	                            OurBase = OurBase.extend({instance: definer[1]});
	                        }
	                    }
	                    ret = new OurBase(obj);
	                    ret["__extender__"] = _extender;
	                }
	                return ret;
	            }

	            function always() {
	                return true;
	            }

	            function define(tester, decorate) {
	                if (arguments.length) {
	                    if (typeof tester === "object") {
	                        decorate = tester;
	                        tester = always;
	                    }
	                    decorate = decorate || {};
	                    var proto = {};
	                    decorateProto(proto, decorate);
	                    //handle browsers like which skip over the constructor while looping
	                    if (!proto.hasOwnProperty("constructor")) {
	                        if (decorate.hasOwnProperty("constructor")) {
	                            addMethod(proto, "constructor", decorate.constructor);
	                        } else {
	                            proto.constructor = function () {
	                                this._super(arguments);
	                            };
	                        }
	                    }
	                    defined.push([tester, proto]);
	                }
	                return _extender;
	            }

	            function extend(supr) {
	                if (supr && supr.hasOwnProperty("__defined__")) {
	                    _extender["__defined__"] = defined = defined.concat(supr["__defined__"]);
	                }
	                merge(_extender, supr, ["define", "extend", "expose", "__defined__"]);
	                return _extender;
	            }

	            _extender.define = define;
	            _extender.extend = extend;
	            _extender.expose = function expose() {
	                var methods;
	                for (var i = 0, l = arguments.length; i < l; i++) {
	                    methods = arguments[i];
	                    if (typeof methods === "object") {
	                        merge(_extender, methods, ["define", "extend", "expose", "__defined__"]);
	                    }
	                }
	                return _extender;
	            };
	            _extender["__defined__"] = defined;


	            return _extender;
	        }

	        return {
	            define: function () {
	                return extender().define.apply(extender, arguments);
	            },

	            extend: function (supr) {
	                return extender().define().extend(supr);
	            }
	        };

	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineExtender(__webpack_require__(36));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["declare"], function (declare) {
	            return defineExtender(declare);
	        });
	    } else {
	        this.extender = defineExtender(this.declare);
	    }

	}).call(this);

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(37);

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	(function () {

	    /**
	     * @projectName declare
	     * @github http://github.com/doug-martin/declare.js
	     * @header
	     *
	     * Declare is a library designed to allow writing object oriented code the same way in both the browser and node.js.
	     *
	     * ##Installation
	     *
	     * `npm install declare.js`
	     *
	     * Or [download the source](https://raw.github.com/doug-martin/declare.js/master/declare.js) ([minified](https://raw.github.com/doug-martin/declare.js/master/declare-min.js))
	     *
	     * ###Requirejs
	     *
	     * To use with requirejs place the `declare` source in the root scripts directory
	     *
	     * ```
	     *
	     * define(["declare"], function(declare){
	     *      return declare({
	     *          instance : {
	     *              hello : function(){
	     *                  return "world";
	     *              }
	     *          }
	     *      });
	     * });
	     *
	     * ```
	     *
	     *
	     * ##Usage
	     *
	     * declare.js provides
	     *
	     * Class methods
	     *
	     * * `as(module | object, name)` : exports the object to module or the object with the name
	     * * `mixin(mixin)` : mixes in an object but does not inherit directly from the object. **Note** this does not return a new class but changes the original class.
	     * * `extend(proto)` : extend a class with the given properties. A shortcut to `declare(Super, {})`;
	     *
	     * Instance methods
	     *
	     * * `_super(arguments)`: calls the super of the current method, you can pass in either the argments object or an array with arguments you want passed to super
	     * * `_getSuper()`: returns a this methods direct super.
	     * * `_static` : use to reference class properties and methods.
	     * * `get(prop)` : gets a property invoking the getter if it exists otherwise it just returns the named property on the object.
	     * * `set(prop, val)` : sets a property invoking the setter if it exists otherwise it just sets the named property on the object.
	     *
	     *
	     * ###Declaring a new Class
	     *
	     * Creating a new class with declare is easy!
	     *
	     * ```
	     *
	     * var Mammal = declare({
	     *      //define your instance methods and properties
	     *      instance : {
	     *
	     *          //will be called whenever a new instance is created
	     *          constructor: function(options) {
	     *              options = options || {};
	     *              this._super(arguments);
	     *              this._type = options.type || "mammal";
	     *          },
	     *
	     *          speak : function() {
	     *              return  "A mammal of type " + this._type + " sounds like";
	     *          },
	     *
	     *          //Define your getters
	     *          getters : {
	     *
	     *              //can be accessed by using the get method. (mammal.get("type"))
	     *              type : function() {
	     *                  return this._type;
	     *              }
	     *          },
	     *
	     *           //Define your setters
	     *          setters : {
	     *
	     *                //can be accessed by using the set method. (mammal.set("type", "mammalType"))
	     *              type : function(t) {
	     *                  this._type = t;
	     *              }
	     *          }
	     *      },
	     *
	     *      //Define your static methods
	     *      static : {
	     *
	     *          //Mammal.soundOff(); //"Im a mammal!!"
	     *          soundOff : function() {
	     *              return "Im a mammal!!";
	     *          }
	     *      }
	     * });
	     *
	     *
	     * ```
	     *
	     * You can use Mammal just like you would any other class.
	     *
	     * ```
	     * Mammal.soundOff("Im a mammal!!");
	     *
	     * var myMammal = new Mammal({type : "mymammal"});
	     * myMammal.speak(); // "A mammal of type mymammal sounds like"
	     * myMammal.get("type"); //"mymammal"
	     * myMammal.set("type", "mammal");
	     * myMammal.get("type"); //"mammal"
	     *
	     *
	     * ```
	     *
	     * ###Extending a class
	     *
	     * If you want to just extend a single class use the .extend method.
	     *
	     * ```
	     *
	     * var Wolf = Mammal.extend({
	     *
	     *   //define your instance method
	     *   instance: {
	     *
	     *        //You can override super constructors just be sure to call `_super`
	     *       constructor: function(options) {
	     *          options = options || {};
	     *          this._super(arguments); //call our super constructor.
	     *          this._sound = "growl";
	     *          this._color = options.color || "grey";
	     *      },
	     *
	     *      //override Mammals `speak` method by appending our own data to it.
	     *      speak : function() {
	     *          return this._super(arguments) + " a " + this._sound;
	     *      },
	     *
	     *      //add new getters for sound and color
	     *      getters : {
	     *
	     *           //new Wolf().get("type")
	     *           //notice color is read only as we did not define a setter
	     *          color : function() {
	     *              return this._color;
	     *          },
	     *
	     *          //new Wolf().get("sound")
	     *          sound : function() {
	     *              return this._sound;
	     *          }
	     *      },
	     *
	     *      setters : {
	     *
	     *          //new Wolf().set("sound", "howl")
	     *          sound : function(s) {
	     *              this._sound = s;
	     *          }
	     *      }
	     *
	     *  },
	     *
	     *  static : {
	     *
	     *      //You can override super static methods also! And you can still use _super
	     *      soundOff : function() {
	     *          //You can even call super in your statics!!!
	     *          //should return "I'm a mammal!! that growls"
	     *          return this._super(arguments) + " that growls";
	     *      }
	     *  }
	     * });
	     *
	     * Wolf.soundOff(); //Im a mammal!! that growls
	     *
	     * var myWolf = new Wolf();
	     * myWolf instanceof Mammal //true
	     * myWolf instanceof Wolf //true
	     *
	     * ```
	     *
	     * You can also extend a class by using the declare method and just pass in the super class.
	     *
	     * ```
	     * //Typical hierarchical inheritance
	     * // Mammal->Wolf->Dog
	     * var Dog = declare(Wolf, {
	     *    instance: {
	     *        constructor: function(options) {
	     *            options = options || {};
	     *            this._super(arguments);
	     *            //override Wolfs initialization of sound to woof.
	     *            this._sound = "woof";
	     *
	     *        },
	     *
	     *        speak : function() {
	     *            //Should return "A mammal of type mammal sounds like a growl thats domesticated"
	     *            return this._super(arguments) + " thats domesticated";
	     *        }
	     *    },
	     *
	     *    static : {
	     *        soundOff : function() {
	     *            //should return "I'm a mammal!! that growls but now barks"
	     *            return this._super(arguments) + " but now barks";
	     *        }
	     *    }
	     * });
	     *
	     * Dog.soundOff(); //Im a mammal!! that growls but now barks
	     *
	     * var myDog = new Dog();
	     * myDog instanceof Mammal //true
	     * myDog instanceof Wolf //true
	     * myDog instanceof Dog //true
	     *
	     *
	     * //Notice you still get the extend method.
	     *
	     * // Mammal->Wolf->Dog->Breed
	     * var Breed = Dog.extend({
	     *    instance: {
	     *
	     *        //initialize outside of constructor
	     *        _pitch : "high",
	     *
	     *        constructor: function(options) {
	     *            options = options || {};
	     *            this._super(arguments);
	     *            this.breed = options.breed || "lab";
	     *        },
	     *
	     *        speak : function() {
	     *            //Should return "A mammal of type mammal sounds like a
	     *            //growl thats domesticated with a high pitch!"
	     *            return this._super(arguments) + " with a " + this._pitch + " pitch!";
	     *        },
	     *
	     *        getters : {
	     *            pitch : function() {
	     *                return this._pitch;
	     *            }
	     *        }
	     *    },
	     *
	     *    static : {
	     *        soundOff : function() {
	     *            //should return "I'M A MAMMAL!! THAT GROWLS BUT NOW BARKS!"
	     *            return this._super(arguments).toUpperCase() + "!";
	     *        }
	     *    }
	     * });
	     *
	     *
	     * Breed.soundOff()//"IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!"
	     *
	     * var myBreed = new Breed({color : "gold", type : "lab"}),
	     * myBreed instanceof Dog //true
	     * myBreed instanceof Wolf //true
	     * myBreed instanceof Mammal //true
	     * myBreed.speak() //"A mammal of type lab sounds like a woof thats domesticated with a high pitch!"
	     * myBreed.get("type") //"lab"
	     * myBreed.get("color") //"gold"
	     * myBreed.get("sound")" //"woof"
	     * ```
	     *
	     * ###Multiple Inheritance / Mixins
	     *
	     * declare also allows the use of multiple super classes.
	     * This is useful if you have generic classes that provide functionality but shouldnt be used on their own.
	     *
	     * Lets declare a mixin that allows us to watch for property changes.
	     *
	     * ```
	     * //Notice that we set up the functions outside of declare because we can reuse them
	     *
	     * function _set(prop, val) {
	     *     //get the old value
	     *     var oldVal = this.get(prop);
	     *     //call super to actually set the property
	     *     var ret = this._super(arguments);
	     *     //call our handlers
	     *     this.__callHandlers(prop, oldVal, val);
	     *     return ret;
	     * }
	     *
	     * function _callHandlers(prop, oldVal, newVal) {
	     *    //get our handlers for the property
	     *     var handlers = this.__watchers[prop], l;
	     *     //if the handlers exist and their length does not equal 0 then we call loop through them
	     *     if (handlers && (l = handlers.length) !== 0) {
	     *         for (var i = 0; i < l; i++) {
	     *             //call the handler
	     *             handlers[i].call(null, prop, oldVal, newVal);
	     *         }
	     *     }
	     * }
	     *
	     *
	     * //the watch function
	     * function _watch(prop, handler) {
	     *     if ("function" !== typeof handler) {
	     *         //if its not a function then its an invalid handler
	     *         throw new TypeError("Invalid handler.");
	     *     }
	     *     if (!this.__watchers[prop]) {
	     *         //create the watchers if it doesnt exist
	     *         this.__watchers[prop] = [handler];
	     *     } else {
	     *         //otherwise just add it to the handlers array
	     *         this.__watchers[prop].push(handler);
	     *     }
	     * }
	     *
	     * function _unwatch(prop, handler) {
	     *     if ("function" !== typeof handler) {
	     *         throw new TypeError("Invalid handler.");
	     *     }
	     *     var handlers = this.__watchers[prop], index;
	     *     if (handlers && (index = handlers.indexOf(handler)) !== -1) {
	     *        //remove the handler if it is found
	     *         handlers.splice(index, 1);
	     *     }
	     * }
	     *
	     * declare({
	     *     instance:{
	     *         constructor:function () {
	     *             this._super(arguments);
	     *             //set up our watchers
	     *             this.__watchers = {};
	     *         },
	     *
	     *         //override the default set function so we can watch values
	     *         "set":_set,
	     *         //set up our callhandlers function
	     *         __callHandlers:_callHandlers,
	     *         //add the watch function
	     *         watch:_watch,
	     *         //add the unwatch function
	     *         unwatch:_unwatch
	     *     },
	     *
	     *     "static":{
	     *
	     *         init:function () {
	     *             this._super(arguments);
	     *             this.__watchers = {};
	     *         },
	     *         //override the default set function so we can watch values
	     *         "set":_set,
	     *         //set our callHandlers function
	     *         __callHandlers:_callHandlers,
	     *         //add the watch
	     *         watch:_watch,
	     *         //add the unwatch function
	     *         unwatch:_unwatch
	     *     }
	     * })
	     *
	     * ```
	     *
	     * Now lets use the mixin
	     *
	     * ```
	     * var WatchDog = declare([Dog, WatchMixin]);
	     *
	     * var watchDog = new WatchDog();
	     * //create our handler
	     * function watch(id, oldVal, newVal) {
	     *     console.log("watchdog's %s was %s, now %s", id, oldVal, newVal);
	     * }
	     *
	     * //watch for property changes
	     * watchDog.watch("type", watch);
	     * watchDog.watch("color", watch);
	     * watchDog.watch("sound", watch);
	     *
	     * //now set the properties each handler will be called
	     * watchDog.set("type", "newDog");
	     * watchDog.set("color", "newColor");
	     * watchDog.set("sound", "newSound");
	     *
	     *
	     * //unwatch the property changes
	     * watchDog.unwatch("type", watch);
	     * watchDog.unwatch("color", watch);
	     * watchDog.unwatch("sound", watch);
	     *
	     * //no handlers will be called this time
	     * watchDog.set("type", "newDog");
	     * watchDog.set("color", "newColor");
	     * watchDog.set("sound", "newSound");
	     *
	     *
	     * ```
	     *
	     * ###Accessing static methods and properties witin an instance.
	     *
	     * To access static properties on an instance use the `_static` property which is a reference to your constructor.
	     *
	     * For example if your in your constructor and you want to have configurable default values.
	     *
	     * ```
	     * consturctor : function constructor(opts){
	     *     this.opts = opts || {};
	     *     this._type = opts.type || this._static.DEFAULT_TYPE;
	     * }
	     * ```
	     *
	     *
	     *
	     * ###Creating a new instance of within an instance.
	     *
	     * Often times you want to create a new instance of an object within an instance. If your subclassed however you cannot return a new instance of the parent class as it will not be the right sub class. `declare` provides a way around this by setting the `_static` property on each isntance of the class.
	     *
	     * Lets add a reproduce method `Mammal`
	     *
	     * ```
	     * reproduce : function(options){
	     *     return new this._static(options);
	     * }
	     * ```
	     *
	     * Now in each subclass you can call reproduce and get the proper type.
	     *
	     * ```
	     * var myDog = new Dog();
	     * var myDogsChild = myDog.reproduce();
	     *
	     * myDogsChild instanceof Dog; //true
	     * ```
	     *
	     * ###Using the `as`
	     *
	     * `declare` also provides an `as` method which allows you to add your class to an object or if your using node.js you can pass in `module` and the class will be exported as the module.
	     *
	     * ```
	     * var animals = {};
	     *
	     * Mammal.as(animals, "Dog");
	     * Wolf.as(animals, "Wolf");
	     * Dog.as(animals, "Dog");
	     * Breed.as(animals, "Breed");
	     *
	     * var myDog = new animals.Dog();
	     *
	     * ```
	     *
	     * Or in node
	     *
	     * ```
	     * Mammal.as(exports, "Dog");
	     * Wolf.as(exports, "Wolf");
	     * Dog.as(exports, "Dog");
	     * Breed.as(exports, "Breed");
	     *
	     * ```
	     *
	     * To export a class as the `module` in node
	     *
	     * ```
	     * Mammal.as(module);
	     * ```
	     *
	     *
	     */
	    function createDeclared() {
	        var arraySlice = Array.prototype.slice, classCounter = 0, Base, forceNew = new Function();

	        var SUPER_REGEXP = /(super)/g;

	        function argsToArray(args, slice) {
	            slice = slice || 0;
	            return arraySlice.call(args, slice);
	        }

	        function isArray(obj) {
	            return Object.prototype.toString.call(obj) === "[object Array]";
	        }

	        function isObject(obj) {
	            var undef;
	            return obj !== null && obj !== undef && typeof obj === "object";
	        }

	        function isHash(obj) {
	            var ret = isObject(obj);
	            return ret && obj.constructor === Object;
	        }

	        var isArguments = function _isArguments(object) {
	            return Object.prototype.toString.call(object) === '[object Arguments]';
	        };

	        if (!isArguments(arguments)) {
	            isArguments = function _isArguments(obj) {
	                return !!(obj && obj.hasOwnProperty("callee"));
	            };
	        }

	        function indexOf(arr, item) {
	            if (arr && arr.length) {
	                for (var i = 0, l = arr.length; i < l; i++) {
	                    if (arr[i] === item) {
	                        return i;
	                    }
	                }
	            }
	            return -1;
	        }

	        function merge(target, source, exclude) {
	            var name, s;
	            for (name in source) {
	                if (source.hasOwnProperty(name) && indexOf(exclude, name) === -1) {
	                    s = source[name];
	                    if (!(name in target) || (target[name] !== s)) {
	                        target[name] = s;
	                    }
	                }
	            }
	            return target;
	        }

	        function callSuper(args, a) {
	            var meta = this.__meta,
	                supers = meta.supers,
	                l = supers.length, superMeta = meta.superMeta, pos = superMeta.pos;
	            if (l > pos) {
	                args = !args ? [] : (!isArguments(args) && !isArray(args)) ? [args] : args;
	                var name = superMeta.name, f = superMeta.f, m;
	                do {
	                    m = supers[pos][name];
	                    if ("function" === typeof m && (m = m._f || m) !== f) {
	                        superMeta.pos = 1 + pos;
	                        return m.apply(this, args);
	                    }
	                } while (l > ++pos);
	            }

	            return null;
	        }

	        function getSuper() {
	            var meta = this.__meta,
	                supers = meta.supers,
	                l = supers.length, superMeta = meta.superMeta, pos = superMeta.pos;
	            if (l > pos) {
	                var name = superMeta.name, f = superMeta.f, m;
	                do {
	                    m = supers[pos][name];
	                    if ("function" === typeof m && (m = m._f || m) !== f) {
	                        superMeta.pos = 1 + pos;
	                        return m.bind(this);
	                    }
	                } while (l > ++pos);
	            }
	            return null;
	        }

	        function getter(name) {
	            var getters = this.__getters__;
	            if (getters.hasOwnProperty(name)) {
	                return getters[name].apply(this);
	            } else {
	                return this[name];
	            }
	        }

	        function setter(name, val) {
	            var setters = this.__setters__;
	            if (isHash(name)) {
	                for (var i in name) {
	                    var prop = name[i];
	                    if (setters.hasOwnProperty(i)) {
	                        setters[name].call(this, prop);
	                    } else {
	                        this[i] = prop;
	                    }
	                }
	            } else {
	                if (setters.hasOwnProperty(name)) {
	                    return setters[name].apply(this, argsToArray(arguments, 1));
	                } else {
	                    return this[name] = val;
	                }
	            }
	        }


	        function defaultFunction() {
	            var meta = this.__meta || {},
	                supers = meta.supers,
	                l = supers.length, superMeta = meta.superMeta, pos = superMeta.pos;
	            if (l > pos) {
	                var name = superMeta.name, f = superMeta.f, m;
	                do {
	                    m = supers[pos][name];
	                    if ("function" === typeof m && (m = m._f || m) !== f) {
	                        superMeta.pos = 1 + pos;
	                        return m.apply(this, arguments);
	                    }
	                } while (l > ++pos);
	            }
	            return null;
	        }


	        function functionWrapper(f, name) {
	            if (f.toString().match(SUPER_REGEXP)) {
	                var wrapper = function wrapper() {
	                    var ret, meta = this.__meta || {};
	                    var orig = meta.superMeta;
	                    meta.superMeta = {f: f, pos: 0, name: name};
	                    switch (arguments.length) {
	                    case 0:
	                        ret = f.call(this);
	                        break;
	                    case 1:
	                        ret = f.call(this, arguments[0]);
	                        break;
	                    case 2:
	                        ret = f.call(this, arguments[0], arguments[1]);
	                        break;

	                    case 3:
	                        ret = f.call(this, arguments[0], arguments[1], arguments[2]);
	                        break;
	                    default:
	                        ret = f.apply(this, arguments);
	                    }
	                    meta.superMeta = orig;
	                    return ret;
	                };
	                wrapper._f = f;
	                return wrapper;
	            } else {
	                f._f = f;
	                return f;
	            }
	        }

	        function defineMixinProps(child, proto) {

	            var operations = proto.setters || {}, __setters = child.__setters__, __getters = child.__getters__;
	            for (var i in operations) {
	                if (!__setters.hasOwnProperty(i)) {  //make sure that the setter isnt already there
	                    __setters[i] = operations[i];
	                }
	            }
	            operations = proto.getters || {};
	            for (i in operations) {
	                if (!__getters.hasOwnProperty(i)) {  //make sure that the setter isnt already there
	                    __getters[i] = operations[i];
	                }
	            }
	            for (var j in proto) {
	                if (j !== "getters" && j !== "setters") {
	                    var p = proto[j];
	                    if ("function" === typeof p) {
	                        if (!child.hasOwnProperty(j)) {
	                            child[j] = functionWrapper(defaultFunction, j);
	                        }
	                    } else {
	                        child[j] = p;
	                    }
	                }
	            }
	        }

	        function mixin() {
	            var args = argsToArray(arguments), l = args.length;
	            var child = this.prototype;
	            var childMeta = child.__meta, thisMeta = this.__meta, bases = child.__meta.bases, staticBases = bases.slice(),
	                staticSupers = thisMeta.supers || [], supers = childMeta.supers || [];
	            for (var i = 0; i < l; i++) {
	                var m = args[i], mProto = m.prototype;
	                var protoMeta = mProto.__meta, meta = m.__meta;
	                !protoMeta && (protoMeta = (mProto.__meta = {proto: mProto || {}}));
	                !meta && (meta = (m.__meta = {proto: m.__proto__ || {}}));
	                defineMixinProps(child, protoMeta.proto || {});
	                defineMixinProps(this, meta.proto || {});
	                //copy the bases for static,

	                mixinSupers(m.prototype, supers, bases);
	                mixinSupers(m, staticSupers, staticBases);
	            }
	            return this;
	        }

	        function mixinSupers(sup, arr, bases) {
	            var meta = sup.__meta;
	            !meta && (meta = (sup.__meta = {}));
	            var unique = sup.__meta.unique;
	            !unique && (meta.unique = "declare" + ++classCounter);
	            //check it we already have this super mixed into our prototype chain
	            //if true then we have already looped their supers!
	            if (indexOf(bases, unique) === -1) {
	                //add their id to our bases
	                bases.push(unique);
	                var supers = sup.__meta.supers || [], i = supers.length - 1 || 0;
	                while (i >= 0) {
	                    mixinSupers(supers[i--], arr, bases);
	                }
	                arr.unshift(sup);
	            }
	        }

	        function defineProps(child, proto) {
	            var operations = proto.setters,
	                __setters = child.__setters__,
	                __getters = child.__getters__;
	            if (operations) {
	                for (var i in operations) {
	                    __setters[i] = operations[i];
	                }
	            }
	            operations = proto.getters || {};
	            if (operations) {
	                for (i in operations) {
	                    __getters[i] = operations[i];
	                }
	            }
	            for (i in proto) {
	                if (i != "getters" && i != "setters") {
	                    var f = proto[i];
	                    if ("function" === typeof f) {
	                        var meta = f.__meta || {};
	                        if (!meta.isConstructor) {
	                            child[i] = functionWrapper(f, i);
	                        } else {
	                            child[i] = f;
	                        }
	                    } else {
	                        child[i] = f;
	                    }
	                }
	            }

	        }

	        function _export(obj, name) {
	            if (obj && name) {
	                obj[name] = this;
	            } else {
	                obj.exports = obj = this;
	            }
	            return this;
	        }

	        function extend(proto) {
	            return declare(this, proto);
	        }

	        function getNew(ctor) {
	            // create object with correct prototype using a do-nothing
	            // constructor
	            forceNew.prototype = ctor.prototype;
	            var t = new forceNew();
	            forceNew.prototype = null;	// clean up
	            return t;
	        }


	        function __declare(child, sup, proto) {
	            var childProto = {}, supers = [];
	            var unique = "declare" + ++classCounter, bases = [], staticBases = [];
	            var instanceSupers = [], staticSupers = [];
	            var meta = {
	                supers: instanceSupers,
	                unique: unique,
	                bases: bases,
	                superMeta: {
	                    f: null,
	                    pos: 0,
	                    name: null
	                }
	            };
	            var childMeta = {
	                supers: staticSupers,
	                unique: unique,
	                bases: staticBases,
	                isConstructor: true,
	                superMeta: {
	                    f: null,
	                    pos: 0,
	                    name: null
	                }
	            };

	            if (isHash(sup) && !proto) {
	                proto = sup;
	                sup = Base;
	            }

	            if ("function" === typeof sup || isArray(sup)) {
	                supers = isArray(sup) ? sup : [sup];
	                sup = supers.shift();
	                child.__meta = childMeta;
	                childProto = getNew(sup);
	                childProto.__meta = meta;
	                childProto.__getters__ = merge({}, childProto.__getters__ || {});
	                childProto.__setters__ = merge({}, childProto.__setters__ || {});
	                child.__getters__ = merge({}, child.__getters__ || {});
	                child.__setters__ = merge({}, child.__setters__ || {});
	                mixinSupers(sup.prototype, instanceSupers, bases);
	                mixinSupers(sup, staticSupers, staticBases);
	            } else {
	                child.__meta = childMeta;
	                childProto.__meta = meta;
	                childProto.__getters__ = childProto.__getters__ || {};
	                childProto.__setters__ = childProto.__setters__ || {};
	                child.__getters__ = child.__getters__ || {};
	                child.__setters__ = child.__setters__ || {};
	            }
	            child.prototype = childProto;
	            if (proto) {
	                var instance = meta.proto = proto.instance || {};
	                var stat = childMeta.proto = proto.static || {};
	                stat.init = stat.init || defaultFunction;
	                defineProps(childProto, instance);
	                defineProps(child, stat);
	                if (!instance.hasOwnProperty("constructor")) {
	                    childProto.constructor = instance.constructor = functionWrapper(defaultFunction, "constructor");
	                } else {
	                    childProto.constructor = functionWrapper(instance.constructor, "constructor");
	                }
	            } else {
	                meta.proto = {};
	                childMeta.proto = {};
	                child.init = functionWrapper(defaultFunction, "init");
	                childProto.constructor = functionWrapper(defaultFunction, "constructor");
	            }
	            if (supers.length) {
	                mixin.apply(child, supers);
	            }
	            if (sup) {
	                //do this so we mixin our super methods directly but do not ov
	                merge(child, merge(merge({}, sup), child));
	            }
	            childProto._super = child._super = callSuper;
	            childProto._getSuper = child._getSuper = getSuper;
	            childProto._static = child;
	        }

	        function declare(sup, proto) {
	            function declared() {
	                switch (arguments.length) {
	                case 0:
	                    this.constructor.call(this);
	                    break;
	                case 1:
	                    this.constructor.call(this, arguments[0]);
	                    break;
	                case 2:
	                    this.constructor.call(this, arguments[0], arguments[1]);
	                    break;
	                case 3:
	                    this.constructor.call(this, arguments[0], arguments[1], arguments[2]);
	                    break;
	                default:
	                    this.constructor.apply(this, arguments);
	                }
	            }

	            __declare(declared, sup, proto);
	            return declared.init() || declared;
	        }

	        function singleton(sup, proto) {
	            var retInstance;

	            function declaredSingleton() {
	                if (!retInstance) {
	                    this.constructor.apply(this, arguments);
	                    retInstance = this;
	                }
	                return retInstance;
	            }

	            __declare(declaredSingleton, sup, proto);
	            return  declaredSingleton.init() || declaredSingleton;
	        }

	        Base = declare({
	            instance: {
	                "get": getter,
	                "set": setter
	            },

	            "static": {
	                "get": getter,
	                "set": setter,
	                mixin: mixin,
	                extend: extend,
	                as: _export
	            }
	        });

	        declare.singleton = singleton;
	        return declare;
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = createDeclared();
	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(createDeclared);
	    } else {
	        this.declare = createDeclared();
	    }
	}());





/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";
	    /*global extended isExtended*/

	    function defineObject(extended, is, arr) {

	        var deepEqual = is.deepEqual,
	            isString = is.isString,
	            isHash = is.isHash,
	            difference = arr.difference,
	            hasOwn = Object.prototype.hasOwnProperty,
	            isFunction = is.isFunction;

	        function _merge(target, source) {
	            var name, s;
	            for (name in source) {
	                if (hasOwn.call(source, name)) {
	                    s = source[name];
	                    if (!(name in target) || (target[name] !== s)) {
	                        target[name] = s;
	                    }
	                }
	            }
	            return target;
	        }

	        function _deepMerge(target, source) {
	            var name, s, t;
	            for (name in source) {
	                if (hasOwn.call(source, name)) {
	                    s = source[name];
	                    t = target[name];
	                    if (!deepEqual(t, s)) {
	                        if (isHash(t) && isHash(s)) {
	                            target[name] = _deepMerge(t, s);
	                        } else if (isHash(s)) {
	                            target[name] = _deepMerge({}, s);
	                        } else {
	                            target[name] = s;
	                        }
	                    }
	                }
	            }
	            return target;
	        }


	        function merge(obj) {
	            if (!obj) {
	                obj = {};
	            }
	            for (var i = 1, l = arguments.length; i < l; i++) {
	                _merge(obj, arguments[i]);
	            }
	            return obj; // Object
	        }

	        function deepMerge(obj) {
	            if (!obj) {
	                obj = {};
	            }
	            for (var i = 1, l = arguments.length; i < l; i++) {
	                _deepMerge(obj, arguments[i]);
	            }
	            return obj; // Object
	        }


	        function extend(parent, child) {
	            var proto = parent.prototype || parent;
	            merge(proto, child);
	            return parent;
	        }

	        function forEach(hash, iterator, scope) {
	            if (!isHash(hash) || !isFunction(iterator)) {
	                throw new TypeError();
	            }
	            var objKeys = keys(hash), key;
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                key = objKeys[i];
	                iterator.call(scope || hash, hash[key], key, hash);
	            }
	            return hash;
	        }

	        function filter(hash, iterator, scope) {
	            if (!isHash(hash) || !isFunction(iterator)) {
	                throw new TypeError();
	            }
	            var objKeys = keys(hash), key, value, ret = {};
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                key = objKeys[i];
	                value = hash[key];
	                if (iterator.call(scope || hash, value, key, hash)) {
	                    ret[key] = value;
	                }
	            }
	            return ret;
	        }

	        function values(hash) {
	            if (!isHash(hash)) {
	                throw new TypeError();
	            }
	            var objKeys = keys(hash), ret = [];
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                ret.push(hash[objKeys[i]]);
	            }
	            return ret;
	        }


	        function keys(hash) {
	            if (!isHash(hash)) {
	                throw new TypeError();
	            }
	            var ret = [];
	            for (var i in hash) {
	                if (hasOwn.call(hash, i)) {
	                    ret.push(i);
	                }
	            }
	            return ret;
	        }

	        function invert(hash) {
	            if (!isHash(hash)) {
	                throw new TypeError();
	            }
	            var objKeys = keys(hash), key, ret = {};
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                key = objKeys[i];
	                ret[hash[key]] = key;
	            }
	            return ret;
	        }

	        function toArray(hash) {
	            if (!isHash(hash)) {
	                throw new TypeError();
	            }
	            var objKeys = keys(hash), key, ret = [];
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                key = objKeys[i];
	                ret.push([key, hash[key]]);
	            }
	            return ret;
	        }

	        function omit(hash, omitted) {
	            if (!isHash(hash)) {
	                throw new TypeError();
	            }
	            if (isString(omitted)) {
	                omitted = [omitted];
	            }
	            var objKeys = difference(keys(hash), omitted), key, ret = {};
	            for (var i = 0, len = objKeys.length; i < len; ++i) {
	                key = objKeys[i];
	                ret[key] = hash[key];
	            }
	            return ret;
	        }

	        var hash = {
	            forEach: forEach,
	            filter: filter,
	            invert: invert,
	            values: values,
	            toArray: toArray,
	            keys: keys,
	            omit: omit
	        };


	        var obj = {
	            extend: extend,
	            merge: merge,
	            deepMerge: deepMerge,
	            omit: omit
	        };

	        var ret = extended.define(is.isObject, obj).define(isHash, hash).define(is.isFunction, {extend: extend}).expose({hash: hash}).expose(obj);
	        var orig = ret.extend;
	        ret.extend = function __extend() {
	            if (arguments.length === 1) {
	                return orig.extend.apply(ret, arguments);
	            } else {
	                extend.apply(null, arguments);
	            }
	        };
	        return ret;

	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineObject(__webpack_require__(33), __webpack_require__(32), __webpack_require__(39));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended", "is-extended", "array-extended"], function (extended, is, array) {
	            return defineObject(extended, is, array);
	        });
	    } else {
	        this.objectExtended = defineObject(this.extended, this.isExtended, this.arrayExtended);
	    }

	}).call(this);








/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";
	    /*global define*/

	    function defineArray(extended, is, args) {

	        var isString = is.isString,
	            isArray = Array.isArray || is.isArray,
	            isDate = is.isDate,
	            floor = Math.floor,
	            abs = Math.abs,
	            mathMax = Math.max,
	            mathMin = Math.min,
	            arrayProto = Array.prototype,
	            arrayIndexOf = arrayProto.indexOf,
	            arrayForEach = arrayProto.forEach,
	            arrayMap = arrayProto.map,
	            arrayReduce = arrayProto.reduce,
	            arrayReduceRight = arrayProto.reduceRight,
	            arrayFilter = arrayProto.filter,
	            arrayEvery = arrayProto.every,
	            arraySome = arrayProto.some,
	            argsToArray = args.argsToArray;


	        function cross(num, cros) {
	            return reduceRight(cros, function (a, b) {
	                if (!isArray(b)) {
	                    b = [b];
	                }
	                b.unshift(num);
	                a.unshift(b);
	                return a;
	            }, []);
	        }

	        function permute(num, cross, length) {
	            var ret = [];
	            for (var i = 0; i < cross.length; i++) {
	                ret.push([num].concat(rotate(cross, i)).slice(0, length));
	            }
	            return ret;
	        }


	        function intersection(a, b) {
	            var ret = [], aOne, i = -1, l;
	            l = a.length;
	            while (++i < l) {
	                aOne = a[i];
	                if (indexOf(b, aOne) !== -1) {
	                    ret.push(aOne);
	                }
	            }
	            return ret;
	        }


	        var _sort = (function () {

	            var isAll = function (arr, test) {
	                return every(arr, test);
	            };

	            var defaultCmp = function (a, b) {
	                return a - b;
	            };

	            var dateSort = function (a, b) {
	                return a.getTime() - b.getTime();
	            };

	            return function _sort(arr, property) {
	                var ret = [];
	                if (isArray(arr)) {
	                    ret = arr.slice();
	                    if (property) {
	                        if (typeof property === "function") {
	                            ret.sort(property);
	                        } else {
	                            ret.sort(function (a, b) {
	                                var aProp = a[property], bProp = b[property];
	                                if (isString(aProp) && isString(bProp)) {
	                                    return aProp > bProp ? 1 : aProp < bProp ? -1 : 0;
	                                } else if (isDate(aProp) && isDate(bProp)) {
	                                    return aProp.getTime() - bProp.getTime();
	                                } else {
	                                    return aProp - bProp;
	                                }
	                            });
	                        }
	                    } else {
	                        if (isAll(ret, isString)) {
	                            ret.sort();
	                        } else if (isAll(ret, isDate)) {
	                            ret.sort(dateSort);
	                        } else {
	                            ret.sort(defaultCmp);
	                        }
	                    }
	                }
	                return ret;
	            };

	        })();

	        function indexOf(arr, searchElement, from) {
	            var index = (from || 0) - 1,
	                length = arr.length;
	            while (++index < length) {
	                if (arr[index] === searchElement) {
	                    return index;
	                }
	            }
	            return -1;
	        }

	        function lastIndexOf(arr, searchElement, from) {
	            if (!isArray(arr)) {
	                throw new TypeError();
	            }

	            var t = Object(arr);
	            var len = t.length >>> 0;
	            if (len === 0) {
	                return -1;
	            }

	            var n = len;
	            if (arguments.length > 2) {
	                n = Number(arguments[2]);
	                if (n !== n) {
	                    n = 0;
	                } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
	                    n = (n > 0 || -1) * floor(abs(n));
	                }
	            }

	            var k = n >= 0 ? mathMin(n, len - 1) : len - abs(n);

	            for (; k >= 0; k--) {
	                if (k in t && t[k] === searchElement) {
	                    return k;
	                }
	            }
	            return -1;
	        }

	        function filter(arr, iterator, scope) {
	            if (arr && arrayFilter && arrayFilter === arr.filter) {
	                return arr.filter(iterator, scope);
	            }
	            if (!isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }

	            var t = Object(arr);
	            var len = t.length >>> 0;
	            var res = [];
	            for (var i = 0; i < len; i++) {
	                if (i in t) {
	                    var val = t[i]; // in case fun mutates this
	                    if (iterator.call(scope, val, i, t)) {
	                        res.push(val);
	                    }
	                }
	            }
	            return res;
	        }

	        function forEach(arr, iterator, scope) {
	            if (!isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }
	            if (arr && arrayForEach && arrayForEach === arr.forEach) {
	                arr.forEach(iterator, scope);
	                return arr;
	            }
	            for (var i = 0, len = arr.length; i < len; ++i) {
	                iterator.call(scope || arr, arr[i], i, arr);
	            }

	            return arr;
	        }

	        function every(arr, iterator, scope) {
	            if (arr && arrayEvery && arrayEvery === arr.every) {
	                return arr.every(iterator, scope);
	            }
	            if (!isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }
	            var t = Object(arr);
	            var len = t.length >>> 0;
	            for (var i = 0; i < len; i++) {
	                if (i in t && !iterator.call(scope, t[i], i, t)) {
	                    return false;
	                }
	            }
	            return true;
	        }

	        function some(arr, iterator, scope) {
	            if (arr && arraySome && arraySome === arr.some) {
	                return arr.some(iterator, scope);
	            }
	            if (!isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }
	            var t = Object(arr);
	            var len = t.length >>> 0;
	            for (var i = 0; i < len; i++) {
	                if (i in t && iterator.call(scope, t[i], i, t)) {
	                    return true;
	                }
	            }
	            return false;
	        }

	        function map(arr, iterator, scope) {
	            if (arr && arrayMap && arrayMap === arr.map) {
	                return arr.map(iterator, scope);
	            }
	            if (!isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }

	            var t = Object(arr);
	            var len = t.length >>> 0;
	            var res = [];
	            for (var i = 0; i < len; i++) {
	                if (i in t) {
	                    res.push(iterator.call(scope, t[i], i, t));
	                }
	            }
	            return res;
	        }

	        function reduce(arr, accumulator, curr) {
	            var initial = arguments.length > 2;
	            if (arr && arrayReduce && arrayReduce === arr.reduce) {
	                return initial ? arr.reduce(accumulator, curr) : arr.reduce(accumulator);
	            }
	            if (!isArray(arr) || typeof accumulator !== "function") {
	                throw new TypeError();
	            }
	            var i = 0, l = arr.length >> 0;
	            if (arguments.length < 3) {
	                if (l === 0) {
	                    throw new TypeError("Array length is 0 and no second argument");
	                }
	                curr = arr[0];
	                i = 1; // start accumulating at the second element
	            } else {
	                curr = arguments[2];
	            }
	            while (i < l) {
	                if (i in arr) {
	                    curr = accumulator.call(undefined, curr, arr[i], i, arr);
	                }
	                ++i;
	            }
	            return curr;
	        }

	        function reduceRight(arr, accumulator, curr) {
	            var initial = arguments.length > 2;
	            if (arr && arrayReduceRight && arrayReduceRight === arr.reduceRight) {
	                return initial ? arr.reduceRight(accumulator, curr) : arr.reduceRight(accumulator);
	            }
	            if (!isArray(arr) || typeof accumulator !== "function") {
	                throw new TypeError();
	            }

	            var t = Object(arr);
	            var len = t.length >>> 0;

	            // no value to return if no initial value, empty array
	            if (len === 0 && arguments.length === 2) {
	                throw new TypeError();
	            }

	            var k = len - 1;
	            if (arguments.length >= 3) {
	                curr = arguments[2];
	            } else {
	                do {
	                    if (k in arr) {
	                        curr = arr[k--];
	                        break;
	                    }
	                }
	                while (true);
	            }
	            while (k >= 0) {
	                if (k in t) {
	                    curr = accumulator.call(undefined, curr, t[k], k, t);
	                }
	                k--;
	            }
	            return curr;
	        }


	        function toArray(o) {
	            var ret = [];
	            if (o !== null) {
	                var args = argsToArray(arguments);
	                if (args.length === 1) {
	                    if (isArray(o)) {
	                        ret = o;
	                    } else if (is.isHash(o)) {
	                        for (var i in o) {
	                            if (o.hasOwnProperty(i)) {
	                                ret.push([i, o[i]]);
	                            }
	                        }
	                    } else {
	                        ret.push(o);
	                    }
	                } else {
	                    forEach(args, function (a) {
	                        ret = ret.concat(toArray(a));
	                    });
	                }
	            }
	            return ret;
	        }

	        function sum(array) {
	            array = array || [];
	            if (array.length) {
	                return reduce(array, function (a, b) {
	                    return a + b;
	                });
	            } else {
	                return 0;
	            }
	        }

	        function avg(arr) {
	            arr = arr || [];
	            if (arr.length) {
	                var total = sum(arr);
	                if (is.isNumber(total)) {
	                    return  total / arr.length;
	                } else {
	                    throw new Error("Cannot average an array of non numbers.");
	                }
	            } else {
	                return 0;
	            }
	        }

	        function sort(arr, cmp) {
	            return _sort(arr, cmp);
	        }

	        function min(arr, cmp) {
	            return _sort(arr, cmp)[0];
	        }

	        function max(arr, cmp) {
	            return _sort(arr, cmp)[arr.length - 1];
	        }

	        function difference(arr1) {
	            var ret = arr1, args = flatten(argsToArray(arguments, 1));
	            if (isArray(arr1)) {
	                ret = filter(arr1, function (a) {
	                    return indexOf(args, a) === -1;
	                });
	            }
	            return ret;
	        }

	        function removeDuplicates(arr) {
	            var ret = [], i = -1, l, retLength = 0;
	            if (arr) {
	                l = arr.length;
	                while (++i < l) {
	                    var item = arr[i];
	                    if (indexOf(ret, item) === -1) {
	                        ret[retLength++] = item;
	                    }
	                }
	            }
	            return ret;
	        }


	        function unique(arr) {
	            return removeDuplicates(arr);
	        }


	        function rotate(arr, numberOfTimes) {
	            var ret = arr.slice();
	            if (typeof numberOfTimes !== "number") {
	                numberOfTimes = 1;
	            }
	            if (numberOfTimes && isArray(arr)) {
	                if (numberOfTimes > 0) {
	                    ret.push(ret.shift());
	                    numberOfTimes--;
	                } else {
	                    ret.unshift(ret.pop());
	                    numberOfTimes++;
	                }
	                return rotate(ret, numberOfTimes);
	            } else {
	                return ret;
	            }
	        }

	        function permutations(arr, length) {
	            var ret = [];
	            if (isArray(arr)) {
	                var copy = arr.slice(0);
	                if (typeof length !== "number") {
	                    length = arr.length;
	                }
	                if (!length) {
	                    ret = [
	                        []
	                    ];
	                } else if (length <= arr.length) {
	                    ret = reduce(arr, function (a, b, i) {
	                        var ret;
	                        if (length > 1) {
	                            ret = permute(b, rotate(copy, i).slice(1), length);
	                        } else {
	                            ret = [
	                                [b]
	                            ];
	                        }
	                        return a.concat(ret);
	                    }, []);
	                }
	            }
	            return ret;
	        }

	        function zip() {
	            var ret = [];
	            var arrs = argsToArray(arguments);
	            if (arrs.length > 1) {
	                var arr1 = arrs.shift();
	                if (isArray(arr1)) {
	                    ret = reduce(arr1, function (a, b, i) {
	                        var curr = [b];
	                        for (var j = 0; j < arrs.length; j++) {
	                            var currArr = arrs[j];
	                            if (isArray(currArr) && !is.isUndefined(currArr[i])) {
	                                curr.push(currArr[i]);
	                            } else {
	                                curr.push(null);
	                            }
	                        }
	                        a.push(curr);
	                        return a;
	                    }, []);
	                }
	            }
	            return ret;
	        }

	        function transpose(arr) {
	            var ret = [];
	            if (isArray(arr) && arr.length) {
	                var last;
	                forEach(arr, function (a) {
	                    if (isArray(a) && (!last || a.length === last.length)) {
	                        forEach(a, function (b, i) {
	                            if (!ret[i]) {
	                                ret[i] = [];
	                            }
	                            ret[i].push(b);
	                        });
	                        last = a;
	                    }
	                });
	            }
	            return ret;
	        }

	        function valuesAt(arr, indexes) {
	            var ret = [];
	            indexes = argsToArray(arguments);
	            arr = indexes.shift();
	            if (isArray(arr) && indexes.length) {
	                for (var i = 0, l = indexes.length; i < l; i++) {
	                    ret.push(arr[indexes[i]] || null);
	                }
	            }
	            return ret;
	        }

	        function union() {
	            var ret = [];
	            var arrs = argsToArray(arguments);
	            if (arrs.length > 1) {
	                for (var i = 0, l = arrs.length; i < l; i++) {
	                    ret = ret.concat(arrs[i]);
	                }
	                ret = removeDuplicates(ret);
	            }
	            return ret;
	        }

	        function intersect() {
	            var collect = [], sets, i = -1 , l;
	            if (arguments.length > 1) {
	                //assume we are intersections all the lists in the array
	                sets = argsToArray(arguments);
	            } else {
	                sets = arguments[0];
	            }
	            if (isArray(sets)) {
	                collect = sets[0];
	                i = 0;
	                l = sets.length;
	                while (++i < l) {
	                    collect = intersection(collect, sets[i]);
	                }
	            }
	            return removeDuplicates(collect);
	        }

	        function powerSet(arr) {
	            var ret = [];
	            if (isArray(arr) && arr.length) {
	                ret = reduce(arr, function (a, b) {
	                    var ret = map(a, function (c) {
	                        return c.concat(b);
	                    });
	                    return a.concat(ret);
	                }, [
	                    []
	                ]);
	            }
	            return ret;
	        }

	        function cartesian(a, b) {
	            var ret = [];
	            if (isArray(a) && isArray(b) && a.length && b.length) {
	                ret = cross(a[0], b).concat(cartesian(a.slice(1), b));
	            }
	            return ret;
	        }

	        function compact(arr) {
	            var ret = [];
	            if (isArray(arr) && arr.length) {
	                ret = filter(arr, function (item) {
	                    return !is.isUndefinedOrNull(item);
	                });
	            }
	            return ret;
	        }

	        function multiply(arr, times) {
	            times = is.isNumber(times) ? times : 1;
	            if (!times) {
	                //make sure times is greater than zero if it is zero then dont multiply it
	                times = 1;
	            }
	            arr = toArray(arr || []);
	            var ret = [], i = 0;
	            while (++i <= times) {
	                ret = ret.concat(arr);
	            }
	            return ret;
	        }

	        function flatten(arr) {
	            var set;
	            var args = argsToArray(arguments);
	            if (args.length > 1) {
	                //assume we are intersections all the lists in the array
	                set = args;
	            } else {
	                set = toArray(arr);
	            }
	            return reduce(set, function (a, b) {
	                return a.concat(b);
	            }, []);
	        }

	        function pluck(arr, prop) {
	            prop = prop.split(".");
	            var result = arr.slice(0);
	            forEach(prop, function (prop) {
	                var exec = prop.match(/(\w+)\(\)$/);
	                result = map(result, function (item) {
	                    return exec ? item[exec[1]]() : item[prop];
	                });
	            });
	            return result;
	        }

	        function invoke(arr, func, args) {
	            args = argsToArray(arguments, 2);
	            return map(arr, function (item) {
	                var exec = isString(func) ? item[func] : func;
	                return exec.apply(item, args);
	            });
	        }


	        var array = {
	            toArray: toArray,
	            sum: sum,
	            avg: avg,
	            sort: sort,
	            min: min,
	            max: max,
	            difference: difference,
	            removeDuplicates: removeDuplicates,
	            unique: unique,
	            rotate: rotate,
	            permutations: permutations,
	            zip: zip,
	            transpose: transpose,
	            valuesAt: valuesAt,
	            union: union,
	            intersect: intersect,
	            powerSet: powerSet,
	            cartesian: cartesian,
	            compact: compact,
	            multiply: multiply,
	            flatten: flatten,
	            pluck: pluck,
	            invoke: invoke,
	            forEach: forEach,
	            map: map,
	            filter: filter,
	            reduce: reduce,
	            reduceRight: reduceRight,
	            some: some,
	            every: every,
	            indexOf: indexOf,
	            lastIndexOf: lastIndexOf
	        };

	        return extended.define(isArray, array).expose(array);
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineArray(__webpack_require__(33), __webpack_require__(32), __webpack_require__(40));
	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended", "is-extended", "arguments-extended"], function (extended, is, args) {
	            return defineArray(extended, is, args);
	        });
	    } else {
	        this.arrayExtended = defineArray(this.extended, this.isExtended, this.argumentsExtended);
	    }

	}).call(this);








/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";

	    function defineArgumentsExtended(extended, is) {

	        var pSlice = Array.prototype.slice,
	            isArguments = is.isArguments;

	        function argsToArray(args, slice) {
	            var i = -1, j = 0, l = args.length, ret = [];
	            slice = slice || 0;
	            i += slice;
	            while (++i < l) {
	                ret[j++] = args[i];
	            }
	            return ret;
	        }


	        return extended
	            .define(isArguments, {
	                toArray: argsToArray
	            })
	            .expose({
	                argsToArray: argsToArray
	            });
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineArgumentsExtended(__webpack_require__(33), __webpack_require__(32));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended", "is-extended"], function (extended, is) {
	            return defineArgumentsExtended(extended, is);
	        });
	    } else {
	        this.argumentsExtended = defineArgumentsExtended(this.extended, this.isExtended);
	    }

	}).call(this);



/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";

	    function defineString(extended, is, date, arr) {

	        var stringify;
	        if (typeof JSON === "undefined") {
	            /*
	             json2.js
	             2012-10-08

	             Public Domain.

	             NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	             */

	            (function () {
	                function f(n) {
	                    // Format integers to have at least two digits.
	                    return n < 10 ? '0' + n : n;
	                }

	                var isPrimitive = is.tester().isString().isNumber().isBoolean().tester();

	                function toJSON(obj) {
	                    if (is.isDate(obj)) {
	                        return isFinite(obj.valueOf()) ? obj.getUTCFullYear() + '-' +
	                            f(obj.getUTCMonth() + 1) + '-' +
	                            f(obj.getUTCDate()) + 'T' +
	                            f(obj.getUTCHours()) + ':' +
	                            f(obj.getUTCMinutes()) + ':' +
	                            f(obj.getUTCSeconds()) + 'Z'
	                            : null;
	                    } else if (isPrimitive(obj)) {
	                        return obj.valueOf();
	                    }
	                    return obj;
	                }

	                var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	                    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	                    gap,
	                    indent,
	                    meta = {    // table of character substitutions
	                        '\b': '\\b',
	                        '\t': '\\t',
	                        '\n': '\\n',
	                        '\f': '\\f',
	                        '\r': '\\r',
	                        '"': '\\"',
	                        '\\': '\\\\'
	                    },
	                    rep;


	                function quote(string) {
	                    escapable.lastIndex = 0;
	                    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	                        var c = meta[a];
	                        return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	                    }) + '"' : '"' + string + '"';
	                }


	                function str(key, holder) {

	                    var i, k, v, length, mind = gap, partial, value = holder[key];
	                    if (value) {
	                        value = toJSON(value);
	                    }
	                    if (typeof rep === 'function') {
	                        value = rep.call(holder, key, value);
	                    }
	                    switch (typeof value) {
	                    case 'string':
	                        return quote(value);
	                    case 'number':
	                        return isFinite(value) ? String(value) : 'null';
	                    case 'boolean':
	                    case 'null':
	                        return String(value);
	                    case 'object':
	                        if (!value) {
	                            return 'null';
	                        }
	                        gap += indent;
	                        partial = [];
	                        if (Object.prototype.toString.apply(value) === '[object Array]') {
	                            length = value.length;
	                            for (i = 0; i < length; i += 1) {
	                                partial[i] = str(i, value) || 'null';
	                            }
	                            v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
	                            gap = mind;
	                            return v;
	                        }
	                        if (rep && typeof rep === 'object') {
	                            length = rep.length;
	                            for (i = 0; i < length; i += 1) {
	                                if (typeof rep[i] === 'string') {
	                                    k = rep[i];
	                                    v = str(k, value);
	                                    if (v) {
	                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                                    }
	                                }
	                            }
	                        } else {
	                            for (k in value) {
	                                if (Object.prototype.hasOwnProperty.call(value, k)) {
	                                    v = str(k, value);
	                                    if (v) {
	                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                                    }
	                                }
	                            }
	                        }
	                        v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
	                        gap = mind;
	                        return v;
	                    }
	                }

	                stringify = function (value, replacer, space) {
	                    var i;
	                    gap = '';
	                    indent = '';
	                    if (typeof space === 'number') {
	                        for (i = 0; i < space; i += 1) {
	                            indent += ' ';
	                        }
	                    } else if (typeof space === 'string') {
	                        indent = space;
	                    }
	                    rep = replacer;
	                    if (replacer && typeof replacer !== 'function' &&
	                        (typeof replacer !== 'object' ||
	                            typeof replacer.length !== 'number')) {
	                        throw new Error('JSON.stringify');
	                    }
	                    return str('', {'': value});
	                };
	            }());
	        } else {
	            stringify = JSON.stringify;
	        }


	        var isHash = is.isHash, aSlice = Array.prototype.slice;

	        var FORMAT_REGEX = /%((?:-?\+?.?\d*)?|(?:\[[^\[|\]]*\]))?([sjdDZ])/g;
	        var INTERP_REGEX = /\{(?:\[([^\[|\]]*)\])?(\w+)\}/g;
	        var STR_FORMAT = /(-?)(\+?)([A-Z|a-z|\W]?)([1-9][0-9]*)?$/;
	        var OBJECT_FORMAT = /([1-9][0-9]*)$/g;

	        function formatString(string, format) {
	            var ret = string;
	            if (STR_FORMAT.test(format)) {
	                var match = format.match(STR_FORMAT);
	                var isLeftJustified = match[1], padChar = match[3], width = match[4];
	                if (width) {
	                    width = parseInt(width, 10);
	                    if (ret.length < width) {
	                        ret = pad(ret, width, padChar, isLeftJustified);
	                    } else {
	                        ret = truncate(ret, width);
	                    }
	                }
	            }
	            return ret;
	        }

	        function formatNumber(number, format) {
	            var ret;
	            if (is.isNumber(number)) {
	                ret = "" + number;
	                if (STR_FORMAT.test(format)) {
	                    var match = format.match(STR_FORMAT);
	                    var isLeftJustified = match[1], signed = match[2], padChar = match[3], width = match[4];
	                    if (signed) {
	                        ret = (number > 0 ? "+" : "") + ret;
	                    }
	                    if (width) {
	                        width = parseInt(width, 10);
	                        if (ret.length < width) {
	                            ret = pad(ret, width, padChar || "0", isLeftJustified);
	                        } else {
	                            ret = truncate(ret, width);
	                        }
	                    }

	                }
	            } else {
	                throw new Error("stringExtended.format : when using %d the parameter must be a number!");
	            }
	            return ret;
	        }

	        function formatObject(object, format) {
	            var ret, match = format.match(OBJECT_FORMAT), spacing = 0;
	            if (match) {
	                spacing = parseInt(match[0], 10);
	                if (isNaN(spacing)) {
	                    spacing = 0;
	                }
	            }
	            try {
	                ret = stringify(object, null, spacing);
	            } catch (e) {
	                throw new Error("stringExtended.format : Unable to parse json from ", object);
	            }
	            return ret;
	        }


	        var styles = {
	            //styles
	            bold: 1,
	            bright: 1,
	            italic: 3,
	            underline: 4,
	            blink: 5,
	            inverse: 7,
	            crossedOut: 9,

	            red: 31,
	            green: 32,
	            yellow: 33,
	            blue: 34,
	            magenta: 35,
	            cyan: 36,
	            white: 37,

	            redBackground: 41,
	            greenBackground: 42,
	            yellowBackground: 43,
	            blueBackground: 44,
	            magentaBackground: 45,
	            cyanBackground: 46,
	            whiteBackground: 47,

	            encircled: 52,
	            overlined: 53,
	            grey: 90,
	            black: 90
	        };

	        var characters = {
	            SMILEY: "☺",
	            SOLID_SMILEY: "☻",
	            HEART: "♥",
	            DIAMOND: "♦",
	            CLOVE: "♣",
	            SPADE: "♠",
	            DOT: "•",
	            SQUARE_CIRCLE: "◘",
	            CIRCLE: "○",
	            FILLED_SQUARE_CIRCLE: "◙",
	            MALE: "♂",
	            FEMALE: "♀",
	            EIGHT_NOTE: "♪",
	            DOUBLE_EIGHTH_NOTE: "♫",
	            SUN: "☼",
	            PLAY: "►",
	            REWIND: "◄",
	            UP_DOWN: "↕",
	            PILCROW: "¶",
	            SECTION: "§",
	            THICK_MINUS: "▬",
	            SMALL_UP_DOWN: "↨",
	            UP_ARROW: "↑",
	            DOWN_ARROW: "↓",
	            RIGHT_ARROW: "→",
	            LEFT_ARROW: "←",
	            RIGHT_ANGLE: "∟",
	            LEFT_RIGHT_ARROW: "↔",
	            TRIANGLE: "▲",
	            DOWN_TRIANGLE: "▼",
	            HOUSE: "⌂",
	            C_CEDILLA: "Ç",
	            U_UMLAUT: "ü",
	            E_ACCENT: "é",
	            A_LOWER_CIRCUMFLEX: "â",
	            A_LOWER_UMLAUT: "ä",
	            A_LOWER_GRAVE_ACCENT: "à",
	            A_LOWER_CIRCLE_OVER: "å",
	            C_LOWER_CIRCUMFLEX: "ç",
	            E_LOWER_CIRCUMFLEX: "ê",
	            E_LOWER_UMLAUT: "ë",
	            E_LOWER_GRAVE_ACCENT: "è",
	            I_LOWER_UMLAUT: "ï",
	            I_LOWER_CIRCUMFLEX: "î",
	            I_LOWER_GRAVE_ACCENT: "ì",
	            A_UPPER_UMLAUT: "Ä",
	            A_UPPER_CIRCLE: "Å",
	            E_UPPER_ACCENT: "É",
	            A_E_LOWER: "æ",
	            A_E_UPPER: "Æ",
	            O_LOWER_CIRCUMFLEX: "ô",
	            O_LOWER_UMLAUT: "ö",
	            O_LOWER_GRAVE_ACCENT: "ò",
	            U_LOWER_CIRCUMFLEX: "û",
	            U_LOWER_GRAVE_ACCENT: "ù",
	            Y_LOWER_UMLAUT: "ÿ",
	            O_UPPER_UMLAUT: "Ö",
	            U_UPPER_UMLAUT: "Ü",
	            CENTS: "¢",
	            POUND: "£",
	            YEN: "¥",
	            CURRENCY: "¤",
	            PTS: "₧",
	            FUNCTION: "ƒ",
	            A_LOWER_ACCENT: "á",
	            I_LOWER_ACCENT: "í",
	            O_LOWER_ACCENT: "ó",
	            U_LOWER_ACCENT: "ú",
	            N_LOWER_TILDE: "ñ",
	            N_UPPER_TILDE: "Ñ",
	            A_SUPER: "ª",
	            O_SUPER: "º",
	            UPSIDEDOWN_QUESTION: "¿",
	            SIDEWAYS_L: "⌐",
	            NEGATION: "¬",
	            ONE_HALF: "½",
	            ONE_FOURTH: "¼",
	            UPSIDEDOWN_EXCLAMATION: "¡",
	            DOUBLE_LEFT: "«",
	            DOUBLE_RIGHT: "»",
	            LIGHT_SHADED_BOX: "░",
	            MEDIUM_SHADED_BOX: "▒",
	            DARK_SHADED_BOX: "▓",
	            VERTICAL_LINE: "│",
	            MAZE__SINGLE_RIGHT_T: "┤",
	            MAZE_SINGLE_RIGHT_TOP: "┐",
	            MAZE_SINGLE_RIGHT_BOTTOM_SMALL: "┘",
	            MAZE_SINGLE_LEFT_TOP_SMALL: "┌",
	            MAZE_SINGLE_LEFT_BOTTOM_SMALL: "└",
	            MAZE_SINGLE_LEFT_T: "├",
	            MAZE_SINGLE_BOTTOM_T: "┴",
	            MAZE_SINGLE_TOP_T: "┬",
	            MAZE_SINGLE_CENTER: "┼",
	            MAZE_SINGLE_HORIZONTAL_LINE: "─",
	            MAZE_SINGLE_RIGHT_DOUBLECENTER_T: "╡",
	            MAZE_SINGLE_RIGHT_DOUBLE_BL: "╛",
	            MAZE_SINGLE_RIGHT_DOUBLE_T: "╢",
	            MAZE_SINGLE_RIGHT_DOUBLEBOTTOM_TOP: "╖",
	            MAZE_SINGLE_RIGHT_DOUBLELEFT_TOP: "╕",
	            MAZE_SINGLE_LEFT_DOUBLE_T: "╞",
	            MAZE_SINGLE_BOTTOM_DOUBLE_T: "╧",
	            MAZE_SINGLE_TOP_DOUBLE_T: "╤",
	            MAZE_SINGLE_TOP_DOUBLECENTER_T: "╥",
	            MAZE_SINGLE_BOTTOM_DOUBLECENTER_T: "╨",
	            MAZE_SINGLE_LEFT_DOUBLERIGHT_BOTTOM: "╘",
	            MAZE_SINGLE_LEFT_DOUBLERIGHT_TOP: "╒",
	            MAZE_SINGLE_LEFT_DOUBLEBOTTOM_TOP: "╓",
	            MAZE_SINGLE_LEFT_DOUBLETOP_BOTTOM: "╙",
	            MAZE_SINGLE_LEFT_TOP: "Γ",
	            MAZE_SINGLE_RIGHT_BOTTOM: "╜",
	            MAZE_SINGLE_LEFT_CENTER: "╟",
	            MAZE_SINGLE_DOUBLECENTER_CENTER: "╫",
	            MAZE_SINGLE_DOUBLECROSS_CENTER: "╪",
	            MAZE_DOUBLE_LEFT_CENTER: "╣",
	            MAZE_DOUBLE_VERTICAL: "║",
	            MAZE_DOUBLE_RIGHT_TOP: "╗",
	            MAZE_DOUBLE_RIGHT_BOTTOM: "╝",
	            MAZE_DOUBLE_LEFT_BOTTOM: "╚",
	            MAZE_DOUBLE_LEFT_TOP: "╔",
	            MAZE_DOUBLE_BOTTOM_T: "╩",
	            MAZE_DOUBLE_TOP_T: "╦",
	            MAZE_DOUBLE_LEFT_T: "╠",
	            MAZE_DOUBLE_HORIZONTAL: "═",
	            MAZE_DOUBLE_CROSS: "╬",
	            SOLID_RECTANGLE: "█",
	            THICK_LEFT_VERTICAL: "▌",
	            THICK_RIGHT_VERTICAL: "▐",
	            SOLID_SMALL_RECTANGLE_BOTTOM: "▄",
	            SOLID_SMALL_RECTANGLE_TOP: "▀",
	            PHI_UPPER: "Φ",
	            INFINITY: "∞",
	            INTERSECTION: "∩",
	            DEFINITION: "≡",
	            PLUS_MINUS: "±",
	            GT_EQ: "≥",
	            LT_EQ: "≤",
	            THEREFORE: "⌠",
	            SINCE: "∵",
	            DOESNOT_EXIST: "∄",
	            EXISTS: "∃",
	            FOR_ALL: "∀",
	            EXCLUSIVE_OR: "⊕",
	            BECAUSE: "⌡",
	            DIVIDE: "÷",
	            APPROX: "≈",
	            DEGREE: "°",
	            BOLD_DOT: "∙",
	            DOT_SMALL: "·",
	            CHECK: "√",
	            ITALIC_X: "✗",
	            SUPER_N: "ⁿ",
	            SQUARED: "²",
	            CUBED: "³",
	            SOLID_BOX: "■",
	            PERMILE: "‰",
	            REGISTERED_TM: "®",
	            COPYRIGHT: "©",
	            TRADEMARK: "™",
	            BETA: "β",
	            GAMMA: "γ",
	            ZETA: "ζ",
	            ETA: "η",
	            IOTA: "ι",
	            KAPPA: "κ",
	            LAMBDA: "λ",
	            NU: "ν",
	            XI: "ξ",
	            OMICRON: "ο",
	            RHO: "ρ",
	            UPSILON: "υ",
	            CHI_LOWER: "φ",
	            CHI_UPPER: "χ",
	            PSI: "ψ",
	            ALPHA: "α",
	            ESZETT: "ß",
	            PI: "π",
	            SIGMA_UPPER: "Σ",
	            SIGMA_LOWER: "σ",
	            MU: "µ",
	            TAU: "τ",
	            THETA: "Θ",
	            OMEGA: "Ω",
	            DELTA: "δ",
	            PHI_LOWER: "φ",
	            EPSILON: "ε"
	        };

	        function pad(string, length, ch, end) {
	            string = "" + string; //check for numbers
	            ch = ch || " ";
	            var strLen = string.length;
	            while (strLen < length) {
	                if (end) {
	                    string += ch;
	                } else {
	                    string = ch + string;
	                }
	                strLen++;
	            }
	            return string;
	        }

	        function truncate(string, length, end) {
	            var ret = string;
	            if (is.isString(ret)) {
	                if (string.length > length) {
	                    if (end) {
	                        var l = string.length;
	                        ret = string.substring(l - length, l);
	                    } else {
	                        ret = string.substring(0, length);
	                    }
	                }
	            } else {
	                ret = truncate("" + ret, length);
	            }
	            return ret;
	        }

	        function format(str, obj) {
	            if (obj instanceof Array) {
	                var i = 0, len = obj.length;
	                //find the matches
	                return str.replace(FORMAT_REGEX, function (m, format, type) {
	                    var replacer, ret;
	                    if (i < len) {
	                        replacer = obj[i++];
	                    } else {
	                        //we are out of things to replace with so
	                        //just return the match?
	                        return m;
	                    }
	                    if (m === "%s" || m === "%d" || m === "%D") {
	                        //fast path!
	                        ret = replacer + "";
	                    } else if (m === "%Z") {
	                        ret = replacer.toUTCString();
	                    } else if (m === "%j") {
	                        try {
	                            ret = stringify(replacer);
	                        } catch (e) {
	                            throw new Error("stringExtended.format : Unable to parse json from ", replacer);
	                        }
	                    } else {
	                        format = format.replace(/^\[|\]$/g, "");
	                        switch (type) {
	                        case "s":
	                            ret = formatString(replacer, format);
	                            break;
	                        case "d":
	                            ret = formatNumber(replacer, format);
	                            break;
	                        case "j":
	                            ret = formatObject(replacer, format);
	                            break;
	                        case "D":
	                            ret = date.format(replacer, format);
	                            break;
	                        case "Z":
	                            ret = date.format(replacer, format, true);
	                            break;
	                        }
	                    }
	                    return ret;
	                });
	            } else if (isHash(obj)) {
	                return str.replace(INTERP_REGEX, function (m, format, value) {
	                    value = obj[value];
	                    if (!is.isUndefined(value)) {
	                        if (format) {
	                            if (is.isString(value)) {
	                                return formatString(value, format);
	                            } else if (is.isNumber(value)) {
	                                return formatNumber(value, format);
	                            } else if (is.isDate(value)) {
	                                return date.format(value, format);
	                            } else if (is.isObject(value)) {
	                                return formatObject(value, format);
	                            }
	                        } else {
	                            return "" + value;
	                        }
	                    }
	                    return m;
	                });
	            } else {
	                var args = aSlice.call(arguments).slice(1);
	                return format(str, args);
	            }
	        }

	        function toArray(testStr, delim) {
	            var ret = [];
	            if (testStr) {
	                if (testStr.indexOf(delim) > 0) {
	                    ret = testStr.replace(/\s+/g, "").split(delim);
	                }
	                else {
	                    ret.push(testStr);
	                }
	            }
	            return ret;
	        }

	        function multiply(str, times) {
	            var ret = [];
	            if (times) {
	                for (var i = 0; i < times; i++) {
	                    ret.push(str);
	                }
	            }
	            return ret.join("");
	        }


	        function style(str, options) {
	            var ret, i, l;
	            if (options) {
	                if (is.isArray(str)) {
	                    ret = [];
	                    for (i = 0, l = str.length; i < l; i++) {
	                        ret.push(style(str[i], options));
	                    }
	                } else if (options instanceof Array) {
	                    ret = str;
	                    for (i = 0, l = options.length; i < l; i++) {
	                        ret = style(ret, options[i]);
	                    }
	                } else if (options in styles) {
	                    ret = '\x1B[' + styles[options] + 'm' + str + '\x1B[0m';
	                }
	            }
	            return ret;
	        }

	        function escape(str, except) {
	            return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function (ch) {
	                if (except && arr.indexOf(except, ch) !== -1) {
	                    return ch;
	                }
	                return "\\" + ch;
	            });
	        }

	        function trim(str) {
	            return str.replace(/^\s*|\s*$/g, "");
	        }

	        function trimLeft(str) {
	            return str.replace(/^\s*/, "");
	        }

	        function trimRight(str) {
	            return str.replace(/\s*$/, "");
	        }

	        function isEmpty(str) {
	            return str.length === 0;
	        }


	        var string = {
	            toArray: toArray,
	            pad: pad,
	            truncate: truncate,
	            multiply: multiply,
	            format: format,
	            style: style,
	            escape: escape,
	            trim: trim,
	            trimLeft: trimLeft,
	            trimRight: trimRight,
	            isEmpty: isEmpty
	        };
	        return extended.define(is.isString, string).define(is.isArray, {style: style}).expose(string).expose({characters: characters});
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineString(__webpack_require__(33), __webpack_require__(32), __webpack_require__(42), __webpack_require__(39));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended", "is-extended", "date-extended", "array-extended"], function (extended, is, date, arr) {
	            return defineString(extended, is, date, arr);
	        });
	    } else {
	        this.stringExtended = defineString(this.extended, this.isExtended, this.dateExtended, this.arrayExtended);
	    }

	}).call(this);








/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	(function () {
	    "use strict";

	    function defineDate(extended, is, array) {

	        function _pad(string, length, ch, end) {
	            string = "" + string; //check for numbers
	            ch = ch || " ";
	            var strLen = string.length;
	            while (strLen < length) {
	                if (end) {
	                    string += ch;
	                } else {
	                    string = ch + string;
	                }
	                strLen++;
	            }
	            return string;
	        }

	        function _truncate(string, length, end) {
	            var ret = string;
	            if (is.isString(ret)) {
	                if (string.length > length) {
	                    if (end) {
	                        var l = string.length;
	                        ret = string.substring(l - length, l);
	                    } else {
	                        ret = string.substring(0, length);
	                    }
	                }
	            } else {
	                ret = _truncate("" + ret, length);
	            }
	            return ret;
	        }

	        function every(arr, iterator, scope) {
	            if (!is.isArray(arr) || typeof iterator !== "function") {
	                throw new TypeError();
	            }
	            var t = Object(arr);
	            var len = t.length >>> 0;
	            for (var i = 0; i < len; i++) {
	                if (i in t && !iterator.call(scope, t[i], i, t)) {
	                    return false;
	                }
	            }
	            return true;
	        }


	        var transforms = (function () {
	                var floor = Math.floor, round = Math.round;

	                var addMap = {
	                    day: function addDay(date, amount) {
	                        return [amount, "Date", false];
	                    },
	                    weekday: function addWeekday(date, amount) {
	                        // Divide the increment time span into weekspans plus leftover days
	                        // e.g., 8 days is one 5-day weekspan / and two leftover days
	                        // Can't have zero leftover days, so numbers divisible by 5 get
	                        // a days value of 5, and the remaining days make up the number of weeks
	                        var days, weeks, mod = amount % 5, strt = date.getDay(), adj = 0;
	                        if (!mod) {
	                            days = (amount > 0) ? 5 : -5;
	                            weeks = (amount > 0) ? ((amount - 5) / 5) : ((amount + 5) / 5);
	                        } else {
	                            days = mod;
	                            weeks = parseInt(amount / 5, 10);
	                        }
	                        if (strt === 6 && amount > 0) {
	                            adj = 1;
	                        } else if (strt === 0 && amount < 0) {
	                            // Orig date is Sun / negative increment
	                            // Jump back over Sat
	                            adj = -1;
	                        }
	                        // Get weekday val for the new date
	                        var trgt = strt + days;
	                        // New date is on Sat or Sun
	                        if (trgt === 0 || trgt === 6) {
	                            adj = (amount > 0) ? 2 : -2;
	                        }
	                        // Increment by number of weeks plus leftover days plus
	                        // weekend adjustments
	                        return [(7 * weeks) + days + adj, "Date", false];
	                    },
	                    year: function addYear(date, amount) {
	                        return [amount, "FullYear", true];
	                    },
	                    week: function addWeek(date, amount) {
	                        return [amount * 7, "Date", false];
	                    },
	                    quarter: function addYear(date, amount) {
	                        return [amount * 3, "Month", true];
	                    },
	                    month: function addYear(date, amount) {
	                        return [amount, "Month", true];
	                    }
	                };

	                function addTransform(interval, date, amount) {
	                    interval = interval.replace(/s$/, "");
	                    if (addMap.hasOwnProperty(interval)) {
	                        return addMap[interval](date, amount);
	                    }
	                    return [amount, "UTC" + interval.charAt(0).toUpperCase() + interval.substring(1) + "s", false];
	                }


	                var differenceMap = {
	                    "quarter": function quarterDifference(date1, date2, utc) {
	                        var yearDiff = date2.getFullYear() - date1.getFullYear();
	                        var m1 = date1[utc ? "getUTCMonth" : "getMonth"]();
	                        var m2 = date2[utc ? "getUTCMonth" : "getMonth"]();
	                        // Figure out which quarter the months are in
	                        var q1 = floor(m1 / 3) + 1;
	                        var q2 = floor(m2 / 3) + 1;
	                        // Add quarters for any year difference between the dates
	                        q2 += (yearDiff * 4);
	                        return q2 - q1;
	                    },

	                    "weekday": function weekdayDifference(date1, date2, utc) {
	                        var days = differenceTransform("day", date1, date2, utc), weeks;
	                        var mod = days % 7;
	                        // Even number of weeks
	                        if (mod === 0) {
	                            days = differenceTransform("week", date1, date2, utc) * 5;
	                        } else {
	                            // Weeks plus spare change (< 7 days)
	                            var adj = 0, aDay = date1[utc ? "getUTCDay" : "getDay"](), bDay = date2[utc ? "getUTCDay" : "getDay"]();
	                            weeks = parseInt(days / 7, 10);
	                            // Mark the date advanced by the number of
	                            // round weeks (may be zero)
	                            var dtMark = new Date(+date1);
	                            dtMark.setDate(dtMark[utc ? "getUTCDate" : "getDate"]() + (weeks * 7));
	                            var dayMark = dtMark[utc ? "getUTCDay" : "getDay"]();

	                            // Spare change days -- 6 or less
	                            if (days > 0) {
	                                if (aDay === 6 || bDay === 6) {
	                                    adj = -1;
	                                } else if (aDay === 0) {
	                                    adj = 0;
	                                } else if (bDay === 0 || (dayMark + mod) > 5) {
	                                    adj = -2;
	                                }
	                            } else if (days < 0) {
	                                if (aDay === 6) {
	                                    adj = 0;
	                                } else if (aDay === 0 || bDay === 0) {
	                                    adj = 1;
	                                } else if (bDay === 6 || (dayMark + mod) < 0) {
	                                    adj = 2;
	                                }
	                            }
	                            days += adj;
	                            days -= (weeks * 2);
	                        }
	                        return days;
	                    },
	                    year: function (date1, date2) {
	                        return date2.getFullYear() - date1.getFullYear();
	                    },
	                    month: function (date1, date2, utc) {
	                        var m1 = date1[utc ? "getUTCMonth" : "getMonth"]();
	                        var m2 = date2[utc ? "getUTCMonth" : "getMonth"]();
	                        return (m2 - m1) + ((date2.getFullYear() - date1.getFullYear()) * 12);
	                    },
	                    week: function (date1, date2, utc) {
	                        return round(differenceTransform("day", date1, date2, utc) / 7);
	                    },
	                    day: function (date1, date2) {
	                        return 1.1574074074074074e-8 * (date2.getTime() - date1.getTime());
	                    },
	                    hour: function (date1, date2) {
	                        return 2.7777777777777776e-7 * (date2.getTime() - date1.getTime());
	                    },
	                    minute: function (date1, date2) {
	                        return 0.000016666666666666667 * (date2.getTime() - date1.getTime());
	                    },
	                    second: function (date1, date2) {
	                        return 0.001 * (date2.getTime() - date1.getTime());
	                    },
	                    millisecond: function (date1, date2) {
	                        return date2.getTime() - date1.getTime();
	                    }
	                };


	                function differenceTransform(interval, date1, date2, utc) {
	                    interval = interval.replace(/s$/, "");
	                    return round(differenceMap[interval](date1, date2, utc));
	                }


	                return {
	                    addTransform: addTransform,
	                    differenceTransform: differenceTransform
	                };
	            }()),
	            addTransform = transforms.addTransform,
	            differenceTransform = transforms.differenceTransform;


	        /**
	         * @ignore
	         * Based on DOJO Date Implementation
	         *
	         * Dojo is available under *either* the terms of the modified BSD license *or* the
	         * Academic Free License version 2.1. As a recipient of Dojo, you may choose which
	         * license to receive this code under (except as noted in per-module LICENSE
	         * files). Some modules may not be the copyright of the Dojo Foundation. These
	         * modules contain explicit declarations of copyright in both the LICENSE files in
	         * the directories in which they reside and in the code itself. No external
	         * contributions are allowed under licenses which are fundamentally incompatible
	         * with the AFL or BSD licenses that Dojo is distributed under.
	         *
	         */

	        var floor = Math.floor, round = Math.round, min = Math.min, pow = Math.pow, ceil = Math.ceil, abs = Math.abs;
	        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	        var monthAbbr = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
	        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	        var dayAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	        var eraNames = ["Before Christ", "Anno Domini"];
	        var eraAbbr = ["BC", "AD"];


	        function getDayOfYear(/*Date*/dateObject, utc) {
	            // summary: gets the day of the year as represented by dateObject
	            return date.difference(new Date(dateObject.getFullYear(), 0, 1, dateObject.getHours()), dateObject, null, utc) + 1; // Number
	        }

	        function getWeekOfYear(/*Date*/dateObject, /*Number*/firstDayOfWeek, utc) {
	            firstDayOfWeek = firstDayOfWeek || 0;
	            var fullYear = dateObject[utc ? "getUTCFullYear" : "getFullYear"]();
	            var firstDayOfYear = new Date(fullYear, 0, 1).getDay(),
	                adj = (firstDayOfYear - firstDayOfWeek + 7) % 7,
	                week = floor((getDayOfYear(dateObject) + adj - 1) / 7);

	            // if year starts on the specified day, start counting weeks at 1
	            if (firstDayOfYear === firstDayOfWeek) {
	                week++;
	            }

	            return week; // Number
	        }

	        function getTimezoneName(/*Date*/dateObject) {
	            var str = dateObject.toString();
	            var tz = '';
	            var pos = str.indexOf('(');
	            if (pos > -1) {
	                tz = str.substring(++pos, str.indexOf(')'));
	            }
	            return tz; // String
	        }


	        function buildDateEXP(pattern, tokens) {
	            return pattern.replace(/([a-z])\1*/ig,function (match) {
	                // Build a simple regexp.  Avoid captures, which would ruin the tokens list
	                var s,
	                    c = match.charAt(0),
	                    l = match.length,
	                    p2 = '0?',
	                    p3 = '0{0,2}';
	                if (c === 'y') {
	                    s = '\\d{2,4}';
	                } else if (c === "M") {
	                    s = (l > 2) ? '\\S+?' : '1[0-2]|' + p2 + '[1-9]';
	                } else if (c === "D") {
	                    s = '[12][0-9][0-9]|3[0-5][0-9]|36[0-6]|' + p3 + '[1-9][0-9]|' + p2 + '[1-9]';
	                } else if (c === "d") {
	                    s = '3[01]|[12]\\d|' + p2 + '[1-9]';
	                } else if (c === "w") {
	                    s = '[1-4][0-9]|5[0-3]|' + p2 + '[1-9]';
	                } else if (c === "E") {
	                    s = '\\S+';
	                } else if (c === "h") {
	                    s = '1[0-2]|' + p2 + '[1-9]';
	                } else if (c === "K") {
	                    s = '1[01]|' + p2 + '\\d';
	                } else if (c === "H") {
	                    s = '1\\d|2[0-3]|' + p2 + '\\d';
	                } else if (c === "k") {
	                    s = '1\\d|2[0-4]|' + p2 + '[1-9]';
	                } else if (c === "m" || c === "s") {
	                    s = '[0-5]\\d';
	                } else if (c === "S") {
	                    s = '\\d{' + l + '}';
	                } else if (c === "a") {
	                    var am = 'AM', pm = 'PM';
	                    s = am + '|' + pm;
	                    if (am !== am.toLowerCase()) {
	                        s += '|' + am.toLowerCase();
	                    }
	                    if (pm !== pm.toLowerCase()) {
	                        s += '|' + pm.toLowerCase();
	                    }
	                    s = s.replace(/\./g, "\\.");
	                } else if (c === 'v' || c === 'z' || c === 'Z' || c === 'G' || c === 'q' || c === 'Q') {
	                    s = ".*";
	                } else {
	                    s = c === " " ? "\\s*" : c + "*";
	                }
	                if (tokens) {
	                    tokens.push(match);
	                }

	                return "(" + s + ")"; // add capture
	            }).replace(/[\xa0 ]/g, "[\\s\\xa0]"); // normalize whitespace.  Need explicit handling of \xa0 for IE.
	        }


	        /**
	         * @namespace Utilities for Dates
	         */
	        var date = {

	            /**@lends date*/

	            /**
	             * Returns the number of days in the month of a date
	             *
	             * @example
	             *
	             *  dateExtender.getDaysInMonth(new Date(2006, 1, 1)); //28
	             *  dateExtender.getDaysInMonth(new Date(2004, 1, 1)); //29
	             *  dateExtender.getDaysInMonth(new Date(2006, 2, 1)); //31
	             *  dateExtender.getDaysInMonth(new Date(2006, 3, 1)); //30
	             *  dateExtender.getDaysInMonth(new Date(2006, 4, 1)); //31
	             *  dateExtender.getDaysInMonth(new Date(2006, 5, 1)); //30
	             *  dateExtender.getDaysInMonth(new Date(2006, 6, 1)); //31
	             * @param {Date} dateObject the date containing the month
	             * @return {Number} the number of days in the month
	             */
	            getDaysInMonth: function (/*Date*/dateObject) {
	                //	summary:
	                //		Returns the number of days in the month used by dateObject
	                var month = dateObject.getMonth();
	                var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	                if (month === 1 && date.isLeapYear(dateObject)) {
	                    return 29;
	                } // Number
	                return days[month]; // Number
	            },

	            /**
	             * Determines if a date is a leap year
	             *
	             * @example
	             *
	             *  dateExtender.isLeapYear(new Date(1600, 0, 1)); //true
	             *  dateExtender.isLeapYear(new Date(2004, 0, 1)); //true
	             *  dateExtender.isLeapYear(new Date(2000, 0, 1)); //true
	             *  dateExtender.isLeapYear(new Date(2006, 0, 1)); //false
	             *  dateExtender.isLeapYear(new Date(1900, 0, 1)); //false
	             *  dateExtender.isLeapYear(new Date(1800, 0, 1)); //false
	             *  dateExtender.isLeapYear(new Date(1700, 0, 1)); //false
	             *
	             * @param {Date} dateObject
	             * @returns {Boolean} true if it is a leap year false otherwise
	             */
	            isLeapYear: function (/*Date*/dateObject, utc) {
	                var year = dateObject[utc ? "getUTCFullYear" : "getFullYear"]();
	                return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);

	            },

	            /**
	             * Determines if a date is on a weekend
	             *
	             * @example
	             *
	             * var thursday = new Date(2006, 8, 21);
	             * var saturday = new Date(2006, 8, 23);
	             * var sunday = new Date(2006, 8, 24);
	             * var monday = new Date(2006, 8, 25);
	             * dateExtender.isWeekend(thursday)); //false
	             * dateExtender.isWeekend(saturday); //true
	             * dateExtender.isWeekend(sunday); //true
	             * dateExtender.isWeekend(monday)); //false
	             *
	             * @param {Date} dateObject the date to test
	             *
	             * @returns {Boolean} true if the date is a weekend
	             */
	            isWeekend: function (/*Date?*/dateObject, utc) {
	                // summary:
	                //	Determines if the date falls on a weekend, according to local custom.
	                var day = (dateObject || new Date())[utc ? "getUTCDay" : "getDay"]();
	                return day === 0 || day === 6;
	            },

	            /**
	             * Get the timezone of a date
	             *
	             * @example
	             *  //just setting the strLocal to simulate the toString() of a date
	             *  dt.str = 'Sun Sep 17 2006 22:25:51 GMT-0500 (CDT)';
	             *  //just setting the strLocal to simulate the locale
	             *  dt.strLocale = 'Sun 17 Sep 2006 10:25:51 PM CDT';
	             *  dateExtender.getTimezoneName(dt); //'CDT'
	             *  dt.str = 'Sun Sep 17 2006 22:57:18 GMT-0500 (CDT)';
	             *  dt.strLocale = 'Sun Sep 17 22:57:18 2006';
	             *  dateExtender.getTimezoneName(dt); //'CDT'
	             * @param dateObject the date to get the timezone from
	             *
	             * @returns {String} the timezone of the date
	             */
	            getTimezoneName: getTimezoneName,

	            /**
	             * Compares two dates
	             *
	             * @example
	             *
	             * var d1 = new Date();
	             * d1.setHours(0);
	             * dateExtender.compare(d1, d1); // 0
	             *
	             *  var d1 = new Date();
	             *  d1.setHours(0);
	             *  var d2 = new Date();
	             *  d2.setFullYear(2005);
	             *  d2.setHours(12);
	             *  dateExtender.compare(d1, d2, "date"); // 1
	             *  dateExtender.compare(d1, d2, "datetime"); // 1
	             *
	             *  var d1 = new Date();
	             *  d1.setHours(0);
	             *  var d2 = new Date();
	             *  d2.setFullYear(2005);
	             *  d2.setHours(12);
	             *  dateExtender.compare(d2, d1, "date"); // -1
	             *  dateExtender.compare(d1, d2, "time"); //-1
	             *
	             * @param {Date|String} date1 the date to comapare
	             * @param {Date|String} [date2=new Date()] the date to compare date1 againse
	             * @param {"date"|"time"|"datetime"} portion compares the portion specified
	             *
	             * @returns -1 if date1 is < date2 0 if date1 === date2  1 if date1 > date2
	             */
	            compare: function (/*Date*/date1, /*Date*/date2, /*String*/portion) {
	                date1 = new Date(+date1);
	                date2 = new Date(+(date2 || new Date()));

	                if (portion === "date") {
	                    // Ignore times and compare dates.
	                    date1.setHours(0, 0, 0, 0);
	                    date2.setHours(0, 0, 0, 0);
	                } else if (portion === "time") {
	                    // Ignore dates and compare times.
	                    date1.setFullYear(0, 0, 0);
	                    date2.setFullYear(0, 0, 0);
	                }
	                return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
	            },


	            /**
	             * Adds a specified interval and amount to a date
	             *
	             * @example
	             *  var dtA = new Date(2005, 11, 27);
	             *  dateExtender.add(dtA, "year", 1); //new Date(2006, 11, 27);
	             *  dateExtender.add(dtA, "years", 1); //new Date(2006, 11, 27);
	             *
	             *  dtA = new Date(2000, 0, 1);
	             *  dateExtender.add(dtA, "quarter", 1); //new Date(2000, 3, 1);
	             *  dateExtender.add(dtA, "quarters", 1); //new Date(2000, 3, 1);
	             *
	             *  dtA = new Date(2000, 0, 1);
	             *  dateExtender.add(dtA, "month", 1); //new Date(2000, 1, 1);
	             *  dateExtender.add(dtA, "months", 1); //new Date(2000, 1, 1);
	             *
	             *  dtA = new Date(2000, 0, 31);
	             *  dateExtender.add(dtA, "month", 1); //new Date(2000, 1, 29);
	             *  dateExtender.add(dtA, "months", 1); //new Date(2000, 1, 29);
	             *
	             *  dtA = new Date(2000, 0, 1);
	             *  dateExtender.add(dtA, "week", 1); //new Date(2000, 0, 8);
	             *  dateExtender.add(dtA, "weeks", 1); //new Date(2000, 0, 8);
	             *
	             *  dtA = new Date(2000, 0, 1);
	             *  dateExtender.add(dtA, "day", 1); //new Date(2000, 0, 2);
	             *
	             *  dtA = new Date(2000, 0, 1);
	             *  dateExtender.add(dtA, "weekday", 1); //new Date(2000, 0, 3);
	             *
	             *  dtA = new Date(2000, 0, 1, 11);
	             *  dateExtender.add(dtA, "hour", 1); //new Date(2000, 0, 1, 12);
	             *
	             *  dtA = new Date(2000, 11, 31, 23, 59);
	             *  dateExtender.add(dtA, "minute", 1); //new Date(2001, 0, 1, 0, 0);
	             *
	             *  dtA = new Date(2000, 11, 31, 23, 59, 59);
	             *  dateExtender.add(dtA, "second", 1); //new Date(2001, 0, 1, 0, 0, 0);
	             *
	             *  dtA = new Date(2000, 11, 31, 23, 59, 59, 999);
	             *  dateExtender.add(dtA, "millisecond", 1); //new Date(2001, 0, 1, 0, 0, 0, 0);
	             *
	             * @param {Date} date
	             * @param {String} interval the interval to add
	             *  <ul>
	             *      <li>day | days</li>
	             *      <li>weekday | weekdays</li>
	             *      <li>year | years</li>
	             *      <li>week | weeks</li>
	             *      <li>quarter | quarters</li>
	             *      <li>months | months</li>
	             *      <li>hour | hours</li>
	             *      <li>minute | minutes</li>
	             *      <li>second | seconds</li>
	             *      <li>millisecond | milliseconds</li>
	             *  </ul>
	             * @param {Number} [amount=0] the amount to add
	             */
	            add: function (/*Date*/date, /*String*/interval, /*int*/amount) {
	                var res = addTransform(interval, date, amount || 0);
	                amount = res[0];
	                var property = res[1];
	                var sum = new Date(+date);
	                var fixOvershoot = res[2];
	                if (property) {
	                    sum["set" + property](sum["get" + property]() + amount);
	                }

	                if (fixOvershoot && (sum.getDate() < date.getDate())) {
	                    sum.setDate(0);
	                }

	                return sum; // Date
	            },

	            /**
	             * Finds the difference between two dates based on the specified interval
	             *
	             * @example
	             *
	             * var dtA, dtB;
	             *
	             * dtA = new Date(2005, 11, 27);
	             * dtB = new Date(2006, 11, 27);
	             * dateExtender.difference(dtA, dtB, "year"); //1
	             *
	             * dtA = new Date(2000, 1, 29);
	             * dtB = new Date(2001, 2, 1);
	             * dateExtender.difference(dtA, dtB, "quarter"); //4
	             * dateExtender.difference(dtA, dtB, "month"); //13
	             *
	             * dtA = new Date(2000, 1, 1);
	             * dtB = new Date(2000, 1, 8);
	             * dateExtender.difference(dtA, dtB, "week"); //1
	             *
	             * dtA = new Date(2000, 1, 29);
	             * dtB = new Date(2000, 2, 1);
	             * dateExtender.difference(dtA, dtB, "day"); //1
	             *
	             * dtA = new Date(2006, 7, 3);
	             * dtB = new Date(2006, 7, 11);
	             * dateExtender.difference(dtA, dtB, "weekday"); //6
	             *
	             * dtA = new Date(2000, 11, 31, 23);
	             * dtB = new Date(2001, 0, 1, 0);
	             * dateExtender.difference(dtA, dtB, "hour"); //1
	             *
	             * dtA = new Date(2000, 11, 31, 23, 59);
	             * dtB = new Date(2001, 0, 1, 0, 0);
	             * dateExtender.difference(dtA, dtB, "minute"); //1
	             *
	             * dtA = new Date(2000, 11, 31, 23, 59, 59);
	             * dtB = new Date(2001, 0, 1, 0, 0, 0);
	             * dateExtender.difference(dtA, dtB, "second"); //1
	             *
	             * dtA = new Date(2000, 11, 31, 23, 59, 59, 999);
	             * dtB = new Date(2001, 0, 1, 0, 0, 0, 0);
	             * dateExtender.difference(dtA, dtB, "millisecond"); //1
	             *
	             *
	             * @param {Date} date1
	             * @param {Date} [date2 = new Date()]
	             * @param {String} [interval = "day"] the intercal to find the difference of.
	             *   <ul>
	             *      <li>day | days</li>
	             *      <li>weekday | weekdays</li>
	             *      <li>year | years</li>
	             *      <li>week | weeks</li>
	             *      <li>quarter | quarters</li>
	             *      <li>months | months</li>
	             *      <li>hour | hours</li>
	             *      <li>minute | minutes</li>
	             *      <li>second | seconds</li>
	             *      <li>millisecond | milliseconds</li>
	             *  </ul>
	             */
	            difference: function (/*Date*/date1, /*Date?*/date2, /*String*/interval, utc) {
	                date2 = date2 || new Date();
	                interval = interval || "day";
	                return differenceTransform(interval, date1, date2, utc);
	            },

	            /**
	             * Formats a date to the specidifed format string
	             *
	             * @example
	             *
	             * var date = new Date(2006, 7, 11, 0, 55, 12, 345);
	             * dateExtender.format(date, "EEEE, MMMM dd, yyyy"); //"Friday, August 11, 2006"
	             * dateExtender.format(date, "M/dd/yy"); //"8/11/06"
	             * dateExtender.format(date, "E"); //"6"
	             * dateExtender.format(date, "h:m a"); //"12:55 AM"
	             * dateExtender.format(date, 'h:m:s'); //"12:55:12"
	             * dateExtender.format(date, 'h:m:s.SS'); //"12:55:12.35"
	             * dateExtender.format(date, 'k:m:s.SS'); //"24:55:12.35"
	             * dateExtender.format(date, 'H:m:s.SS'); //"0:55:12.35"
	             * dateExtender.format(date, "ddMMyyyy"); //"11082006"
	             *
	             * @param date the date to format
	             * @param {String} format the format of the date composed of the following options
	             * <ul>
	             *                  <li> G    Era designator    Text    AD</li>
	             *                  <li> y    Year    Year    1996; 96</li>
	             *                  <li> M    Month in year    Month    July; Jul; 07</li>
	             *                  <li> w    Week in year    Number    27</li>
	             *                  <li> W    Week in month    Number    2</li>
	             *                  <li> D    Day in year    Number    189</li>
	             *                  <li> d    Day in month    Number    10</li>
	             *                  <li> E    Day in week    Text    Tuesday; Tue</li>
	             *                  <li> a    Am/pm marker    Text    PM</li>
	             *                  <li> H    Hour in day (0-23)    Number    0</li>
	             *                  <li> k    Hour in day (1-24)    Number    24</li>
	             *                  <li> K    Hour in am/pm (0-11)    Number    0</li>
	             *                  <li> h    Hour in am/pm (1-12)    Number    12</li>
	             *                  <li> m    Minute in hour    Number    30</li>
	             *                  <li> s    Second in minute    Number    55</li>
	             *                  <li> S    Millisecond    Number    978</li>
	             *                  <li> z    Time zone    General time zone    Pacific Standard Time; PST; GMT-08:00</li>
	             *                  <li> Z    Time zone    RFC 822 time zone    -0800 </li>
	             * </ul>
	             */
	            format: function (date, format, utc) {
	                utc = utc || false;
	                var fullYear, month, day, d, hour, minute, second, millisecond;
	                if (utc) {
	                    fullYear = date.getUTCFullYear();
	                    month = date.getUTCMonth();
	                    day = date.getUTCDay();
	                    d = date.getUTCDate();
	                    hour = date.getUTCHours();
	                    minute = date.getUTCMinutes();
	                    second = date.getUTCSeconds();
	                    millisecond = date.getUTCMilliseconds();
	                } else {
	                    fullYear = date.getFullYear();
	                    month = date.getMonth();
	                    d = date.getDate();
	                    day = date.getDay();
	                    hour = date.getHours();
	                    minute = date.getMinutes();
	                    second = date.getSeconds();
	                    millisecond = date.getMilliseconds();
	                }
	                return format.replace(/([A-Za-z])\1*/g, function (match) {
	                    var s, pad,
	                        c = match.charAt(0),
	                        l = match.length;
	                    if (c === 'd') {
	                        s = "" + d;
	                        pad = true;
	                    } else if (c === "H" && !s) {
	                        s = "" + hour;
	                        pad = true;
	                    } else if (c === 'm' && !s) {
	                        s = "" + minute;
	                        pad = true;
	                    } else if (c === 's') {
	                        if (!s) {
	                            s = "" + second;
	                        }
	                        pad = true;
	                    } else if (c === "G") {
	                        s = ((l < 4) ? eraAbbr : eraNames)[fullYear < 0 ? 0 : 1];
	                    } else if (c === "y") {
	                        s = fullYear;
	                        if (l > 1) {
	                            if (l === 2) {
	                                s = _truncate("" + s, 2, true);
	                            } else {
	                                pad = true;
	                            }
	                        }
	                    } else if (c.toUpperCase() === "Q") {
	                        s = ceil((month + 1) / 3);
	                        pad = true;
	                    } else if (c === "M") {
	                        if (l < 3) {
	                            s = month + 1;
	                            pad = true;
	                        } else {
	                            s = (l === 3 ? monthAbbr : monthNames)[month];
	                        }
	                    } else if (c === "w") {
	                        s = getWeekOfYear(date, 0, utc);
	                        pad = true;
	                    } else if (c === "D") {
	                        s = getDayOfYear(date, utc);
	                        pad = true;
	                    } else if (c === "E") {
	                        if (l < 3) {
	                            s = day + 1;
	                            pad = true;
	                        } else {
	                            s = (l === -3 ? dayAbbr : dayNames)[day];
	                        }
	                    } else if (c === 'a') {
	                        s = (hour < 12) ? 'AM' : 'PM';
	                    } else if (c === "h") {
	                        s = (hour % 12) || 12;
	                        pad = true;
	                    } else if (c === "K") {
	                        s = (hour % 12);
	                        pad = true;
	                    } else if (c === "k") {
	                        s = hour || 24;
	                        pad = true;
	                    } else if (c === "S") {
	                        s = round(millisecond * pow(10, l - 3));
	                        pad = true;
	                    } else if (c === "z" || c === "v" || c === "Z") {
	                        s = getTimezoneName(date);
	                        if ((c === "z" || c === "v") && !s) {
	                            l = 4;
	                        }
	                        if (!s || c === "Z") {
	                            var offset = date.getTimezoneOffset();
	                            var tz = [
	                                (offset >= 0 ? "-" : "+"),
	                                _pad(floor(abs(offset) / 60), 2, "0"),
	                                _pad(abs(offset) % 60, 2, "0")
	                            ];
	                            if (l === 4) {
	                                tz.splice(0, 0, "GMT");
	                                tz.splice(3, 0, ":");
	                            }
	                            s = tz.join("");
	                        }
	                    } else {
	                        s = match;
	                    }
	                    if (pad) {
	                        s = _pad(s, l, '0');
	                    }
	                    return s;
	                });
	            }

	        };

	        var numberDate = {};

	        function addInterval(interval) {
	            numberDate[interval + "sFromNow"] = function (val) {
	                return date.add(new Date(), interval, val);
	            };
	            numberDate[interval + "sAgo"] = function (val) {
	                return date.add(new Date(), interval, -val);
	            };
	        }

	        var intervals = ["year", "month", "day", "hour", "minute", "second"];
	        for (var i = 0, l = intervals.length; i < l; i++) {
	            addInterval(intervals[i]);
	        }

	        var stringDate = {

	            parseDate: function (dateStr, format) {
	                if (!format) {
	                    throw new Error('format required when calling dateExtender.parse');
	                }
	                var tokens = [], regexp = buildDateEXP(format, tokens),
	                    re = new RegExp("^" + regexp + "$", "i"),
	                    match = re.exec(dateStr);
	                if (!match) {
	                    return null;
	                } // null
	                var result = [1970, 0, 1, 0, 0, 0, 0], // will get converted to a Date at the end
	                    amPm = "",
	                    valid = every(match, function (v, i) {
	                        if (i) {
	                            var token = tokens[i - 1];
	                            var l = token.length, type = token.charAt(0);
	                            if (type === 'y') {
	                                if (v < 100) {
	                                    v = parseInt(v, 10);
	                                    //choose century to apply, according to a sliding window
	                                    //of 80 years before and 20 years after present year
	                                    var year = '' + new Date().getFullYear(),
	                                        century = year.substring(0, 2) * 100,
	                                        cutoff = min(year.substring(2, 4) + 20, 99);
	                                    result[0] = (v < cutoff) ? century + v : century - 100 + v;
	                                } else {
	                                    result[0] = v;
	                                }
	                            } else if (type === "M") {
	                                if (l > 2) {
	                                    var months = monthNames, j, k;
	                                    if (l === 3) {
	                                        months = monthAbbr;
	                                    }
	                                    //Tolerate abbreviating period in month part
	                                    //Case-insensitive comparison
	                                    v = v.replace(".", "").toLowerCase();
	                                    var contains = false;
	                                    for (j = 0, k = months.length; j < k && !contains; j++) {
	                                        var s = months[j].replace(".", "").toLocaleLowerCase();
	                                        if (s === v) {
	                                            v = j;
	                                            contains = true;
	                                        }
	                                    }
	                                    if (!contains) {
	                                        return false;
	                                    }
	                                } else {
	                                    v--;
	                                }
	                                result[1] = v;
	                            } else if (type === "E" || type === "e") {
	                                var days = dayNames;
	                                if (l === 3) {
	                                    days = dayAbbr;
	                                }
	                                //Case-insensitive comparison
	                                v = v.toLowerCase();
	                                days = array.map(days, function (d) {
	                                    return d.toLowerCase();
	                                });
	                                var d = array.indexOf(days, v);
	                                if (d === -1) {
	                                    v = parseInt(v, 10);
	                                    if (isNaN(v) || v > days.length) {
	                                        return false;
	                                    }
	                                } else {
	                                    v = d;
	                                }
	                            } else if (type === 'D' || type === "d") {
	                                if (type === "D") {
	                                    result[1] = 0;
	                                }
	                                result[2] = v;
	                            } else if (type === "a") {
	                                var am = "am";
	                                var pm = "pm";
	                                var period = /\./g;
	                                v = v.replace(period, '').toLowerCase();
	                                // we might not have seen the hours field yet, so store the state and apply hour change later
	                                amPm = (v === pm) ? 'p' : (v === am) ? 'a' : '';
	                            } else if (type === "k" || type === "h" || type === "H" || type === "K") {
	                                if (type === "k" && (+v) === 24) {
	                                    v = 0;
	                                }
	                                result[3] = v;
	                            } else if (type === "m") {
	                                result[4] = v;
	                            } else if (type === "s") {
	                                result[5] = v;
	                            } else if (type === "S") {
	                                result[6] = v;
	                            }
	                        }
	                        return true;
	                    });
	                if (valid) {
	                    var hours = +result[3];
	                    //account for am/pm
	                    if (amPm === 'p' && hours < 12) {
	                        result[3] = hours + 12; //e.g., 3pm -> 15
	                    } else if (amPm === 'a' && hours === 12) {
	                        result[3] = 0; //12am -> 0
	                    }
	                    var dateObject = new Date(result[0], result[1], result[2], result[3], result[4], result[5], result[6]); // Date
	                    var dateToken = (array.indexOf(tokens, 'd') !== -1),
	                        monthToken = (array.indexOf(tokens, 'M') !== -1),
	                        month = result[1],
	                        day = result[2],
	                        dateMonth = dateObject.getMonth(),
	                        dateDay = dateObject.getDate();
	                    if ((monthToken && dateMonth > month) || (dateToken && dateDay > day)) {
	                        return null;
	                    }
	                    return dateObject; // Date
	                } else {
	                    return null;
	                }
	            }
	        };


	        var ret = extended.define(is.isDate, date).define(is.isString, stringDate).define(is.isNumber, numberDate);
	        for (i in date) {
	            if (date.hasOwnProperty(i)) {
	                ret[i] = date[i];
	            }
	        }

	        for (i in stringDate) {
	            if (stringDate.hasOwnProperty(i)) {
	                ret[i] = stringDate[i];
	            }
	        }
	        for (i in numberDate) {
	            if (numberDate.hasOwnProperty(i)) {
	                ret[i] = numberDate[i];
	            }
	        }
	        return ret;
	    }

	    if (true) {
	        if ("undefined" !== typeof module && module.exports) {
	            module.exports = defineDate(__webpack_require__(33), __webpack_require__(32), __webpack_require__(39));

	        }
	    } else if ("function" === typeof define && define.amd) {
	        define(["extended", "is-extended", "array-extended"], function (extended, is, arr) {
	            return defineDate(extended, is, arr);
	        });
	    } else {
	        this.dateExtended = defineDate(this.extended, this.isExtended, this.arrayExtended);
	    }

	}).call(this);








/***/ },
/* 43 */
/***/ function(module, exports) {

	exports.endianness = function () { return 'LE' };

	exports.hostname = function () {
	    if (typeof location !== 'undefined') {
	        return location.hostname
	    }
	    else return '';
	};

	exports.loadavg = function () { return [] };

	exports.uptime = function () { return 0 };

	exports.freemem = function () {
	    return Number.MAX_VALUE;
	};

	exports.totalmem = function () {
	    return Number.MAX_VALUE;
	};

	exports.cpus = function () { return [] };

	exports.type = function () { return 'Browser' };

	exports.release = function () {
	    if (typeof navigator !== 'undefined') {
	        return navigator.appVersion;
	    }
	    return '';
	};

	exports.networkInterfaces
	= exports.getNetworkInterfaces
	= function () { return {} };

	exports.arch = function () { return 'javascript' };

	exports.platform = function () { return 'browser' };

	exports.tmpdir = exports.tmpDir = function () {
	    return '/tmp';
	};

	exports.EOL = '\n';


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Stream;

	var EE = __webpack_require__(45).EventEmitter;
	var inherits = __webpack_require__(46);

	inherits(Stream, EE);
	Stream.Readable = __webpack_require__(47);
	Stream.Writable = __webpack_require__(57);
	Stream.Duplex = __webpack_require__(58);
	Stream.Transform = __webpack_require__(59);
	Stream.PassThrough = __webpack_require__(60);

	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;



	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.

	function Stream() {
	  EE.call(this);
	}

	Stream.prototype.pipe = function(dest, options) {
	  var source = this;

	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }

	  source.on('data', ondata);

	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }

	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }

	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest.end();
	  }


	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    if (typeof dest.destroy === 'function') dest.destroy();
	  }

	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EE.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }

	  source.on('error', onerror);
	  dest.on('error', onerror);

	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);

	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);

	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);

	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);

	    dest.removeListener('close', cleanup);
	  }

	  source.on('end', cleanup);
	  source.on('close', cleanup);

	  dest.on('close', cleanup);

	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};


/***/ },
/* 45 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 46 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {exports = module.exports = __webpack_require__(48);
	exports.Stream = __webpack_require__(44);
	exports.Readable = exports;
	exports.Writable = __webpack_require__(53);
	exports.Duplex = __webpack_require__(52);
	exports.Transform = __webpack_require__(55);
	exports.PassThrough = __webpack_require__(56);
	if (!process.browser && process.env.READABLE_STREAM === 'disable') {
	  module.exports = __webpack_require__(44);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Readable;

	/*<replacement>*/
	var isArray = __webpack_require__(49);
	/*</replacement>*/


	/*<replacement>*/
	var Buffer = __webpack_require__(8).Buffer;
	/*</replacement>*/

	Readable.ReadableState = ReadableState;

	var EE = __webpack_require__(45).EventEmitter;

	/*<replacement>*/
	if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/

	var Stream = __webpack_require__(44);

	/*<replacement>*/
	var util = __webpack_require__(50);
	util.inherits = __webpack_require__(46);
	/*</replacement>*/

	var StringDecoder;


	/*<replacement>*/
	var debug = __webpack_require__(51);
	if (debug && debug.debuglog) {
	  debug = debug.debuglog('stream');
	} else {
	  debug = function () {};
	}
	/*</replacement>*/


	util.inherits(Readable, Stream);

	function ReadableState(options, stream) {
	  var Duplex = __webpack_require__(52);

	  options = options || {};

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.buffer = [];
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;


	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex)
	    this.objectMode = this.objectMode || !!options.readableObjectMode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder)
	      StringDecoder = __webpack_require__(54).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}

	function Readable(options) {
	  var Duplex = __webpack_require__(52);

	  if (!(this instanceof Readable))
	    return new Readable(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  Stream.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function(chunk, encoding) {
	  var state = this._readableState;

	  if (util.isString(chunk) && !state.objectMode) {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = new Buffer(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function(chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (util.isNullOrUndefined(chunk)) {
	    state.reading = false;
	    if (!state.ended)
	      onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var e = new Error('stream.unshift() after end event');
	      stream.emit('error', e);
	    } else {
	      if (state.decoder && !addToFront && !encoding)
	        chunk = state.decoder.write(chunk);

	      if (!addToFront)
	        state.reading = false;

	      // if we want the data now, just emit it.
	      if (state.flowing && state.length === 0 && !state.sync) {
	        stream.emit('data', chunk);
	        stream.read(0);
	      } else {
	        // update the buffer info.
	        state.length += state.objectMode ? 1 : chunk.length;
	        if (addToFront)
	          state.buffer.unshift(chunk);
	        else
	          state.buffer.push(chunk);

	        if (state.needReadable)
	          emitReadable(stream);
	      }

	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData(state);
	}



	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended &&
	         (state.needReadable ||
	          state.length < state.highWaterMark ||
	          state.length === 0);
	}

	// backwards compatibility.
	Readable.prototype.setEncoding = function(enc) {
	  if (!StringDecoder)
	    StringDecoder = __webpack_require__(54).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};

	// Don't raise the hwm > 128MB
	var MAX_HWM = 0x800000;
	function roundUpToNextPowerOf2(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2
	    n--;
	    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
	    n++;
	  }
	  return n;
	}

	function howMuchToRead(n, state) {
	  if (state.length === 0 && state.ended)
	    return 0;

	  if (state.objectMode)
	    return n === 0 ? 0 : 1;

	  if (isNaN(n) || util.isNull(n)) {
	    // only flow one buffer at a time
	    if (state.flowing && state.buffer.length)
	      return state.buffer[0].length;
	    else
	      return state.length;
	  }

	  if (n <= 0)
	    return 0;

	  // If we're asking for more than the target buffer level,
	  // then raise the water mark.  Bump up to the next highest
	  // power of 2, to prevent increasing it excessively in tiny
	  // amounts.
	  if (n > state.highWaterMark)
	    state.highWaterMark = roundUpToNextPowerOf2(n);

	  // don't have that much.  return null, unless we've ended.
	  if (n > state.length) {
	    if (!state.ended) {
	      state.needReadable = true;
	      return 0;
	    } else
	      return state.length;
	  }

	  return n;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function(n) {
	  debug('read', n);
	  var state = this._readableState;
	  var nOrig = n;

	  if (!util.isNumber(n) || n > 0)
	    state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 &&
	      state.needReadable &&
	      (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended)
	      endReadable(this);
	    else
	      emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0)
	      endReadable(this);
	    return null;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  }

	  if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0)
	      state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	  }

	  // If _read pushed data synchronously, then `reading` will be false,
	  // and we need to re-evaluate how much data we can return to the user.
	  if (doRead && !state.reading)
	    n = howMuchToRead(nOrig, state);

	  var ret;
	  if (n > 0)
	    ret = fromList(n, state);
	  else
	    ret = null;

	  if (util.isNull(ret)) {
	    state.needReadable = true;
	    n = 0;
	  }

	  state.length -= n;

	  // If we have nothing in the buffer, then we want to know
	  // as soon as we *do* get something into the buffer.
	  if (state.length === 0 && !state.ended)
	    state.needReadable = true;

	  // If we tried to read() past the EOF, then emit end on the next tick.
	  if (nOrig !== n && state.ended && state.length === 0)
	    endReadable(this);

	  if (!util.isNull(ret))
	    this.emit('data', ret);

	  return ret;
	};

	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!util.isBuffer(chunk) &&
	      !util.isString(chunk) &&
	      !util.isNullOrUndefined(chunk) &&
	      !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}


	function onEofChunk(stream, state) {
	  if (state.decoder && !state.ended) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync)
	      process.nextTick(function() {
	        emitReadable_(stream);
	      });
	    else
	      emitReadable_(stream);
	  }
	}

	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}


	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    process.nextTick(function() {
	      maybeReadMore_(stream, state);
	    });
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended &&
	         state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;
	    else
	      len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function(n) {
	  this.emit('error', new Error('not implemented'));
	};

	Readable.prototype.pipe = function(dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
	              dest !== process.stdout &&
	              dest !== process.stderr;

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted)
	    process.nextTick(endFn);
	  else
	    src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }

	  function onend() {
	    debug('onend');
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain &&
	        (!dest._writableState || dest._writableState.needDrain))
	      ondrain();
	  }

	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    var ret = dest.write(chunk);
	    if (false === ret) {
	      debug('false write response, pause',
	            src._readableState.awaitDrain);
	      src._readableState.awaitDrain++;
	      src.pause();
	    }
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EE.listenerCount(dest, 'error') === 0)
	      dest.emit('error', er);
	  }
	  // This is a brutally ugly hack to make sure that our error handler
	  // is attached before any userland ones.  NEVER DO THIS.
	  if (!dest._events || !dest._events.error)
	    dest.on('error', onerror);
	  else if (isArray(dest._events.error))
	    dest._events.error.unshift(onerror);
	  else
	    dest._events.error = [onerror, dest._events.error];



	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function() {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain)
	      state.awaitDrain--;
	    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}


	Readable.prototype.unpipe = function(dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0)
	    return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes)
	      return this;

	    if (!dest)
	      dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest)
	      dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;

	    for (var i = 0; i < len; i++)
	      dests[i].emit('unpipe', this);
	    return this;
	  }

	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1)
	    return this;

	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1)
	    state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function(ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);

	  // If listening to data, and it has not explicitly been paused,
	  // then call resume to start the flow of data on the next tick.
	  if (ev === 'data' && false !== this._readableState.flowing) {
	    this.resume();
	  }

	  if (ev === 'readable' && this.readable) {
	    var state = this._readableState;
	    if (!state.readableListening) {
	      state.readableListening = true;
	      state.emittedReadable = false;
	      state.needReadable = true;
	      if (!state.reading) {
	        var self = this;
	        process.nextTick(function() {
	          debug('readable nexttick read 0');
	          self.read(0);
	        });
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }

	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function() {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    if (!state.reading) {
	      debug('resume read 0');
	      this.read(0);
	    }
	    resume(this, state);
	  }
	  return this;
	};

	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    process.nextTick(function() {
	      resume_(stream, state);
	    });
	  }
	}

	function resume_(stream, state) {
	  state.resumeScheduled = false;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading)
	    stream.read(0);
	}

	Readable.prototype.pause = function() {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};

	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  if (state.flowing) {
	    do {
	      var chunk = stream.read();
	    } while (null !== chunk && state.flowing);
	  }
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function(stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function() {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length)
	        self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function(chunk) {
	    debug('wrapped data');
	    if (state.decoder)
	      chunk = state.decoder.write(chunk);
	    if (!chunk || !state.objectMode && !chunk.length)
	      return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
	      this[i] = function(method) { return function() {
	        return stream[method].apply(stream, arguments);
	      }}(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function(ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function(n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};



	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	function fromList(n, state) {
	  var list = state.buffer;
	  var length = state.length;
	  var stringMode = !!state.decoder;
	  var objectMode = !!state.objectMode;
	  var ret;

	  // nothing in the list, definitely empty.
	  if (list.length === 0)
	    return null;

	  if (length === 0)
	    ret = null;
	  else if (objectMode)
	    ret = list.shift();
	  else if (!n || n >= length) {
	    // read it all, truncate the array.
	    if (stringMode)
	      ret = list.join('');
	    else
	      ret = Buffer.concat(list, length);
	    list.length = 0;
	  } else {
	    // read just some of it.
	    if (n < list[0].length) {
	      // just take a part of the first list item.
	      // slice is the same for buffers and strings.
	      var buf = list[0];
	      ret = buf.slice(0, n);
	      list[0] = buf.slice(n);
	    } else if (n === list[0].length) {
	      // first list is a perfect match
	      ret = list.shift();
	    } else {
	      // complex case.
	      // we have enough to cover it, but it spans past the first buffer.
	      if (stringMode)
	        ret = '';
	      else
	        ret = new Buffer(n);

	      var c = 0;
	      for (var i = 0, l = list.length; i < l && c < n; i++) {
	        var buf = list[0];
	        var cpy = Math.min(n - c, buf.length);

	        if (stringMode)
	          ret += buf.slice(0, cpy);
	        else
	          buf.copy(ret, c, 0, cpy);

	        if (cpy < buf.length)
	          list[0] = buf.slice(cpy);
	        else
	          list.shift();

	        c += cpy;
	      }
	    }
	  }

	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0)
	    throw new Error('endReadable called on non-empty stream');

	  if (!state.endEmitted) {
	    state.ended = true;
	    process.nextTick(function() {
	      // Check that we didn't get one last unshift.
	      if (!state.endEmitted && state.length === 0) {
	        state.endEmitted = true;
	        stream.readable = false;
	        stream.emit('end');
	      }
	    });
	  }
	}

	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf (xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.

	function isArray(arg) {
	  if (Array.isArray) {
	    return Array.isArray(arg);
	  }
	  return objectToString(arg) === '[object Array]';
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = Buffer.isBuffer;

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },
/* 51 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.

	module.exports = Duplex;

	/*<replacement>*/
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}
	/*</replacement>*/


	/*<replacement>*/
	var util = __webpack_require__(50);
	util.inherits = __webpack_require__(46);
	/*</replacement>*/

	var Readable = __webpack_require__(48);
	var Writable = __webpack_require__(53);

	util.inherits(Duplex, Readable);

	forEach(objectKeys(Writable.prototype), function(method) {
	  if (!Duplex.prototype[method])
	    Duplex.prototype[method] = Writable.prototype[method];
	});

	function Duplex(options) {
	  if (!(this instanceof Duplex))
	    return new Duplex(options);

	  Readable.call(this, options);
	  Writable.call(this, options);

	  if (options && options.readable === false)
	    this.readable = false;

	  if (options && options.writable === false)
	    this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false)
	    this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended)
	    return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  process.nextTick(this.end.bind(this));
	}

	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// A bit simpler than readable streams.
	// Implement an async ._write(chunk, cb), and it'll handle all
	// the drain event emission and buffering.

	module.exports = Writable;

	/*<replacement>*/
	var Buffer = __webpack_require__(8).Buffer;
	/*</replacement>*/

	Writable.WritableState = WritableState;


	/*<replacement>*/
	var util = __webpack_require__(50);
	util.inherits = __webpack_require__(46);
	/*</replacement>*/

	var Stream = __webpack_require__(44);

	util.inherits(Writable, Stream);

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	}

	function WritableState(options, stream) {
	  var Duplex = __webpack_require__(52);

	  options = options || {};

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex)
	    this.objectMode = this.objectMode || !!options.writableObjectMode;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function(er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.buffer = [];

	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;

	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;
	}

	function Writable(options) {
	  var Duplex = __webpack_require__(52);

	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex))
	    return new Writable(options);

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  Stream.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function() {
	  this.emit('error', new Error('Cannot pipe. Not readable.'));
	};


	function writeAfterEnd(stream, state, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  process.nextTick(function() {
	    cb(er);
	  });
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  if (!util.isBuffer(chunk) &&
	      !util.isString(chunk) &&
	      !util.isNullOrUndefined(chunk) &&
	      !state.objectMode) {
	    var er = new TypeError('Invalid non-string/buffer chunk');
	    stream.emit('error', er);
	    process.nextTick(function() {
	      cb(er);
	    });
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function(chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }

	  if (util.isBuffer(chunk))
	    encoding = 'buffer';
	  else if (!encoding)
	    encoding = state.defaultEncoding;

	  if (!util.isFunction(cb))
	    cb = function() {};

	  if (state.ended)
	    writeAfterEnd(this, state, cb);
	  else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }

	  return ret;
	};

	Writable.prototype.cork = function() {
	  var state = this._writableState;

	  state.corked++;
	};

	Writable.prototype.uncork = function() {
	  var state = this._writableState;

	  if (state.corked) {
	    state.corked--;

	    if (!state.writing &&
	        !state.corked &&
	        !state.finished &&
	        !state.bufferProcessing &&
	        state.buffer.length)
	      clearBuffer(this, state);
	  }
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode &&
	      state.decodeStrings !== false &&
	      util.isString(chunk)) {
	    chunk = new Buffer(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);
	  if (util.isBuffer(chunk))
	    encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret)
	    state.needDrain = true;

	  if (state.writing || state.corked)
	    state.buffer.push(new WriteReq(chunk, encoding, cb));
	  else
	    doWrite(stream, state, false, len, chunk, encoding, cb);

	  return ret;
	}

	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev)
	    stream._writev(chunk, state.onwrite);
	  else
	    stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  if (sync)
	    process.nextTick(function() {
	      state.pendingcb--;
	      cb(er);
	    });
	  else {
	    state.pendingcb--;
	    cb(er);
	  }

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er)
	    onwriteError(stream, state, sync, er, cb);
	  else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(stream, state);

	    if (!finished &&
	        !state.corked &&
	        !state.bufferProcessing &&
	        state.buffer.length) {
	      clearBuffer(stream, state);
	    }

	    if (sync) {
	      process.nextTick(function() {
	        afterWrite(stream, state, finished, cb);
	      });
	    } else {
	      afterWrite(stream, state, finished, cb);
	    }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished)
	    onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}


	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;

	  if (stream._writev && state.buffer.length > 1) {
	    // Fast case, write everything using _writev()
	    var cbs = [];
	    for (var c = 0; c < state.buffer.length; c++)
	      cbs.push(state.buffer[c].callback);

	    // count the one we are adding, as well.
	    // TODO(isaacs) clean this up
	    state.pendingcb++;
	    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
	      for (var i = 0; i < cbs.length; i++) {
	        state.pendingcb--;
	        cbs[i](err);
	      }
	    });

	    // Clear buffer
	    state.buffer = [];
	  } else {
	    // Slow case, write chunks one-by-one
	    for (var c = 0; c < state.buffer.length; c++) {
	      var entry = state.buffer[c];
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;

	      doWrite(stream, state, false, len, chunk, encoding, cb);

	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        c++;
	        break;
	      }
	    }

	    if (c < state.buffer.length)
	      state.buffer = state.buffer.slice(c);
	    else
	      state.buffer.length = 0;
	  }

	  state.bufferProcessing = false;
	}

	Writable.prototype._write = function(chunk, encoding, cb) {
	  cb(new Error('not implemented'));

	};

	Writable.prototype._writev = null;

	Writable.prototype.end = function(chunk, encoding, cb) {
	  var state = this._writableState;

	  if (util.isFunction(chunk)) {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }

	  if (!util.isNullOrUndefined(chunk))
	    this.write(chunk, encoding);

	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished)
	    endWritable(this, state, cb);
	};


	function needFinish(stream, state) {
	  return (state.ending &&
	          state.length === 0 &&
	          !state.finished &&
	          !state.writing);
	}

	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(stream, state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else
	      prefinish(stream, state);
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished)
	      process.nextTick(cb);
	    else
	      stream.once('finish', cb);
	  }
	  state.ended = true;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var Buffer = __webpack_require__(8).Buffer;

	var isBufferEncoding = Buffer.isEncoding
	  || function(encoding) {
	       switch (encoding && encoding.toLowerCase()) {
	         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
	         default: return false;
	       }
	     }


	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	var StringDecoder = exports.StringDecoder = function(encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }

	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	};


	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function(buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = (buffer.length >= this.charLength - this.charReceived) ?
	        this.charLength - this.charReceived :
	        buffer.length;

	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;

	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }

	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);

	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;

	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }

	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);

	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }

	  charStr += buffer.toString(this.encoding, 0, end);

	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }

	  // or just emit the charStr
	  return charStr;
	};

	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function(buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = (buffer.length >= 3) ? 3 : buffer.length;

	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];

	    // See http://en.wikipedia.org/wiki/UTF-8#Description

	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }

	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }

	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};

	StringDecoder.prototype.end = function(buffer) {
	  var res = '';
	  if (buffer && buffer.length)
	    res = this.write(buffer);

	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }

	  return res;
	};

	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}

	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}

	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.


	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.

	module.exports = Transform;

	var Duplex = __webpack_require__(52);

	/*<replacement>*/
	var util = __webpack_require__(50);
	util.inherits = __webpack_require__(46);
	/*</replacement>*/

	util.inherits(Transform, Duplex);


	function TransformState(options, stream) {
	  this.afterTransform = function(er, data) {
	    return afterTransform(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	}

	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb)
	    return stream.emit('error', new Error('no writecb in Transform class'));

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (!util.isNullOrUndefined(data))
	    stream.push(data);

	  if (cb)
	    cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}


	function Transform(options) {
	  if (!(this instanceof Transform))
	    return new Transform(options);

	  Duplex.call(this, options);

	  this._transformState = new TransformState(options, this);

	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  this.once('prefinish', function() {
	    if (util.isFunction(this._flush))
	      this._flush(function(er) {
	        done(stream, er);
	      });
	    else
	      done(stream);
	  });
	}

	Transform.prototype.push = function(chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function(chunk, encoding, cb) {
	  throw new Error('not implemented');
	};

	Transform.prototype._write = function(chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform ||
	        rs.needReadable ||
	        rs.length < rs.highWaterMark)
	      this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function(n) {
	  var ts = this._transformState;

	  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};


	function done(stream, er) {
	  if (er)
	    return stream.emit('error', er);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;

	  if (ws.length)
	    throw new Error('calling transform done when ws.length != 0');

	  if (ts.transforming)
	    throw new Error('calling transform done when still transforming');

	  return stream.push(null);
	}


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.

	module.exports = PassThrough;

	var Transform = __webpack_require__(55);

	/*<replacement>*/
	var util = __webpack_require__(50);
	util.inherits = __webpack_require__(46);
	/*</replacement>*/

	util.inherits(PassThrough, Transform);

	function PassThrough(options) {
	  if (!(this instanceof PassThrough))
	    return new PassThrough(options);

	  Transform.call(this, options);
	}

	PassThrough.prototype._transform = function(chunk, encoding, cb) {
	  cb(null, chunk);
	};


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(53)


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(52)


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(55)


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(56)


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var extended = __webpack_require__(31),
	    isUndefined = extended.isUndefined,
	    spreadArgs = extended.spreadArgs,
	    util = __webpack_require__(62),
	    out = process.stdout,
	    stream = __webpack_require__(44),
	    EMPTY = /^\s*(?:''|"")?\s*(?:,\s*(?:''|"")?\s*)*$/,
	    DEFAULT_DELIMITER = ",",
	    createParser = __webpack_require__(65),
	    fs = __webpack_require__(12),
	    StringDecoder = __webpack_require__(66).StringDecoder,
	    hasIsPaused = !!stream.Transform.prototype.isPaused;

	function ParserStream(options) {
	    options = options || {};
	    options.objectMode = extended.has(options, "objectMode") ? options.objectMode : true;
	    stream.Transform.call(this, options);
	    this.lines = "";
	    this.decoder = new StringDecoder();
	    this._parsedHeaders = false;
	    this._rowCount = -1;
	    this._emitData = false;
	    var delimiter;
	    if (extended.has(options, "delimiter")) {
	        delimiter = options.delimiter;
	        if (delimiter.length > 1) {
	            throw new Error("delimiter option must be one character long");
	        }
	        delimiter = extended.escape(delimiter);
	    } else {
	        delimiter = DEFAULT_DELIMITER;
	    }
	    options.delimiter = delimiter;
	    this.parser = createParser(options);
	    this._headers = options.headers;
	    this._renameHeaders = options.renameHeaders;
	    this._ignoreEmpty = options.ignoreEmpty;
	    this._discardUnmappedColumns = options.discardUnmappedColumns;
	    this._strictColumnHandling = options.strictColumnHandling;
	    this.__objectMode = options.objectMode;
	    this.__buffered = [];
	    return this;
	}

	util.inherits(ParserStream, stream.Transform);

	var origOn = ParserStream.prototype.on,
	    origEmit = ParserStream.prototype.emit;


	extended(ParserStream).extend({

	    __pausedDone: null,

	    __endEmitted: false,

	    __emittedData: false,

	    __handleLine: function __parseLineData(line, index, ignore, next) {
	        var ignoreEmpty = this._ignoreEmpty, self = this;
	        if (extended.isBoolean(ignoreEmpty) && ignoreEmpty && (!line || EMPTY.test(line.join("")))) {
	            return next(null, null);
	        }
	        if (!ignore) {
	            this.__transform(line, function (err, line) {
	                if (err) {
	                    next(err);
	                } else {
	                    self.__validate(line, function (err, isValid, reason) {
	                        if (err) {
	                            next(err);
	                        } else if (isValid) {
	                            next(null, line);
	                        } else {
	                            self.emit("data-invalid", line, index, reason);
	                            next(null, null);
	                        }
	                    });
	                }
	            });
	        } else {
	            return next(null, line);
	        }
	    },

	    __processRows: function (rows, data, cb) {
	        var self = this, count;
	        extended.asyncEach(rows, function (row, cb) {
	            if (row) {
	                self.__handleLine(row, (count = ++self._rowCount), false, function (err, dataRow) {
	                    if (err) {
	                        cb(err);
	                    } else {
	                        if (dataRow) {
	                            if (!self.isStreamPaused()) {
	                                self.__emitRecord(dataRow, count);
	                            } else {
	                                self.__buffered.push([dataRow, count]);
	                            }
	                        } else {
	                            count = --self._rowCount;
	                        }
	                        cb();
	                    }
	                });
	            }
	        }, function (err) {
	            if (err) {
	                cb(err);
	            } else {
	                cb(null, data.line);
	            }
	        });
	    },

	    __processHeaders: function (rows, cb) {
	        var headers = this._headers,
	            renameHeaders = this._renameHeaders,
	            discardUnmappedColumns = this._discardUnmappedColumns,
	            strictColumnHandling = this._strictColumnHandling,
	            self = this;

	        function headerHandler(err, headers) {
	            if (err) {
	                cb(err);
	            } else if (extended.isArray(headers)) {
	                var headersLength = headers.length,
	                    orig = self.__transform;
	                self.__transform = function (data, cb) {
	                    var ret = {}, i = -1, val;
	                    if (data.length > headersLength) {
	                        if (discardUnmappedColumns) {
	                            data.splice(headersLength);
	                        } else if (strictColumnHandling) {
	                            self.emit("data-invalid", data);
	                            return orig(null, cb);
	                        } else {
	                            self.emit("error", new Error("Unexpected Error: column header mismatch expected: " + headersLength + " columns got: " + data.length));
	                            return orig(null, cb);
	                        }
	                    } else if (strictColumnHandling && (data.length < headersLength)) {
	                        self.emit("data-invalid", data);
	                        return orig(null, cb);
	                    }
	                    while (++i < headersLength) {
	                        if (isUndefined(headers[i])) {
	                            continue;
	                        }
	                        val = data[i];
	                        ret[headers[i]] = isUndefined(val) ? '' : val;
	                    }

	                    return orig(ret, cb);
	                };
	            }
	            self._parsedHeaders = true;
	            cb(null);
	        }

	        if (renameHeaders) {
	            if (Array.isArray(headers)) {
	                rows.shift();
	                headerHandler(null, headers);
	            } else {
	                self.emit("error", new Error("Error renaming headers: new headers must be provided in an array"));
	            }
	        } else if (extended.isBoolean(headers) && headers) {
	            this.__handleLine(rows.shift(), 0, true, headerHandler);
	        } else {
	            headerHandler(null, headers);
	        }

	    },

	    _parse: function _parseLine(data, hasMoreData, cb) {
	        var rows, self = this;
	        try {
	            data = this.parser(data, hasMoreData);
	            rows = data.rows;
	            if (rows.length) {
	                if (!this._parsedHeaders) {
	                    this.__processHeaders(rows, function (err) {
	                        if (err) {
	                            cb(err);
	                        } else {
	                            self.__processRows(rows, data, cb);
	                        }
	                    });
	                } else {
	                    this.__processRows(rows, data, cb);
	                }
	            } else {
	                cb(null, data.line);
	            }
	        } catch (e) {
	            cb(e);
	        }
	    },

	    __emitRecord: function (dataRow, count) {
	        if (this._emitData) {
	            this.push(this.__objectMode ? dataRow : JSON.stringify(dataRow));
	        }
	    },

	    __removeBOM: function (data) {
	        // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
	        // conversion translates it to FEFF (UTF-16 BOM)
	        if (data && typeof data == 'string' && data.charCodeAt(0) == '0xFEFF') {
	            return data.slice(1);
	        }
	        return data;
	    },

	    _transform: function (data, encoding, done) {
	        var lines = this.lines,
	            lineData = (lines + this.decoder.write(data)),
	            self = this;
	        if (lineData.length > 1) {
	            lineData = this.__removeBOM(lineData);
	            this._parse(lineData, true, function (err, lineData) {
	                if (err) {
	                    done(err);
	                } else {
	                    self.lines = lineData;
	                    if (!self.isStreamPaused()) {
	                        done();
	                    } else {
	                        self.__pausedDone = done;
	                    }
	                }
	            });
	        } else {
	            this.lines = lineData;
	            if (!this.isStreamPaused()) {
	                done();
	            } else {
	                this.__pausedDone = done;
	            }
	        }

	    },

	    __doFlush: function (callback) {
	        try {
	            callback();
	        } catch (e) {
	            callback(e);
	        }
	    },

	    _flush: function (callback) {
	        var self = this;
	        if (this.lines) {
	            this._parse(this.lines, false, function (err) {
	                if (err) {
	                    callback(err);
	                } else if (!self.isStreamPaused()) {
	                    self.__doFlush(callback);
	                } else {
	                    self.__pausedDone = function () {
	                        self.__doFlush(callback);
	                    };
	                }
	            });
	        } else {
	            if (!this.isStreamPaused()) {
	                this.__doFlush(callback);
	            } else {
	                this.__pausedDone = function () {
	                    self.__doFlush(callback);
	                };
	            }
	        }
	    },

	    __validate: function (data, next) {
	        return next(null, true);
	    },

	    __transform: function (data, next) {
	        return next(null, data);
	    },

	    __flushPausedBuffer: function () {
	        var buffered = this.__buffered, l = buffered.length;
	        if (l) {
	            var entry;
	            while (buffered.length) {
	                entry = buffered.shift();
	                this.__emitRecord(entry[0], entry[1]);
	                //handle case where paused is called while emitting data
	                if (this.isStreamPaused()) {
	                    return;
	                }
	            }
	            buffered.length = 0;
	        }
	        if (this.__pausedDone) {
	            var done = this.__pausedDone;
	            this.__pausedDone = null;
	            done();
	        }
	    },

	    isStreamPaused: function () {
	        return this.__paused;
	    },

	    emit: function (event) {
	        if (event === "end") {
	            if (!this.__endEmitted) {
	                this.__endEmitted = true;
	                spreadArgs(origEmit, ["end", ++this._rowCount], this);
	            }
	        } else {
	            if (!hasIsPaused) {
	                if (event === "pause") {
	                    this.__paused = true;
	                } else if (event === "resume") {
	                    this.__paused = false;
	                    this.__flushPausedBuffer();
	                }
	            }
	            spreadArgs(origEmit, arguments, this);
	        }
	    },

	    on: function (evt) {
	        if (evt === "data" || evt === "readable") {
	            this._emitData = true;
	        }
	        spreadArgs(origOn, arguments, this);
	        return this;
	    },

	    validate: function (cb) {
	        if (!extended.isFunction(cb)) {
	            this.emit("error", new TypeError("fast-csv.Parser#validate requires a function"));
	        }
	        if (cb.length === 2) {
	            this.__validate = cb;
	        } else {
	            this.__validate = function (data, next) {
	                return next(null, cb(data));
	            };
	        }
	        return this;
	    },
	    transform: function (cb) {
	        if (!extended.isFunction(cb)) {
	            this.emit("error", new TypeError("fast-csv.Parser#transform requires a function"));
	        }
	        if (cb.length === 2) {
	            this.__transform = cb;
	        } else {
	            this.__transform = function (data, next) {
	                return next(null, cb(data));
	            };
	        }
	        return this;
	    }

	});

	module.exports = ParserStream;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(63);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(64);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(6)))

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 64 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var extended = __webpack_require__(31),
	    has = extended.has,
	    isUndefinedOrNull = extended.isUndefinedOrNull,
	    trim = extended.trim,
	    trimLeft = extended.trimLeft,
	    trimRight = extended.trimRight;

	function createParser(options) {
	    options = options || {};
	    var delimiter = options.delimiter || ",",
	        doLtrim = options.ltrim || false,
	        doRtrim = options.rtrim || false,
	        doTrim = options.trim || false,
	        ESCAPE = has(options, "quote") ? options.quote : '"',
	        VALUE_REGEXP = new RegExp("([^" + delimiter + "'\"\\s\\\\]*(?:\\s+[^" + delimiter + "'\"\\s\\\\]+)*)"),
	        SEARCH_REGEXP = new RegExp("(?:\\n|\\r|" + delimiter + ")"),
	        ESCAPE_CHAR = options.escape || '"',
	        NEXT_TOKEN_REGEXP = new RegExp("([^\\s]|\\r\\n|\\n|\\r|" + delimiter + ")"),
	        ROW_DELIMITER = /(\r\n|\n|\r)/,
	        SPACE_CHAR_REGEX = new RegExp("(?!" + delimiter + ") "),
	        COMMENT, hasComments;
	    if (has(options, "comment")) {
	        COMMENT = options.comment;
	        hasComments = true;
	    }

	    function formatItem(item) {
	        if (doTrim) {
	            item = trim(item);
	        } else if (doLtrim) {
	            item = trimLeft(item);
	        } else if (doRtrim) {
	            item = trimRight(item);
	        }
	        return item;
	    }

	    function parseEscapedItem(str, items, cursor, hasMoreData) {
	        var depth = 0, ret = [];
	        var startPushing = false, token, i = 0, l = str.length, escapeIsEscape = ESCAPE_CHAR === ESCAPE;
	        if (l) {
	            while (cursor < l && (token = str.charAt(cursor))) {
	                if (token === ESCAPE) {
	                    if (!startPushing) {
	                        depth++;
	                        startPushing = true;
	                    } else if (escapeIsEscape && str.charAt(cursor + 1) === ESCAPE) {
	                        cursor++;
	                        ret[i++] = token;
	                    } else if (!escapeIsEscape && ret[i - 1] === ESCAPE_CHAR) {
	                        ret[i - 1] = token;
	                    } else {
	                        if (!(--depth)) {
	                            ++cursor;
	                            break;
	                        }
	                    }
	                } else {
	                    ret[i++] = token;
	                }
	                ++cursor;
	            }
	        }
	        ret = ret.join("");
	        var next = getNextToken(str, cursor),
	            nextToken = next.token;
	        if (nextToken && nextToken.search(delimiter) === 0) {
	            if (hasMoreData && (next.cursor + 1) >= l) {
	                cursor = null;
	            } else {
	                cursor++;
	            }
	        } else if (depth && !nextToken) {
	            if (hasMoreData) {
	                cursor = null;
	            } else {
	                throw new Error("Parse Error: expected: '" + ESCAPE + "' got: '" + nextToken + "'. at '" + str.substr(cursor).replace(/[r\n]/g, "\\n" + "'"));
	            }
	        } else if ((!depth && nextToken && nextToken.search(SEARCH_REGEXP) === -1)) {
	            throw new Error("Parse Error: expected: '" + ESCAPE + "' got: '" + nextToken + "'. at '" + str.substr(cursor, 10).replace(/[\r\n]/g, "\\n" + "'"));
	        } else if (hasMoreData && (!nextToken || !ROW_DELIMITER.test(nextToken))) {
	            cursor = null;
	        }
	        if (cursor !== null) {
	            items.push(formatItem(ret));
	        }
	        return cursor;
	    }

	    function parseCommentLine(line, cursor, hasMoreData) {
	        var nextIndex = line.substr(cursor).search(ROW_DELIMITER);
	        if (nextIndex === -1) {
	            if (hasMoreData) {
	                nextIndex = null;
	            } else {
	                nextIndex = line.length + 1;
	            }
	        } else {
	            nextIndex = (cursor + nextIndex) + 1; //go past the next line break
	        }
	        return nextIndex;
	    }

	    function parseItem(line, items, cursor, hasMoreData) {
	        var searchStr = line.substr(cursor),
	            nextIndex = searchStr.search(SEARCH_REGEXP);
	        if (nextIndex === -1) {
	            if (!VALUE_REGEXP.test(searchStr)) {
	                throw new Error("Parse Error: delimiter '" + delimiter + "' not found at '" + searchStr.replace(/\n/g, "\\n" + "'"));
	            } else {
	                nextIndex = searchStr.length;
	            }
	        }
	        var nextChar = searchStr.charAt(nextIndex);
	        if (nextChar.search(delimiter) !== -1) {
	            if (hasMoreData && (cursor + (nextIndex + 1) >= line.length)) {
	                cursor = null;
	            } else {
	                items.push(formatItem(searchStr.substr(0, nextIndex)));
	                cursor += nextIndex + 1;

	                var cursorChar = line.charAt(cursor);
	                // if ends with a delimiter, append an empty element, unless strict column handling
	                if (!options.strictColumnHandling && (ROW_DELIMITER.test(cursorChar) || cursor >= line.length)) {
	                    items.push('');
	                }
	                // if ends with empty space that is not a delimiter, append an empty space, unless strict column handling
	                if (!options.strictColumnHandling && SPACE_CHAR_REGEX.test(cursorChar) && !hasMoreData) {
	                    items.push(cursorChar);
	                }
	            }
	        } else if (ROW_DELIMITER.test(nextChar)) {
	            items.push(formatItem(searchStr.substr(0, nextIndex)));
	            cursor += nextIndex;
	        } else if (!hasMoreData) {
	            items.push(formatItem(searchStr.substr(0, nextIndex)));
	            cursor += nextIndex + 1;
	        } else {
	            cursor = null;
	        }

	        return cursor;
	    }

	    function getNextToken(line, cursor) {
	        var token, tokenLen, nextIndex, subStr = line.substr(cursor);
	        if ((nextIndex = subStr.search(NEXT_TOKEN_REGEXP)) !== -1) {
	            tokenLen = subStr.match(NEXT_TOKEN_REGEXP)[1].length;
	            token = line.substr(cursor + nextIndex, tokenLen);
	            cursor += nextIndex + tokenLen - 1;
	        }
	        return {token: token, cursor: cursor};
	    }

	    return function parseLine(line, hasMoreData) {
	        var i = 0, l = line.length, rows = [], items = [], token, nextToken, cursor, lastLineI = 0;
	        while (i < l) {
	            nextToken = getNextToken(line, i);
	            token = nextToken.token;
	            if (isUndefinedOrNull(token)) {
	                i = lastLineI;
	                cursor = null;
	                break;
	            } else if (ROW_DELIMITER.test(token)) {
	                i = nextToken.cursor + 1;
	                if (i < l) {
	                    rows.push(items);
	                    items = [];
	                    lastLineI = i;
	                } else {
	                    // if ends with CR and there is more data, keep unparsed due to possible coming LF in CRLF
	                    if (token === '\r' && hasMoreData) {
	                        i = lastLineI;
	                        cursor = null;
	                    }
	                    break;
	                }
	            } else if (hasComments && token === COMMENT) {
	                cursor = parseCommentLine(line, i, hasMoreData);
	                if (cursor === null) {
	                    i = lastLineI;
	                    break;
	                } else if (cursor < l) {
	                    lastLineI = i = cursor;
	                } else {
	                    i = cursor;
	                    cursor = null;
	                    break;
	                }
	            } else {
	                if (token === ESCAPE) {
	                    cursor = parseEscapedItem(line, items, nextToken.cursor, hasMoreData);
	                } else {
	                    cursor = parseItem(line, items, i, hasMoreData);
	                }
	                if (cursor === null) {
	                    i = lastLineI;
	                    break;
	                } else {
	                    i = cursor;
	                }
	            }

	        }
	        cursor !== null && rows.push(items);
	        return {line: line.substr(i), rows: rows};
	    };

	}
	module.exports = createParser;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Buffer = __webpack_require__(67).Buffer;

	var isEncoding = Buffer.isEncoding || function (encoding) {
	  encoding = '' + encoding;
	  switch (encoding && encoding.toLowerCase()) {
	    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
	      return true;
	    default:
	      return false;
	  }
	};

	function _normalizeEncoding(enc) {
	  if (!enc) return 'utf8';
	  var retried;
	  while (true) {
	    switch (enc) {
	      case 'utf8':
	      case 'utf-8':
	        return 'utf8';
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return 'utf16le';
	      case 'latin1':
	      case 'binary':
	        return 'latin1';
	      case 'base64':
	      case 'ascii':
	      case 'hex':
	        return enc;
	      default:
	        if (retried) return; // undefined
	        enc = ('' + enc).toLowerCase();
	        retried = true;
	    }
	  }
	};

	// Do not cache `Buffer.isEncoding` when checking encoding names as some
	// modules monkey-patch it to support additional encodings
	function normalizeEncoding(enc) {
	  var nenc = _normalizeEncoding(enc);
	  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
	  return nenc || enc;
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters.
	exports.StringDecoder = StringDecoder;
	function StringDecoder(encoding) {
	  this.encoding = normalizeEncoding(encoding);
	  var nb;
	  switch (this.encoding) {
	    case 'utf16le':
	      this.text = utf16Text;
	      this.end = utf16End;
	      nb = 4;
	      break;
	    case 'utf8':
	      this.fillLast = utf8FillLast;
	      nb = 4;
	      break;
	    case 'base64':
	      this.text = base64Text;
	      this.end = base64End;
	      nb = 3;
	      break;
	    default:
	      this.write = simpleWrite;
	      this.end = simpleEnd;
	      return;
	  }
	  this.lastNeed = 0;
	  this.lastTotal = 0;
	  this.lastChar = Buffer.allocUnsafe(nb);
	}

	StringDecoder.prototype.write = function (buf) {
	  if (buf.length === 0) return '';
	  var r;
	  var i;
	  if (this.lastNeed) {
	    r = this.fillLast(buf);
	    if (r === undefined) return '';
	    i = this.lastNeed;
	    this.lastNeed = 0;
	  } else {
	    i = 0;
	  }
	  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
	  return r || '';
	};

	StringDecoder.prototype.end = utf8End;

	// Returns only complete characters in a Buffer
	StringDecoder.prototype.text = utf8Text;

	// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
	StringDecoder.prototype.fillLast = function (buf) {
	  if (this.lastNeed <= buf.length) {
	    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
	    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
	  }
	  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
	  this.lastNeed -= buf.length;
	};

	// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
	// continuation byte.
	function utf8CheckByte(byte) {
	  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
	  return -1;
	}

	// Checks at most 3 bytes at the end of a Buffer in order to detect an
	// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
	// needed to complete the UTF-8 character (if applicable) are returned.
	function utf8CheckIncomplete(self, buf, i) {
	  var j = buf.length - 1;
	  if (j < i) return 0;
	  var nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) self.lastNeed = nb - 1;
	    return nb;
	  }
	  if (--j < i) return 0;
	  nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) self.lastNeed = nb - 2;
	    return nb;
	  }
	  if (--j < i) return 0;
	  nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) {
	      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
	    }
	    return nb;
	  }
	  return 0;
	}

	// Validates as many continuation bytes for a multi-byte UTF-8 character as
	// needed or are available. If we see a non-continuation byte where we expect
	// one, we "replace" the validated continuation bytes we've seen so far with
	// UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
	// behavior. The continuation byte check is included three times in the case
	// where all of the continuation bytes for a character exist in the same buffer.
	// It is also done this way as a slight performance increase instead of using a
	// loop.
	function utf8CheckExtraBytes(self, buf, p) {
	  if ((buf[0] & 0xC0) !== 0x80) {
	    self.lastNeed = 0;
	    return '\ufffd'.repeat(p);
	  }
	  if (self.lastNeed > 1 && buf.length > 1) {
	    if ((buf[1] & 0xC0) !== 0x80) {
	      self.lastNeed = 1;
	      return '\ufffd'.repeat(p + 1);
	    }
	    if (self.lastNeed > 2 && buf.length > 2) {
	      if ((buf[2] & 0xC0) !== 0x80) {
	        self.lastNeed = 2;
	        return '\ufffd'.repeat(p + 2);
	      }
	    }
	  }
	}

	// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
	function utf8FillLast(buf) {
	  var p = this.lastTotal - this.lastNeed;
	  var r = utf8CheckExtraBytes(this, buf, p);
	  if (r !== undefined) return r;
	  if (this.lastNeed <= buf.length) {
	    buf.copy(this.lastChar, p, 0, this.lastNeed);
	    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
	  }
	  buf.copy(this.lastChar, p, 0, buf.length);
	  this.lastNeed -= buf.length;
	}

	// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
	// partial character, the character's bytes are buffered until the required
	// number of bytes are available.
	function utf8Text(buf, i) {
	  var total = utf8CheckIncomplete(this, buf, i);
	  if (!this.lastNeed) return buf.toString('utf8', i);
	  this.lastTotal = total;
	  var end = buf.length - (total - this.lastNeed);
	  buf.copy(this.lastChar, 0, end);
	  return buf.toString('utf8', i, end);
	}

	// For UTF-8, a replacement character for each buffered byte of a (partial)
	// character needs to be added to the output.
	function utf8End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) return r + '\ufffd'.repeat(this.lastTotal - this.lastNeed);
	  return r;
	}

	// UTF-16LE typically needs two bytes per character, but even if we have an even
	// number of bytes available, we need to check if we end on a leading/high
	// surrogate. In that case, we need to wait for the next two bytes in order to
	// decode the last character properly.
	function utf16Text(buf, i) {
	  if ((buf.length - i) % 2 === 0) {
	    var r = buf.toString('utf16le', i);
	    if (r) {
	      var c = r.charCodeAt(r.length - 1);
	      if (c >= 0xD800 && c <= 0xDBFF) {
	        this.lastNeed = 2;
	        this.lastTotal = 4;
	        this.lastChar[0] = buf[buf.length - 2];
	        this.lastChar[1] = buf[buf.length - 1];
	        return r.slice(0, -1);
	      }
	    }
	    return r;
	  }
	  this.lastNeed = 1;
	  this.lastTotal = 2;
	  this.lastChar[0] = buf[buf.length - 1];
	  return buf.toString('utf16le', i, buf.length - 1);
	}

	// For UTF-16LE we do not explicitly append special replacement characters if we
	// end on a partial character, we simply let v8 handle that.
	function utf16End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) {
	    var end = this.lastTotal - this.lastNeed;
	    return r + this.lastChar.toString('utf16le', 0, end);
	  }
	  return r;
	}

	function base64Text(buf, i) {
	  var n = (buf.length - i) % 3;
	  if (n === 0) return buf.toString('base64', i);
	  this.lastNeed = 3 - n;
	  this.lastTotal = 3;
	  if (n === 1) {
	    this.lastChar[0] = buf[buf.length - 1];
	  } else {
	    this.lastChar[0] = buf[buf.length - 2];
	    this.lastChar[1] = buf[buf.length - 1];
	  }
	  return buf.toString('base64', i, buf.length - n);
	}

	function base64End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
	  return r;
	}

	// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
	function simpleWrite(buf) {
	  return buf.toString(this.encoding);
	}

	function simpleEnd(buf) {
	  return buf && buf.length ? this.write(buf) : '';
	}

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable node/no-deprecated-api */
	var buffer = __webpack_require__(8)
	var Buffer = buffer.Buffer

	// alternative to using Object.keys for old browsers
	function copyProps (src, dst) {
	  for (var key in src) {
	    dst[key] = src[key]
	  }
	}
	if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
	  module.exports = buffer
	} else {
	  // Copy properties from require('buffer')
	  copyProps(buffer, exports)
	  exports.Buffer = SafeBuffer
	}

	function SafeBuffer (arg, encodingOrOffset, length) {
	  return Buffer(arg, encodingOrOffset, length)
	}

	// Copy static methods from Buffer
	copyProps(Buffer, SafeBuffer)

	SafeBuffer.from = function (arg, encodingOrOffset, length) {
	  if (typeof arg === 'number') {
	    throw new TypeError('Argument must not be a number')
	  }
	  return Buffer(arg, encodingOrOffset, length)
	}

	SafeBuffer.alloc = function (size, fill, encoding) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  var buf = Buffer(size)
	  if (fill !== undefined) {
	    if (typeof encoding === 'string') {
	      buf.fill(fill, encoding)
	    } else {
	      buf.fill(fill)
	    }
	  } else {
	    buf.fill(0)
	  }
	  return buf
	}

	SafeBuffer.allocUnsafe = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return Buffer(size)
	}

	SafeBuffer.allocUnsafeSlow = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return buffer.SlowBuffer(size)
	}


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var fs = __webpack_require__(12),
	    extended = __webpack_require__(31),
	    escape = extended.escape,
	    stream = __webpack_require__(44),
	    LINE_BREAK = extended.LINE_BREAK,
	    CsvTransformStream = __webpack_require__(69);


	function createWriteStream(options) {
	    return new CsvTransformStream(options);
	}

	function write(arr, options, ws) {
	    var csvStream = createWriteStream(options), i = -1, l = arr.length;
	    extended.asyncEach(arr, function (item, cb) {
	        csvStream.write(item, null, cb);
	    }, function (err) {
	        if (err) {
	            csvStream.emit("error", err);
	        } else {
	            csvStream.end();
	        }
	    });
	    return csvStream;
	}

	function writeToStream(ws, arr, options) {
	    return write(arr, options).pipe(ws);
	}

	function writeToString(arr, options, cb) {
	    if (extended.isFunction(options)) {
	        cb = options;
	        options = {};
	    }
	    var ws = new stream.Writable(), written = [];
	    ws._write = function (data, enc, cb) {
	        written.push(data + "");
	        cb();
	    };
	    ws
	        .on("error", cb)
	        .on("finish", function () {
	            cb(null, written.join(""));
	        });
	    write(arr, options).pipe(ws);
	}


	function writeToBuffer(arr, options, cb) {
	    if (extended.isFunction(options)) {
	        cb = options;
	        options = {};
	    }
	    var ws = new stream.Writable(), buffers = [], l = 0;
	    ws._write = function (data, enc, cb) {
	        buffers.push(data);
	        l++;
	        cb();
	    };
	    ws
	        .on("error", cb)
	        .on("finish", function () {
	            cb(null, Buffer.concat(buffers));
	        });
	    write(arr, options).pipe(ws);
	}

	function writeToPath(path, arr, options) {
	    var stream = fs.createWriteStream(path, {encoding: "utf8"});
	    return write(arr, options).pipe(stream);
	}

	createWriteStream.writeToBuffer = writeToBuffer;
	createWriteStream.write = write;
	createWriteStream.createWriteStream = createWriteStream;
	createWriteStream.writeToString = writeToString;
	createWriteStream.writeToPath = writeToPath;
	createWriteStream.writeToStream = writeToStream;
	module.exports = createWriteStream;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var fs = __webpack_require__(12),
	    util = __webpack_require__(62),
	    extended = __webpack_require__(31),
	    escape = extended.escape,
	    isArray = extended.isArray,
	    has = extended.has,
	    stream = __webpack_require__(44),
	    Transform = stream.Transform,
	    LINE_BREAK = extended.LINE_BREAK,
	    formatter = __webpack_require__(70),
	    createFormatter = formatter.createFormatter,
	    checkHeaders = formatter.checkHeaders,
	    transformItem = formatter.transformItem,
	    defaultTransform = formatter.defaultTransform;

	function CsvTransformStream(options) {
	    options = options || {};
	    options.objectMode = true;

	    if (has(options, "transform")) {
	        // remove so its not set to _transform in Transform constructor
	        options.consumerTransform = options.transform;
	        delete options.transform;
	    }

	    Transform.call(this, options);
	    this.formatter = createFormatter(options, this);
	    this.rowDelimiter = options.rowDelimiter || "\n";
	    var hasHeaders = has(options, "headers") ? !!options.headers : null,
	        headers = (hasHeaders && isArray(options.headers)) ? options.headers : null;
	    this.hasHeaders = hasHeaders;
	    this.headers = headers;
	    if (hasHeaders) {
	        if (headers) {
	            this.parsedHeaders = true;
	            this.headersLength = headers.length;
	        } else {
	            this.parsedHeaders = false;
	        }
	    }
	    this.hasWrittenHeaders = hasHeaders ? false : true;
	    this.includeEndRowDelimiter = !!options.includeEndRowDelimiter,
	    has(options, "consumerTransform") && this.transform(options.consumerTransform);
	}
	util.inherits(CsvTransformStream, Transform);

	extended(CsvTransformStream).extend({

	    headers: null,

	    headersLength: 0,

	    totalCount: 0,

	    _transform: function (item, encoding, cb) {
	        var self = this;
	        this.__transform(item, function (err, item) {
	            if (err) {
	                cb(err);
	            } else {
	                if (checkHeaders(self, item)) {
	                    self.push(new Buffer(transformItem(self, item), "utf8"));
	                }
	                cb();
	            }
	        });
	    },

	    __transform: defaultTransform,

	    transform: function (cb) {
	        if (!extended.isFunction(cb)) {
	            this.emit("error", new TypeError("fast-csv.FormatterStream#transform requires a function"));
	        }
	        if (cb.length === 2) {
	            this.__transform = cb;
	        } else {
	            this.__transform = function (data, next) {
	                next(null, cb(data));
	            };
	        }
	        return this;
	    },

	    _flush: function (cb) {
	        if (this.includeEndRowDelimiter) {
	            this.push(this.rowDelimiter);
	        }
	        cb();
	    }
	});

	module.exports = CsvTransformStream;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var fs = __webpack_require__(12),
	    extended = __webpack_require__(31),
	    has = extended.has,
	    isBoolean = extended.isBoolean,
	    isUndefinedOrNull = extended.isUndefinedOrNull,
	    escape = extended.escape,
	    isArray = extended.isArray,
	    keys = extended.keys,
	    stream = __webpack_require__(44),
	    LINE_BREAK = extended.LINE_BREAK;

	function createQuoteChecker(stream, quoteColumns, quoteHeaders) {
	    var shouldQuote;
	    if (isBoolean(quoteColumns)) {
	        if (isBoolean(quoteHeaders)) {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return (isHeader ? quoteHeaders : quoteColumns);
	            };
	        } else if (isArray(quoteHeaders)) {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders[index] : quoteColumns;
	            };
	        } else {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders[stream.headers[index]] : quoteColumns;
	            };
	        }
	    } else if (isArray(quoteColumns)) {
	        if (isBoolean(quoteHeaders)) {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders : quoteColumns[index];
	            };
	        } else {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders[index] : quoteColumns[index];
	            };
	        }
	    } else {
	        if (isBoolean(quoteHeaders)) {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders : quoteColumns[stream.headers[index]];
	            };
	        } else {
	            shouldQuote = function shouldQuote(index, isHeader) {
	                return isHeader ? quoteHeaders[stream.headers[index]] : quoteColumns[stream.headers[index]];
	            };
	        }
	    }
	    return shouldQuote;
	}

	function createFormatter(options, stream) {
	    options = options || {};
	    var delimiter = options.delimiter || ",",
	        ESCAPE_REGEXP = new RegExp("[" + delimiter + escape(options.rowDelimiter || LINE_BREAK) + "']"),
	        QUOTE = options.quote || '"',
	        ESCAPE = options.escape || '"',
	        REPLACE_REGEXP = new RegExp(QUOTE, "g"),
	        quoteColumns = has(options, "quoteColumns") ? options.quoteColumns : false,
	        quoteHeaders = has(options, "quoteHeaders") ? options.quoteHeaders : quoteColumns,
	        shouldQuote = createQuoteChecker(stream, quoteColumns, quoteHeaders);


	    function escapeField(field, index, isHeader) {
	        var escape;
	        field = field.replace(/\0/g, '');
	        if ((escape = field.indexOf(QUOTE) !== -1)) {
	            field = field.replace(REPLACE_REGEXP, ESCAPE + QUOTE);
	            escape = true;
	        } else {
	            escape = field.search(ESCAPE_REGEXP) !== -1;
	        }
	        escape = escape || shouldQuote(index, isHeader);
	        if (escape) {
	            field = [QUOTE + field + QUOTE];
	        } else {
	            field = [field];
	        }
	        return field.join("");
	    }

	    return function escapeFields(fields, isHeader) {
	        var i = -1, l = fields.length, ret = [], field;
	        while (++i < l) {
	            field = fields[i];
	            field = (isUndefinedOrNull(field) ? "" : field) + "";
	            ret.push(escapeField(field, i, isHeader));
	        }
	        return ret.join(delimiter);
	    };
	}

	function defaultTransform(row, cb) {
	    return cb(null, row);
	}


	function isHashArray(arr) {
	    return isArray(arr) && isArray(arr[0]) && arr[0].length === 2;
	}

	//get headers from a row item
	function gatherHeaders(item) {
	    var ret, i, l;
	    if (isHashArray(item)) {
	        //lets assume a multidimesional array with item 0 bing the title
	        i = -1;
	        l = item.length;
	        ret = [];
	        while (++i < l) {
	            ret[i] = item[i][0];
	        }
	    } else if (isArray(item)) {
	        ret = item;
	    } else {
	        ret = keys(item);
	    }
	    return ret;
	}

	//check if we need to write header return true if we should also write a row
	//could be false if headers is true and the header row(first item) is passed in
	function checkHeaders(stream, item) {
	    var headers, ret = true;
	    if (!stream.parsedHeaders) {
	        stream.parsedHeaders = true;
	        headers = stream.headers = gatherHeaders(item);
	        stream.headersLength = headers.length;
	    }
	    if (!stream.hasWrittenHeaders) {
	        stream.totalCount++;
	        stream.push(new Buffer(stream.formatter(stream.headers, true), "utf8"));
	        stream.hasWrittenHeaders = true;
	        ret = isHashArray(item) || !isArray(item);
	    }
	    return ret;
	}

	//transform an object into a CSV row
	function transformHashData(stream, item) {
	    var vals = [], row = [], headers = stream.headers, i = -1, headersLength = stream.headersLength;
	    if (stream.totalCount++) {
	        row.push(stream.rowDelimiter);
	    }
	    while (++i < headersLength) {
	        vals[i] = item[headers[i]];
	    }
	    row.push(stream.formatter(vals));
	    return row.join("");
	}

	//transform an array into a CSV row
	function transformArrayData(stream, item, cb) {
	    var row = [];
	    if (stream.totalCount++) {
	        row.push(stream.rowDelimiter);
	    }
	    row.push(stream.formatter(item));
	    return row.join("");
	}

	//transform an array of two item arrays into a CSV row
	function transformHashArrayData(stream, item) {
	    var vals = [], row = [], i = -1, headersLength = stream.headersLength;
	    if (stream.totalCount++) {
	        row.push(stream.rowDelimiter);
	    }
	    while (++i < headersLength) {
	        vals[i] = item[i][1];
	    }
	    row.push(stream.formatter(vals));
	    return row.join("");
	}

	//wrapper to determin what transform to run
	function transformItem(stream, item) {
	    var ret;
	    if (isArray(item)) {
	        if (isHashArray(item)) {
	            ret = transformHashArrayData(stream, item);
	        } else {
	            ret = transformArrayData(stream, item);
	        }
	    } else {
	        ret = transformHashData(stream, item);
	    }
	    return ret;
	}

	exports.createFormatter = createFormatter;
	exports.transformItem = transformItem;
	exports.checkHeaders = checkHeaders;
	exports.defaultTransform = defaultTransform;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8).Buffer))

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {(function (root) {

	  // Store setTimeout reference so promise-polyfill will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var setTimeoutFunc = setTimeout;

	  function noop() {}
	  
	  // Polyfill for Function.prototype.bind
	  function bind(fn, thisArg) {
	    return function () {
	      fn.apply(thisArg, arguments);
	    };
	  }

	  function Promise(fn) {
	    if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
	    if (typeof fn !== 'function') throw new TypeError('not a function');
	    this._state = 0;
	    this._handled = false;
	    this._value = undefined;
	    this._deferreds = [];

	    doResolve(fn, this);
	  }

	  function handle(self, deferred) {
	    while (self._state === 3) {
	      self = self._value;
	    }
	    if (self._state === 0) {
	      self._deferreds.push(deferred);
	      return;
	    }
	    self._handled = true;
	    Promise._immediateFn(function () {
	      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
	      if (cb === null) {
	        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
	        return;
	      }
	      var ret;
	      try {
	        ret = cb(self._value);
	      } catch (e) {
	        reject(deferred.promise, e);
	        return;
	      }
	      resolve(deferred.promise, ret);
	    });
	  }

	  function resolve(self, newValue) {
	    try {
	      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
	      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
	      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
	        var then = newValue.then;
	        if (newValue instanceof Promise) {
	          self._state = 3;
	          self._value = newValue;
	          finale(self);
	          return;
	        } else if (typeof then === 'function') {
	          doResolve(bind(then, newValue), self);
	          return;
	        }
	      }
	      self._state = 1;
	      self._value = newValue;
	      finale(self);
	    } catch (e) {
	      reject(self, e);
	    }
	  }

	  function reject(self, newValue) {
	    self._state = 2;
	    self._value = newValue;
	    finale(self);
	  }

	  function finale(self) {
	    if (self._state === 2 && self._deferreds.length === 0) {
	      Promise._immediateFn(function() {
	        if (!self._handled) {
	          Promise._unhandledRejectionFn(self._value);
	        }
	      });
	    }

	    for (var i = 0, len = self._deferreds.length; i < len; i++) {
	      handle(self, self._deferreds[i]);
	    }
	    self._deferreds = null;
	  }

	  function Handler(onFulfilled, onRejected, promise) {
	    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
	    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
	    this.promise = promise;
	  }

	  /**
	   * Take a potentially misbehaving resolver function and make sure
	   * onFulfilled and onRejected are only called once.
	   *
	   * Makes no guarantees about asynchrony.
	   */
	  function doResolve(fn, self) {
	    var done = false;
	    try {
	      fn(function (value) {
	        if (done) return;
	        done = true;
	        resolve(self, value);
	      }, function (reason) {
	        if (done) return;
	        done = true;
	        reject(self, reason);
	      });
	    } catch (ex) {
	      if (done) return;
	      done = true;
	      reject(self, ex);
	    }
	  }

	  Promise.prototype['catch'] = function (onRejected) {
	    return this.then(null, onRejected);
	  };

	  Promise.prototype.then = function (onFulfilled, onRejected) {
	    var prom = new (this.constructor)(noop);

	    handle(this, new Handler(onFulfilled, onRejected, prom));
	    return prom;
	  };

	  Promise.all = function (arr) {
	    return new Promise(function (resolve, reject) {
	      if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
	      var args = Array.prototype.slice.call(arr);
	      if (args.length === 0) return resolve([]);
	      var remaining = args.length;

	      function res(i, val) {
	        try {
	          if (val && (typeof val === 'object' || typeof val === 'function')) {
	            var then = val.then;
	            if (typeof then === 'function') {
	              then.call(val, function (val) {
	                res(i, val);
	              }, reject);
	              return;
	            }
	          }
	          args[i] = val;
	          if (--remaining === 0) {
	            resolve(args);
	          }
	        } catch (ex) {
	          reject(ex);
	        }
	      }

	      for (var i = 0; i < args.length; i++) {
	        res(i, args[i]);
	      }
	    });
	  };

	  Promise.resolve = function (value) {
	    if (value && typeof value === 'object' && value.constructor === Promise) {
	      return value;
	    }

	    return new Promise(function (resolve) {
	      resolve(value);
	    });
	  };

	  Promise.reject = function (value) {
	    return new Promise(function (resolve, reject) {
	      reject(value);
	    });
	  };

	  Promise.race = function (values) {
	    return new Promise(function (resolve, reject) {
	      for (var i = 0, len = values.length; i < len; i++) {
	        values[i].then(resolve, reject);
	      }
	    });
	  };

	  // Use polyfill for setImmediate for performance gains
	  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
	    function (fn) {
	      setTimeoutFunc(fn, 0);
	    };

	  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
	    if (typeof console !== 'undefined' && console) {
	      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
	    }
	  };

	  /**
	   * Set the immediate function to execute callbacks
	   * @param fn {function} Function to execute
	   * @deprecated
	   */
	  Promise._setImmediateFn = function _setImmediateFn(fn) {
	    Promise._immediateFn = fn;
	  };

	  /**
	   * Change the function to execute on unhandled rejection
	   * @param {function} fn Function to execute on unhandled rejection
	   * @deprecated
	   */
	  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
	    Promise._unhandledRejectionFn = fn;
	  };
	  
	  if (typeof module !== 'undefined' && module.exports) {
	    module.exports = Promise;
	  } else if (!root.Promise) {
	    root.Promise = Promise;
	  }

	})(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27).setImmediate))

/***/ }
/******/ ])
});
;