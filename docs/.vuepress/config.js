module.exports = {
  dest: 'vuepress',
  base: '/clchart/',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'ClChart',
      description: 'A fast, simple and cross-platform stock chart library created using canvas.'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'ClChart',
      description: '使用canvas创建的快速、简单和跨平台的股票图表库。'
    }
  },
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  serviceWorker: true,
  // theme: 'vue',
  themeConfig: {
    repo: 'seerline/clchart',
    editLinks: true,
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          {
            text: 'Guide',
            link: '/guide/',
          },
          {
            text: 'Config Reference',
            link: '/config/'
          },
          {
            text: 'API',
            link: '/api/'
          },
          {
            text: 'Samples',
            link: '/samples/'
          },
          {
            text: 'Changelog',
            link: 'https://github.com/seerline/clchart/blob/master/CHANGELOG.md'
          }
        ],
        sidebar: {
          '/guide/': genSidebarConfig('Guide')
        }
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
          {
            text: '指南',
            link: '/zh/guide/',
          },
          {
            text: '配置',
            link: '/zh/config/'
          },
          {
            text: 'API',
            link: '/api/'
          },
          {
            text: '示例',
            link: '/samples/'
          },
          {
            text: 'Changelog',
            link: 'https://github.com/seerline/clchart/blob/master/CHANGELOG.md'
          }
        ],
        sidebar: {
          '/zh/guide/': genSidebarConfig('指南')
        }
      }
    }
  }
}

function genSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        '',
        'configuration',
      ]
    }
  ]
}
