import { RPackageDocument } from "../RPackage.d";
import { RPackageModel } from "../RPackage";
import { InitialData } from "./parse";

enum TaskType {
  UPDATE = "UPDATE",
  CREATE = "CREATE",
}

interface Task {
  type: TaskType;
  initialData: InitialData;
  RPackageDB: RPackageDocument | null;
}
/**
 * return rows if is not already in the database as create list
 * return rows with different version if is already in the database as update list
 * @param initialRPackagesData  initial R packages data
 * @returns  Task[]
 */
export const getTasksList = async (initialRPackagesData: InitialData[]) => {
  const tasksList: Task[] = [];
  for (const initialRPackagesDatum of initialRPackagesData) {
    const { PackageName, Version } = initialRPackagesDatum;
    const RPackage = await RPackageModel.findOne({ PackageName });
    if (!RPackage) {
      tasksList.push({
        type: TaskType.CREATE,
        initialData: initialRPackagesDatum,
        RPackageDB: RPackage,
      });
    } else {
      if (RPackage.Version !== Version) {
        tasksList.push({
          type: TaskType.UPDATE,
          initialData: initialRPackagesDatum,
          RPackageDB: RPackage,
        });
      }
    }
  }
  return tasksList;
};
