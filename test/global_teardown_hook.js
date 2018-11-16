// Local S3 Server
const S3rver = require('s3rver')

module.exports = async () => {
  try {
    await global.s3ever.close()
    return
  } catch (err) {
    throw err
  }
}
