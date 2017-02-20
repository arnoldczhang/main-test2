webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./mainPage/mainPage.js": 9
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
	webpackContext.id = 8;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.MainPage = undefined;

	var _controllerMainPage = __webpack_require__(10);

	var _controllerMainPage2 = _interopRequireDefault(_controllerMainPage);

	var _serviceMainPage = __webpack_require__(11);

	var _serviceMainPage2 = _interopRequireDefault(_serviceMainPage);

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

	var searchInputTemplate = __webpack_require__(13);
	var specialTemplate = __webpack_require__(14);
	var swiperTemplate = __webpack_require__(15);
	var hotTemplate = __webpack_require__(16);
	var hotItemTemplate = __webpack_require__(17);

	JSpring.addComponent('SearchInput', {
	  data: 'word',
	  template: searchInputTemplate,
	  style: __webpack_require__(18)
	});

	JSpring.addComponent('Swiper', {
	  data: 'list',
	  template: swiperTemplate,
	  style: __webpack_require__(21)
	});

	JSpring.addComponent('Hot', {
	  data: 'list',
	  template: hotTemplate,
	  style: __webpack_require__(23)
	});

	JSpring.addComponent('HotItem', {
	  data: 'obj',
	  template: hotItemTemplate
	});

	JSpring.addComponent('Special', {
	  data: 'list',
	  template: specialTemplate,
	  style: __webpack_require__(25)
	});

	var MainPage = exports.MainPage = function (_JSpringComponent) {
	  _inherits(MainPage, _JSpringComponent);

	  function MainPage(uniqId) {
	    _classCallCheck(this, MainPage);

	    return _possibleConstructorReturn(this, (MainPage.__proto__ || Object.getPrototypeOf(MainPage)).call(this, uniqId, _controllerMainPage2.default, _serviceMainPage2.default));
	  }

	  return MainPage;
	}(JSpringComponent);

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function ($scope, $, module, _this) {

		//异步初始化swiper
		_this.pushHook(function () {
			Swipe($('.swiper-banner').eq(0), {
				startSlide: $scope.startSlide, //起始幻灯片
				speed: 500, //滑动速度
				auto: 2e3, //滑动间隔
				continuous: true, //是否连续滑动
				pageEl: $('.pagination1').eq(0) //自定义圆点
			});
		});

		$scope.getInfo().then(function (res) {
			var data = res.datas;
			$.each(data, function (info, index) {

				if (info.tag_code == 'QZ_RM') {
					$scope.hotList = info.infos.slice(0, 9);
				} else if (info.tag_code == 'QZ_BANNER') {
					$scope.swiperList = info.infos;
				} else if (info.tag_code == 'QZ_TJ') {
					$scope.specialList = info.infos;
				}
			});
			$scope.loadedFlag = true;
		}).catch(function (err) {});
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _cm = __webpack_require__(12);

	exports.default = function ($, module) {
		var location = module.$location;
		return {
			getInfo: function getInfo() {
				return $.get(_cm.cm.URL.getInfo);
			},
			goVisaList: function goVisaList(pinyin, word) {
				localStorage.setItem('visa-country', word);
				location.go('visaList/' + pinyin);
			},
			goVisaDetail: function goVisaDetail(productId, goodsId) {
				localStorage.setItem('visa-goodsId', goodsId);
				localStorage.setItem('visa-productId', productId);
				location.go('visaDetail/' + goodsId);
			},

			keyword: '',
			startSlide: 1,
			loadedFlag: false,
			swiperList: [],
			hotList: [],
			specialList: []
		};
	};

/***/ },
/* 12 */
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
/* 13 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t<p>\r\n\t\t<label>上海</label>\r\n\t\t<input type=\"text\" placeholder=\"请输入目的地/关键词/主题\" :model=\"keyword\"/>\r\n\t</p>\r\n</div>";

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = "<section class=\"special-ct\">\r\n\t<p class=\"h-title\">\r\n\t\t<h3 class=\"hot-title special-title\">本月特惠</h3>\r\n\t</p>\r\n\t<ul class=\"special-list\">\r\n\t\t<li :for=\"item in list\" class=\"special-item\" :on=\"click:goVisaDetail(item.object_id, item.sub_object_id)\">\r\n\t\t\t<span class=\"special-item-left\">\r\n\t\t\t\t<img :attr=\"{'src' : item.large_image}\">\r\n\t\t\t</span>\r\n\t\t\t<span class=\"special-item-right\">\r\n\t\t\t\t<p>{{item.title}}</p>\r\n\t\t\t\t<p class=\"special-desc f12\">{{item.content}}   需提前{{item.market_price}}天提交材料</p>\r\n\t\t\t\t<p class=\"special-desc special-desc-price\">\r\n\t\t\t\t\t<i>¥</i>\r\n\t\t\t\t\t<i>{{item.price}}</i>起\r\n\t\t\t\t</p>\r\n\t\t\t</span>\r\n\t\t</li>\r\n\t</ul>\r\n</section>";

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = "<div class=\"swiper-container swiper-banner\">\r\n    <div class=\"swiper-wrapper\">\r\n        <div class=\"swiper-slide\" :for=\"let swiper in list\">\r\n            <a :href=\"'visaDetail/' + swiper.sub_object_id\" :if=\"swiper.type == 'visa'\">\r\n                <img :attr=\"{'src' : swiper.large_image}\" />\r\n            </a>\r\n            <a :href=\"swiper.url\" :if=\"swiper.type == 'url'\">\r\n                <img :attr=\"{'src' : swiper.large_image}\" />\r\n            </a>\r\n        </div>\r\n    </div>\r\n    <div class=\"pagination pagination1\"></div>\r\n</div>\r\n";

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = "<section>\r\n\t<p class=\"h-title\">\r\n\t\t<h3 class=\"hot-title\">热门签证</h3>\r\n\t</p>\r\n\t<div class=\"hot-list\">\r\n\t\t<HotItem :component=\"item\" :for=\"let item in list\" class=\"hot-item\" />\r\n\t</div>\r\n</section>";

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = "<span class=\"hot-item-span\" :on=\"click:goVisaList(obj.content, obj.title)\">\r\n\t<img :attr=\"{'src' : obj.large_image}\" :data=\"{'url' : obj.content, 'country' : obj.title}\"/>\r\n\t<span class=\"hot-item-span-title\">{{obj.title}}</span>\r\n\t<span class=\"hot-item-span-price\">¥{{obj.price}}元起</span>\r\n</span>";

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(19);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./SearchInput.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./SearchInput.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".search-input {\r\n\twidth: 91%;\r\n\theight: 35px;\r\n\tmargin: auto;\r\n\tborder:1px solid #e7e7e7;\r\n}\r\n.search-input p {\r\n\theight: 100%;\r\n\tdisplay: block;\r\n\tposition: relative;\r\n}\r\n.search-input p:before {\r\n\tcontent : '';\r\n\twidth: 25px;\r\n\theight: 25px;\r\n\tbackground-image:url(" + __webpack_require__(20) + ");\r\n\tbackground-size:contain;\r\n\tposition: absolute;\r\n\ttop: 5px;\r\n\tleft: 70px;\r\n}\r\n.search-input p label {\r\n\tdisplay: inline-block;\r\n\ttext-align: center;\r\n\theight: 100%;\r\n\twidth: 60px;\r\n\tline-height: 35px;\r\n\tmargin-left: 0;\r\n\tposition: relative;\r\n}\r\n.search-input p label:before {\r\n\tcontent : '';\r\n\twidth: 25px;\r\n\theight: 25px;\r\n\tborder-left: 1px solid #e7e7e7;\r\n\tposition: absolute;\r\n\ttop: 5px;\r\n\tleft: 65px;\r\n}\r\n.search-input p label:after {\r\n\tcontent : '';\r\n\twidth: 7px;\r\n\theight: 7px;\r\n\tborder-top: 1px solid #d30775;\r\n\tborder-right: 1px solid #d30775;\r\n\t-webkit-transform: rotate(135deg);\r\n\ttransform: rotate(135deg);\r\n\tposition: absolute;\r\n\ttop: 11px;\r\n\tright: 0px;\r\n}\r\n.search-input p input {\r\n\tdisplay: inline-block;\r\n\tmargin-left: 35px;\r\n\tfont-size: 12px;\r\n\tline-height: 35px;\r\n}", ""]);

	// exports


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAOVBMVEUAAACqqqqqqqqqqqqtra2/v7+qqqqqqqqqqqqqqqqqqqqsrKy7u7vJycmqqqqqqqqqqqqqqqqqqqomfHFwAAAAEnRSTlMAeeyIOQzPt6jDmCYZBN1pckq699ewAAAA6klEQVQ4y92T227EIAxEA96AIVy25/8/to20Sndjt8pb1Z03RgePbcHyzrqFEiGWsP2KfSQOlduP2KoAWeaUDFC7z7UEca6PSyFCWd16Cer6dM6QvZoK8mL0CuLMAXqyegY7UWKYjlokm/3BtDEB2skScEZscD9ZZQ+xSqbxiHhgJZ2cPcORMAwYroGD6oFqojPl2jDBXc8G01rBa5G2mOzYnIJq/wCUbh/e5sZof+Gyv9yeobSn3IR5Zd8VkPbAKruiS3YBSCqiA+AeDHnEKYfq1xwHadWmpjFKnfv6Denrv5GyXCPr8pf6BHz+DcGcwOjcAAAAAElFTkSuQmCC"

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(22);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./Swiper.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./Swiper.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".swiper-main {\r\n    max-height: none;\r\n    position: relative;\r\n    height: 100%;\r\n}", ""]);

	// exports


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(24);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./Hot.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./Hot.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".hot-list {\r\n\twidth: 100%;\r\n\tposition: relative;\r\n\toverflow: hidden;\r\n}\r\n.hot-title {\r\n\tmargin-bottom: 5px;\r\n}\r\n.hot-list .hot-item {\r\n\twidth: 33.333%;\r\n    \tfloat: left;\r\n\tpadding-right: 2%;\r\n\tpadding-bottom: 4%;\r\n\ttext-align: center;\r\n\tcolor: #FFF;\r\n\tposition: relative;\r\n\toverflow: hidden;\r\n}\r\n\r\n.hot-item-span img{\r\n\tborder-radius: 4px;\r\n}\r\n.hot-item-span {\r\n\theight: 100%;\r\n\twidth: 100%;\r\n}\r\n.hot-item-span-title {\r\n\tbackground-color: rgba(0, 0, 0, .5);\r\n\tposition: absolute;\r\n    \tleft: 50%;\r\n    \ttop: 33%;\r\n    \tpadding: 5px 10px;\r\n    \t-webkit-transform:translateX(-55%);\r\n    \ttransform:translateX(-55%);\r\n    \twhite-space: nowrap;\r\n    \tdisplay: inline-block;\r\n}\r\n.hot-item-span-price {\r\n\tposition: absolute;\r\n\tbackground-color: #FF720E;\r\n\tfont-size: 12px;\r\n    \tright: 6%;\r\n    \ttop: 0;\r\n    \tborder-top-right-radius: 4px;\r\n    \tborder-bottom-left-radius: 4px;\r\n    \tpadding: 2px 0 2px 3px;\r\n}\r\n.hot-ct {\r\n\twidth: 102%;\r\n\tpadding:10px;\r\n}", ""]);

	// exports


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(26);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./Special.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./Special.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".special-title {\r\n\tpadding-left: 10px;\r\n}\r\n.all-area {\r\n\tline-height: 30px;\r\n\twidth: 36%;\r\n\tcolor: #D30775;\r\n\tfont-size: 14px;\r\n\ttext-align: center;\r\n\tbackground-color: #fff;\r\n\tborder: 1px solid #D30775;\r\n\tborder-radius: 5px;\r\n\tmargin: 0 auto;\r\n\tdisplay:block;\r\n}\r\n.all-area-p {\r\n\twidth: 100%;\r\n\tdisplay: block;\r\n}\r\n.special-list {\r\n\twidth: 100%;\r\n\toverflow: hidden;\r\n\tdisplay: block;\r\n\tpadding-left: 0;\r\n}\r\n.h-title {\r\n\tborder-bottom: 1px solid #ddd;\r\n\tmargin-bottom: 10px;\r\n}\r\n.special-item {\r\n\tdisplay: block;\r\n\twidth: 100%;\r\n    \tpadding: 10px 10px 10px 15px;\r\n    \toverflow: hidden;\r\n    \tborder-bottom: 1px solid #ddd;\r\n}\r\n.special-item-left {\r\n\twidth: 105px;\r\n\tfloat: left;\r\n}\r\n.special-item-left img{\r\n\twidth: 105px;\r\n}\r\n.special-item-right {\r\n\tposition: absolute;\r\n\twidth: 100%;\r\n\tpadding-left: 125px;\r\n\tpadding-right: 10px;\r\n\tdisplay: block;\r\n\tleft: 0;\r\n}\r\n.special-item-right p {\r\n \tpadding-left: 10px;\r\n }\r\n.special-desc {\r\n \tcolor: #aaa;\r\n}\r\n.special-desc-price {\r\n \tfloat: right;\r\n}\r\n .special-desc i {\r\n \tcolor: #d30775;\r\n }\r\n .special-desc i:nth-child(2) {\r\n \tfont-size: 21px;\r\n }", ""]);

	// exports


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./mainPage/mainPage.css": 28
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
	webpackContext.id = 27;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(29);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./mainPage.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./mainPage.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "body * {\r\n    box-sizing: border-box;\r\n    font-family: Microsoft yahei,Lucida Grande,Helvetica Neue,Helvetica,Arial,Hiragino Sans GB,Hiragino Sans GB W3,WenQuanYi Micro Hei,sans-serif;\r\n    -webkit-text-size-adjust: 100%;\r\n    text-size-adjust: 100%;\r\n}\r\nh1,h2,h3 {\r\n\tfont-weight: normal;\r\n\tmargin: 0;\r\n}\r\nli {\r\n\tlist-style: none;\r\n}\r\ni {\r\n\tfont-style: normal;\r\n}\r\nul {\r\n\tpadding: 0;\r\n\tmargin: 0;\r\n}\r\nbody, input {\r\n    color: #000;\r\n    margin: 0;\r\n    font-size: 14px;\r\n}\r\np {\r\n\tmargin: 0;\r\n}\r\nbody img {\r\n    -webkit-transition:.5s;\r\n    transition:.5s;\r\n}\r\ninput {\r\n    -webkit-appearance: none;\r\n    outline: none;\r\n}\r\ninput {\r\n    border: none;\r\n    width: 60%;\r\n    height: 25px;\r\n}\r\na, button, div, input, li, optgroup, select, span, textarea, ul {\r\n    -webkit-tap-highlight-color: rgba(0,0,0,0);\r\n    tap-highlight-color: transparent;\r\n}\r\n.f12{font-size: 12px;}\r\nheader .title {\r\n    line-height: 44px;\r\n    text-align: center;\r\n    font-size: 19px;\r\n    margin: 0;\r\n}\r\nheader {\r\n    height: 44px;\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    background: #fafafa;\r\n    z-index: 80;\r\n    width: 100%;\r\n    border-bottom: 1px solid #eee;\r\n}\r\n.visa-home {\r\n\tdisplay: block;\r\n\topacity: 0;\r\n}\r\n#mainPage {\r\n\toverflow-x: hidden;\r\n\tmargin-top: 45px;\r\n}\r\n .process{\r\n \toverflow: hidden;\r\n }\r\n .process li,\r\n .arrow03 {\r\n \twidth: 25%;\r\n \tfloat: left;\r\n \tfont-size: 12px;\r\n \tbox-sizing: border-box;\r\n \tposition: relative;\r\n \tpadding: 23px 0 30px;\r\n }\r\n.arrow03 span,\r\n.process span {\r\n\tdisplay: block;\r\n\twidth: 100%;\r\n\tfloat: left;\r\n\ttext-align: center;\r\n}\r\n.process span img,\r\n.arrow03 span img{\r\n\twidth: 50%;\r\n\tmargin:auto;\r\n\tdisplay: block;\r\n}\r\n.arrow03 :after {\r\n    content: \"\";\r\n    position: absolute;\r\n    width: 1.4rem;\r\n    height: 1.4rem;\r\n    background-repeat: no-repeat;\r\n    background-image: url(" + __webpack_require__(30) + ");\r\n    background-size: 1.4rem;\r\n    right: -11%;\r\n    top: 50%;\r\n    transform: translateY(-100%);\r\n    -webkit-transform: translateY(-100%);\r\n}\r\n", ""]);

	// exports


/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAeCAYAAACFZvb/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2NjE3NDBkZS1mMjI3LWRjNDYtODkxZS1iMDIwZDIxNDBlNmQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Mzc0RTcxNjYwQTk4MTFFNkE0OTFBNzlEQTAxOEM3NjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Mzc0RTcxNjUwQTk4MTFFNkE0OTFBNzlEQTAxOEM3NjQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M2VkOWY3MjMtNDQ5Ny1lZTQ3LWExMmMtMWYyY2RlOWUxYjJiIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NDQyN2VkMjEtMDYxMi0xMWU2LWEyNWUtZDJhOTdhMzM4N2MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+hAuNzwAAAolJREFUeNrM2M9LlEEcx/HHCbpESVBbl6BzLh0ji0CliwZZRrn9OHUoyg6tdOuHRD+oQ2hWRHSJ1CKCbmVk7R7K6D9Qoa2owDpFVHaK+gzMwDB8n5zPzC448IZnHpjH56XPsz77NNVqtXKWZWfRQ3QI/cm4sQU9QjNoF/pKri+gCbQcldBrcn2m0GG0FB1E99Ei8hj70Qq0GVXQKnL9VrQerUHj5jg04pYz343ukZA7aM5srzOQArFen/hbs70MPWEhGjGITjr79pCQN2i7B6kSkG+oHdU8yCYGocfFRMiLRMhnATIeClHOtoac8iBjJKQ7AfIpFqK8+QUP0ktCnguQSgTkHXNpKWGfBBlNgLREQNocSPN8EJWz34eUIiA7GgBpZRAWcjoBMpEDWRl5aTWbe6SVQehxXoCMJEKqBORjCEQFHMiH7F0gkI0MIg9yl4TsrAPkvQN5aiGhCAs548z3kZBnAqRCQtoEyAYGocc5NOBBDhDrLeS3mRfRFWK9hXxwIA9YRBNa7e2bI4+hn3gXO/Nf5Hp94kvcn69IwA10xNk3aL6HhA7/XnqJThDri+bxxl6Cs6hHJQL6ScCIB+gk/hJF7x6aNTf7jIoEDC0UQMinkwZcFwBlAlASAF31AsyHsICjiYBRAfAzcH2LAOhwAf9DNALwKgJQFQDTIc9OGnBNAPQnAjoTAF/yABLCAvoEwN/AE+htAKA9D+AjJMDVCMBY4iVUYQAuQgOGBUC5DoAfJKDAACzCAo4lAPyXCpN1AHSEACziUiJgm/d6Z9LcA6GAtTmAKea9k/spNEwCMvMLiAXo0ZMCsIib5r/nZXScBOhxG30337a6SIAej82j9VQMQI9/AgwAI8Xt3EA0Mo8AAAAASUVORK5CYII="

/***/ }
]);