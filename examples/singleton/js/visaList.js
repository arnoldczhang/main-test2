
var sprintInst = JSpring([function($scope, $, module, _this) {
	$scope.getSearch().then(function (res) {
		$scope.visaList = res.data.products;
		$scope.loadedFlag = true;
	}).catch(function (err) {

	});
}, function($, module) {
	return {
		city : localStorage.getItem('visa-country'),
		visaList : [],
		pageIndex : 1,
		paixu : true,
		loadedFlag : false,
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
			return $.get('http://m.lvmama.com/api/router/rest.do?method=api.com.visa.product.search&firstChannel=TOUCH&secondChannel=LVMM&version=1.0.0', {
				pageSize : 20,
				pageIndex : index,
				provinceName : '上海',
				countryName : this.city
			});
		},
		goBack : function goBack () {
			history.go(-1);
		},
		toggleIcon : function toggleIcon (key) {
			this[key] = !this[key];
		},
		goVisaDetail : function goVisaDetail (productId, goodsId) {
			localStorage.setItem('visa-goodsId', goodsId);
			localStorage.setItem('visa-productId', productId);
			location.href = 'visaDetail.html#' + goodsId;
		}
	};
}, "#container"]);