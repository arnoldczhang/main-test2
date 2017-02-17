<!DOCTYPE html >
<html>
<head>
<title>签证首页</title>
<meta name="Keywords" content="签证首页"/>
<meta name="Description" content="签证首页"/>
{META}
<link rel="stylesheet" type="text/css" href="resources/main.css">
{CSS}
</head>
<body>
<script type="text/javascript" src="//pics.lvjs.com.cn/mobile/plugins/nativeJs/swipe/1.0/build.min.js?v=20161213"></script>
<script type="text/javascript" src="resources/main-test2.js"> </script>
<script type="text/javascript">
window.__RENDER_FN__ = {FN};
window.__TEMPLATE__ = {TEMPLATE};
window.__INITIAL_STATE__  = {MODEL};
</script>
<!--@ BODY -->
<div id="container">
  <div id="mainPage">
    <header>
      <h2 class="title">签证首页</h2>
    </header>
    <article class="visa-home" :class="{'fadeIn' : loadedFlag}">
      <SearchInput :component="keyword" class="search-input" ></SearchInput>
      <Swiper :component="swiperList" class="swiper-ct" ></Swiper>
      <Hot :component="hotList" class="hot-ct" ></Hot>
      <p class="all-area-p">
        <label class="all-area">查看全部地区</label>
      </p>
      <Special :component="specialList" ></Special>
      <ul class="process">
          <li class="arrow03"><span><img src="images/flow1_03.png" alt="">预定递交材料</span></li>
          <li class="arrow03"><span><img src="images/flow2_03.png" alt="">材料审核</span></li>
          <li class="arrow03"><span><img src="images/flow3_03.png" alt="">使馆办理</span></li>
          <li><span><img src="images/flow4_03.png" alt="">出签领证</span></li>
      </ul>
    </article>
  </div>
</div>
<!-- BODY @-->
{JS}
</body>
</html>