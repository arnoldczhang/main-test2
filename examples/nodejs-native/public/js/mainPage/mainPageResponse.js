'use strict'
let Compiler = require('../../../../../resources/compiler.js');

exports.returnHtml = (req, res, data, config) => {

	const 
		model = {
			keyword : '上海123',
			getInfo : '',
			goVisaList : '',
			goVisaDetail : '',
			loadedFlag : false
		}
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

	if (config.component) {

		for (let cp of config.component) {
			Compiler.addComponent(cp.id, cp);
		}
	}

	const options = {
		model,
		config
	};

	if (res && req) {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		let template = Compiler.render(config.url, options);
		res.write(template);
		res.end();
	}
};