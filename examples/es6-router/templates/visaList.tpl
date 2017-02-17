<div class="visaList">
	<header>
		<span class="back-btn" :on="click:goBack()"></span>
		<h2 class="title">{{city}}签证</h2>
	</header>
	<article class="visaList-body" :class="{'fadeIn' : loadedFlag}">
		<ul>
			<li :for="visa in visaList" class="visa-list" :on="click:goVisaDetail(visa.productBranchId, visa.goodsId)">
				<p>{{visa.productName}}</p>
				<p class="visa-grey"><img src="images/calendars.png" >需提前{{visa.map.visa_ahead_days}}天提交材料</p>
				<p>
					<span class="visa-grey"><img src="images/posi.png" >{{visa.map.visa_range}}</span>
					<span class="fr visa-price visa-grey">
						<i>¥</i>
						<i>{{visa.dailyLowestPrice}}</i>起
					</span>
				</p>
			</li>
		</ul>
	</article>
	<footer class="bottom">
		<span :style="filterStyleFn(paixu)"
			 :on="click:toggleIcon('paixu')">
			<img :src="{true : 'images/paixu.png', false : 'images/paixu1.png'}[paixu]">
			<label>筛选</label>
		</span>
		<span :style="filterStyleFn(quanbu)"
			 :on="click:toggleIcon('quanbu')">
			<img :src="{true : 'images/quanbu.png', false : 'images/quanbu1.png'}[quanbu]">
			<label>全部签证</label>
		</span>
		<span :style="filterStyleFn(changzhu)"
			 :on="click:toggleIcon('changzhu')">
			<img :src="{true : 'images/changzhu.png', false : 'images/changzhu1.png'}[changzhu]">
			<label>上海</label>
		</span>
	</footer>
</div>