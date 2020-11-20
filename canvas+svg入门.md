## svg介绍

教程：

https://wiki.developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Getting_Started

https://wiki.developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial

Scalable Vector Graphic  可伸缩的矢量图 svg

JPEG png 点阵图像模式，光栅图，raster img，栅格图，像素图等；svg是完全不同的

svg可以支持搜索，索引，编写脚本；可以在任何文本编辑器和绘图软件来绘制；无限放大而不失真，可以方便的修改内容；实现了DOM接口。是w3c的开发标准。

加载慢是SVG的一个缺点

## svg的标签元素

SVG 图像是使用各种元素创建的，这些元素分别应用于矢量图像的结构、绘制与布局……

元素就是html里的标签，svg支持的标签非常多：https://wiki.developer.mozilla.org/zh-CN/docs/Web/SVG/Element

* svg    根元素，表示这是一个svg定义 （三个属性：viewBox，width，height）

* **path**    这是万能元素，一切形状都可以定义为path （最重要的属性d ，定义如何绘制路径，包括系列路径指令）

  ``` html
  <!-- 5个简单常用指令：M L H V Z -->
  <!-- 曲线相关指令：C+S，Q+T，A -->
  大写表示绝对单位，小写表示相对单位；以上指令只有M不画线，仅仅是移动当前位置。
  ```

  

* defs   内部的定义不会呈现，但是可以重复使用。相当于定义一个可以重复使用的组件

* **use**   用于复用【defs内部定义的】组件的 （也有xlink:href 表示的是使用的路径）

  ```html
  <use xlink:href="#MyPath" fill="none" stroke="red" />   <!-- MyPath 是某个路径元素（如path）的id -->
  ```

* clipPath   定义裁剪路径的，内部的定义不会呈现。（裁剪元素通过use进行）

* g   这是创建组合的标签，内部的元素被视为一个组合：作用在g上的所有变换（如旋转，缩放）将同步施加到所有子元素上；且可以作为多个组件组合成更复杂组件的方式。

* symbol   和g一样，不过symbol定义不呈现

* style   样式标签，特性和html中的style一样

* script    脚本标签  和html中的script一样

* pattern    用于场景：使用预定义的图形对一个对象进行填充（fill）或描边（stroke）



* **text**，定义由文字组成的图形 （属性：text-anchor设置middle应该是垂直居中，x，y ，fill设置填充颜色，font-family，font-size）

* **textPath**，text是笔直的呈现文字，这个更强大，可以绘制一个曲线path来决定文字的呈现路径（xlink:href 引用定义好的路径；元素必须放在text元素内部，作为其子元素）

  ```html
  <text font-family="Verdana" font-size="42.5">
      <textPath xlink:href="#MyPath">
          We go up, then we go down, then up again
      </textPath>
  </text>
  ```

* mask  用于制作遮罩层、背景

* **a**，包括的内容点击将是一个超链接。（支持 ` xlink:href ` 超链接 ，target 属性，` target="_blank"`）



更多高级主题：

* 渐变：stop  radialGradient    linearGradient  meshgradient
* 动画：animate    animateColor   animateMotion   animateTransform   discard   mpath  等
* 滤镜：超级多的f开头的标签，太多了这里就不写了！教程：https://wiki.developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Filter_effects 
* 描述性信息：desc   metadata    title；与js交互；旋转……

## 贝塞尔曲线

创建连续的曲线，两个曲线的衔接处 斜率不变是看起来平滑的关键！

为了保持斜率不变，第二条曲线的第一个控制点和前一条曲线的最后一个控制点应该是**对称**的，对称中心就是第二条曲线的起点（也是第一条曲线的终点）

### svg

path元素d属性中的贝塞尔曲线指令：

**三次**：C    用来创建连续平滑曲线的 S  （三次贝塞尔曲线需要四个点，起点（当前点，不用写），第一个控制点也称起点控制点（S指令自动计算得到，无需写），第二个控制点也称终点控制点，终点。

S 指令无需指明第一个控制点了（第一个控制点始终由前一条曲线决定），只需指明第二个控制点和终点。S指令必须接在C指令或S指令后面，否则就会将当前点（起点）作为第一个控制点

``` html
<path d="M 10 80 
    C 40 10, 65 10, 95 80 
    S 150 150, 180 80" stroke="black" fill="transparent" />
 <!-- 点65 10 和125 150 是对称的，对称中心是95 80，为了简化这个计算，可用S指令 -->
```

**二次**：Q    用来创建连续平滑曲线的T  （需要3个点，起点，一个控制点，终点）

``` html
<path d="M10 80 
    Q 52.5 10, 95 80 
    T 180 80" stroke="black" fill="transparent" />
```

### canvas

和svg一样，只有这两个方法，似乎在画连续的平滑曲线方面没有svg方便

``` js
quadraticCurveTo(cp1x, cp1y, x, y)   // 二次贝塞尔曲线
bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)   // 三次贝塞尔曲线
```



## 弧线(svg完胜)

svg和canvas绘制弧线差别非常大：

### svg

A指令   xr yr rotate isLargeRadius isClockWise  dx dy

```html
<path d="M80 230
    A 45 45, 0, 0, 1, 125 275
    L 125 230 " fill="purple" />
```

svg中非常灵活，前三个参数决定了椭圆的形状  （x轴半径，y轴半径，倾斜角度），最后两个参数的坐标，和当前坐标来截取这个椭圆有4中情况。
第四个参数 0 或1，表示是否选择弧度较大的弧线，排除两种情况。
第五个参数 0或1，表示是否（从当前点到终点）顺时针画弧，最终确定情况。

### canvas

借助ctx的 arc 和 arcTo 两个方法画弧，感觉canvas画弧的局限很大，只能画圆形的弧，不能画椭圆形的弧！

`ctx.arc(75, 75, 50, 0, Math.PI * 2, true)`  前三个参数分别表示圆心坐标和半径，接下来两个参数是起点角度和终点角度，最后一个参数是从起点到终点的绘制方向。
注意：0角度 是圆形的右侧！角度计算是顺时针增加，逆时针减少的！
注意：第6个参数命名 anticlockwise ，true表示逆时针。

`arcTo(x1, y1, x2, y2, radius)` 感觉这又是一个很鸡肋的方法，其画弧的原理是：
当前点，第一个控制点(x1,y1)，第二个控制点(x2,y2)，三个点依次组成一个夹角。
圆弧就是与夹角两边相切，半径为radius的圆的 靠角的那一段，也就是小弧。如果要取大弧，感觉完全没有办法了，只能回到arc方法。
当前点和弧的起点是以直线相连，其实是起点和第一个控制点这段线的一部分。

这样的画弧方法，容错性非常差，需要准确计算好一些列数据。

## 常用形状

### 长方形(svg完胜)

svg使用非常灵活的rect标签，用来创建矩形路径，包括带圆角的矩形。（属性：x,y 左上角坐标；width，height；rx，ry 角的弧度半径，弧度是个椭圆弧）

``` html
<rect x="1" y="1" width="998" height="298" fill="none" stroke="black" stroke-width="4" />
```

canvas则提供了四个方法：

```js
fillRect(x, y, width, height)   // 填充绘制
strokeRect(x, y, width, height) // 绘制矩形框
clearRect(x, y, width, height)  // 清理指定区域的绘制，重新变成透明的
rect(x, y, width, height)       // 没有绘制，仅仅是产生了一个矩形路径。路径首先自动moveTo(x,y)
```

canvas没法直接创建带圆角的矩形，只能借助arc（或arcTo）+path 来实现了。例：

``` js
function strokeRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.lineTo(x + width - radius, y + height);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.lineTo(x + width, y + radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.lineTo(x + radius, y);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.stroke();
}
```





### 圆形和椭圆（canvas不明）

**circle** 用来创建圆形路径 （属性：cx，cy，r，圆心坐标和半径）

ellipse 创建椭圆形状路径  （属性：cx，cy，rx，ry，圆心 + 两个半径）

``` html
<ellipse cx="60" cy="60" rx="50" ry="25" />
<circle cx="60" cy="60" r="50" />
```

### 直线，折线，多边形（svg）

* line 用于连接两点一线  （属性 x1,y1,  x2,y2 ）
* polyline  折线。（属性` points="60 110, 65 120, 70 115,……"` ）
* polygon  多边形。（属性也是points和polyline一样。）

