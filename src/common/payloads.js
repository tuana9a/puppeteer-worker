function toBuffer(input) {
  return Buffer.from(JSON.stringify(input));
}

module.exports = {
  toBuffer,
};
