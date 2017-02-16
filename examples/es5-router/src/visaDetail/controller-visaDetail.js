module.exports = function ($scope, $, module, _this) {
	$scope.getVisaDetail().then(function (res) {
		const data = res.data;
		$.extend($scope.detail, {
			imgUrl : data.imageUrl,
			price : data.price,
			productName : data.productName,
			map : data.map
		});

		_this.pushHook(function () {
			$('.visaDetail-body').addClass('fadeIn');
		});
	}).catch(function (err) {

	});
};