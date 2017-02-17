<div id="mainPage">
	<header>
		<h2 class="title">签证首页</h2>
	</header>
	<article class="visa-home" :class="{'fadeIn' : loadedFlag}">
		<SearchInput :component="keyword" class="search-input" />
		<Swiper :component="swiperList" class="swiper-ct" />
		<Hot :component="hotList" class="hot-ct" />
		<p class="all-area-p">
			<label class="all-area">查看全部地区</label>
		</p>
		<Special :component="specialList" />
		<ul class="process">
		    <li class="arrow03"><span><img src="images/flow1_03.png" alt="">预定递交材料</span></li>
		    <li class="arrow03"><span><img src="images/flow2_03.png" alt="">材料审核</span></li>
		    <li class="arrow03"><span><img src="images/flow3_03.png" alt="">使馆办理</span></li>
		    <li><span><img src="images/flow4_03.png" alt="">出签领证</span></li>
		</ul>
	</article>
</div>