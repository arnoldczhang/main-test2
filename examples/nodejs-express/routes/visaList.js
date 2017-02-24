'use strict'
const 
	express = require('express')
	, router = express.Router()
	, redis = require("redis")
	, Utils = require('../public/lib/utils')
	, Compiler = require('../../../resources/compiler.js')
	;


/* GET visaList page. */
router.get('/', function(req, res, next) {
	const KEY = 'visaListVNodeTpl';
	const client = redis.createClient();
	const config = {
	    css : ['stylesheets/visaList/visaList.css'],
	    js : ['javascripts/visaList/visaList.js'],
	    metaUrl : 'views/meta.tpl'
	};

	client.on("error", (err) => {
	    console.log("Error " + err);
	});

	client.on("connect", () => {
	    client.get(KEY, function(err, reply) {

	        if (reply) {
	            console.log('use the redis cach')
	            config.vNodeTemplate = reply.toString();
	        } else {
	            config.redis = client;
	            config.redisKey = KEY;
	        }

	        const city = unescape(Utils.getCookie(req.headers.cookie, 'visa-country'));
	        Utils.get({
	            url : 'http://m.lvmama.com/api/router/rest.do?method=api.com.visa.product.search&firstChannel=TOUCH&secondChannel=LVMM&version=1.0.0&format=json&',
                    params : {
                        pageSize : 20,
                        pageIndex : 1,
                        provinceName : '上海',
                        countryName : city
                    }
	        }, req).then((resp) => {
	        	const model = {
        			visaList : resp.data.products,
        			city : city,
        			pageIndex : 1,
        			paixu : true,
        			quanbu : true,
        			changzhu : true,
        			loadedFlag : true,
        			filterStyleFn : function (flag) {
				return flag ? {

					} : {
						color : '#d30775'
					};
			},
			goBack : function () {
				history.go(-1);
			},
			toggleIcon : function (key) {
				this[key] = !this[key];
			},
			goVisaDetail : function (productId, goodsId) {
				setCookie('visa-goodsId', goodsId);
				setCookie('visa-productId', productId);
				location.href = 'visaDetail#' + goodsId;
			}
        		};

	        	if (config.component) {

	        		for (let cp of config.component) {
	        			Compiler.addComponent(cp.id, cp);
	        		}
	        	}

		const options = {
			model,
			config
		};
		res.render('visaList', options);
	        });
	    });
	});
});

module.exports = router;