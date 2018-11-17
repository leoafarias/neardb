// Local S3 Server
import S3rver from 's3rver';

export default async () => {
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
    throw err
  }
}
