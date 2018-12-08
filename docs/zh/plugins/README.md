---
sidebar: auto
---

# 插件

    用户可以利用插件功能添加自己的特有图形，具体使用方法参考实例

        src/plugins/cl.seer.def.js
        定义图的参数，仅仅定义和默认参数不一样的即可，未定义的配置会直接使用默认配置；

        src/plugins/cl.seer.js
        实际画图的代码；

        需要将画图的类和所要使用的数据类型注册到系统中，系统才能够识别并使用；
        注册文件为 src/plugins/cl.register.js

## 自建一个插件 seer

## 在程序中调用 seer
