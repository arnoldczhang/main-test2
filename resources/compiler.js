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
let TEMPLATE;
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
 	, $parse = JSON.parse
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
 			_.each(uniqKeys, (key) => {
 				var attr = vObj.uniqAttrs[key];

 				if (isOnAttr(key)) {
 					attr = attr.replace(REGEXP.uniqColonRE, STRING);
 				}
 				makeGetterFn(attr, (expr) => {
 					_.push(_this.$errQ, 'unexpected expression : ' + expr);
 				});
 			});
 		}
 		children.length && _.each(children, (child) => {
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
 	startEndAngleRE : /((?:\s|&[a-zA-Z]+;|<!\-\-@|[^<>]+)*)(<?(\/?)([^!<>\/\s]+)(?:\s*[^\s=\/>]+(?:="[^"]*"|='[^']*'|=[^'"\s]+|)|)+\s*\/?>?)(?:\s*@\-\->)?/g,
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
 	compRE : /(?:lv-|:)component/g,
	compSetRE : /<[^\/]+\/>/,
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
 	capitalRE : /[A-Z]/g,
 	modelRE : /\{MODEL\}/g,
 	fnRE : /\{FN\}/g,
 	jsRE : /\{JS\}/,
 	cssRE : /\{CSS\}/,
 	metaRE : /\{META\}/,
 	templateRE : /\{TEMPLATE\}/,

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
	lower (string) {
		return string.toLowerCase
			&& string.toLowerCase();
	},

	capitalLower (str) {
		return REGEXP.replace(str, REGEXP.capitalRE, (match) => {
			return '-' + $lower.call(match);
		});
	},

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
			.replace(/&lt;/g, '<')
			.replace(/&reg;/g, '®')
			.replace(/&trade;/g, '™')
			.replace(/&copy;/g, '©')
			.replace(/&times;/g, '×')
			.replace(/&divide;/g, '÷')
			.replace(/&yen;/g, '¥');
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

		} 

		else {

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

		} 

		else if (this.isObject(arr)) {
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
				} 

				else {
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
};

const  
	genText = publicGen 
	, genHtml = publicGen
	, genIndex = publicGen
	, genParent = publicGen
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
}

const genFor = (vObj, attrStr, inst) => {
	let 
		match
		, children = vObj.children
		, str
		, parent
		, index
		;
			
	if (match = vObj.isFor.match(REGEXP.forExpRE)) {
		index = match[3];
		parent = match[2];
		str = '__j._mp(' + parent + ', function(' + match[1] + ', '
			+ (index || '$index') + ', $this, $first, $last) {';

		if (!vObj.isComponent) {
			str += 'return __j._n(\"' + vObj.tagName + '\", ' + attrStr + ', '
				+ getChildResult(children, inst)
				+ ');';
		}

		else {
			str += 'return ' 
				+ genComponent(vObj, attrStr, inst, parent, index || '$index');
		}

		str += '}, __j)';
		return str;
	}
	return WARN.format('for'), STRING;
};

const genComponent = (vObj, attrStr, inst, parent, index) => {
	var 
		tagName = vObj.tagName
		, component = Compiler.component[tagName || 'div']
		, componentData
		;

	if (component) {
		componentData = vObj.isComponent;
		parent = parent || componentData;
		component.vObj = inst.analyzeHtml(component.template);
		component.vTpl = genVNodeExpr(component.vObj, 0, inst);
		component.props = component.props || {};
		component.$scope = component.props;
		_.push(vObj.children, component.vObj);
		return component.vTpl = '(function('
			+ component.data
			+ ', '
			+ (component.index || '$index')
			+ ', '
			+ (component.parent || '$parent')
			+ ') { with(__j._cp["'
			+ tagName
			+ '"].$scope || {}) {'
			+ 'return __j._n(\"'
			+ vObj.tagName
			+ '\", '
			+ attrStr
			+ ', ['
			+ component.vTpl
			+ '], true)'
			+ '}} ('
			+ componentData
			+ ', '
			+ index
			+ ', "'
			+ parent
			+ '"))';
	}
	return '__j._n("'
		+ vObj.tagName
		+ '")';
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
		} 

		else {
			el.start += ' style="display:block;"';
		}

	} 

	else {

		if (matchArr = el.start.match(REGEXP.styleMRE)) {
			el.start = el.start.replace(REGEXP.styleMRE, 'style="' + matchArr[1] + ';display:none;"');
		} 

		else {
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
	} 

	else {
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
	} 

	else {
		value = convertStyleStrToObj(value);
		keyArr = $keys(value);
	}

	_.each(keyArr, (key, i) => {
		str += unCamel(key) + ':' + value[key] + ';';
	});

	if (matchArr = el.start.match(REGEXP.styleMRE)) {
		el.start = el.start.replace(REGEXP.styleMRE, 'style="' + matchArr[1] + ';' + str + '"');
	} 

	else {
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
};

const vText = (el, value) => {
	el.content = value;
};

const vHtml = (el, value) => {
	el.content = value;
};

const vModel = (el, value) => {
	return;
};

const vData = (el, value) => {
	let 
		keyArr
		;

	if (!_.isObject(value)) {
		value = convertStyleStrToObj(value);
	}

	keyArr = $keys(value);
	_.each(keyArr, (key, i) => {
		el.start += ' data-' + _.capitalLower(key) + '="' + value[key] + '"';
	});
};

const vParent = () => {

};

const vIndex = () => {

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
	href : 1,
	index : 1,
	parent : 1
};

//自定义属性优先级
const PRIO = {
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
	href : 100,
	component : 400,
	index : 500,
	parent : 500
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
	href : genHref,
	component : genComponent,
	index : genIndex,
	parent : genParent
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
	href : vHref,
	parent : vParent,
	index : vIndex
};

const isForAttr = (attribute) => {
	return REGEXP.test(REGEXP.forRE, attribute);
};

const isComponentAttr = (attribute) => {
	return REGEXP.test(REGEXP.compRE, attribute);
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
		, isComponent = false
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

			if (isComponentAttr(attrKey)) {
				isComponent = attrValue;
			}

		} 

		else {
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
		isComponent : isComponent,
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

const genVNodeExpr = (vObj, index, inst) => {
	let 
		data = getVObjData(vObj)
		, children = vObj.children
		, text
		;

	if (_.isElement(vObj)) {

		if (!vObj.isStatic) {
			return genUniqVNodeExpr(vObj, inst);
		}
		return '__j._n(\"'
			+ vObj.tagName + '\", '
			+ $stringify(data) + ', '
			+ getChildResult(children, inst)
			+ ')';
	} 

	else {
		text = data.textContent;

		if (_.isText(vObj)) {

			if (vObj.hasBrace) {
				return '__j._tn(' + replaceExpr($stringify(text), vObj.hasBrace) +', true)';
			}
			return '__j._tn(' + $stringify(text) + ')';
		} 

		else if(_.isComment(vObj)) {
			return '__j._cn(\"' + text + '\")';
		}
	}	
};

const genUniqVNodeExpr = (vObj, inst) => {
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
		return genFor(vObj, res, inst);
	}

	if (vObj.isComponent) {
		return genComponent(vObj, res, inst);
	}

	return '__j._n(\"' 
		+ vObj.tagName 
		+ '\", ' 
		+ res + ', '
		+ getChildResult(children, inst)
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

const getChildResult = (children, inst) => {
	return children.length 
		? '[' + getMapResult(children, genVNodeExpr, inst) + ']' 
		: '[]';
};

const getStrValue = (str) => {

	if (_.isVoid0(str)) {
		return '';
	}
	return str;
};

const getMapResult = (arrObj, cb, inst) => {
	let 
		result = []
		, index = -1
		, length
		, arrKey
		;

	if (_.isArray(arrObj) || _.isString(arrObj)) {
		length = arrObj.length;

		while (++index < length) {
			result[index] = cb(
				arrObj[index]
				, index
				, inst
				, index == 0
				, index == length - 1
				);
		}

	} 

	else if (_.isObject(arrObj)) {
		arrKey = $keys(arrObj);
		length = arrKey.length;

		while (++index < length) {
			result[index] = cb(
				arrObj[arrKey[index]]
				, arrKey[index]
				, inst
				, index == 0
				, index == length - 1
				);
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

const extendStaticAndUniqAttrs = (target, source) => {
	let 
		tData = target.data
		, sData = source.data
		, tStatic = tData.static
		, sStatic = sData.static
		, tUniq = tData.uniq
		, sUniq = sData.uniq
		;
	
	if (sStatic) {

		if (!tStatic) {
			tStatic = tData.static = $create(null);
		}

		for (let key in sStatic) {

			if (key != 'class' && key != 'style') {
				tStatic[key] = sStatic[key];
			}

			else {
				tStatic[key] = tStatic[key] || '';
				tStatic[key] += (tStatic[key] ? key == 'class' ? ' ' : ';' : '')
					+ sStatic[key];
			}
		}
	}
	
	if (sUniq) {

		if (!tUniq) {
			tUniq = tData.tUniq = $create(null);
		}
		_.extend(tUniq, sUniq || {});
		tData.uKeys = $keys(tUniq);
	}

	return target;
};

const makeGetterFn = (body, callback) => {

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

const createVNode = (tag, data, children, isComponent) => {
	data = data || {};
	children = _.flattenArr(children || []);
	
	let 
		_this = this
		, vNode
		, uniq = data.uniq
		, cach = _this.cach
		, key
		, isStatic = true
		, compVNode
		;

	if (uniq) {
		isStatic = false;
		data.uKeys = $keys(uniq).sort((a, b) => {
			return PRIO[b] - PRIO[a];
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

	if (isComponent) {
		compVNode = vNode.children[0];
		extendStaticAndUniqAttrs(compVNode, vNode);
		return compVNode;
	}

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
	} 

	else {
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
	} 

	else {
		let textCt = vNode.textContent;

		if (_.isText(vNode)) {
			el = createTextFn(textCt);
		} 

		else {
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

	render (filePath, options = {}) {
		TEMPLATE = fs.readFileSync(filePath, 'utf8');
		const config = options.config || {};
		this.start = Date.now();
		this.outerHTML = '';
		this.redis = config.redis || '';
		this.redisKey = config.redisKey || '';
		this.vNodeTemplate = config.vNodeTemplate;
		this.js = createScript(config.js || []);
		this.css = createLink(config.css || []);
		this.metaUrl = config.metaUrl;
		this.template = REGEXP.replace(TEMPLATE.match(REGEXP.bodyRE)[2], REGEXP.noteRE, STRING);
		this.$scope = options.model || {};
		TEMPLATE = TEMPLATE.replace(REGEXP.bodyRE, '$1BODY$3');
		return this.init();
	},

	init () {
		return this.analyzeHtml()
			.renderVNode()
			.transferVNode()
			.renderTpl();
	},

	analyzeHtml (html) {
		let 
			_this = this
			, match
			, tagAndSpaceHtml
			, tagHtml
			, spaceOrNote
			, isEndTag
			, isNoEndTag
			, isComponentEndTag
			, tagName
			, parentTag = null
			, lastParentTag = null
			, vObj
			, scope
			;

		if (_this.vNodeTemplate) {
			console.log('compile cach : ' + (Date.now() - this.start) + 'ms');
			return _this;
		}

		while (match = REGEXP.startEndAngleRE.exec(html || _this.template)) {
			tagAndSpaceHtml = match[0];
			spaceOrNote = match[1];
			tagHtml = match[2];
			tagName = _.lower(match[4]);
			isComponentEndTag = REGEXP.compSetRE.test(tagHtml);
			isEndTag = _.toBool(match[3]) || isComponentEndTag;
			isNoEndTag = REGEXP.noEndRE.test(tagName);
			vObj = createVObj(tagName, tagHtml);

			if (REGEXP.test(REGEXP.uniqLeftNoteRE, spaceOrNote)) {
				parentTag && appendVObjChildren(parentTag, createVCommentObj(tagAndSpaceHtml, parentTag));
				continue;
			}

			if (parentTag) {

				if (!REGEXP.test(REGEXP.onlySpaceRE, spaceOrNote)) {
					appendVObjChildren(parentTag, createVTextObj(spaceOrNote, parentTag, _this));
				} 

				if (!isEndTag) {
					appendVObjChildren(parentTag, vObj);
					parentTag = !isNoEndTag ? vObj : parentTag;
				}

				else {
					lastParentTag = parentTag;

					if (!isComponentEndTag) {
						parentTag = parentTag.parentVObj;
					}

					else {
						appendVObjChildren(parentTag, vObj);
					}

				}

			} else {
				parentTag = vObj;

				if (!html) {
					_this.vObj = vObj;
				}
			}
		}
		console.log('compile norm : ' + (Date.now() - this.start) + 'ms');
		return html ? parentTag || lastParentTag : _this;
	},

	analyzeTplStr () {
		return 'with(this.$scope){ return ' 
			+ (this.vObj 
			? genVNodeExpr(this.vObj, 0, this) 
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
			// console.log(_this.vNodeTemplate);
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
			this.redis.set(this.redisKey, this.vNodeTemplate, (err, reply) => {

				if (!err) {
					console.log('redis has cach the ' + this.redisKey + 'template');
				}
			});

			//一天缓存期限
			this.redis.expire(this.redisKey, 60 * 60 * 24);
		}

		this.vObj = null;
		this.template = null;
		this.vNodeTemplate = null;
	},

	addComponent (key, value) {
		value.template = fs.readFileSync(value.url, 'utf8');
		value.key = key;
		this.component[_.lower(key)] = value;
	},

	component : {},

	transferComponent () {
		const comp = {};
		_.each(this.component, (cp, key) => {
			const 
				obj = {}
				;

			obj.data = cp.data;
			this.funcFormat(cp.$scope);
			obj.$scope = cp.$scope;
			obj.template = cp.template;
			comp[cp.key] = obj;
		});
		return comp;
	},

	funcFormat (scope = this.$scope) {
		let _this = this;
		_.each(scope, (value, key) => {

			if (_.isFunction(value)) {
				scope[key] = value.toString();
			}

			else if (_.isObject(value)) {
				_this.funcFormat(value);
			}
		});
		return scope;
	},

	renderTpl () {
		this.funcFormat();

		if (this.metaUrl) {
			TEMPLATE = TEMPLATE.replace(REGEXP.metaRE, fs.readFileSync(this.metaUrl, 'utf8'));
		}

		let tpl = TEMPLATE
			.replace(REGEXP.modelRE, 'JSpring.fn.funcFormat(' + $stringify(this.$scope) + ')')
			.replace(REGEXP.bodyRE, this.outerHTML)
			.replace(REGEXP.jsRE, this.js)
			.replace(REGEXP.cssRE, this.css)
			.replace(REGEXP.templateRE, 'JSpring.fn.addMultiComponent(' + $stringify(this.transferComponent()) + ')')
			.replace(REGEXP.fnRE, "new Function('__j', '" 
				+ this.vNodeTemplate
					.replace(/'/g, '"')
					.replace(REGEXP.nextLRE, '') 
				+ "');")
			;
		this.clearNoUseAttr();
		return tpl;
	}

};

_.extend(Compiler, {
	_n : createVNode,
	_tn : createVTextNode,
	_cn : createVCommentObj,
	_mp : getMapResult,
	_v : getStrValue,
	_cp : Compiler.component
});

module.exports = Compiler;





//test case
// var component = [
//     {
//         id : 'SearchInput',
//         data : 'word',
//         url : './templates/SearchInput.tpl'
//     },
//     {
//         id : 'Swiper',
//         data : 'list',
//         url : './templates/Swiper.tpl'
//     },
//     {
//         id : 'Hot',
//         data : 'list',
//         url : './templates/Hot.tpl'
//     },
//     {
//         id : 'HotItem',
//         data : 'obj',
//         url : './templates/HotItem.tpl'
//     },
//     {
//         id : 'Special',
//         data : 'list',
//         url : './templates/Special.tpl'
//     }
// ];

// for (let cp of component) {
// 	Compiler.addComponent(cp.id, cp);
// }

// Compiler.render('templates/mainPage.tpl', {model : {
// 	keyword : '',
// 	startSlide : 1,
// 	swiperList : [],
// 	hotList : [],
// 	word : '',
// 	loadedFlag : false,
// 	specialList : []
// }, config : {}});



// Compiler.render('templates/visaList.tpl', {
// 	model : {
// 		visaList : [],
// 		city : 'ss',
// 		pageIndex : 1,
// 		paixu : true,
// 		quanbu : true,
// 		changzhu : true,
// 		loadedFlag : true,
// 		filterStyleFn (flag) {
// 			return flag ? {

// 			} : {
// 				color : '#d30775'
// 			};
// 		},
// 		goBack () {
// 		},
// 		toggleIcon (key) {
// 			this[key] = !this[key];
// 		},
// 		goVisaDetail (productId, goodsId) {
// 		}
// 	}, config : {
// 		url: 'templates/visaList.tpl',
// 		css: ['public/css/visaList/visaList.css'],
// 		js: ['public/js/visaList/visaListService.js'],
// 		metaUrl: 'templates/meta.tpl'
// 	}
// });

