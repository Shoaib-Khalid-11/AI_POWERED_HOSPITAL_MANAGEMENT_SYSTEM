import mongoose from "mongoose";
const dbConnection = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI_LOCAL as string, {
      dbName: "HOSPITAL_MANAGEMENT_SYSTEM",
    })
    .then(() => {
      console.log(`Connected to Database ${mongoose.connection.host}`);
    })
    .catch((err) => {
      console.log(`Some Error Occurred While Connecting To Database: ${err}`);
      process.exit(1); // Exit process with failure
    });
};
export default dbConnection;
