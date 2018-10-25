# tvsysbind
tvSysBtnBind 插件说明
id 内容所在的id值

currentIndex 默认的索引

btnLeft 键值

btnUp 键值

btnRight 键值

btnDown 键值

btnEnter 键值

className 绑定热键名

currentClass 设置的样式名

keyRemoveDefault 移除默认事件

方向设置
data-top="9"

data-left="9"

data-dow="9"

data-right="9"

数字代表跳的相隔值


rules:{

0:[0,0,3,1],

1:[0,-1,2,1],

2:[0,-1,2,0],

3:[-3,0,3,1],

4:[-2,-1,1,0],

5:[-1,-2,4,0],

6:[-3,0,5,1],

7:[-4,-1,1,2],

8:[-1,-2,3,2],

9:[-4,-2,1,0],

10:[-1,-2,2,0],

11:[-5,0,2,1],

12:[-2,-1,3,0],

13:[-2,0,3,1],

14:[-3,-1,2,1],

15:[-3,-1,2,0],

16:[-3,0,0,1],

17:[-2,-1,0,0],

}

/*

v
1 ，可以指定按键触发后方向 data-dow="3" 表示当按下向下按键 会使热键跳到现在位置后3位 其实就是索引+3 ；

2 ，也可以在父元素指定每行元素个数 data-num，插件会自动计算上下左右，但是只适合有规律的板块 没有规律就按上面提到的进行指定位置；

*/


API btn.setCurrentIndex(index) 设置索引直接跳到某个位置

API btn.reSetClass(class) 设置分组热键

API btn.reLoad() 重载插件元素
不支持获取class的情况 每个热键设置id
var eleIds=new Array();

for (var i = 1; i <= 15; i++) {

eleIds.push("iptv_"+i)

}

var btn = new tvSysBtnBind({

rules:rules,

// 规则列表 顺序左上右下 数字代表相应方向需要变化几位 将会加入建组支持
currentClass:"current",

keyRemoveDefault:false,

eleIds:eleIds,

onEnterPress:function(){

document.getElementById("Jtest").innerHTML=this.current.getAttribute("data-id");

console.log(this)

// this.target 绑定区域
// this.event 监听
// this.current 当前元素
// this.currentIndex 当前索引
},

onPress:function(){

}

});
加入了焦点记忆功能支持 可以参考http://183.251.62.115:8090/tv/h5v2/template/recommend.html?menu_index=1&menu_id=1
插件改动不大
主要利用MD5唯一性 每个不同页面地址转MD5 然后点击的时候 记录当前的currentIndex

......
},
		onEnterPress: function(obj) {
			//互绑定按键函数 公用确定按键方法在这
			var _this = this;
			 
			
			_this.setCookie(comm.data.pagemd5,btn.currentIndex);
			var url=btn.current.getAttribute("data-href");//文件路径地址
			 if(url=="isvip"){
			 	comm.tis("您已经开通了会员啦！");
			 	return
			 }
......

然后在ajax请求结束再读取

......
},checkAjax:function(xhr){
			var _this = this;
			return xhr.onloadend=function(){
						_this.data.sum=_this.data.sum-1;
							if(_this.data.sum<=0){

								console.log("已经全部请求完毕");
								setTimeout(function(){
									//自动定位焦点到内容
									if(_this.data.menulen>0){
										var currentIndex= parseInt(_this.data.MenuTaglen)+parseInt(_this.data.menulen);
										if(_this.data.menu_index==6)currentIndex=currentIndex+2;
										// 	btn.setCurrentIndex(currentIndex);
											 
											 if(_this.getCookie(comm.data.pagemd5)) {
											 	currentIndex=_this.getCookie(comm.data.pagemd5);
											 }else {
											 	currentIndex=currentIndex;
											 } 
			  									btn.setCurrentIndex(currentIndex);
			  									if(_this.data.menu_index==1){
			  									 if (btn.current.parentNode.parentNode.classList.contains("tab2")) {
											        btn.viewScrollX(mScroll, mScroll.clientWidth)
											      } else if (btn.current.parentNode.parentNode.classList.contains("tab1")) {
											        btn.viewScrollX(mScroll, -mScroll.clientWidth)
											      }
											     }
									}
							
									btn.reLoad();
								
								},20);
								_this.closeLoading();   
							}

			        	};
			

		},closeAjax:function(xhr){
    ......
ps: 一些地方会有一些看不见的问题 需要具体制定优化 
