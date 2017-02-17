'use strict'
let Compiler = require('../../../../../resources/compiler.js');

exports.returnHtml = (req, res, opts) => {

	const model = {
		detail : opts.data.visaData,
		visaDetailFlag : true,
		needInfoFlag : false,
		reserveFlag : false,
		commentFlag : false,
		loadedFlag : true,
		currentPage : 1,
		pageSize : 10,
		goodsId : opts.data.goodsId,
		productId : opts.data.productId,
		goBack () {
			history.go(-1);
		},
		toBr (str) {
			return str.replace(/[2-9]+[、\.]/g,"<br />$&");
		},
		toggleTab (flag) {
			this.visaDetailFlag = false;
			this.needInfoFlag = false; 
			this.reserveFlag = false; 
			this.commentFlag = false; 
			this[flag] = true;
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