export const service = ($, module) => {
	return {
		obj : {
			name : 'abc'
		},
		aar : [{
			name : 'abc'
		}, {
			name : 'abcd'
		}],
		logObjName () {
			console.log(this.obj.name);
		},
		arr : [1, 2, 3],
		dataFn (el) {
			return {
				id : el + 'aaa',
				cityId : el + 'shanghai'
			}
		},
		styleObj : {
			backgroundColor : 'red'
		},
		classFn (el) {
			return {
				'aa bb' : el == 1,
				'cc dd' : el == 2,
				'ee' : el == 3,
				'ff' : el > 0
			};
		},
		attrFn (el) {
			return {
				name : 'name is ' + el
			};
		}
	};
};