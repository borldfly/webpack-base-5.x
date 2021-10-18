/**
 * 服务器代码
 * 步骤1：
 *   执行命令1或2：
 *      1.nodemon server.js 需要全局安装nodemon npm i nodemon -g
 *      2.node server.js
 * 步骤2：webpack打包
 * 步骤3：访问http://localhost:3030
 */
const express = require('express');

const app = express();

//有效期设置1小时
app.use(express.static('build',{ maxAge: 1000 * 3600 }));

app.listen(3030);
