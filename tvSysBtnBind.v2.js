try{
(function(arr) { 
        //当前元素删除
        arr.forEach(function(item) {
            if (item.hasOwnProperty('remove')) {
                return
            }
            Object.defineProperty(item, 'remove', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function remove() {
                    this.parentNode.removeChild(this)
                }
            })
        })
    })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

    if (!("classList" in document.documentElement)) {
        // classList 兼容
        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;

                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/g),
                            index = classes.indexOf(value);
                        fn(classes, index, value);
                        self.className = classes.join(" ")
                    }
                }
                return {
                    add: update(function(classes, index, value) {
                        if (!~index) classes.push(value)
                    }),
                    remove: update(function(classes, index) {
                        if (~index) classes.splice(index, 1)
                    }),
                    toggle: update(function(classes, index, value) {
                        if (~index) classes.splice(index, 1);
                        else classes.push(value)
                    }),
                    contains: function(value) {
                        return !!~self.className.split(/\s+/g).indexOf(value)
                    },
                    item: function(i) {
                        return self.className.split(/\s+/g)[i] || null
                    }
                }
            }
        })
    }
    function fireKeyEvent(el, evtType, keyCode) {
        //创建事件
        var doc = el.ownerDocument,
            win = doc.defaultView || doc.parentWindow,
            evtObj;
        if (doc.createEvent) {
            if (win.KeyEvent) {
                evtObj = doc.createEvent('KeyEvents');
                evtObj.initKeyEvent(evtType, true, true, win, false, false, false, false, keyCode, 0)
            } else {
                evtObj = doc.createEvent('UIEvents');
                Object.defineProperty(evtObj, 'keyCode', {
                    get: function() {
                        return this.keyCodeVal
                    }
                });
                Object.defineProperty(evtObj, 'which', {
                    get: function() {
                        return this.keyCodeVal
                    }
                });
                evtObj.initUIEvent(evtType, true, true, win, 1);
                evtObj.keyCodeVal = keyCode;
                if (evtObj.keyCode !== keyCode) {
                    // console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配")
                }
            }
            el.dispatchEvent(evtObj)
        } else if (doc.createEventObject) {
            evtObj = doc.createEventObject();
            evtObj.keyCode = keyCode;
            el.fireEvent('on' + evtType, evtObj)
        }

    }
}catch(e){
    //版本很低
} 
function addClass(ele, cls) {
    if(ele.classList){
       ele.classList.add(cls); 
    }else{
       if (!this.hasClass(ele, cls)) ele.className += " " + cls; 
    }
    
}
function arrIndexOf(arr, v) {
          for (var i = 0; i < arr.length; i++) {
             if (arr[i] == v) {
                 return i;
              }
         }
       return -1;
 }
//删除指定dom元素的样式
function removeClass(ele, cls) {
    if(ele.classList){
       ele.classList.remove(cls); 
    }else{
        if (ele.className != '' && hasClass(ele, cls)) {
                    var arrClassName = ele.className.split(' ');
                    var classIndex = arrIndexOf(arrClassName, cls);
                     if (classIndex!==-1) {
                       arrClassName.splice(classIndex, 1);
                        ele.className = arrClassName.join(' ');
                     }
               }
    }
}
//如果存在(不存在)，就删除(添加)一个样式
function toggleClass(ele,cls){ 
    if(hasClass(ele,cls)){ 
            removeClass(ele, cls); 
        }else{ 
            addClass(ele, cls); 
     } 
    
}

function hasClass(element, cls) {
return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
} 
//  function hasClass(tagStr,classStr){
//     if(tagStr.classList){
//        return tagStr.classList.contains(classStr);
//     } else{ 
//        var arr=tagStr.className.split(/\s+/ ); //这个正则表达式是因为class可以有多个,判断是否包含
//                for (var i=0;i<arr.length;i++){
//                    if (arr[i]==classStr){
//                        return true ;
//                    }
//                }
//             return false 
//         }
// }
function getClassNames(classStr,target, tagName) {
   /* classStr 样式名（必须） 目标元素 标签类型 */
   target= target?target:document;
   tagName = tagName?tagName:"*";
    if (document.getElementsByClassName) {
        return target.getElementsByClassName(classStr)
    } else {
        var nodes = target.getElementsByTagName(tagName),
            ret = [];
        for (i = 0; i < nodes.length; i++) {
            if (hasClass(nodes[i], classStr)) {
                ret.push(nodes[i])
            }
        }
        return ret;
    }
}

function getElementLeft(ele) {
            var actualLeft = ele.offsetLeft;
            var current = ele.offsetParent;
            // 如果当前元素不是根元素
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            return actualLeft;
        }

        function getElementTop(ele) {
            var actualTop = ele.offsetTop;
            var current = ele.offsetParent;
            while (current !== null) {
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            return actualTop;
        }

function getBoundingClientRect(ele) {
// 该方法是计算当前元素距离当前视口的距离，所以需要得到页面的滚动距离
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
// 如果浏览器支持该方法
    if (ele.getBoundingClientRect) {
        if (typeof arguments.callee.offset !== 'number') {
       //不同浏览器中，元素的默认位置不同。为了统一起见，需要新创建一个元素
            var temp = document.createElement('div');
            temp.style.cssText = "position:absolute;top:0;left:0";
            document.body.appendChild(temp);
            arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
            document.body.removeChild(temp);
            temp = null;
        }
        var rect = ele.getBoundingClientRect();
        var offset = arguments.callee.offset;
        return {
            left: rect.left + offset,
            right: rect.right + offset,
            top: rect.top + offset,
            bottom: rect.bottom + offset,
            width:(rect.right + offset)-(rect.left + offset),
            height:(rect.bottom + offset)-(rect.top + offset)
        }
    } else {
    //当前浏览器不支持该方法
        var actualLeft = getElementLeft(ele);
        var actualTop = getElementTop(ele);
        var offsetWidth=ele.offsetWidth;
        var offsetHeight=ele.offsetHeight;
        return {
            left: actualLeft - scrollLeft,
            right: actualLeft + offsetWidth - scrollLeft,
            top: actualTop - scrollTop,
            bottom: actualTop + offsetHeight - scrollTop,
            width:(actualLeft + offsetWidth- scrollLeft) -(actualLeft - scrollLeft),
            height:(actualTop + offsetHeight - scrollTop)-(actualTop - scrollTop)
        }
    }
}
    (function(window) {
        var tvSysBtnBind = function(init) {
                var _this = this,
                    _self = self;
                var id = init.id ? init.id : null,
                    keyRemoveDefault = typeof init.keyRemoveDefault == "undefined" ? false : init.keyRemoveDefault,
                    currentIndex = init.currentIndex ? parseInt(init.currentIndex) : 0,
                    btnLeft = init.btnLeft ? init.btnLeft : 37,
                    btnUp = init.btnUp ? init.btnUp : 38,
                    btnRight = init.btnRight ? init.btnRight : 39,
                    btnDown = init.btnDown ? init.btnDown : 40,
                    btnEnter = init.btnEnter ? init.btnEnter : 13,
                    history = typeof init.history == "undefined" ? true : init.history,
                    isFloatLast = typeof init.isFloatLast == "undefined" ? false : init.isFloatLast,
                    isCentered = typeof init.isCentered == "undefined" ? true : init.isCentered,
                    currentClass = init.currentClass ? init.currentClass : "current",
                    effect = init.effect ? init.effect : "slide1",
                    element = new Array(),
                    rules = init.rules,
                    direction = "y";
                _this.className = init.className ? init.className : "hotbutton";
                this.event = {};
                var _tempElem;
                this.currentIndex = parseInt(currentIndex);
                this.defaultIndex = parseInt(currentIndex);
                this.currentClass = currentClass;
                this.historyFocus = {};
                if (!window.focusobj) window.focusobj = document.createElement("span");
                (typeof init.onLoad) == "function" ? init.onLoad : init.onLoad = function() {};
                (typeof init.onBack) == "function" ? init.onLoad : init.onBack = function() {};
                this.onLoad = function() {
                    focusobj.innerHTML = '<div class="cssbk"><b class="lt"></b><b class="t"></b><b class="rt"></b><b class="r"></b><b class="rb"></b><b class="b"></b><b class="lb"></b> <b class="l"></b></div>';
                    addClass(focusobj,"focusobj");
                    addClass(focusobj,"current");
                    focusobj.style.display = "none";
                    _this.target = init.id ? document.getElementById(init.id) : document.body;
                    _this.defaultTarget = _this.target;
                    _this.currentId = init.id ? init.id : "Jdoc";
                    _this.reLoad();
                    _this.sourceClassName = _this.className;
                    _this.sourceLength = element.length;
                    _this.prev = element[currentIndex];
                    _this.prevIndex = currentIndex;
                    _this.current = element[currentIndex];
                    _this.currentIndex = currentIndex;
                    _this.target.appendChild(focusobj);
                    init.onLoad.call(_this);
                }
                self.getCurRule=function(){
                    var obj = {};
                    if (rules) {
                        obj = rules["#" + _this.currentId + ">." + _this.className];
                        if (typeof obj == "undefined") obj = rules[_this.className]
                    }
                    return obj
                }


                this.reSetClass = function(item, index, curClass) {
                 var obj =_self.getCurRule();
                    if(typeof obj["history"]=="undefined") obj["history"]=history; //默认历史记录开关
                    if (obj["history"]) _this.historyFocus[_this.currentId+_this.className] = _this.currentIndex; //当前历史开关
                    //index = index ? index : 0;
                    _this.prevCurrentClass = _this.currentClass;
                    if (curClass) {
                        _this.currentClass = curClass
                    }
                    var arr = item.split(">");
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == "") arr.splice(i)
                    }
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].indexOf("#") != -1) {
                            _this.currentId=arr[i].replace("#", "");
                            if (document.getElementById( _this.currentId)) _this.target = document.getElementById( _this.currentId);
                        }
                        if (arr[i].indexOf(".") != -1) {
                            item = arr[i].replace(".", "")
                        }
                        if (arr[i].indexOf(".") == -1 && arr[i].indexOf("#") == -1) {
                            item = arr[i]
                        }
                    }

                    if (getClassNames(item,_this.target).length > 0) {
                        _self.newItem(item, index)
                    } else {
                        _this.target = _this.defaultTarget;
                        if (getClassNames(item,_this.target).length > 0) _self.newItem(item, index)
                    }
                }
                self.newItem = function(item, index) {

                    if (_this.prev) removeClass(_this.prev,_this.currentClass);
                    //_this.target=document.getElementById(_this.currentId);
                    if(typeof _this.historyFocus[_this.currentId+item]=="undefined")
                        _this.historyFocus[_this.currentId+item]=0;
                    _this.className = item;
                    _this.prevIndex = _this.currentIndex = typeof index!="undefined" ?index:  _this.historyFocus[_this.currentId+item];
                    _this.reLoad();
                }
                self.readFn = function() {
                    if ((typeof init.onEnterPress) == "function") {
                        init.onEnterPress
                    } else {
                        init.onEnterPress = function() {}
                    }
                    if ((typeof init.onPress) == "function") {
                        init.onPress
                    } else {
                        init.onPress = function() {}
                    }
                }
                this.reLoad = function() {
                    self.readFn();
                    element =getClassNames(_this.className,_this.target);
                    this.hotbtn = element;
                    if (element.length <= 0) return false;
                    if (_this.currentIndex || _this.currentIndex == 0) {
                        _this.currentIndex = parseInt(_this.currentIndex)
                    } else {
                        _this.currentIndex = parseInt(init.currentIndex)
                    }
                    if (isload >= 2 && _this.sourceClass == _this.className && _this.sourceLength != element.length && !isSet) {
                        if (hasClass(_this.prev,_this.className) && _this.sourceLength > element.length) {
                            _this.currentIndex = _this.currentIndex - (_this.sourceLength - element.length);
                            _this.prevIndex = _this.prevIndex - (_this.sourceLength - element.length);
                            _this.sourceLength = element.length
                        } else if (hasClass(_this.prev,_this.className) && _this.sourceLength < element.length) {
                            _this.currentIndex = _this.currentIndex + (element.length - _this.sourceLength);
                            _this.prevIndex = _this.prevIndex + (element.length - _this.sourceLength);
                            _this.sourceLength = element.length
                        }
                    }
                    isSet = false;
                    _this.current = element[_this.currentIndex];
                    _this.currentIndex = _this.currentIndex;
                    _self.classDo(_this.currentIndex);
                    for (var i = 0; i < this.hotbtn.length; i++) {
                        this.hotbtn[i].setAttribute("data-id", i)
                    }
                }
                function keydefault(e) {
                    try {
                        if (keyRemoveDefault) window.event ? window.event.returnValue = false : e.preventDefault()
                    } catch (e) {}
                }
                var isSet = false;
                this.setCurrentIndex = function(index) {
                    isSet = true;
                    index = parseInt(index);
                    _this.currentIndex = index;
                    _this.current = element[index]
                }
                var maxTop = 0;
                this.viewScrollY = function(y,view) {
                    var obj = self.getCurRule();
                    // var view = _this.current.parentNode.parentNode;
                    var sumtop =  obj["directionY"] ? parseInt(obj["directionY"]) : 0;
                    var top = sumtop + y + view.clientHeight / 2 - Math.ceil(_this.current.clientHeight / 2);
                    if (top > 0) top = 0;
                    obj["directionY"]=top;
                    view.children[0].style.top = top + "px"
                }
                var maxLeft = 0;
                this.viewScrollX = function(x,view) {
                    var obj = self.getCurRule();
                    // var view = _this.current.parentNode.parentNode;
                    var sumleft = obj["directionX"] ? parseInt(obj["directionX"]) : 0;
                    var left = sumleft + x + view.clientWidth / 2 - Math.ceil(_this.current.clientWidth / 2);
                    
                      if (isCentered) {
                        if (left > 0) left = 0;
                        if (obj["maxLeft"]==undefined||obj["maxLeft"]==null) {
                            maxLeft = getBoundingClientRect(_this.hotbtn[_this.hotbtn.length - 1]).right - getBoundingClientRect(view).right;
                            obj["maxLeft"]=maxLeft;
            
                        }
                        if (left < sumleft && left < -maxLeft) {
                            left = -maxLeft
                        }
                        // if(maxLeft<view.clientWidth)
                        //  left=0;
                    }
                    obj["directionX"]=left;
                    view.children[0].style.left = left + "px"
                }
                this.onPress = function(e) {
                    init.onPress.call(_this)
                }
                this.onEnterPress = function() {
                    init.onEnterPress.call(_this)
                }
                this.onBack = function() {
                    init.onBack.call(_this)
                }
                self.getScrollTop = function() {
                    var scrollTop = 0;
                    if (document.documentElement && document.documentElement.scrollTop) {
                        scrollTop = document.documentElement.scrollTop
                    } else if (document.body) {
                        scrollTop = document.body.scrollTop
                    }
                    return scrollTop
                }
                this.scroll = function() {
                    var obj = self.getCurRule();
                    if (getBoundingClientRect(_this.current).bottom > document.body.clientHeight || getBoundingClientRect(_this.current).top < 0) {
                        var y = getBoundingClientRect(_this.current).top - (document.body.clientHeight / 2 - _this.current.clientHeight / 2);
                        window.scrollTo(0, y)
                    }

                    var view = _this.current.parentNode.parentNode;
                    if(obj["directionParent"])view=obj["directionParent"];
                    // var direction = view.getAttribute("data-scroll-direction");
                    // if (!direction) {
                    //     view = _this.current.parentNode.parentNode.parentNode;
                    //     direction = view.getAttribute("data-scroll-direction"); 
                    // }
                    if (obj == undefined || !obj["direction"] )return;
                    view.style.position = "relative";
                    view.children[0].style.position = "absolute";
                    var sumleft = obj["directionX"] ? parseInt(obj["directionX"]) : 0;
                    if (obj["direction"] == "x") {
                        view.children[0].style.width = _this.hotbtn.length * _this.current.clientWidth * 2 + "px";
                        var scroll_left = getBoundingClientRect(view).left - getBoundingClientRect(_this.current).left;
                        if( _this.hotbtn.length * _this.current.clientWidth>view.clientWidth)
                         _this.viewScrollX(scroll_left,view);
                    }
                    var sumleft = obj["directionY"] ? parseInt(obj["directionY"]) : 0;
                    if (obj["direction"] == "y") {
                        var scroll_top = getBoundingClientRect(view).top - getBoundingClientRect(_this.current).top;
                        _this.viewScrollY(scroll_top,view)
                    }
                }
                var isload = 0;
                self.classDo = function(index) {
                    isload = isload + 1;
                    if (isload == 2) {
                        _this.sourceLength = element.length
                    }
                    if (_this.prevCurrentClass) {
                        var ele = getClassNames(_this.prevCurrentClass,_this.target) ;
                        for (var i = 0; i < ele.length; i++) {
                            if (hasClass(ele[i],_this.prevCurrentClass)) {
                                removeClass(ele[i],_this.prevCurrentClass);
                            }
                        }
                    }
                    if (element[index])  addClass(element[index],_this.currentClass);
                    else return;
                    for (var i = 0; i < element.length; i++) {
                        if (i != index && hasClass(element[i],_this.currentClass)) {
                            removeClass(element[i],_this.currentClass);
                        }
                    }
                    _this.scroll();
                    var effect = element[index].getAttribute("data-effect");
                    if (effect) {
                        focusobj.setAttribute("style", "  position: fixed; z-index: 19;width:" + (getBoundingClientRect(element[index]).width) + "px ;height:" + (getBoundingClientRect(element[index]).height) + "px; left:" + getBoundingClientRect(element[index]).left + "px;top:" + getBoundingClientRect(element[index]).top + "px;");
                        focusobj.setAttribute("class", "focusobj current " + effect);
                        focusobj.style.display = "list-item"
                    } else {
                        focusobj.setAttribute("style", "");
                        focusobj.style.display = "none"
                    }
                }
                self.EventUtil = {
                    add: function(obj, callback) {
                        if (typeof(obj.onkeypress) == "null") {
                            obj.onkeypress = function(e) {
                                callback && callback(e)
                            }
                        } else {
                            obj.onkeydown = function(e) {
                                callback && callback(e)
                            }
                        }
                    }
                }
                EventUtil.add(document, function(e) {
                    _self.onPressdo(e)
                });
                self.overIndex = function() {
                    if (_this.currentIndex >= element.length - 1) {
                        _this.currentIndex = element.length - 1
                    }
                    if (_this.currentIndex < 0) {
                        _this.currentIndex = 0
                    }
                }
                self.isNumber = function(val) {
                    var regPos = /^\d+(\.\d+)?$/;
                    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
                    if (regPos.test(val) || regNeg.test(val)) {
                        return true
                    } else {
                        return false
                    }
                }
                self.ruleFn = function(index, direction) {
                    var obj = {};
                    if (rules) {
                        obj =_self.getCurRule();
                    }
                    if (obj && typeof obj == "object" && typeof obj["line"] != "undefined") {
                        var line = obj["line"]
                    } else {
                        var line = _this.hotbtn.length
                    }
                    line = parseInt(line);
                    if (obj && typeof obj == "object" && typeof obj[_this.currentIndex] != "undefined" && typeof obj[_this.currentIndex][index] != "undefined") {
                        var objRules = obj[_this.currentIndex];
                        if (self.isNumber(objRules[index])) {
                            _this.currentIndex = parseInt(_this.currentIndex) + parseInt(objRules[index])
                        } else if (Array.isArray(objRules[index])) {
                            _this.reSetClass(objRules[index][0], objRules[index][1])
                        } else if (typeof obj["line"] != "undefined") {
                            _this.currentIndex = _this.currentIndex + line
                        }
                    } else {
                        var jump = element[_this.currentIndex].getAttribute("data-" + direction);
                        jump = parseInt(jump);
                        if (direction == "up") {
                            if (_this.currentIndex > line - 1) _this.currentIndex = jump ? _this.currentIndex - jump : _this.currentIndex - line;
                            else if (obj && typeof obj["up"] == "object") _this.reSetClass(obj[direction][0], obj["up"][1], obj["up"][2], obj["up"][3]);
                            else if (obj && typeof obj["up"] == "function") obj["up"].call(_this)
                        } else if (direction == "left") {
                            if ((_this.currentIndex) % line != 0) _this.currentIndex = jump ? _this.currentIndex - jump : _this.currentIndex - 1;
                            else if (obj && typeof obj["left"] == "object") _this.reSetClass(obj["left"][0], obj["left"][1], obj["left"][2], obj["left"][3]);
                            else if (obj && typeof obj["left"] == "function") obj["left"].call(_this)
                        } else if (direction == "right") {
                            if ((_this.currentIndex + 1) % line != 0) _this.currentIndex = jump ? _this.currentIndex + jump : _this.currentIndex + 1;
                            else if (obj && typeof obj["right"] == "object") _this.reSetClass(obj["right"][0], obj["right"][1], obj["right"][2], obj["right"][3]);
                            else if (obj && typeof obj["right"] == "function") obj["right"].call(_this)
                        } else if (direction == "down") {
                            if (_this.hotbtn.length - line > _this.currentIndex) _this.currentIndex = jump ? _this.currentIndex + jump : _this.currentIndex + line;
                            else if (obj && typeof obj["down"] == "object") _this.reSetClass(obj["down"][0], obj["down"][1], obj["down"][2], obj["down"][3]);
                            else if (obj && typeof obj["down"] == "function") obj["down"].call(_this);
                            else if (_this.currentIndex + line > _this.hotbtn.length - 1 && _this.currentIndex + line <= (line - _this.hotbtn.length % line) + _this.hotbtn.length - 1 && _this.hotbtn.length % line != 0 && isFloatLast) {
                                _this.currentIndex = _this.currentIndex + line;
                                self.overIndex()
                            }
                        }
                    }
                }
                self.rule = function() {
                    self.overIndex();
                    if (_this.event.keyCode == btnLeft) {
                        self.ruleFn(0, "left")
                    } else if (_this.event.keyCode == btnRight) {
                        self.ruleFn(2, "right")
                    } else if (_this.event.keyCode == btnUp) {
                        self.ruleFn(1, "up")
                    } else if (_this.event.keyCode == btnDown) {
                        self.ruleFn(3, "down")
                    }
                    self.overIndex()
                }
                this.back=function(){
                    _this.event.keyCode=8;
                   self.onPressdo(_this.event);  
                }
                self.onPressdo = function(e) {
                    _this.event = e;
                    _this.currentIndex = _this.currentIndex >= element.length - 1 ? element.length - 1 : _this.currentIndex;
                    _this.prev = element[_this.currentIndex];
                    _this.prevIndex = _this.currentIndex;
                    self.rule();
                    _this.current = element[_this.currentIndex];
                    _this.currentIndex = _this.currentIndex;
                    _this.className = _this.className;
                    //$.tips(e.keyCode)
                    if (e.keyCode == 8 || e.keyCode == 27) {
                        if (rules[_this.className] && (typeof rules[_this.className]["onBack"]) == "function") rules[_this.className]["onBack"].call(_this);
                        else _this.onBack.call(_this)
                    }
                    if (rules && rules[_this.className] && (typeof rules[_this.className]["onPress"]) == "function") init.rules[_this.className]["onPress"].call(_this);
                    else _this.onPress.call(_this);
                    if (e.keyCode == btnEnter) {
                        if (rules[_this.className] && (typeof rules[_this.className]["onEnterPress"]) == "function") rules[_this.className]["onEnterPress"].call(_this);
                        else _this.onEnterPress.call(_this)
                    }
                    _self.classDo(_this.currentIndex);
                    keydefault(e)
                }
                this.onLoad();
            }
        window.tvSysBtnBind = tvSysBtnBind
    })(window)