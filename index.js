const express = require("express");
const categories = require("./routes/categories/categories");
const moment = require('moment'); 
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const helmet = require("helmet");
const config = require("config");
const app = express();
const compression = require("compression");
dotenv.config()

const addressCates = require("./routes/categories/addressCates");
const nearLocCates = require("./routes/categories/nearLocCates");

const driverListings = require("./routes/driverListings");
const driverSchedules = require("./routes/driverSchedules");

const regions = require("./routes/regions");
const listings = require("./routes/listings");
const listing = require("./routes/listing");

const schedules = require("./routes/schedules");
const schedule = require("./routes/schedule");
const addresses = require("./routes/addresses");
const address = require("./routes/address");

const drivers = require("./routes/drivers");
const driver = require("./routes/driver");
const auth = require("./routes/auth");

const usersConfirm = require("./routes/usersConfirm");
const driversConfirm = require("./routes/driversConfirm");
const confirmedUsersDrivers = require("./routes/confirmedUsersDrivers");
const deletedUsersDrivers = require("./routes/deletedUsersDrivers");

const users = require("./routes/users");
const user = require("./routes/user");
const driverauth = require("./routes/driverauth");

const messages = require("./routes/messages");
const expoPushTokens = require("./routes/expoPushTokens");

mongoose.connect("mongodb+srv://bus123:12345@cluster0.kx3lumu.mongodb.net/?retryWrites=true&w=majority", ()=> {
  console.log("Databse Connected");
},
(error) => {
  console.log("Databse can not be connected: " + error);
}
); 

// const getdetails = require('./routes/auth');
const User = require('./store/User');
const Idserial = require('./store/Idserial');
const Regions = require('./store/Regions')

app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use("/api/address", address);
app.use("/api/addresses", addresses);
app.use("/api/schedule", schedule);
app.use("/api/schedules", schedules);

app.use("/api/addressCates", addressCates);
app.use("/api/nearLocCates", nearLocCates);

app.use("/api/regions", regions);

app.use("/api/categories", categories);
app.use("/api/listing", listing);
app.use("/api/listings", listings);

app.use("/api/driverSchedules", driverSchedules);
app.use("/api/driverListings", driverListings);

app.use("/api/usersConfirm", usersConfirm);
app.use("/api/driversConfirm", driversConfirm);

app.use("/api/confirmedUsers", confirmedUsersDrivers);
app.use("/api/confirmedDrivers", confirmedUsersDrivers);

app.use("/api/deletedUsers", deletedUsersDrivers);
app.use("/api/deletedDrivers", deletedUsersDrivers);

app.use("/api/user", user);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use("/api/driver", driver);
app.use("/api/drivers", drivers);
app.use("/api/driverauth", driverauth);

app.use("/api/expoPushTokens", expoPushTokens);
app.use("/api/messages", messages);

app.get("/api", async (req, res) => {
res.send("hi")
  // try {
  //   const Region = await Regions.updateMany({adminNumber: {$exists: false}},  { $set: { adminNumber: 581302920 }});
  //    res.send(Region) 
  // } catch (error) {
  //   return res.status(404).send(error.message)
  // }
})

const port = process.env.PORT || config.get("port");
const host = '0.0.0.0';

app.listen(port, host, function() {
  console.log(`Server started on port ${port}...`);
});
