import { RPackageDocument } from "../RPackage.d";
import { RPackageModel } from "../RPackage";
import { InitialData, parseDCF } from "./parse";
import { getDescriptionData } from "./crawl";
import logger from "../../../util/logger";

enum TaskType {
  UPDATE = "UPDATE",
  CREATE = "CREATE",
}

interface Task {
  type: TaskType;
  initialData: InitialData;
  RPackageDB?: RPackageDocument;
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
    const RPackages = await RPackageModel.find({ PackageName });
    if (RPackages.length == 0) {
      tasksList.push({
        type: TaskType.CREATE,
        initialData: initialRPackagesDatum,
      });
    } else {
      const versions = RPackages.map((RPackage) => RPackage.Version);
      if (!versions.includes(Version)) {
        tasksList.push({
          type: TaskType.CREATE,
          initialData: initialRPackagesDatum,
        });
      }
    }
  }
  return tasksList;
};

const createRPackage = async (initialData: InitialData) => {
  const descriptionData = await getDescriptionData(initialData);
  const RPackageData = parseDCF(descriptionData);
  const RPackage = new RPackageModel({
    ...RPackageData,
  });
  await RPackage.save();
  logger.info(
    `${initialData.PackageName} with version ${initialData.Version} created`
  );
};

/**
 * handle single task (create or update)
 * @param task
 */
export const handleTask = async (task: Task) => {
  const { type, initialData, RPackageDB } = task;
  switch (type) {
    case TaskType.CREATE:
      await createRPackage(initialData);
      break;
    case TaskType.UPDATE:
      // await updateRPackage(initialData, RPackageDB!);
      break;
  }
};
