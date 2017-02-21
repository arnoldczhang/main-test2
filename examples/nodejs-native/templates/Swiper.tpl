<div class="swiper-container swiper-banner">
    <div class="swiper-wrapper">
        <div class="swiper-slide" :for="let swiper in list">
            <a :href="'visaDetail#' + swiper.sub_object_id" :if="swiper.type == 'visa'">
                <img src="https://pics.lvjs.com.cn/pics/super/2017/02/1487237057_64537.jpg" :attr="{'src' : swiper.large_image}" />
            </a>
            <a :href="swiper.url" :if="swiper.type == 'url'">
                <img src="https://pics.lvjs.com.cn/pics/super/2017/02/1487237057_64537.jpg" :attr="{'src' : swiper.large_image}" />
            </a>
        </div>
    </div>
    <div class="pagination pagination1"></div>
</div>
