---
sidebarDepth: 0
---

# 图片

[[toc]]

## 图片格式对比

图片格式 | JPG | GIF | PNG-8 | PNG-24 | PNG-32
--- | --- | --- | --- | --- | ---
颜色表支持 | | ✅ | ✅ | |
真彩色支持 | ✅ | | | ✅ | ✅
有损压缩 | ✅ | | | |
帧动画 | | ✅ | | |
透明像素支持 | | ✅ | ✅ | | ✅
半透明度支持 | | | ✅ | | ✅

> 照片用 JPG。  
> 动画用 GIF。  
> Logo、Icon 等小图用 PNG-8。  
> 非特殊情况，尽量不要用 PNG-24 和 PNG-32。

首先，Logo、图标等小图片，整张图片一般不多于256色，因此当然选择带颜色表的图片格式。而事实证明，对于同一张图，PNG-8 的体积是小于GIF的。因此，若不是动画，小图片请用 PNG-8。

然后，照片、横幅等大图，就像在线听歌一样。如果在线听无损音乐，那得很大的带宽才行。我们在线试听歌曲，目的就是听听这首歌，不会非常注重音质（而且我的木耳是听不出MP3和无损的区别的）。同样道理，放在网页中的大图，用户肯定不会太看重画质，能看清楚内容就行。因此，照片大图用有损压缩的JPG。

根据经验，JPG的画质一般选择 60% - 70%。当然如果你要求较高，可以在PS里一边看预览一边慢慢调整直到自己满意。

## JPG

- 不支持颜色表
- 也不支持透明
- 只有真彩色
- 有损压缩

### 连续的 JPG

Photoshop 里保存 JPG 格式时有个“连续”选项，路径为：PS CC2017：文件 → 存储为... → “JPG”格式 → 保存

![“基线”格式的JPG加载过程：从上往下](./img/baseline-jpg.gif)

“基线”格式的JPG加载过程：从上往下

![“连续”格式的JPG加载过程：从模糊到清晰](./img/continuous-jpg.gif)

“连续”格式的JPG加载过程：从模糊到清晰

### PNG

- PNG-8
  - 1 个字节记录一个像素：能有 256 种颜色
  - PNG-8 带颜色表，而且不像 BMP 只有固定的16色、256色，PNG-8 的颜色数可以从 2 种到 256 种之间任意种，像123种、10种颜色之类的颜色数，PNG-8 都是支持的。而且通过强大的压缩算法，PNG-8 可以真正做到颜色数越少，文件体积越小。
- PNG-24
  - 3 个字节记录一个像素：红、绿、蓝三原色各占一个字节，总共大约 1670 万色，即真彩色
- PNG-32
  - 4 个字节记录一个像素：在 PNG-24 的基础上，增加透明通道，占 1 字节，从 0~255 表示从 全透明 -> 半透明 -> 不透明

### GIF

- 带颜色表
- 不支持真彩色
- 帧动画

### 颜色表

16色（1 个字节记录 2 个像素）、256色（1 个字节记录 1 个像素，比如 PNG-8）图片文件除了存储每个像素之外，还会存储一份颜色表（Palette，亦译作调色板、色盘），从真彩色的 1670 万种色彩里任意挑选 16、256 种颜色，构成一个索引。颜色表大概长这个样子：

> 0号色：#000000  
> 1号色：#3385FF  
> 。。。  
> 255号色：#FAFEF2

以 PNG-8 为例，其能支持的颜色数量不是固定的 256 种，而是可以从 1670 万种颜色里选取 256 种。

## Reference

更多详情请见：[JPG？GIF？PNG？前端如何选择图片格式？](https://www.jianshu.com/p/ab96bf20f90e)