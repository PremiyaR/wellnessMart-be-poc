const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    ssn: String
})

module.exports= mongoose.model('patient',patientSchema);