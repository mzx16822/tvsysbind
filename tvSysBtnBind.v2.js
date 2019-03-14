
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
            var id = init.id ? init.id : null,
                keyRemoveDefault = init.keyRemoveDefault ? true : false,
                currentIndex = init.currentIndex ? parseInt(init.currentIndex): 0,
                btnLeft = init.btnLeft ? init.btnLeft : 37,
                btnUp = init.btnUp ? init.btnUp : 38,
                btnRight = init.btnRight ? init.btnRight : 39,
                btnDown = init.btnDown ? init.btnDown : 40,
                btnEnter = init.btnEnter ? init.btnEnter : 13,
                history = init.history ? init.history : true,
                currentClass = init.currentClass ? init.currentClass : "current",
                doc = id?document.getElementById(id):document.body,
                effect = init.effect ? init.effect : "slide1",
                element = new Array(),
                rules = Object.prototype.toString.call(init.rules) == '[object Object]' ? init.rules : null,
                direction = "y";
            _this.className = init.className ? init.className : "hotbutton";
            this.event = {};
             
            var _tempElem;
            this.currentIndex = parseInt(currentIndex);
            this.defaultIndex = parseInt(currentIndex);
            this.historyFocus={};
            if(!window.focusobj)window.focusobj=document.createElement("span");
            (typeof init.onLoad) == "function" ? init.onLoad: init.onLoad = function () {};
            this.onLoad = function () {

                _this.reLoad();
                this.sourceClassName = _this.className;
                this.sourceLength = element.length;
                //element[currentIndex].classList.add(currentClass);
                _this.prev = element[currentIndex];
                _this.prevIndex = currentIndex;
                _this.current = element[currentIndex];
                _this.currentIndex = currentIndex;
                _this.target = doc;
                init.onLoad.call(_this);
                focusobj.innerHTML='<div class="cssbk"><b class="lt"></b><b class="t"></b><b class="rt"></b><b class="r"></b><b class="rb"></b><b class="b"></b><b class="lb"></b> <b class="l"></b></div>';
                focusobj.classList.add("focusobj");
                focusobj.classList.add("current");
                this.target.appendChild(focusobj);
            }

            this.reSetClass = function (item, index) {
                //新组别 用于弹窗 不同组热键 API
                if(history) //记录开关
                _this.historyFocus[_this.className]=_this.currentIndex;//记录上一组焦点
                index = index ? index : 0;
                _this.prev.classList.remove(currentClass);
                _this.className = item;
               _this.prevIndex= _this.currentIndex=_this.historyFocus[item]?_this.historyFocus[item]:index;
                _this.reLoad();
            }

            self.readFn=function(){

                if((typeof init.onEnterPress) == "function"){
                    init.onEnterPress
                }else{
                    init.onEnterPress = function () {}
                    
                }
                
                
               

                if((typeof init.onPress) == "function"){
                    init.onPress
                }else{
                    init.onPress = function () {}
                     
                }
               
                

            }

            this.reLoad = function () {
            
             
            self.readFn();
                if (doc != null) {

                    element = doc.getElementsByClassName(_this.className);
                    this.hotbtn = element;
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
                    //修复同组的元素变化的问题
                    if (_this.prev.classList.contains(_this.className)&&_this.sourceLength > element.length) {
                        //当元素减少
                        _this.currentIndex = _this.currentIndex - (_this.sourceLength - element.length);
                        _this.prevIndex = _this.prevIndex - (_this.sourceLength - element.length);
                        _this.sourceLength = element.length;
                    } else if (_this.prev.classList.contains(_this.className)&&_this.sourceLength < element.length) {
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
                
                _self.classDo(_this.currentIndex);
                 
                for (var i = 0; i < this.hotbtn.length; i++) {
                    this.hotbtn[i].setAttribute("data-id", i);

                }



            }

            function keydefault(e) {
                try{
                    if (keyRemoveDefault) window.event ? window.event.returnValue = false : e.preventDefault(); 
                }catch(e){
                    //不支持浏览器按键的时候会报错
                }
               
            }

           
            var isSet = false;
            this.setCurrentIndex = function (index) {
                isSet = true;
                index = parseInt(index);


                _this.currentIndex = index;
                _this.current = element[index];

               
            }
            this.viewScrollY = function (y) {
                var view = _this.current.parentNode.parentNode;
                var sumtop=view.getAttribute("data-scroll-y")? parseInt(view.getAttribute("data-scroll-y")):0;
                    var s=sumtop+y+view.clientHeight/2- Math.ceil(_this.current.clientHeight/2);
                   
                    if(s>0)s=0;
                    if(s<=sumtop&&_this.hotbtn[_this.hotbtn.length-1].getBoundingClientRect().bottom<view.getBoundingClientRect().bottom){
                       // 移动到中间 当尾部右边界小于视窗的右边距 
                       s=sumtop;
                     }
                      view.setAttribute("data-scroll-y",s);
                    _this.current.parentNode.style.top=s+"px";

            }
            this.viewScrollX = function (x) {
                var view = _this.current.parentNode.parentNode;
                var sumleft=view.getAttribute("data-scroll-x")? parseInt(view.getAttribute("data-scroll-x")):0;
                
                    var s=sumleft+x+view.clientWidth/2- Math.ceil(_this.current.clientWidth/2);
                     if(s>0)s=0;
                     if(s<=sumleft&&_this.hotbtn[_this.hotbtn.length-1].getBoundingClientRect().right<view.getBoundingClientRect().right){
                       // 移动到中间 当尾部右边界小于视窗的右边距 
                       s=sumleft;
                     }
                      view.setAttribute("data-scroll-x",s);  
                    _this.current.parentNode.style.left=s+"px";
                    //view.scrollLeft = view.scrollLeft + x+(x*0.1);
            }

            
            this.onPress = function (e) {
                init.onPress.call(_this);
              
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

            this.scroll = function () {
                
                  if(_this.current.getBoundingClientRect().bottom>document.body.clientHeight||_this.current.getBoundingClientRect().top<0){
                    var y =_this.current.getBoundingClientRect().top- (document.body.clientHeight/2-_this.current.clientHeight/2);
                    //页面滚动
                       window.scrollTo(0,y);
                   }
                var view=_this.current.parentNode.parentNode;
                var direction = view.getAttribute("data-scroll-direction");
                if(!direction) return;
                  view.style.position="relative";
                  _this.current.parentNode.style.position="absolute";

                 var sumleft=view.getAttribute("data-scroll-x")? parseInt(view.getAttribute("data-scroll-x")):0;
                if(direction=="x"){
                   
                 _this.current.parentNode.style.width=_this.hotbtn.length*_this.current.clientWidth*2+"px";
                 var scroll_left= view.getBoundingClientRect().left-_this.current.getBoundingClientRect().left;
                     
               
                        _this.viewScrollX(scroll_left);
                   
                     
                }
                
                 var sumleft=view.getAttribute("data-scroll-y")? parseInt(view.getAttribute("data-scroll-y")):0;
                if(direction=="y"){
                   
                 var scroll_top= view.getBoundingClientRect().top-_this.current.getBoundingClientRect().top;
                     
               
                        _this.viewScrollY(scroll_top);
                   
                     
                }

               

            }
            
              
            var isload = 0;
            self.classDo = function (index) {
                isload = isload + 1;

                if (isload == 2) {
                    _this.sourceLength = element.length;

                }

                if(element[index])
                element[index].classList.add(currentClass);
                else return;
                //如果元素不存在 不进行渲染 待重载
                for (var i = 0; i < element.length; i++) {
                    if (i!=index&&element[i].classList.contains(currentClass)) {

                        element[i].classList.remove(currentClass);
                    }
                }
                _this.scroll();//渲染的之前先复位
                var effect= element[index].getAttribute("data-effect");
                if(effect){
                    focusobj.setAttribute("style","  position: fixed; z-index: 19;width:"+(element[index].getBoundingClientRect().width)+"px ;height:"+(element[index].getBoundingClientRect().height)+"px; left:"+element[index].getBoundingClientRect().left+"px;top:"+element[index].getBoundingClientRect().top+"px;");
                    focusobj.setAttribute("class","focusobj current "+effect);
                }  else {
                    focusobj.setAttribute("class","hide ");
                     focusobj.setAttribute("style","");
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
                    _self.onPressdo(e);
            });
            self.overIndex=function(){
                //防止超出
                if (_this.currentIndex >= element.length - 1) {
                    _this.currentIndex = element.length - 1;
                }
                if (_this.currentIndex < 0) {
                    _this.currentIndex = 0;
                }
            }
            self.isNumber = function(val){

                var regPos = /^\d+(\.\d+)?$/; //非负浮点数
                var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
                if(regPos.test(val) || regNeg.test(val)){
                    return true;
                }else{
                    return false;
                }

            }
             
            self.ruleFn=function(index,direction){
                   if(rules && typeof rules[_this.className] == "object" &&typeof rules[_this.className]["line"] !="undefined" )
                    {
                        var line = rules[_this.className]["line"];
                    }else{
                        var line=_this.hotbtn.length;
                    }
                   line=parseInt(line);
                   if (rules && typeof rules[_this.className] == "object" && typeof rules[_this.className][_this.currentIndex]!="undefined"&& typeof rules[_this.className][_this.currentIndex][index]!="undefined") {
                         var objRules = rules[_this.className][_this.currentIndex];
                        if(self.isNumber(objRules[index])){
                            _this.currentIndex = parseInt(_this.currentIndex) + parseInt(objRules[index]);
                        }else if(Array.isArray(objRules[index])){
                            //_this.currentIndex = _this.currentIndex + parseInt(objRules[index][1]); 
                            _this.reSetClass(objRules[index][0], objRules[index][1]);
                        }else if(typeof rules[_this.className]["line"] !="undefined"){

                            _this.currentIndex = _this.currentIndex + line; 
                        } 
                        
                    } else {
                        var jump = element[_this.currentIndex].getAttribute("data-"+direction);
                         jump=parseInt(jump);
                          var obj = rules[_this.className];
                        if(direction=="up"){
                            if(_this.currentIndex>line-1) //上边沿
                            _this.currentIndex= jump?_this.currentIndex-jump:_this.currentIndex-line;
                            else if(obj&&typeof obj["up"]!="undefined" )  _this.reSetClass(obj[direction][0], obj["up"][1]);
                        }else if(direction=="left"){
                            if((_this.currentIndex)%line!=0) //左边
                            _this.currentIndex= jump?_this.currentIndex-jump:_this.currentIndex-1;
                            else if(obj&&typeof obj["left"]!="undefined" )  _this.reSetClass(obj["left"][0], obj["left"][1]);
                        }else if(direction=="right"){
                            if((_this.currentIndex+1)%line!=0)  //右边
                            _this.currentIndex= jump?_this.currentIndex+jump:_this.currentIndex+1;
                            else if(obj&&typeof obj["right"]!="undefined" ) _this.reSetClass(obj["right"][0], obj["right"][1]);
                        }else if(direction=="down"){
                             if(_this.hotbtn.length-line>_this.currentIndex) //下边沿
                            _this.currentIndex= jump?_this.currentIndex+jump:_this.currentIndex+line;
                            else if(obj&&typeof obj["down"]!="undefined" )  _this.reSetClass(obj["down"][0], obj["down"][1]);
                        }
                    }
            }
            self.rule = function () {
                self.overIndex();
                if (_this.event.keyCode == btnLeft) {
                    self.ruleFn(0,"left");
                } else if (_this.event.keyCode == btnRight) {
                    self.ruleFn(2,"right");
                } else if (_this.event.keyCode == btnUp) {
                    self.ruleFn(1,"up");
                } else if (_this.event.keyCode == btnDown) {
                    self.ruleFn(3,"down");
                }
                self.overIndex();
            }
            self.onPressdo = function (e) {
                    _this.event = e;
                    _this.currentIndex = _this.currentIndex >= element.length - 1 ? element.length - 1 : _this.currentIndex;
                    _this.prev = element[_this.currentIndex];
                    _this.prevIndex = _this.currentIndex;
                    self.rule();
                    _this.current = element[_this.currentIndex];
                    _this.currentIndex = _this.currentIndex;
                    _this.className = _this.className;
                    
                    if(init.rules[_this.className]&&(typeof init.rules[_this.className]["onPress"]) == "function")
                    init.rules[_this.className]["onPress"].call(_this);
                    else _this.onPress.call(_this);
                    if (e.keyCode == btnEnter){
                        
                        if(init.rules[_this.className]&&(typeof init.rules[_this.className]["onEnterPress"]) == "function")
                        init.rules[_this.className]["onEnterPress"].call(_this);
                        else _this.onEnterPress.call(_this);
                    }
                      
                    _self.classDo(_this.currentIndex);
                    keydefault(e);
            }
                 
            

         this.onLoad();//插件加载时   
        }
        
        window.tvSysBtnBind = tvSysBtnBind;
    })(window)