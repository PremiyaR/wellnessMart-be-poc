const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
   data: String,
})

module.exports= mongoose.model('Patient',patientSchema);