import crypto from "crypto";

// AES encryption setup (used for model name)
const secretKey = Buffer.from(process.env.ENCRYPTION_SECRET_KEY, "hex"); // Convert hex string to Buffer
const ivLength = 16; // IV length for AES-256-CBC (16 bytes)

if (!secretKey) {
  throw new Error("Secret key is not set in environment variables.");
}

// Encrypt function
export function encrypt(text) {
  const iv = crypto.randomBytes(ivLength); // New IV for each encryption
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encrypted, iv: iv.toString("hex") };
}

// Decrypt function
export function decrypt(encryptedText, iv) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
