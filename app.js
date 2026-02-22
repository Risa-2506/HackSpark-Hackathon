const ussdRoutes = require('./routes/ussdRoutes');
const shopRoutes = require('./routes/shopRoutes');
const syncRoutes = require('./routes/syncRoutes');
const checkDistributionRoutes = require('./routes/checkDistributionRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');


const express=require('express');
const cors=require('cors');
const app=express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/ussd', ussdRoutes);
app.use('/api/v1/shop', shopRoutes);
app.use('/api/v1/sync', syncRoutes);
app.use('/api/v1/check-distribution', checkDistributionRoutes);
app.use('/api/v1/complaint', complaintRoutes);
app.use('/api/v1/admin', adminRoutes);


app.get('/',(req,res)=>
  {
    res.send("Server is running");
  })

module.exports=app;