// Local S3 Server
const S3rver = require('s3rver')

module.exports = async () => {
  try {
    global.s3ever = await new S3rver({
      port: 4569,
      hostname: 'localhost',
      silent: true,
      directory: './tmp'
    }).run((err, host, port) => {
      if (err) {
        throw err
      }
      return global.s3ever
    })
    return global.s3ever
  } catch (err) {
    global.s3ever.close()
    throw err
  }
}
