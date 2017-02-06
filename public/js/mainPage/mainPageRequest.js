'use strict'
let mainPageResponse = require('./mainPageResponse');
let request = require("request");
let Q = require('q');//异步 deffer

const get = (object = {}, req) => {
    let that = this,
        deferred = Q.defer();

    let option = {
        url: object.url,
        qs: object.params,
        method: "GET",
        timeout: object.timeout || 10000,
        headers: {
            'signal': 'ab4494b2-f532-4f99-b57e-7ca121a137ca',
            'User-Agent': req.headers['user-agent']
        }
    };

    var startTime = Date.now();
    request(option, function (e, res, body) {
        if (e) {
            deferred.resolve({error: e.message});
        } else if (res.statusCode == 200) {
            try {
                deferred.resolve(JSON.parse(body));
            } catch (err) {
                deferred.resolve({});
            }
        } else {
            deferred.resolve({error: "接口请求异常：statusCode=" + res.statusCode + "  " + res.request.href, code: res.statusCode, body: body});
        }
    });
    return deferred.promise;
};

exports.requestData = (req, res) => {
	
	get({
		url : 'http://m.lvmama.com/api/router/rest.do?method=api.com.home.getStations&version=1.0.0&firstChannel=TOUCH&secondChannel=LVMM'
	}, req).then((resp) => {

		//http request
		const cityData = resp.data;
		const data = {cityData};

		mainPageResponse.returnHtml(req, res, {
			url : 'templates/mainPage.lv',
			css : ['public/css/mainPage/mainPageService.css'],
			js : ['public/js/mainPage/mainPageService.js'],
			data : data
		});
	});
};