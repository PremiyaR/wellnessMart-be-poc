const Patient = require('../model/Patient.js');
const express = require('express');
const router = express.Router();
const CryptoJS = require('crypto-js');
const fs = require('fs');
const crypto = require('crypto');

const secretKey = process.env.SECRET_KEY || "secretKey123"; // Store in environment variable

const privateKey = fs.readFileSync('privateKey.pem', 'utf8');

// POST CALL
router.post('/', async (req, res) => {
    try {
        const { encryptedData, encryptedAESKey } = req.body;

        // Decrypt AES key using RSA private key
        const aesKeyBuffer = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(encryptedAESKey, 'base64')
        );

        const aesKey = aesKeyBuffer.toString('utf8'); // Convert to UTF-8 string

        // Decrypt data with AES key
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, aesKey).toString(CryptoJS.enc.Utf8);
        const patientData = JSON.parse(decryptedData);

        // Save patient data to database
        const patient = new Patient(patientData);
        await patient.save();
        res.status(201).json(patient);
    } catch (err) {
        console.error('Error in post call:', err);
        res.status(400).json({ error: err.message });
    }
});

// GET CALL
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();

        // Decrypt each patient's data
        const decryptedPatients = patients.map((patient) => {
            const decryptedData = CryptoJS.AES.decrypt(patient.data, secretKey).toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedData);
        });

        res.status(200).json({ patients: decryptedPatients });
    } catch (err) {
        console.error('Error in get call:', err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to retrieve public key
router.get('/public-key', (req, res) => {
    const publicKey = fs.readFileSync('publicKey.pem', 'utf-8');
    res.status(200).send(publicKey);
});

module.exports = router;
