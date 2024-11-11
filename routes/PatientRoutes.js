const Patient= require('../model/Patient.js');
const express=require('express');
const router = express.Router();
const CryptoJS = require('crypto-js');

const secretKey = "secretKey123"; //needs to be stored in a environment variable.

//POST CALL
router.post('/', async(req,res)=>{
    try{
        console.log('Request Body:', req.body);
        const { data } = req.body;
        const patient = new Patient({ data });
        await patient.save();
        res.status(201).json(patient);
    }catch(err){
        console.log('Error in post call:', err)
        res.status(400).json({error: err.message})
    }
})

//GET CALL
router.get('/', async(req, res)=>{
    try{
        const patients = await Patient.find();

        //Decryption of the encrypted data from the database.
        const decryptedPatients = patients.map((patient) => {
            const decryptedData = CryptoJS.AES.decrypt(patient.data, secretKey).toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedData);
        });

        res.status(200).json({patients : decryptedPatients});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

module.exports = router;