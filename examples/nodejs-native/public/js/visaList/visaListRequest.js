'use strict'
const
             Utils = require("../utils")
             , redis = require("redis")
             , visaListResponse = require('./visaListResponse')
             ;

exports.requestData = (req, res) => {
        const KEY = 'visaListVNodeTpl';
        const client = redis.createClient();
        const config = {
            url : 'templates/visaList.tpl',
            css : ['public/css/visaList/visaList.css'],
            js : ['public/js/visaList/visaListService.js'],
            metaUrl : 'templates/meta.tpl'
        };

        client.on("error", function(err) {
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
                        const visaData = resp.data.products;
                        visaListResponse.returnHtml(req, res, {
                            visaData,
                            city
                        }, config);
                });
            });
        });
};