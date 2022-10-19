import logger from "../../../util/logger";
import { getRPackagesInitialData } from "../utils/crawl";
import { getTasksList, handleTask } from "../utils/helper";
import { MAX_UPDATE_THREADS } from "../../../util/secrets";

/**
 * get R packages Initial data
 * get tasks list includes create and update tasks
 * run the tasks
 *
 */
export async function handleUpdate() {
  logger.info("handleUpdate starts");

  const initialRPackagesData = await getRPackagesInitialData();
  const tasksList = await getTasksList(initialRPackagesData);

  while (tasksList.length) {
    // MAX_UPDATE_THREADS at a time
    await Promise.all(
      tasksList.splice(0, MAX_UPDATE_THREADS).map((task) => handleTask(task))
    );
  }

  logger.info("handleUpdate ends");
}
