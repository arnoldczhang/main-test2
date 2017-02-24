'use strict'
const
	 request = require("request")
	 , Q = require('q')
	 ;//异步 deffer

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
                console.log('接口耗时：' + (Date.now() - startTime) + 'ms');
            } catch (err) {
                deferred.resolve({});
            }
        } else {
            deferred.resolve({error: "接口请求异常：statusCode=" + res.statusCode + "  " + res.request.href, code: res.statusCode, body: body});
        }
    });
    return deferred.promise;
};

const getCookie = (cookie, key) => {
    let arrStr = cookie.split(";");
    for (let i = 0; i < arrStr.length; i++) {
        let temp = arrStr[i].split("=");
        if (temp[0].trim() == key) return temp[1];
    }
};

module.exports = {
    get,
    getCookie
};