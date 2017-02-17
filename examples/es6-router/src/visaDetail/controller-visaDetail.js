export default ($scope, $, module, _this) => {
	$scope.getVisaDetail().then((res) => {
		const data = res.data;
		$.extend($scope.detail, {
			imgUrl : data.imageUrl,
			price : data.price,
			productName : data.productName,
			map : data.map
		});
		$scope.loadedFlag = true;
	}).catch((err) => {

	});
};