<span class="hot-item-span" :on="click:goVisaList(obj.content, obj.title)">
	<img src="https://pics.lvjs.com.cn/pics/super/2017/02/1487237057_64537.jpg"
		:attr="{'src' : obj.large_image, 'title' : obj.title}" 
		:data="{'url' : obj.content, 'country' : obj.title}"/>
	<span class="hot-item-span-title">{{obj.title}}</span>
	<span class="hot-item-span-price">¥{{obj.price}}元起</span>
</span>