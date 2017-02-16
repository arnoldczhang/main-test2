import { cm } from '../cm';

export default ($, module) => {
	const 
		location = module.$location
		, URL = cm.URL
		;
	return {
		detail : {
			imgUrl : '',
			price : '',
			productName : '',
			map : {}
		},
		visaDetailFlag : true,
		needInfoFlag : false,
		reserveFlag : false,
		commentFlag : false,
		currentPage : 1,
		pageSize : 10,
		goodsId : localStorage.getItem('visa-goodsId'),
		productId : localStorage.getItem('visa-productId'),
		goBack () {
			location.back();
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
		},
		getVisaDetail () {
			return $.get(URL.visaDetails, {
				goodsId : this.goodsId
			});
		},
		getLatitudeScores () {
			return $.get(URL.latitudeScores, {
				productId : this.productId
			});
		},
		getCmtCommentList () {
			return $.get(URL.cmtCommentList, {
				productId : this.productId,
				currentPage : this.currentPage,
				pageSize : this.pageSize
			});
		}
	};
};