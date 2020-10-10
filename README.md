# Kasumi Notes（香澄笔记）
《Princess Connect Re:Dive》WebApp辅助工具

## 构建项目
1. 下载 [redive_master_db_diff](https://github.com/esterTion/redive_master_db_diff) 到项目根目录
2. 在根目录运行nodejs脚本 `node tsql2idb.js` ，把sql脚本转换成indexedDB脚本
3. * 开发环境 `npm start`
   * 构建环境 `npm build`
   * 部署到github page `npm deploy`（在package.json指定"homepage"的位置）

## 功能
* 角色列表（半完成，待实现查找筛选）
* 查看角色详细信息（半完成，待实现详细显示技能动作和编辑角色状态）
* ~~装备掉落~~
* ~~用户设置~~
* ~~中文翻译~~

## 参考项目
* [ShizuruNotes](https://github.com/MalitsPlus/ShizuruNotes)
* [redive_master_db_diff](https://github.com/esterTion/redive_master_db_diff)