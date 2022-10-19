import { connect, disconnect } from "mongoose";
import { MONGODB_URI } from "../src/util/secrets";
import { RPackageModel } from "../src/models/RPackage/RPackage";

(async () => {
  try {
    await connect(MONGODB_URI, {});
  } catch (err) {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    process.exit();
  }
  /**
   * Run handle update function to update R packages
   */
  await RPackageModel.handleUpdate();

  disconnect();
})();
