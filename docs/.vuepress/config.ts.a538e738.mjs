// docs/.vuepress/config.ts
import path from "path";
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { searchPlugin } from "@vuepress/plugin-search";
import { watermarkPlugin } from "@vuepress/plugin-watermark";
import { photoSwipePlugin } from "@vuepress/plugin-photo-swipe";
import { copyrightPlugin } from "@vuepress/plugin-copyright";
import { copyCodePlugin } from "@vuepress/plugin-copy-code";
import { markdownImagePlugin } from "@vuepress/plugin-markdown-image";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { hopeTheme } from "vuepress-theme-hope";

// docs/.vuepress/navbar.ts
var navbar_default = [
  { text: "Vue 2.x \u6E90\u7801\u5B66\u4E60", link: "/vue/source-study/" },
  {
    text: "JavaScript",
    children: [
      { text: "JavaScript", link: "/js/data-types/", activeMatch: "^/js" },
      { text: "ES6+", link: "/es6/", activeMatch: "^/es6" },
      { text: "TypeScript", link: "/typescript/", activeMatch: "^/typescript" },
      { text: "React", link: "/react/hooks/", activeMatch: "^/react" }
    ]
  },
  {
    text: "HTML/CSS/\u6D4F\u89C8\u5668",
    children: [
      { text: "CSS", link: "/css/selectors/", activeMatch: "^/css" },
      { text: "CSS/JS \u52A8\u753B\u6548\u679C", link: "/animation-effects/", activeMatch: "^/animation-effects/" },
      { text: "\u6D4F\u89C8\u5668", link: "/browser-env/browser/how-browsers-work", activeMatch: "^/browser-env" },
      { text: "\u5C0F\u7A0B\u5E8F", link: "/mini-program/weixin/", activeMatch: "^/mini-program" }
    ]
  },
  {
    text: "\u524D\u7AEF\u5DE5\u7A0B\u5316",
    children: [
      {
        text: "\u6982\u8FF0",
        link: "/front-end-engineering/",
        activeMatch: "^/front-end-engineering/$"
      },
      {
        text: "\u521D\u59CB\u5316\u9636\u6BB5",
        link: "/front-end-engineering/initialization/project/",
        activeMatch: "^/front-end-engineering/initialization"
      },
      {
        text: "\u5F00\u53D1\u9636\u6BB5",
        link: "/front-end-engineering/development/h5/",
        activeMatch: "^/front-end-engineering/development"
      },
      {
        text: "\u6784\u5EFA\u9636\u6BB5",
        link: "/front-end-engineering/build/webpack/",
        activeMatch: "^/front-end-engineering/build"
      },
      {
        text: "\u53D1\u5E03\u9636\u6BB5",
        link: "/front-end-engineering/publish/changelog",
        activeMatch: "^/front-end-engineering/publish"
      },
      {
        text: "\u524D\u7AEF\u7A33\u5B9A\u6027\u5EFA\u8BBE",
        link: "/front-end-engineering/frontend-stability-construction/",
        activeMatch: "^/front-end-engineering/frontend-stability-construction"
      }
    ]
  },
  {
    text: "\u5168\u6808\u6280\u80FD",
    children: [
      {
        text: "\u8BBE\u8BA1\u6A21\u5F0F",
        link: "/full-stack/design-patterns/singleton-pattern"
      },
      {
        text: "\u64CD\u4F5C\u7CFB\u7EDF\u4E0E\u547D\u4EE4\u884C",
        link: "/full-stack/operating-system/linux/"
      },
      {
        text: "\u6570\u636E\u7BA1\u7406",
        link: "/full-stack/data-management/kafka/"
      },
      {
        text: "\u540E\u7AEF\u5F00\u53D1",
        link: "/full-stack/backend/nestjs/"
      },
      {
        text: "\u5168\u6808\u5F00\u53D1\u7684\u8F6F\u4EF6\u4F7F\u7528",
        link: "/full-stack/software/nginx/"
      },
      {
        text: "\u5176\u4ED6",
        link: "/full-stack/others/google-cloud"
      }
    ]
  },
  {
    text: "\u4EE3\u7801\u7247\u6BB5/\u6280\u672F\u6587\u7AE0",
    children: [
      { text: "\u4EE3\u7801\u7247\u6BB5", link: "/code-snippet/", activeMatch: "^/code-snippet" },
      { text: "\u6280\u672F\u6587\u7AE0", link: "/articles/string-literal/", activeMatch: "^/articles" },
      { text: "\u9762\u8BD5\u9898\u5E93", link: "/interview/", activeMatch: "^/interview" }
    ]
  },
  { text: "GitHub", link: "https://github.com/wind-stone" },
  { text: "\u968F\u8BB0", link: "/wander/house/" }
];

// docs/.vuepress/sidebar/list/articles.ts
var articles_default = {
  // 技术文章
  "/articles/": [
    {
      text: "\u6587\u7AE0\u5217\u8868",
      collapsable: false,
      prefix: "/articles",
      children: [
        "string-literal/",
        "line-terminator/",
        "wechat-mini-program-sourcemap/"
      ]
    },
    {
      text: "\u65E5\u5E38\u9605\u8BFB\u6587\u7AE0",
      collapsable: false,
      prefix: "/articles",
      children: [
        "good-articles/",
        "good-articles/javascript"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/browser-env.ts
var browser_env_default = {
  "/browser-env/": [
    {
      text: "\u6D4F\u89C8\u5668",
      prefix: "/browser-env/browser",
      children: [
        "how-browsers-work",
        "first-paint",
        "process-thread",
        "event-loop",
        "cache",
        "performance/",
        "browser-api",
        "browser-requests",
        "faq",
        "dev-tools/",
        "fingerprint"
      ]
    },
    {
      text: "HTML/DOM",
      prefix: "/browser-env/html-dom",
      children: [
        "elements/",
        "attributes-properties/attributes",
        "attributes-properties/properties",
        "attributes-properties/differences-between-properties-and-attributes",
        "image/",
        "image/image-lazy-load",
        "svg/"
      ]
    },
    {
      text: "\u4E8B\u4EF6",
      prefix: "/browser-env/events",
      children: [
        "",
        "blur"
      ]
    },
    {
      text: "\u7F51\u7EDC",
      prefix: "/browser-env/network",
      children: [
        "http/",
        "https/",
        "http2/",
        "cors/",
        "dns"
      ]
    },
    {
      text: "\u5B89\u5168",
      prefix: "/browser-env/security",
      children: [
        "",
        "chrome-security-policy",
        "cross-domain",
        "same-site"
      ]
    },
    {
      text: "Hybrid",
      prefix: "/browser-env/hybrid",
      children: [
        "h52app",
        "jsbridge",
        "universal-links"
      ]
    },
    {
      text: "\u6D4F\u89C8\u5668\u5382\u5546\u53CA\u5E94\u7528\u73AF\u5883",
      prefix: "/browser-env/vendor-app",
      children: [
        "wechat/",
        "wechat/android-weixin-auto-open-browser"
      ]
    },
    {
      text: "\u6D4F\u89C8\u5668\u517C\u5BB9\u6027",
      prefix: "/browser-env/compatibility",
      children: [
        "",
        "video",
        "audio",
        "input-delay/",
        "ios/",
        "ios/safari-script-block-render"
      ]
    },
    {
      text: "\u6EDA\u52A8\u4E13\u9898",
      prefix: "/browser-env/scroll",
      children: [
        "",
        "touch-event",
        "click-delay",
        "fastclick",
        "no-bg-scroll"
      ]
    },
    {
      text: "\u672A\u5206\u7C7B",
      prefix: "/browser-env/unclassified",
      children: [
        "web-components",
        "pwa",
        "file-system",
        "keyboard"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/code-snippet.ts
var code_snippet_default = {
  "/code-snippet": [
    {
      text: "JS \u4EE3\u7801\u7247\u6BB5",
      children: [
        {
          text: "\u5DE5\u5177\u51FD\u6570",
          prefix: "/code-snippet/js/utils",
          children: [
            "data-type",
            "env",
            "version",
            "event-emitter",
            "queen-next",
            "format"
          ]
        },
        {
          text: "\u6D4F\u89C8\u5668\u73AF\u5883",
          prefix: "/code-snippet/js/browser",
          children: [
            "class",
            "cookie",
            "url",
            "load-script",
            "storage",
            "clipboard"
          ]
        },
        "/code-snippet/js/server/",
        "/code-snippet/js/validate/"
      ]
    },
    {
      text: "\u6D4F\u89C8\u5668\u4EE3\u7801\u7247\u6BB5",
      children: [
        "/code-snippet/browser-env/rem/"
      ]
    },
    {
      text: "Vue 2.x \u7EC4\u4EF6",
      prefix: "/code-snippet/vue-components",
      children: [
        "base-marquee",
        "common-popup"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/css.ts
var css_default = {
  "/css/": [
    {
      text: "CSS \u6280\u80FD",
      children: [
        {
          text: "\u5E03\u5C40",
          prefix: "/css/skills",
          children: [
            "line-boxes-truncation-style",
            "dog-ear"
          ]
        }
      ]
    },
    {
      text: "\u4E13\u9898",
      prefix: "/css/topics",
      children: [
        {
          text: "Flex \u5E03\u5C40",
          prefix: "flex/",
          children: [
            "",
            "flex-image/"
          ]
        },
        {
          text: "\u6587\u672C",
          children: [
            "text/text-wrap-and-ellipsis/"
          ]
        },
        {
          text: "\u8FB9\u6846",
          children: [
            "border/border-image"
          ]
        },
        "position-fixed"
      ]
    },
    {
      text: "\u9009\u62E9\u5668",
      children: [
        "/css/selectors/"
      ]
    },
    {
      text: "\u5C5E\u6027",
      prefix: "/css/properties",
      children: [
        "",
        "properties-order"
      ]
    },
    {
      text: "\u5C4F\u5E55",
      children: [
        "/css/screen/"
      ]
    },
    {
      text: "\u89C6\u53E3",
      prefix: "/css/viewport",
      children: [
        "a-tale-of-viewports-one",
        "a-tale-of-viewports-two"
      ]
    },
    {
      text: "\u5E03\u5C40",
      prefix: "/css/layouts",
      children: [
        "",
        "ifc/"
      ]
    },
    {
      text: "\u5B57\u4F53",
      prefix: "/css/font",
      children: [
        "",
        "css-font-metrics-line-height-and-vertical-align"
      ]
    },
    {
      text: "\u5B9E\u8DF5",
      prefix: "/css/practices",
      children: [
        ""
      ]
    },
    {
      text: "\u9884\u5904\u7406\u5668",
      prefix: "/css/preprocessor",
      children: [
        "less",
        "stylus"
      ]
    },
    {
      text: "\u5DE5\u5177\u96C6\u5408",
      prefix: "/css/tools",
      children: [
        "safe-area",
        "text-ellipsis"
      ]
    },
    {
      text: "CSS 2.2 \u89C4\u8303",
      prefix: "/css/css-spec",
      children: [
        "css2.2/8-box-model/",
        "css2.2/9-visual-formatting-model/"
      ]
    },
    {
      text: "\u672A\u5206\u7C7B",
      prefix: "/css/unclassified",
      children: [
        "user-experience",
        "compatibility",
        "skill-pitfall"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/es6.ts
var es6_default = {
  // ES6
  "/es6/": [
    {
      text: "ES6+",
      prefix: "/es6",
      children: [
        "",
        "let-const/",
        "destructuring-assignment/",
        "function/",
        "array/",
        "class/",
        "module/",
        "iterator/",
        "generator/",
        "async-await/",
        "proxy-reflect/",
        "proxy-reflect/proxy-practice"
      ]
    },
    {
      text: "Promise",
      prefix: "/es6/promise",
      children: [
        "",
        "promise-skills"
      ]
    },
    {
      text: "Babel",
      prefix: "/es6/babel",
      children: [
        "",
        "babel-v7",
        "@babel/preset-env",
        "@babel/plugin-transform-runtime",
        "@babel/runtime",
        "@babel/runtime-corejs2"
      ]
    },
    {
      text: "Polyfill",
      prefix: "/es6/polyfill",
      children: [
        {
          text: "String",
          children: [
            "string/padStart"
          ]
        },
        {
          text: "Array",
          prefix: "array",
          children: [
            "array-prototype-forEach",
            "array-prototype-reduce"
          ]
        },
        {
          text: "Object",
          prefix: "object",
          children: [
            "new",
            "object-create",
            "object-assign"
          ]
        },
        {
          text: "Promise",
          prefix: "promise",
          children: [
            "promise-allSettled",
            "promise-race"
          ]
        }
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/front-end-engineering.ts
var front_end_engineering_default = {
  "/front-end-engineering/": [
    "/front-end-engineering/"
  ],
  // 初始化阶段
  "/front-end-engineering/initialization": [
    {
      text: "\u4EE3\u7801\u4ED3\u5E93\u521D\u59CB\u5316",
      children: [
        "/front-end-engineering/initialization/repository/"
      ]
    },
    {
      text: "\u9879\u76EE\u521D\u59CB\u5316",
      children: [
        "/front-end-engineering/initialization/project/"
      ]
    },
    {
      text: "\u7F16\u8F91\u5668\u521D\u59CB\u5316",
      children: [
        "/front-end-engineering/initialization/code-editors/vscode"
      ]
    },
    {
      text: "\u98CE\u683C\u6307\u5357",
      prefix: "/front-end-engineering/initialization/style-guide",
      children: [
        "naming-convention/naming.md",
        "naming-convention/js.md"
      ]
    },
    {
      text: "\u4EE3\u7801\u683C\u5F0F\u5316 - ESLint",
      prefix: "/front-end-engineering/initialization/code-formatter/eslint",
      children: [
        "",
        "eslint-vscode",
        "eslint-vue",
        "eslint-prettier",
        "how-to-write-a-custom-eslint-rule"
      ]
    }
  ],
  // 开发阶段
  "/front-end-engineering/development": [
    {
      text: "h5 \u5F00\u53D1",
      prefix: "/front-end-engineering/development/h5",
      children: [
        "",
        "style",
        "local-mock"
      ]
    },
    {
      text: "\u540E\u7AEF - Node",
      prefix: "/front-end-engineering/development/server-node",
      children: [
        "",
        "commonjs",
        "koa/",
        "server",
        "api",
        "pm2"
      ]
    },
    {
      text: "\u5DE5\u5177\u5E93",
      prefix: "/front-end-engineering/development/tools-library",
      children: [
        "axios"
      ]
    },
    {
      text: "NPM",
      prefix: "/front-end-engineering/development/npm",
      children: [
        "semantic-version",
        "",
        "npm-command",
        "npmrc",
        "npm-config",
        "npm-scripts",
        "package.json",
        "package-lock.json",
        "third-party-package"
      ]
    },
    {
      text: "pnpm",
      prefix: "/front-end-engineering/development/pnpm",
      children: [
        ""
      ]
    }
  ],
  // 构建阶段
  "/front-end-engineering/build": [
    {
      text: "Webpack",
      prefix: "/front-end-engineering",
      children: [
        "build/webpack/",
        "build/webpack/webpack-runtime",
        {
          text: "Webpack \u914D\u7F6E",
          prefix: "build/webpack/config",
          children: [
            "whole-config",
            "practical-config",
            "config-tools",
            "dead-code"
          ]
        },
        "build/webpack/webpack4-import",
        {
          text: "Tapable",
          prefix: "build/webpack/tapable",
          children: [
            "",
            "tapable-readme"
          ]
        }
      ]
    },
    "/front-end-engineering/build/rollup",
    "/front-end-engineering/build/source-map"
  ],
  // 发布阶段
  "/front-end-engineering/publish": [
    {
      text: "ChangLog",
      children: [
        "/front-end-engineering/publish/changelog"
      ]
    }
  ],
  // 前端稳定性建设
  "/front-end-engineering/frontend-stability-construction": [
    "/front-end-engineering/frontend-stability-construction/",
    {
      text: "",
      prefix: "/front-end-engineering/frontend-stability-construction",
      children: [
        "observable-system/",
        "full-link-monitoring/",
        "high-availability-architecture/",
        "performance/",
        "risk-management/",
        "processs-mechanism/",
        "engineering-construction/",
        {
          text: "",
          prefix: "engineering-construction",
          children: [
            "automated-testing"
          ]
        },
        "summary"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/full-stack.ts
var full_stack_default = {
  // 设计模式
  "/full-stack/design-patterns/": [
    {
      text: "\u8BBE\u8BA1\u6A21\u5F0F",
      children: [
        "/full-stack/design-patterns/singleton-pattern"
      ]
    }
  ],
  // 数据管理
  "/full-stack/data-management": [
    {
      text: "\u6570\u636E\u751F\u4EA7\u548C\u6D88\u8D39",
      children: [
        "/full-stack/data-management/kafka/"
      ]
    },
    {
      text: "\u6570\u636E\u67E5\u8BE2\u4E0E\u5C55\u793A",
      prefix: "/full-stack/data-management/data-observability",
      children: [
        "sql",
        "clickhouse"
      ]
    },
    {
      text: "\u6570\u636E\u5B58\u50A8",
      children: [
        "/full-stack/data-management/mongodb"
      ]
    }
  ],
  // 操作系统相关
  "/full-stack/operating-system": [
    {
      text: "Linux",
      prefix: "/full-stack/operating-system/linux",
      children: [
        "",
        "shell",
        "linux-command",
        "environment-variables.md",
        "glob"
      ]
    },
    {
      text: "Git",
      prefix: "/full-stack/operating-system/git",
      children: [
        "",
        "git-command",
        "git-commit-guidelines",
        "gitlab"
      ]
    },
    {
      text: "Docker",
      children: [
        "/full-stack/operating-system/docker/"
      ]
    }
  ],
  // 开发相关的软件
  "/full-stack/software": [
    {
      text: "Nginx",
      prefix: "/full-stack/software/nginx",
      children: [
        "",
        "practices",
        "nginx-conf",
        "ngx_http_proxy_module",
        "ngx_http_upstream_module"
      ]
    }
  ],
  // 后端开发
  "/full-stack/backend": [
    {
      text: "\u540E\u7AEF",
      children: [
        "/full-stack/backend/nestjs/"
      ]
    }
  ],
  // 其他
  "/full-stack/others": [
    {
      text: "\u5176\u4ED6",
      children: [
        "/full-stack/others/google-cloud"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/interview.ts
var interview_default = {
  "/interview": [
    {
      text: "\u9762\u8BD5\u9898\u76EE",
      prefix: "/interview",
      children: [
        "browser/",
        "css/",
        "algorithm/interview/",
        "nodejs/"
      ]
    },
    {
      text: "JS \u9762\u8BD5\u9898",
      prefix: "/interview/javascript",
      children: [
        {
          text: "\u524D\u7AEF\u57FA\u7840",
          prefix: "foundation",
          children: [
            "data-type/",
            "execution-context/",
            "execution-mechanism/"
          ]
        },
        {
          text: "\u524D\u7AEF\u7F16\u7801",
          prefix: "coding",
          children: [
            "basic-api-usage/",
            "program-design/"
          ]
        },
        {
          text: "\u6027\u80FD\u4F18\u5316",
          prefix: "performance-optimization",
          children: [
            "debounce-throttle/"
          ]
        }
      ]
    },
    {
      text: "\u4E13\u9898",
      prefix: "/interview/topic",
      children: [
        "large-file-upload"
      ]
    },
    {
      text: "\u6570\u636E\u7ED3\u6784",
      prefix: "/interview/data-structure",
      children: [
        "binary-tree",
        "heap/"
      ]
    },
    {
      text: "\u7B97\u6CD5",
      prefix: "/interview/algorithm",
      children: [
        {
          text: "\u6392\u5E8F",
          prefix: "sorting-algorithm",
          children: [
            "",
            "bubble-sort/",
            "selection-sort/",
            "insertion-sort/",
            "merge-sort/",
            "quick-sort/"
          ]
        },
        {
          text: "\u5176\u4ED6",
          prefix: "others",
          children: [
            "binary-search/",
            "fibonacci-sequence"
          ]
        }
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/js.ts
var js_default = {
  "/js/": [
    {
      text: "\u6570\u636E\u7C7B\u578B",
      prefix: "/js/data-types",
      children: [
        "",
        "number/",
        "number/floating",
        "string/",
        "object/",
        "array/",
        "function/",
        "date/",
        "reg-exp/",
        "type-conversion"
      ]
    },
    {
      text: "\u6267\u884C\u673A\u5236",
      prefix: "/js/execution-mechanism",
      children: [
        "",
        "execution-context",
        "prototype",
        "this",
        "event-loop"
      ]
    },
    {
      text: "\u9519\u8BEF\u5904\u7406/\u65E5\u5FD7/\u8C03\u8BD5",
      prefix: "/js/error-handling",
      children: [
        "debug/",
        "log",
        {
          text: "\u9519\u8BEF\u5904\u7406",
          children: [
            "",
            "try-catch",
            "browser-error-handling"
          ]
        },
        {
          text: "\u63A7\u5236\u53F0\u65B9\u6CD5",
          prefix: "debug/console",
          children: [
            "",
            "console-log-event"
          ]
        }
      ]
    },
    {
      text: "\u8FD0\u7B97\u7B26",
      prefix: "/js/operators",
      children: [
        ""
      ]
    },
    {
      text: "WebAssemply",
      prefix: "/js/web-assembly",
      children: [
        ""
      ]
    },
    {
      text: "\u672A\u5206\u7C7B\u5185\u5BB9",
      prefix: "/js/unclassified",
      children: [
        "",
        "functional-programming",
        "pitfall"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/mini-program.ts
var mini_program_default = {
  // 代码片段
  "/mini-program/": [
    {
      text: "\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F",
      prefix: "/mini-program/weixin",
      children: [
        ""
      ]
    },
    {
      text: "uni-app",
      prefix: "/mini-program/uni-app",
      children: [
        "",
        "v-for-key"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/typescript.ts
var typescript_default = {
  "/typescript/": [
    {
      text: "TypeScript",
      prefix: "/typescript",
      children: [
        "",
        "type-manipulation/type-challenges"
      ]
    },
    {
      text: "\u6570\u636E\u7C7B\u578B",
      prefix: "/typescript/data-types",
      children: [
        "",
        "primitive-types",
        "object-type",
        "class",
        "enum",
        "function",
        "array"
      ]
    },
    {
      text: "\u7C7B\u578B\u7CFB\u7EDF",
      prefix: "/typescript/type-system",
      children: [
        "",
        "generics",
        "property-modifiers",
        "utility-types"
      ]
    },
    {
      text: "\u7C7B\u578B\u64CD\u4F5C",
      prefix: "/typescript/type-manipulation",
      children: [
        "",
        "type-operators"
      ]
    },
    {
      text: "\u6A21\u5757\u7CFB\u7EDF",
      prefix: "/typescript/module-system",
      children: [
        ""
      ]
    },
    {
      text: "TypeScript \u7F16\u8BD1",
      prefix: "/typescript/typescript-compilation",
      children: [
        ""
      ]
    },
    {
      text: "TypeScript \u4F7F\u7528",
      prefix: "/typescript/usage",
      children: [
        "declaration-files",
        "tsconfig-json",
        "publish"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/vue.ts
var vue_default = {
  // Vue 源码学习
  "/vue/": [
    {
      text: "Vue 2.x \u6E90\u7801\u5206\u6790",
      prefix: "",
      children: [
        "/vue/source-study/"
      ]
    },
    {
      text: "\u5B9E\u4F8B\u5316",
      prefix: "/vue/source-study",
      children: [
        "vue-constructor",
        "instance/create",
        "instance/state/",
        "instance/state/props",
        "instance/state/methods",
        "instance/state/data",
        "instance/state/computed",
        "instance/state/watch",
        "instance/directives",
        "instance/events"
      ]
    },
    {
      text: "\u7EC4\u4EF6\u5316",
      prefix: "/vue/source-study/component",
      children: [
        "register",
        "options",
        "async-component",
        "functional-component",
        "extend"
      ]
    },
    {
      text: "\u54CD\u5E94\u5F0F\u539F\u7406",
      prefix: "/vue/source-study/observer",
      children: [
        "",
        "dep-collection",
        "notify-update",
        "dep",
        "watcher",
        "scheduler",
        "array-observe-limit"
      ]
    },
    {
      text: "Virtual Dom",
      prefix: "/vue/source-study/vdom",
      children: [
        "",
        "vnode-tree-create",
        "patch",
        "patch-vnode",
        "child-component-create",
        "patch-modules/",
        "patch-fn",
        "topics/dom-binding"
      ]
    },
    {
      text: "\u7F16\u8BD1",
      prefix: "/vue/source-study/compile",
      children: [
        "",
        "compile-process",
        "base-compile",
        "parse",
        "parse-html",
        "optimize",
        "codegen"
      ]
    },
    {
      text: "\u7F16\u8BD1\u4E13\u9898",
      prefix: "/vue/source-study/compile/topics",
      children: [
        "event",
        "v-model",
        "slot"
      ]
    },
    {
      text: "\u5168\u5C40 API",
      prefix: "/vue/source-study/global-api",
      children: [
        "use"
      ]
    },
    {
      text: "Util",
      prefix: "/vue/source-study/util",
      children: [
        "next-tick",
        "lifecycle-hook-event"
      ]
    },
    {
      text: "SSR",
      prefix: "/vue/source-study/ssr",
      children: [
        "",
        "vue-server-renderer",
        "hydrate"
      ]
    },
    {
      text: "Vuex",
      prefix: "/vue/vue-series/vuex",
      children: [
        "",
        "reset-child-module-state",
        "register-module"
      ]
    },
    {
      text: "vue-router",
      prefix: "/vue/vue-series/vue-router/",
      children: [
        ""
      ]
    },
    {
      text: "\u5176\u4ED6",
      prefix: "/vue/vue-series/vuejs",
      children: [
        "scoped-css"
      ]
    },
    // 等待以后分离出去
    {
      text: "Vue 3.x",
      prefix: "/vue3",
      children: [
        "",
        "composition-api",
        "reactivity/use-difference"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/wander.ts
var wander_default = {
  // 随记
  "/wander/": [
    {
      text: "House \u76F8\u5173",
      prefix: "/wander/house",
      children: [
        "",
        "tianya-post",
        "beijing/",
        "zhonghailichunhushu/",
        "wanxiangyuefu/",
        "xishanjinxiufu/",
        "comparison"
      ]
    },
    {
      text: "\u6295\u8D44\u7406\u8D22",
      prefix: "/wander/investment",
      children: [
        "stocks"
      ]
    },
    {
      text: "\u6237\u5916",
      children: [
        "/wander/outdoor/"
      ]
    },
    {
      text: "\u5DE5\u5177",
      children: [
        "/wander/tools"
      ]
    },
    {
      text: "\u5176\u4ED6",
      prefix: "/wander/others",
      children: [
        "mac-shortcut-keys",
        "word-pronunciation",
        "theories",
        "ssr/"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/react.ts
var react_default = {
  "/react/": [
    // {
    //     text: 'React',
    //     prefix: '/react',
    //     children: [
    //         '',
    //     ]
    // },
    {
      text: "React Hooks",
      prefix: "/react/hooks",
      children: [
        "",
        "useState",
        "useReducer",
        "useEffect",
        "useMemo",
        "useRef",
        "useSyncExternalStore",
        "custom-hooks"
      ]
    }
  ]
};

// docs/.vuepress/sidebar/list/animation-effects.ts
var animation_effects_default = {
  // CSS/JS 动画效果
  "/animation-effects/": [
    "",
    "scroll-elements-fade-up",
    "complicated-animations-with-animation-delay"
  ]
};

// docs/.vuepress/sidebar/index.ts
var sidebar_default = {
  ...articles_default,
  ...browser_env_default,
  ...code_snippet_default,
  ...css_default,
  ...es6_default,
  ...front_end_engineering_default,
  ...full_stack_default,
  ...interview_default,
  ...js_default,
  ...mini_program_default,
  ...typescript_default,
  ...vue_default,
  ...wander_default,
  ...react_default,
  ...animation_effects_default
};

// docs/.vuepress/config.ts
var __vite_injected_original_dirname = "/Users/wind-stone/github/blog/docs/.vuepress";
var componentsDir = path.resolve(__vite_injected_original_dirname, "./components");
var config_default = defineUserConfig({
  title: "\u98CE\u52A8\u4E4B\u77F3\u7684\u535A\u5BA2",
  // 网站的标题
  description: "\u8BB0\u5F55\u5DE5\u4F5C\uFF0C\u8BB0\u5F55\u751F\u6D3B",
  // 网站的描述
  head: [
    // 额外的需要被注入到当前页面的 HTML <head> 中的标签
    ["link", {
      rel: "icon",
      href: "/images/logo.png"
    }]
  ],
  theme: hopeTheme({
    hostname: "https://blog.windstone.cc",
    logo: "/images/logo.png",
    navbar: navbar_default,
    sidebar: sidebar_default,
    lastUpdated: false,
    contributors: false
  }),
  // 开发配置项
  debug: true,
  // 是否启用 Debug 模式
  open: true,
  // 是否在开发服务器启动后打开浏览器
  // markdown 配置
  markdown: {
    toc: {
      // 控制 [[TOC]] 默认行为
      level: [2, 3, 4, 5]
      // 决定哪些级别的标题会被显示在目录中，默认值为 [2, 3]
    },
    importCode: {
      handleImportPath: (str) => str.replace(/^@components/, componentsDir)
    }
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
        content: "\u98CE\u52A8\u4E4B\u77F3\u7684\u535A\u5BA2",
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
      author: "\u98CE\u52A8\u4E4B\u77F3",
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
      size: true
    })
  ],
  templateDev: path.resolve(__vite_injected_original_dirname, "./templates/index.dev.html"),
  templateBuild: path.resolve(__vite_injected_original_dirname, "./templates/index.build.html"),
  bundler: viteBundler()
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udnVlcHJlc3MvY29uZmlnLnRzIiwgImRvY3MvLnZ1ZXByZXNzL25hdmJhci50cyIsICJkb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvYXJ0aWNsZXMudHMiLCAiZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L2Jyb3dzZXItZW52LnRzIiwgImRvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9jb2RlLXNuaXBwZXQudHMiLCAiZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L2Nzcy50cyIsICJkb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvZXM2LnRzIiwgImRvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9mcm9udC1lbmQtZW5naW5lZXJpbmcudHMiLCAiZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L2Z1bGwtc3RhY2sudHMiLCAiZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L2ludGVydmlldy50cyIsICJkb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvanMudHMiLCAiZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L21pbmktcHJvZ3JhbS50cyIsICJkb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvdHlwZXNjcmlwdC50cyIsICJkb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvdnVlLnRzIiwgImRvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC93YW5kZXIudHMiLCAiZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L3JlYWN0LnRzIiwgImRvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9hbmltYXRpb24tZWZmZWN0cy50cyIsICJkb2NzLy52dWVwcmVzcy9zaWRlYmFyL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL2NvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZVVzZXJDb25maWcgfSBmcm9tICd2dWVwcmVzcyc7XG5pbXBvcnQgeyB2aXRlQnVuZGxlciB9IGZyb20gJ0B2dWVwcmVzcy9idW5kbGVyLXZpdGUnO1xuaW1wb3J0IHsgc2VhcmNoUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1zZWFyY2gnO1xuaW1wb3J0IHsgd2F0ZXJtYXJrUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi13YXRlcm1hcmsnO1xuaW1wb3J0IHsgcGhvdG9Td2lwZVBsdWdpbiB9IGZyb20gJ0B2dWVwcmVzcy9wbHVnaW4tcGhvdG8tc3dpcGUnO1xuaW1wb3J0IHsgY29weXJpZ2h0UGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1jb3B5cmlnaHQnO1xuaW1wb3J0IHsgY29weUNvZGVQbHVnaW4gfSBmcm9tICdAdnVlcHJlc3MvcGx1Z2luLWNvcHktY29kZSc7XG5pbXBvcnQgeyBtYXJrZG93bkltYWdlUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1tYXJrZG93bi1pbWFnZSdcbmltcG9ydCB7IHJlZ2lzdGVyQ29tcG9uZW50c1BsdWdpbiB9IGZyb20gJ0B2dWVwcmVzcy9wbHVnaW4tcmVnaXN0ZXItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBob3BlVGhlbWUgfSBmcm9tIFwidnVlcHJlc3MtdGhlbWUtaG9wZVwiO1xuaW1wb3J0IG5hdmJhciBmcm9tICcuL25hdmJhcic7XG5pbXBvcnQgc2lkZWJhciBmcm9tICcuL3NpZGViYXInO1xuXG5jb25zdCBjb21wb25lbnRzRGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vY29tcG9uZW50cycpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVVc2VyQ29uZmlnKHtcbiAgdGl0bGU6ICdcdTk4Q0VcdTUyQThcdTRFNEJcdTc3RjNcdTc2ODRcdTUzNUFcdTVCQTInLCAgICAgICAgICAvLyBcdTdGNTFcdTdBRDlcdTc2ODRcdTY4MDdcdTk4OThcbiAgZGVzY3JpcHRpb246ICdcdThCQjBcdTVGNTVcdTVERTVcdTRGNUNcdUZGMENcdThCQjBcdTVGNTVcdTc1MUZcdTZEM0InLCAvLyBcdTdGNTFcdTdBRDlcdTc2ODRcdTYzQ0ZcdThGRjBcbiAgaGVhZDogWyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcdTk4OURcdTU5MTZcdTc2ODRcdTk3MDBcdTg5ODFcdTg4QUJcdTZDRThcdTUxNjVcdTUyMzBcdTVGNTNcdTUyNERcdTk4NzVcdTk3NjJcdTc2ODQgSFRNTCA8aGVhZD4gXHU0RTJEXHU3Njg0XHU2ODA3XHU3QjdFXG4gICAgWydsaW5rJywge1xuICAgICAgcmVsOiAnaWNvbicsXG4gICAgICBocmVmOiAnL2ltYWdlcy9sb2dvLnBuZydcbiAgICB9XVxuICBdLFxuXG4gIHRoZW1lOiBob3BlVGhlbWUoe1xuICAgIGhvc3RuYW1lOiAnaHR0cHM6Ly9ibG9nLndpbmRzdG9uZS5jYycsXG4gICAgbG9nbzogJy9pbWFnZXMvbG9nby5wbmcnLFxuICAgIG5hdmJhcixcbiAgICBzaWRlYmFyLFxuICAgIGxhc3RVcGRhdGVkOiBmYWxzZSxcbiAgICBjb250cmlidXRvcnM6IGZhbHNlLFxuICB9KSxcblxuICAvLyBcdTVGMDBcdTUzRDFcdTkxNERcdTdGNkVcdTk4NzlcbiAgZGVidWc6IHRydWUsICAgICAgICAgICAgICAgICAgICAvLyBcdTY2MkZcdTU0MjZcdTU0MkZcdTc1MjggRGVidWcgXHU2QTIxXHU1RjBGXG4gIG9wZW46IHRydWUsICAgICAgICAgICAgICAgICAgICAgLy8gXHU2NjJGXHU1NDI2XHU1NzI4XHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU1NDJGXHU1MkE4XHU1NDBFXHU2MjUzXHU1RjAwXHU2RDRGXHU4OUM4XHU1NjY4XG5cbiAgLy8gbWFya2Rvd24gXHU5MTREXHU3RjZFXG4gIG1hcmtkb3duOiB7XG4gICAgdG9jOiB7ICAgICAgICAgICAgICAgICAgICAgIC8vIFx1NjNBN1x1NTIzNiBbW1RPQ11dIFx1OUVEOFx1OEJBNFx1ODg0Q1x1NEUzQVxuICAgICAgbGV2ZWw6IFsyLCAzLCA0LCA1XSAgICAgLy8gXHU1MUIzXHU1QjlBXHU1NEVBXHU0RTlCXHU3RUE3XHU1MjJCXHU3Njg0XHU2ODA3XHU5ODk4XHU0RjFBXHU4OEFCXHU2NjNFXHU3OTNBXHU1NzI4XHU3NkVFXHU1RjU1XHU0RTJEXHVGRjBDXHU5RUQ4XHU4QkE0XHU1MDNDXHU0RTNBIFsyLCAzXVxuICAgIH0sXG5cbiAgICBpbXBvcnRDb2RlOiB7XG4gICAgICBoYW5kbGVJbXBvcnRQYXRoOiAoc3RyKSA9PiBzdHIucmVwbGFjZSgvXkBjb21wb25lbnRzLywgY29tcG9uZW50c0RpciksXG4gICAgfSxcbiAgfSxcblxuXG4gIHBsdWdpbnM6IFtcbiAgICAvLyBcdTRFM0FcdTRGNjBcdTc2ODRcdTY1ODdcdTY4NjNcdTdGNTFcdTdBRDlcdTYzRDBcdTRGOUJcdTY3MkNcdTU3MzBcdTY0MUNcdTdEMjJcdTgwRkRcdTUyOUJcdTMwMDJodHRwczovL2Vjb3N5c3RlbS52dWVqcy5wcmVzcy96aC9wbHVnaW5zL3NlYXJjaC9zZWFyY2guaHRtbFxuICAgIHNlYXJjaFBsdWdpbih7XG4gICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICAgIG1heFN1Z2dlc3Rpb25zOiAxMFxuICAgIH0pLFxuXG4gICAgLy8gXHU2ODM5XHU2MzZFXHU3RUM0XHU0RUY2XHU2NTg3XHU0RUY2XHU2MjE2XHU3NkVFXHU1RjU1XHU4MUVBXHU1MkE4XHU2Q0U4XHU1MThDIFZ1ZSBcdTdFQzRcdTRFRjZcdTMwMDJodHRwczovL2Vjb3N5c3RlbS52dWVqcy5wcmVzcy96aC9wbHVnaW5zL3Rvb2xzL3JlZ2lzdGVyLWNvbXBvbmVudHMuaHRtbFxuICAgIHJlZ2lzdGVyQ29tcG9uZW50c1BsdWdpbih7XG4gICAgICAvLyBcdTkxNERcdTdGNkVcdTk4NzlcbiAgICAgIGNvbXBvbmVudHNEaXJcbiAgICB9KSxcblxuICAgIC8vIFx1NkMzNFx1NTM3MFx1RkYwQ2h0dHBzOi8vZWNvc3lzdGVtLnZ1ZWpzLnByZXNzL3poL3BsdWdpbnMvZmVhdHVyZXMvd2F0ZXJtYXJrLmh0bWxcbiAgICB3YXRlcm1hcmtQbHVnaW4oe1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIHdhdGVybWFya09wdGlvbnM6IHtcbiAgICAgICAgY29udGVudDogJ1x1OThDRVx1NTJBOFx1NEU0Qlx1NzdGM1x1NzY4NFx1NTM1QVx1NUJBMicsXG4gICAgICAgIGdsb2JhbEFscGhhOiAwLjFcbiAgICAgIH1cbiAgICB9KSxcblxuICAgIC8vIFx1NkI2NFx1NjNEMlx1NEVGNlx1NEYxQVx1NEY3Rlx1OTg3NVx1OTc2Mlx1NkI2M1x1NjU4N1x1NTE4NVx1NzY4NFx1NTZGRVx1NzI0N1x1NTcyOFx1NzBCOVx1NTFGQlx1NjVGNlx1OEZEQlx1NTE2NVx1NkQ0Rlx1ODlDOFx1NkEyMVx1NUYwRlx1NkQ0Rlx1ODlDOFx1RkYwQ2h0dHBzOi8vZWNvc3lzdGVtLnZ1ZWpzLnByZXNzL3poL3BsdWdpbnMvZmVhdHVyZXMvcGhvdG8tc3dpcGUuaHRtbFxuICAgIHBob3RvU3dpcGVQbHVnaW4oe1xuICAgICAgLy8gXHU5MDA5XHU5ODc5XG4gICAgfSksXG5cbiAgICAvLyBcdTZCNjRcdTYzRDJcdTRFRjZcdTUzRUZcdTRFRTVcdTU3MjhcdThCQkZcdTk1RUVcdTgwMDVcdTRFQ0VcdTRGNjBcdTc2ODRcdTdBRDlcdTcwQjlcdTU5MERcdTUyMzZcdTUxODVcdTVCQjlcdTY1RjZcdUZGMENcdTgxRUFcdTUyQThcdThGRkRcdTUyQTBcdTcyNDhcdTY3NDNcdTRGRTFcdTYwNkZcdUZGMENcdTRFNUZcdTUzRUZcdTRFRTVcdTc5ODFcdTZCNjJcdTdBRDlcdTcwQjlcdTc2ODRcdTU5MERcdTUyMzZcdTYyMTZcdTgwMDVcdTkwMDlcdTYyRTlcdTMwMDJcbiAgICAvLyBodHRwczovL2Vjb3N5c3RlbS52dWVqcy5wcmVzcy96aC9wbHVnaW5zL2ZlYXR1cmVzL2NvcHlyaWdodC5odG1sXG4gICAgY29weXJpZ2h0UGx1Z2luKHtcbiAgICAgIGdsb2JhbDogdHJ1ZSxcbiAgICAgIGF1dGhvcjogJ1x1OThDRVx1NTJBOFx1NEU0Qlx1NzdGMycsXG4gICAgICB0cmlnZ2VyTGVuZ3RoOiAxMFxuICAgIH0pLFxuXG4gICAgLy8gXHU2QjY0XHU2M0QyXHU0RUY2XHU0RjFBXHU4MUVBXHU1MkE4XHU1NzI4IFBDIFx1OEJCRVx1NTkwN1x1NEUwQVx1NEUzQVx1NkJDRlx1NEUyQVx1NEVFM1x1NzgwMVx1NTc1N1x1NTNGM1x1NEUwQVx1ODlEMlx1NkRGQlx1NTJBMFx1NTkwRFx1NTIzNlx1NjMwOVx1OTRBRVx1MzAwMmh0dHBzOi8vZWNvc3lzdGVtLnZ1ZWpzLnByZXNzL3poL3BsdWdpbnMvZmVhdHVyZXMvY29weS1jb2RlLmh0bWxcbiAgICBjb3B5Q29kZVBsdWdpbih7XG4gICAgICAvLyBvcHRpb25zXG4gICAgfSksXG5cbiAgICAvLyBcdTU0MTFcdTRGNjBcdTc2ODQgTWFya2Rvd24gXHU1NkZFXHU1MENGXHU2REZCXHU1MkEwXHU5NjQ0XHU1MkEwXHU1MjlGXHU4MEZEXHUzMDAyaHR0cHM6Ly9lY29zeXN0ZW0udnVlanMucHJlc3MvemgvcGx1Z2lucy9tYXJrZG93bi9tYXJrZG93bi1pbWFnZS5odG1sXG4gICAgbWFya2Rvd25JbWFnZVBsdWdpbih7XG4gICAgICAvLyBcdTU0MkZcdTc1MjggZmlndXJlXG4gICAgICBmaWd1cmU6IHRydWUsXG4gICAgICAvLyBcdTU0MkZcdTc1MjhcdTU2RkVcdTcyNDdcdTYxRDJcdTUyQTBcdThGN0RcbiAgICAgIGxhenlsb2FkOiB0cnVlLFxuICAgICAgLy8gXHU1NDJGXHU3NTI4XHU1NkZFXHU3MjQ3XHU2ODA3XHU4QkIwXG4gICAgICBtYXJrOiBmYWxzZSxcbiAgICAgIC8vIFx1NTQyRlx1NzUyOFx1NTZGRVx1NzI0N1x1NTkyN1x1NUMwRlxuICAgICAgc2l6ZTogdHJ1ZSxcbiAgICB9KSxcbiAgXSxcblxuICB0ZW1wbGF0ZURldjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vdGVtcGxhdGVzL2luZGV4LmRldi5odG1sJyksXG4gIHRlbXBsYXRlQnVpbGQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3RlbXBsYXRlcy9pbmRleC5idWlsZC5odG1sJyksXG5cbiAgYnVuZGxlcjogdml0ZUJ1bmRsZXIoKSxcbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9uYXZiYXIudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3MvbmF2YmFyLnRzXCI7ZXhwb3J0IGRlZmF1bHQgW1xuICAgIHsgdGV4dDogJ1Z1ZSAyLnggXHU2RTkwXHU3ODAxXHU1QjY2XHU0RTYwJywgbGluazogJy92dWUvc291cmNlLXN0dWR5LycgfSxcbiAgICB7XG4gICAgICAgIHRleHQ6ICdKYXZhU2NyaXB0JyxcbiAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHsgdGV4dDogJ0phdmFTY3JpcHQnLCBsaW5rOiAnL2pzL2RhdGEtdHlwZXMvJywgYWN0aXZlTWF0Y2g6ICdeL2pzJyB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnRVM2KycsIGxpbms6ICcvZXM2LycsIGFjdGl2ZU1hdGNoOiAnXi9lczYnIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICdUeXBlU2NyaXB0JywgbGluazogJy90eXBlc2NyaXB0LycsIGFjdGl2ZU1hdGNoOiAnXi90eXBlc2NyaXB0JyB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnUmVhY3QnLCBsaW5rOiAnL3JlYWN0L2hvb2tzLycsIGFjdGl2ZU1hdGNoOiAnXi9yZWFjdCcgfVxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0ZXh0OiAnSFRNTC9DU1MvXHU2RDRGXHU4OUM4XHU1NjY4JyxcbiAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHsgdGV4dDogJ0NTUycsIGxpbms6ICcvY3NzL3NlbGVjdG9ycy8nLCBhY3RpdmVNYXRjaDogJ14vY3NzJyB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnQ1NTL0pTIFx1NTJBOFx1NzUzQlx1NjU0OFx1Njc5QycsIGxpbms6ICcvYW5pbWF0aW9uLWVmZmVjdHMvJywgYWN0aXZlTWF0Y2g6ICdeL2FuaW1hdGlvbi1lZmZlY3RzLycgfSxcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1NkQ0Rlx1ODlDOFx1NTY2OCcsIGxpbms6ICcvYnJvd3Nlci1lbnYvYnJvd3Nlci9ob3ctYnJvd3NlcnMtd29yaycsIGFjdGl2ZU1hdGNoOiAnXi9icm93c2VyLWVudicgfSxcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1NUMwRlx1N0EwQlx1NUU4RicsIGxpbms6ICcvbWluaS1wcm9ncmFtL3dlaXhpbi8nLCBhY3RpdmVNYXRjaDogJ14vbWluaS1wcm9ncmFtJyB9LFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0ZXh0OiAnXHU1MjREXHU3QUVGXHU1REU1XHU3QTBCXHU1MzE2JyxcbiAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnXHU2OTgyXHU4RkYwJyxcbiAgICAgICAgICAgICAgICBsaW5rOiAnL2Zyb250LWVuZC1lbmdpbmVlcmluZy8nLFxuICAgICAgICAgICAgICAgIGFjdGl2ZU1hdGNoOiAnXi9mcm9udC1lbmQtZW5naW5lZXJpbmcvJCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDogJ1x1NTIxRFx1NTlDQlx1NTMxNlx1OTYzNlx1NkJCNScsXG4gICAgICAgICAgICAgICAgbGluazogJy9mcm9udC1lbmQtZW5naW5lZXJpbmcvaW5pdGlhbGl6YXRpb24vcHJvamVjdC8nLFxuICAgICAgICAgICAgICAgIGFjdGl2ZU1hdGNoOiAnXi9mcm9udC1lbmQtZW5naW5lZXJpbmcvaW5pdGlhbGl6YXRpb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdcdTVGMDBcdTUzRDFcdTk2MzZcdTZCQjUnLFxuICAgICAgICAgICAgICAgIGxpbms6ICcvZnJvbnQtZW5kLWVuZ2luZWVyaW5nL2RldmVsb3BtZW50L2g1LycsXG4gICAgICAgICAgICAgICAgYWN0aXZlTWF0Y2g6ICdeL2Zyb250LWVuZC1lbmdpbmVlcmluZy9kZXZlbG9wbWVudCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDogJ1x1Njc4NFx1NUVGQVx1OTYzNlx1NkJCNScsXG4gICAgICAgICAgICAgICAgbGluazogJy9mcm9udC1lbmQtZW5naW5lZXJpbmcvYnVpbGQvd2VicGFjay8nLFxuICAgICAgICAgICAgICAgIGFjdGl2ZU1hdGNoOiAnXi9mcm9udC1lbmQtZW5naW5lZXJpbmcvYnVpbGQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdcdTUzRDFcdTVFMDNcdTk2MzZcdTZCQjUnLFxuICAgICAgICAgICAgICAgIGxpbms6ICcvZnJvbnQtZW5kLWVuZ2luZWVyaW5nL3B1Ymxpc2gvY2hhbmdlbG9nJyxcbiAgICAgICAgICAgICAgICBhY3RpdmVNYXRjaDogJ14vZnJvbnQtZW5kLWVuZ2luZWVyaW5nL3B1Ymxpc2gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdcdTUyNERcdTdBRUZcdTdBMzNcdTVCOUFcdTYwMjdcdTVFRkFcdThCQkUnLFxuICAgICAgICAgICAgICAgIGxpbms6ICcvZnJvbnQtZW5kLWVuZ2luZWVyaW5nL2Zyb250ZW5kLXN0YWJpbGl0eS1jb25zdHJ1Y3Rpb24vJyxcbiAgICAgICAgICAgICAgICBhY3RpdmVNYXRjaDogJ14vZnJvbnQtZW5kLWVuZ2luZWVyaW5nL2Zyb250ZW5kLXN0YWJpbGl0eS1jb25zdHJ1Y3Rpb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICB0ZXh0OiAnXHU1MTY4XHU2ODA4XHU2MjgwXHU4MEZEJyxcbiAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnXHU4QkJFXHU4QkExXHU2QTIxXHU1RjBGJyxcbiAgICAgICAgICAgICAgICBsaW5rOiAnL2Z1bGwtc3RhY2svZGVzaWduLXBhdHRlcm5zL3NpbmdsZXRvbi1wYXR0ZXJuJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnXHU2NENEXHU0RjVDXHU3Q0ZCXHU3RURGXHU0RTBFXHU1NDdEXHU0RUU0XHU4ODRDJyxcbiAgICAgICAgICAgICAgICBsaW5rOiAnL2Z1bGwtc3RhY2svb3BlcmF0aW5nLXN5c3RlbS9saW51eC8nXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDogJ1x1NjU3MFx1NjM2RVx1N0JBMVx1NzQwNicsXG4gICAgICAgICAgICAgICAgbGluazogJy9mdWxsLXN0YWNrL2RhdGEtbWFuYWdlbWVudC9rYWZrYS8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdcdTU0MEVcdTdBRUZcdTVGMDBcdTUzRDEnLFxuICAgICAgICAgICAgICAgIGxpbms6ICcvZnVsbC1zdGFjay9iYWNrZW5kL25lc3Rqcy8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdcdTUxNjhcdTY4MDhcdTVGMDBcdTUzRDFcdTc2ODRcdThGNkZcdTRFRjZcdTRGN0ZcdTc1MjgnLFxuICAgICAgICAgICAgICAgIGxpbms6ICcvZnVsbC1zdGFjay9zb2Z0d2FyZS9uZ2lueC8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6ICdcdTUxNzZcdTRFRDYnLFxuICAgICAgICAgICAgICAgIGxpbms6ICcvZnVsbC1zdGFjay9vdGhlcnMvZ29vZ2xlLWNsb3VkJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgICB0ZXh0OiAnXHU0RUUzXHU3ODAxXHU3MjQ3XHU2QkI1L1x1NjI4MFx1NjcyRlx1NjU4N1x1N0FFMCcsXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTRFRTNcdTc4MDFcdTcyNDdcdTZCQjUnLCBsaW5rOiAnL2NvZGUtc25pcHBldC8nLCBhY3RpdmVNYXRjaDogJ14vY29kZS1zbmlwcGV0JyB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU2MjgwXHU2NzJGXHU2NTg3XHU3QUUwJywgbGluazogJy9hcnRpY2xlcy9zdHJpbmctbGl0ZXJhbC8nLCBhY3RpdmVNYXRjaDogJ14vYXJ0aWNsZXMnIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTk3NjJcdThCRDVcdTk4OThcdTVFOTMnLCBsaW5rOiAnL2ludGVydmlldy8nLCBhY3RpdmVNYXRjaDogJ14vaW50ZXJ2aWV3JyB9XG4gICAgICAgIF1cbiAgICB9LFxuICAgIHsgdGV4dDogJ0dpdEh1YicsIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vd2luZC1zdG9uZScgfSxcbiAgICB7IHRleHQ6ICdcdTk2OEZcdThCQjAnLCBsaW5rOiAnL3dhbmRlci9ob3VzZS8nIH1cbl1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvYXJ0aWNsZXMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L2FydGljbGVzLnRzXCI7ZXhwb3J0IGRlZmF1bHQge1xuICAgIC8vIFx1NjI4MFx1NjcyRlx1NjU4N1x1N0FFMFxuICAgICcvYXJ0aWNsZXMvJzogW1xuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU2NTg3XHU3QUUwXHU1MjE3XHU4ODY4JyxcbiAgICAgICAgICAgIGNvbGxhcHNhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHByZWZpeDogJy9hcnRpY2xlcycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdzdHJpbmctbGl0ZXJhbC8nLFxuICAgICAgICAgICAgICAgICdsaW5lLXRlcm1pbmF0b3IvJyxcbiAgICAgICAgICAgICAgICAnd2VjaGF0LW1pbmktcHJvZ3JhbS1zb3VyY2VtYXAvJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU2NUU1XHU1RTM4XHU5NjA1XHU4QkZCXHU2NTg3XHU3QUUwJyxcbiAgICAgICAgICAgIGNvbGxhcHNhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHByZWZpeDogJy9hcnRpY2xlcycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdnb29kLWFydGljbGVzLycsXG4gICAgICAgICAgICAgICAgJ2dvb2QtYXJ0aWNsZXMvamF2YXNjcmlwdCcsXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9icm93c2VyLWVudi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvYnJvd3Nlci1lbnYudHNcIjtleHBvcnQgZGVmYXVsdCB7XG4gICAgJy9icm93c2VyLWVudi8nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTZENEZcdTg5QzhcdTU2NjgnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Jyb3dzZXItZW52L2Jyb3dzZXInLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnaG93LWJyb3dzZXJzLXdvcmsnLFxuICAgICAgICAgICAgICAgICdmaXJzdC1wYWludCcsXG4gICAgICAgICAgICAgICAgJ3Byb2Nlc3MtdGhyZWFkJyxcbiAgICAgICAgICAgICAgICAnZXZlbnQtbG9vcCcsXG4gICAgICAgICAgICAgICAgJ2NhY2hlJyxcbiAgICAgICAgICAgICAgICAncGVyZm9ybWFuY2UvJyxcbiAgICAgICAgICAgICAgICAnYnJvd3Nlci1hcGknLFxuICAgICAgICAgICAgICAgICdicm93c2VyLXJlcXVlc3RzJyxcbiAgICAgICAgICAgICAgICAnZmFxJyxcbiAgICAgICAgICAgICAgICAnZGV2LXRvb2xzLycsXG4gICAgICAgICAgICAgICAgJ2ZpbmdlcnByaW50J1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnSFRNTC9ET00nLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Jyb3dzZXItZW52L2h0bWwtZG9tJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJ2VsZW1lbnRzLycsXG4gICAgICAgICAgICAgICAgJ2F0dHJpYnV0ZXMtcHJvcGVydGllcy9hdHRyaWJ1dGVzJyxcbiAgICAgICAgICAgICAgICAnYXR0cmlidXRlcy1wcm9wZXJ0aWVzL3Byb3BlcnRpZXMnLFxuICAgICAgICAgICAgICAgICdhdHRyaWJ1dGVzLXByb3BlcnRpZXMvZGlmZmVyZW5jZXMtYmV0d2Vlbi1wcm9wZXJ0aWVzLWFuZC1hdHRyaWJ1dGVzJyxcbiAgICAgICAgICAgICAgICAnaW1hZ2UvJyxcbiAgICAgICAgICAgICAgICAnaW1hZ2UvaW1hZ2UtbGF6eS1sb2FkJyxcbiAgICAgICAgICAgICAgICAnc3ZnLycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTRFOEJcdTRFRjYnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Jyb3dzZXItZW52L2V2ZW50cycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICdibHVyJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1N0Y1MVx1N0VEQycsXG4gICAgICAgICAgICBwcmVmaXg6ICcvYnJvd3Nlci1lbnYvbmV0d29yaycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdodHRwLycsXG4gICAgICAgICAgICAgICAgJ2h0dHBzLycsXG4gICAgICAgICAgICAgICAgJ2h0dHAyLycsXG4gICAgICAgICAgICAgICAgJ2NvcnMvJyxcbiAgICAgICAgICAgICAgICAnZG5zJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NUI4OVx1NTE2OCcsXG4gICAgICAgICAgICBwcmVmaXg6ICcvYnJvd3Nlci1lbnYvc2VjdXJpdHknLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAnY2hyb21lLXNlY3VyaXR5LXBvbGljeScsXG4gICAgICAgICAgICAgICAgJ2Nyb3NzLWRvbWFpbicsXG4gICAgICAgICAgICAgICAgJ3NhbWUtc2l0ZScsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdIeWJyaWQnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Jyb3dzZXItZW52L2h5YnJpZCcsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdoNTJhcHAnLFxuICAgICAgICAgICAgICAgICdqc2JyaWRnZScsXG4gICAgICAgICAgICAgICAgJ3VuaXZlcnNhbC1saW5rcycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTZENEZcdTg5QzhcdTU2NjhcdTUzODJcdTU1NDZcdTUzQ0FcdTVFOTRcdTc1MjhcdTczQUZcdTU4ODMnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Jyb3dzZXItZW52L3ZlbmRvci1hcHAnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnd2VjaGF0LycsXG4gICAgICAgICAgICAgICAgJ3dlY2hhdC9hbmRyb2lkLXdlaXhpbi1hdXRvLW9wZW4tYnJvd3NlcicsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTZENEZcdTg5QzhcdTU2NjhcdTUxN0NcdTVCQjlcdTYwMjcnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Jyb3dzZXItZW52L2NvbXBhdGliaWxpdHknLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAndmlkZW8nLFxuICAgICAgICAgICAgICAgICdhdWRpbycsXG4gICAgICAgICAgICAgICAgJ2lucHV0LWRlbGF5LycsXG4gICAgICAgICAgICAgICAgJ2lvcy8nLFxuICAgICAgICAgICAgICAgICdpb3Mvc2FmYXJpLXNjcmlwdC1ibG9jay1yZW5kZXInLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU2RURBXHU1MkE4XHU0RTEzXHU5ODk4JyxcbiAgICAgICAgICAgIHByZWZpeDogJy9icm93c2VyLWVudi9zY3JvbGwnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAndG91Y2gtZXZlbnQnLFxuICAgICAgICAgICAgICAgICdjbGljay1kZWxheScsXG4gICAgICAgICAgICAgICAgJ2Zhc3RjbGljaycsXG4gICAgICAgICAgICAgICAgJ25vLWJnLXNjcm9sbCdcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NjcyQVx1NTIwNlx1N0M3QicsXG4gICAgICAgICAgICBwcmVmaXg6ICcvYnJvd3Nlci1lbnYvdW5jbGFzc2lmaWVkJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJ3dlYi1jb21wb25lbnRzJyxcbiAgICAgICAgICAgICAgICAncHdhJyxcbiAgICAgICAgICAgICAgICAnZmlsZS1zeXN0ZW0nLFxuICAgICAgICAgICAgICAgICdrZXlib2FyZCcsXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdLFxufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvY29kZS1zbmlwcGV0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9jb2RlLXNuaXBwZXQudHNcIjtleHBvcnQgZGVmYXVsdCB7XG4gICAgJy9jb2RlLXNuaXBwZXQnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdKUyBcdTRFRTNcdTc4MDFcdTcyNDdcdTZCQjUnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTVERTVcdTUxNzdcdTUxRkRcdTY1NzAnLFxuICAgICAgICAgICAgICAgICAgICBwcmVmaXg6ICcvY29kZS1zbmlwcGV0L2pzL3V0aWxzJyxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhLXR5cGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2VudicsXG4gICAgICAgICAgICAgICAgICAgICAgICAndmVyc2lvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZXZlbnQtZW1pdHRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAncXVlZW4tbmV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZm9ybWF0JyxcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTZENEZcdTg5QzhcdTU2NjhcdTczQUZcdTU4ODMnLFxuICAgICAgICAgICAgICAgICAgICBwcmVmaXg6ICcvY29kZS1zbmlwcGV0L2pzL2Jyb3dzZXInLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb29raWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3VybCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbG9hZC1zY3JpcHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0b3JhZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsaXBib2FyZCcsXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgJy9jb2RlLXNuaXBwZXQvanMvc2VydmVyLycsXG4gICAgICAgICAgICAgICAgJy9jb2RlLXNuaXBwZXQvanMvdmFsaWRhdGUvJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTZENEZcdTg5QzhcdTU2NjhcdTRFRTNcdTc4MDFcdTcyNDdcdTZCQjUnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnL2NvZGUtc25pcHBldC9icm93c2VyLWVudi9yZW0vJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnVnVlIDIueCBcdTdFQzRcdTRFRjYnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2NvZGUtc25pcHBldC92dWUtY29tcG9uZW50cycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdiYXNlLW1hcnF1ZWUnLFxuICAgICAgICAgICAgICAgICdjb21tb24tcG9wdXAnLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgIF1cbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L2Nzcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvY3NzLnRzXCI7ZXhwb3J0IGRlZmF1bHQge1xuICAgICcvY3NzLyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0NTUyBcdTYyODBcdTgwRkQnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTVFMDNcdTVDNDAnLFxuICAgICAgICAgICAgICAgICAgICBwcmVmaXg6ICcvY3NzL3NraWxscycsXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGluZS1ib3hlcy10cnVuY2F0aW9uLXN0eWxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkb2ctZWFyJyxcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NEUxM1x1OTg5OCcsXG4gICAgICAgICAgICBwcmVmaXg6ICcvY3NzL3RvcGljcycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0ZsZXggXHU1RTAzXHU1QzQwJyxcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAnZmxleC8nLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZmxleC1pbWFnZS8nLFxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTY1ODdcdTY3MkMnLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQvdGV4dC13cmFwLWFuZC1lbGxpcHNpcy8nLFxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdThGQjlcdTY4NDYnLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci9ib3JkZXItaW1hZ2UnLFxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAncG9zaXRpb24tZml4ZWQnLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU5MDA5XHU2MkU5XHU1NjY4JyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJy9jc3Mvc2VsZWN0b3JzLydcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NUM1RVx1NjAyNycsXG4gICAgICAgICAgICBwcmVmaXg6ICcvY3NzL3Byb3BlcnRpZXMnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAncHJvcGVydGllcy1vcmRlcidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NUM0Rlx1NUU1NScsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcvY3NzL3NjcmVlbi8nXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTg5QzZcdTUzRTMnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Nzcy92aWV3cG9ydCcsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdhLXRhbGUtb2Ytdmlld3BvcnRzLW9uZScsXG4gICAgICAgICAgICAgICAgJ2EtdGFsZS1vZi12aWV3cG9ydHMtdHdvJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU1RTAzXHU1QzQwJyxcbiAgICAgICAgICAgIHByZWZpeDogJy9jc3MvbGF5b3V0cycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICdpZmMvJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU1QjU3XHU0RjUzJyxcbiAgICAgICAgICAgIHByZWZpeDogJy9jc3MvZm9udCcsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICdjc3MtZm9udC1tZXRyaWNzLWxpbmUtaGVpZ2h0LWFuZC12ZXJ0aWNhbC1hbGlnbidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NUI5RVx1OERGNScsXG4gICAgICAgICAgICBwcmVmaXg6ICcvY3NzL3ByYWN0aWNlcycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTk4ODRcdTU5MDRcdTc0MDZcdTU2NjgnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Nzcy9wcmVwcm9jZXNzb3InLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnbGVzcycsXG4gICAgICAgICAgICAgICAgJ3N0eWx1cycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTVERTVcdTUxNzdcdTk2QzZcdTU0MDgnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Nzcy90b29scycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdzYWZlLWFyZWEnLFxuICAgICAgICAgICAgICAgICd0ZXh0LWVsbGlwc2lzJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0NTUyAyLjIgXHU4OUM0XHU4MzAzJyxcbiAgICAgICAgICAgIHByZWZpeDogJy9jc3MvY3NzLXNwZWMnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnY3NzMi4yLzgtYm94LW1vZGVsLycsXG4gICAgICAgICAgICAgICAgJ2NzczIuMi85LXZpc3VhbC1mb3JtYXR0aW5nLW1vZGVsLydcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NjcyQVx1NTIwNlx1N0M3QicsXG4gICAgICAgICAgICBwcmVmaXg6ICcvY3NzL3VuY2xhc3NpZmllZCcsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICd1c2VyLWV4cGVyaWVuY2UnLFxuICAgICAgICAgICAgICAgICdjb21wYXRpYmlsaXR5JyxcbiAgICAgICAgICAgICAgICAnc2tpbGwtcGl0ZmFsbCdcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF0sXG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9lczYudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L2VzNi50c1wiO2V4cG9ydCBkZWZhdWx0IHtcbiAgICAvLyBFUzZcbiAgICAnL2VzNi8nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdFUzYrJyxcbiAgICAgICAgICAgIHByZWZpeDogJy9lczYnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAnbGV0LWNvbnN0LycsXG4gICAgICAgICAgICAgICAgJ2Rlc3RydWN0dXJpbmctYXNzaWdubWVudC8nLFxuICAgICAgICAgICAgICAgICdmdW5jdGlvbi8nLFxuICAgICAgICAgICAgICAgICdhcnJheS8nLFxuICAgICAgICAgICAgICAgICdjbGFzcy8nLFxuICAgICAgICAgICAgICAgICdtb2R1bGUvJyxcbiAgICAgICAgICAgICAgICAnaXRlcmF0b3IvJyxcbiAgICAgICAgICAgICAgICAnZ2VuZXJhdG9yLycsXG4gICAgICAgICAgICAgICAgJ2FzeW5jLWF3YWl0LycsXG4gICAgICAgICAgICAgICAgJ3Byb3h5LXJlZmxlY3QvJyxcbiAgICAgICAgICAgICAgICAncHJveHktcmVmbGVjdC9wcm94eS1wcmFjdGljZSdcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1Byb21pc2UnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2VzNi9wcm9taXNlJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgJ3Byb21pc2Utc2tpbGxzJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnQmFiZWwnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2VzNi9iYWJlbCcsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICdiYWJlbC12NycsXG4gICAgICAgICAgICAgICAgJ0BiYWJlbC9wcmVzZXQtZW52JyxcbiAgICAgICAgICAgICAgICAnQGJhYmVsL3BsdWdpbi10cmFuc2Zvcm0tcnVudGltZScsXG4gICAgICAgICAgICAgICAgJ0BiYWJlbC9ydW50aW1lJyxcbiAgICAgICAgICAgICAgICAnQGJhYmVsL3J1bnRpbWUtY29yZWpzMidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1BvbHlmaWxsJyxcbiAgICAgICAgICAgIHByZWZpeDogJy9lczYvcG9seWZpbGwnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdTdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0cmluZy9wYWRTdGFydCcsXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0FycmF5JyxcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAnYXJyYXknLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2FycmF5LXByb3RvdHlwZS1mb3JFYWNoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcnJheS1wcm90b3R5cGUtcmVkdWNlJyxcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnT2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICduZXcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ29iamVjdC1jcmVhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ29iamVjdC1hc3NpZ24nLFxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdQcm9taXNlJyxcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAncHJvbWlzZScsXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAncHJvbWlzZS1hbGxTZXR0bGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwcm9taXNlLXJhY2UnXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9mcm9udC1lbmQtZW5naW5lZXJpbmcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L2Zyb250LWVuZC1lbmdpbmVlcmluZy50c1wiO2V4cG9ydCBkZWZhdWx0IHtcbiAgICAnL2Zyb250LWVuZC1lbmdpbmVlcmluZy8nOiBbXG4gICAgICAgICcvZnJvbnQtZW5kLWVuZ2luZWVyaW5nLydcbiAgICBdLFxuICAgIC8vIFx1NTIxRFx1NTlDQlx1NTMxNlx1OTYzNlx1NkJCNVxuICAgICcvZnJvbnQtZW5kLWVuZ2luZWVyaW5nL2luaXRpYWxpemF0aW9uJzogW1xuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU0RUUzXHU3ODAxXHU0RUQzXHU1RTkzXHU1MjFEXHU1OUNCXHU1MzE2JyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJy9mcm9udC1lbmQtZW5naW5lZXJpbmcvaW5pdGlhbGl6YXRpb24vcmVwb3NpdG9yeS8nLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU5ODc5XHU3NkVFXHU1MjFEXHU1OUNCXHU1MzE2JyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJy9mcm9udC1lbmQtZW5naW5lZXJpbmcvaW5pdGlhbGl6YXRpb24vcHJvamVjdC8nLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU3RjE2XHU4RjkxXHU1NjY4XHU1MjFEXHU1OUNCXHU1MzE2JyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJy9mcm9udC1lbmQtZW5naW5lZXJpbmcvaW5pdGlhbGl6YXRpb24vY29kZS1lZGl0b3JzL3ZzY29kZScsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTk4Q0VcdTY4M0NcdTYzMDdcdTUzNTcnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Zyb250LWVuZC1lbmdpbmVlcmluZy9pbml0aWFsaXphdGlvbi9zdHlsZS1ndWlkZScsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICduYW1pbmctY29udmVudGlvbi9uYW1pbmcubWQnLFxuICAgICAgICAgICAgICAgICduYW1pbmctY29udmVudGlvbi9qcy5tZCcsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTRFRTNcdTc4MDFcdTY4M0NcdTVGMEZcdTUzMTYgLSBFU0xpbnQnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Zyb250LWVuZC1lbmdpbmVlcmluZy9pbml0aWFsaXphdGlvbi9jb2RlLWZvcm1hdHRlci9lc2xpbnQnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAnZXNsaW50LXZzY29kZScsXG4gICAgICAgICAgICAgICAgJ2VzbGludC12dWUnLFxuICAgICAgICAgICAgICAgICdlc2xpbnQtcHJldHRpZXInLFxuICAgICAgICAgICAgICAgICdob3ctdG8td3JpdGUtYS1jdXN0b20tZXNsaW50LXJ1bGUnXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgXSxcblxuICAgIC8vIFx1NUYwMFx1NTNEMVx1OTYzNlx1NkJCNVxuICAgICcvZnJvbnQtZW5kLWVuZ2luZWVyaW5nL2RldmVsb3BtZW50JzogW1xuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnaDUgXHU1RjAwXHU1M0QxJyxcbiAgICAgICAgICAgIHByZWZpeDogJy9mcm9udC1lbmQtZW5naW5lZXJpbmcvZGV2ZWxvcG1lbnQvaDUnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAnc3R5bGUnLFxuICAgICAgICAgICAgICAgICdsb2NhbC1tb2NrJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NTQwRVx1N0FFRiAtIE5vZGUnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Zyb250LWVuZC1lbmdpbmVlcmluZy9kZXZlbG9wbWVudC9zZXJ2ZXItbm9kZScsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICdjb21tb25qcycsXG4gICAgICAgICAgICAgICAgJ2tvYS8nLFxuICAgICAgICAgICAgICAgICdzZXJ2ZXInLFxuICAgICAgICAgICAgICAgICdhcGknLFxuICAgICAgICAgICAgICAgICdwbTInLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU1REU1XHU1MTc3XHU1RTkzJyxcbiAgICAgICAgICAgIHByZWZpeDogJy9mcm9udC1lbmQtZW5naW5lZXJpbmcvZGV2ZWxvcG1lbnQvdG9vbHMtbGlicmFyeScsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdheGlvcycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdOUE0nLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Zyb250LWVuZC1lbmdpbmVlcmluZy9kZXZlbG9wbWVudC9ucG0nLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnc2VtYW50aWMtdmVyc2lvbicsXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgJ25wbS1jb21tYW5kJyxcbiAgICAgICAgICAgICAgICAnbnBtcmMnLFxuICAgICAgICAgICAgICAgICducG0tY29uZmlnJyxcbiAgICAgICAgICAgICAgICAnbnBtLXNjcmlwdHMnLFxuICAgICAgICAgICAgICAgICdwYWNrYWdlLmpzb24nLFxuICAgICAgICAgICAgICAgICdwYWNrYWdlLWxvY2suanNvbicsXG4gICAgICAgICAgICAgICAgJ3RoaXJkLXBhcnR5LXBhY2thZ2UnXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdwbnBtJyxcbiAgICAgICAgICAgIHByZWZpeDogJy9mcm9udC1lbmQtZW5naW5lZXJpbmcvZGV2ZWxvcG1lbnQvcG5wbScsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgIF0sXG5cbiAgICAvLyBcdTY3ODRcdTVFRkFcdTk2MzZcdTZCQjVcbiAgICAnL2Zyb250LWVuZC1lbmdpbmVlcmluZy9idWlsZCc6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1dlYnBhY2snLFxuICAgICAgICAgICAgcHJlZml4OiAnL2Zyb250LWVuZC1lbmdpbmVlcmluZycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdidWlsZC93ZWJwYWNrLycsXG4gICAgICAgICAgICAgICAgJ2J1aWxkL3dlYnBhY2svd2VicGFjay1ydW50aW1lJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdXZWJwYWNrIFx1OTE0RFx1N0Y2RScsXG4gICAgICAgICAgICAgICAgICAgIHByZWZpeDogJ2J1aWxkL3dlYnBhY2svY29uZmlnJyxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aG9sZS1jb25maWcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3ByYWN0aWNhbC1jb25maWcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZy10b29scycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGVhZC1jb2RlJyxcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2J1aWxkL3dlYnBhY2svd2VicGFjazQtaW1wb3J0JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdUYXBhYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAnYnVpbGQvd2VicGFjay90YXBhYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhcGFibGUtcmVhZG1lJyxcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgICcvZnJvbnQtZW5kLWVuZ2luZWVyaW5nL2J1aWxkL3JvbGx1cCcsXG4gICAgICAgICcvZnJvbnQtZW5kLWVuZ2luZWVyaW5nL2J1aWxkL3NvdXJjZS1tYXAnLFxuICAgIF0sXG5cbiAgICAvLyBcdTUzRDFcdTVFMDNcdTk2MzZcdTZCQjVcbiAgICAnL2Zyb250LWVuZC1lbmdpbmVlcmluZy9wdWJsaXNoJzogW1xuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnQ2hhbmdMb2cnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnL2Zyb250LWVuZC1lbmdpbmVlcmluZy9wdWJsaXNoL2NoYW5nZWxvZycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgXSxcblxuICAgIC8vIFx1NTI0RFx1N0FFRlx1N0EzM1x1NUI5QVx1NjAyN1x1NUVGQVx1OEJCRVxuICAgICcvZnJvbnQtZW5kLWVuZ2luZWVyaW5nL2Zyb250ZW5kLXN0YWJpbGl0eS1jb25zdHJ1Y3Rpb24nOiBbXG4gICAgICAgICcvZnJvbnQtZW5kLWVuZ2luZWVyaW5nL2Zyb250ZW5kLXN0YWJpbGl0eS1jb25zdHJ1Y3Rpb24vJyxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJycsXG4gICAgICAgICAgICBwcmVmaXg6ICcvZnJvbnQtZW5kLWVuZ2luZWVyaW5nL2Zyb250ZW5kLXN0YWJpbGl0eS1jb25zdHJ1Y3Rpb24nLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnb2JzZXJ2YWJsZS1zeXN0ZW0vJyxcbiAgICAgICAgICAgICAgICAnZnVsbC1saW5rLW1vbml0b3JpbmcvJyxcbiAgICAgICAgICAgICAgICAnaGlnaC1hdmFpbGFiaWxpdHktYXJjaGl0ZWN0dXJlLycsXG4gICAgICAgICAgICAgICAgJ3BlcmZvcm1hbmNlLycsXG4gICAgICAgICAgICAgICAgJ3Jpc2stbWFuYWdlbWVudC8nLFxuICAgICAgICAgICAgICAgICdwcm9jZXNzcy1tZWNoYW5pc20vJyxcbiAgICAgICAgICAgICAgICAnZW5naW5lZXJpbmctY29uc3RydWN0aW9uLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnJyxcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAnZW5naW5lZXJpbmctY29uc3RydWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhdXRvbWF0ZWQtdGVzdGluZydcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ3N1bW1hcnknXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgXSxcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L2Z1bGwtc3RhY2sudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L2Z1bGwtc3RhY2sudHNcIjtleHBvcnQgZGVmYXVsdCB7XG4gICAgLy8gXHU4QkJFXHU4QkExXHU2QTIxXHU1RjBGXG4gICAgJy9mdWxsLXN0YWNrL2Rlc2lnbi1wYXR0ZXJucy8nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdThCQkVcdThCQTFcdTZBMjFcdTVGMEYnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnL2Z1bGwtc3RhY2svZGVzaWduLXBhdHRlcm5zL3NpbmdsZXRvbi1wYXR0ZXJuJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICBdLFxuXG4gICAgLy8gXHU2NTcwXHU2MzZFXHU3QkExXHU3NDA2XG4gICAgJy9mdWxsLXN0YWNrL2RhdGEtbWFuYWdlbWVudCc6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NjU3MFx1NjM2RVx1NzUxRlx1NEVBN1x1NTQ4Q1x1NkQ4OFx1OEQzOScsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcvZnVsbC1zdGFjay9kYXRhLW1hbmFnZW1lbnQva2Fma2EvJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NjU3MFx1NjM2RVx1NjdFNVx1OEJFMlx1NEUwRVx1NUM1NVx1NzkzQScsXG4gICAgICAgICAgICBwcmVmaXg6ICcvZnVsbC1zdGFjay9kYXRhLW1hbmFnZW1lbnQvZGF0YS1vYnNlcnZhYmlsaXR5JyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJ3NxbCcsXG4gICAgICAgICAgICAgICAgJ2NsaWNraG91c2UnLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU2NTcwXHU2MzZFXHU1QjU4XHU1MEE4JyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJy9mdWxsLXN0YWNrL2RhdGEtbWFuYWdlbWVudC9tb25nb2RiJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICBdLFxuXG4gICAgLy8gXHU2NENEXHU0RjVDXHU3Q0ZCXHU3RURGXHU3NkY4XHU1MTczXG4gICAgJy9mdWxsLXN0YWNrL29wZXJhdGluZy1zeXN0ZW0nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdMaW51eCcsXG4gICAgICAgICAgICBwcmVmaXg6ICcvZnVsbC1zdGFjay9vcGVyYXRpbmctc3lzdGVtL2xpbnV4JyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgJ3NoZWxsJyxcbiAgICAgICAgICAgICAgICAnbGludXgtY29tbWFuZCcsXG4gICAgICAgICAgICAgICAgJ2Vudmlyb25tZW50LXZhcmlhYmxlcy5tZCcsXG4gICAgICAgICAgICAgICAgJ2dsb2InLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnR2l0JyxcbiAgICAgICAgICAgIHByZWZpeDogJy9mdWxsLXN0YWNrL29wZXJhdGluZy1zeXN0ZW0vZ2l0JyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgJ2dpdC1jb21tYW5kJyxcbiAgICAgICAgICAgICAgICAnZ2l0LWNvbW1pdC1ndWlkZWxpbmVzJyxcbiAgICAgICAgICAgICAgICAnZ2l0bGFiJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0RvY2tlcicsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcvZnVsbC1zdGFjay9vcGVyYXRpbmctc3lzdGVtL2RvY2tlci8nLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgIF0sXG5cbiAgICAvLyBcdTVGMDBcdTUzRDFcdTc2RjhcdTUxNzNcdTc2ODRcdThGNkZcdTRFRjZcbiAgICAnL2Z1bGwtc3RhY2svc29mdHdhcmUnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdOZ2lueCcsXG4gICAgICAgICAgICBwcmVmaXg6ICcvZnVsbC1zdGFjay9zb2Z0d2FyZS9uZ2lueCcsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICdwcmFjdGljZXMnLFxuICAgICAgICAgICAgICAgICduZ2lueC1jb25mJyxcbiAgICAgICAgICAgICAgICAnbmd4X2h0dHBfcHJveHlfbW9kdWxlJyxcbiAgICAgICAgICAgICAgICAnbmd4X2h0dHBfdXBzdHJlYW1fbW9kdWxlJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgIF0sXG5cbiAgICAvLyBcdTU0MEVcdTdBRUZcdTVGMDBcdTUzRDFcbiAgICAnL2Z1bGwtc3RhY2svYmFja2VuZCc6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NTQwRVx1N0FFRicsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcvZnVsbC1zdGFjay9iYWNrZW5kL25lc3Rqcy8nLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgIF0sXG5cbiAgICAvLyBcdTUxNzZcdTRFRDZcbiAgICAnL2Z1bGwtc3RhY2svb3RoZXJzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU1MTc2XHU0RUQ2JyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJy9mdWxsLXN0YWNrL290aGVycy9nb29nbGUtY2xvdWQnLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgIF1cblxufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvaW50ZXJ2aWV3LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9pbnRlcnZpZXcudHNcIjtleHBvcnQgZGVmYXVsdCB7XG4gICAgJy9pbnRlcnZpZXcnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTk3NjJcdThCRDVcdTk4OThcdTc2RUUnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2ludGVydmlldycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdicm93c2VyLycsXG4gICAgICAgICAgICAgICAgJ2Nzcy8nLFxuICAgICAgICAgICAgICAgICdhbGdvcml0aG0vaW50ZXJ2aWV3LycsXG4gICAgICAgICAgICAgICAgJ25vZGVqcy8nXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdKUyBcdTk3NjJcdThCRDVcdTk4OTgnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2ludGVydmlldy9qYXZhc2NyaXB0JyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1MjREXHU3QUVGXHU1N0ZBXHU3ODQwJyxcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAnZm91bmRhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YS10eXBlLycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZXhlY3V0aW9uLWNvbnRleHQvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdleGVjdXRpb24tbWVjaGFuaXNtLycsXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NTI0RFx1N0FFRlx1N0YxNlx1NzgwMScsXG4gICAgICAgICAgICAgICAgICAgIHByZWZpeDogJ2NvZGluZycsXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnYmFzaWMtYXBpLXVzYWdlLycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncHJvZ3JhbS1kZXNpZ24vJyxcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU2MDI3XHU4MEZEXHU0RjE4XHU1MzE2JyxcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAncGVyZm9ybWFuY2Utb3B0aW1pemF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdkZWJvdW5jZS10aHJvdHRsZS8nLFxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NEUxM1x1OTg5OCcsXG4gICAgICAgICAgICBwcmVmaXg6ICcvaW50ZXJ2aWV3L3RvcGljJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJ2xhcmdlLWZpbGUtdXBsb2FkJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NCcsXG4gICAgICAgICAgICBwcmVmaXg6ICcvaW50ZXJ2aWV3L2RhdGEtc3RydWN0dXJlJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJ2JpbmFyeS10cmVlJyxcbiAgICAgICAgICAgICAgICAnaGVhcC8nLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU3Qjk3XHU2Q0Q1JyxcbiAgICAgICAgICAgIHByZWZpeDogJy9pbnRlcnZpZXcvYWxnb3JpdGhtJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU2MzkyXHU1RThGJyxcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAnc29ydGluZy1hbGdvcml0aG0nLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnViYmxlLXNvcnQvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzZWxlY3Rpb24tc29ydC8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2luc2VydGlvbi1zb3J0LycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbWVyZ2Utc29ydC8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3F1aWNrLXNvcnQvJ1xuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdTUxNzZcdTRFRDYnLFxuICAgICAgICAgICAgICAgICAgICBwcmVmaXg6ICdvdGhlcnMnLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2JpbmFyeS1zZWFyY2gvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdmaWJvbmFjY2ktc2VxdWVuY2UnLFxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICBdXG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9qcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvanMudHNcIjtleHBvcnQgZGVmYXVsdCB7XG4gICAgJy9qcy8nOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTY1NzBcdTYzNkVcdTdDN0JcdTU3OEInLFxuICAgICAgICAgICAgcHJlZml4OiAnL2pzL2RhdGEtdHlwZXMnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAnbnVtYmVyLycsXG4gICAgICAgICAgICAgICAgJ251bWJlci9mbG9hdGluZycsXG4gICAgICAgICAgICAgICAgJ3N0cmluZy8nLFxuICAgICAgICAgICAgICAgICdvYmplY3QvJyxcbiAgICAgICAgICAgICAgICAnYXJyYXkvJyxcbiAgICAgICAgICAgICAgICAnZnVuY3Rpb24vJyxcbiAgICAgICAgICAgICAgICAnZGF0ZS8nLFxuICAgICAgICAgICAgICAgICdyZWctZXhwLycsXG4gICAgICAgICAgICAgICAgJ3R5cGUtY29udmVyc2lvbicsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTYyNjdcdTg4NENcdTY3M0FcdTUyMzYnLFxuICAgICAgICAgICAgcHJlZml4OiAnL2pzL2V4ZWN1dGlvbi1tZWNoYW5pc20nLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAnZXhlY3V0aW9uLWNvbnRleHQnLFxuICAgICAgICAgICAgICAgICdwcm90b3R5cGUnLFxuICAgICAgICAgICAgICAgICd0aGlzJyxcbiAgICAgICAgICAgICAgICAnZXZlbnQtbG9vcCdcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1OTUxOVx1OEJFRlx1NTkwNFx1NzQwNi9cdTY1RTVcdTVGRDcvXHU4QzAzXHU4QkQ1JyxcbiAgICAgICAgICAgIHByZWZpeDogJy9qcy9lcnJvci1oYW5kbGluZycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdkZWJ1Zy8nLFxuICAgICAgICAgICAgICAgICdsb2cnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1OTUxOVx1OEJFRlx1NTkwNFx1NzQwNicsXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0cnktY2F0Y2gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Jyb3dzZXItZXJyb3ItaGFuZGxpbmcnLFxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1x1NjNBN1x1NTIzNlx1NTNGMFx1NjVCOVx1NkNENScsXG4gICAgICAgICAgICAgICAgICAgIHByZWZpeDogJ2RlYnVnL2NvbnNvbGUnLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY29uc29sZS1sb2ctZXZlbnQnLFxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1OEZEMFx1N0I5N1x1N0IyNicsXG4gICAgICAgICAgICBwcmVmaXg6ICcvanMvb3BlcmF0b3JzJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1dlYkFzc2VtcGx5JyxcbiAgICAgICAgICAgIHByZWZpeDogJy9qcy93ZWItYXNzZW1ibHknLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NjcyQVx1NTIwNlx1N0M3Qlx1NTE4NVx1NUJCOScsXG4gICAgICAgICAgICBwcmVmaXg6ICcvanMvdW5jbGFzc2lmaWVkJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgJ2Z1bmN0aW9uYWwtcHJvZ3JhbW1pbmcnLFxuICAgICAgICAgICAgICAgICdwaXRmYWxsJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICBdLFxufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvbWluaS1wcm9ncmFtLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9taW5pLXByb2dyYW0udHNcIjtleHBvcnQgZGVmYXVsdCB7XG4gICAgLy8gXHU0RUUzXHU3ODAxXHU3MjQ3XHU2QkI1XG4gICAgJy9taW5pLXByb2dyYW0vJzogW1xuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU1RkFFXHU0RkUxXHU1QzBGXHU3QTBCXHU1RThGJyxcbiAgICAgICAgICAgIHByZWZpeDogJy9taW5pLXByb2dyYW0vd2VpeGluJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICd1bmktYXBwJyxcbiAgICAgICAgICAgIHByZWZpeDogJy9taW5pLXByb2dyYW0vdW5pLWFwcCcsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICd2LWZvci1rZXknLFxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXVxufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvdHlwZXNjcmlwdC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvdHlwZXNjcmlwdC50c1wiO2V4cG9ydCBkZWZhdWx0IHtcbiAgICAnL3R5cGVzY3JpcHQvJzogW1xuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnVHlwZVNjcmlwdCcsXG4gICAgICAgICAgICBwcmVmaXg6ICcvdHlwZXNjcmlwdCcsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICd0eXBlLW1hbmlwdWxhdGlvbi90eXBlLWNoYWxsZW5nZXMnLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU2NTcwXHU2MzZFXHU3QzdCXHU1NzhCJyxcbiAgICAgICAgICAgIHByZWZpeDogJy90eXBlc2NyaXB0L2RhdGEtdHlwZXMnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAncHJpbWl0aXZlLXR5cGVzJyxcbiAgICAgICAgICAgICAgICAnb2JqZWN0LXR5cGUnLFxuICAgICAgICAgICAgICAgICdjbGFzcycsXG4gICAgICAgICAgICAgICAgJ2VudW0nLFxuICAgICAgICAgICAgICAgICdmdW5jdGlvbicsXG4gICAgICAgICAgICAgICAgJ2FycmF5J1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU3QzdCXHU1NzhCXHU3Q0ZCXHU3RURGJyxcbiAgICAgICAgICAgIHByZWZpeDogJy90eXBlc2NyaXB0L3R5cGUtc3lzdGVtJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgJ2dlbmVyaWNzJyxcbiAgICAgICAgICAgICAgICAncHJvcGVydHktbW9kaWZpZXJzJyxcbiAgICAgICAgICAgICAgICAndXRpbGl0eS10eXBlcycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTdDN0JcdTU3OEJcdTY0Q0RcdTRGNUMnLFxuICAgICAgICAgICAgcHJlZml4OiAnL3R5cGVzY3JpcHQvdHlwZS1tYW5pcHVsYXRpb24nLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAndHlwZS1vcGVyYXRvcnMnLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU2QTIxXHU1NzU3XHU3Q0ZCXHU3RURGJyxcbiAgICAgICAgICAgIHByZWZpeDogJy90eXBlc2NyaXB0L21vZHVsZS1zeXN0ZW0nLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnVHlwZVNjcmlwdCBcdTdGMTZcdThCRDEnLFxuICAgICAgICAgICAgcHJlZml4OiAnL3R5cGVzY3JpcHQvdHlwZXNjcmlwdC1jb21waWxhdGlvbicsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdUeXBlU2NyaXB0IFx1NEY3Rlx1NzUyOCcsXG4gICAgICAgICAgICBwcmVmaXg6ICcvdHlwZXNjcmlwdC91c2FnZScsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdkZWNsYXJhdGlvbi1maWxlcycsXG4gICAgICAgICAgICAgICAgJ3RzY29uZmlnLWpzb24nLFxuICAgICAgICAgICAgICAgICdwdWJsaXNoJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcblxuICAgIF0sXG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC92dWUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L3Z1ZS50c1wiO2V4cG9ydCBkZWZhdWx0IHtcbiAgICAvLyBWdWUgXHU2RTkwXHU3ODAxXHU1QjY2XHU0RTYwXG4gICAgJy92dWUvJzogW1xuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnVnVlIDIueCBcdTZFOTBcdTc4MDFcdTUyMDZcdTY3OTAnLFxuICAgICAgICAgICAgcHJlZml4OiAnJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJy92dWUvc291cmNlLXN0dWR5LycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTVCOUVcdTRGOEJcdTUzMTYnLFxuICAgICAgICAgICAgcHJlZml4OiAnL3Z1ZS9zb3VyY2Utc3R1ZHknLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAndnVlLWNvbnN0cnVjdG9yJyxcbiAgICAgICAgICAgICAgICAnaW5zdGFuY2UvY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAnaW5zdGFuY2Uvc3RhdGUvJyxcbiAgICAgICAgICAgICAgICAnaW5zdGFuY2Uvc3RhdGUvcHJvcHMnLFxuICAgICAgICAgICAgICAgICdpbnN0YW5jZS9zdGF0ZS9tZXRob2RzJyxcbiAgICAgICAgICAgICAgICAnaW5zdGFuY2Uvc3RhdGUvZGF0YScsXG4gICAgICAgICAgICAgICAgJ2luc3RhbmNlL3N0YXRlL2NvbXB1dGVkJyxcbiAgICAgICAgICAgICAgICAnaW5zdGFuY2Uvc3RhdGUvd2F0Y2gnLFxuICAgICAgICAgICAgICAgICdpbnN0YW5jZS9kaXJlY3RpdmVzJyxcbiAgICAgICAgICAgICAgICAnaW5zdGFuY2UvZXZlbnRzJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU3RUM0XHU0RUY2XHU1MzE2JyxcbiAgICAgICAgICAgIHByZWZpeDogJy92dWUvc291cmNlLXN0dWR5L2NvbXBvbmVudCcsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdyZWdpc3RlcicsXG4gICAgICAgICAgICAgICAgJ29wdGlvbnMnLFxuICAgICAgICAgICAgICAgICdhc3luYy1jb21wb25lbnQnLFxuICAgICAgICAgICAgICAgICdmdW5jdGlvbmFsLWNvbXBvbmVudCcsXG4gICAgICAgICAgICAgICAgJ2V4dGVuZCdcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NTRDRFx1NUU5NFx1NUYwRlx1NTM5Rlx1NzQwNicsXG4gICAgICAgICAgICBwcmVmaXg6ICcvdnVlL3NvdXJjZS1zdHVkeS9vYnNlcnZlcicsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICdkZXAtY29sbGVjdGlvbicsXG4gICAgICAgICAgICAgICAgJ25vdGlmeS11cGRhdGUnLFxuICAgICAgICAgICAgICAgICdkZXAnLFxuICAgICAgICAgICAgICAgICd3YXRjaGVyJyxcbiAgICAgICAgICAgICAgICAnc2NoZWR1bGVyJyxcbiAgICAgICAgICAgICAgICAnYXJyYXktb2JzZXJ2ZS1saW1pdCcsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdWaXJ0dWFsIERvbScsXG4gICAgICAgICAgICBwcmVmaXg6ICcvdnVlL3NvdXJjZS1zdHVkeS92ZG9tJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgJ3Zub2RlLXRyZWUtY3JlYXRlJyxcbiAgICAgICAgICAgICAgICAncGF0Y2gnLFxuICAgICAgICAgICAgICAgICdwYXRjaC12bm9kZScsXG4gICAgICAgICAgICAgICAgJ2NoaWxkLWNvbXBvbmVudC1jcmVhdGUnLFxuICAgICAgICAgICAgICAgICdwYXRjaC1tb2R1bGVzLycsXG4gICAgICAgICAgICAgICAgJ3BhdGNoLWZuJyxcbiAgICAgICAgICAgICAgICAndG9waWNzL2RvbS1iaW5kaW5nJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU3RjE2XHU4QkQxJyxcbiAgICAgICAgICAgIHByZWZpeDogJy92dWUvc291cmNlLXN0dWR5L2NvbXBpbGUnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAnY29tcGlsZS1wcm9jZXNzJyxcbiAgICAgICAgICAgICAgICAnYmFzZS1jb21waWxlJyxcbiAgICAgICAgICAgICAgICAncGFyc2UnLFxuICAgICAgICAgICAgICAgICdwYXJzZS1odG1sJyxcbiAgICAgICAgICAgICAgICAnb3B0aW1pemUnLFxuICAgICAgICAgICAgICAgICdjb2RlZ2VuJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnXHU3RjE2XHU4QkQxXHU0RTEzXHU5ODk4JyxcbiAgICAgICAgICAgIHByZWZpeDogJy92dWUvc291cmNlLXN0dWR5L2NvbXBpbGUvdG9waWNzJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJ2V2ZW50JyxcbiAgICAgICAgICAgICAgICAndi1tb2RlbCcsXG4gICAgICAgICAgICAgICAgJ3Nsb3QnXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTUxNjhcdTVDNDAgQVBJJyxcbiAgICAgICAgICAgIHByZWZpeDogJy92dWUvc291cmNlLXN0dWR5L2dsb2JhbC1hcGknLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAndXNlJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnVXRpbCcsXG4gICAgICAgICAgICBwcmVmaXg6ICcvdnVlL3NvdXJjZS1zdHVkeS91dGlsJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJ25leHQtdGljaycsXG4gICAgICAgICAgICAgICAgJ2xpZmVjeWNsZS1ob29rLWV2ZW50JyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1NTUicsXG4gICAgICAgICAgICBwcmVmaXg6ICcvdnVlL3NvdXJjZS1zdHVkeS9zc3InLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAndnVlLXNlcnZlci1yZW5kZXJlcicsXG4gICAgICAgICAgICAgICAgJ2h5ZHJhdGUnLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnVnVleCcsXG4gICAgICAgICAgICBwcmVmaXg6ICcvdnVlL3Z1ZS1zZXJpZXMvdnVleCcsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICdyZXNldC1jaGlsZC1tb2R1bGUtc3RhdGUnLFxuICAgICAgICAgICAgICAgICdyZWdpc3Rlci1tb2R1bGUnLFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAndnVlLXJvdXRlcicsXG4gICAgICAgICAgICBwcmVmaXg6ICcvdnVlL3Z1ZS1zZXJpZXMvdnVlLXJvdXRlci8nLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NTE3Nlx1NEVENicsXG4gICAgICAgICAgICBwcmVmaXg6ICcvdnVlL3Z1ZS1zZXJpZXMvdnVlanMnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnc2NvcGVkLWNzcycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gXHU3QjQ5XHU1Rjg1XHU0RUU1XHU1NDBFXHU1MjA2XHU3OUJCXHU1MUZBXHU1M0JCXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdWdWUgMy54JyxcbiAgICAgICAgICAgIHByZWZpeDogJy92dWUzJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgJ2NvbXBvc2l0aW9uLWFwaScsXG4gICAgICAgICAgICAgICAgJ3JlYWN0aXZpdHkvdXNlLWRpZmZlcmVuY2UnXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgXSxcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L3dhbmRlci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3Qvd2FuZGVyLnRzXCI7ZXhwb3J0IGRlZmF1bHQge1xuICAgIC8vIFx1OTY4Rlx1OEJCMFxuICAgICcvd2FuZGVyLyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ0hvdXNlIFx1NzZGOFx1NTE3MycsXG4gICAgICAgICAgICBwcmVmaXg6ICcvd2FuZGVyL2hvdXNlJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgJ3RpYW55YS1wb3N0JyxcbiAgICAgICAgICAgICAgICAnYmVpamluZy8nLFxuICAgICAgICAgICAgICAgICd6aG9uZ2hhaWxpY2h1bmh1c2h1LycsXG4gICAgICAgICAgICAgICAgJ3dhbnhpYW5neXVlZnUvJyxcbiAgICAgICAgICAgICAgICAneGlzaGFuamlueGl1ZnUvJyxcbiAgICAgICAgICAgICAgICAnY29tcGFyaXNvbicsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTYyOTVcdThENDRcdTc0MDZcdThEMjInLFxuICAgICAgICAgICAgcHJlZml4OiAnL3dhbmRlci9pbnZlc3RtZW50JyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJ3N0b2NrcycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTYyMzdcdTU5MTYnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnL3dhbmRlci9vdXRkb29yLycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6ICdcdTVERTVcdTUxNzcnLFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAnL3dhbmRlci90b29scydcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogJ1x1NTE3Nlx1NEVENicsXG4gICAgICAgICAgICBwcmVmaXg6ICcvd2FuZGVyL290aGVycycsXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICdtYWMtc2hvcnRjdXQta2V5cycsXG4gICAgICAgICAgICAgICAgJ3dvcmQtcHJvbnVuY2lhdGlvbicsXG4gICAgICAgICAgICAgICAgJ3RoZW9yaWVzJyxcbiAgICAgICAgICAgICAgICAnc3NyLydcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF1cbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9saXN0L3JlYWN0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9yZWFjdC50c1wiO2V4cG9ydCBkZWZhdWx0IHtcbiAgICAnL3JlYWN0Lyc6IFtcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgdGV4dDogJ1JlYWN0JyxcbiAgICAgICAgLy8gICAgIHByZWZpeDogJy9yZWFjdCcsXG4gICAgICAgIC8vICAgICBjaGlsZHJlbjogW1xuICAgICAgICAvLyAgICAgICAgICcnLFxuICAgICAgICAvLyAgICAgXVxuICAgICAgICAvLyB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiAnUmVhY3QgSG9va3MnLFxuICAgICAgICAgICAgcHJlZml4OiAnL3JlYWN0L2hvb2tzJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgJ3VzZVN0YXRlJyxcbiAgICAgICAgICAgICAgICAndXNlUmVkdWNlcicsXG4gICAgICAgICAgICAgICAgJ3VzZUVmZmVjdCcsXG4gICAgICAgICAgICAgICAgJ3VzZU1lbW8nLFxuICAgICAgICAgICAgICAgICd1c2VSZWYnLFxuICAgICAgICAgICAgICAgICd1c2VTeW5jRXh0ZXJuYWxTdG9yZScsXG4gICAgICAgICAgICAgICAgJ2N1c3RvbS1ob29rcycsXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgXVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93aW5kLXN0b25lL2dpdGh1Yi9ibG9nL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvbGlzdC9hbmltYXRpb24tZWZmZWN0cy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2xpc3QvYW5pbWF0aW9uLWVmZmVjdHMudHNcIjtleHBvcnQgZGVmYXVsdCB7XG4gICAgLy8gQ1NTL0pTIFx1NTJBOFx1NzUzQlx1NjU0OFx1Njc5Q1xuICAgICcvYW5pbWF0aW9uLWVmZmVjdHMvJzogW1xuICAgICAgICAnJyxcbiAgICAgICAgJ3Njcm9sbC1lbGVtZW50cy1mYWRlLXVwJyxcbiAgICAgICAgJ2NvbXBsaWNhdGVkLWFuaW1hdGlvbnMtd2l0aC1hbmltYXRpb24tZGVsYXknXG4gICAgXVxufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dpbmQtc3RvbmUvZ2l0aHViL2Jsb2cvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd2luZC1zdG9uZS9naXRodWIvYmxvZy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL2luZGV4LnRzXCI7aW1wb3J0IGFydGljbGVzIGZyb20gJy4vbGlzdC9hcnRpY2xlcyc7XG5pbXBvcnQgYnJvd3NlckVudiBmcm9tICcuL2xpc3QvYnJvd3Nlci1lbnYnO1xuaW1wb3J0IGNvZGVTbmlwcGV0IGZyb20gJy4vbGlzdC9jb2RlLXNuaXBwZXQnO1xuaW1wb3J0IGNzcyBmcm9tICcuL2xpc3QvY3NzJztcbmltcG9ydCBlczYgZnJvbSAnLi9saXN0L2VzNic7XG5pbXBvcnQgZnJvbnRFbmRFbmdpbmVlcmluZyBmcm9tICcuL2xpc3QvZnJvbnQtZW5kLWVuZ2luZWVyaW5nJztcbmltcG9ydCBmdWxsU3RhY2sgZnJvbSAnLi9saXN0L2Z1bGwtc3RhY2snO1xuaW1wb3J0IGludGVydmlldyBmcm9tICcuL2xpc3QvaW50ZXJ2aWV3JztcbmltcG9ydCBqcyBmcm9tICcuL2xpc3QvanMnO1xuaW1wb3J0IG1pbmlQcm9ncmFtIGZyb20gJy4vbGlzdC9taW5pLXByb2dyYW0nO1xuaW1wb3J0IHR5cGVzY3JpcHQgZnJvbSAnLi9saXN0L3R5cGVzY3JpcHQnO1xuaW1wb3J0IHZ1ZSBmcm9tICcuL2xpc3QvdnVlJztcbmltcG9ydCB3YW5kZXIgZnJvbSAnLi9saXN0L3dhbmRlcic7XG5pbXBvcnQgcmVhY3QgZnJvbSAnLi9saXN0L3JlYWN0JztcbmltcG9ydCBhbmltYXRpb25FZmZlY3RzIGZyb20gJy4vbGlzdC9hbmltYXRpb24tZWZmZWN0cyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAuLi5hcnRpY2xlcyxcbiAgICAuLi5icm93c2VyRW52LFxuICAgIC4uLmNvZGVTbmlwcGV0LFxuICAgIC4uLmNzcyxcbiAgICAuLi5lczYsXG4gICAgLi4uZnJvbnRFbmRFbmdpbmVlcmluZyxcbiAgICAuLi5mdWxsU3RhY2ssXG4gICAgLi4uaW50ZXJ2aWV3LFxuICAgIC4uLmpzLFxuICAgIC4uLm1pbmlQcm9ncmFtLFxuICAgIC4uLnR5cGVzY3JpcHQsXG4gICAgLi4udnVlLFxuICAgIC4uLndhbmRlcixcbiAgICAuLi5yZWFjdCxcbiAgICAuLi5hbmltYXRpb25FZmZlY3RzXG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0UyxPQUFPLFVBQVU7QUFDN1QsU0FBUyx3QkFBd0I7QUFDakMsU0FBUyxtQkFBbUI7QUFDNUIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyx1QkFBdUI7QUFDaEMsU0FBUyx3QkFBd0I7QUFDakMsU0FBUyx1QkFBdUI7QUFDaEMsU0FBUyxzQkFBc0I7QUFDL0IsU0FBUywyQkFBMkI7QUFDcEMsU0FBUyxnQ0FBZ0M7QUFDekMsU0FBUyxpQkFBaUI7OztBQ1ZrUixJQUFPLGlCQUFRO0FBQUEsRUFDdlQsRUFBRSxNQUFNLG9DQUFnQixNQUFNLHFCQUFxQjtBQUFBLEVBQ25EO0FBQUEsSUFDSSxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsTUFDTixFQUFFLE1BQU0sY0FBYyxNQUFNLG1CQUFtQixhQUFhLE9BQU87QUFBQSxNQUNuRSxFQUFFLE1BQU0sUUFBUSxNQUFNLFNBQVMsYUFBYSxRQUFRO0FBQUEsTUFDcEQsRUFBRSxNQUFNLGNBQWMsTUFBTSxnQkFBZ0IsYUFBYSxlQUFlO0FBQUEsTUFDeEUsRUFBRSxNQUFNLFNBQVMsTUFBTSxpQkFBaUIsYUFBYSxVQUFVO0FBQUEsSUFDbkU7QUFBQSxFQUNKO0FBQUEsRUFDQTtBQUFBLElB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QUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0o7OztBQ2hIK1YsSUFBTyx1QkFBUTtBQUFBLEVBQzFXLGlCQUFpQjtBQUFBLElBQ2I7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxRQUNOO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixVQUFVO0FBQUEsWUFDTjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxRQUVBO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixVQUFVO0FBQUEsWUFDTjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxRQUVBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFFQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLFFBQ047QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBRUE7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKOzs7QUNwRDZVLElBQU8sY0FBUTtBQUFBLEVBQ3hWLFNBQVM7QUFBQSxJQUNMO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsUUFDTjtBQUFBLFVBQ0ksTUFBTTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsVUFBVTtBQUFBLFlBQ047QUFBQSxZQUNBO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixVQUFVO0FBQUEsWUFDTjtBQUFBLFlBQ0E7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxVQUNJLE1BQU07QUFBQSxVQUNOLFVBQVU7QUFBQSxZQUNOO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixVQUFVO0FBQUEsWUFDTjtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLFFBQ047QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLFFBQ047QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0o7OztBQy9INlUsSUFBTyxjQUFRO0FBQUE7QUFBQSxFQUV4VixTQUFTO0FBQUEsSUFDTDtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFVBQ0ksTUFBTTtBQUFBLFVBQ04sVUFBVTtBQUFBLFlBQ047QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxVQUNJLE1BQU07QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLFVBQVU7QUFBQSxZQUNOO0FBQUEsWUFDQTtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLFVBQ0ksTUFBTTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsVUFBVTtBQUFBLFlBQ047QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQUEsUUFDQTtBQUFBLFVBQ0ksTUFBTTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsVUFBVTtBQUFBLFlBQ047QUFBQSxZQUNBO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSjs7O0FDL0VpWCxJQUFPLGdDQUFRO0FBQUEsRUFDNVgsMkJBQTJCO0FBQUEsSUFDdkI7QUFBQSxFQUNKO0FBQUE7QUFBQSxFQUVBLHlDQUF5QztBQUFBLElBQ3JDO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsUUFDTjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLFFBQ047QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxRQUNOO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBO0FBQUEsRUFHQSxzQ0FBc0M7QUFBQSxJQUNsQztBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUE7QUFBQSxFQUdBLGdDQUFnQztBQUFBLElBQzVCO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixR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UUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixVQUFVO0FBQUEsWUFDTjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixVQUFVO0FBQUEsWUFDTjtBQUFBLFlBQ0E7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxVQUNJLE1BQU07QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLFVBQVU7QUFBQSxZQUNOO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixVQUFVO0FBQUEsWUFDTjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxRQUNBO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixVQUFVO0FBQUEsWUFDTjtBQUFBLFlBQ0E7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKOzs7QUNwRjJVLElBQU8sYUFBUTtBQUFBLEVBQ3RWLFFBQVE7QUFBQSxJQUNKO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixVQUFVO0FBQUEsWUFDTjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxRQUVBO0FBQUEsVUFDSSxNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixVQUFVO0FBQUEsWUFDTjtBQUFBLFlBQ0E7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0o7OztBQzlFK1YsSUFBTyx1QkFBUTtBQUFBO0FBQUEsRUFFMVcsa0JBQWtCO0FBQUEsSUFDZDtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKOzs7QUNuQjJWLElBQU8scUJBQVE7QUFBQSxFQUN0VyxnQkFBZ0I7QUFBQSxJQUNaO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBRUo7QUFDSjs7O0FDbEU2VSxJQUFPLGNBQVE7QUFBQTtBQUFBLEVBRXhWLFNBQVM7QUFBQSxJQUNMO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0ksTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLElBQ0E7QUFBQSxNQUNJLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxRQUNOO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUdBO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDTjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDSjtBQUFB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
