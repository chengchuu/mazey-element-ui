## Image
Además de las características nativas de img, soporte de carga perezosa, marcador de posición personalizado y fallo de carga, etc.

### Uso básico

:::demo Indica cómo se debe cambiar el tamaño de la imagen para que se ajuste a su contenedor por ajuste, igual que el ajuste de objeto nativo. [object-fit](https://developer.mozilla.org/es/docs/Web/CSS/object-fit)。

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

:::demo Personalice el placeholder del contenido mientras la imagen aun no ha sido cargada vía `slot = placeholder`
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

### Fallo de carga

:::demo Personalice el contenido cuando ocurra algún error al cargar la imagen vía `slot = error`
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

:::demo Use lazy load vía `lazy = true`. La imagen se cargará hasta que se desplace a la vista cuando esté configurada. Puede indicar el contenedor de scroll que añade el oyente de scroll vía `scroll-container`. Si no está definido, será el contenedor padre más cercano cuya propiedad overflow es auto o scroll.

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

### Vista previa de la imagen

:::demo permitir una vista previa grande de la imagen configurando la prop `previewSrcList`.
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

### Atributos
| Atributo | Descripción | Tipo | Valores aceptados | Por defecto |
|---------- |-------- |---------- |-------------  |-------- |
| src | origen de la imagen, igual que en nativo | string | — | - |
| fit | Indica como la imagen debe adaptarse al contenedor, lo mismo que [object-fit](https://developer.mozilla.org/es/docs/Web/CSS/object-fit) | string | fill / contain / cover / none / scale-down | - |
| alt | alt nativo | string | - | - |
| referrer-policy | referrerPolicy nativo | string | - | - |
| lazy | si se usara lazy load | boolean | — | false |
| scroll-container | El contenedor para añadir el scroll listener cuando se utiliza lazy load | string / HTMLElement | — | El contenedor padre más cercano cuya propiedad de desbordamiento es auto o scroll |
| preview-src-list | permitir una vista previa grande de la imagen | Array | — | - |
| z-index | establecer el z-index de la vista previa de la imagen | Number | — | 2000 |
| initial-index | set image preview array index | Number | — | - |

### Eventos
| Nombre del evento | Descripción | Parámetros |
|---------- |-------- |---------- |
| load | Igual que el load nativo | (e: Event) |
| error | Igual que el error nativo | (e: Error) |

### Slots
| Nombre del slot | Descripción |
|---------|-------------|
| placeholder | Se activa cuando la imagen se carga |
| error | Se activa cuando la carga de la imagen falla |


