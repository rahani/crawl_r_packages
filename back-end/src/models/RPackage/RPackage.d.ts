import { Model, Document } from "mongoose";

export type RPackageLean = {
  PackageName: string;
  Version: string;
  RVersionNeeded?: string;
  Dependencies: string[];
  DateOrPublication: Date;
  Title: string;
  Authors: string[];
  Maintainers: string[];
  License: string;
};
export type RPackageDocument = Document & RPackageLean;
