'use strict'
let visaDetailRequest = require('../public/js/visaDetail/visaDetailRequest');

exports.processRequest = (req, res) => {
	visaDetailRequest.requestData(req, res);
}