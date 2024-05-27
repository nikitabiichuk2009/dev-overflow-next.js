import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGO_DB_URL) {
    return console.log("NO MongoDB URL!");
  }
  if (isConnected) {
    return console.log("MongoDB is already connected");
  }
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      dbName: "devflow_nextjs",
    });
    isConnected = true;
    console.log("DB is connected!");
  } catch (err) {
    console.log(err);
  }
};
