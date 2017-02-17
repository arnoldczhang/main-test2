'use strict'
let visaListRequest = require('../public/js/visaList/visaListRequest');

exports.processRequest = (req, res) => {
	visaListRequest.requestData(req, res);
}