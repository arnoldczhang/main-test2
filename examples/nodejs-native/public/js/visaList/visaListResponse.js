'use strict'
let Compiler = require('../../../../../resources/compiler.js');

exports.returnHtml = (req, res, opts) => {

	const model = {
		visaList : opts.data.visaData,
		city : opts.data.city,
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