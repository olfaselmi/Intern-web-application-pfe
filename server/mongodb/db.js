const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(
      "mongodb+srv://olfaselmi:azerty@clusterpfe.ibgfbve.mongodb.net/?retryWrites=true&w=majority"
     
    );
    console.log("MongoDB Connected ...");
  } catch (error) {
    console.log(error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
