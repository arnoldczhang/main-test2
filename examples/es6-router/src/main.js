/**
  * router config
  **/
import '../../../resources/main.css';
import '../../../resources/main-test2';
const 
            BASE = './'
            , DEST = BASE + 'dist/'
            ;
JSpring.router('#container', {

    'mainPage' : {
        uniqId : 'mainPage', 
        templateUrl : BASE + 'templates/mainPage.tpl',
        controllerFn :  (resolve) => {
          require([BASE + 'mainPage/mainPage.js'
            , BASE + 'mainPage/mainPage.css']
            , resolve);
        },
        title : '签证首页',
        cach : true
    },

    'visaList/:cityId' : {
        uniqId : 'visaList', 
        templateUrl : BASE + 'templates/visaList.tpl',
        controllerFn : (resolve) => {
          require([BASE + 'visaList/visaList.js'
            , BASE + 'visaList/visaList.css']
            , resolve);
        },
        title : '签证列表',
        cach : false
    },

    'visaDetail/:goodsId' : {
        uniqId : 'visaDetail', 
        templateUrl : BASE + 'templates/visaDetail.tpl',
        controllerFn : (resolve) => {
          require([BASE + 'visaDetail/visaDetail.js'
            , BASE + 'visaDetail/visaDetail.css']
            , resolve);
        },
        title : '签证详情',
        cach : false
    },

    'default' : 'mainPage'
});
