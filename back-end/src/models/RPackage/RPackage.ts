import { Model, model, Schema } from "mongoose";
import { RPackageDocument } from "./RPackage.d";
import { handleUpdate } from "./staticFunctions/handleUpdate";

const RPackageSchema = new Schema<RPackageDocument>(
  {
    PackageName: {
      type: String,
      required: true,
      unique: true,
    },
    Version: {
      type: String,
      required: true,
    },
    RVersionNeeded: {
      type: String,
      required: true,
    },
    Dependencies: {
      type: String,
      required: true,
    },
    DateOrPublication: {
      type: Date,
      required: true,
    },
    Title: {
      type: String,
      required: true,
    },
    Author: {
      type: String,
      required: true,
    },
    Maintainer: {
      type: String,
      required: true,
    },
    Licence: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * R Package middleware.
 */
// RPackageSchema.pre("save", function save(next) {
//   const RPackage = this as RPackageSchema;
// });

/**
 * define static methods
 */
export interface RPackageModel extends Model<RPackageDocument> {
  /** handle updates packages */
  handleUpdate(): Promise<void>;
}
RPackageSchema.statics.handleUpdate = handleUpdate;

export const RPackageModel = model<RPackageDocument, RPackageModel>(
  "RPackage",
  RPackageSchema
);
