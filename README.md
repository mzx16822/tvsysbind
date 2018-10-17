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
