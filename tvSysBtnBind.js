function $$(ID,className){
    if(className){
            return document.getElementById(ID).getElementsByClassName(className);
    }else{
            return document.getElementById(ID);
    }
   
}
(function (arr) {
    //remove();//兼容
    arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
if (!("classList" in document.documentElement)) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function () {
            var self = this;

            function update(fn) {
                return function (value) {
                    var classes = self.className.split(/\s+/g),
                        index = classes.indexOf(value);

                    fn(classes, index, value);
                    self.className = classes.join(" ");
                }
            }

            return {
                add: update(function (classes, index, value) {
                    if (!~index) classes.push(value);
                }),

                remove: update(function (classes, index) {
                    if (~index) classes.splice(index, 1);
                }),

                toggle: update(function (classes, index, value) {
                    if (~index)
                        classes.splice(index, 1);
                    else
                        classes.push(value);
                }),

                contains: function (value) {
                        return !!~self.className.split(/\s+/g).indexOf(value);
                    },

                    item: function (i) {
                        return self.className.split(/\s+/g)[i] || null;
                    }
            };
        }
    });
}

function fireKeyEvent(el, evtType, keyCode) {
        var doc = el.ownerDocument,
            win = doc.defaultView || doc.parentWindow,
            evtObj;
        if (doc.createEvent) {
            if (win.KeyEvent) {
                evtObj = doc.createEvent('KeyEvents');
                evtObj.initKeyEvent(evtType, true, true, win, false, false, false, false, keyCode, 0);
            } else {
                evtObj = doc.createEvent('UIEvents');
                Object.defineProperty(evtObj, 'keyCode', {
                    get: function () {
                        return this.keyCodeVal;
                    }
                });
                Object.defineProperty(evtObj, 'which', {
                    get: function () {
                        return this.keyCodeVal;
                    }
                });
                evtObj.initUIEvent(evtType, true, true, win, 1);
                evtObj.keyCodeVal = keyCode;
                if (evtObj.keyCode !== keyCode) {
                    console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
                }
            }
            el.dispatchEvent(evtObj);
        } else if (doc.createEventObject) {
            evtObj = doc.createEventObject();
            evtObj.keyCode = keyCode;
            el.fireEvent('on' + evtType, evtObj);
        }
    }
    //classList兼容
    (function (window) {
        var tvSysBtnBind = function (init) {
            var _this = this,
                _self = self;
            var id = init.id ? init.id : "",
                keyRemoveDefault = init.keyRemoveDefault ? true : false,
                currentIndex = init.currentIndex ? init.currentIndex : 0,
                btnLeft = init.btnLeft ? init.btnLeft : 37,
                btnUp = init.btnUp ? init.btnUp : 38,
                btnRight = init.btnRight ? init.btnRight : 39,
                btnDown = init.btnDown ? init.btnDown : 40,
                btnEnter = init.btnEnter ? init.btnEnter : 13,
                currentClass = init.currentClass ? init.currentClass : "current",
                doc = document.getElementById(id),
                effect = init.effect ? init.effect : "slide1",
                element = new Array(),
                rules = Object.prototype.toString.call(init.rules) == '[object Object]' ? init.rules : null,
                direction = "y";
            _this.className = init.className ? init.className : "hotbutton";
            this.event = {};
            var sumX = 0,
                timesX = 0,
                sumY = 0,
                timesY = 0;
            var eleIds = init.eleIds ? init.eleIds : false;
            var _tempElem;
            currentIndex = parseInt(currentIndex);
            this.defaultIndex = currentIndex;
            this.lock = false;
            var focusobj=document.createElement("span");
            (typeof init.onEnterPress) == "function" ? init.onEnterPress: init.onEnterPress = function () {};
            (typeof init.onPress) == "function" ? init.onPress: init.onPress = function () {};
            (typeof init.onLoad) == "function" ? init.onLoad: init.onLoad = function () {};

            this.onLoad = function () {

                _this.reLoad();
                this.sourceClass = _this.className;
                this.sourceLength = element.length;
                //element[currentIndex].classList.add(currentClass);
                _this.prev = element[currentIndex];
                _this.prevIndex = currentIndex;
                _this.current = element[currentIndex];
                _this.currentIndex = currentIndex;
                _this.target = doc;
                init.onLoad.call(_this);
                focusobj.classList.add("focusobj");
                this.target.appendChild(focusobj);
            }

            this.reSetClass = function (item, index) {
                //新组别 用于弹窗 不同组热键 API

                index = index ? index : 0;
                _this.currentIndex = index;
                _this.prevIndex = index;
                // _this.current.classList.remove(currentClass);
                _this.className = item;
                
                 
                _this.reLoad();
                
                

            }
            this.reLoad = function () {

                //避免无绑定的元素报错 //接口重新reload后依然没数据还是会报错的
                if (typeof (element[0]) == "undefined") {
                    _tempElem = document.createElement("span");
                    _tempElem.setAttribute("class", _this.className + " hide");
                    doc.appendChild(_tempElem);
                } else if (_this.hotbtn.length > 1) {
                    _tempElem.remove();

                }

                if (doc != null) {

                    element = doc.getElementsByClassName(_this.className);
                    this.hotbtn = element;
                } else {
                    for (var i = 0; i < eleIds.length; i++) {
                        element.push(document.getElementById(eleIds[i]))
                    }
                }
                if (element.length <= 0) return false;

                if (_this.currentIndex || _this.currentIndex == 0) {

                    _this.currentIndex = parseInt(_this.currentIndex);
                } else {
                    _this.currentIndex = parseInt(init.currentIndex);
                }
                if (isload >= 2 && _this.sourceClass == _this.className && _this.sourceLength != element.length && !isSet) {
                    //页面加载到接口加载不进行计算 重置class也不计算 手动设置焦点不算

                    // 如果元素数量发生过变化 将进行换算当前元素 重新算元素索引
                    if (_this.sourceLength > element.length) {
                        //当元素减少
                        _this.currentIndex = _this.currentIndex - (_this.sourceLength - element.length);
                        _this.prevIndex = _this.prevIndex - (_this.sourceLength - element.length);
                        _this.sourceLength = element.length;
                    } else if (_this.sourceLength < element.length) {
                        //当元素增加
                        _this.currentIndex = _this.currentIndex + (element.length - _this.sourceLength);
                        _this.prevIndex = _this.prevIndex + (element.length - _this.sourceLength);
                        _this.sourceLength = element.length;
                    }
                }
                isSet = false;
                _this.prev = element[_this.currentIndex];
                _this.prevIndex = _this.currentIndex;
                _this.current = element[_this.currentIndex];
                _this.currentIndex = _this.currentIndex;



                //原本是self.classDo(_this.currentIndex);
                //现在改成：
                if (_this.event.keyCode != 37 && _this.event.keyCode != 38 && _this.event.keyCode != 39 && _this.event.keyCode != 40) {
                    self.rule();
                } else {
                    _self.classDo(_this.currentIndex);
                }

                // self.classDo(_this.currentIndex);


                for (var i = 0; i < this.hotbtn.length; i++) {
                    this.hotbtn[i].setAttribute("data-id", i);

                }


            }

            function keydefault(e) {
                if (keyRemoveDefault) window.event ? window.event.returnValue = false : e.preventDefault()
            }

            this.hasClass = function (obj, cls) {

                return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
            }
            this.addClass = function (obj, cls) {
                if (!_this.hasClass(obj, cls)) obj.className += " " + cls
            }
            this.removeClass = function (obj, cls) {
                if (_this.hasClass(obj, cls)) {
                    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                    obj.className = obj.className.replace(reg, ' ')
                }
            }
            this.toggleClass = function (obj, cls) {
                if (_this.hasClass(obj, cls)) {
                    _this.removeClass(obj, cls)
                } else {
                    _this.addClass(obj, cls)
                }
            }
            var isSet = false;
            this.setCurrentIndex = function (index) {
                isSet = true;
                index = parseInt(index);


                _this.currentIndex = index;
                _this.current = element[index];

                _this.scroll();
            }
            this.viewScrollY = function (view, y) {

                view.scrollTop = view.scrollTop + y+(y*0.1);

            }
            this.viewScrollX = function (view, x) {

                view.scrollLeft = view.scrollLeft + x+(x*0.1);
            }
            this.onEnterPress = function () {

                init.onEnterPress.call(_this);


            }
            self.getScrollTop = function () {
                var scrollTop = 0;
                if (document.documentElement && document.documentElement.scrollTop) {
                    scrollTop = document.documentElement.scrollTop;
                } else if (document.body) {
                    scrollTop = document.body.scrollTop;
                }
                return scrollTop;
            }
            this.scroll = function (scrollId) {


                if (!_this.current) return;
                if (!_this.current.getAttribute("data-scroll")) return;
                var scrollId = scrollId ? scrollId : _this.current.getAttribute("data-scroll");


                if (scrollId) {
                    var view = document.getElementById(scrollId);

                    if ( _this.current.getBoundingClientRect().top-view.getBoundingClientRect().top<0) {
                        
                        _this.viewScrollY(view, _this.current.getBoundingClientRect().top-view.getBoundingClientRect().top  );

                    }else if(_this.current.getBoundingClientRect().bottom-view.getBoundingClientRect().bottom>0){
                        _this.viewScrollY(view, _this.current.getBoundingClientRect().bottom-view.getBoundingClientRect().bottom  );
                    }


                    if (view.getAttribute("data-scroll-direction") == "x") {

                        var col = view.children[0].children,
                            _temp = 0;
                        for (var i = 0; i < col.length; i++) {

                            _temp = _temp + (col[i].offsetWidth * 1.08);


                        }

                        view.children[0].setAttribute("style", "width:" + _temp + "px");
                    }

                    

                    if ( _this.current.getBoundingClientRect().left-view.getBoundingClientRect().left<0) {
                        
                        _this.viewScrollX(view, _this.current.getBoundingClientRect().left-view.getBoundingClientRect().left  );

                    }else if(_this.current.getBoundingClientRect().right-view.getBoundingClientRect().right>0){
                        _this.viewScrollX(view, _this.current.getBoundingClientRect().right-view.getBoundingClientRect().right  );
                    }


                }



            }
            this.onPress = function (e) {



                init.onPress.call(_this);
                _this.scroll();

                //页面自动上下滚动
                if (document.body.scrollHeight > document.body.clientHeight) {


                    var mainY = 0;
                    var page = setInterval(function () {
                        mainY = mainY + 20;
                        try {
                            if (_this.current.getBoundingClientRect().top < 0) {

                                window.scrollTo(0, window.getScrollTop() - mainY);

                            } else if (_this.current.getBoundingClientRect().bottom > document.body.offsetHeight) {

                                window.scrollTo(0, window.getScrollTop() + mainY);
                            } else {

                                mainY = 0;
                                clearInterval(page)
                            }
                        } catch (e) {
                            clearInterval(page)
                        }


                    }, 10);
                }
            }
            var isload = 0;
            self.classDo = function (index) {
                isload = isload + 1;

                if (isload == 2) {
                    _this.sourceLength = element.length;

                }
                try {
                    element[index].classList.add(currentClass);
                } catch (e) {
                    console.log(index);
                }

                for (var i = 0; i < element.length; i++) {
                    if (i != index) {

                        element[i].classList.remove(currentClass);
                    }
                }
                var effect= element[index].getAttribute("data-effect");
                if(effect){
                    focusobj.setAttribute("style","display:block; position: fixed; z-index: 19;width:"+(element[index].getBoundingClientRect().width-6)+"px ;height:"+(element[index].getBoundingClientRect().height-6)+"px; left:"+element[index].getBoundingClientRect().left+"px;top:"+element[index].getBoundingClientRect().top+"px;");
                    focusobj.setAttribute("class","focusobj "+effect);
                }  else {
                    focusobj.setAttribute("class","focusobj")
                    focusobj.style.display="none";
                }

            }

            self.EventUtil = {
                add: function (obj, callback) {
                    if (typeof (obj.onkeypress) == "null") {
                        obj.onkeypress = function (e) {
                            callback && callback(e)
                        }
                    } else {
                        obj.onkeydown = function (e) {
                            callback && callback(e)
                        }
                    }
                }
            }


            EventUtil.add(document, function (e) {

                if (!_this.lock) {
                    _self.EventUtil(e);
                }


            });
            self.rule = function () {
                // rules={   l u r d
                //    0:[0,0,0,0],
                //    1:[0,0,0,0]
                //  }

                if (_this.currentIndex >= element.length - 1) {
                    _this.currentIndex = element.length - 1;
                }
                if (_this.currentIndex < 0) {
                    _this.currentIndex = 0;
                }

                var num = element[_this.currentIndex].parentNode.parentNode.parentNode.getAttribute("data-num") || element[_this.currentIndex].parentNode.parentNode.getAttribute("data-num") || element[_this.currentIndex].parentNode.getAttribute("data-num") || element[_this.currentIndex].parentNode.children.length;

                if (_this.event.keyCode == btnLeft) {
                    if (rules && rules.className == _this.className && rules[_this.currentIndex]) {
                        _this.currentIndex = _this.currentIndex + rules[_this.currentIndex][0];
                    }else if (rules && typeof rules[_this.className] == "object" && rules[_this.className][_this.currentIndex]) {
                        _this.currentIndex = _this.currentIndex + rules[_this.className][_this.currentIndex][0];
                    } else {
                        var left = element[_this.currentIndex].getAttribute("data-left");
                        _this.currentIndex = left ? _this.currentIndex = _this.currentIndex - parseInt(left) : _this.currentIndex = _this.currentIndex - 1;
                    }



                } else if (_this.event.keyCode == btnRight) {
                    if (rules && rules.className == _this.className && rules[_this.currentIndex]) {
                        _this.currentIndex = _this.currentIndex + rules[_this.currentIndex][2];
                    }else if (rules && typeof rules[_this.className] == "object" && rules[_this.className][_this.currentIndex]) {
                        _this.currentIndex = _this.currentIndex + rules[_this.className][_this.currentIndex][2];
                    } else {
                        var right = element[_this.currentIndex].getAttribute("data-right");
                        _this.currentIndex = right ? _this.currentIndex = _this.currentIndex + parseInt(right) : _this.currentIndex = _this.currentIndex + 1;
                    }
                } else if (_this.event.keyCode == btnUp) {
                    if (rules && rules.className == _this.className && rules[_this.currentIndex]) {
                        _this.currentIndex = _this.currentIndex + rules[_this.currentIndex][1];
                    }else if (rules && typeof rules[_this.className] == "object" && rules[_this.className][_this.currentIndex]) {
                        _this.currentIndex = _this.currentIndex + rules[_this.className][_this.currentIndex][1];
                    } else {
                        var up = element[_this.currentIndex].getAttribute("data-up");
                        _this.currentIndex = up ? _this.currentIndex = _this.currentIndex - parseInt(up) : _this.currentIndex = _this.currentIndex - parseInt(num);
                    }
                } else if (_this.event.keyCode == btnDown) {
                    if (rules && rules.className == _this.className && rules[_this.currentIndex]) {
                        _this.currentIndex = _this.currentIndex + rules[_this.currentIndex][3];
                    }else if (rules && typeof rules[_this.className] == "object" && rules[_this.className][_this.currentIndex]) {
                        _this.currentIndex = _this.currentIndex + rules[_this.className][_this.currentIndex][3];
                    } else {
                        var dow = element[_this.currentIndex].getAttribute("data-dow");

                        _this.currentIndex = dow ? _this.currentIndex = _this.currentIndex + parseInt(dow) : _this.currentIndex = _this.currentIndex + parseInt(num);
                    }
                }
                if (_this.currentIndex > element.length - 1) {
                    _this.currentIndex = element.length - 1;
                }
                if (_this.currentIndex < 0) {
                    _this.currentIndex = 0;
                }

                setTimeout(function () {
                        _self.classDo(_this.currentIndex);
                    }, 0)
                    //原规则走动置后 防止重新渲染

            }
            self.EventUtil = function (e) {
                    _this.event = e;
                    _this.currentIndex = _this.currentIndex >= element.length - 1 ? element.length - 1 : _this.currentIndex;
                    _this.prev = element[_this.currentIndex];
                    _this.prevIndex = _this.currentIndex;
                    self.rule();
                    _this.current = element[_this.currentIndex];
                    _this.currentIndex = _this.currentIndex;
                    _this.className = _this.className;
                    keydefault(e);
                    //self.classDo(_this.currentIndex);
                    _this.onPress.call(_this);
                    if (e.keyCode == btnEnter) {
                        _this.onEnterPress.call(_this)
                    }
                }
                //console.log(this.onLoad)
            this.onLoad();

        }

        window.tvSysBtnBind = tvSysBtnBind;
    })(window)