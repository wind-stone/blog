import path from 'path';
import { defineUserConfig } from 'vuepress';
import { viteBundler } from '@vuepress/bundler-vite';
import { searchPlugin } from '@vuepress/plugin-search';
import { watermarkPlugin } from '@vuepress/plugin-watermark';
import { photoSwipePlugin } from '@vuepress/plugin-photo-swipe';
import { copyrightPlugin } from '@vuepress/plugin-copyright';
import { copyCodePlugin } from '@vuepress/plugin-copy-code';
import { markdownImagePlugin } from '@vuepress/plugin-markdown-image'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import { hopeTheme } from "vuepress-theme-hope";
import navbar from './navbar';
import sidebar from './sidebar';

const componentsDir = path.resolve(__dirname, './components');

export default defineUserConfig({
  title: '风动之石的博客',          // 网站的标题
  description: '记录工作，记录生活', // 网站的描述
  head: [                         // 额外的需要被注入到当前页面的 HTML <head> 中的标签
    ['link', {
      rel: 'icon',
      href: '/images/logo.png'
    }]
  ],

  theme: hopeTheme({
    hostname: 'https://blog.windstone.cc',
    logo: '/images/logo.png',
    navbar,
    sidebar,
    lastUpdated: false,
    contributors: false,
  }),

  // 开发配置项
  debug: true,                    // 是否启用 Debug 模式
  open: true,                     // 是否在开发服务器启动后打开浏览器

  // markdown 配置
  markdown: {
    toc: {                      // 控制 [[TOC]] 默认行为
      level: [2, 3, 4, 5]     // 决定哪些级别的标题会被显示在目录中，默认值为 [2, 3]
    },

    importCode: {
      handleImportPath: (str) => str.replace(/^@components/, componentsDir),
    },
  },


  plugins: [
    // 为你的文档网站提供本地搜索能力。https://ecosystem.vuejs.press/zh/plugins/search/search.html
    searchPlugin({
      // 配置项
      maxSuggestions: 10
    }),

    // 根据组件文件或目录自动注册 Vue 组件。https://ecosystem.vuejs.press/zh/plugins/tools/register-components.html
    registerComponentsPlugin({
      // 配置项
      componentsDir
    }),

    // 水印，https://ecosystem.vuejs.press/zh/plugins/features/watermark.html
    watermarkPlugin({
      enabled: true,
      watermarkOptions: {
        content: '风动之石的博客',
        globalAlpha: 0.1
      }
    }),

    // 此插件会使页面正文内的图片在点击时进入浏览模式浏览，https://ecosystem.vuejs.press/zh/plugins/features/photo-swipe.html
    photoSwipePlugin({
      // 选项
    }),

    // 此插件可以在访问者从你的站点复制内容时，自动追加版权信息，也可以禁止站点的复制或者选择。
    // https://ecosystem.vuejs.press/zh/plugins/features/copyright.html
    copyrightPlugin({
      global: true,
      author: '风动之石',
      triggerLength: 10
    }),

    // 此插件会自动在 PC 设备上为每个代码块右上角添加复制按钮。https://ecosystem.vuejs.press/zh/plugins/features/copy-code.html
    copyCodePlugin({
      // options
    }),

    // 向你的 Markdown 图像添加附加功能。https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-image.html
    markdownImagePlugin({
      // 启用 figure
      figure: true,
      // 启用图片懒加载
      lazyload: true,
      // 启用图片标记
      mark: false,
      // 启用图片大小
      size: true,
    }),
  ],

  templateDev: path.resolve(__dirname, './templates/index.dev.html'),
  templateBuild: path.resolve(__dirname, './templates/index.build.html'),

  bundler: viteBundler(),
})
