webpackJsonp([2],{

/***/ 23:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./visaList/visaList.js": 24
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
	webpackContext.id = 23;


/***/ },

/***/ 24:
/***/ function(module, exports, __webpack_require__) {

	var controller = __webpack_require__(25);
	var service = __webpack_require__(26);

	module.exports = function (cm) {
	  JSpring(['visaList', controller, service(cm)]); 
	};


/***/ },

/***/ 25:
/***/ function(module, exports) {

	module.exports = function ($scope, $, module, _this) {
		$scope.getSearch().then(function (res) {
			$scope.visaList = res.data.products;
			_this.pushHook(function () {
				$('.visaList-body').addClass('fadeIn');
			});
		}).catch(function (err) {

		});
	};

/***/ },

/***/ 26:
/***/ function(module, exports) {

	module.exports = function (cm) {
		return function ($, module) {
			var location = module.$location;
			return {
				city : localStorage.getItem('visa-country'),
				visaList : [],
				pageIndex : 1,
				paixu : true,
				quanbu : true,
				changzhu : true,
				filterStyleFn : function filterStyleFn (flag) {
					return flag ? {

						} : {
							color : '#d30775'
						};
				},
				getSearch : function getSearch (index) {
					index = index || 1;
					return $.get(cm.URL.search, {
						pageSize : 20,
						pageIndex : index,
						provinceName : '上海',
						countryName : this.city
					});
				},
				goBack : function goBack () {
					location.back();
				},
				toggleIcon : function toggleIcon (key) {
					this[key] = !this[key];
				},
				goVisaDetail : function goVisaDetail (productId, goodsId) {
					localStorage.setItem('visa-goodsId', goodsId);
					localStorage.setItem('visa-productId', productId);
					location.go('visaDetail/' + goodsId);
				}
			};
		};
	};

/***/ },

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./visaList/visaList.css": 28
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

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(29);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
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

/***/ 29:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "body * {\r\n    box-sizing: border-box;\r\n    font-family: Microsoft yahei,Lucida Grande,Helvetica Neue,Helvetica,Arial,Hiragino Sans GB,Hiragino Sans GB W3,WenQuanYi Micro Hei,sans-serif;\r\n    -webkit-text-size-adjust: 100%;\r\n    text-size-adjust: 100%;\r\n}\r\nh1,h2,h3 {\r\n\tfont-weight: normal;\r\n\tmargin: 0;\r\n}\r\nli {\r\n\tlist-style: none;\r\n}\r\ni {\r\n\tfont-style: normal;\r\n}\r\nbody, input {\r\n    color: #000;\r\n    margin: 0;\r\n    font-size: 14px;\r\n}\r\np {\r\n\tmargin: 0;\r\n}\r\nul {\r\n\tpadding-left: 0;\r\n}\r\nbody img {\r\n    -webkit-transition:.5s;\r\n    transition:.5s;\r\n}\r\ninput {\r\n    -webkit-appearance: none;\r\n    outline: none;\r\n}\r\ninput {\r\n    border: none;\r\n    width: 60%;\r\n    height: 25px;\r\n}\r\na, button, div, input, li, optgroup, select, span, textarea, ul {\r\n    -webkit-tap-highlight-color: rgba(0,0,0,0);\r\n    tap-highlight-color: transparent;\r\n}\r\n.f12{font-size: 12px;}\r\n.fr {float: right;}\r\n.pink{color:#d30775;}\r\nheader .title {\r\n    line-height: 44px;\r\n    text-align: center;\r\n    font-size: 19px;\r\n    margin: 0;\r\n}\r\nheader {\r\n    height: 44px;\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    background: #fafafa;\r\n    z-index: 80;\r\n    width: 100%;\r\n    border-bottom: 1px solid #eee;\r\n}\r\n.visaList {\r\n    overflow-x: hidden;\r\n    margin-top: 45px;\r\n}\r\n.visa-list {\r\n\toverflow: hidden;\r\n\tborder-bottom: 1px solid #ddd;\r\n\tpadding: 10px 10px 23px 15px;\r\n\tbackground-color: #fff;\r\n\tmargin-bottom: 10px;\r\n\tposition: relative;\r\n\theight: auto;\r\n\tbox-sizing: border-box;\r\n}\r\n.visa-list p img{\r\n\theight: 13px;\r\n\twidth: 13px;\r\n}\r\n.bottom {\r\n\tposition: fixed;\r\n\tbottom: 0;\r\n\tleft: 0;\r\n\theight: 48px;\r\n\twidth: 100%;\r\n\tbackground-color: rgba(50,50,50,.95);\r\n\toverflow: hidden;\r\n}\r\n.visaList-body {\r\n\tmargin-bottom: 48px;\r\n    \topacity: 0;\r\n}\r\n.bottom > span {\r\n\twidth: 33%;\r\n\theight: 48px;\r\n\tfloat: left;\r\n\ttext-align: center;\r\n\tposition: relative;\r\n\tcolor:white;\r\n}\r\n.bottom > span > img{\r\n\twidth: 18px;\r\n\theight: 14px;\r\n\tdisplay: block;\r\n    \tmargin: 10px auto 0 auto;\r\n}\r\n.visa-list .visa-price i{\r\n\tcolor: #d30775;\r\n}\r\n.visa-list .visa-price > i:nth-child(2) {\r\n\tfont-size: 21px;\r\n}\r\n.visa-grey {\r\n\tcolor:#aaa;\r\n}\r\n.back-btn {\r\n\tposition: absolute;\r\n\tleft: 10px;\r\n\ttop: 15px;\r\n\theight: 15px;\r\n\twidth: 15px;\r\n\tborder-left: 1px solid #d30775;\r\n\tborder-top: 1px solid #d30775;\r\n\t-webkit-transform:rotate(-45deg);\r\n\ttransform:rotate(-45deg);\r\n}\r\n", ""]);

	// exports


/***/ }

});