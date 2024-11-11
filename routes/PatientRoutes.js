const Patient= require('../model/Patient.js');
const express=require('express');
const router = express.Router();

//POST CALL
router.post('/', async(req,res)=>{
    try{
        console.log('Request Body:', req.body);
        const patient = new Patient(req.body);
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
        res.json(patients);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

module.exports = router;