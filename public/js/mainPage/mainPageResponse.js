'use strict'
let compiler = require('../../../resources/compiler.js');

exports.returnHtml = (req, res, opts) => {

	const 
		model = {}
		, data = opts.data
		;

	model.letterObj = {};
	model.letterArr = [];
	model.letterShowObj = {};
	model.toggleShow = '';
	model.text = 'abc';
	model.js = opts.js;
	model.css = opts.css;

	data.cityData.forEach((city) => {
		let firstLetter = city.pinyin[0].toUpperCase();

		if (model.letterObj[firstLetter]) {
			model.letterObj[firstLetter].push(city);
		} else {
			model.letterObj[firstLetter] = [];
		}

		if (model.letterArr.indexOf(firstLetter) == -1) {
			model.letterArr.push(firstLetter);
			model.letterShowObj[firstLetter] = true;
		}
	});

	if (res && req) {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		let template = compiler.render(opts.url, model, opts);
		res.write(template);
		res.end();
	}
};