// import Question from "@/database/question.model";
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

  console.log(`Connecting to: ${process.env.MONGO_DB_URL}`);

  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      dbName: "devflow_nextjs",
    });
    // const result = await Question.updateMany(
    //   { views: { $type: "array" } },
    //   [{ $set: { views: { $arrayElemAt: ["$views", 0] } } }]
    // );

    // console.log("Update result:", result);
    isConnected = true;
    console.log("DB is connected!");
  } catch (err) {
    console.log(err);
    throw new Error("Database connection failed");
  }
};
