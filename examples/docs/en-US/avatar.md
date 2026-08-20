## Avatar avatar

Avatars can be used to represent people or objects. It supports images, Icons, or characters.

### Basic

use `shape` and `size` prop to set avatar's shape and size

:::demo
```html
<template>
  <el-row class="demo-avatar demo-basic">
    <el-col :span="12">
      <div class="sub-title">circle</div>
      <div class="demo-basic--circle">
        <div class="block"><el-avatar :size="50" :src="circleUrl"></el-avatar></div>
        <div class="block" v-for="size in sizeList" :key="size">
          <el-avatar :size="size" :src="circleUrl"></el-avatar>
        </div>
      </div>
    </el-col>  
    <el-col :span="12">
      <div class="sub-title">square</div>
      <div class="demo-basic--circle">
        <div class="block"><el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar></div>
        <div class="block" v-for="size in sizeList" :key="size">
          <el-avatar shape="square" :size="size" :src="squareUrl"></el-avatar>
        </div>
      </div>
    </el-col> 
  </el-row>
</template>
<script>
  export default {
    data () {
      return {
        circleUrl: require("examples/assets/images/element-demo.jpeg"),
        squareUrl: require("examples/assets/images/element-demo.jpeg"),
        sizeList: ["large", "medium", "small"]
      }
    }
  }
</script>

```
:::

### Types

It supports images, Icons, or characters

:::demo
```html
<template>
  <div class="demo-type">
    <div>
      <el-avatar icon="el-icon-user-solid"></el-avatar>
    </div>
    <div>
      <el-avatar :src="require('examples/assets/images/element-demo.jpeg')"></el-avatar>
    </div>
    <div>
      <el-avatar> user </el-avatar>
    </div>
  </div>
</template>
```
:::

### Fallback when image load error

fallback when image load error

:::demo
```html
<template>
  <div class="demo-type">
    <el-avatar :size="60" src="/mazey-element-ui/missing-avatar.png" @error="errorHandler">
      <img src="~examples/assets/images/element-demo.jpeg"/>
      </el-avatar>
  </div>
</template>
<script>
  export default {
    methods: {
      errorHandler() {
        return true
      }
    }
  }
</script>

```
:::

### How the image fit its container

Set how the image fit its container for an image avatar, same as [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).

:::demo
```html
<template>
  <div class="demo-fit">
    <div class="block" v-for="fit in fits" :key="fit">
        <span class="title">{{ fit }}</span>
        <el-avatar shape="square" :size="100" :fit="fit" :src="url"></el-avatar>
    </div>
  </div>
</template>
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

### Attributes

| Attribute      | Description          | Type      | Accepted Values       | Default  |
| ----------------- | -------------------------------- | --------------- | ------ | ------ |
| icon              | set representation type to Icon, more info on Icon Component   | string          |        |        |
| size              | set avatar size                     | number/string | number / large / medium / small | large  |
| shape             | set avatar shape  | string |    circle / square     |   circle  |
| src               | the address of the image for an image avatar | string |        |      |
| srcSet            | A list of one or more strings separated by commas indicating a set of possible image sources for the user agent to use | string |        |      |
| alt               | This attribute defines an alternative text description of the image | string |        |      |
| fit               | set how the image fit its container for an image avatar | string |    fill / contain / cover / none / scale-down    |   cover   |

### Events

| Event Name | Description         | Parameters  |
| ------ | ------------------ | -------- |
| error  | handler when img load error, return false to prevent default fallback behavior |(e: Event)  |

### Slot

| Slot Name | Description | 
| default  | customize avatar content |
