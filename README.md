<div class="article">
		<div class="section">
			<div class="page-header">
	            <h1 id="plugin">tvSysBtnBind.V2 焦点移动插件</h1>
	        </div>
	        <p>旧版不适合复杂逻辑页面，具体可以参考以往项目代码或者github代码</p>
	        <p>抛砖引玉,期待各位的意见反馈 @大雄</p>
	        <p>参考案例 <a href="http://120.78.169.79:6001/sxrj/loading.html" target="_blank">书香人家</a></p>
	        <h2>配置参数列表</h2>


		  
	              	<table class="table table-bordered table-striped">
	<thead>
		<tr>
			<th><span style="font-weight: 400;">参数名</span></th>
			<th><span style="font-weight: 400;">数据类型</span></th>
			<th><span style="font-weight: 400;">是否必须</span></th>
			<th><span style="font-weight: 400;">说明</span></th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>id</td>
			<td>string</td>
			<td>否</td>
			<td>绑定的内容id</td>
		</tr>
		<tr>
			<td>className</td>
			<td>string</td>
			<td>是</td>
			<td>绑定的按键class</td>
		</tr>
		<tr>
			<td>currentClass</td>
			<td>string</td>
			<td>否</td>
			<td>当前焦点class</td>
		</tr>
		<tr>
			<td>history</td>
			<td>boolean</td>
			<td>否</td>
			<td>默认true 记录键组最后焦点位置<a href="#historyFocus">详细</a></td>
		</tr>
		
		<tr>
			<td>rules</td>
			<td>Object</td>
			<td>否</td>
			<td>按键规则对象<a href="plugin.html#rules">案例</a></td>
		</tr>
		<tr>
			<td>keyRemoveDefault</td>
			<td>boolean</td>
			<td>否</td>
			<td>默认false 移除浏览器默认按键事件 部分机顶盒存在这个问题</td>
		</tr>
		
		<tr>
			<td>currentIndex</td>
			<td>int</td>
			<td>否</td>
			<td>默认焦点索引</td>
		</tr>
		<tr>
			<td>onEnterPress</td>
			<td>function</td>
			<td>否</td>
			<td>回车触发的公共事件</td>
		</tr>
		<tr>
			<td>onPress</td>
			<td>function</td>
			<td>否</td>
			<td>所有按键触发的公共事件</td>
		</tr>
	</tbody>
</table>

	     <h2>下载地址</h2>
<a href="https://github.com/mzx16822/tvsysbind" target="_blank">tvSysBtnBindV2 github地址 </a>
	             <h2>案例</h2>
	             <pre><code class="hljs dts">var btnConfig={
<span class="hljs-symbol">    id:</span><span class="hljs-string">"Jdoc"</span>,<span class="hljs-comment">//为空 默认绑定document.body</span>
<span class="hljs-symbol">    className:</span> <span class="hljs-string">"hotbtn"</span>,<span class="hljs-comment">//绑定的组别</span>
<span class="hljs-symbol">    rules:</span>rules,<span class="hljs-comment">//绑定的按键组别规则</span>
<span class="hljs-symbol">    currentIndex:</span><span class="hljs-number">0</span>,<span class="hljs-comment">//默认焦点索引</span>
<span class="hljs-symbol">    onEnterPress:</span>onEnterPress,<span class="hljs-comment">//回车触发的公共事件 this.event 监听对象</span>
<span class="hljs-symbol">    onPress:</span>onPress<span class="hljs-comment">//所有按键触发的公共事件 this.event 监听对象</span>
}
window.mainbtnobj = new tvSysBtnBind(btnConfig);
</code></pre>
	         <h2 id=rules>插件规则设置</h2> 
	         <pre><code class="hljs prolog">//键组命名最好与样式区分 以便修改
var table=<span class="hljs-string">"reco"</span>;//动态设置规则
var enterpress=function(){//回车事件}
var press=function(){//按键事件}
var rules = {
    //nav代表class=nav的分组
    <span class="hljs-string">"nav"</span>: {
        //<span class="hljs-number">0</span>~<span class="hljs-number">5</span>代表元素的索引
        //数组中分别是[左,上,右,下]
        // [<span class="hljs-string">"search"</span>, <span class="hljs-number">0</span>]代表对应键去到search组，中的<span class="hljs-number">0</span>代表去到该分组的索引值 不填默认为<span class="hljs-number">0</span> 其他方法同理
        //table.toString() 一般用于动态设置去不同位置table为class的值 需要重新加载插件函数
        <span class="hljs-number">0</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, [table.toString(), <span class="hljs-number">0</span>]],
        <span class="hljs-number">1</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, [table.toString(), <span class="hljs-number">0</span>]],
        <span class="hljs-number">2</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, [table.toString(), <span class="hljs-number">0</span>]],
        <span class="hljs-number">3</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, [table.toString(), <span class="hljs-number">0</span>]],
        <span class="hljs-number">4</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, [table.toString(), <span class="hljs-number">0</span>]],
        <span class="hljs-number">5</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, [<span class="hljs-string">"showplayer"</span>], [table.toString(), <span class="hljs-number">0</span>]],
        onEnterPress:enterpress, //传入事件 代表这个组键的回车事件只会触发这个函数 不会触发公共函数的onEnterPress
        onPress:press //传入事件 代表这个组键的按键事件只会触发这个函数 不会触发公共函数的onEnterPress
        //如果函数为空 默认触发公共事件
        
        
    },
    <span class="hljs-string">"search"</span>: {
        <span class="hljs-number">0</span> : [<span class="hljs-number">0</span>, [<span class="hljs-string">"nav"</span>, parseInt(navIndex)], <span class="hljs-number">1</span>, [<span class="hljs-string">"btn"</span>, <span class="hljs-number">0</span>]],
        <span class="hljs-number">1</span> : [ - <span class="hljs-number">1</span>, [<span class="hljs-string">"nav"</span>, parseInt(navIndex)], [<span class="hljs-string">"s-list"</span>, <span class="hljs-number">0</span>], [<span class="hljs-string">"btn"</span>, <span class="hljs-number">3</span>]],
    },<span class="hljs-string">"list"</span>:{
      <span class="hljs-string">"line"</span>:<span class="hljs-number">4</span>,//每行<span class="hljs-number">4</span>个 必须要设置 下面的上下左右才会生效，不然是算不出边沿元素的 不设置的方向 焦点保持原位置不变
      <span class="hljs-string">"left"</span>: [<span class="hljs-string">"menu"</span>,<span class="hljs-number">0</span>],//当到键值到（左边）沿要跳去的键组 去到的键组的索引
      <span class="hljs-string">"up"</span>: [<span class="hljs-string">"nav"</span>,<span class="hljs-number">0</span>],//当到键值到（上边）沿要跳去的键组 去到的键组的索引
      <span class="hljs-string">"right"</span>: [<span class="hljs-string">"adbord"</span>],//当到键值到（右边）边沿要跳去的键组 去到的键组的索引
      <span class="hljs-string">"down"</span>: [<span class="hljs-string">"page"</span>, <span class="hljs-number">0</span>]//当到键值到（下边）边沿要跳去的键组 去到的键组的索引
    }
  //  .......
}

//或者
var rules = {};
rules[<span class="hljs-string">"nav"</span>] = {
    <span class="hljs-number">0</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, [table.toString(), <span class="hljs-number">0</span>]],
    <span class="hljs-number">1</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, [table.toString(), <span class="hljs-number">0</span>]],
    <span class="hljs-number">2</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, [table.toString(), <span class="hljs-number">0</span>]],
    <span class="hljs-number">3</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, [table.toString(), <span class="hljs-number">0</span>]],
    <span class="hljs-number">4</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, [table.toString(), <span class="hljs-number">0</span>]],
    <span class="hljs-number">5</span> : [ - <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, [<span class="hljs-string">"showplayer"</span>], [table.toString(), <span class="hljs-number">0</span>]]
};
rules[<span class="hljs-string">"search"</span>] = {
    <span class="hljs-number">0</span> : [<span class="hljs-number">0</span>, [<span class="hljs-string">"nav"</span>, parseInt(navIndex)], <span class="hljs-number">1</span>, [<span class="hljs-string">"btn"</span>, <span class="hljs-number">0</span>]],
    <span class="hljs-number">1</span> : [ - <span class="hljs-number">1</span>, [<span class="hljs-string">"nav"</span>, parseInt(navIndex)], [<span class="hljs-string">"s-list"</span>, <span class="hljs-number">0</span>], [<span class="hljs-string">"btn"</span>, <span class="hljs-number">3</span>]],
};
......
rules[<span class="hljs-string">"s-list"</span>] = {
    <span class="hljs-string">"line"</span>: <span class="hljs-number">4</span>,
    <span class="hljs-string">"left"</span>: [<span class="hljs-string">"search"</span>],
    <span class="hljs-string">"up"</span>: [<span class="hljs-string">"nav"</span>, parseInt(navIndex)],
}
</code></pre>  
<h2 class="apiport">API 接口</h2>


<h4>快速跳键组函数</h4>
<pre>this.reSetClass(classItem, index) //classItem 设置跳指定键组 ，index 设置跳指定键组的索引</pre>
<p>跳索引</p>
<pre>this.setCurrentIndex(index); //要跳的索引值</pre>

<h4>当前组件监听的对象</h4>
<pre>this.target</pre>
<p>只执行这个对象范围内的键组，也就是配置中id的对象元素，如果不设置默认为body</p>
<h4>当前元素</h4>
<pre>this.current</pre>
<p>current当前焦点元素对象 object</p>
<h4>前一个元素</h4>
<pre>this.prev</pre>
<p>prev按键前一个对象， 当按键按下，当前元素就成了上一个元素，移动后的元素是current</p>
<p>this.prev this.current均拥有对象操作方法 </p>
<h4>重载元素</h4>
<pre>this.reLoad()</pre>
<p>当元素发生改变，可以通过reLoad()重载元素</p>
<p></p>

<h4>监听对象</h4>
<pre>this.event</pre>
<p>当前按键的对象 包括了keyCode等监听对象</p>

<h4>当前键组名</h4>
<pre>this.className</pre>
<p>随键组名变化而变化 获取函数加载或者new对象后的默认键值/索引 this.sourceClassName/this.defaultIndex</p>

<h4 id="historyFocus">键组历史焦点对象</h4>
<pre>this.historyFocus //例如{detailBtn: 0,epgPlayer: 0,page: 2,playlist: 2}</pre>
<p>键组最后的焦点索引记录 默认会回到键组最后落在的焦点上 如不需要 配置 history:false</p>

<h2 id="eleop">元素设置</h2>
<p>例子 </p>
<code>&lt;div id="Jscroll"&gt;&lt;div data-left="2" data-up="4" class="nav hotbtn" data-effect="tjw" data-scroll="Jscroll"&gt;按键1&lt;/div&gt;&lt;/div&gt;</code>
<p >方向设置（有对象规则后 很少用的上） data-up=&quot;9&quot;</p>

<p >data-left=&quot;9&quot;</p>

<p >data-down=&quot;9&quot;</p>

<p >data-right=&quot;9&quot;</p>

<p>data-effect="tjw" 设置会生成一个浮动在焦点上的移动元素 如下</p>
<code>&lt; span class="focusobj tjw" style="display:block; position: fixed; z-index: 19;width:146px ;height:133px; left:631px;top:131px;"&gt;&lt; /span &gt;</code>
<p>data-scroll="Jscroll" 表示焦点移动时会滚动Jscroll这个设置的标签</p>


		</div>
	</div>
</div>
