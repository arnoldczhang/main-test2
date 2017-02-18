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
	const KEY = 'visaMainPageVNodeTpl';
	const client = redis.createClient();
	const config = {
	    component : [
	        {
	            id : 'SearchInput',
	            data : 'word',
	            url : 'views/SearchInput.tpl'
	        },
	        {
	            id : 'Swiper',
	            data : 'list',
	            url : 'views/Swiper.tpl'
	        },
	        {
	            id : 'Hot',
	            data : 'list',
	            url : 'views/Hot.tpl'
	        },
	        {
	            id : 'HotItem',
	            data : 'obj',
	            url : 'views/HotItem.tpl'
	        },
	        {
	            id : 'Special',
	            data : 'list',
	            url : 'views/Special.tpl'
	        }
	    ],
	    css : ['stylesheets/mainPage/mainPage.css'],
	    js : ['javascripts/mainPage/mainPage.js'],
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

	        Utils.get({
	            url : 'http://m.lvmama.com/bullet/index.php?s=/Api/getInfos&channelCode=QZ&firstChannel=TOUCH&format=json&lvsessionid=2d088a83-b6a3-474d-aeff-5637c87f65b8&secondChannel=LVMM&stationCode=SH&tagCodes=QZ_BANNER,QZ_SJ,QZ_GJ,QZ_TJ,QZ_WD,QZ_RM,HDTJ_SMALL,HDTJ_BIG&udid=adc5b78a-6dfe-4833-ac41-28e3f664e68e-uuid&firstChannel=TOUCH&secondChannel=LVMM&format=json'
	        }, req).then((resp) => {
	        	const 
	        		visaData = resp.datas
	        		, model = {
				keyword : '上海123',
				getInfo : '',
				goVisaList : '',
				goVisaDetail : '',
				loadedFlag : false
			}
	        		;

	        	for (let info of visaData) {

	        		if (info.tag_code == 'QZ_RM') {
	        			model.hotList = info.infos.slice(0, 9);
	        		}

	        		else if (info.tag_code == 'QZ_BANNER') {
	        			model.swiperList = info.infos;
	        		}

	        		else if (info.tag_code == 'QZ_TJ') {
	        		 	model.specialList = info.infos;
	        		 }
	        	}

	        	if (config.component) {

	        		for (let cp of config.component) {
	        			Compiler.addComponent(cp.id, cp);
	        		}
	        	}

		const options = {
			model,
			config
		};
		res.render('mainPage', options);
	        });
	    });
	});

});

module.exports = router;