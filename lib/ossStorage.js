const mime = require('mime-types')
const OSS = require('ali-oss')
const uuidv4 = require('uuid/v4');
function getDestination (req, file, cb) {
  const extension = mime.extension(file.mimetype)
  if (this.allowed.length && this.allowed.indexOf(extension) === -1) {
    return cb(new Error('文件类型不允许'))
  }
  const fileName = `${uuidv4()}.${extension}`
  cb(null, this.dir + fileName)
}

function OssStorage (opts = {}) {
  this.getDestination = (opts.destination || getDestination)
  this.allowed = opts.allowed || []
  const now = new Date()
  this.dir = opts.dir || `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/`
  this.error = null
  if (!opts.oss) {
    this.error = new Error('请设置阿里云oss相关配置')
  }
  this.ossClient = new OSS(opts.oss)
}
OssStorage.prototype._handleFile = function (req, file, cb) {
  if (this.error) {
    return cb(this.error)
  }
  const self = this
  this.getDestination(req, file, function (err, path) {
    if (err) return cb(err)
    self.ossClient.putStream(path, file.stream).then(result => {
      cb(null, result)
    }).catch(error => {
      cb(error)
    })
  })
}
OssStorage.prototype._removeFile = function (req, file, cb) {
  this.ossClient.delete(file.name).then((result) => {
    cb(null, result)
  }).catch((error) => {
    cb(error)
  })
}
module.exports = function (opts) {
  return new OssStorage(opts)
}
