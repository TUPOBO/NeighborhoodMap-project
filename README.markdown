### Neighborhood Map
#### 项目概述
开发一个具有你所在区域或想访问的区域的地图的单页应用程序。然后，为此地图添加其他功能，包括突出显示的地点、有关这些地点的第三方数据以及浏览内容的不同方式。
#### 项目技术
-   `bootstrap 4`：使应用具备响应性
-   `Knockout.js`：开发易于管理的代码库，缩短开发应用程序所需的时间以及各种实用工具
-   `Google Map API`：显示地图
-   `Foursquare API`：提供有关某地点的其他数据
-   `gulp`：自动化工作流程
-   `yarn.js`：包管理器
-   `webpack`: 模块化Js代码
#### 项目开发流程
-   搭建开发环境
    -   HTML：`gulp-htmlmin`
    -   CSS：`gulp-postcss` `post-import` `gulp-cssnano`
    -   JavaScript：`webpack-stream` `uglify`
    -   自动刷新：`gulp-watch` `browser-sync`
-   加载Google Map
    -   `initMap is not a function`? :`window.initMap = function() {...}`
-   应用Knockout.js
    -   Model：1.地点信息 2.标记样式 3.信息窗口
    -   ViewModel：1.列表内容 2.是否显示列表 3.初始化地图 4.根据地点信息生成标记和绑定相关信息窗口 5.搜索栏筛选地点


