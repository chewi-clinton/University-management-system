const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Payroll = require('./models/Payroll');
  const payrolls = await Payroll.find().populate('employeeId');
  console.log('Payrolls found:', payrolls.length);
  payrolls.forEach(p => {
    console.log(`- ${p.employeeId?.name} (${p.status}): XAF ${p.netPay}`);
  });
  process.exit(0);
}).catch(err => console.error('DB Error:', err.message));
