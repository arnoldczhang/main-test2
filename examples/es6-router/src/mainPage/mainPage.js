import controller from './controller-mainPage';
import service from './service-mainPage';

const searchInputTemplate = require('../../templates/SearchInput.tpl');
const specialTemplate = require('../../templates/Special.tpl');
const swiperTemplate = require('../../templates/Swiper.tpl');
const hotTemplate = require('../../templates/Hot.tpl');
const hotItemTemplate = require('../../templates/HotItem.tpl');

JSpring.addComponent('SearchInput', {
  data : 'word',
  template : searchInputTemplate,
  style : require('../css/SearchInput.css')
});

JSpring.addComponent('Swiper', {
  data : 'list',
  template : swiperTemplate,
  style : require('../css/Swiper.css')
});

JSpring.addComponent('Hot', {
  data : 'list',
  template : hotTemplate,
  style : require('../css/Hot.css')
});

JSpring.addComponent('HotItem', {
  data : 'obj',
  template : hotItemTemplate
});

JSpring.addComponent('Special', {
  data : 'list',
  template : specialTemplate,
  style : require('../css/Special.css')
});

export class MainPage extends JSpringComponent {
  constructor (uniqId) {
    super(uniqId, controller, service);
  }
}
