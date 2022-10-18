import { connect, disconnect } from "mongoose";
import { MONGODB_URI } from "../src/util/secrets";

(() => {
  connect(MONGODB_URI, {})
    .then(() => {
      /**
       * ready to use.
       */
      console.log("Hello World!");
    })
    .catch((err) => {
      console.log(
        `MongoDB connection error. Please make sure MongoDB is running. ${err}`
      );
      process.exit();
    })
    .finally(() => {
      disconnect();
    });
})();
