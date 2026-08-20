## Image
Besides the native features of img, support lazy load, custom placeholder and load failure, etc.

### Basic Usage

:::demo Indicate how the image should be resized to fit its container by `fit`, same as native [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)。
```html
<div class="demo-image">
  <div class="block" v-for="fit in fits" :key="fit">
    <span class="demonstration">{{ fit }}</span>
    <el-image
      style="width: 100px; height: 100px"
      :src="url"
      :fit="fit"></el-image>
  </div>
</div>

<script>
  export default {
    data() {
      return {
        fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
        url: require('examples/assets/images/element-demo.jpeg')
      }
    }
  }
</script>
```
:::

### Placeholder

:::demo Custom placeholder content when image hasn't loaded yet by `slot = placeholder`
```html
<div class="demo-image__placeholder">
  <div class="block">
    <span class="demonstration">Default</span>
    <el-image :src="src"></el-image>
  </div>
  <div class="block">
    <span class="demonstration">Custom</span>
    <el-image :src="src">
      <div slot="placeholder" class="image-slot">
        Loading<span class="dot">...</span>
      </div>
    </el-image>
  </div>
</div>

<script>
  export default {
    data() {
      return {
        src: require('examples/assets/images/element-demo.jpeg')
      }
    }
  }
</script>
```
:::

### Load Failed

:::demo Custom failed content when error occurs to image load by `slot = error`
```html
<div class="demo-image__error">
  <div class="block">
    <span class="demonstration">Default</span>
    <el-image></el-image>
  </div>
  <div class="block">
    <span class="demonstration">Custom</span>
    <el-image>
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
  </div>
</div>
```
:::

### Lazy Load

:::demo Use lazy load by `lazy = true`. Image will load until scroll into view when set. You can indicate scroll container that adds scroll listener to by `scroll-container`. If undefined, will be the nearest parent container whose overflow property is auto or scroll.
```html
<div class="demo-image__lazy">
  <el-image v-for="url in urls" :key="url" :src="url" lazy></el-image>
</div>

<script>
  export default {
    data() {
      return {
        urls: [
          require('examples/assets/images/element-demo.jpeg'),
          require('examples/assets/images/element-demo.jpeg'),
          require('examples/assets/images/element-demo.jpeg'),
          require('examples/assets/images/element-demo.jpeg'),
          require('examples/assets/images/element-demo.jpeg'),
          require('examples/assets/images/element-demo.jpeg'),
          require('examples/assets/images/element-demo.jpeg')
        ]
      }
    }
  }
</script>
```
:::

### Image Preview

:::demo allow big image preview by setting `previewSrcList` prop.
```html
<div class="demo-image__preview">
  <el-image 
    style="width: 100px; height: 100px"
    :src="url" 
    :preview-src-list="srcList">
  </el-image>
</div>

<script>
  export default {
    data() {
      return {
        url: require('examples/assets/images/element-demo.jpeg'),
        srcList: [
          require('examples/assets/images/element-demo.jpeg'),
          require('examples/assets/images/element-demo.jpeg')
        ]
      }
    }
  }
</script>
```
:::

### Attributes
| Attribute | Description | Type  | Accepted values | Default   |
|---------- |-------- |---------- |-------------  |-------- |
| src | Image source, same as native | string | — | - |
| fit | Indicate how the image should be resized to fit its container, same as [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) | string | fill / contain / cover / none / scale-down | - |
| alt | Native alt | string | - | - |
| referrer-policy | Native referrerPolicy | string | - | - |
| lazy | Whether to use lazy load | boolean | — | false |
| scroll-container | The container to add scroll listener when using lazy load | string / HTMLElement | — | The nearest parent container whose overflow property is auto or scroll |
| preview-src-list | allow big image preview | Array | — | - |
| z-index | set image preview z-index | Number | — | 2000 |
| initial-index | set image preview array index | Number | — | - |

### Events
| Event Name | Description | Parameters |
|---------- |-------- |---------- |
| load | Same as native load | (e: Event) |
| error | Same as native error | (e: Error) |

### Slots
| Slot Name | Description |
|---------|-------------|
| placeholder | Triggers when image load |
| error | Triggers when image load failed |


