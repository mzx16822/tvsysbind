# tvsysbind
tvSysBtnBind 插件说明
id 内容所在的id值

currentIndex 默认的索引
prevIndex上一个元素的索引
current 当前元素
prev 上一个元素 

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


	var rules={
	"btn-main":{ //热键的名称
        0:[0,0,3,1],
        1:[0,-1,2,1],
        2:[0,-1,1,1],
        3:[-1,-1,1,1],
        4:[-1,-1,0,0]
    }
/*

加入了光标移动效果 focusobj
元素加入属性 data-effect="tjw"
移动焦点如下 tjw属于自定义样式名

/*

< span class="focusobj tjw" style="display:block; position: fixed; z-index: 19;width:146px ;height:133px; left:631px;top:131px;">< /span >
*/

.focusobj{
  -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
    border: solid #D9A404 3px;
    border-radius: 9px;
}

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

加入了焦点记忆功能支持 
可以参考http://183.251.62.115:8090/tv/h5v2/template/recommend.html?menu_index=1&menu_id=1
插件改动不大

