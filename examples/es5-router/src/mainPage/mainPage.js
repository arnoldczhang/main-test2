var controller = require('./controller-mainPage');
var service = require('./service-mainPage');

var searchInputTemplate = require('../../templates/SearchInput.tpl');
var specialTemplate = require('../../templates/Special.tpl');
var swiperTemplate = require('../../templates/Swiper.tpl');
var hotTemplate = require('../../templates/Hot.tpl');
var hotItemTemplate = require('../../templates/HotItem.tpl');

JSpring.addComponent('SearchInput', {
  data : 'word',
  template : searchInputTemplate
});

JSpring.addComponent('Swiper', {
  data : 'list',
  template : swiperTemplate
});

JSpring.addComponent('Hot', {
  data : 'list',
  template : hotTemplate
});

JSpring.addComponent('HotItem', {
  data : 'obj',
  template : hotItemTemplate
});

JSpring.addComponent('Special', {
  data : 'list',
  template : specialTemplate
});

module.exports = function (cm) {
  JSpring(['mainPage', controller, service(cm)]); 
};