const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";

function getEncryptionKey() {
  const key = process.env.CV_ENCRYPTION_KEY;

  if (!key || key.length !== 32) {
    throw new Error("CV_ENCRYPTION_KEY must be exactly 32 characters long");
  }

  return Buffer.from(key);
}

function encryptCv(buffer) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);

  const encryptedBuffer = Buffer.concat([
    cipher.update(buffer),
    cipher.final(),
  ]);

  return {
    encryptedBuffer,
    iv: iv.toString("hex"),
  };
}

function decryptCv(encryptedBuffer, iv) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(iv, "hex")
  );

  return Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);
}

module.exports = {
  encryptCv,
  decryptCv,
};