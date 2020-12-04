

#### canvas 4种上下文： 

webgl 对应 WebGLRenderingContext ：https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext  浏览器支持webgl才行

2d 对应  CanvasRenderingContext2D   https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D 浏览器支持canvas即可

bitmaprenderer   实验性

webgl2  实验性 高级的webgl

#### webgl简介



渲染管线

图形管线

webGL 使用基于 OpenGL ES 2.0

**GLSL ** 为  **OpenGL** 着色语言，GLSL是一种强类型语言

事实上WebGL仅仅是一个光栅化引擎，一切取决于你如何组织点，线，三角形。
WebGL在电脑的GPU中运行，因此你需要使用能够在GPU上运行的代码。WebGL在GPU上的工作基本上分为两部分，第一部分是将顶点（或数据流）转换到裁剪空间坐标， 第二部分是基于第一部分的结果绘制像素点。
特殊的`gl_Position`变量，就是裁剪空间中的坐标值。定点着色器就是不断赋值这个变量的。
假设你正在画三角形，顶点着色器每完成三次顶点处理，就会光栅化一个三角形（用像素画出来）
对于每一个像素，它会调用你的片断着色器询问你使用什么颜色。 你通过给片断着色器的一个特殊变量`gl_FragColor`设置一个颜色值，实现自定义像素颜色。

你需要提供成对的方法：**定点着色器**，**片段着色器**。每一对组合称为 **着色程序**。

顶点着色器的作用是计算顶点的位置。根据计算出的一系列顶点位置，WebGL可以对点， 线和三角形在内的一些图元进行光栅化处理。

当对这些图元进行光栅化处理时需要使用片断着色器方法。 片断着色器的作用是计算出当前绘制图元中每个像素的颜色值。

几乎整个WebGL API都是关于如何设置这些成对方法的状态值以及运行它们。对于想要绘制的每一个对象，都需要先设置一系列状态值，然后通过调用 `gl.drawArrays` 或 `gl.drawElements` 运行一个着色方法对，使得你的着色器对能够在GPU上运行。

The only functions that actually write pixels are `gl.clear`, `gl.drawArrays` and `gl.drawElements`. 

#### 3d

``` js
// 文档中矩阵相乘是反着的，个人感觉不好理解
// 文档认为是右结合的方式，感觉操作的都是坐标系，整个坐标系在旋转，在缩放，在平移，这与文档说明的完全相反，感觉左结合方式才是操作图形，可能是左右脑的区别吧。
// 思考右结合  缩放 平移，先缩放导致平移距离等比缩放了；旋转 平移，先旋转 导致平移方向变了。
// mat*vec 矩阵必须在前，否则无效！（矢量是一个竖型的矩阵）

// 正射投影
// 3d中，宽高的运用范围是 0-width，0-height，但depth的范围则是 -depth/2到depth/2
// 现在对于depth我们不平移-1， 那么 0-depth对应的gl坐标是0-2，  实际使用的范围正好对应 -1 到 1 

// 通过透视矩阵明确了 vec4是一个 1*3矩阵， 而mat4*vec4 进而明确了：glsl中矩阵相乘是右结合的！！！
// 开启右结合思维的图形（实在不符合我的思维习惯）

// float zToDivideBy = 1.0 + position.z * u_fudgeFactor;  // 生成透视投影因子    
// gl_Position = vec4(position.xy / zToDivideBy, position.zw);  // x,y除以透视因子
// gl_Position = vec4(position.xyz, zToDivideBy);    // w 就是透视因子，这一句和上一句是等价的！
// z越大，开起来越小，z越大，物体越远。这和css z-index 不一样哦！

// z2m方法中，直接将 (x,y,z,w)*matrix变成（x,y,z, 1 + z*factor+w) 

// vec4 中xyzw z默认是0，w默认是1，所以在三维的position中，看起来比二维简洁
```



#### 4种数据方式

##### 属性 attribute

专门用于：从缓冲中获取的数据

（缓冲区：通常存放位置，法向量，纹理坐标，顶点颜色值等，你可以存储任何数据）

``` glsl
attribute vec4 a_position;   // 示例：位置坐标缓冲区绑定
uniform vec2 u_resolution;   // 示例：全局长宽变量

precision mediump float;  // 片段着色器 都写这吗？什么意思？ 
uniform vec4 u_color;    // 全局颜色变量
```



##### 全局变量 uniform

专门用于：在一次绘制中对所有顶点保持一致值，通常在js中设置一次即可

全局变量在着色程序运行前赋值，在运行过程中全局有效。程序运行，通常是调用drawArrays或drawElements 等方法

全局变量属于单个着色程序，如果多个着色程序有同名全局变量，需要找到每个全局变量并设置自己的值。 我们调用`gl.uniform???`的时候只是设置了**当前程序**的全局变量，当前程序是传递给`gl.useProgram` 的最后一个程序。

##### 数组使用技巧（v字尾的）

一个数组可以一次设置所有的全局变量，例如

```glsl
// 着色器里
uniform vec2 u_someVec2[3]; 

// JavaScript 初始化时
var someVec2Loc = gl.getUniformLocation(someProgram, "u_someVec2"); 
// 渲染的时候
gl.uniform2fv(someVec2Loc, [1, 2, 3, 4, 5, 6]);  // 设置数组 u_someVec2
```

如果你想单独设置数组中的某个值，就要单独找到该值的地址。

```glsl
// JavaScript 初始化时
var someVec2Element0Loc = gl.getUniformLocation(someProgram, "u_someVec2[0]");
var someVec2Element1Loc = gl.getUniformLocation(someProgram, "u_someVec2[1]");
var someVec2Element2Loc = gl.getUniformLocation(someProgram, "u_someVec2[2]"); 
// 渲染的时候
gl.uniform2fv(someVec2Element0Loc, [1, 2]);  // set element 0
gl.uniform2fv(someVec2Element1Loc, [3, 4]);  // set element 1
gl.uniform2fv(someVec2Element2Loc, [5, 6]);  // set element 2
```

##### 纹理 texture 

专门用于：从像素或纹理元素中获取的数据

在着色器中获取纹理信息，可以先创建一个`sampler2D`类型全局变量，然后用GLSL方法`texture2D` 从纹理中提取信息。

``` glsl
precision mediump float;
 
uniform sampler2D u_texture;
 
void main() {
   vec2 texcoord = vec2(0.5, 0.5)  // 获取纹理中心的值
   gl_FragColor = texture2D(u_texture, texcoord);
}
```

仅看问题部分：https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html#textures-

##### 可变量 varying 

是一种顶点着色器给片断着色器传值的方式。

通常并不在js代码中设置，而是在顶点着色器中计算，然后通过同名变量，传给片段着色器。

##### 结构体

暂未涉及

``` glsl
struct SomeStruct {
  bool active;
  vec2 someVec2;
};
uniform SomeStruct u_someThing;
```

``` js
var someThingActiveLoc = gl.getUniformLocation(someProgram, "u_someThing.active");
var someThingSomeVec2Loc = gl.getUniformLocation(someProgram, "u_someThing.someVec2");
```





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

#### glsl

图片库着色器语言

##### 变量

常见类型：`int`  `ivec2` `ivec3` `ivec4` `float`, `vec2`, `vec3`, `vec4`, `mat2`, `mat3`   `mat4` `samplerCube `  `sampler2D` `bool` `bvec2` `bvec3` ……数据类型

它内建的数据类型例如`vec2`, `vec3`和 `vec4`分别代表两个值，三个值和四个值

`mat2`, `mat3` 和 `mat4` 分别代表 2x2, 3x3 和 4x4 矩阵

``` glsl
vec4 a = vec4(1, 2, 3, 4);
vec4 b = a * 2.0;
// b 现在是 vec4(2, 4, 6, 8);
vec4 c=b/a;
// c 现在是 vec4(2,2,2,2);

mat4 a = ???
mat4 b = ???
mat4 c = a * b;
 
vec4 v = ???
vec4 y = c * v;   //mat4 * vec4 结果是一个 vec4
```

##### vec4

对于变量 vec4  v 可以如下矢量调制：

- `v.x` 和 `v.s` 以及 `v.r` ， `v[0]` 表达的是同一个分量。
- `v.y` 和 `v.t` 以及 `v.g` ， `v[1]` 表达的是同一个分量。
- `v.z` 和 `v.p` 以及 `v.b` ， `v[2]` 表达的是同一个分量。
- `v.w` 和 `v.q` 以及 `v.a` ， `v[3]` 表达的是同一个分量。



v.yyyy 和 vec4(v.y, v.y, v.y, v.y) 是一样的，四个分量都是一样的，都是原第二个分类。

类似的还有 v.bagr    vec4(v.rgb, 0.5)   v.xy是一个vec2类型的数据

vec4(1)  等同于 vec4(1,1,1,1)

##### 强类型

``` glsl
float f = 1;  // 错误，1是int类型，不能将int型赋值给float

float f = 1.0;      // 使用float
float f = float(1)  // 转换integer为float
```

上例中 `vec4(v.rgb, 1)` 不会因为 `1` 报错，因为 `vec4` 内部进行了转换类似 `float(1)` 。

##### 多类型运算

如：  T sin(T angle)  T支持float`, `vec2`, `vec3` 或 `vec4

vec4 s = sin(v);    等价于：  vec4 s = vec4(sin(v.x), sin(v.y), sin(v.z), sin(v.w));

``` glsl
// 有时一个参数是浮点型而剩下的都是 `T` ，意思是那个浮点数据会作为所有其他参数的一个新分量。 例如如果 `v1` 和 `v2` 是 `vec4` 同时 `f` 是浮点型，那么
vec4 m = mix(v1, v2, f);
// 等价于：
vec4 m = vec4(
  mix(v1.x, v2.x, f),
  mix(v1.y, v2.y, f),
  mix(v1.z, v2.z, f),
  mix(v1.w, v2.w, f));
// 这样就可以解释了 出现的 vec2/vec2 结果是一个 vec2 了
```

#### 重要的三角函数

```js
c^2 = a^2 + b^2 - 2*a*b*cos(C)   // 余弦定理，证明过程: 三角形的三个边，联合得出，很简单
// c*c = c*a*cos(B) + c*b*cos(A) 同理 b*b, a*a 
 
cos(A+B) = cos(A)*cos(B) - sin(A)*sin(B)// 和差化积，证明过程（借助圆坐标，两种方式计算顶点直线距离，常规方式+上面的余弦定理）:
// (sin(A+B) - sin(A))^2 + (cos(A)-cos(A+B))^2 = 2-2*cos(B)  得出 cos(B) = sin(A+B)*sin(A) + cos(A+B)*cos(A) 另 B为B-A即可



sin(A+B) = sin(A)*cos(B) + cos(A)*sin(B)  // 诱导：sin^2+cos^2 = 1 很简单
// 诱导A-B, 2A，3A, A/2 很简单
// 诱导tan cot
// 诱导积化和差 sin(A)*cos(B) = (sin(A+B)+sin(A-B))/2
// 诱导和差化积 cos(A)+cos(B) = 2*cos((A+B)/2)*cos((A-B)/2)

// ……  相当多的公式 ！！
```

#### 矩阵

```
1、满足乘法结合律： (AB)C == A(BC)
2、满足乘法左分配律：(A+B)C == AC+BC 
3、满足乘法右分配律：C(A+B) == CA+CB
4、满足对数乘的结合性k(AB) == (kA)B=A(kB）
5、转置 (AB)T=BTAT  (T指的是转置角标，这里无法表示。转置即 行列互换 item(i,j)变成item(j,i)。注意转置相乘，AB要倒着来！)
6、矩阵乘法一般不满足交换律  AB != BA
```

> 像这样的矩阵相乘对层级变换至关重要，比如身体的手臂部分运动， 月球属于绕太阳转动的地球的一部分，或者树上的树枝。 写一个简单的 **层级运动** 的例子，我们来画5个 'F' ，并且每个 'F' 都以前一个的矩阵为基础。

- `.vert` for a vertex shader
- `.tesc` for a tessellation control shader
- `.tese` for a tessellation evaluation shader
- `.geom` for a geometry shader
- `.frag` for a fragment shader
- `.comp` for a compute shader

There is also a non-shader extension

- `.conf` for a configuration file of limits, see usage statement for example



https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html#toc



