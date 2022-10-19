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
