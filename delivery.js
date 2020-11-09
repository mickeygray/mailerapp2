const express = require("express");
const router = express.Router();
var cron = require('node-cron');
const GridFsStorage = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const crypto = require("crypto");
const config = require("config");
const path = require("path");
const mongodb = require("mongodb");
const BSON = require("bson");
const keya = require("./config/key.json");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const db = config.get("mongoURI");
const Grid = require("gridfs-stream");
var smtpTransport = require('nodemailer-smtp-transport');
const Binary = require("mongodb").Binary;
const multer = require("multer");
const Zip = require("./models/Zip");
const Mail = require("./models/Mail");
const Lead = require("./models/Lead");
const Schedule = require("./models/Schedule");
const moment = require("moment");
const mergeWith = require("lodash.mergewith");
const { Parser } = require("json2csv");

const { Duplex } = require("stream");
const _ = require("lodash");


const { isArrayLikeObject, update } = require("lodash");
const zip = require("express-zip");
const nodemailer = require("nodemailer");
const storage = new GridFsStorage({
  url: db,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = req.body.title;
        const fileInfo = {
          filename: filename,
          bucketName: "fs",
        };
        resolve(fileInfo);
      });
    });
  },
});

const storage2 = new GridFsStorage({
  url: db,
  options: { useUnifiedTopology: true },
  file: (req, attachment) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }

        console.log(attachment);
        const filename = attachment.filename;
        const fileInfo = {
          filename: filename,
          bucketName: "fs",
        };
        resolve(fileInfo);

        console.log(fileInfo);
      });
    });
  },
});
const upload2 = multer({ storage2 });

const upload = multer({ storage });


cron.schedule('*  *  *  *   *   * ', async () => {
  const schedule = await Schedule.find();
  var scheduleObj = schedule.reduce(function (r, o) {
    var k = parseInt(o.lookBack);
    if (r[k] || (r[k] = [])) r[k].push(o);
    return r;
  }, {});

  var filterDates = Object.keys(scheduleObj).map((v) =>
    Intl.DateTimeFormat(
      "fr-CA",
      {
        timeZone: "America/Los_Angeles",
      },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(moment().subtract(parseInt(v), "day")))
  );

  let leads = await Lead.find({
    "loadDate": { "$in": filterDates },
  });

 // console.log(leads)

// console.log(filterDates)


  const listObj = leads.reduce(function (r, o) {
    var k = o.loadDate;
    key = Intl.DateTimeFormat(
      "fr-CA",
      {
        timeZone: "America/Los_Angeles",
      },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(moment(new Date(k)));
    if (r[key] || (r[key] = [key])) r[key].push(o);
    return r;
  }, {});

  var scheduleObj2 = schedule.reduce(function (r, o) {
    var k = o.lookBack;
    (tracking = o.tracking),
      (lienAmount = o.lienAmount),
      (zipCodeSuppress = o.zipCodeSuppress),
      (zipCode = o.zipCode),
      (lienType = o.lienType),
      (vendor = o.vendor);
    postageCeiling = o.postageCeiling;
    unitCost = o.unitCost;
    title = o.title;
    mailHouse = o.mailHouse;
    key = Intl.DateTimeFormat(
      "fr-CA",
      {
        timeZone: "America/Los_Angeles",
      },
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
    ).format(new Date(moment().subtract(parseInt(k), "day")));
    if (r[key] || (r[key] = []))
      r[key].push({
        [tracking]: {
          tracking,
          lienAmount,
          title,
          zipCodeSuppress,
          postageCeiling,
          unitCost,
          zipCode,
          lienType,
          vendor,
          tracking,
          mailHouse,
        },
      });
    return r;
  }, {});

  function customizer(objValue, srcValue) {
    if (_.isArray(srcValue)) {
      return srcValue.concat({ list: objValue });
    }
  }

  let mailSchedule = mergeWith(listObj, scheduleObj2, customizer);
  let drop = [];
  mailSchedule = Object.entries(mailSchedule).forEach((entry) => {
    const master = entry.pop();

    //console.log(entry);

    //console.log(master);
    const list = Object.values(master.pop())
      .flat()
      .filter((e) => typeof e !== "string");

    function removeValue(objectArray) {
      objectArray.forEach((obj) => {
        Object.entries(obj).forEach(([key, val]) => {
          if (key === "_doc") {
            val.amount = parseInt(val.amount.replace("$", "").replace(",", ""));
          }
        });
      });
      return objectArray;
    }
  

//    console.log(list.length)

       let mailList = removeValue(list);

       //console.log(mailList.length)

         //console.log(master)

    let tollFrees = [];

    master.forEach((tracker) => {
      const obj = Object.assign(
        {},
        ...(function _flatten(o) {
          return [].concat(
            ...Object.keys(o).map((k) =>
              typeof o[k] === "object" ? _flatten(o[k]) : { [k]: o[k] }
            )
          );
        })(tracker)
      );
      tollFrees.push(obj);
    });

      tollFrees = tollFrees.map((obj) => ({
      ...obj,
      mailList: mailList,
      date: entry.toString(),
    }));

     drop.push(tollFrees)

  })

drop = drop.flat()
const updatedDrop = []
async function withForOf() {
  for (const tollFree of drop) {
     const zipCodes = Object.values(tollFree)[0].split(",");
    
    
      let updatedList = []
      const {
        lienType,
        tracking,
        mailList,
        lienAmount,
        vendor,
        postageCeiling,
        unitCost,
        mailHouse,
        date,
        title, 
        zipCodeSuppress,
      } = tollFree;

   zips = await Zip.find({
    "class": { "$in": zipCodes },
  });
   
  zips = zips.map(zip => zip.zip4)

switch (zipCodeSuppress) {
  case "keepSelect":
    updatedList = mailList.filter((e) => zips.includes(e.zip4.substring(0,5)))
    break;
  case "suppressSelect":
    updatedList = mailList.filter((e) => !zips.includes(e.zip4.substring(0,5)))
    break;  
}

if(updatedList.length > 0){
switch (lienAmount) {
  case "15000":
    updatedList = updatedList.filter((e) => e.amount <= 15000);
    break;
  case "25000":
    updatedList = updatedList.filter(
      (e) => e.amount >= 15000 && e.amount <= 25000
    );
    break;
  case "50000":
  updatedList = updatedList.filter((e) => e.amount >= 25000 && e.amount <= 50000);
    break;
  case "100000":
    updatedList = updatedList.filter(
      (e) => e.amount >= 50000 && e.amount <= 100000
    );
    break;
  case "10000000":
   updatedList = updatedList.filter((e) => e.amount > 100000);
    break;
}} else {
  switch (lienAmount) {
  case "15000":
    updatedList = mailList.filter((e) => e.amount <= 15000);
    break;
  case "25000":
    updatedList = mailList.filter(
      (e) => e.amount >= 15000 && e.amount <= 25000
    );
    break;
  case "50000":
 updatedList = mailList.filter((e) => e.amount >= 25000 && e.amount <= 50000);
    break;
  case "100000":
   updatedList = mailList.filter(
      (e) => e.amount >= 50000 && e.amount <= 100000
    );
    break;
  case "10000000":
updatedList = mailList.filter((e) => e.amount > 100000);
    break;
}
} 

if(updatedList.length > 0){

switch (vendor) {
  case "ftls":
     updatedList = updatedList.filter((e) => e.pinCode.length === 7);
    break;
  case "risk":
     updatedList = updatedList.filter((e) => e.pinCode.length === 10);
    break;
  case "advance":
       updatedList = updatedList.filter((e) => e.pinCode.length === 12);
    break;
  case "atype":
       updatedList = updatedList.filter((e) => e.pinCode.length === 15);
    break;
}
} else {
  switch (vendor) {
  case "ftls":
    updatedList = mailList.filter((e) => e.pinCode.length === 7);
    break;
  case "risk":
  updatedList = mailList.filter((e) => e.pinCode.length === 10);
    break;
  case "advance":
 updatedList = mailList.filter((e) => e.pinCode.length === 12);
    break;
  case "atype":
   updatedList = mailList.filter((e) => e.pinCode.length === 15);
    break;
}
}

if(updatedList.length > 0){
switch (lienType) {
  case "state":
updatedList = updatedList.filter((e) => e.fileType == "State Tax Lien");
    break;
  case "federal":
 updatedList = updatedList.filter((e) => e.fileType == "Federal Tax Lien");
    break;
}
} else {
  switch (lienType) {
  case "state":
    updatedList = mailList.filter((e) => e.fileType == "State Tax Lien");
    break;
  case "federal":
    updatedList = mailList.filter((e) => e.fileType == "Federal Tax Lien");
    break;
}
}
   const combinedCost = unitCost + postageCeiling
   const  dropItem = {
        updatedList,
        tracking,
        vendor,
        postageCeiling,
        combinedCost,
        unitCost,
        mailHouse,
        date,
        title, 
     }       
    updatedDrop.push(dropItem)
  }
     const conn = mongoose.connection;
    const gfs = Grid(conn.db, mongoose.mongo);
    const json2csvParser = new Parser();

updatedDrop.forEach((drop) =>{

 
    const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            type: "OAuth2",
            user: "lienunit@nattaxgroup.com",
            serviceClient: keya.client_id,
            privateKey: keya.private_key,
          },
           tls:{
        rejectUnauthorized:false
    }    
  })
gfs.files.find({ filename: drop.title }).toArray(function (err, files) {
      var readableStream = gfs.createReadStream({ filename: drop.title });
      let bufferArray = [];
      readableStream.on("data", function (chunk) {
        bufferArray.push(chunk);
      });
    
      let buffer = [];
      let result = [];
      readableStream.on("end", function () {
        buffer = Buffer.concat(bufferArray);

        const attachment1 = {
          filename: `${drop.title}.pdf`,
          content: new Buffer(buffer, "application/pdf"),
        };
        
            drop.updatedList.map((list, i) =>
      result[i]
        ? (result[i].fullName = list.fullName)(
            (result[i].First_Name = list.firstName)
          )((result[i].Last_Name = list.lastName))(
            (result[i].Delivery_Address = list.deliveryAddress)
          )((result[i].City = list.city))((result[i].State = list.state))(
            (result[i].Zip_4 = list.zip4)
          )((result[i].County = list.county))(
            (result[i].File_Type = list.fileType)
          )((result[i].Amount = list.amount))(
            (result[i].pinCode = list.pinCode)
          )(
            (result[i].Five_Amount = (parseFloat(list.amount) * 0.05).toFixed(
              2
            ))
          )(
            (result[i].Nine_Amount = (parseFloat(list.amount) * 0.95).toFixed(
              2
            ))
          )
        : (result[i] = {
            Full_Name: list.fullName,
            First_Name: list.firstName,
            Last_Name: list.lastName,
            Delivery_Address: list.deliveryAddress,
            City: list.city,
            State: list.state,
            Zip_4: list.zip4,
            County: list.county,
            File_Type: list.fileType,
            Amount: list.amount,
            Pin_Code: list.pinCode,
            Five_Amount: (parseFloat(list.amount) * 0.05).toFixed(2),
            Nine_Amount: (parseFloat(list.amount) * 0.95).toFixed(2),
          })
    );

        const csv = json2csvParser.parse(result);

        const tracker = drop.title;
        const dt = drop.date;

        const attachment2 = {
          filename: `${tracker}__ ${dt}.csv`,
          content: csv,
        };

     const mailer = {
          title: "Daily Mail Drop",
          from: "NTE",
          to: ["mforde@nattaxexperts.com", "mickeygray85@hotmail.com","poakes@nattaxexperts.com"],
          subject: ` ${tracker} Daily Mail Drop `,
          attachments: [attachment1, attachment2],
          text: `Attached is the pdf and csv for the Direct Mail Campaign ${drop.title}. Thanks, NTE!`,
        };

    transporter.sendMail(mailer);  
}) 
})
}) 
} 
withForOf();
});