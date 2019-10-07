<template>
  <a v-if="isSupportDownload" class="download-link" :href="url" :download="name">
    <slot v-if="$slots.default"></slot>
    <span v-else v-text="text"></span>
  </a>
  <a v-else class="download-link" href="#" @click.stop.prevent="download(url)">
    <slot v-if="$slots.default"></slot>
    <span v-else v-text="text"></span>
  </a>
</template>

<script>
const isSupportDownload = 'download' in document.createElement('a')

export default {
  name: 'download-link',
  props: {
    url: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: '下载文件'
    },
    text: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      isSupportDownload
    }
  },
  methods: {
    download (url) {
      window.open(url, '_blank', 'fullscreen=no,width=400,height=300')
    }
  }
}
</script>

<style lang="scss" scoped>
.download-link {
  text-decoration: none;
  color: #409eff;
}
</style>
