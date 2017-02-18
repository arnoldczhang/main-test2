'use strict'
const
             Utils = require("../utils")
             , redis = require("redis")
             , visaDetailResponse = require('./visaDetailResponse')
             ;

exports.requestData = (req, res) => {
        const KEY = 'visaDetailVNodeTpl';
        const cookie = req.headers.cookie;
        const client = redis.createClient();
        const config = {
            url : 'templates/visaDetail.tpl',
            css : ['public/css/visaDetail/visaDetail.css'],
            js : ['public/js/visaDetail/visaDetailService.js'],
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

                const goodsId = Utils.getCookie(cookie, 'visa-goodsId');
                const productId = Utils.getCookie(cookie, 'visa-productId');

                Utils.get({
                    url : 'http://m.lvmama.com/api/router/rest.do?Ah5version=0.10192173861870768&h5Flag=Y&method=api.com.visa.product.getVisaDetails&version=1.0.0&firstChannel=TOUCH&secondChannel=LVMM&format=json&',
                    params : {
                        goodsId
                    }
                }, req).then((resp) => {
                        const resData = resp.data;
                        const visaData = {
                            imgUrl : resData.imageUrl,
                            price : resData.price,
                            productName : resData.productName,
                            map : resData.map
                        };

                        visaDetailResponse.returnHtml(req, res, {
                            visaData,
                            goodsId,
                            productId
                        }, config);
                });
            });
        });
};