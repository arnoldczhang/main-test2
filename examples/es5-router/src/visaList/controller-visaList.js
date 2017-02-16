module.exports = function ($scope, $, module, _this) {
	$scope.getSearch().then(function (res) {
		$scope.visaList = res.data.products;
		_this.pushHook(function () {
			$('.visaList-body').addClass('fadeIn');
		});
	}).catch(function (err) {

	});
};