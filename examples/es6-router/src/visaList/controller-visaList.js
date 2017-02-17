export default ($scope, $, module, _this) => {
	$scope.getSearch().then((res) => {
		$scope.visaList = res.data.products;
		$scope.loadedFlag = true;
	}).catch((err) => {

	});
};