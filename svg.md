教程：https://wiki.developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Getting_Started

https://wiki.developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial

Scalable Vector Graphic  可伸缩的矢量图 svg

JPEG png 点阵图像模式；svg是完全不同的

svg可以支持搜索，索引，编写脚本；可以在任何文本编辑器和绘图软件来绘制；无限放大而不失真，可以方便的修改内容；实现了DOM接口。是w3c的开发标准。

加载慢是SVG的一个缺点

## 元素

SVG 图像是使用各种元素创建的，这些元素分别应用于矢量图像的结构、绘制与布局……

元素就是html里的标签，svg支持的标签非常多：https://wiki.developer.mozilla.org/zh-CN/docs/Web/SVG/Element



* svg    根元素，表示这是一个svg定义
* path    这是万能元素，一切形状都可以定义为path

* defs   内部的定义不会呈现，但是可以重复使用。相当于定义一个可以重复使用的组件
* use   用于复用【defs内部定义的】组件的
* clipPath   定义裁剪路径的，内部的定义不会呈现。（裁剪元素通过use进行）
* g   这是创建组合的标签，内部的元素被视为一个组合：作用在g上的所有变换（如旋转，缩放）将同步施加到所有子元素上；且可以作为多个组件组合成更复杂组件的方式。
* symbol   和g一样，不过symbol定义不呈现
* style   样式标签，特性和html中的style一样
* script    脚本标签  和html中的script一样
* pattern    用于场景：使用预定义的图形对一个对象进行填充（fill）或描边（stroke）



* rect，用来创建矩形的元素，包括带圆角的矩形
* circle 用来创建圆形的元素
* ellipse 创建椭圆形状
* line 用于连接两点一线
* polygon  构建首尾相连的由直线构成的闭合多边形
* polyline  构建一些列直线连接的点，不自动闭合。其实就是构建折线的。
* text，定义由文字组成的图形
* textPath，text是笔直的呈现文字，这个更强大，可以绘制一个曲线path来决定文字的呈现路径
* mask  用于制作遮罩层、背景
* a，包括的内容点击将是一个超链接。



更多高级主题：

* 渐变：stop  radialGradient    linearGradient  meshgradient
* 动画：animate    animateColor   animateMotion   animateTransform   discard   mpath  等
* 滤镜：超级多的f开头的标签，太多了这里就不写了！教程：https://wiki.developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Filter_effects 
* 描述性信息：desc   metadata    title；与js交互；旋转……

## 属性

svg的属性多种多样



