<section>
	<p class="h-title">
		<h3 class="hot-title">热门签证</h3>
	</p>
	<div class="hot-list">
		<HotItem :component="item" :for="let item in list" class="hot-item" />
	</div>
</section>