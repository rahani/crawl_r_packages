import { Model, Document } from "mongoose";

export type RPackageLean = {
  PackageName: string;
  Version: string;
  RVersionNeeded: string;
  Dependencies: string;
  DateOrPublication: Date;
  Title: string;
  Author: string;
  Maintainer: string;
  Licence: string;
};
export type RPackageDocument = Document & RPackageLean;
