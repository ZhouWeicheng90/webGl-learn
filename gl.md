webGL 使用基于 OpenGL ES 2.0

**GLSL ** 为  **OpenGL** 着色语言，GLSL是一种强类型语言

#### 4种上下文： 

webgl 对应 WebGLRenderingContext ：https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext  浏览器支持webgl才行

2d 对应  CanvasRenderingContext2D   https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D 浏览器支持canvas即可

bitmaprenderer   实验性

webgl2  实验性 高级的webgl





渲染管线

图形管线

事实上WebGL仅仅是一个光栅化引擎，一切取决于你如何组织点，线，三角形。
WebGL在电脑的GPU中运行，因此你需要使用能够在GPU上运行的代码。WebGL在GPU上的工作基本上分为两部分，第一部分是将顶点（或数据流）转换到裁剪空间坐标， 第二部分是基于第一部分的结果绘制像素点。
特殊的`gl_Position`变量，就是裁剪空间中的坐标值。定点着色器就是不断赋值这个变量的。
假设你正在画三角形，顶点着色器每完成三次顶点处理，就会光栅化一个三角形（用像素画出来）
对于每一个像素，它会调用你的片断着色器询问你使用什么颜色。 你通过给片断着色器的一个特殊变量`gl_FragColor`设置一个颜色值，实现自定义像素颜色。

你需要提供成对的方法：**定点着色器**，**片段着色器**。每一对组合称为 **着色程序**。

顶点着色器的作用是计算顶点的位置。根据计算出的一系列顶点位置，WebGL可以对点， 线和三角形在内的一些图元进行光栅化处理。

当对这些图元进行光栅化处理时需要使用片断着色器方法。 片断着色器的作用是计算出当前绘制图元中每个像素的颜色值。

几乎整个WebGL API都是关于如何设置这些成对方法的状态值以及运行它们。对于想要绘制的每一个对象，都需要先设置一系列状态值，然后通过调用 `gl.drawArrays` 或 `gl.drawElements` 运行一个着色方法对，使得你的着色器对能够在GPU上运行。

#### 着色器获取数据的4种途径

**属性 attribute**

（缓冲区：通常存放位置，法向量，纹理坐标，顶点颜色值等，你可以存储任何数据）

``` glsl
attribute vec4 a_position;   // 示例：位置坐标缓冲区绑定
uniform vec2 u_resolution;   // 示例：全局长宽变量

precision mediump float;  // 片段着色器 都写这吗？什么意思？ 
uniform vec4 u_color;    // 全局颜色变量
```



**全局变量 uniform**

全局变量在着色程序运行前赋值，在运行过程中全局有效。程序运行，通常是调用drawArrays或drawElements 等方法

纹理 texture 

暂未涉及

可变量 varying 

暂未涉及



#### 创建着色器

``` html
<script id="vertex-shader-2d" type="notjs">
 
  // 一个属性变量，将会从缓冲中获取数据
  attribute vec4 a_position;
 
  // 所有着色器都有一个main方法
  void main() {
 
    // gl_Position 是一个顶点着色器主要设置的变量
    gl_Position = a_position;
  }
 
</script>
 
<script id="fragment-shader-2d" type="notjs">
 
  // 片断着色器没有默认精度，所以我们需要设置一个精度
  // mediump是一个不错的默认值，代表“medium precision”（中等精度）
  precision mediump float;
 
  void main() {
    // gl_FragColor是一个片断着色器主要设置的变量
    gl_FragColor = vec4(1, 0, 0.5, 1); // 返回“瑞迪施紫色”
  }
 
</script>
```

#### 坐标与颜色：

canvas和svg一样，大小也有两套。canvas本身的大小、js代码操作的大小（width、height属性控制）+canvas实际在屏幕上展示的大小（css控制）

让canvas本身大小，跟随css，通常是个不错的想法！这样可以让你的绘制不变形！

坐标就和数学上的一样，x轴：右侧1，左侧-1；y轴：上侧1，下侧-1，坐标中心在画布的中心。

颜色的确是rgb，不过每种数值的范围都是0-1了，如0.2表示51  （51,255,0,.5) 在webgl中(0.2, 1, 0, 0.5)

#### vec4

有四个浮点数据的数据类型 {x:0, y:0, z:0, w:1}   可以这样取值：vec4Var.xy

``` glsl
attribute vec4 a_position;
uniform vec2 u_resolution;
void main() {
    vec2 zeroToOne = a_position.xy / u_resolution;
    ... ...
```



https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html#toc