import { cm } from '../cm';

export default ($, module) => {
	const location = module.$location;
	return {
		city : localStorage.getItem('visa-country'),
		visaList : [],
		pageIndex : 1,
		paixu : true,
		quanbu : true,
		changzhu : true,
		loadedFlag : false,
		filterStyleFn (flag) {
			return flag ? {

				} : {
					color : '#d30775'
				};
		},
		getSearch (index = 1) {
			return $.get(cm.URL.search, {
				pageSize : 20,
				pageIndex : index,
				provinceName : '上海',
				countryName : this.city
			});
		},
		goBack () {
			location.back();
		},
		toggleIcon (key) {
			this[key] = !this[key];
		},
		goVisaDetail (productId, goodsId) {
			localStorage.setItem('visa-goodsId', goodsId);
			localStorage.setItem('visa-productId', productId);
			location.go('visaDetail/' + goodsId);
		}
	};
};