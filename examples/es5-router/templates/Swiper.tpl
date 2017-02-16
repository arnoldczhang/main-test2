<div class="swiper-container swiper-banner">
    <div class="swiper-wrapper">
        <div class="swiper-slide" :for="let swiper in list">
            <a :href="'#/visaDetail/' + swiper.sub_object_id" :if="swiper.type == 'visa'">
                <img :attr="{'src' : swiper.large_image}" />
            </a>
            <a :href="swiper.url" :if="swiper.type == 'url'">
                <img :attr="{'src' : swiper.large_image}" />
            </a>
        </div>
    </div>
    <div class="pagination pagination1"></div>
</div>
