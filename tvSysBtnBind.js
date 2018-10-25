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
        get: function() {
            var self = this;
            function update(fn) {
                return function(value) {
                    var classes = self.className.split(/\s+/g),
                        index = classes.indexOf(value);

                    fn(classes, index, value);
                    self.className = classes.join(" ");
                }
            }

            return {
                add: update(function(classes, index, value) {
                    if (!~index) classes.push(value);
                }),

                remove: update(function(classes, index) {
                    if (~index) classes.splice(index, 1);
                }),

                toggle: update(function(classes, index, value) {
                    if (~index)
                        classes.splice(index, 1);
                    else
                        classes.push(value);
                }),

                contains: function(value) {
                    return !!~self.className.split(/\s+/g).indexOf(value);
                },

                item: function(i) {
                    return self.className.split(/\s+/g)[i] || null;
                }
            };
        }
    });
}
//classList兼容
(function(window) {
  var tvSysBtnBind = function(init) {
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
        rules= Object.prototype.toString.call(init.rules)=='[object Object]'?init.rules:null,
        direction = "y";
      _this.className = init.className ? init.className : "hotbutton";
      this.event = {};
      var sumX = 0,
        timesX = 0,
        sumY = 0,
        timesY = 0;
      var eleIds = init.eleIds ? init.eleIds : false;
      var _tempElem;
       currentIndex=parseInt(currentIndex);
      this.defaultIndex=currentIndex;

      (typeof init.onEnterPress) == "function" ? init.onEnterPress : init.onEnterPress = function() {};
      (typeof init.onPress) == "function" ? init.onPress : init.onPress = function() {};
      (typeof init.onLoad) == "function" ? init.onLoad : init.onLoad = function() {};

      this.onLoad = function() {
          console.log(Object.prototype.toString.call(init.rules))
        _this.reLoad();
        //element[currentIndex].classList.add(currentClass);
        _this.prev = element[currentIndex];
        _this.prevIndex = currentIndex;
        _this.current = element[currentIndex];
        _this.currentIndex = currentIndex;
        _this.target = doc;
        init.onLoad.call(_this);

      }

      this.reSetClass = function(item) {
        //新组别 用于弹窗 不同组热键 API
        _this.currentIndex = 0;
        _this.prevIndex = 0;
       // _this.current.classList.remove(currentClass);
        _this.className = item;
        
         
        _this.reLoad();

      }
      this.reLoad = function() {

        //避免无绑定的元素报错 //接口重新reload后依然没数据还是会报错的
        if (typeof(element[_this.currentIndex]) == "undefined") {
          _tempElem = document.createElement("span");
          _tempElem.setAttribute("class", _this.className + " hide");
          doc.appendChild(_tempElem);
        } else if(_this.hotbtn.length>1) {
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
 
        if(_this.currentIndex||_this.currentIndex==0){
          
          _this.currentIndex = parseInt(_this.currentIndex) ;
        }else{
          _this.currentIndex =parseInt(init.currentIndex);
        }
        _this.prev = element[_this.currentIndex];
        _this.prevIndex = _this.currentIndex;
        _this.current = element[_this.currentIndex];
        _this.currentIndex = _this.currentIndex;
        


        //原本是self.classDo(_this.currentIndex);
        //现在改成：
        self.rule();
       // self.classDo(_this.currentIndex);


        for (var i = 0; i < this.hotbtn.length; i++) {
          this.hotbtn[i].setAttribute("data-id", i);

        }

      }

      function keydefault(e) {
        if (keyRemoveDefault) window.event ? window.event.returnValue = false : e.preventDefault()
      }

      this.hasClass = function(obj, cls) {

        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
      }
      this.addClass = function(obj, cls) {
        if (!_this.hasClass(obj, cls)) obj.className += " " + cls
      }
      this.removeClass = function(obj, cls) {
        if (_this.hasClass(obj, cls)) {
          var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
          obj.className = obj.className.replace(reg, ' ')
        }
      }
      this.toggleClass = function(obj, cls) {
        if (_this.hasClass(obj, cls)) {
          _this.removeClass(obj, cls)
        } else {
          _this.addClass(obj, cls)
        }
      }
      this.setCurrentIndex = function(index) {

        index = parseInt(index);
        
        //if(index>_this.hotbtn.length-1)index=_this.hotbtn.length-1;
       // if(index<0)index=0;
       // if (!element[index]) return;
        _this.currentIndex = index;
        _this.current = element[index];
        // self.classDo(index)
         _this.scroll();
      }
      this.viewScrollY = function(view, y) {

        if (effect == "slide") {
          clearInterval(timesY);
          var top = view.scrollTop;

          sumY = 0;
          timesY = setInterval(function() {
            sumY=sumY+1;
            if (y > 0) {
              view.scrollTop = view.scrollTop + sumY;
              if (view.scrollTop-top >=  y) clearInterval(timesY)
            } else {
              view.scrollTop = view.scrollTop - sumY;

              if (view.scrollTop-top <=  y||view.scrollTop==0) clearInterval(timesY)
            }
          }, 10)
        } else {
          view.scrollTop = view.scrollTop + y;
        }

      }
      this.viewScrollX = function(view, x) {
 
        if (effect == "slide") {
          clearInterval(timesX);
          var left = view.scrollLeft;
          sumX = 0;

          timesX = setInterval(function() {
               sumX=sumX+1;
            if (x > 0) {
               view.scrollLeft = view.scrollLeft + sumX;  
                if (view.scrollLeft + sumX >=  left + x) {
                     clearInterval(timesX);
                      
                      view.scrollLeft =view.scrollLeft +(view.scrollLeft + sumX)-(left + x);
                     
                };
                
                 
            } else {
              
              view.scrollLeft = view.scrollLeft - sumX; 
              if (view.scrollLeft - sumX <= left+ x ||view.scrollLeft==0){ 
                 clearInterval(timesX);
                 view.scrollLeft =view.scrollLeft -((view.scrollLeft + sumX)-(left + x));
                  
              }
                
              
            }
          }, 10)
        } else {
          view.scrollLeft = view.scrollLeft + x;
        }
      }
      this.onEnterPress = function() {

        init.onEnterPress.call(_this);
        

      }
      self.getScrollTop=function(){
        var scrollTop=0;
        if(document.documentElement&&document.documentElement.scrollTop){
            scrollTop=document.documentElement.scrollTop;
        }else if(document.body){
            scrollTop=document.body.scrollTop;
        }
        return scrollTop;
    }
      this.scroll = function(scrollId) {
        if(!_this.current) return;
        var scrollId = scrollId ? scrollId : _this.current.getAttribute("data-scroll");


        if (scrollId) {
          var view = document.getElementById(scrollId);
 
          if (_this.current.getBoundingClientRect().top>view.offsetHeight  || _this.current.getBoundingClientRect().top-view.offsetHeight < 0 || _this.current.getBoundingClientRect().bottom > view.offsetHeight) {
            _this.viewScrollY(view, _this.current.getBoundingClientRect().bottom - view.offsetHeight+60);

          }
          
 
          if (view.getAttribute("data-scroll-direction") == "x") {

            var col = view.children[0].children,
              _temp = 0;
            for (var i = 0; i < col.length; i++) {

              _temp = _temp + (col[i].offsetWidth * 1.08);


            }
          
            view.children[0].setAttribute("style","width:"+_temp+"px") ;
          }

          if (_this.current.getBoundingClientRect().left>view.offsetWidth  || _this.current.getBoundingClientRect().left-view.offsetWidth < 0 || _this.current.getBoundingClientRect().right > view.offsetWidth) {
            _this.viewScrollX(view, _this.current.getBoundingClientRect().right - view.offsetWidth);

          }


        }


        //页面自动上下滚动
        //comm.tis(document.body.offsetWidth);
        var mainY=0;
        var page = setInterval(function() {
          mainY=mainY+20;
          
          if (_this.current.getBoundingClientRect().top < 0) {
            
            window.scrollTo(0,  window.getScrollTop()-mainY);

          } else if (_this.current.getBoundingClientRect().bottom > document.body.offsetHeight) {
          
            window.scrollTo(0, window.getScrollTop() + mainY);
          } else {

            mainY = 0;
            clearInterval(page)
          }

        }, 10)

      }
      this.onPress = function(e) {

      
       
        init.onPress.call(_this);
         _this.scroll();

         
      }
      self.classDo = function(index) {
         element[index].classList.add(currentClass);
          for (var i = 0; i < element.length; i++) {
            if (i != index) {

              element[i].classList.remove(currentClass)
            }
          }
        // try {
        //   element[index].classList.add(currentClass);
        //   for (var i = 0; i < element.length; i++) {
        //     if (i != index) {

        //       element[i].classList.remove(currentClass) ; 
        //     }
        //   }
        // } catch (e) {
          
        //   _this.addClass(element[index], currentClass);
          

        //   for (var i = 0; i < element.length; i++) {
        //     if (i != index) {
        //       _this.removeClass(element[i], currentClass)
        //     }
        //   }
        // }

        // _this.addClass(element[index], currentClass);
          

        //   for (var i = 0; i < element.length; i++) {
        //     if (i != index) {
        //       _this.removeClass(element[i], currentClass)
        //     }
        //   }
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
        // setTimeout(function (argument) {
          
        // },200)
        _self.EventUtil(e);
        
      });
      self.rule = function() {
          // rules={   l u r d
          //    0:[0,0,0,0],
          //    1:[0,0,0,0]
          //  }
       
         if (_this.currentIndex > element.length - 1) {
          _this.currentIndex = element.length - 1;
        }
        if (_this.currentIndex < 0) {
          _this.currentIndex = 0;
        }
       
        var num = element[_this.currentIndex].parentNode.parentNode.parentNode.getAttribute("data-num") || element[_this.currentIndex].parentNode.parentNode.getAttribute("data-num") || element[_this.currentIndex].parentNode.getAttribute("data-num") || element[_this.currentIndex].parentNode.children.length;
     
        if (_this.event.keyCode == btnLeft) {
          if(rules&&rules[_this.currentIndex]){
            _this.currentIndex=_this.currentIndex+rules[_this.currentIndex][0];
          }else{
            var left = element[_this.currentIndex].getAttribute("data-left");
             _this.currentIndex = left ? _this.currentIndex = _this.currentIndex - Math.abs(left) : _this.currentIndex = _this.currentIndex - 1;
          }
          
          

        } else if (_this.event.keyCode == btnRight) {
          if(rules&&rules[_this.currentIndex]){
            _this.currentIndex=_this.currentIndex+rules[_this.currentIndex][2];
          }else{
            var right = element[_this.currentIndex].getAttribute("data-right");
            _this.currentIndex = right ? _this.currentIndex = _this.currentIndex + Math.abs(right) : _this.currentIndex = _this.currentIndex + 1;
          }
        } else if (_this.event.keyCode == btnUp) {
          if(rules&&rules[_this.currentIndex]){
            _this.currentIndex=_this.currentIndex+rules[_this.currentIndex][1];
          }else{
            var up = element[_this.currentIndex].getAttribute("data-up");
            _this.currentIndex = up ? _this.currentIndex = _this.currentIndex - Math.abs(up) : _this.currentIndex = _this.currentIndex - parseInt(num);
          }
        } else if (_this.event.keyCode == btnDown) {
          if(rules&&rules[_this.currentIndex]){
            _this.currentIndex=_this.currentIndex+rules[_this.currentIndex][3];
          }else{
          var dow = element[_this.currentIndex].getAttribute("data-dow");

          _this.currentIndex = dow ? _this.currentIndex = _this.currentIndex + Math.abs(dow) : _this.currentIndex = _this.currentIndex + parseInt(num);
       }
        }
         if (_this.currentIndex > element.length - 1) {
          _this.currentIndex = element.length - 1;
        }
         if (_this.currentIndex < 0) {
          _this.currentIndex = 0;
        }
         
         setTimeout(function(){
          _self.classDo(_this.currentIndex);
        },0)
        //原规则走动置后 防止重新渲染

      }
      self.EventUtil = function(e) {
        _this.event = e;
        _this.prev = element[_this.currentIndex];
        _this.prevIndex = _this.currentIndex;
        self.rule();
        _this.current = element[_this.currentIndex];
        _this.currentIndex = _this.currentIndex;
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
