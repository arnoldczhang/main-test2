import { cm } from '../cm';

export default ($, module) => {
	const location = module.$location;
	return {
		getInfo () {
			return $.get(cm.URL.getInfo);
		},
		goVisaList (pinyin, word) {
			localStorage.setItem('visa-country', word);
			location.go('visaList/' + pinyin);
		},
		goVisaDetail (productId, goodsId) {
			localStorage.setItem('visa-goodsId', goodsId);
			localStorage.setItem('visa-productId', productId);
			location.go('visaDetail/' + goodsId);
		},
		keyword : '',
		startSlide : 1,
		loadedFlag : false,
		swiperList : [],
		hotList : [],
		specialList : []
	};
};