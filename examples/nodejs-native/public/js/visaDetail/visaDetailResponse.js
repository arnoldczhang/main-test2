'use strict'
let Compiler = require('../../../../../resources/compiler.js');

exports.returnHtml = (req, res, data, config) => {

	const model = {
		detail : data.visaData,
		visaDetailFlag : true,
		needInfoFlag : false,
		reserveFlag : false,
		commentFlag : false,
		loadedFlag : true,
		currentPage : 1,
		pageSize : 10,
		goodsId : data.goodsId,
		productId : data.productId,
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