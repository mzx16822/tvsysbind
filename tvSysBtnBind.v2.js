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
                console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配")
            }
        }
        el.dispatchEvent(evtObj)
    } else if (doc.createEventObject) {
        evtObj = doc.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent('on' + evtType, evtObj)
    }
}(function(window) {
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
                isCentered = typeof init.isCentered == "undefined" ? false : init.isCentered,
                currentClass = init.currentClass ? init.currentClass : "current",
                effect = init.effect ? init.effect : "slide1",
                element = new Array(),
                rules = Object.prototype.toString.call(init.rules) == '[object Object]' ? init.rules : {},
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
                focusobj.classList.add("focusobj");
                focusobj.classList.add("current");
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
            this.reSetClass = function(item, index, curClass) {
                if (history) _this.historyFocus[_this.currentId+_this.className] = _this.currentIndex;
                index = index ? index : 0;
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

                if (_this.target.getElementsByClassName(item).length > 0) {
                    _self.newItem(item, index)
                } else {
                    _this.target = _this.defaultTarget;
                    if (_this.target.getElementsByClassName(item).length > 0) _self.newItem(item, index)
                }
            }
            self.newItem = function(item, index) {
                if (_this.prev) _this.prev.classList.remove(_this.currentClass);
                //_this.target=document.getElementById(_this.currentId);
                _this.className = item;
                _this.prevIndex = _this.currentIndex = _this.historyFocus[_this.currentId+item] ? _this.historyFocus[_this.currentId+item] : index;
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
                element = _this.target.getElementsByClassName(_this.className);
                this.hotbtn = element;
                if (element.length <= 0) return false;
                if (_this.currentIndex || _this.currentIndex == 0) {
                    _this.currentIndex = parseInt(_this.currentIndex)
                } else {
                    _this.currentIndex = parseInt(init.currentIndex)
                }
                if (isload >= 2 && _this.sourceClass == _this.className && _this.sourceLength != element.length && !isSet) {
                    if (_this.prev.classList.contains(_this.className) && _this.sourceLength > element.length) {
                        _this.currentIndex = _this.currentIndex - (_this.sourceLength - element.length);
                        _this.prevIndex = _this.prevIndex - (_this.sourceLength - element.length);
                        _this.sourceLength = element.length
                    } else if (_this.prev.classList.contains(_this.className) && _this.sourceLength < element.length) {
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
            this.viewScrollY = function(y) {
                var view = _this.current.parentNode.parentNode;
                var sumtop = view.getAttribute("data-scroll-y") ? parseInt(view.getAttribute("data-scroll-y")) : 0;
                var top = sumtop + y + view.clientHeight / 2 - Math.ceil(_this.current.clientHeight / 2);
                if (top > 0) top = 0;
                if (view.getAttribute("data-scroll-maxTop") == null) {
                    maxTop = _this.hotbtn[_this.hotbtn.length - 1].getBoundingClientRect().bottom - view.getBoundingClientRect().bottom;
                    view.setAttribute("data-scroll-maxTop", maxTop)
                }
                if (top < sumtop && top < -maxTop) {
                    top = -maxTop
                }
                view.setAttribute("data-scroll-y", top);
                _this.current.parentNode.style.top = top + "px"
            }
            var maxLeft = 0;
            this.viewScrollX = function(x) {
                var view = _this.current.parentNode.parentNode;
                var sumleft = view.getAttribute("data-scroll-x") ? parseInt(view.getAttribute("data-scroll-x")) : 0;
                var left = sumleft + x + view.clientWidth / 2 - Math.ceil(_this.current.clientWidth / 2);
                if (isCentered) {
                    if (left > 0) left = 0;
                    if (view.getAttribute("data-scroll-maxLeft") == null) {
                        maxLeft = _this.hotbtn[_this.hotbtn.length - 1].getBoundingClientRect().right - view.getBoundingClientRect().right;
                        view.setAttribute("data-scroll-maxLeft", maxLeft)
                    }
                    if (left < sumleft && left < -maxLeft) {
                        left = -maxLeft
                    }
                }
                view.setAttribute("data-scroll-x", left);
                _this.current.parentNode.style.left = left + "px"
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
                if (_this.current.getBoundingClientRect().bottom > document.body.clientHeight || _this.current.getBoundingClientRect().top < 0) {
                    var y = _this.current.getBoundingClientRect().top - (document.body.clientHeight / 2 - _this.current.clientHeight / 2);
                    window.scrollTo(0, y)
                }
                var view = _this.current.parentNode.parentNode;
                var direction = view.getAttribute("data-scroll-direction");
                if (!direction) return;
                view.style.position = "relative";
                _this.current.parentNode.style.position = "absolute";
                var sumleft = view.getAttribute("data-scroll-x") ? parseInt(view.getAttribute("data-scroll-x")) : 0;
                if (direction == "x") {
                    _this.current.parentNode.style.width = _this.hotbtn.length * _this.current.clientWidth * 2 + "px";
                    var scroll_left = view.getBoundingClientRect().left - _this.current.getBoundingClientRect().left;
                    _this.viewScrollX(scroll_left)
                }
                var sumleft = view.getAttribute("data-scroll-y") ? parseInt(view.getAttribute("data-scroll-y")) : 0;
                if (direction == "y") {
                    var scroll_top = view.getBoundingClientRect().top - _this.current.getBoundingClientRect().top;
                    _this.viewScrollY(scroll_top)
                }
            }
            var isload = 0;
            self.classDo = function(index) {
                isload = isload + 1;
                if (isload == 2) {
                    _this.sourceLength = element.length
                }
                if (_this.prevCurrentClass) {
                    var ele = _this.target.getElementsByClassName(_this.prevCurrentClass);
                    for (var i = 0; i < ele.length; i++) {
                        if (ele[i].classList.contains(_this.prevCurrentClass)) {
                            ele[i].classList.remove(_this.prevCurrentClass)
                        }
                    }
                }
                if (element[index]) element[index].classList.add(_this.currentClass);
                else return;
                for (var i = 0; i < element.length; i++) {
                    if (i != index && element[i].classList.contains(_this.currentClass)) {
                        element[i].classList.remove(_this.currentClass)
                    }
                }
                _this.scroll();
                var effect = element[index].getAttribute("data-effect");
                if (effect) {
                    focusobj.setAttribute("style", "  position: fixed; z-index: 19;width:" + (element[index].getBoundingClientRect().width) + "px ;height:" + (element[index].getBoundingClientRect().height) + "px; left:" + element[index].getBoundingClientRect().left + "px;top:" + element[index].getBoundingClientRect().top + "px;");
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
                    obj = rules["#" + _this.currentId + ">." + _this.className];
                    if (typeof obj == "undefined") obj = rules[_this.className]
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
            self.onPressdo = function(e) {
                _this.event = e;
                _this.currentIndex = _this.currentIndex >= element.length - 1 ? element.length - 1 : _this.currentIndex;
                _this.prev = element[_this.currentIndex];
                _this.prevIndex = _this.currentIndex;
                self.rule();
                _this.current = element[_this.currentIndex];
                _this.currentIndex = _this.currentIndex;
                _this.className = _this.className;
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