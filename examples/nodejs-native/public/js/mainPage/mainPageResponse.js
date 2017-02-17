'use strict'
let Compiler = require('../../../../../resources/compiler.js');

exports.returnHtml = (req, res, opts) => {

	const 
		model = {
			keyword : '上海123',
			getInfo : '',
			goVisaList : '',
			goVisaDetail : '',
			loadedFlag : false
		}
		, data = opts.data
		;

	for (let info of data.visaData) {

		if (info.tag_code == 'QZ_RM') {
			model.hotList = info.infos.slice(0, 9);
		}

		else if (info.tag_code == 'QZ_BANNER') {
			model.swiperList = info.infos;
		}

		else if (info.tag_code == 'QZ_TJ') {
		 	model.specialList = info.infos;
		 }
	}

	if (opts.component) {

		for (let cp of opts.component) {
			Compiler.addComponent(cp.id, cp);
		}
	}

	if (res && req) {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		let template = Compiler.render(opts.url, model, opts);
		res.write(template);
		res.end();
	}
};