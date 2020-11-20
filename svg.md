- SVG的元素和属性必须按标准格式书写，因为XML是区分大小写的（这一点和HTML不同）
- 2008年，SVG Tiny1.2成为W3C推荐标准。SVG2.0正在制定当中，它采用了类似CSS3的制定方法，通过若干松散耦合的组件形成一套标准。
- SVG Tiny和SVG Basic，这两个配置文件主要瞄准移动设备。首先SVG Tiny主要是为性能低的小设备生成图元，而SVG Basic实现了完整版SVG里的很多功能，只是舍弃了难以实现的大型渲染（比如动画）。
- SVG文件全局有效的规则是“后来居上”，越后面的元素越可见。

```html
<object data="image.svg" type="image/svg+xml" />
<iframe src="image.svg"></iframe>
```

```html
<svg width="200" height="200" viewBox="0 0 100 100">
```

svg画布的尺寸是200px*200px，但是`viewBox` 指明可以显式的区域 100\*100的区域，这是相对大小。相当于把 100\*100的svg放到200px\*200px的画布上，于是形成了放大两倍的效果。



https://wiki.developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes

https://wiki.developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors



 colors, 颜色 

``` js
fillStyle = color    // 颜色默认是黑色 “#000000”；所有css颜色，包括带有透明度的颜色，hsl写法都行。
strokeStyle = color    // 除了颜色，还可以是渐变对象，pattern对象
// 一旦我们设置了颜色，后续所有的绘制都将默认使用这个颜色。

// 实现半透明，有两种方式：传入一个半透明的颜色，或者设置 globalAlpha（默认1；0表示全透明，1表示不透明）
globalAlpha = 0.5
// 两种透明度，都将被叠加使用
```

line styles, 线的style（虚线，实线）

``` js
lineWidth = value   // 正整数，默认1，表示线粗为1
// 线的模糊性问题：线的正中间到两边的距离都是lineWidth/2,  如果存在延伸至一半像素的情况，就会模糊（其实是近似渲染，没法渲染半个像素）。为了避免模糊，总体是：奇数宽度（如1），线的位置要是n.5，这样刚好绘制一个完整像素，就是清晰的；如果线的位置是n，那么将以绘制两个模糊像素（两个 半个像素 的绘制）！更多模糊或清晰，以此类推，但是这个通常不用考虑。




lineCap = type
lineJoin = type
miterLimit = value
```



gradients,  渐变

 patterns 

shadows   阴影