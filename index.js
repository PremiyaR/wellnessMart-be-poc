require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const patientRoutes = require('./routes/PatientRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

async function connectToDatabase() {
    try {
      await mongoose.connect("mongodb://localhost:27017/item_database");
      console.log('Connection successful to MongoDB.');
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
}

app.use('/api/patient-onboarding', patientRoutes);

async function startServer(){
    await connectToDatabase();
    const port =  process.env.PORT || 5000;
    app.listen(port, ()=>{
        console.log('Server running on localhost', port);
    })
}

startServer();