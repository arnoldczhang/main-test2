'use strict'
var sprintInst = JSpring([function($scope) {
	;
}, function($) {
	$.extend(__INITIAL_STATE__, {
		toggleShow : function(evt, letter) {
			this.letterShowObj[letter] = !this.letterShowObj[letter];
		}
	});

	return __INITIAL_STATE__;
}, "#container"], {
	renderFn: __RENDER_FN
});