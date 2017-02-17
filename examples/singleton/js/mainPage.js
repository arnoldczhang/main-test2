
JSpring.addComponent('SearchInput', {
  data : 'word',
  template : '<div> <p> <label>上海</label> <input type="text" placeholder="请输入目的地/关键词/主题" :model="keyword"/> </p> </div>'
});

JSpring.addComponent('Swiper', {
  data : 'list',
  template : '<div class="swiper-container swiper-banner"> <div class="swiper-wrapper"> <div class="swiper-slide" :for="let swiper in list"> <a :href="\'visaDetail/\' + swiper.sub_object_id" :if="swiper.type == \'visa\'"> <img :attr="{\'src\' : swiper.large_image}" /> </a> <a :href="swiper.url" :if="swiper.type == \'url\'"> <img :attr="{\'src\' : swiper.large_image}" /> </a> </div> </div> <div class="pagination pagination1"></div> </div> '
});

JSpring.addComponent('Hot', {
  data : 'list',
  template : '<section> <p class="h-title"> <h3 class="hot-title">热门签证</h3> </p> <div class="hot-list"> <HotItem :component="item" :for="let item in list" class="hot-item" /> </div> </section>'
});

JSpring.addComponent('HotItem', {
  data : 'obj',
  template : '<span class="hot-item-span" :on="click:goVisaList(obj.content, obj.title)"> <img :attr="{\'src\' : obj.large_image}" :data="{\'url\' : obj.content, \'country\' : obj.title}"/> <span class="hot-item-span-title">{{obj.title}}</span> <span class="hot-item-span-price">¥{{obj.price}}元起</span> </span>'
});

JSpring.addComponent('Special', {
  data : 'list',
  template : '<section class="special-ct"> <p class="h-title"> <h3 class="hot-title special-title">本月特惠</h3> </p> <ul class="special-list"> <li :for="item in list" class="special-item" :on="click:goVisaDetail(item.object_id, item.sub_object_id)"> <span class="special-item-left"> <img :attr="{\'src\' : item.large_image}"> </span> <span class="special-item-right"> <p>{{item.title}}</p> <p class="special-desc f12">{{item.content}}   需提前{{item.market_price}}天提交材料</p> <p class="special-desc special-desc-price"> <i>¥</i> <i>{{item.price}}</i>起 </p> </span> </li> </ul> </section>'
});

var sprintInst = JSpring([function($scope, $, module, _this) {
	//异步初始化swiper
	_this.pushHook(function () {
		Swipe($('.swiper-banner').eq(0), {
			startSlide: $scope.startSlide, //起始幻灯片
			speed: 500, //滑动速度
			auto: 2e3, //滑动间隔
			continuous: true, //是否连续滑动
			pageEl: $('.pagination1').eq(0) //自定义圆点
		});
	});

	$scope.getInfo().then(function (res) {
		const data = res.datas;
		$.each(data, function (info, index) {

			if (info.tag_code == 'QZ_RM') {
				$scope.hotList = info.infos.slice(0, 9);
			}

			else if (info.tag_code == 'QZ_BANNER') {
				$scope.swiperList = info.infos;
			}

			else if (info.tag_code == 'QZ_TJ') {
			 	$scope.specialList = info.infos;
			 }
		});
		$scope.loadedFlag = true;
	}).catch(function (err) {

	});
}, function($, module) {
	return {
		getInfo : function () {
			return $.get('http://m.lvmama.com/bullet/index.php?s=/Api/getInfos&channelCode=QZ&firstChannel=TOUCH&format=json&lvsessionid=2d088a83-b6a3-474d-aeff-5637c87f65b8&secondChannel=LVMM&stationCode=SH&tagCodes=QZ_BANNER,QZ_SJ,QZ_GJ,QZ_TJ,QZ_WD,QZ_RM,HDTJ_SMALL,HDTJ_BIG&udid=adc5b78a-6dfe-4833-ac41-28e3f664e68e-uuid');
		},
		goVisaList : function goVisaList(pinyin, word) {
			localStorage.setItem('visa-country', word);
			location.href = 'visaList.html#' + pinyin;
		},
		goVisaDetail : function goVisaDetail(productId, goodsId) {
			localStorage.setItem('visa-goodsId', goodsId);
			localStorage.setItem('visa-productId', productId);
			location.href = 'visaDetail.html#' + goodsId;
		},
		loadedFlag : false,
		keyword : '上海123',
		startSlide : 1,
		swiperList : [],
		hotList : [],
		specialList : []
	};
}, "#container"]);