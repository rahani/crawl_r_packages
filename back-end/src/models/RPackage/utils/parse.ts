import { RPackageLean } from "../RPackage.d";
export const seekingFormat = "tar.gz";

export interface InitialData {
  PackageName: string;
  Version: string;
}
/**
 * Parse R package initial data
 * remove .tar.gz from end of href
 * split by _
 * @param href R package href
 * @returns InitialData
 */
export const parseDataFromHref = (href: string): InitialData => {
  const sepratedData = href.split(`.${seekingFormat}`)[0].split("_");
  return { PackageName: sepratedData[0], Version: sepratedData[1] };
};
export const removeAdditionalData = (data?: string) => {
  if (!data) return "";
  return data
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s*\<[^)]*\>/g, "")
    .replace(/\s*\[[^)]*\]/g, "");
};

/**
 * Parse DESCRIPTION file as DCF to key value map data
 * @param descriptionFileData DESCRIPTION file data
 * @returns Map of key value
 */
export const parseDCFToKeyValue = (descriptionFileData: string) => {
  const keyValueMap = new Map<string, string>();
  let tempRow = "";
  descriptionFileData.split("\n").forEach((row) => {
    if (row.startsWith(" ")) {
      tempRow = tempRow + " " + row.trim();
    } else {
      if (tempRow) {
        const [key, value] = tempRow.split(": ");
        keyValueMap.set(key.trim(), value ? value.trim() : "");
      }
      tempRow = row;
    }
  });
  return keyValueMap;
};

/**
 * convert key value map to desired format
 * @param descriptionFileData DESCRIPTION file data
 * @returns RPackageLean
 */
export const parseDCF = (descriptionFileData: string): RPackageLean => {
  const keyValueMap = parseDCFToKeyValue(descriptionFileData);

  try {
    const allDependencies =
      keyValueMap
        .get("Depends")
        ?.split(",")
        .map((row) => row.trim()) || [];

    const RVersionNeeded =
      allDependencies.find((row) => row.startsWith("R ("));

    const Dependencies = allDependencies.filter(
      (row) => !row.startsWith("R (")
    );

    const Authors =
      removeAdditionalData(keyValueMap.get("Author"))
        .split(/,|and/)
        .map((row) => row.trim()) || [];

    const Maintainers =
      removeAdditionalData(keyValueMap.get("Maintainer"))
        .split(/,|and/)
        .map((row) => row.trim()) || [];

    return {
      PackageName: keyValueMap.get("Package") || "",
      Version: keyValueMap.get("Version") || "",
      Title: keyValueMap.get("Title") || "",
      License: keyValueMap.get("License") || "",
      DateOrPublication: new Date(keyValueMap.get("Date/Publication")!),
      RVersionNeeded,
      Dependencies,
      Authors,
      Maintainers,
    };
  } catch (err) {
    throw err;
  }
};
