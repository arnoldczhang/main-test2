/**
 * 
 * Virtual DOM Compiler
 *
 * ==Initialize==
 * Create `$scope` to watch modify
 * Generate Virtual DOM, analyze the expression
 * Extend the `$scope` as `scope` on Virtual DOM from the instance in sequence
 * Generate DOM from Virtual DOM
 * Mount the DOM
 *
 *
 * @author Arnold.Zhang
 *
 */
"use strict"
const fs = require('fs');
let template;
const 
 	OBJ = {}
 	, ARRAY = []
 	, STRING = ''
 	, SPACE = ' '
 	, UNIQ = 'LVMM'

 	, arrProto = Array.prototype
 	, $apply = Function.prototype.apply
 	, $replace = STRING.replace
 	, $split = STRING.split
 	, $lower = STRING.toLowerCase
 	, $substr = STRING.substr
 	, $defProp = Object.defineProperty
 	, $create = Object.create
 	, $keys = Object.keys
 	, $toString = OBJ.toString
 	, $slice = ARRAY.slice
 	, $push = ARRAY.push
 	, $shift = ARRAY.shift
 	, $splice = ARRAY.splice

 	, $stringify = JSON.stringify
 	, emptyDataObj = $create(null)
 	;
 
 emptyDataObj.data = $create(null);

 /**
  * LOG
  **/

 const LOG = {
 	$errQ : [],

 	info () {
 		$apply.call(console.log, console, arguments);
 	},

 	warn () {
 		$apply.call(console.warn, console, arguments);
 	},

 	error () {
 		$apply.call(console.error, console, arguments);
 	},

 	clearLog () {
 		this.$errQ = [];
 	},

 	warnStack (vObj, scope, template) {
 		this.$errQ = ['Fail to analyze template : \n' + template];
 		this.pushStack(vObj, scope).trigger();
 	},

 	pushStack (vObj, scope) {

 		if (!vObj.isElem) {
 			return;
 		}

 		const 
 			_this = this
 			, uniqKeys = vObj.uniqKeys
 			, uL = uniqKeys.length
 			, children = vObj.children
 			;

 		if (uL) {
 			_.each(uniqKeys, function uKEach (key) {
 				var attr = vObj.uniqAttrs[key];

 				if (isOnAttr(key)) {
 					attr = attr.replace(REGEXP.uniqColonRE, STRING);
 				}
 				makeGetterFn(attr, function (expr) {
 					_.push(_this.$errQ, 'unexpected expression : ' + expr);
 				});
 			});
 		}
 		children.length && _.each(children, function childrenEach (child) {
 			LOG.pushStack(child, scope);
 		});
 		return _this;
 	},

 	trigger () {
 		this.warn(this.$errQ.join('\n'));
 		this.clearLog();
 	}
 };


 /**
  * WARN
  **/
 const WARN = {
 	format (attr) {
 		return 'not match the format of {1}'
 			.replace(/\{\d\}/g, attr);
 	},
 	container : 'the viewport haven`t found the container to place in'
 };


 /**
  * REGEXP
  **/
 const REGEXP = {
 	bodyRE : /(<!--@ BODY -->)([\s\S]+)(<!-- BODY @-->)/,
 	startEndAngleRE : /((?:\s|&[a-zA-Z]+;|<!\-\-@|[^<>]+)*)(<?(\/?)([^!<>\-\/\s]+)(?:\s*[^\s=\/>]+(?:="[^"]*"|'[^']*'|)|)+\s*>?)(?:\s*@\-\->)?/g,
 	noEndRE : /^(?:input|br|img|link|hr|base|area|meta|embed|frame)$/,
 	attrsRE : /\s+([^\s=<>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s<>]+))/g,
 	routeParamREG : /\:([^\:\-\.]+)/g,
 	curveRE : /\(([^\(\)]+)\)/g,
 	uniqNoteRE : /<!\-\-@\s*([^@]+)\s*@\-\->/g,
 	noteRE : /<!\-\-[^@](.|\r|\n)+?[^@]\-\->/g,
 	commentRE : /\s*<!--\s*|\s*-->\s*/g,
 	uniqLeftNoteRE : /<!\-\-@/g,
 	errMsgRE : / is not defined/,
 	rhashcodeRE : /\d\.\d{4}/,
 	uniqRE : /(?:lv-|:)([^-:]+)/,
 	squareRE : /\[([^\[\]]+)\]/,
 	brackRE : /\[([^\[\]]+)\]/,
 	boolClassRE : /\{(?:true|false)\s*:[^{}]+\}\[[^\[\]]+\]/,
 	objRE : /\{['"]?([^:()]+['"]?\s*\:\s*[^,],?\s*)+\}/,
 	styleRE : /([a-zA-Z]+):([^:;]+)/g,
 	forRE : /\:for/g,
 	ifRE : /(?:lv-|:)if/g,
 	onRE : /(?:lv-|:)on/g,
 	modelRE : /(?:lv-|:)model/g,
 	onlySpaceRE : /^\s*$/,
 	classRE : /\bclass=['"]([^'"]*)['"]/,
 	styleMRE : /\bstyle=['"]([^'"]*)['"]/,
 	textBindRE : /\{\{((?!\{\{)[\s\S])+\}\}/g,
 	uniqColonRE : /[^\s]+\s*\:\s*/,
 	forExpRE : /(?:let\s+|var\s+|)([^\.\s]+)\s+(?:in|of)\s+([^\s]+)(?:\s+trackBy\s+([^\s]+)|)/,
 	onExpRE : /['"]?([^'"{}:()\s,]+)['"]?\s*\:\s*([^():]+)\s*\(([^()]*)\)/g,
 	lineRE : /\\n|\\r|\\t|\s/g,
 	nextLRE : /\\n|\\r|\\t/g,
 	spaceRE : /\s+/g,

 	exec (regExp, word) {
 	  var result = regExp.exec(word);
 	  regExp.lastIndex = 0;
 	  return result;
 	},

 	test (regExp, word) {
 	  var result = regExp.test(word);
 	  regExp.lastIndex = 0;
 	  return result;
 	},

 	replace (word, regExp, regBack) {
 	  return optimizeCb($replace, word, regExp, regBack);
 	}
 };


/**
  * NODETYPE
  **/
 const NODETYPE = {
	Element : 1,
	Attr : 2,
	Text : 3,
	Comment : 8,
	Document : 9,
	DocumentFragment : 11
};

/**
 * _
 **/
const _ = {
	isNaN (value) {
		return _.isNumber(value) && value != value;
	},

	uniqPush (arr, child) {
		if (_.isArray(arr)) {
			return !_.inArray(arr, child) && _.push(arr, child);
		}
		return false;
	},

	replaceEscapeWord (text) {
		return text.replace(/&nbsp;/g, '\u00A0')
			.replace(/&quot;/g, '"')
			.replace(/&amp;/g, '&')
			.replace(/&gt;/g, '>')
			.replace(/&lt;/g, '<');
	},

	toBool (value) {
		return !!value;
	},

	lower (string) {
		return string.toLowerCase
			&& string.toLowerCase();
	},

	push (arr, child) {

		if (this.isArray(arr)) {
			arr[arr.length] = child;
		}
		return arr;
	},

	replace (newChild, child, parent) {
		let index = this.indexOf(parent, child);

		if (index > -1) {
			return $splice.call(parent, index, 1, newChild);
		}
	},

	prev (arr) {

		if (arr.shift) {
			return arr.shift();
		}
		return null;
	},

	attr (el, key, value) {

		if (this.isVoid0(value)) {
			return el.getAttribute(key);
		}

		el.setAttribute(key, value);
	},

	attrTpl (el, key, value) {
		el.start += ' ' + key + '="' + value + '"';
	},

	indexOf (arr, obj, strict) {
		let i = arr.length;

		if (!strict) {

			while (i--) {
				if (arr[i] == obj) return i;
			}
		} else {

			while (i--) {
				if (arr[i] === obj) return i;
			}
		}
		return -1;
	},

	inArray (arr, child) {

		if (this.isArray(arr)) {
			return !!~this.indexOf(arr, child);
		}
		return !!~this.indexOf(this.toArray(arr), child);
	},

	toArray (arrayLikeObj) {
		let
			 arr = []
			 , len
			 ;

		if (len = arrayLikeObj.length) {

			for (let i = 0; i < len; ++i) {
				arr[i] = arrayLikeObj[i];
			}
		}
		return arr;
	},

	extend (source ,target) {

		for (let key in target) {
			source[key] = target[key];
		}
		return source;
	},

	isVoid0 (value) {
		return value == void 0;
	},

	each (arr, callback) {
		let 
			result
			, attrArr
			, key
			, l
			, i = -1;

		if (arr && (l = arr.length)) {

			while (++i < l) {
				
				if (!this.isVoid0(result = callback(arr[i], i, arr))) {
					return result;
				}
			}
		} else if (this.isObject(arr)) {
			attrArr = $keys(arr);
			l = attrArr.length;

			while (++i < l) {
				key = attrArr[i];

				if (!this.isVoid0(result = callback(arr[key], key, arr))) {
					return result;
				}
			}
		}
	},

	flattenArr (arr) {
		let 
			_this = this
			, tmpArr = []
			;

		if (_this.isArray(arr)) {
			_this.each(arr, (el) => {

				if (_this.isArray(el)) {
					$push.apply(tmpArr, _this.flattenArr(el));
				} else {
					_this.push(tmpArr, el || {});
				}
			});
		}
		return tmpArr;
	}
};

_.each($split.call('Function Object Array Undefined Null Number String  Boolean File Blob FormData', REGEXP.spaceRE), (el, i, arr) => {
	_['is' + el] = (obj) => {
		return $toString.call(obj) == '[object ' + el + ']';
	};
});

_.each(NODETYPE, (nodeType, key) => {
	_['is' + key] = (obj) => {
		return obj.nodeType == nodeType;
	};
});

/**
 * VNode
 **/
class VNode {
	constructor (tagName, data, children, props) {

		const _this = this;
		_this.tagName = tagName;
		_this.data = data;
		_this.children = children;
		_this.isElem = true;

		if (props) {
			_.each(props, (prop, key) => {
				_this[key] = prop;
			});
		}
		return _this;
	}
}

const publicGen = (value) => {
	return value;
	// value = value.replace(REGEXP.brackRE, function(match, $1) {
	// 	return '[' + '\'"+' + $1  + '+"\']';
	// });
	// return '"' + value + '"';
};

const  
	genText = publicGen 
	, genHtml = publicGen
	;

const genModel = (value) => {
	return '[' + $stringify(value) + ', ' + value + ']';
};

const genIf = (value) => {
	return '!!(' + value + ')';
};

const genOn = (value) => {
	var 
		match
		, tmpArr = []
		, formatFlag = false
		;
	
	while (match = REGEXP.onExpRE.exec(value)) {
		formatFlag = true;
		_.prev(match);
		match[0] = '"' + match[0] + '"';
		_.push(tmpArr, '[' + match.toString() + ']');
	}
	return formatFlag
		? '[' + tmpArr.join(', ') + ']'
		: (WARN.format('on'), STRING);

	// value = value.replace(REGEXP.curveRE, function(match, $1) {
	// 	let 
	// 		arr = $1.split(',')
	// 		,str = ''
	// 		;
	// 	arr.forEach(function(el) {
	// 		str += '\'"+' + el + '+"\',';
	// 	});
	// 	return '(' + str.substring(0, str.length - 1) + ')';
	// });
	// return '"' + value + '"';
}

const genFor = (vObj, attrStr) => {
	let 
		match
		, children = vObj.children
		;
			
	if (match = vObj.isFor.match(REGEXP.forExpRE)) {
		return '__j._mp(' + match[2] + ', function(' + match[1] + ', '
			+ (match[3] || '$index') + ') {'
			+ 'return __j._n(\"' + vObj.tagName + '\", ' + attrStr + ', '
			+ getChildResult(children)
			+ ');'
			+ '})';
	}
	return WARN.format('for'), STRING;
};

const  
	genShow = genIf
	, genHide = genIf
	, genToggle = genIf
	;

const genClass = (value) => {

	if (REGEXP.boolClassRE.test(value)) {
		return value.replace(REGEXP.squareRE, "[!!($1)]");
	}
	return value;
};

const 
	genStyle = genClass
	, genAttr = genClass
	, genSrc = genClass
	, genData = genClass
	, genHref = genClass
	;

const vShow = (el, value) => {
	let matchArr;

	if (value) {

		if (matchArr = el.start.match(REGEXP.styleMRE)) {
			el.start = el.start.replace(REGEXP.styleMRE, 'style="' + matchArr[1] + ';display:block;"');
		} else {
			el.start += ' style="display:block;"';
		}
	} else {

		if (matchArr = el.start.match(REGEXP.styleMRE)) {
			el.start = el.start.replace(REGEXP.styleMRE, 'style="' + matchArr[1] + ';display:none;"');
		} else {
			el.start += ' style="display:none;"';
		}
	}
};

const vHide = (el, value) => {
	return vShow(el, !value);
};

const vToggle = (el, value) => {
	return vShow(el, value);
};

const vIf = (el, value, vNode) => {
	
	if (!value) {
		el.start = '<!-- ' + el.start;
	}
};

const vClass = (el, value, vNode) => {
	let 
		reg
		, matchArr
		;

	if (_.isObject(value)) {
		value = convertObjToValue(value, ' ');
	}

	if (matchArr = el.start.match(REGEXP.classRE)) {
		el.start = el.start.replace(REGEXP.classRE, 'class="' + matchArr[1] + ' ' + value + '"');
	} else {
		el.start += ' class="' + value + '"';
	}
};

const vStyle = (el, value, vNode) => {
	let 
		keyArr
		, matchArr
		, str = ''
		;

	if (_.isObject(value)) {
		keyArr = $keys(value);

		if (keyArr.length) {
			
			if (_.isBoolean(value[keyArr[0]])) {
				value = convertStyleStrToObj(convertObjToValue(value, ';'));
				keyArr = $keys(value);
			}
		}
	} else {
		value = convertStyleStrToObj(value);
		keyArr = $keys(value);
	}

	_.each(keyArr, (key, i) => {
		str += unCamel(key) + ':' + value[key] + ';';
	});

	if (matchArr = el.start.match(REGEXP.styleMRE)) {
		el.start = el.start.replace(REGEXP.styleMRE, 'style="' + matchArr[1] + ';' + str + '"');
	} else {
		el.start += ' style="' + str + '"';
	}
};

const vAttr = (el, value, vNode) => {
	let 
		keyArr
		;

	if (!_.isObject(value)) {
		value = convertStyleStrToObj(value);
	}

	keyArr = $keys(value);
	_.each(keyArr, (key, i) => {
		el.start += ' ' + key + '="' + value[key] + '"';
	});
};

const vSrc = (el, value, vNode) => {
	el.start += ' src="' + value + '"';
};

const vHref = (el, value, vNode) => {
	el.start += ' href="' + value + '"';
};

const vOn = (el, value, vNode) => {
	return;
	// el.start += ' :on="' + value + '"';
};

const vText = (el, value) => {
	el.content = value;
	// el.start += ' :text="' + value + '"';
};

const vHtml = (el, value) => {
	el.content = value;
	// el.start += ' :html="' + value + '"';
};

const vModel = (el, value) => {
	return;
	// el.start += ' :model="' + value + '"';
};

const vData = (el, value) => {
	return;
	// el.start += ' :data="' + value + '"';
};

//自定义属性
const attr = {
	text : 1,
	html : 1,
	show : 1,
	hide : 1,
	toggle : 1,
	'if' : 1,
	'class' : 1,
	on : 1,
	model : 1,
	style : 1,
	attr : 1,
	src : 1,
	data : 1,
	href : 1
};

//自定义属性优先级
const prio = {
	text : 200,
	html : 200,
	show : 200,
	hide : 200,
	toggle : 200,
	'if' : 300,
	'class' : 200,
	on : 100,
	model : 200,
	style : 100,
	attr : 100,
	src : 100,
	data : 100,
	href : 100
};

//自定义属性字符串解析
const gen = {
	'for' : genFor,
	text : genText,
	html : genHtml,
	show : genShow,
	hide : genHide,
	toggle : genToggle,
	'if' : genIf,
	'class' : genClass,
	on : genOn,
	model : genModel,
	style : genStyle,
	attr : genAttr,
	src : genSrc,
	data : genData,
	href : genHref
};

//自定义属性对应处理方法
const direct = {
	text : vText,
	html : vHtml,
	show : vShow,
	hide : vHide,
	toggle : vToggle,
	'if' : vIf,
	'class' : vClass,
	on : vOn,
	model : vModel,
	style : vStyle,
	attr : vAttr,
	src : vSrc,
	data : vData,
	href : vHref
};

const isForAttr = (attribute) => {
	return REGEXP.test(REGEXP.forRE, attribute);
};

const isIfAttr = (attribute) => {
	return REGEXP.test(REGEXP.ifRE, attribute);
};

const isModelAttr = (attribute) => {
	return REGEXP.test(REGEXP.modelRE, attribute);
};
const unCamel = (val) => {
	return val.replace(/([A-Z])/g, '-$1')
		.toLowerCase();
};

function optimizeCb (func, context) {
	var 
		args = arguments
		, collection = args[2]
		;

	return func.apply(context, _.isArray(collection) 
		? collection 
		: $slice.call(args, 2));
};

const getNonMatchReg = (value) => {
	return new RegExp('\\s*(?:' 
		+ value.replace(REGEXP.spaceRE, '|') 
		+ ')\\b', 'g');
};

const appendVObjChildren = (parent, vObj) => {
	_.push(parent.children, vObj);
	vObj.parentVObj = parent;
};

const createVObj = (tagName, html) => {
	let 
		attrMatch
		, attrKey
		, attrValue
		, uniqAttrs = $create(null)
		, staticAttrs = $create(null)
		, isStatic = true
		, isFor = false
		, isNeedRender = false
		, match
		;

	while ((attrMatch = REGEXP.attrsRE.exec(html)) != null) {
		attrKey = attrMatch[1];
		attrValue = !_.isVoid0(attrMatch[2]) 
			? attrMatch[2] 
			: !_.isVoid0(attrMatch[3]) 
			? attrMatch[3] 
			: attrMatch[4] || '';

		if (match = attrKey.match(REGEXP.uniqRE)) {
			uniqAttrs[match[1]] = _.replaceEscapeWord(attrValue);
			isStatic = false;

			if (isForAttr(attrKey)) {
				isFor = attrValue;
			}

			if (isIfAttr(attrKey) || isModelAttr(attrKey) || isOnAttr(attrKey)) {
				isNeedRender = true;
			}
		} else {
			staticAttrs[attrKey] = attrValue;
		}
	}
	return {
		tagName : tagName,
		staticAttrs : staticAttrs,
		staticKeys : $keys(staticAttrs),
		uniqAttrs : uniqAttrs,
		uniqKeys : $keys(uniqAttrs),
		children : [],
		isElem : true,
		isFor : isFor,
		isNeedRender : isNeedRender,
		isStatic : isStatic,
		nodeType : 1
	};
};

const createVCommentObj = (comment, parentVObj) => {
	return {
		isElem : false,
		isStatic : false,
		nodeType : 8,
		data : STRING,
		textContent : REGEXP.replace(comment, REGEXP.commentRE, STRING)
	};
};

const createVTextObj = (text, parentVObj) => {
	let hasBrace = text.match(REGEXP.textBindRE) || false;
	return {
		isElem : false,
		nodeType : 3,
		hasBrace : hasBrace,
		textContent : _.replaceEscapeWord(text)
	};
};

const genVNodeExpr = (vObj) => {
	let 
		data = getVObjData(vObj)
		, children = vObj.children
		, text
		;

	if (_.isElement(vObj)) {

		if (!vObj.isStatic) {
			return genUniqVNodeExpr(vObj);
		}
		return '__j._n(\"'
			+ vObj.tagName + '\", '
			+ $stringify(data) + ', '
			+ getChildResult(children)
			+ ')';
	} else {
		text = data.textContent;

		if (_.isText(vObj)) {

			if (vObj.hasBrace) {
				return '__j._tn(' + replaceExpr($stringify(text), vObj.hasBrace) +', true)';
			}
			return '__j._tn(' + $stringify(text) + ')';
		} else if(_.isComment(vObj)) {
			return '__j._cn(\"' + text + '\")';
		}
	}	
};

const genUniqVNodeExpr = (vObj) => {
	let 
		children = vObj.children
		, uniqKeys = vObj.uniqKeys
		, staticKeys = vObj.staticKeys
		, res = '{'
		;

	if (staticKeys.length) {
		res += 'static:{';
		_.each(staticKeys, (key) => {
			res += key + ':\"' + vObj.staticAttrs[key] + '\",'
		});
		res += '},';
	}

	if (uniqKeys.length) {
		res += 'uniq:{';
		_.each(vObj.uniqKeys, (key) => {

			if (attr[key]) {
				res += '\"' + key + '\" : ' + gen[key](vObj.uniqAttrs[key]) + ',';
			}
		});
		res += '}';
		res += ',"isFor":' + !!vObj.isFor;
		res += ', "isNeedRender":' + !!vObj.isNeedRender;
	}
	res += '}';

	if (vObj.isFor) {
		return genFor(vObj, res);
	}

	return '__j._n(\"' 
		+ vObj.tagName 
		+ '\", ' 
		+ res + ', '
		+ getChildResult(children)
		+ ')';
};

const getVObjData = (obj) => {

	if (_.isElement(obj)) {
		let data = {};

		if (obj.uniqKeys.length) {
			data.uniq = obj.uniqAttrs;
		}

		if (obj.staticKeys.length) {
			data.static = obj.staticAttrs;
		}
		return data;
	}
	return {
		nodeType : obj.nodeType,
		textContent : obj.textContent
	};
};

const getChildResult = (children) => {
	return children.length 
		? '[' + getMapResult(children, genVNodeExpr) + ']' 
		: '[]';
};

const getStrValue = (str) => {

	if (_.isVoid0(str)) {
		return '';
	}
	return str;
};

const getMapResult = (arrObj, cb) => {
	let 
		result = []
		, index = -1
		, length
		, arrKey
		;

	if (_.isArray(arrObj) || _.isString(arrObj)) {
		length = arrObj.length;

		while (++index < length) {
			result[index] = cb(arrObj[index], index);
		}
	} else if (_.isObject(arrObj)) {
		arrKey = $keys(arrObj);
		length = arrKey.length;

		while (++index < length) {
			result[index] = cb(arrObj[arrKey[index]], arrKey[index]);
		}
	}
	return result;
};

const replaceExpr = (template, exprArr) => {
	template = template.replace(REGEXP.lineRE, SPACE);
	_.each(exprArr, (expr) => {
		expr = expr.replace(REGEXP.lineRE, SPACE);
		let exprVar = expr.substring(2, expr.length - 2);
		template = template.replace(expr, '" + __j._v(' + exprVar + ') + "');
	});
	return template;
};

function makeGetterFn (body, callback) {
	try {
		return new Function('__j', body + ';');
	} catch (e) {

		if (!_.isFunction(callback)) {
			return noop;
		}
		return callback(body);
	}
};

const noop = () => {
	return false;
};

const isOnAttr = (attribute) => {
	return REGEXP.test(REGEXP.onRE, attribute);
};

const createVNode = (tag, data, children) => {
	data = data || {};
	children = _.flattenArr(children || []);
	
	let 
		_this = this
		, vNode
		, uniq = data.uniq
		, cach = _this.cach
		, key
		, isStatic = true
		;

	if (uniq) {
		isStatic = false;
		data.uKeys = $keys(uniq).sort((a, b) => {
			return prio[b] - prio[a];
		});
	}

	vNode = new VNode(tag, data, children, {
		isFor : !!data.isFor,
		isNeedRender : !!data.isNeedRender,
		isStatic : isStatic,
		scope : _this.$scope
	});

	children.length && _.each(children, (child) => {
		child.parentVNode = vNode;
	});
	return vNode;
};

const createVTextNode = (text, hasBrace) => {
	return {
		isElem : false,
		nodeType : 3,
		isStatic : !hasBrace,
		data : STRING,
		textContent : text
	};
};

const createElFn = (tagName) => {
	let obj;
	if (!REGEXP.noEndRE.test(tagName)) {
		obj = {
			start : '<' + tagName,
			end : '</' + tagName + '>'
		};
	} else {
		obj = {
			start : '<' + tagName,
			end : ''
		};
	}
	return obj;
};


const createTextFn = (text) => {
	return {
		start : text,
		end : ''
	};
};

const createCommentFn = createTextFn;

const createElem = (vNode, instance) => {
	let 
		el
		, data = vNode.data
		;

	if (vNode.isElem) {
		el = createElFn(vNode.tagName);
		data.static && _.each(data.static, (value, key) => {
			_.attrTpl(el, key, value);
		});

		if (data.uniq) {
			_.each(data.uKeys, (key) => {
				optimizeCb(direct[key], instance, el, data.uniq[key], vNode);
			});

			if (_.inArray(data.uKeys, 'if')) {
				el.end += data.uniq['if'] ? '' : ' -->';
			}
		}
		el.start += (!REGEXP.noEndRE.test(vNode.tagName) ? '>' : ' />') + (el.content || '');
	} else {
		let textCt = vNode.textContent;

		if (_.isText(vNode)) {
			el = createTextFn(textCt);
		} else {
			el = createCommentFn(textCt);
		}
	}
	return el;
};

const convertObjToValue = (obj, separator) => {
	let tmpArr = [];
	if (_.isObject(obj)) {
		_.each(obj, (value, key) => {
			value && _.push(tmpArr, key);
		});
	}

	if (arguments.length > 1) {
		return tmpArr.join(separator);
	}
	return tmpArr;
};

const convertStyleStrToObj = (str) => {
	let 
		attrMatch
		, styleObj = $create(null)
		;

	while ((attrMatch = REGEXP.styleRE.exec(str)) != null) {
		styleObj[attrMatch[1]] = attrMatch[2];
	}
	return styleObj;
};

const createScript = (jsArr) => {

	let str = '';

	if (_.isString(jsArr)) {
		jsArr = [jsArr];
	}

	_.each(jsArr, (js) => {
		str += '<script type="text/javascript" src="' + js + '"> </script>';
	});
	return str;
};

const createLink = (linkArr) => {
	let str = '';

	if (_.isString(linkArr)) {
		linkArr = [linkArr];
	}

	_.each(linkArr, (css) => {
		str += '<link rel="stylesheet" type="text/css" href="' + css + '">';
	});
	return str;
};


const Compiler = {

	render (url, model, opts) {
		this.start = Date.now();
		template = fs.readFileSync(url, 'utf8');
		this.outerHTML = '';
		this.redis = opts.redis;
		this.vNodeTemplate = opts.vNodeTpl;
		this.js = createScript(model.js || []);
		this.css = createLink(model.css || []);
		this.template = template.match(REGEXP.bodyRE)[2];
		template = template.replace(REGEXP.bodyRE, '$1BODY$3');
		this.$scope = model || {};
		return this.init();
	},

	init () {
		return this.analyzeHtml()
			.renderVNode()
			.transferVNode()
			.renderTpl();
	},

	analyzeHtml () {
		let 
			_this = this
			, match
			, tagAndSpaceHtml
			, tagHtml
			, spaceOrNote
			, isEndTag
			, isNoEndTag
			, tagName
			, parentTag = null
			, vObj
			, scope
			;

		if (_this.vNodeTemplate) {
			console.log('compile cach : ' + (Date.now() - this.start) + 'ms');
			return _this;
		}

		while (match = REGEXP.startEndAngleRE.exec(_this.template)) {
			tagAndSpaceHtml = match[0];
			spaceOrNote = match[1];
			tagHtml = match[2];
			tagName = _.lower(match[4]);
			isEndTag = _.toBool(match[3]);
			isNoEndTag = REGEXP.noEndRE.test(tagName);
			vObj = createVObj(tagName, tagHtml);

			if (REGEXP.test(REGEXP.uniqLeftNoteRE, spaceOrNote)) {
				parentTag && appendVObjChildren(parentTag, createVCommentObj(tagAndSpaceHtml, parentTag));
				continue;
			}

			if (parentTag) {
				!REGEXP.test(REGEXP.onlySpaceRE, spaceOrNote) && appendVObjChildren(parentTag, createVTextObj(spaceOrNote, parentTag));
				!isEndTag && appendVObjChildren(parentTag, vObj);
				parentTag = isEndTag 
					? parentTag.parentVObj 
					: !isNoEndTag
					? vObj
					: parentTag;
			} else {
				parentTag = _this.vObj = vObj;
			}
		}
		console.log('compile norm : ' + (Date.now() - this.start) + 'ms');
		return _this;
	},

	analyzeTplStr () {
		return 'with(this.$scope){ return ' 
			+ (this.vObj 
			? genVNodeExpr(this.vObj) 
			: '__j._n("div")') 
			+ ';}';
	},

	renderVNode () {
		let 
			_this = this
			;

		try {
			_this.vNodeTemplate = _this.vNodeTemplate || _this.analyzeTplStr();
			_this.renderFn = makeGetterFn(_this.vNodeTemplate);

			if (_this.renderFn == noop) {
				return LOG.warnStack(_this.vObj, _this.$scope, _this.template), _this;
			}
			_this.vNode = _this.renderFn.call(_this, _this);
		} catch(err) {
			return LOG.warn('TIP : ' + err.message), _this;
		}
		return _this;
	},

	transferVNode (vNode) {
		vNode = vNode || this.vNode;
		let 
			_this = this
			, node = createElem(vNode, _this)
			, children
			;

		this.outerHTML += node.start;
		children = vNode.children || [];
		children.length && _.each(children, (child) => {
			_this.transferVNode(child);
		});
		this.outerHTML += node.end;
		return _this;
	},

	clearNoUseAttr () {

		if (this.redis)  {
			this.redis.set('mainPageVNodeTpl', this.vNodeTemplate, (err, reply) => {
				console.log('redis has cach the mainPage vNode template');
			});
			this.redis.expire('mainPageVNodeTpl', 10);
		}

		delete this.vObj;
		delete this.template;
		delete this.vNodeTemplate;
	},

	renderTpl () {
		// console.log(this.vNodeTemplate);
		// console.log(this.outerHTML);
		let tpl = template
			.replace(/\{MODEL\}/g, $stringify(this.$scope))
			.replace(/\{FN\}/g, "new Function('__j', '" 
				+ this.vNodeTemplate
					.replace(/'/g, '"')
					.replace(REGEXP.nextLRE, '') 
				+ "');")
			.replace(REGEXP.bodyRE, this.outerHTML)
			.replace(/\{JS\}/, this.js)
			.replace(/\{CSS\}/, this.css);
		this.clearNoUseAttr();
		return tpl;
	}

};

_.extend(Compiler, {
	_n : createVNode,
	_tn : createVTextNode,
	_cn : createVCommentObj,
	_mp : getMapResult,
	_v : getStrValue
});

module.exports = Compiler;

//test case
// Compiler.render('templates/mainPage.lv', {
// 	nameArr: ['1aaa', '2bbb', '3aaa', '4bbb'],
// 	styleObj : {
// 		backgroundColor : 'red'
// 	},
// 	cc : 'aaabbb',
// 	attrObj: {
// 		src: 'abc'
// 	},
// 	toggleIf : "",
// 	nameIndexArr : [1,2,3,4],
//         	styleStr : 'color:pink;fontSize:14px;',
// }, {}, {layout:'index.html'});
// var tar = [];
// while((tar = REGEXP.attrsRE.exec(`
// 	<div :for="let el in nameArr" style="display:block;" class="dd   ccc" 
//       :class="{true: 'active', false : 'unactive'}[nameArr.length < 1]"
//       :if="nameArr.length < 10"
//       :on="click:toggleIf(el, $index)"
//       disabled
//       checked="1">
//                   <h1>a    {{el}}   a</h1>
//                   <h2 :text="nameIndexArr[$index]"></h2>
//     </div>
// 	`)) != null) {
// 	console.log(tar)
// }