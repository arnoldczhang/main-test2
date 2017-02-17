'use strict'
const
             Utils = require("../utils")
             , redis = require("redis")
             , visaDetailResponse = require('./visaDetailResponse')
             ;

exports.requestData = (req, res) => {
        const KEY = 'visaDetailVNodeTpl';
        const client = redis.createClient();
        const props = {
            url : 'templates/visaDetail.tpl',
            css : ['public/css/visaDetail/visaDetail.css'],
            component : [],
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
                    props.vNodeTpl = reply.toString();
                } else {
                    props.redis = client;
                    props.key = KEY;
                }

                const goodsId = Utils.getCookie(req.headers.cookie, 'visa-goodsId');
                const productId = Utils.getCookie(req.headers.cookie, 'visa-productId');

                Utils.get({
                    url : 'http://m.lvmama.com/api/router/rest.do?Ah5version=0.10192173861870768&h5Flag=Y&method=api.com.visa.product.getVisaDetails&version=1.0.0&firstChannel=TOUCH&secondChannel=LVMM&format=json&',
                    params : {
                        goodsId
                    }
                }, req).then((resp) => {
                        const rData = resp.data;
                        const visaData = {
                            imgUrl : rData.imageUrl,
                            price : rData.price,
                            productName : rData.productName,
                            map : rData.map
                        };
                        const data = {
                            visaData,
                            goodsId,
                            productId
                        };
                        props.data = data;
                        visaDetailResponse.returnHtml(req, res, props);
                });
            });
        });
};