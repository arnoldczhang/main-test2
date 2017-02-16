var controller = require('./controller-visaList');
var service = require('./service-visaList');

module.exports = function (cm) {
  JSpring(['visaList', controller, service(cm)]); 
};
