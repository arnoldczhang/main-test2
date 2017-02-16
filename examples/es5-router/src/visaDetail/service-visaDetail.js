module.exports = function (cm) {
	return function ($, module) {
		var 
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
			goBack : function goBack () {
				location.back();
			},
			toBr : function toBr (str) {
				return str.replace(/[2-9]+[、\.]/g,"<br />$&");
			},
			toggleTab : function toggleTab (flag) {
				this.visaDetailFlag = false;
				this.needInfoFlag = false; 
				this.reserveFlag = false; 
				this.commentFlag = false; 
				this[flag] = true;
			},
			getVisaDetail : function getVisaDetail () {
				return $.get(URL.visaDetails, {
					goodsId : this.goodsId
				});
			},
			getLatitudeScores : function getLatitudeScores () {
				return $.get(URL.latitudeScores, {
					productId : this.productId
				});
			},
			getCmtCommentList : function getCmtCommentList () {
				return $.get(URL.cmtCommentList, {
					productId : this.productId,
					currentPage : this.currentPage,
					pageSize : this.pageSize
				});
			}
		};
	};
};

