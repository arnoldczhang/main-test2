'use strict'
let Compiler = require('../../../../../resources/compiler.js');

exports.returnHtml = (req, res, data, config) => {

	const model = {
		visaList : data.visaData,
		city : data.city,
		pageIndex : 1,
		paixu : true,
		quanbu : true,
		changzhu : true,
		loadedFlag : true,
		filterStyleFn (flag) {
			return flag ? {

			} : {
				color : '#d30775'
			};
		},
		goBack () {
		},
		toggleIcon (key) {
			this[key] = !this[key];
		},
		goVisaDetail (productId, goodsId) {
		}
	};

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