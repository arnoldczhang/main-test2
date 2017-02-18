'use strict'
const
             Utils = require("../utils")
             , redis = require("redis")
             , mainPageResponse = require('./mainPageResponse')
             ;

exports.requestData = (req, res) => {
        const KEY = 'visaMainPageVNodeTpl';
        const client = redis.createClient();
        const config = {
            url : 'templates/mainPage.tpl',
            component : [
                {
                    id : 'SearchInput',
                    data : 'word',
                    url : 'templates/SearchInput.tpl'
                },
                {
                    id : 'Swiper',
                    data : 'list',
                    url : 'templates/Swiper.tpl'
                },
                {
                    id : 'Hot',
                    data : 'list',
                    url : 'templates/Hot.tpl'
                },
                {
                    id : 'HotItem',
                    data : 'obj',
                    url : 'templates/HotItem.tpl'
                },
                {
                    id : 'Special',
                    data : 'list',
                    url : 'templates/Special.tpl'
                }
            ],
            css : ['public/css/mainPage/mainPage.css'],
            js : ['public/js/mainPage/mainPageService.js'],
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

                Utils.get({
                    url : 'http://m.lvmama.com/bullet/index.php?s=/Api/getInfos&channelCode=QZ&firstChannel=TOUCH&format=json&lvsessionid=2d088a83-b6a3-474d-aeff-5637c87f65b8&secondChannel=LVMM&stationCode=SH&tagCodes=QZ_BANNER,QZ_SJ,QZ_GJ,QZ_TJ,QZ_WD,QZ_RM,HDTJ_SMALL,HDTJ_BIG&udid=adc5b78a-6dfe-4833-ac41-28e3f664e68e-uuid&firstChannel=TOUCH&secondChannel=LVMM&format=json'
                }, req).then((resp) => {
                        const visaData = resp.datas;
                        mainPageResponse.returnHtml(req, res, {
                            visaData
                        }, config);
                });
            });
        });
};