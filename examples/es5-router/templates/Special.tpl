<section class="special-ct">
	<p class="h-title">
		<h3 class="hot-title special-title">本月特惠</h3>
	</p>
	<ul class="special-list">
		<li :for="item in list" class="special-item" :on="click:goVisaDetail(item.object_id, item.sub_object_id)">
			<span class="special-item-left">
				<img :attr="{'src' : item.large_image}">
			</span>
			<span class="special-item-right">
				<p>{{item.title}}</p>
				<p class="special-desc f12">{{item.content}}   需提前{{item.market_price}}天提交材料</p>
				<p class="special-desc special-desc-price">
					<i>¥</i>
					<i>{{item.price}}</i>起
				</p>
			</span>
		</li>
	</ul>
</section>