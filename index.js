const express = require('express');
const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const secretKey = "secretKey123";

mongoose.connect('mongodb://localhost:27017/item_database');

const patientSchema = new mongoose.Schema({
    data: String,
});

const Patient = mongoose.model('Patient', patientSchema);

app.post('/api/patient-onboarding', async (req, res) => {
    const { data } = req.body;

    const newPatient = new Patient({ data });
    await newPatient.save();

    res.status(200).send("Data stored securely.");
});

app.get('/api/patient-onboarding', async (req, res) => {
    try {
        const patients = await Patient.find();

        const decryptedPatients = patients.map((patient) => {
            const decryptedData = CryptoJS.AES.decrypt(patient.data, secretKey).toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedData);
        });

        res.status(200).json({ patients: decryptedPatients });
    } catch (error) {
        res.status(500).send("Error retrieving patients");
    }
});


app.listen(5000, () => console.log('Server running on port 5000'));