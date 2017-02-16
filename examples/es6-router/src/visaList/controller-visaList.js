export default ($scope, $, module, _this) => {
	$scope.getSearch().then((res) => {
		$scope.visaList = res.data.products;
		_this.pushHook(() => {
			$('.visaList-body').addClass('fadeIn');
		});
	}).catch((err) => {

	});
};