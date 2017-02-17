
var sprintInst = JSpring([function($scope, $, module, _this) {
	$scope.getVisaDetail().then(function (res) {
		const data = res.data;
		$.extend($scope.detail, {
			imgUrl : data.imageUrl,
			price : data.price,
			productName : data.productName,
			map : data.map
		});
		$scope.loadedFlag = true;
	}).catch(function (err) {

	});
}, function($, module) {
	return {
		detail : {
			imgUrl : '',
			price : '',
			productName : '',
			map : {}
		},
		visaDetailFlag : true,
		needInfoFlag : false,
		reserveFlag : false,
		commentFlag : false,
		loadedFlag : false,
		currentPage : 1,
		pageSize : 10,
		goodsId : localStorage.getItem('visa-goodsId'),
		productId : localStorage.getItem('visa-productId'),
		goBack : function goBack () {
			history.go(-1);
		},
		toBr : function toBr (str) {
			return str.replace(/[2-9]+[、\.]/g,"<br />$&");
		},
		toggleTab : function toggleTab (flag) {
			this.visaDetailFlag = false;
			this.needInfoFlag = false; 
			this.reserveFlag = false; 
			this.commentFlag = false; 
			this[flag] = true;
		},
		getVisaDetail : function getVisaDetail () {
			return $.get('http://m.lvmama.com/api/router/rest.do?Ah5version=0.10192173861870768&h5Flag=Y&method=api.com.visa.product.getVisaDetails&version=1.0.0&firstChannel=TOUCH&secondChannel=LVMM', {
				goodsId : this.goodsId
			});
		}
	};
}, "#container"]);