webpackJsonp([2],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	  * common method
	  **/

	var NODE_ENV = 'production';
	var HOST = 'mock/';
	if (window.location.host == "m.lvmama.com") {
	    NODE_ENV = 'production';
	    HOST = 'http://m.lvmama.com';
	}

	var cm = exports.cm = {
	    URL: NODE_ENV == 'production' ? {
	        cmtCommentList: 'http://m.lvmama.com/api/router/rest.do?method=api.com.cmt.getCmtCommentList&version=1.0.0&isELong=N&placeIdType=PLACE&firstChannel=TOUCH&secondChannel=LVMM',
	        latitudeScores: 'http://m.lvmama.com/api/router/rest.do?method=api.com.cmt.getLatitudeScores&version=1.0.0&category=VISA&firstChannel=TOUCH&secondChannel=LVMM',
	        visaDetails: 'http://m.lvmama.com/api/router/rest.do?Ah5version=0.10192173861870768&h5Flag=Y&method=api.com.visa.product.getVisaDetails&version=1.0.0&firstChannel=TOUCH&secondChannel=LVMM',
	        search: 'http://m.lvmama.com/api/router/rest.do?method=api.com.visa.product.search&firstChannel=TOUCH&secondChannel=LVMM&version=1.0.0',
	        getInfo: 'http://m.lvmama.com/bullet/index.php?s=/Api/getInfos&channelCode=QZ&firstChannel=TOUCH&format=json&lvsessionid=2d088a83-b6a3-474d-aeff-5637c87f65b8&secondChannel=LVMM&stationCode=SH&tagCodes=QZ_BANNER,QZ_SJ,QZ_GJ,QZ_TJ,QZ_WD,QZ_RM,HDTJ_SMALL,HDTJ_BIG&udid=adc5b78a-6dfe-4833-ac41-28e3f664e68e-uuid',
	        test: HOST + '/api/router/rest.do?method=api.com.biz.synTime&version=1.0.0&IS_DEBUG=1'
	    } : {
	        cmtCommentList: '',
	        latitudeScores: '',
	        visaDetails: '',
	        search: '',
	        getInfo: '',
	        test: ''
	    },
	    //设置根域名cookie
	    setRootCookie: function setRootCookie(name, value, domain, path) {
	        var _domain = domain;
	        var _path = path;
	        if (_domain) {
	            _domain = ";domain=" + _domain;
	        } else {
	            _domain = "";
	        }
	        if (_path) {
	            _path = ";path=" + _path;
	        } else {
	            _path = "";
	        }
	        var Days = 30; //此 cookie 将被保存 30 天
	        var exp = new Date(); //new Date("December 31, 9998");
	        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	        document.cookie = name + "=" + escape(value) + _domain + _path + ";expires=" + exp.toGMTString();
	    },

	    //获取指定名称的cookie的值
	    getCookie: function getCookie(objName) {
	        var arrStr = document.cookie.split(";");
	        for (var i = 0; i < arrStr.length; i++) {
	            var temp = arrStr[i].split("=");
	            if (temp[0].trim() == objName) return decodeURIComponent(temp[1]);
	        }
	    },

	    //设置cookie
	    setCookie: function setCookie(name, value) {
	        var Days = 30; //此 cookie 将被保存 30 天
	        var exp = new Date(); //new Date("December 31, 9998");
	        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	    }
	};

/***/ },
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 18 */,
/* 19 */,
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./visaList/visaList.js": 22
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 21;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.VisaList = undefined;

	var _cm = __webpack_require__(8);

	var _controllerVisaList = __webpack_require__(23);

	var _controllerVisaList2 = _interopRequireDefault(_controllerVisaList);

	var _serviceVisaList = __webpack_require__(24);

	var _serviceVisaList2 = _interopRequireDefault(_serviceVisaList);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var VisaList = exports.VisaList = function (_JSpringComponent) {
	  _inherits(VisaList, _JSpringComponent);

	  function VisaList(uniqId) {
	    _classCallCheck(this, VisaList);

	    return _possibleConstructorReturn(this, (VisaList.__proto__ || Object.getPrototypeOf(VisaList)).call(this, uniqId, _controllerVisaList2.default, _serviceVisaList2.default));
	  }

	  return VisaList;
	}(JSpringComponent);

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function ($scope, $, module, _this) {
		$scope.getSearch().then(function (res) {
			$scope.visaList = res.data.products;
			_this.pushHook(function () {
				$('.visaList-body').addClass('fadeIn');
			});
		}).catch(function (err) {});
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _cm = __webpack_require__(8);

	exports.default = function ($, module) {
		var location = module.$location;
		return {
			city: localStorage.getItem('visa-country'),
			visaList: [],
			pageIndex: 1,
			paixu: true,
			quanbu: true,
			changzhu: true,
			filterStyleFn: function filterStyleFn(flag) {
				return flag ? {} : {
					color: '#d30775'
				};
			},
			getSearch: function getSearch() {
				var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

				return $.get(_cm.cm.URL.search, {
					pageSize: 20,
					pageIndex: index,
					provinceName: '上海',
					countryName: this.city
				});
			},
			goBack: function goBack() {
				location.back();
			},
			toggleIcon: function toggleIcon(key) {
				this[key] = !this[key];
			},
			goVisaDetail: function goVisaDetail(productId, goodsId) {
				localStorage.setItem('visa-goodsId', goodsId);
				localStorage.setItem('visa-productId', productId);
				location.go('visaDetail/' + goodsId);
			}
		};
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./visaList/visaList.css": 26
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 25;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(27);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(20)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./visaList.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./visaList.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(17)();
	// imports


	// module
	exports.push([module.id, "body * {\r\n    box-sizing: border-box;\r\n    font-family: Microsoft yahei,Lucida Grande,Helvetica Neue,Helvetica,Arial,Hiragino Sans GB,Hiragino Sans GB W3,WenQuanYi Micro Hei,sans-serif;\r\n    -webkit-text-size-adjust: 100%;\r\n    text-size-adjust: 100%;\r\n}\r\nh1,h2,h3 {\r\n\tfont-weight: normal;\r\n\tmargin: 0;\r\n}\r\nli {\r\n\tlist-style: none;\r\n}\r\ni {\r\n\tfont-style: normal;\r\n}\r\nbody, input {\r\n    color: #000;\r\n    margin: 0;\r\n    font-size: 14px;\r\n}\r\np {\r\n\tmargin: 0;\r\n}\r\nul {\r\n\tpadding-left: 0;\r\n}\r\nbody img {\r\n    -webkit-transition:.5s;\r\n    transition:.5s;\r\n}\r\ninput {\r\n    -webkit-appearance: none;\r\n    outline: none;\r\n}\r\ninput {\r\n    border: none;\r\n    width: 60%;\r\n    height: 25px;\r\n}\r\na, button, div, input, li, optgroup, select, span, textarea, ul {\r\n    -webkit-tap-highlight-color: rgba(0,0,0,0);\r\n    tap-highlight-color: transparent;\r\n}\r\n.f12{font-size: 12px;}\r\n.fr {float: right;}\r\n.pink{color:#d30775;}\r\nheader .title {\r\n    line-height: 44px;\r\n    text-align: center;\r\n    font-size: 19px;\r\n    margin: 0;\r\n}\r\nheader {\r\n    height: 44px;\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    background: #fafafa;\r\n    z-index: 80;\r\n    width: 100%;\r\n    border-bottom: 1px solid #eee;\r\n}\r\n.visaList {\r\n    overflow-x: hidden;\r\n    margin-top: 45px;\r\n}\r\n.visa-list {\r\n\toverflow: hidden;\r\n\tborder-bottom: 1px solid #ddd;\r\n\tpadding: 10px 10px 23px 15px;\r\n\tbackground-color: #fff;\r\n\tmargin-bottom: 10px;\r\n\tposition: relative;\r\n\theight: auto;\r\n\tbox-sizing: border-box;\r\n}\r\n.visa-list p img{\r\n\theight: 13px;\r\n\twidth: 13px;\r\n}\r\n.bottom {\r\n\tposition: fixed;\r\n\tbottom: 0;\r\n\tleft: 0;\r\n\theight: 48px;\r\n\twidth: 100%;\r\n\tbackground-color: rgba(50,50,50,.95);\r\n\toverflow: hidden;\r\n}\r\n.visaList-body {\r\n\tmargin-bottom: 48px;\r\n    \topacity: 0;\r\n}\r\n.bottom > span {\r\n\twidth: 33%;\r\n\theight: 48px;\r\n\tfloat: left;\r\n\ttext-align: center;\r\n\tposition: relative;\r\n\tcolor:white;\r\n}\r\n.bottom > span > img{\r\n\twidth: 18px;\r\n\theight: 14px;\r\n\tdisplay: block;\r\n    \tmargin: 10px auto 0 auto;\r\n}\r\n.visa-list .visa-price i{\r\n\tcolor: #d30775;\r\n}\r\n.visa-list .visa-price > i:nth-child(2) {\r\n\tfont-size: 21px;\r\n}\r\n.visa-grey {\r\n\tcolor:#aaa;\r\n}\r\n.back-btn {\r\n\tposition: absolute;\r\n\tleft: 10px;\r\n\ttop: 15px;\r\n\theight: 15px;\r\n\twidth: 15px;\r\n\tborder-left: 1px solid #d30775;\r\n\tborder-top: 1px solid #d30775;\r\n\t-webkit-transform:rotate(-45deg);\r\n\ttransform:rotate(-45deg);\r\n}\r\n", ""]);

	// exports


/***/ }
]);