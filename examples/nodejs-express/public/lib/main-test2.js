
/**
 * 
 * Virtual DOM
 *
 * ==Initialize==
 * Create `$scope` to watch modify
 * Analyze the html template and generate the vObj
 * Convert vObj to a generating function with expressions
 * Generate Virtual DOM and extend the `$scope` as `scope` on Virtual DOM from the instance in sequence
 * Transfer Virtual DOM to DOM
 * Mount the generated DOM
 *
 * ==Update==
 * Check the modify
 * Regenerate Virtual DOM according to the generating function
 * Contrast the two Virtual DOM trees and add patch to the batch queue
 * Update DOM in sequence base on the batch queue
 * Garbage collection
 *
 * @author Arnold.Zhang
 *
 **/
;(function (global, factory) {
	typeof exports === 'object' 
		&& typeof module !== 'undefined' 
			? module.exports = factory(global) 
			: typeof define === 'function' 
				&& define.amd 
					? define(factory) 
					: global.JSpring = factory(global);
} (this || window, function (w) {
	 "use strict"

	var 
		DOC = document
		, BODY = DOC.body
		, HEAD = DOC.head
		, UA = navigator.userAgent
		, OBJ = {}
		, ARRAY = []
		, STRING = ''
		, SPACE = ' '
		, UNIQ = 'LVMM'

		, textNode = DOC.createTextNode(STRING)
		, $createEl = DOC.createElement.bind(DOC)
		, arrProto = Array.prototype

		, $apply = Function.prototype.apply
		, $replace = STRING.replace
		, $split = STRING.split
		, $lower = STRING.toLowerCase
		, $substr = STRING.substr
		, $defProp = Object.defineProperty
		, $create = Object.create
		, $keys = Object.keys
		, $toString = OBJ.toString
		, $slice = ARRAY.slice
		, $push = ARRAY.push
		, $shift = ARRAY.shift
		, $splice = ARRAY.splice

		, $stringify = JSON.stringify
		, emptyDataObj = $create(null)

		;
	
	emptyDataObj.data = $create(null);
	insertCSS();

	var LOOP = {
		INDEX : 0,
		MAX_LOOP : 100000,

		init : function init () {
			this.INDEX = 0;
		},

		count : function count () {

			if (this.end()) {
				return true;
			} 

			else {
				this.INDEX += 1;
			}
		},

		sum : function sum () {
			LOG.info(this.INDEX);
			this.init();
		},	

		end : function end () {
			return this.INDEX >= this.MAX_LOOP;
		}
	};


	/**
	 * LOG
	 **/
	var LOG = {
		$errQ : [],

		info : function info () {
			$apply.call(console.log, console, arguments);
		},

		warn : function warn () {
			$apply.call(console.warn, console, arguments);
		},

		error : function error () {
			$apply.call(console.error, console, arguments);
		},

		clearLog : function clearLog () {
			this.$errQ = [];
		},

		warnStack : function warnStack (vObj, scope, template) {
			this.$errQ = ['Fail to analyze template : \n' + template];
			this.pushStack(vObj, scope).trigger();
		},

		pushStack : function pushStack (vObj, scope) {

			if (!vObj.isElem) {
				return;
			}

			var 
				_this = this
				, uniqKeys = vObj.uniqKeys
				, uL = uniqKeys.length
				, children = vObj.children
				;

			if (uL) {
				_.each(uniqKeys, function uKEach (key) {
					var attr = vObj.uniqAttrs[key];

					if (isOnAttr(key)) {
						attr = attr.replace(REGEXP.uniqColonRE, STRING);
					}
					makeGetterFn(attr, function (expr) {
						_.push(_this.$errQ, 'unexpected expression : ' + expr);
					});
				});
			}
			children.length && _.each(children, function childrenEach (child) {
				LOG.pushStack(child, scope);
			});
			return _this;
		},

		trigger : function trigger () {
			this.warn(this.$errQ.join('\n'));
			this.clearLog();
		}
	};


	/**
	 * WARN
	 **/
	var WARN = {
		format : function format (attr) {
			return 'not match the format of {1}'
				.replace(/\{\d\}/g, attr);
		},

		missComp : function missComp (tag) {
			return '`{1}` is not a component'
				.replace(/\{\d\}/g, tag);
		},
		
		h5Semantic : 'dont`t wrap block-element inside <p>',
		container : 'the viewport haven`t found the container to place in'
	};


	/**
	 * REGEXP
	 **/
	var REGEXP = {
		startEndAngleRE : /((?:\s|&[a-zA-Z]+;|<!\-\-@|[^<>]+)*)(<?(\/?)([^!<>\/\s]+)(?:\s*[^\s=\/>]+(?:="[^"]*"|='[^']*'|=[^'"\s]+|)|)+\s*\/?>?)(?:\s*@\-\->)?/g,
		ghostRE : /^(?:input|br|img|link|hr|base|area|meta|embed|frame)$/,//虚元素
		attrsRE : /\s+([^\s=<>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s<>]+))/g,
		routeParamREG : /\:([^\:\-\.]+)/g,
		uniqNoteRE : /<!\-\-@\s*([^@]+)\s*@\-\->/g,
		noteRE : /<!\-\-[^@](.|\r|\n)+?[^@]\-\->/g,
		commentRE : /\s*<!--\s*|\s*-->\s*/g,
		uniqLeftNoteRE : /<!\-\-@/g,
		errMsgRE : / is not defined/,
		funcStrRE : /^\s*function/,
		colonREG : /\s*\:\s*/,
		rhashcodeRE : /\d\.\d{4}/,
		uniqRE : /(?:lv-|:)([^-:]+)/,
		squareRE : /\[([^\[\]]+)\]/,
		boolClassRE : /\{(?:true|false)\s*:[^{}]+\}\[[^\[\]]+\]/,
		objRE : /\{['"]?([^:()]+['"]?\s*\:\s*[^,],?\s*)+\}/,
		objParentRE : /[^\[\]\.]+/,
		styleRE : /([a-zA-Z]+)\s*:\s*([^:;]+)/g,
		forRE : /(?:lv-|:)for/g,
		compRE : /(?:lv-|:)component/g,
		compSetRE : /<[^\/]+\/>/,
		ifRE : /(?:lv-|:)if/g,
		onRE : /(?:lv-|:)on/g,
		onlySpaceRE : /^\s*$/,
		textBindRE : /\{\{((?!\{\{)[\s\S])+\}\}/g,
		uniqColonRE : /[^\s]+\s*\:\s*/,
		sUniqRE : /text|show|hide|toggle|html/,
		forExpRE : /(?:let\s+|var\s+|)([^\.\s]+)\s+(?:in|of)\s+([^\s]+)(?:\s+trackBy\s+([^\s]+)|)/,
		onExpRE : /['"]?([^'"{}:()\s,]+)['"]?\s*\:\s*([^():]+)\s*\(([^()]*)\)/g,
		lineRE : /\\n|\\r|\\t|\s/g,
		trimRE : /^\s*|\s*$/g,
		spaceRE : /\s+/g,
		capital : /[A-Z]/g,

		exec : function exec (regExp, word) {
		  var result = regExp.exec(word);
		  regExp.lastIndex = 0;
		  return result;
		},

		test : function test (regExp, word) {
		  var result = regExp.test(word);
		  regExp.lastIndex = 0;
		  return result;
		},

		replace : function replace (word, regExp, regBack) {
		  return optimizeCb($replace, word, regExp, regBack);
		}
	};


	/**
	  * NODETYPE
	  **/
	 var NODETYPE = {
		Element : 1,
		Attr : 2,
		Text : 3,
		Comment : 8,
		Document : 9,
		DocumentFragment : 11
	};


	/**
	  * NodeFn
	  **/
	var NodeFn = {
		1 : "createElement",
		3 : "createTextNode",
		8 : "createComment",
		11 : "createDocumentFragment"
	};


	/**
	  * UpdateType
	  **/
	var UpdateType = {
		'INSERT' : 1,
		'DELETE' : 2,
		'UPDATE' : 3,
		'REPLACE' : 4,
		'APPEND' : 5
	};


	/**
	  * BROWSER
	  **/
	var BROWSER = {
		UC : /UCBrowser/,
		Safari : /Safari/,
		Moz : /Firefox/,
		QQ : /QQBrowser/,
		Sogou : /SogouMobileBrowser/
	};


	/**
	  * PLATFORM
	  **/
	var PLATFORM = {
		Android : /Android/,
		IOS : /iPhone/,
		Wp : /Windows Phone/,
		App : /LVMM/,
		Pad : /iPad/,
		Webview : /WebView/,
		Wechat : /MicroMessenger/,
		Alipay : /ali(?:pay|app)/i
	};



	/**
	 * _
	 **/
	var _ = {

		isFunctionStr : function isFunctionStr (value) {
			return REGEXP.funcStrRE.test(value);
		},
		
		capitalLower : function capitalLower (str) {
			return REGEXP.replace(str, REGEXP.capital, function (match) {
				return '-' + $lower.call(match);
			});
		},

		getChildNodes : function getChildNodes (el) {
			return this.isElement(el)
				&& el.childNodes;
		},

		isNaN : function isNaN (value) {
			return _.isNumber(value) && value != value;
		},

		trim : function trim (str) {

			if (this.isString(str)) {
				return str.replace(REGEXP.trimRE, '');
			}
		},

		child : function child (el, index) {

			if (this.isElement(el)) {
				return el.children[index];
			}
		},

		html : function html (el, str) {

			if (this.isElement(el)) {
				el.innerHTML = str;
				return el;
			}
		},

		uniqPush : function uniqPush (arr, child) {

			if (_.isArray(arr)) {
				return !_.inArray(arr, child) && _.push(arr, child);
			}
			return false;
		},

		getSearchObj : function getSearchObj (search) {

			var 
				obj = $create(null)
				, arr
				;

			if (!search) {
				return obj;
			}

			arr = search.split(/\?|&/);

			if (arr[0] == '') {
				arr.shift();
			}

			_.each(arr, function convertEach (v) {
				var vArr = v.split('='),
					key = vArr[0],
					value = vArr[1];

				if (!_.isUndefined(obj[key])) {
					!_.isArray(obj[key]) && (obj[key] = [obj[key]]);
					_.push(obj[key], value);
				} 

				else {
					obj[key] = vArr[1];
				}
			});
			return obj;
		},

		createLoadingImg : function createLoadingImg () {
			var 
				str = '<div class="dataLoading">'
					+ '<i></i><i></i>' 
					+ '<span>加载中...</span>' 
					+ '</div>' 
					+ '<div class="loadingMask"></div>'
				, div = $createEl('div')
				;

			div.innerHTML = str;
			div.ontouchmove = function (e) {
				e.preventDefault();
			}
			return div;
		},

		'delete' : function _delete (url, data, opts) {
			return _.proxyAjax('delete', url, data, opts);
		},

		put : function put (url, data, opts) {
			return _.proxyAjax('put', url, data, opts);
		},

		post : function post (url, data, opts) {
			return _.proxyAjax('post', url, data, opts);
		},

		get : function get (url, data, opts) {
			return _.proxyAjax('get', url, data, opts);
		},

		proxyAjax : function proxyAjax (method, url, data, opts) {
			return _.ajax(url || ''
				, this.lower(method || 'GET')
				, _.isObject(data) ? data : {}
				, opts || {});
		},

		/**
		 * _.jsonp('//api.map.baidu.com/geocoder/v2/?ak=VIqafisYEvp6E0j0j0DeWkny&location=31.238032669517935,121.38725332252167&output=json&pois=0&coordtype=wgs84ll&callback=baidu_jsonp_1', 
		 *    function (res) {
		 *        console.log(res);
		 *    });
		 **/
		jsonp : function jsonp (url, opts, callback) {

			if (_.isFunction(opts)) {
				callback = opts;
				opts = {};
			}

			var 
				jsonpREG = new RegExp((opts.jsonp || 'callback') + '=([^&]+)', 'g')
				, script = $createEl("script")
				, result = url.match(jsonpREG)
				, cbName
				;

			if (!result) {
				return LOG.err('必须包含回调方法名');
			}

			if (!_.isFunction(callback)) {
				callback = function (res) {
					return res;
				}
			}

			cbName = $split.call(result[result.length - 1], equalREG)[1];
			script.type = "text/javascript";
			script.src = url;
			_.append(BODY, script);
			window[cbName] = function (res) {
				_.removeNode(script);
				callback(res);
			};
		},

		getText : function getText (url, data, opts) {
			opts = opts || {};
			data = data || {};
			return _.ajax(url, 'get', data, {
				resType: 'text',
				version: opts.version
			});
		},

		ajax : function ajax (url, method, data, opts) {
			opts = opts || {};

			if (opts.resType != 'text') {
				_.extend(data, JSpring.commonParam || $create(null));
			}

			data = _.serialize(data);
			return new Promise(function(resolve, reject) {
				return _.http(url, method, data, opts, resolve, reject);
			}, opts);
		},

		http : function http (url, method, data, opts, resolve, reject) {
			opts = opts || {};
			var client = new XMLHttpRequest(),
				responseType = opts.resType || 'json';

			if (method == 'get') {
				url += /\?/.test(url) ? '&' + data : '?' + data;
				data = null;
			}

			client.open(method, url, true);
			client.setRequestHeader('signal', 'ab4494b2-f532-4f99-b57e-7ca121a137ca');
			client.onreadystatechange = handler;

			try {
				client.responseType = responseType;
			} catch (err) {
				client.setRequestHeader('responseType', responseType);
			}
			client.setRequestHeader("Content-Type", opts.contentType || "application/x-www-form-urlencoded;charset=utf-8");
			client.send(data);

			function handler () {
				var response;

				if (this.readyState !== 4) {
					return;
				}

				if (this.status === 200) {
					response = this.response;

					if (responseType == 'json') {
						_.isString(response) && (response = JSON.parse(response));
					}
					resolve(response);
				} 

				else {
					reject(new Error(this.statusText));
				}
			};
		},

		serialize : function serialize (data) {
			var result = '';
			
			if (_.isObject(data)) {
				_.each($keys(data), function seriKeyEach (key) {
					var value;

					if (_.isArray(value = data[key])) {
						_.each(value, function seriValueEach (val) {

							if (!_.isVoid0(val)) {
								result += key + '=' + encodeURIComponent(val) + '&';
							} 

							else {
								result += key + '=&';
							}
						});
					} 

					else {

						if (!_.isVoid0(value)) {
							result += key + '=' + encodeURIComponent(value) + '&';
						} 

						else {
							result += key + '=&';
						}
					}
				});
			}
			return $substr.call(result, 0, result.length - 1);
		},

		getChannel : function getChannel () {
			var 
				firstChannel
				, secondChannel
				;

			if (_.isApp && _.isIOS) {
				firstChannel = "IPHONE";
				secondChannel = "AppStore";
			} 

			else if (_.isApp && _.isAndroid) {
				firstChannel = "ANDROID";
				secondChannel = UA.substring(UA.indexOf("ANDROID_") + 8, UA.lastIndexOf("LVMM") - 1);
			} 

			else if (_.isApp && _.isPad) {
				firstChannel = "IPAD";
				secondChannel = "AppStore";
			} 

			else if (_.isWp && _.isWebview) {
				firstChannel = "WP";
				secondChannel = "WPStore";
			} 

			else {
				firstChannel = "TOUCH";
				secondChannel = "LVMM";
			}
			
			return {
				firstChannel : firstChannel,
				secondChannel : secondChannel
			};
		},

		makeHashCode : function makeHashCode (prefix) {
			prefix = prefix || UNIQ;
			return String(Math.random() + Math.random())
				.replace(REGEXP.rhashcodeRE, prefix);
		},

		inDOC : function inDOC (node, ct) {
			ct = ct || DOC;

			if (!ct || !ct.contains) {
				return false;
			}
			return ct.contains(node);
		},

		replaceEscapeWord : function replaceEscapeWord (text) {
			return text.replace(/&nbsp;/g, '\u00A0')
				.replace(/&quot;/g, '"')
				.replace(/&amp;/g, '&')
				.replace(/&gt;/g, '>')
				.replace(/&lt;/g, '<')
				.replace(/&reg;/g, '®')
				.replace(/&trade;/g, '™')
				.replace(/&copy;/g, '©')
				.replace(/&times;/g, '×')
				.replace(/&divide;/g, '÷')
				.replace(/&yen;/g, '¥');
		},

		toBool : function toBool (value) {
			return !!value;
		},

		lower : function lower (string) {
			return string.toLowerCase
				&& string.toLowerCase();
		},

		clearArr : function clearArr (target, keyArr) {
			this.each(keyArr, function clearEach (key) {
				target[key] = [];
			});
		},

		push : function push (arr, child, arrFlag) {

			if (arrFlag || this.isArray(arr)) {
				arr[arr.length] = child;
			}
			return arr;
		},

		arrPush : function arrPush (arr, list, arrFlag) {
			var 
				_this = this
				;

			if (_this.isArray(arr) && (arrFlag || list.length)) {
				_this.each(list, function arrPushEach (item) {
					_this.push(arr, item, true);
				});
			}
			return arr;
		},

		prev : function prev (arr) {
			return arr.shift();
		},

		remove : function remove (child, parent) {
			var index = this.indexOf(parent, child);

			if (index > -1) {
				$splice.call(parent, index, 1);
			}
			return this;
		},

		before : function before (newChild, child, parent) {
			var index = this.indexOf(parent, child);

			if (index > -1) {
				$splice.call(parent, index, 0, newChild);
			};
		},

		replace : function replace (newChild, child, parent) {
			var index = this.indexOf(parent, child);

			if (index > -1) {
				return $splice.call(parent, index, 1, newChild);
			}
		},

		attr : function attr (el, key, value) {

			if (this.isVoid0(value)) {
				return el.getAttribute(key);
			}
			el.setAttribute(key, value);
		},

		isNode : function isNode (node) {
			return this.toBool(node && node.nodeType);
		},

		parent : function parent (node) {

			if (!this.isNode(node)) {
				return false;
			}
			return node.parentNode || false;
		},

		removeNode : function removeNode (node) {

			if (this.isNode(node)) {
				var parent = this.parent(node);

				if (parent) {
					return parent.removeChild(node);
				}
			}
			return false;
		},

		beforeNode : function beforeNode (newNode, node) {

			if (this.isNode(newNode) && this.isNode(node)) {
				var parent = this.parent(node);

				if (parent) {
					parent.insertBefore(newNode, node);
				}
			}
			return this;
		},

		replaceNode : function replaceNode (newNode, node) {

			if (this.isNode(node) && this.isNode(newNode)) {
				var parent = this.parent(node);

				if (parent) {
					parent.replaceChild(newNode, node);
				}
				return newNode;
			}
		},

		indexOf: function indexOf (arr, obj, strict) {
			var i = arr.length;

			if (!strict) {

				while (i--) {
					if (arr[i] == obj) return i;
				}
			} 

			else {

				while (i--) {
					if (arr[i] === obj) return i;
				}
			}
			return -1;
		},

		inArray: function inArray (arr, child) {

			if (this.isArray(arr)) {
				return this.toBool(~this.indexOf(arr, child));
			}
			return this.toBool(~this.indexOf(this.toArray(arr), child));
		},

		toArray : function toArray (arrayLikeObj) {
			var arr = [], len;

			if (len = arrayLikeObj.length) {

				for (var i = 0; i < len; ++i) {
					arr[i] = arrayLikeObj[i];
				}
			}
			return arr;
		},

		extend : function extend (target , source, excepts) {

			if (!excepts) {

				for (var key in source) {
					target[key] = source[key];
				}
			}

			else if (this.isArray(excepts)) {
				for (var key in source) {

					if (!this.inArray(excepts, key)) {
						target[key] = source[key];
					}
				}
			}

			else if (this.isString(excepts)) {
				for (var key in source) {

					if (excepts !== key) {
						target[key] = source[key];
					}
				}
			}
			
			return target;
		},

		isVoid0 : function isVoid0 (value) {
			return value == void 0;
		},

		isWindow : function isWindow (obj) {
			return obj && obj.window === obj;
		},

		isArrayLike : function isArrayLike (obj) {

			if (obj == null || _.isWindow(obj)) {
				return false;
			}

			var length = obj.length;

			if (obj.nodeType === 1 && length) {
				return true;
			}

			return this.isString(obj) 
				|| this.isArray(obj) 
				|| length === 0 
				|| typeof length === 'number' 
				&& length > 0 
				&& (length - 1) in obj;
		},

		each : function each (arr, callback) {
			var 
				result
				, attrArr
				, key
				, l
				, i = -1;

			if (arr && (l = arr.length)) {

				while (++i < l) {
					
					if (!this.isVoid0(result = callback(arr[i], i, arr))) {
						return result;
					}
				}
			} else if (this.isObject(arr)) {
				attrArr = $keys(arr);
				l = attrArr.length;

				while (++i < l) {
					key = attrArr[i];

					if (!this.isVoid0(result = callback(arr[key], key, arr))) {
						return result;
					}
				}
			}
		},

		arrEqual : function arrEqual (arr1, arr2) {
			return arr1.length == arr2.length
				&& arr1.toString() === arr2.toString();
		},

		proxyEqual : function proxyEqual (v1, v2) {
			var 
				_this = this
				, l1
				, l2
				;

			if (isBothObjOrArr(v1, v2)) {

				if (v2.__isDiff) {
					return false;
				}

				if (_.isArray(v1)) {
					l1 = v1.length;
					l2 = v2.length;
				} 

				else {
					l1 = $keys(v1).length;
					l2 = $keys(v2).length;
				}

				return l1 == l2 ? _.isVoid0(_.each(v1, function proxyEach (_v1, i) {
					var _v2 = v2[i];

					if (isBothObjOrArr(_v1, _v2)) {
						return _this.proxyEqual(_v1, _v2) ? null : true;
					}

					if (_v1 != _v2) {
						return false;
					}
				})) : false;
			}
			return v1 === v2;
		},

		flattenArr : function flattenArr (arr, cb) {
			cb = cb || noop;
			var 
				_this = this
				, tmpArr = []
				;

			if (_this.isArray(arr)) {
				arr.length && _this.each(arr, function flattenEach (el) {

					if (!_this.isArray(el)) {
						cb(el);
						_this.push(tmpArr, el || {}, true);
					} 

					else {
						_this.arrPush(tmpArr, _this.flattenArr(el, cb));
					}
				});
			}
			return tmpArr;
		},

		append : function append (parent, child, backParent) {
			if (this.isElement(parent) || this.isDocumentFragment(parent)) {
				return parent.appendChild(child);
			} 

			else if (backParent) {
				return backParent.appendChild(child);
			}
		},

		clone : function clone (node, deep) {
			return node.cloneNode(deep || true);
		}
	};

	_.each($split.call('Function Object Array Undefined Null Number String  Boolean File Blob FormData', REGEXP.spaceRE), function isEach (el, i, arr) {
		_['is' + el] = function (obj) {
			return $toString.call(obj) == '[object ' + el + ']';
		};
	});

	_.each(NODETYPE, function nodeTypeEach (nodeType, key) {
		_['is' + key] = function (obj) {
			return obj.nodeType == nodeType;
		};
	});

	_.each([BROWSER, PLATFORM], function enumEach (keyObj) {
		_.each($keys(keyObj), function keyObjEach (key) {
			_['is' + key] = REGEXP.test(keyObj[key], UA);
		});
	});

	_.each($split.call('push pop shift unshift splice sort reverse', REGEXP.spaceRE), function arrayProtoEach (method) {
		var protoMethod = arrProto[method];
		defVal(arrProto, '$' + method, function arrProVal () {
			var result = protoMethod.apply(this, arguments);
			batchedUpdate(this.__vm);
			return result;
		});
	});

	defVal(arrProto, '$set', function arrProSetVal (index, value) {
		var len = this.length;

		if (index > len) {
			this.length = +index + 1;
		}
		return this.$splice(index, 1, value)[0];
	});

	defVal(arrProto, '$remove', function arrProRemoveVal (index) {
		var len = this.length;

		if (!len) return;
		index = +index;

		if (_.isNaN(index)) {
			return;
		}

		if (index < len) {
			return this.$splice(index, 1);
		}
	});


	/**
	  * Promise
	  */
	function Promise (callback, opts) {
		var _this = this;
		opts = opts || {};
		_.extend(_this, opts);

		_this.callback = callback;
		_this._cbQueue = [];
		_this._fbQueue = [];
		_this.promiseId = _.makeHashCode();

		_this.cb = function cbFn (res) {
			return _this.res = res;
		};

		_this.fb = function fbFn (err) {
			return _this.err = err;
		};

		_this.init(callback, {
			inst: _this
		});
	};

	Promise.prototype = {
		constructor: Promise,
		init : function init (callback, opts) {
			opts = opts || {};
			var inst = opts.inst;
			inst.define(opts.inst);

			if (_.isFunction(callback)) {
				callback.call(inst, inst.cb, inst.fb);
			}
		},

		define : function define (inst) {
			var pId = inst.promiseId;
			inst.pushQById(pId);

			def(inst, 'res', function defResSet (res) {
				var cb;

				if (!inst.keepLoading) {
					inst.deleteQById(pId);
				}
				
				if (cb = $shift.call(inst._cbQueue)) {
					inst._res = cb.call(inst, res)
				}
			}, function defResGet () {
				return inst._res;
			});

			def(inst, 'err', function defErrSet (err) {
				inst.deleteQById(pId);
				var fb = $shift.call(inst._fbQueue);
				fb && err && (inst._err = fb.call(inst, err));
			}, function defErrGet () {
				return inst._err;
			});
		},

		pushQById : function pushQById (id) {

			if (this.resType == 'text') {
				return;
			}

			if (!this.keepLoading) {
				Promise.count++;
			}

			if (!this.noLoadingImg && !Promise.$q.length) {
				!_.inDOC(Promise.loadingImg) && BODY.appendChild(Promise.loadingImg);
			}
			_.push(Promise.$q, id);
		},

		deleteQById : function deleteQById (id) {
			var index = _.indexOf(Promise.$q, id);

			if (index > -1) {
				Promise.$q.splice(index, 1);

				if (!Promise.$q.length && !Promise.inProcess) {
					Promise.inProcess = true;
					Promise.stopProcess(this);
				} 

				else {
					Promise.stopProcess(this);
				}
			}
			return this;
		},

		detectType : function detectType (type, inst) {
			var callback = inst.callback;
			while (callback instanceof Promise) {
				callback = callback.callback;
			}

			if (type == 'resolve') {
				return inst.cb.call(inst, inst._res || callback);
			}

			if (type == 'reject') {
				return inst.fb.call(inst, inst._err || callback);
			}
		},

		then : function _then (resolve, reject) {
			var _this = this;
			_this._cbQueue[_this._cbQueue.length] = resolve;
			_.isFunction(reject) && (_this._fbQueue[_this._fbQueue.length] = reject);
			_this.detectType(_this.type, _this);
			return _this;
		},

		'catch' : function _catch (reject) {
			var _this = this;
			_this._fbQueue[_this._fbQueue.length] = _.isFunction(reject) ? reject : function() {
				return _this;
			};
			return _this;
		},

		done : function done (resolve, reject) {
			if (!this.end) {
				this.end = true;
				return this.then(resolve).catch(reject);
			}
			return this;
		},

		'finally' : function _finally (callback) {
			return this.then(callback);
		}
	};

	Promise.$q = [];
	Promise.inProcess = false;
	Promise.loadingImg = _.createLoadingImg();
	Promise.count = 0;
	Promise.stopProcess = function stopProcess (inst) {

		if (--Promise.count) {
			return;
		}

		if (!inst.noLoadingImg) {
			setTimeout(function() {

				if (_.inDOC(Promise.loadingImg)) {
					BODY.removeChild(Promise.loadingImg);
					Promise.inProcess = false;
				}
			}, 500);
		} else {
			Promise.inProcess = false;
		}
	};


	/**
	  * other functions
	  */
	function noop () {
		return false;
	};

	function optimizeCb (func, context) {
		var 
			args = arguments
			, collection = args[2]
			;

		return func.apply(context, _.isArray(collection) 
			? collection 
			: $slice.call(args, 2));
	};

	function insertCSS () {
		var style = document.createElement('style');
		style.className = 'JSpring_style';
		style.textContent = '.fadeIn {-webkit-transition:1s; transition:1s; opacity: 2!important; } .dataLoading{position: fixed; top: 50%; left: 50%; width:75px; height: 75px; border-radius: 4px; background: rgba(0,0,0,.6);color: #ffffff; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); white-space: nowrap; z-index: 9999; } .dataLoading i:nth-of-type(1){position: absolute; left: 23px; width: 30px; height: 30px; margin-top: 10px; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAqUExURQAAAP///////////////////////////////////////////////////4a7yi8AAAANdFJOUwCvZEnbl3vIMg8e+Ou7zMV6AAABdElEQVQoz1WRu0vDUBTGT9NXdKoPFIRA6l4o6OCDQp1cLLg6BILOgaiLS6FuigoFdVcQRERwrVJQsAiFDknf1u9/8dx7U7w9w9fk13M+zvlCxLV6x2I2SSsnw3LT08hU/YfV6mooiZDIQF9Dz+gJ0ZEjuhwEGiphwH7QvYAiW6E9gXYpJrg+aFMayE/Y25SYsKICls4e4esoAVF3FOPROYUMQTpVevHJiMbTsitDzpAuon09idrTGI5vN+sSBQaKJlRCl5KgY8BNQcRE8ZZCv3HYSbgiP+XEXdSazcqAHiLC23vR6c4YtakMFWNpjPyUUHE7whJ63Dqq5AQS9vVhAa/8Ft7KXtd0yQo8vFlATTmc79t0FVmdSO2nOnky1Dk4DryuhyZ9stmpQs13Kyijsbgn1rheXmEU5tRfA5WOyY+jtflttbEqcXmwURWoFiE5NMrzLjiK0Jaz87Vw7898H2bXI9RwKhxT5eDj/7M9bdrytyrkD87Z/XccDvR3AAAAAElFTkSuQmCC") center center no-repeat; background-size: 26px; -webkit-animation:shake 2s linear 0s infinite; animation:shake 2s linear 0s infinite; } .dataLoading i:nth-of-type(2){height: 38px; width: 38px; left: 18px; position: absolute; top: -3px; margin-top: 10px; border-top: 2px solid #fff; border-right: 1px solid #fff; border-radius: 50%; -webkit-transform:rotate(0deg); transform:rotate(0deg); -webkit-animation:loading 1s linear 0s infinite; animation:loading 1s linear 0s infinite; } .dataLoading span{position: absolute; bottom: 13px; font-size: 14px; } .dataLoading>span {position: absolute; text-align: center; top: 48px; width: 75px; } @-webkit-keyframes loading {from{ -webkit-transform:rotate(0deg)} to{ -webkit-transform:rotate(360deg)} } @keyframes loading {from{ transform:rotate(0deg);} to{ transform:rotate(360deg);} } @-webkit-keyframes shake {0% {} 75% { -webkit-transform:rotate(0deg)} 80% { -webkit-transform:rotate(45deg)} 85% { -webkit-transform:rotate(-45deg)} 90% { -webkit-transform:rotate(25deg)} 95% { -webkit-transform:rotate(-25deg)} 100%{ -webkit-transform:rotate(0deg)} } @keyframes shake {0% {} 75% {transform:rotate(0deg)} 80% {transform:rotate(45deg)} 85% {transform:rotate(-45deg)} 90% {transform:rotate(25deg)} 95% {transform:rotate(-25deg)} 100%{transform:rotate(0deg)} } .loadingMask{position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; background: rgba(0, 0, 0, 0); overflow: hidden; display: block;}';
		DOC.head.appendChild(style);
	};

	function hasDiffText (vNode, newVnode) {
		return vNode.textContent !== newVnode.textContent;
	};

	function getNonMatchReg (value) {
		return new RegExp('\\s*(?:' 
			+ value.replace(REGEXP.spaceRE, '|') 
			+ ')\\b', 'g');
	};

	function childrenDiff (prevChildren, newChildren, prevVNode, inst, childOpts) {
		var 
			i = 0
			, prevLen = prevChildren.length
			, newLen = newChildren.length
			, isNewChildrenLonger = prevLen < newLen
			, prevEnd = isNewChildrenLonger ? 1 : 0
			, newEnd = prevEnd ? 0 : 1
			, len
			;

		while (i + childOpts.nStep < newLen + newEnd || i + childOpts.pStep < prevLen + prevEnd) {
			inst.diff(newChildren[i + childOpts.nStep] || emptyDataObj
				, prevChildren[i + childOpts.pStep] || emptyDataObj
				, prevVNode
				, childOpts);
			i++;
		}
	};

	function getMapResult (arrObj, cb, inst) {
		cb = cb || noop;
		var 
			result = []
			, index = -1
			, length
			, arrKey
			;

		if (_.isArray(arrObj) || _.isString(arrObj)) {
			length = arrObj.length;

			while (++index < length) {
				result[index] = cb(arrObj[index], index, inst, index == 0, index == length - 1);
			}
		} 

		else if (_.isObject(arrObj)) {
			arrKey = $keys(arrObj);
			length = arrKey.length;

			while (++index < length) {
				result[index] = cb(arrObj[arrKey[index]], arrKey[index], inst, index == 0, index == length - 1);
			}
		}
		return result;
	};

	function getStrValue (str) {

		if (_.isVoid0(str)) {
			return '';
		}
		return str;
	};

	function setTextContent (el, text) {
		return el.textContent = text;
	};

	function replaceExpr (template, exprArr) {
		template = template.replace(REGEXP.lineRE, SPACE);
		_.each(exprArr, function exprArrEach (expr) {
			expr = expr.replace(REGEXP.lineRE, SPACE);
			var exprVar = expr.substring(2, expr.length - 2);
			template = template.replace(expr, '" + __j._v(' + exprVar + ') + "');
		});
		return template;
	};

	function convertObjToValue (obj, separator) {
		var tmpArr = [];
		if (_.isObject(obj)) {
			_.each(obj, function convertObjEach (value, key) {
				value && _.push(tmpArr, key);
			});
		}

		if (arguments.length > 1) {
			return tmpArr.join(separator);
		}
		return tmpArr;
	};

	function convertStyleStrToObj (str) {
		var 
			attrMatch
			, styleObj = $create(null)
			;

		while ((attrMatch = REGEXP.styleRE.exec(str)) != null) {
			styleObj[attrMatch[1]] = attrMatch[2];
		}
		return styleObj;
	};

	function isForAttr (attr) {
		return REGEXP.test(REGEXP.forRE, attr);
	};

	function isComponentAttr (attr) {
		return REGEXP.test(REGEXP.compRE, attr);
	};

	function isOnAttr (attr) {
		return REGEXP.test(REGEXP.onRE, attr);
	};

	function bindStaticAndUniqAttrs (vNode, el, statics, uniq, uKeys, instance) {
		statics && _.each(statics, function staticEach (value, key) {
			_.attr(el, key, value);
		});
		
		uniq && _.each(uKeys, function uniqEach (key) {
			optimizeCb(DIRECT[key], instance, el, uniq[key], vNode);
		});
	};

	function genElemFromVNode (vNode, instance) {
		var 
			el
			, textCt
			, children = vNode.children
			, data = vNode.data
			, createFn = DOC[NodeFn[vNode.nodeType || 1]].bind(DOC)
			;

		if (vNode.isElem) {
			el = createFn(vNode.tagName);
			bindStaticAndUniqAttrs(vNode, el, data.static, data.uniq, data.uKeys, instance);
			children.length && _.each(children, function genElemFromVNodeEach (child) {
				_.append(el, genElemFromVNode(child, instance));
			});
		} 

		else {
			textCt = vNode.textContent;

			if (_.isText(vNode)) {
				el = _.clone(textNode);
				el.textContent = textCt;
			} 

			else {
				el = createFn(textCt)
			}
		}

		if (!vNode.el) {
			vNode.el = el;
		}

		return vNode.el || el;
	};

	function createElemAndAppend (vNode, instance, frag) {
		var 
			el
			, data = vNode.data
			, parentVNode = vNode.parentVNode || frag
			, ifEl = parentVNode.ifEl
			, parentVEl = parentVNode.el || frag
			, createFn = DOC[NodeFn[vNode.nodeType || 1]].bind(DOC)
			;

		if (vNode.isElem) {
			el = createFn(vNode.tagName);
			_.append(parentVEl, el, ifEl);
			bindStaticAndUniqAttrs(vNode, el, data.static, data.uniq, data.uKeys, instance);
		} 

		else {
			var textCt = vNode.textContent;

			if (_.isText(vNode)) {
				el = _.clone(textNode);
				el.textContent = textCt;
				_.append(parentVEl, el, ifEl);
			} 

			else {
				_.append(parentVEl, createFn(textCt));
			}
		}

		if (!vNode.el) {
			vNode.el = el;
		}
	};

	function appendVObjChildren (parent, vObj) {
		var children = parent.children;
		_.push(children, vObj);
		vObj.parentVObj = parent;
		vObj.index = children.length - 1;
	};

	function extendStaticAndUniqAttrs (target, source) {
		var 
			tData = target.data
			, sData = source.data
			, tStatic = tData.static
			, sStatic = sData.static
			, tUniq = tData.uniq
			, sUniq = sData.uniq
			;
		
		if (sStatic) {

			if (!tStatic) {
				tStatic = tData.static = $create(null);
			}

			for (var key in sStatic) {

				if (key != 'class' && key != 'style') {
					tStatic[key] = sStatic[key];
				}

				else {
					tStatic[key] = tStatic[key] || '';
					tStatic[key] += (tStatic[key] ? key == 'class' ? ' ' : ';' : '')
						+ sStatic[key];
				}
			}
		}
		
		if (sUniq) {

			if (!tUniq) {
				tUniq = tData.uniq = $create(null);
			}
			_.extend(tUniq, sUniq || {});
			tData.uKeys = $keys(tUniq);
		}

		return target;
	};

	function createVObj (tagName, html, inst) {
		var 
			attrMatch
			, attrKey
			, attrValue
			, uniqAttrs = $create(null)
			, staticAttrs = $create(null)
			, isComponent = false
			, isStatic = true
			, isFor = false
			, match
			;

		while ((attrMatch = REGEXP.attrsRE.exec(html)) != null) {
			attrKey = attrMatch[1];
			attrValue = !_.isVoid0(attrMatch[2]) 
				? attrMatch[2] 
				: !_.isVoid0(attrMatch[3]) 
				? attrMatch[3] 
				: attrMatch[4];

			if (match = attrKey.match(REGEXP.uniqRE)) {
				uniqAttrs[match[1]] = _.replaceEscapeWord(attrValue);
				inst.isStatic = isStatic = false;

				if (isForAttr(attrKey)) {
					isFor = attrValue;
				}

				if (isComponentAttr(attrKey)) {
					isComponent = attrValue;
				}
			} 

			else {
				staticAttrs[attrKey] = attrValue;
			}
		}
		return {
			tagName : tagName,
			staticAttrs : staticAttrs,
			staticKeys : $keys(staticAttrs),
			uniqAttrs : uniqAttrs,
			uniqKeys : isStatic ? [] : $keys(uniqAttrs),
			children : [],
			isElem : true,
			isFor : isFor,
			isComponent : isComponent,
			isStatic : isStatic,
			nodeType : 1
		};
	};

	function createVCommentObj (comment, parentVObj, inst) {
		return {
			isElem : false,
			isStatic : false,
			nodeType : 8,
			data : STRING,
			textContent : REGEXP.replace(comment, REGEXP.commentRE, STRING)
		};
	};

	function createVTextObj (text, parentVObj, inst) {
		var hasBrace = text.match(REGEXP.textBindRE) || false;
		hasBrace && (inst.isStatic = false);
		return {
			isElem : false,
			nodeType : 3,
			hasBrace : hasBrace,
			textContent : _.replaceEscapeWord(text)
		};
	};

	function createVTextNode (text, hasBrace) {
		return {
			isElem : false,
			nodeType : 3,
			isStatic : !hasBrace,
			data : STRING,
			textContent : text
		};
	};

	function def (obj, key, setter, getter) {
		return $defProp(obj, key, {
			enumerable : true,
			configurable : true,
			set : setter,
			get : getter
		});
	};

	function defVal (obj, key, val) {
		return $defProp(obj, key, {
			enumerable : false,
			configurable : true,
			value : val
		});
	};

	function query (selector) {
		return DOC.querySelectorAll(selector);
	};

	function isBothObjOrArr (v1, v2) {
		return _.isObject(v1) && _.isObject(v2)
			|| _.isArray(v1) && _.isArray(v2);
	};

	function isBothTextNode (vNode1, vNode2) {
		return _.isText(vNode1) && _.isText(vNode2);
	};

	function isBothCommentNode (vNode1, vNode2) {
		return _.isComment(vNode1) && _.isComment(vNode2);
	};

	function isTheSameTagName (vNode1, vNode2) {
		return vNode1.tagName === vNode2.tagName;
	};

	function isBothStaticNode (vNode1, vNode2) {
		return vNode1.isStatic && vNode2.isStatic;
	};

	function isHasTagName (vNode1, vNode2) {
		return vNode1.tagName && vNode2.tagName;
	};

	function isBothForNode (vNode1, vNode2) {
		return vNode1.isFor && vNode2.isFor;
	};

	function isTheSameStaticVNode (vNode1, vNode2) {
		var result = {
			isStatic : isBothStaticNode(vNode1, vNode2),
			isHasTag : isHasTagName(vNode1, vNode2)	
		};

		if (!result.isHasTag) {
			result.isBothText = isBothTextNode(vNode1, vNode2);
			result.isBothCmt = isBothCommentNode(vNode1, vNode2);
			result.isEqStatic = result.isStatic && (result.isBothText || result.isBothCmt);
		} 

		else {
			result.isEqFor = isBothForNode(vNode1, vNode2);
			result.isEqStaticAttr = vNode1.data && vNode2.data && _.proxyEqual(vNode1.data.static, vNode2.data.static);
			result.isEqTag = result.isHasTag && isTheSameTagName(vNode1, vNode2);
			result.isEqStatic = result.isStatic && result.isEqTag && result.isEqStaticAttr;
			result.isEqStaticTag = result.isEqTag && result.isEqStaticAttr;
		}
		return result;
	};

	function getChildResult (children, inst) {
		return children.length 
			? '[' + getMapResult(children, genVNodeExpr, inst) + ']' 
			: '[]';
	};

	function genVNodeExpr (vObj, index, inst) {
		var 
			data = getVObjData(vObj)
			, children = vObj.children
			, text
			;

		if (_.isElement(vObj)) {

			if (!vObj.isStatic) {
				return genUniqVNodeExpr(vObj, inst);
			}
			return '__j._n(\"'
				+ vObj.tagName + '\", '
				+ $stringify(data) + ', '
				+ getChildResult(children, inst)
				+ ')';
		} 

		else {
			text = data.textContent;

			if (_.isText(vObj)) {

				if (vObj.hasBrace) {
					return '__j._tn(' + replaceExpr($stringify(text), vObj.hasBrace) +', true)';
				}
				return '__j._tn(' + $stringify(text) + ')';
			} 

			else if(_.isComment(vObj)) {
				return '__j._cn(\"' + text + '\")';
			}
		}	
	};

	function genUniqVNodeExpr (vObj, inst) {
		var 
			children = vObj.children
			, uniqKeys = vObj.uniqKeys
			, staticKeys = vObj.staticKeys
			, res = '{'
			;

		if (staticKeys.length) {
			res += 'static:{';
			_.each(staticKeys, function staticKeyEach (key) {
				res += '\"' + key + '\":\"' + vObj.staticAttrs[key] + '\",'
			});
			res += '},';
		}

		if (uniqKeys.length) {
			res += 'uniq:{';
			_.each(uniqKeys, function uniqKeyEach (key) {

				if (ATTR[key]) {
					res += '\"' + key + '\" : ' + GEN[key](vObj, vObj.uniqAttrs[key]) + ',';
				}
			});
			res += '}';
			res += ',"isFor":' + _.toBool(vObj.isFor);
		}
		res += '}';

		if (vObj.isFor) {
			return genFor(vObj, res, inst);
		}

		if (vObj.isComponent) {
			return genComponent(vObj, res, inst);
		}

		return '__j._n(\"'
			+ vObj.tagName 
			+ '\", ' 
			+ res + ', '
			+ getChildResult(children, inst)
			+ ')';
	};

	function createVNode (tag, data, children, isComponent) {
		data = data || {};
		
		var 
			_this = this
			, vNode
			, uniq = data.uniq
			, cach = _this.cach
			, key
			, isStatic = !uniq
			, compVNode
			;

		if (uniq) {
			data.uKeys = $keys(uniq).sort(function uKeysSort (a, b) {
				return PRIO[b] - PRIO[a];
			});
		}

		vNode = new VNode(tag, data, {
			isFor : _.toBool(data.isFor),
			isNeedRender : _.toBool(data.isNeedRender),
			isStatic : isStatic,
			instance : _this
		});

		vNode.children = _.flattenArr(children || [], function vNChildCb (child) {
			child.parentVNode = vNode;
		});

		if (isComponent) {
			compVNode = vNode.children[0];
			extendStaticAndUniqAttrs(compVNode, vNode);
			return compVNode;
		}

		return vNode;
	};

	function getVObjData (obj) {

		if (_.isElement(obj)) {
			var data = {};

			if (obj.uniqKeys.length) {
				data.uniq = obj.uniqAttrs;
			}

			if (obj.staticKeys.length) {
				data.static = obj.staticAttrs;
			}
			return data;
		}
		return {
			nodeType : obj.nodeType,
			textContent : obj.textContent
		};
	};

	function makeGetterFn (body, callback) {
		try {
			return new Function('__j', body + ';');
		} catch (e) {

			if (!_.isFunction(callback)) {
				LOG.warn('TIP : ' + e.message);
				return noop;
			}
			return callback(body);
		}
	};

	function callHook ($q) {
		var 
			hook
			, args = optimizeCb($slice, arguments, 1)
			;

		if (!_.isArray($q)) {
			return false;
		}
		hook = _.prev($q);

		while (hook) {
			hook(args);
			hook = _.prev($q);
		}
		return true;
	};

	function _defineProp (defKey, value, instance, defObj, key, keyValue) {
		var keyObj = {};

		if (_.isArray(value)) {
			
			if (defObj && key) {
				keyObj[key] = value;
				defineProp.call(instance, keyObj, defObj);
			}
			defVal(value, '__vm', instance);
			_.each(value, function valueArrEach (arrChild, index) {

				if (_.isObject(arrChild)) {
					defineProp.call(instance, arrChild, defKey[index]);
				}
			});
		} 

		else if (_.isObject(value)) {

			if (defObj && key) {
				defKey = {};
				keyObj[key] = defKey;
				defineProp.call(instance, keyObj, defObj);
			}
			defineProp.call(instance, value, defKey);
			defVal(value, '__isDiff', true);
		}
	};

	function defineProp (data, defObj, inst) {
		var _this = this;
		defObj = defObj || {};

		_.each(data, function propEach (value, key) {
			def(defObj, key, function defSet (newVal) {

				if (!_.proxyEqual(value, newVal)) {
					_defineProp(defObj[key], value = newVal, _this, defObj, key);
					optimizeCb(notifyChange, inst || _this, key);
				}
			}, function defGet () {
				return value;
			});
			_defineProp(defObj[key], value, _this);
		});
		return defObj;
	};

	function notifyChange (key) {
		_.push(this.cach.updateKey, key);
		return batchedUpdate(this);
	};

	function batchedUpdate (instance) {

		if (instance.pending) {
			return;
		}

		instance.pending = true;
		setTimeout(function () {
			console.time('diff');
			var newVNode = optimizeCb(instance.renderFn, instance, instance);
			instance.diff(newVNode);
			console.timeEnd('diff');
			instance.update().nextTick().collectGb();
			instance.pending = false;
			newVNode = null;
		});
	};


	/**
	* $
	**/
	function Query (selector) {

		if (typeof selector == 'object') {
			this.els = _.isArrayLike(selector) ? _.toArray(selector) : [selector];
		} 

		else {
			this.els = _.toArray(query(selector));
			this.context = DOC;
		}
		this.exist = _.toBool(this.els.length);
	};

	Query.prototype = {
		constructor: Query,

		val : function val (value) {

			if (_.isVoid0(value)) {
				return this.els[0] ? this.els[0].value : '';
			}
			this.each(function valEach (el) {
				el.value = value;
			});
			return this;
		},

		remove : function remove() {
			this.each(function removeEach (el) {
				_.remove(el);
			});
			return this;
		},

		each : function each (callback) {

			if (_.isFunction(callback)) {
				this.els.length && this.els.forEach(function eachEach (el, i, arr) {
					callback(el, i, arr);
				});
			}
			return this;
		},

		html : function _html (html) {

			if (_.isVoid0(html)) {
				return this.els[0].innerHTML;
			}
			this.each(function htmlEach (el) {
				el.innerHTML = html;
			});
			return this;
		},

		attr : function attr (key, value) {

			if (!(1 in arguments)) {
				return this.els[0].getAttribute(key);
			}
			this.each(function attrEach (el, i) {
				el.setAttribute(key, value);
			});
			return this;
		},

		append : function append (child) {
			var frag = $createEl('div'),
				children;
			if (!_.isNode(child) && !child.length) {
				return this;
			}

			if (child.length) {
				children = _.toArray(child);
			} 

			else if (_.isDocumentFragment(child)) {
				children = _.toArray(child.children);
			} 

			else {
				frag.innerHTML = child;
				children = _.toArray(frag.childNodes);
			}

			this.each(function appendEach (el, index) {
				children.forEach(function appendChildEach (child) {
					el.appendChild(child);
				});
			});
			return this;
		},

		css : function css (cssHtml, value) {
			var _this = this;

			if (typeof cssHtml == 'object') {
				$keys(cssHtml).forEach(function cssEach (cssName) {
					_this.each(function cssElEach (el) {
						el.style[cssName] = cssHtml[cssName];
					});
				});
			} 

			else if (typeof cssHtml == 'string' && !_.isVoid0(value)) {
				this.each(function cssEach (el) {
					el.style[cssHtml] = value;
				});
			} 

			else {
				return getComputedStyle(this.els[0], null).getPropertyValue(cssHtml);
			}
			return this;
		},

		show : function show () {
			this.each(function showEach (el) {
				el.style.display = 'block';
			});
		},

		hide : function hide () {
			this.each(function hideEach (el) {
				el.style.display = 'none';
			});
		},

		on : function on (evtType, callback, useCapture) {
			this.each(function onEach (el) {
				el.addEventListener(evtType, callback, useCapture || false);
			});
			return this;
		},

		addClass : function addClass (className) {
			var classArr = $split.call(className, REGEXP.spaceRE);
			this.each(function addClassEach (el) {
				classArr.forEach(function addClassArrEach (cls) {
					el.classList.add(cls);
				});
			});
			return this;
		},

		removeClass : function removeClass (className) {
			var classArr = $split.call(className, REGEXP.spaceRE);
			this.each(function removeClassEach (el) {
				classArr.forEach(function removeClassArrEach (cls) {
					el.classList.remove(cls);
				});
			});
			return this;
		},

		hasClass : function hasClass (className) {
			return this.els[0].classList.contains(className);
		},

		eq : function eq (index) {
			return this.els[index] || false;
		},

		first : function first () {
			return this.eq(0);
		},

		last : function last () {
			return this.eq(this.els.length - 1);
		},

		children : function children () {
			return _.toArray(this.eq(0).children);
		},

		scrollIntoView : function scrollIntoView() {
			this.els[0].scrollIntoView();
			return
		}

	};

	function $ (selector) {

		if (_.isUndefined(selector)) {
			return LOG.warn('Query need a selector');
		}

		if (typeof selector == 'function') {
			return DOC.addEventListener('DOMContentLoaded', function domCtLoadFn () {
				selector(w, DOC);
			}, false);
		}
		return new Query(selector);
	};

	_.extend($, _);


	/**
	 * VNode
	 **/
	function VNode (tagName, data, props) {
		var _this = this;
		_this.tagName = tagName;
		_this.data = data;
		_this.init(props || {});
		return _this;
	};

	VNode.prototype = {
		constructor : VNode,
		isElem : true,
		init : function init (props) {
			var _this = this;
			_this.isFor = props.isFor;
			_this.isNeedRender = props.isNeedRender;
			_this.isStatic = props.isStatic;
			_this.instance = props.instance;
			_this.scope = _this.instance.$scope;
		},

		update : function update (attr) {
			return optimizeCb(DIRECT[attr]
				, this.instance
				, this.el
				, this.data.uniq[attr]
				, this
				);
		},

		insertBefore : function insertBefore (newVNode, vNode) {
			var 
				_this = this
				, parentVNode = vNode.parentVNode
				, newEl = genElemFromVNode(newVNode, _this.instance)
				;
			
			_.before(newVNode, vNode, parentVNode.children);
			newVNode.parentVNode = parentVNode;
			_.beforeNode(newEl, vNode.el);
			newVNode.el = newEl;
		},

		remove : function remove () {
			_.remove(this, this.parentVNode.children);
			_.removeNode(this.el);
		},

		replace : function replace (newVNode) {
			var 
				_this = this
				, parentVNode = _this.parentVNode
				, newEl = genElemFromVNode(newVNode, _this.instance)
				;

			_.replace(newVNode, _this, parentVNode.children);
			newVNode.parentVNode = parentVNode;
			_.replaceNode(newEl, _this.el);
			newVNode.el = newEl;
		},

		append : function append (newVNode) {
			var 
				_this = this
				, newEl = genElemFromVNode(newVNode, _this.instance)
				;

			_.push(_this.children, newVNode);
			newVNode.parentVNode = _this;
			_.append(_this.el, newEl);
			newVNode.el = newEl;
		}
	};


	/**
	 * GEN
	 */
	function getIfElem (el, vNode) {
		return vNode.ifEl || el;
	};

	function publicGen (vObj, value) {
		return value;
	};
	
	var  
		genText = publicGen 
		, genHtml = publicGen
		, genIndex = publicGen
		, genParent = publicGen
		;

	function genModel (vObj, value) {
		return '[' + $stringify(value) + ', ' + value + ']';
	};

	function genIf (vObj, value) {
		return '!!(' + value + ')';
	};

	var  
		genShow = genIf
		, genHide = genIf
		, genToggle = genIf
		;

	function genClass (vObj, value) {

		if (REGEXP.boolClassRE.test(value)) {
			return value.replace(REGEXP.squareRE, "[!!($1)]");
		}
		return value;
	};

	var 
		genStyle = genClass
		, genAttr = genClass
		, genSrc = genClass
		, genData = genClass
		, genHref = genClass
		;

	function genOn (vObj, value) {
		var 
			match
			, tmpArr = []
			, formatFlag = false
			;
		
		while (match = REGEXP.onExpRE.exec(value)) {
			formatFlag = true;
			_.prev(match);
			match[0] = '"' + match[0] + '"';
			_.push(tmpArr, '[' + match.toString() + ']');
		}

		return formatFlag
			? '[' + tmpArr.join(', ') + ']'
			: (WARN.format('on'), STRING);
	};

	function genFor (vObj, attrStr, inst) {
		var 
			match
			, children = vObj.children
			, str
			, parent
			, index
			;
				
		if (match = vObj.isFor.match(REGEXP.forExpRE)) {
			index = match[3];
			parent = match[2];
			str = '__j._mp(' + parent + ', function(' + match[1] + ', '
				+ (index || '$index') + ', $this, $first, $last) {';

			if (!vObj.isComponent) {
				str += 'return __j._n(\"' + vObj.tagName + '\", ' + attrStr + ', '
					+ getChildResult(children, inst)
					+ ');';
			} 

			else {
				str += 'return ' 
					+ genComponent(vObj, attrStr, inst, parent, index || '$index');
			}
			str += '}, __j)';
			return str;
		}
		return WARN.format('for'), STRING;
	};

	function genComponent (vObj, attrStr, inst, parent, index) {
		var 
			tagName = vObj.tagName
			, component = JSpring.component[tagName || 'div']
			, componentData
			;

		if (component) {
			componentData = vObj.isComponent;
			parent = parent || componentData;
			component.vObj = inst.analyzeHtml(component.template);
			component.vTpl = genVNodeExpr(component.vObj, 0, inst);
			component.props = component.props || {};
			component.$scope = component.$scope || optimizeCb(defineProp
				, component
				, component.props
				, {}
				, inst);
			_.push(vObj.children, component.vObj);

			return component.vTpl = '(function('
				+ component.data
				+ ', '
				+ (component.index || '$index')
				+ ', '
				+ (component.parent || '$parent')
				+ ') { with(__j._cp["'
				+ tagName
				+ '"].$scope) {return __j._n(\"'
				+ vObj.tagName
				+ '\", '
				+ attrStr
				+ ', ['
				+ component.vTpl
				+ '], true)}} ('
				+ componentData
				+ ', '
				+ index
				+ ', "'
				+ parent
				+ '"))';
		}

		return LOG.warn(WARN.missComp(tagName)),
			'__j._n("'
				+ vObj.tagName
				+ '")';
	};

	/**
	 * DIRECT
	 */
	function vText (el, value, vNode) {
		el = getIfElem(el, vNode);
		_.push(this.cach.tickQ, function textTick () {

			if (!_.isObject(value)) {
				return el.textContent = value;
			} 

			else {
				el.textContent = convertObjToValue(value, '');
			}
		});
	};

	function vHtml (el, value, vNode) {
		el = getIfElem(el, vNode);
		
		if (!_.isObject(value)) {
			return el.innerHTML = value;
		} 

		else {
			el.innerHTML = convertObjToValue(value, '');
		}
	};

	function vShow (el, value, vNode) {
		el = getIfElem(el, vNode);
		el.style.display = value ? 'block' : 'none';
	};

	function vHide (el, value, vNode) {
		el = getIfElem(el, vNode);
		el.style.display = value ? 'none' : 'block';
	};

	var vToggle = vShow;

	function vOn (el, value, vNode) {
		el = getIfElem(el, vNode);
		var _this = this;

		if (!vNode.evtObj) {
			vNode.evtObj = {};
		}

		_.each(value, function valueEach (evtArr) {
			var 
				type = evtArr[0]
				, callback = evtArr[1]
				, args = optimizeCb($slice, evtArr, 2)
				;

			if (type && callback) {

				if (vNode.evtObj[type]) {
					el.removeEventListener(type, vNode.evtObj[type], false);
				}

				el.addEventListener(type, vNode.evtObj[type] = function onCallback ($event) {
					return optimizeCb(callback
						, _this.$scope
						, args.concat([$event])
						);
				}, false);
			}
		});
	};

	function vIf (el, value, vNode) {
		
		if (value) {

			if (!_.isElement(el)) {
				vNode.ifComment = el;
				vNode.el = _.replaceNode(vNode.ifEl, el);
			}
		} 

		else {

			if (!_.isComment(el)) {
				var comment = vNode.ifComment || DOC.createComment(el.outerHTML);
				vNode.ifEl = el;
				vNode.el = _.replaceNode(comment, el);
			}
		}
	};

	function vModel (el, value, vNode) {
		el = getIfElem(el, vNode);
		el.value = value[1];
		var 
			uniq = vNode.data.uniq
			, expression
			;
		
		if (!vNode.updateFn) {
			expression = !uniq.parent
				? value[0]
				: REGEXP.replace(value[0], REGEXP.objParentRE, uniq.parent 
					+ (_.isVoid0(uniq.index) ? '' : '[' + uniq.index + ']'));
			vNode.triggable = true;
			vNode.updateFn = new Function ('$scope', 'value', 'return $scope.' + expression + ' = value;');
			el.addEventListener('compositionstart', vNode.CompositionstartEvt = function compositionstartCb ($event) {
				vNode.triggable = false;
			}, false);

			el.addEventListener('compositionend', vNode.compositionendEvt = function compositionendCb ($event) {
				vNode.triggable = true;
			}, false);

			el.addEventListener('input', vNode.inputEvt = function inputCb ($event) {
				vNode.triggable && vNode.updateFn(vNode.scope, this.value);
			}, false);
		}
	};

	function vClass (el, value, vNode) {
		el = getIfElem(el, vNode);
		var 
			reg
			, classReg = vNode.classReg || STRING
			, className = el.className
			;

		if (_.isObject(value)) {
			value = convertObjToValue(value, ' ');
		}

		className = classReg ? className.replace(classReg, STRING) : className;
		el.className = _.trim(className + ' ' + value + ' ');
		vNode.classReg = value && getNonMatchReg(value);
	};

	function vStyle (el, value, vNode) {
		el = getIfElem(el, vNode);
		var 
			styleArr = vNode.styleArr
			, keyArr
			;
		
		if (styleArr) {
			_.each(styleArr, function styleArrEach (key) {
				el.style[key] = STRING;
			});
		}

		value = !_.isObject(value) && convertStyleStrToObj(value) || value;
		keyArr = $keys(value);

		if (keyArr.length) {

			if (_.isBoolean(value[keyArr[0]])) {
				value = convertStyleStrToObj(convertObjToValue(value, ';'));
				keyArr = $keys(value);
			}

			_.each(keyArr, function keyArrEach (key, i) {
				el.style[key] = value[key];
			});
		}
		
		vNode.styleArr = keyArr;
	};

	function vAttr (el, value, vNode) {
		el = getIfElem(el, vNode);
		var 
			keyArr
			, attrArr = vNode.attrArr
			;

		if (attrArr) {
			_.each(attrArr, function styleArrEach (key) {
				el.removeAttribute(key);
			});
		}

		if (!_.isObject(value)) {
			value = convertStyleStrToObj(value);
		}

		keyArr = $keys(value);
		_.each(keyArr, function keyArrEach (key, i) {
			el.setAttribute(key, value[key]);
		});
		vNode.attrArr = keyArr;
	};

	function vSrc (el, value, vNode) {
		el = getIfElem(el, vNode);
		el.src = value;
	};

	function vHref (el, value, vNode) {
		el = getIfElem(el, vNode);
		el.href = value;
	};

	function vData (el, value, vNode) {
		el = getIfElem(el, vNode);
		var 
			keyArr
			, dataArr = vNode.dataArr
			;

		if (dataArr) {
			_.each(dataArr, function styleArrEach (key) {
				el.removeAttribute('data-' + _.capitalLower(key));
			});
		}

		if (!_.isObject(value)) {
			value = convertStyleStrToObj(value);
		}

		keyArr = $keys(value);
		_.each(keyArr, function keyArrEach (key, i) {
			el.dataset[key] =  value[key];
		});
		vNode.dataArr = keyArr;
	};

	function vParent () {

	};

	function vIndex () {

	};


	//自定义属性
	var ATTR = JSpring.attr = {
		// 'for' : 1,
		text : 1,
		html : 1,
		show : 1,
		hide : 1,
		toggle : 1,
		'if' : 1,
		'class' : 1,
		on : 1,
		model : 1,
		style : 1,
		attr : 1,
		src : 1,
		data : 1,
		href : 1,
		index : 1,
		parent : 1
		// component : 1
	};

	//自定义属性优先级
	var PRIO = JSpring.priority = {
		text : 200,
		html : 200,
		show : 200,
		hide : 200,
		toggle : 200,
		'if' : 300,
		'class' : 200,
		on : 100,
		model : 200,
		style : 100,
		attr : 100,
		src : 100,
		data : 100,
		href : 100,
		component : 400,
		index : 500,
		parent : 500
	};

	//自定义属性字符串解析
	var GEN = JSpring.gen = {
		'for' : genFor,
		text : genText,
		html : genHtml,
		show : genShow,
		hide : genHide,
		toggle : genToggle,
		'if' : genIf,
		'class' : genClass,
		on : genOn,
		model : genModel,
		style : genStyle,
		attr : genAttr,
		src : genSrc,
		data : genData,
		href : genHref,
		component : genComponent,
		index : genIndex,
		parent : genParent
	};

	//自定义属性对应处理方法
	var DIRECT = JSpring.direct = {
		text : vText,
		html : vHtml,
		show : vShow,
		hide : vHide,
		toggle : vToggle,
		'if' : vIf,
		'class' : vClass,
		on : vOn,
		model : vModel,
		style : vStyle,
		attr : vAttr,
		src : vSrc,
		data : vData,
		href : vHref,
		parent : vParent,
		index : vIndex
	};

	//module
	JSpring.module = {

	};

	//component
	JSpring.component = {
	
	};

	JSpring.addComponent = function (key, value) {
		value.key = key;
		var lowerKey = _.lower(key);

		if (!JSpring.component[lowerKey]) {
			JSpring.component[lowerKey] = value;
		}
	};

	//vm
	JSpring.vm = {

	};

	//routeCach
	JSpring.routeCach = {

	};

	//commonParam
	var commonParam = _.getChannel();
	commonParam.format = 'json';
	JSpring.commonParam = commonParam;

	function _JSpring (propArr, opts) {
		// console.time('JSpring');
		var _this = this;
		opts = opts || {};

		_this.$ = $;
		_this.pending = false;
		_this.cach = {
			updateKey : [],
			tickQ : [],
			patchQ : [],
			evtObj : {},//TODO event proxy
			docEvtObj : {},//TODO event proxy
			exprObj : $create(null)
		};

		//single page
		if (_.isString(propArr[0])) {
			_.each(propArr, function propEach (prop, i) {
				_this[_this.routeAttrs[i]] = prop;
			});
			_this.route = JSpring.routeCach[_this.uniqId] || $create(null);
			_this.parent = JSpring.container.eq(0);
			_this._single_page = true;
			_this.template = _.replaceEscapeWord(REGEXP.replace(_this.route.template, REGEXP.noteRE, STRING));
		} 

		//nodejs server Or singleton
		else {
			_.each(propArr, function propEach (prop, i) {
				_this[_this.propsAttrs[i]] = prop;
			});

			_this.el = query(_this.selector)[0];
			_this.renderFn = opts.renderFn;
			_this.parent = _this.el.parentNode;
			_this._server_render = _.toBool(window.__INITIAL_STATE__);
			_this.template = REGEXP.replace(_this.el.outerHTML, REGEXP.noteRE, STRING);
		}
		
		_this.data = (_.isFunction(_this.service)
			? optimizeCb(_this.service, _this, [$, JSpring.module])
			: _this.service) || {};
		_this.$scope = optimizeCb(defineProp, _this, _this.data);
		_this.frag = DOC.createDocumentFragment();
		_this.init();
	};

	_JSpring.prototype = {
		isStatic : true,
		constructor : _JSpring,
		routeAttrs : ['uniqId', 'controller', 'service'],
		propsAttrs : ['controller', 'service', 'selector'],

		init : function init () {
			var _this = this;

			if (!_this._server_render) {
				return _this.analyzeHtml().render();
			} 

			else {
				console.time('server render')
				_this.genVNode().serverRender();
			}
		},

		analyzeHtml : function analyzeHtml (html) {
			var 
				_this = this
				, match
				, tagAndSpaceHtml
				, tagHtml
				, spaceOrNote
				, isEndTag
				, isNoEndTag
				, isComponentEndTag
				, tagName
				, parentTag = null
				, lastParentTag = null
				, vObj
				, scope
				;

			while (match = REGEXP.startEndAngleRE.exec(html || _this.template)) {
				tagAndSpaceHtml = match[0];
				spaceOrNote = match[1];
				tagHtml = match[2];
				tagName = _.lower(match[4]);
				isComponentEndTag = REGEXP.compSetRE.test(tagHtml);
				isEndTag = _.toBool(match[3]) || isComponentEndTag;
				isNoEndTag = REGEXP.ghostRE.test(tagName);
				vObj = createVObj(tagName, tagHtml, _this);

				if (REGEXP.test(REGEXP.uniqLeftNoteRE, spaceOrNote)) {
					parentTag && appendVObjChildren(parentTag, createVCommentObj(tagAndSpaceHtml, parentTag));
					continue;
				}

				if (parentTag) {

					if (!REGEXP.test(REGEXP.onlySpaceRE, spaceOrNote)) {
						appendVObjChildren(parentTag, createVTextObj(spaceOrNote, parentTag, _this));
					} 

					if (!isEndTag) {
						appendVObjChildren(parentTag, vObj);
						parentTag = !isNoEndTag ? vObj : parentTag;
					}

					else {
						lastParentTag = parentTag;

						if (!isComponentEndTag) {
							parentTag = parentTag.parentVObj;
						}

						else {
							appendVObjChildren(parentTag, vObj);
						}
					}
				} 

				else {
					parentTag = vObj;

					if (!html) {
						_this.vObj = vObj;
					}
				}
			}
			return html ? parentTag || lastParentTag : _this;
		},

		pushHook : function pushHook (cb) {

			if (_.isFunction(cb)) {
				_.push(this.cach.tickQ, cb);
			}
			return this;
		},

		nextTick : function nextTick () {
			return callHook(this.cach.tickQ, this)
				, this;
		},

		collectGb : function collectGb () {
			var cach = this.cach;
			_.clearArr(cach, ['updateKey', 'tickQ']);
		},

		serverRender : function serverRender () {
			var 
				_this = this
				, collection = _.getChildNodes(_this.el)
				;

			_this.vNode.el = _this.el;
			_this.bindElement(collection, _this.vNode.children);
			_this.clearNoUseAttr();
			return optimizeCb(
				_this.controller
				, _this
				, _this.$scope
				, $
				, JSpring.module
				, _this
				), console.timeEnd('server render');
		},

		bindElement : function bindElement (collection, children) {
			var 
				_this = this
				, firstchild
				;

			if (collection.length != children.length) {
				return LOG.warn(WARN.h5Semantic);
			}

			_.each(children, function (child, index) {
				var collect = collection[index];

				if (!child.isNeedRender) {
					child.el = collect;
					_this.bindElement(_.getChildNodes(child.el) || [], child.children || []);
				} 

				else {
					child.el = genElemFromVNode(child, _this);
					_.replaceNode(child.el, collect);
				}
			});
		},

		render : function render () {
			var 
				_this = this
				;

			if (!_this.isStatic) {

				try {
					_this.vNodeTemplate = _this.analyzeTplStr();
					_this.renderFn = makeGetterFn(_this.vNodeTemplate);

					if (_this.renderFn == noop) {
						return LOG.warnStack(_this.vObj, _this.$scope, _this.template);
					}
					_this.genVNode();
				} catch(err) {
					return LOG.warn('TIP : ' + err.message);
				}
				// console.time('JSpring-createEl')
				_this.initNode();
			} 

			else {
				_this.frag.appendChild(_.clone(_this.el));
			}

			_this.bootstrap();
		},

		renderFromCach : function () {
			return _.append(_.html(this.parent, ''), this.el);
		},

		genVNode : function genVNode () {
			return this.vNode = this.renderFn.call(this, this)
				, this;
		},

		analyzeTplStr : function analyzeTplStr (vObj) {
			vObj = vObj || this.vObj;
			return 'with(this.$scope){ return ' 
				+ (vObj
				? genVNodeExpr(vObj, 0, this)
				: "__j._n('div')") 
				+ ';}';
		},

		initNode : function initNode (vNode) {
			vNode = vNode || this.vNode;
			var 
				_this = this
				, children
				;
			
			createElemAndAppend(vNode, _this, _this.frag);
			children = vNode.children || [];
			children.length && _.each(children, function initNodeChildEach (child) {
				_this.initNode(child);
			});
			return _this;
		},

		diff : function diff (newVNode, prevVNode, parentVNode, opts) {
			opts = opts || {};
			var 
				_this = this
				, patchQ = _this.cach.patchQ
				, prevVNode = prevVNode || _this.vNode
				, prevData = prevVNode.data || $create(null)
				, newData = newVNode.data || $create(null)
				, initCompare = isTheSameStaticVNode(newVNode, prevVNode)
				, childOpts = {
					pStep : 0,
					nStep : 0
				}
				, nUKeys
				, oUKeys
				, nUniq
				, uniq
				;

			if (initCompare.isBothText || initCompare.isBothCmt) {

				if (hasDiffText(prevVNode, newVNode)) {
					setTextContent(prevVNode.el, newVNode.textContent);
					setTextContent(prevVNode, newVNode.textContent);
				}
				return _this;
			} 

			else if (initCompare.isEqStatic) {
				return _childrenDiffProxy();
			} 

			else if (initCompare.isEqStaticTag) {
				nUKeys = newData.uKeys;
				nUniq = newData.uniq;
				oUKeys = prevData.uKeys;
				uniq = prevData.uniq;

				if (_.arrEqual(nUKeys, oUKeys)) {
					nUKeys.length && _.each(nUKeys, function uKeysEach (ukey) {
						var 
							newValue = nUniq[ukey]
							, prevValue = uniq[ukey]
							, isSimpleKey = REGEXP.test(REGEXP.sUniqRE, ukey)
							;

						if (isSimpleKey ? prevValue !== newValue 
							: !_.proxyEqual(prevValue, newValue)) {

							//update
							_.push(patchQ, {
								type : UpdateType.UPDATE,
								attr : ukey,
								vNode : prevVNode
							});
							uniq[ukey] = newValue;
						}
					});
					return _childrenDiffProxy();
				}
			} 

			else if (!initCompare.isEqTag) {

				if (initCompare.isHasTag) {

					if (newVNode.isFor) {

						if (!initCompare.isEqFor) {

							//insert
							_.push(patchQ, {
								type : UpdateType.INSERT,
								parentVNode : parentVNode,
								vNode : [prevVNode, newVNode]
							});
							return opts.pStep -= 1;
						}
					} 

					else if (prevVNode.isFor) {

						//delete
						_.push(patchQ, {
							type : UpdateType.DELETE,
							vNode : prevVNode
						});
						return opts.nStep -= 1;
					}
				} 

				else if (newVNode.tagName) {

					//append
					return _.push(patchQ, {
						type : UpdateType.APPEND,
						parentVNode : parentVNode,
						vNode : newVNode
					});
				} 

				else if (prevVNode.tagName) {

					//delete
					return _.push(patchQ, {
						type : UpdateType.DELETE,
						vNode : prevVNode
					});
				} 

				else {
					return _this;
				}
			}
			
			//replace
			_.push(patchQ, {
				type : UpdateType.REPLACE,
				vNode : [prevVNode, newVNode]
			});

			function _childrenDiffProxy () {
				return childrenDiff(prevVNode.children
					, newVNode.children
					, prevVNode
					, _this
					, childOpts);
			};
			return _this;
		},

		update : function update () {
			var 
				_this = this
				, patchQ = _this.cach.patchQ
				, patch = _.prev(patchQ)
				, vNode
				, parentVNode
				;
			
			while (patch) {
				vNode = patch.vNode;
				parentVNode = patch.parentVNode;

				switch(patch.type) {

					case 1 :// 'INSERT' : 1
						parentVNode.insertBefore(vNode[1], vNode[0]);
						break;

					case 2 :// 'DELETE' : 2
						vNode.remove();
						break;

					case 3 :// 'UPDATE' : 3
						vNode.update(patch.attr);
						break;

					case 4 :// 'REPLACE' : 4
						vNode[0].replace(vNode[1]);
						break;

					case 5 :// 'APPEND' : 5
						parentVNode.append(vNode);
						break;

					default :
						break;
				}
				patch = _.prev(patchQ);
			}
			return _this;
		},

		clearNoUseAttr : function clearNoUseAttr () {
			this.vObj = null;
			this.template = null;
			this.vNodeTemplate = null;
		},

		bootstrap : function bootstrap () {
			var _this = this;
			_this.nextTick();
			
			if (_this._single_page) {
				_.append(_.html(_this.parent, ''), _this.frag);
				_this.el = _.child(_this.parent, 0);
				JSpring.vm[_this.uniqId || (_this.uniqId = _.makeHashCode())] = _this;
			} 

			else {
				_.beforeNode(_this.frag, _this.el);
				_.removeNode(_this.el);
			}
			_this.clearNoUseAttr();
			return optimizeCb(
				_this.controller
				, _this
				, _this.$scope
				, $
				, JSpring.module
				, _this
				)//, console.timeEnd('JSpring');
		}
	};

	_.extend(_JSpring.prototype, {
		_n : createVNode,
		_tn : createVTextNode,
		_cn : createVCommentObj,
		_mp : getMapResult,
		_v : getStrValue,
		_cp : JSpring.component
	});

	function JSpring (propArr, opts) {
		return new _JSpring(_.toArray(propArr), opts);
	};


	/**
	  * router
	  **/

	var lastPathName = '';

	//fn
	JSpring.fn = {
		funcFormat : function funcFormat (obj) {
			var _this = this;
			_.each(obj, function (value, key) {

				if (_.isFunctionStr(value)) {
					obj[key] = new Function('return ' + value + ';')();
				}

				else if (_.isObject(value)) {
					_this.funcFormat(value);
				}
			});
			return obj;
		},

		addMultiComponent : function addMultiComponent (obj) {
			var _this = this;
			_.each(obj, function(comp, key) {
				JSpring.addComponent(key, {
					data: comp.data,
					$scope: _this.funcFormat(comp.$scope),
					template: comp.template
				});
			});
		}
	};

	//浏览历史栈
	JSpring.Stack = [];

	//文件缓存
	JSpring.fileCach = $create(null);

	//是否是返回
	JSpring.backViewPort = false;

	JSpring.router = function router (container, routes, cm) {
		container = $(container);
		var 
			jsFile
			, tplFile
			, stack = []
			, startTime
			, oldhash
			, realRoute = []
			, matchRoute = {}
			, onHashChanging = false
			, touchHasMoved = false
			, hasSwiperBack = false
			, h5Mode = JSpring.router.html5Mode
			, $location = JSpring.module['$location']
			, locationKey = !h5Mode ? 'hash' : 'pathname'
			, reserveREG = /([\/\?]+)/g
			, routeKeys = $keys(routes)
			, $replace = REGEXP.replace
			, hashREG = !h5Mode ? /#\/([^\?]+)\?*[^\?]*/ : new RegExp($location.base + '([\\w\\$]+)')
			, defaultRoute = routes['default']
			, inithash = oldhash = $replace(location[locationKey], hashREG, "$1")
			, deviceIsIOS = REGEXP.test(/iP(ad|hone|od)/, UA)
			;

		_.each(routeKeys, function routeKeysEach(r) {

			if (REGEXP.test(REGEXP.colonREG, r)) {
				matchRoute[r] = [];
				matchRoute[r][1] = [];
				matchRoute[r][0] = new RegExp($replace($replace(r, REGEXP.routeParamREG, function(match, $1) {
					_.push(matchRoute[r][1], $1);
					return '(\\w+)';
				}), reserveREG, '\\$1'));
			} 

			else {
				_.push(realRoute, r);
			}
		});

		JSpring.hashLoad = hashLoad;
		JSpring.titleTag = $('title');

		var isSwiperBack = JSpring.swiperBack ? function (x1, x2, y1, y2) {
			return Math.abs(x1 - x2) >= Math.abs(y1 - y2) 
				&& x2 - x1 > 100;
		} : function () {
			return false;
		};

		if (container.exist) {
			var 
				pageX
				, pageY
				, pageX2
				, pageY2
				, boundary = 10
				;

			//Simple FastClick
			container.on('touchstart', function (e) {
				var touch = e.changedTouches[0];
				pageX = touch.pageX;
				pageY = touch.pageY;
				pageX2 = 0;
				pageY2 = 0;
				touchHasMoved = false;
				startTime = e.timeStamp;
			}).on('touchmove', function (e) {
				var touch = e.changedTouches[0];
				pageX2 = touch.pageX;
				pageY2 = touch.pageY;

				if (Math.abs(pageX2 - pageX) > boundary || Math.abs(pageY2 - pageY) > boundary) {
					touchHasMoved = true;

					if (
						JSpring.swiperBack 
							&& _.isApp 
							&& !hasSwiperBack 
							&& e.timeStamp - startTime > 300 
							&& isSwiperBack(pageX, pageX2, pageY, pageY2)
					) {
						$location && $location.back();
						hasSwiperBack = true;
						setTimeout(function() {
							hasSwiperBack = false;
						});
					}
				}
			}).on('touchend', function (e) {
				var 
					touch = e.changedTouches[0]
					, targetElement = DOC.elementFromPoint(touch.clientX, touch.clientY)
					, clickEvent
					;

				if (
					!touchHasMoved 
						&& targetElement 
						&& isNeedsClick(targetElement) 
						&& e.timeStamp - startTime < 200
				) {
					e.preventDefault();
					e.stopImmediatePropagation();
					e.stopPropagation();
					clickEvent = DOC.createEvent('MouseEvents');
					clickEvent.initMouseEvent('click'
						, true
						, true
						, window
						, 1
						, touch.screenX
						, touch.screenY
						, touch.clientX
						, touch.clientY
						, false
						, false
						, false
						, false
						, 0
						, null);
					targetElement.dispatchEvent(clickEvent);
				}
			});
			JSpring.container = container;
		} 

		else {
			LOG.warn(WARN.container);
		}

		//if is the initial load or refresh, set 'inithash' to 'defaultRoute'
		inithash = defaultRoute;
		hashLoad(oldhash, {
			noStack: true
		});

		$(window).on('pageshow', function _pageshow (e) {

			var hash = $replace(location[locationKey], hashREG, "$1");

			//if is cached page
			if (e.persisted) {

				//'matchRoute' and 'realRoute', 'realRoute' is supported firstly
				JSpring.backViewEvent[hash] && JSpring.backViewEvent[hash](e);
			}
		});

		$(window).on('pagehide', function _pagehide (e) {

			//leave the page, set 'inithash' to ''(for diff project redirect)
			inithash = '';
		});

		$(window).on('hashchange', function _hashchange (e) {
			hashLoadProxy();
		});

		$(window).on('popstate', function _popstate (e) {
			hashLoadProxy();
		});

		function hashLoadProxy() {

			if (onHashChanging) {
				return false;
			}

			if (lastPathName == location.href) {
				return false;
			}

			lastPathName = location.href;

			//if redirect from other project, not reload page
			if (inithash != defaultRoute) {
				return inithash = defaultRoute;
			}

			var 
				pathname = location[locationKey]
				, _hash = JSpring.Stack.pop()
				, realHash = $replace(pathname, hashREG, "$1")
				;

			while (_hash && pathname.indexOf(_hash) < 0) {
				_hash = JSpring.Stack.pop();
			}

			JSpring.backViewPort = true;
			hashLoad(_hash || realHash, {
				noStack: true
			});
		};

		function hashLoad (hash, opts) {

			if (onHashChanging) {
				return false;
			}

			opts = opts || {};
			onHashChanging = true;
			lastPathName = location.href;
			var 
				route
				, toDefault = false
				;

			if (_.inArray(realRoute, hash)) {
				route = routes[hash];
				oldhash = hash;

			} 

			else if (route = isMatchRoute(hash)) {
				route = routes[route];
				oldhash = hash;

			} 

			else {
				toDefault = true;
				oldhash = defaultRoute;
				route = routes[defaultRoute || routeKeys[0]];
			}

			opts.noStack && stack.pop();

			if (stack.length) {
				_.uniqPush(JSpring.Stack, stack.pop());
			}

			setTitle(route.title, hash);
			tplFile = JSpring.fileCach[route.templateUrl];

			if (route.controllerFn) {

				if (!tplFile) {
					_.getText(route.templateUrl).then(function(tplFile) {
						JSpring.fileCach[route.templateUrl] = tplFile;
						instanceInit(tplFile, true);
					});
				} 

				else {
					instanceInit(tplFile, true);
				}
			}

			function instanceInit (tpl, webpackFlag) {
				var 
					viewport
					, loc
					, routeInfo = {
						hash: hash,
						uniqId: route.uniqId,
						template: tpl,
						readyTransition: route.readyTransition || '',
						transition: route.transition || 'fadeIn',
						transitionLeave: route.transitionLeave || '',
						cach: route.cach || false,
					};

				if (route.readyTransition) {
					_.each(routeKeys, function routeKeysEach (rt) {
						routes[rt].readyTransition = null;
					});
				}

				//if the path beyond the config
				if (toDefault) {
					JSpring.routeCach[oldhash || routeKeys[0]] = routeInfo;
					history.replaceState(null, route.title || '', (!h5Mode ? location.pathname + '#/' : '') + oldhash);
					!opts.noStack && _.push(stack, oldhash);
				} 

				else {
					JSpring.routeCach[routeInfo.uniqId] = routeInfo;
					_.push(stack, hash);
				}

				if (routeInfo.cach && JSpring.backViewPort) {

					if (viewport = JSpring.vm[routeInfo.uniqId]) {
						return viewport.renderFromCach(), onHashChanging = false;
					}
				}

				if (!opts.noSearch && (loc = JSpring.module['$location'])) {
					var indexQ = _.indexOf(location.hash, '?');
					loc.$search = _.getSearchObj(location.search || (indexQ > -1 ? location.hash.slice(indexQ) : ''));
				}

				if (webpackFlag) {
					return route.controllerFn(function(res) {

						if (_.isFunction(res)) {
							res(cm || {});
						} 

						else if (_.isObject(res)) {
							var key = $keys(res)[0];
							new res[key](route.uniqId);
						}

						return onHashChanging = false;
					});
				}
			};
		};

		function setTitle(title, hash) {
			var el;

			if (_.isNull(title)) {
				return false;
			}

			if (!JSpring.titleTag.exist) {
				el = $createEl('title');
				_.beforeNode(el, HEAD.firstChild);
				JSpring.titleTag = $(el);
			}

			return JSpring.titleTag.html(_.isFunction(title) 
				? title(hash) 
				: title || '');
		};

		function isMatchRoute(route) {
			var 
				result
				, routeParam
				;

			return _.each($keys(matchRoute), function matchRouteEach (k) {
				var 
					expr = matchRoute[k][0]
					, rootKey = matchRoute[k][1]
					, matchArr
					;

				if (matchArr = REGEXP.exec(expr, route)) {
					matchArr = $slice.call(matchArr, 1);
					routeParam = JSpring.module.$routeParam = {};
					_.each(rootKey, function rootKeyEach(m) {
						routeParam[m] = $shift.call(matchArr);
					});
					return result = k;
				}
			}) || false;
		};

		function isNeedsClick(el) {

			if (!el.tagName) {
				return false;
			}

			switch (_.lower(el.tagName)) {
				case 'button':
				case 'select':
				case 'textarea':
					return el.disabled;
					break;

				case 'input':
				
					if ((deviceIsIOS && el.type === 'file') || el.disabled) {
						return true;
					} 

					else {
						return false;
					}
					break;

				case 'label':
				case 'video':
					return true;

				default:
					return true;
			}
		};
	};

	//默认路由跳转走hash
	JSpring.router.html5Mode = false;

	JSpring.router.enableHtml5Mode = function () {
		JSpring.router.html5Mode = true;
	};


	/**
	  * $location
	  **/
	function getUrl (pathname, search) {

		if (!JSpring.router.html5Mode) {
			return location.pathname + search + '#/' + pathname;
		}
		return pathname + search;
	};

	var 
		$location = $create(null)
		, lastPathName
		;
		
	_.extend($location, location);

	_.extend($location, {
		go : function go (pathname, search) {
			search = search || location.search;

			if (lastPathName != pathname) {
				lastPathName = pathname;
				setTimeout(function() {
					lastPathName = null;
				}, 300);
			} 

			else {
				return;
			}

			this.$search = _.getSearchObj(search);
			history.pushState(null, '', getUrl(pathname, search));
			return JSpring.hashLoad(pathname, {
				noSearch: true
			});
		},

		assign : function assign () {
			return this.go.apply(this, arguments);
		},

		replace : function replace (pathname, search) {
			search = search || location.search;
			this.$search = _.getSearchObj(search);
			history.replaceState(null, '', getUrl(pathname, search));
			return JSpring.hashLoad(pathname, {
				noSearch: true
			});
		},

		back : function back (step) {
			JSpring.backViewPort = true;
			return history.go(_.isUndefined(step) ? -1 : step);
		}
	});

	var base = $('base');

	if (base.exist) {
		$location.base = /\.\//.test(base = base.attr('href')) 
			? base.replace(/\.([^\.]+)/, '$1') 
			: base[base.length - 1] == '/' ? base : (base + '/');
	}

	JSpring.module['$location'] = $location;
	window.JSpring = JSpring;
	window.JSpringClass = function () {
		return this.render.call(this, arguments);
	};

	window.$ = $;

	JSpringClass.prototype = {
		render : function (args) {
			return JSpring(args);
		}
	};

	return JSpring;
}));