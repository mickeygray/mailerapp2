const mongoose = require("mongoose");
const { Schema } = mongoose;

const leadSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    fullName: String,
    address: String,
    deliveryAddress: String,
    alternateAddress1: String,
    city: String,
    state: String,
    zip4: String,
    zip: String,
    zipCode: String,
    county: String,
    ssn: String,
    fileType: String,
    fileType2: String,
    fileType3: String,
    fileType4: String,
    fileType5: String,
    amount: String,
    source: String,
    email: String,
    filingDate: String,
    filingDate2: String,
    filingDate3: String,
    filingDate4: String,
    filingDate5: String,
    loadDate: Date,
    fiveAmount: String,
    nineAmount: String,
    loadDatePlusSeven: String,
    entityType: String,
    pinCode: String,
    origDept: String,
    plaintiff: String,
    plaintiff2:String,
    plaintiff3:String,
    plaintiff4:String,
    plaintiff5:String,
    amount2: String,
    amount5: String,
    amount4: String,
    amount3: String,
    age: String,
    dob: String,
    phone: String,
    phones: [String],
    ageRange: String,
    phone: String,
    emailAddresses: [String],
    email: String,
    emailAddress: String,
    costs: [
      {
        mailer: String,
        unitCost: Number,
        date: Date,
      },
    ],
    real: {
      name: String,
      address: String,
      amount: String,
    },
    bankruptcy: {
      court: String,
      filingType: String,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("leads", leadSchema);
