'use strict'
const 
	express = require('express')
	, router = express.Router()
	, redis = require("redis")
	, Utils = require('../public/lib/utils')
	, Compiler = require('../../../resources/compiler.js')
	;


/* GET home page. */
router.get('/', function(req, res, next) {
	const KEY = 'visaDetailVNodeTpl';
	const cookie = req.headers.cookie;
	const client = redis.createClient();
	const config = {
	    css : ['stylesheets/visaDetail/visaDetail.css'],
	    js : ['javascripts/visaDetail/visaDetail.js'],
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

	        const goodsId = Utils.getCookie(cookie, 'visa-goodsId');
	        const productId = Utils.getCookie(cookie, 'visa-productId');

	        Utils.get({
		url : 'http://m.lvmama.com/api/router/rest.do?Ah5version=0.10192173861870768&h5Flag=Y&method=api.com.visa.product.getVisaDetails&version=1.0.0&firstChannel=TOUCH&secondChannel=LVMM&format=json&',
		params: {
			goodsId
		}
	        }, req).then((resp) => {
	        	const 
	        		visaData = resp.data
	        		, model = {
				detail : {
					imgUrl: visaData.imageUrl,
					price: visaData.price,
					productName: visaData.productName,
					map: visaData.map
				},
				visaDetailFlag : true,
				needInfoFlag : false,
				reserveFlag : false,
				commentFlag : false,
				loadedFlag : true,
				currentPage : 1,
				pageSize : 10,
				goodsId : goodsId,
				productId : productId,
				goBack () {
					history.go(-1);
				},
				toBr (str) {
					return str.replace(/[2-9]+[、\.]/g,"<br />$&");
				},
				toggleTab (flag) {
					this.visaDetailFlag = false;
					this.needInfoFlag = false; 
					this.reserveFlag = false; 
					this.commentFlag = false; 
					this[flag] = true;
				}
			}
	        		;

	        	if (config.component) {

	        		for (let cp of config.component) {
	        			Compiler.addComponent(cp.id, cp);
	        		}
	        	}

		const options = {
			model,
			config
		};
		res.render('visaDetail', options);
	        });
	    });
	});
});

module.exports = router;