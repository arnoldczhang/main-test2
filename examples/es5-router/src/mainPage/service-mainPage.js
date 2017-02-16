module.exports = function (cm) {
	return function ($, module) {
		var location = module.$location;
		return {
			getInfo : function getInfo () {
				return $.get(cm.URL.getInfo);
			},
			goVisaList : function goVisaList(pinyin, word) {
				localStorage.setItem('visa-country', word);
				location.go('visaList/' + pinyin);
			},
			goVisaDetail : function goVisaDetail(productId, goodsId) {
				localStorage.setItem('visa-goodsId', goodsId);
				localStorage.setItem('visa-productId', productId);
				location.go('visaDetail/' + goodsId);
			},
			keyword : '',
			startSlide : 1,
			swiperList : [],
			hotList : [],
			specialList : []
		};
	};
};