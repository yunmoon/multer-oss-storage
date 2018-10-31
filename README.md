# OSS Multer Storage Engine

## 安装
```bash
npm install multer-oss-storage
```
## 使用
基本使用方法：
```javascript
const router = require('express').Router()
const multer = require('multer')
const ossStorage = require('multer-oss-storage')({
  oss: {
    region: '<Your region>',
    accessKeyId: '<Your AccessKeyId>',
    accessKeySecret: '<Your AccessKeySecret>',
    bucket: 'Your bucket name'
  },
  allowed: ['jpeg', 'jpg', 'png'],
  dir: '2018/10/31/',
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads/test.png')
  }
})
router.post('/file/upload', multer({ storage: ossStorage }).any(), (req, res, next) => {
  console.log(req.files)
})
```
具体存储引擎使用方法，请参考[multer](https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md)文档
## 配置
### storage参数说明
Key | Description
--- | ---
`oss` | 阿里云存储相关配置
`allowed` | 运行上传的文件类型，不设置则默认允许所有
`dir` | 自定义文件上传目录，不设置则以（年/月/日）的形式
### 上传成功后file文件新增信息

Key | Description
--- | ---
`name` | 上传阿里云文件名称
`url` | 文件访问路径
