// Local S3 Server
module.exports = async () => {
  await global.s3ever.close();
};
