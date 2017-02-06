'use strict'
let mainPageRequest = require('../public/js/mainPage/mainPageRequest');

exports.processRequest = (req, res) => {
	mainPageRequest.requestData(req, res);
}