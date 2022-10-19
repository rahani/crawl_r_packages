import logger from "../../../util/logger";
import { getRPackagesInitialData } from "../utils/crawl";
import { getTasksList } from "../utils/helper";

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

  // run tasks

  logger.info("handleUpdate ends");
}
