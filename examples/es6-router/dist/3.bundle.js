webpackJsonp([3],{

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

/***/ 38:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./visaDetail/visaDetail.js": 39
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
	webpackContext.id = 38;


/***/ },

/***/ 39:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.VisaDetail = undefined;

	var _cm = __webpack_require__(12);

	var _controllerVisaDetail = __webpack_require__(40);

	var _controllerVisaDetail2 = _interopRequireDefault(_controllerVisaDetail);

	var _serviceVisaDetail = __webpack_require__(41);

	var _serviceVisaDetail2 = _interopRequireDefault(_serviceVisaDetail);

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

	var VisaDetail = exports.VisaDetail = function (_JSpringComponent) {
	  _inherits(VisaDetail, _JSpringComponent);

	  function VisaDetail(uniqId) {
	    _classCallCheck(this, VisaDetail);

	    return _possibleConstructorReturn(this, (VisaDetail.__proto__ || Object.getPrototypeOf(VisaDetail)).call(this, uniqId, _controllerVisaDetail2.default, _serviceVisaDetail2.default));
	  }

	  return VisaDetail;
	}(JSpringComponent);

/***/ },

/***/ 40:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function ($scope, $, module, _this) {
		$scope.getVisaDetail().then(function (res) {
			var data = res.data;
			$.extend($scope.detail, {
				imgUrl: data.imageUrl,
				price: data.price,
				productName: data.productName,
				map: data.map
			});
			$scope.loadedFlag = true;
		}).catch(function (err) {});
	};

/***/ },

/***/ 41:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _cm = __webpack_require__(12);

	exports.default = function ($, module) {
		var location = module.$location,
		    URL = _cm.cm.URL;
		return {
			detail: {
				imgUrl: '',
				price: '',
				productName: '',
				map: {}
			},
			visaDetailFlag: true,
			needInfoFlag: false,
			reserveFlag: false,
			commentFlag: false,
			loadedFlag: false,
			currentPage: 1,
			pageSize: 10,
			goodsId: localStorage.getItem('visa-goodsId'),
			productId: localStorage.getItem('visa-productId'),
			goBack: function goBack() {
				location.back();
			},
			toBr: function toBr(str) {
				return str.replace(/[2-9]+[、\.]/g, "<br />$&");
			},
			toggleTab: function toggleTab(flag) {
				this.visaDetailFlag = false;
				this.needInfoFlag = false;
				this.reserveFlag = false;
				this.commentFlag = false;
				this[flag] = true;
			},
			getVisaDetail: function getVisaDetail() {
				return $.get(URL.visaDetails, {
					goodsId: this.goodsId
				});
			},
			getLatitudeScores: function getLatitudeScores() {
				return $.get(URL.latitudeScores, {
					productId: this.productId
				});
			},
			getCmtCommentList: function getCmtCommentList() {
				return $.get(URL.cmtCommentList, {
					productId: this.productId,
					currentPage: this.currentPage,
					pageSize: this.pageSize
				});
			}
		};
	};

/***/ },

/***/ 42:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./visaDetail/visaDetail.css": 43
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
	webpackContext.id = 42;


/***/ },

/***/ 43:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(44);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./visaDetail.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./visaDetail.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 44:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "body * {\r\n    box-sizing: border-box;\r\n    font-family: Microsoft yahei,Lucida Grande,Helvetica Neue,Helvetica,Arial,Hiragino Sans GB,Hiragino Sans GB W3,WenQuanYi Micro Hei,sans-serif;\r\n    -webkit-text-size-adjust: 100%;\r\n    text-size-adjust: 100%;\r\n}\r\nhtml {\r\n\theight: 100%;\r\n\tbackground-color: #f8f8f8;\r\n}\r\nh1,h2,h3 {\r\n\tfont-weight: normal;\r\n\tmargin: 0;\r\n}\r\nli {\r\n\tlist-style: none;\r\n}\r\ni {\r\n\tfont-style: normal;\r\n}\r\n.f10 {font-size: 10px;}\r\n.f12 {font-size: 12px;}\r\n.f19 {font-size: 19px;}\r\nbody, input {\r\n    color: #000;\r\n    margin: 0;\r\n    font-size: 14px;\r\n}\r\np {\r\n\tmargin: 0;\r\n}\r\nul {\r\n\tpadding-left: 0;\r\n}\r\nbody img {\r\n    -webkit-transition:.5s;\r\n    transition:.5s;\r\n}\r\ninput {\r\n    -webkit-appearance: none;\r\n    outline: none;\r\n}\r\ninput {\r\n    border: none;\r\n    width: 60%;\r\n    height: 25px;\r\n}\r\na, button, div, input, li, optgroup, select, span, textarea, ul {\r\n    -webkit-tap-highlight-color: rgba(0,0,0,0);\r\n    tap-highlight-color: transparent;\r\n}\r\n.f12{font-size: 12px;}\r\n.fr {float: right;}\r\n.pink{color:#d30775;}\r\n.white{background-color:#fff;}\r\n.lh19 {line-height: 19px;}\r\nheader .title {\r\n    line-height: 44px;\r\n    text-align: center;\r\n    font-size: 19px;\r\n    margin: 0;\r\n}\r\nheader {\r\n    height: 44px;\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    background: #fafafa;\r\n    z-index: 80;\r\n    width: 100%;\r\n    border-bottom: 1px solid #eee;\r\n}\r\n.visa-detail {\r\n    overflow-x: hidden;\r\n    margin-top: 45px;\r\n    opacity: 0;\r\n}\r\n.visaDetail .bottom {\r\n\tposition: fixed;\r\n\tbottom: 0;\r\n\tleft: 0;\r\n\theight: 48px;\r\n\twidth: 100%;\r\n\tbackground-color: #d30775;\r\n\toverflow: hidden;\r\n}\r\n.visaDetail-body {\r\n\tmargin-top: 48px;\r\n\tmargin-bottom: 48px;\r\n\twidth: 100%;\r\n\topacity: 0;\r\n}\r\n.visaDetail-body-head {\r\n\twidth: 100%;\r\n\theight: 100px;\r\n\tpadding: 10px;\r\n\tborder-bottom:1px solid #ddd;\r\n}\r\n.visaDetail-body-head-left {\r\n\twidth: 100px;\r\n\tdisplay: inline-block;\r\n}\r\n.visaDetail-body-head-left img {\r\n\theight: 100%;\r\n\twidth: 100%;\r\n\tdisplay: block;\r\n}\r\n.visaDetail-body-head-right {\r\n\tdisplay: inline-block;\r\n\tposition: absolute;\r\n\tpadding: 0 10px;\r\n}\r\n\r\n.visaDetail-body-body {\r\n\tmargin-top: 10px;\r\n}\r\n.visaDetail-body-body-tab {\r\n\r\n}\r\n.visaDetail-body-body-tab nav {\r\n\twidth: 100%;\r\n\theight: 46px;\r\n\tline-height: 44px;\r\n\tborder-bottom: 1px solid #ddd;\r\n\tborder-top: 1px solid #ddd;\r\n}\r\n.visaDetail-body-body-tab nav li {\r\n\twidth: 25%;\r\n\tfloat: left;\r\n\ttext-align: center;\r\n\tcolor: #666;\r\n}\r\n.visaDetail-body-body-tabInfo {\r\n\tmargin-top: 1px;\r\n}\r\n.visaDetail .bottom > span {\r\n\twidth: 33%;\r\n\theight: 48px;\r\n\tfloat: left;\r\n\ttext-align: center;\r\n\tposition: relative;\r\n\tcolor:white;\r\n}\r\n.visaDetail .bottom > span > img{\r\n\twidth: 18px;\r\n\theight: 14px;\r\n\tdisplay: block;\r\n    \tmargin: 10px auto 0 auto;\r\n}\r\n.visa-grey {\r\n\tcolor:#aaa;\r\n}\r\n.visa-grey2 {\r\n\tcolor:#666;\r\n}\r\n.back-btn {\r\n\tposition: absolute;\r\n\tleft: 10px;\r\n\ttop: 15px;\r\n\theight: 15px;\r\n\twidth: 15px;\r\n\tborder-left: 1px solid #d30775;\r\n\tborder-top: 1px solid #d30775;\r\n\t-webkit-transform:rotate(-45deg);\r\n\ttransform:rotate(-45deg);\r\n}\r\n.hightlight {\r\n\tcolor: #d30775!important;\r\n\tborder-bottom: 2px solid #d30775;\r\n}\r\n.visaDetail-ct section {\r\n\tborder-bottom: 1px solid #ddd;\r\n\tpadding: 10px;\r\n}\r\n.visaDetail-ct section:nth-child(1) i {\r\n\tcolor: #666;\r\n}\r\n.accept-area {\r\n\tfont-size: 14px;\r\n\tpadding: 2px;\r\n}\r\n.visa-prompt {\r\n\tpadding: 0 10px;\r\n\tbackground-color: #f8f8f8;\r\n}\r\n.visa-prompt-info {\r\n\tborder-top: 1px solid #ddd;\r\n\tborder-bottom: 1px solid #ddd;\r\n}\r\n.visaDetail .bottom  span {\r\n\tdisplay:inline-block;\r\n\ttext-align: center;\r\n}\r\n.visaDetail .bottom .book-intime {\r\n\tcolor: #fff;\r\n\tline-height: 48px;\r\n\twidth: 60%;\r\n}\r\n.visaDetail .bottom .favor {\r\n\twidth: 20%;\r\n\tbackground-color:#fff;\r\n\tcolor: #666;\r\n}\r\n.visaDetail .bottom .favor-collect {\r\n}\r\n.visaDetail .bottom .favor-collect:after {\r\n\tcontent: '';\r\n\tposition: absolute;\r\n\tright: 0;\r\n\ttop: 9px;\r\n\theight: 30px;\r\n\tborder-left: 1px solid #ddd;\r\n}\r\n.needInfo-ct {\r\n\tpadding: 0 10px;\r\n}\r\n.needInfo-ct > p{\r\n\tposition: relative;\r\n\theight: 45px;\r\n\tline-height: 45px;\r\n\tmargin: auto;\r\n\tborder-bottom: 1px solid #ddd;\r\n\tcolor: #666;\r\n\twidth: 100%;\r\n}\r\n.needInfo-ct > p:after {\r\n\tcontent: '';\r\n\tposition: absolute;\r\n\tright: 15px;\r\n\ttop: 15px;\r\n\theight: 15px;\r\n\twidth: 15px;\r\n\tborder-right: 1px solid #ddd;\r\n\tborder-top: 1px solid #ddd;\r\n\t-webkit-transform:rotate(45deg);\r\n\ttransform:rotate(45deg);\r\n}\r\n.reserve-ct {\r\n\tpadding: 10px;\r\n}", ""]);

	// exports


/***/ }

});