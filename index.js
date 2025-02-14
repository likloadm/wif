var bs58check = require('bs58check')
var Buffer = require('safe-buffer').Buffer

function decodeRaw (buffer, version) {
  // check version only if defined
  if (version !== undefined && buffer[0] !== version) throw new Error('Invalid network version')

  // invalid length
  if (buffer.length !== 5954) throw new Error('Invalid WIF length')

  // invalid compression flag
  if (buffer[4001] !== 0x01) throw new Error('Invalid compression flag')

  return {
    version: buffer[0],
    privateKey: buffer.slice(1, 4001),
    compressed: true
  }
}

function encodeRaw (version, privateKey, compressed) {
  var buf = new Buffer(1);
  buf.writeUInt8(version, 0);
  var result = Buffer.concat([buf, Buffer.from(privateKey, "hex")])
  return result
}

function decode (string, version) {
  return decodeRaw(bs58check.decode(string), version)
}

function encode (version, privateKey, compressed) {
  if (typeof version === 'number') return bs58check.encode(encodeRaw(version, privateKey, compressed))

  return bs58check.encode(
    encodeRaw(
      version.version,
      version.privateKey,
      version.compressed
    )
  )
}

module.exports = {
  decode: decode,
  decodeRaw: decodeRaw,
  encode: encode,
  encodeRaw: encodeRaw,
  bs58check: bs58check
}
