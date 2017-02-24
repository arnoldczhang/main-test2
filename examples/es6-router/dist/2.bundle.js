webpackJsonp([2],{

/***/ 12:
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
	        test: HOST + '/api/router/rest.do?method=api.com.biz.synTime&version=1.0.0&IS_DEBUG=12222222222222'
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

/***/ 31:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./visaList/visaList.js": 32
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
	webpackContext.id = 31;


/***/ },

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.VisaList = undefined;

	var _cm = __webpack_require__(12);

	var _controllerVisaList = __webpack_require__(33);

	var _controllerVisaList2 = _interopRequireDefault(_controllerVisaList);

	var _serviceVisaList = __webpack_require__(34);

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

/***/ 33:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function ($scope, $, module, _this) {
		$scope.getSearch().then(function (res) {
			$scope.visaList = res.data.products;
			$scope.loadedFlag = true;
		}).catch(function (err) {});
	};

/***/ },

/***/ 34:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _cm = __webpack_require__(12);

	exports.default = function ($, module) {
		var location = module.$location;
		return {
			city: localStorage.getItem('visa-country'),
			visaList: [],
			pageIndex: 1,
			paixu: true,
			quanbu: true,
			changzhu: true,
			loadedFlag: false,
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

/***/ 35:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./visaList/visaList.css": 36
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
	webpackContext.id = 35;


/***/ },

/***/ 36:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(37);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
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

/***/ 37:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "body * {\r\n    box-sizing: border-box;\r\n    font-family: Microsoft yahei,Lucida Grande,Helvetica Neue,Helvetica,Arial,Hiragino Sans GB,Hiragino Sans GB W3,WenQuanYi Micro Hei,sans-serif;\r\n    -webkit-text-size-adjust: 100%;\r\n    text-size-adjust: 100%;\r\n}\r\nh1,h2,h3 {\r\n\tfont-weight: normal;\r\n\tmargin: 0;\r\n}\r\nli {\r\n\tlist-style: none;\r\n}\r\ni {\r\n\tfont-style: normal;\r\n}\r\nbody, input {\r\n    color: #000;\r\n    margin: 0;\r\n    font-size: 14px;\r\n}\r\np {\r\n\tmargin: 0;\r\n}\r\nul {\r\n\tpadding-left: 0;\r\n}\r\nbody img {\r\n    -webkit-transition:.5s;\r\n    transition:.5s;\r\n}\r\ninput {\r\n    -webkit-appearance: none;\r\n    outline: none;\r\n}\r\ninput {\r\n    border: none;\r\n    width: 60%;\r\n    height: 25px;\r\n}\r\na, button, div, input, li, optgroup, select, span, textarea, ul {\r\n    -webkit-tap-highlight-color: rgba(0,0,0,0);\r\n    tap-highlight-color: transparent;\r\n}\r\n.f12{font-size: 12px;}\r\n.fr {float: right;}\r\n.pink{color:#d30775;}\r\nheader .title {\r\n    line-height: 44px;\r\n    text-align: center;\r\n    font-size: 19px;\r\n    margin: 0;\r\n}\r\nheader {\r\n    height: 44px;\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    background: #fafafa;\r\n    z-index: 80;\r\n    width: 100%;\r\n    border-bottom: 1px solid #eee;\r\n}\r\n.visaList {\r\n    overflow-x: hidden;\r\n    margin-top: 45px;\r\n}\r\n.visa-list {\r\n\toverflow: hidden;\r\n\tborder-bottom: 1px solid #ddd;\r\n\tpadding: 10px 10px 23px 15px;\r\n\tbackground-color: #fff;\r\n\tmargin-bottom: 10px;\r\n\tposition: relative;\r\n\theight: auto;\r\n\tbox-sizing: border-box;\r\n}\r\n.visa-list p img{\r\n\theight: 13px;\r\n\twidth: 13px;\r\n}\r\n.bottom {\r\n\tposition: fixed;\r\n\tbottom: 0;\r\n\tleft: 0;\r\n\theight: 48px;\r\n\twidth: 100%;\r\n\tbackground-color: rgba(50,50,50,.95);\r\n\toverflow: hidden;\r\n}\r\n.visaList-body {\r\n\tmargin-bottom: 48px;\r\n    \topacity: 0;\r\n}\r\n.bottom > span {\r\n\twidth: 33%;\r\n\theight: 48px;\r\n\tfloat: left;\r\n\ttext-align: center;\r\n\tposition: relative;\r\n\tcolor:white;\r\n}\r\n.bottom > span > img{\r\n\twidth: 18px;\r\n\theight: 14px;\r\n\tdisplay: block;\r\n    \tmargin: 10px auto 0 auto;\r\n}\r\n.visa-list .visa-price i{\r\n\tcolor: #d30775;\r\n}\r\n.visa-list .visa-price > i:nth-child(2) {\r\n\tfont-size: 21px;\r\n}\r\n.visa-grey {\r\n\tcolor:#aaa;\r\n}\r\n.back-btn {\r\n\tposition: absolute;\r\n\tleft: 10px;\r\n\ttop: 15px;\r\n\theight: 15px;\r\n\twidth: 15px;\r\n\tborder-left: 1px solid #d30775;\r\n\tborder-top: 1px solid #d30775;\r\n\t-webkit-transform:rotate(-45deg);\r\n\ttransform:rotate(-45deg);\r\n}\r\n", ""]);

	// exports


/***/ }

});