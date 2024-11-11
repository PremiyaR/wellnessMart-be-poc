const CryptoJS = require('crypto-js');

// Define the same secret key used in your main code
const secretKey = "secretKey123";

// Sample data to test encryption and decryption
const sampleData = { name: "Test Patient", age: 30 };

// Encrypt the sample data
const encryptData = (data, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

// Decrypt the data back
const decryptData = (encryptedData, key) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Test the encryption and decryption
try {
    const encryptedData = encryptData(sampleData, secretKey);
    console.log("Encrypted Data:", encryptedData);

    const decryptedData = decryptData(encryptedData, secretKey);
    console.log("Decrypted Data:", decryptedData);
} catch (error) {
    console.error("Error during encryption/decryption:", error.message);
}
