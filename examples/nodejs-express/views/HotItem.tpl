<span class="hot-item-span" :on="click:goVisaList(obj.content, obj.title)">
	<img :attr="{'src' : obj.large_image}" :data="{'url' : obj.content, 'country' : obj.title}"/>
	<span class="hot-item-span-title">{{obj.title}}</span>
	<span class="hot-item-span-price">¥{{obj.price}}元起</span>
</span>