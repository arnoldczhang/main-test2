module.exports = function (cm) {
	return function ($, module) {
		var location = module.$location;
		return {
			city : localStorage.getItem('visa-country'),
			visaList : [],
			pageIndex : 1,
			paixu : true,
			quanbu : true,
			changzhu : true,
			filterStyleFn : function filterStyleFn (flag) {
				return flag ? {

					} : {
						color : '#d30775'
					};
			},
			getSearch : function getSearch (index) {
				index = index || 1;
				return $.get(cm.URL.search, {
					pageSize : 20,
					pageIndex : index,
					provinceName : '上海',
					countryName : this.city
				});
			},
			goBack : function goBack () {
				location.back();
			},
			toggleIcon : function toggleIcon (key) {
				this[key] = !this[key];
			},
			goVisaDetail : function goVisaDetail (productId, goodsId) {
				localStorage.setItem('visa-goodsId', goodsId);
				localStorage.setItem('visa-productId', productId);
				location.go('visaDetail/' + goodsId);
			}
		};
	};
};