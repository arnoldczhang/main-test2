var controller = require('./controller-visaDetail');
var service = require('./service-visaDetail');

module.exports = function (cm) {
  JSpring(['visaDetail', controller, service(cm)]); 
};