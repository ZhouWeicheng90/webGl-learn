# webGl-learn

webGL由 js编写的控制代码 和 在GPU中执行的特效代码 组成

有很多webGL 3D相关的框架，比如three.js

canvas 可以画图，图片综合处理，动画等。canvas的默认尺寸是 300*150 ，尺寸可以在脚本中动态设置，也可以通过css设置显示尺寸（和img，svg类似），注意css设置的是显示尺寸，会引起内容的缩放（如果比率不对，会变形，这和img还是一样的）canvas默认是透明的（就像div），但我们也可以设置一些css样式

所有操作都需要有个context：



> 贝塞尔曲线的使用没有什么难度，绘制复杂图形，唯一需要的是时间和耐心
>
> 虽然不建议使用文本编辑器创建复杂的路径，除非你有足够的时间和耐心

``` js
/**
     * 
     * path 由点组成，点之间由线连接（可能是曲线，弧线，直线），线有颜色，粗细的属性。
     * path可以是close的，subpath也可以。
     * 三步走：创建path，通过绘制指令来绘制path，最后fill或者stroke来渲染path
     * beginPath()  创建path方法，接下来的指令都将直接作用于这个path，用来构建path。
     * 
     * stroke()
     * fill()  会自动封闭（调用closePath)，所以fill之前不用调用closePath方法。
     *
     * moveTo(x, y)
     * lineTo(x, y)    
     * closePath()  当前点到起点画一条直线，封闭路径。如果已经封闭了，或只有一个点，将没由任何效果。  
     *
     *
     */
```

