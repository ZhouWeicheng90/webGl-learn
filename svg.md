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