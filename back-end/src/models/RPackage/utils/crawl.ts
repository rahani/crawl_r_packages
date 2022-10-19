import { CRAN_URL } from "../../../util/secrets";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import * as zlib from "zlib";
import * as tar from "tar-stream";
import fs from "fs";
import { InitialData, parseDataFromHref, seekingFormat } from "./parse";
import * as path from "path";

/**
 * get html from CRAN_URL
 * parse html
 * get hrefs
 * filter hrefs by seekingFormat
 * parse hrefs to get initial data
 * return initial data
 * @returns Array of InitialData
 */
export const getRPackagesInitialData = async () => {
  const initialDatas: InitialData[] = [];
  const response = await fetch(CRAN_URL!);
  const text = await response.text();
  const $ = cheerio.load(text);
  $("a")
    .map((i, el) => {
      const href: string | undefined = $(el).attr("href");
      if (href && href.endsWith(`.${seekingFormat}`)) {
        initialDatas.push(parseDataFromHref(href));
      }
    })
    .get();
  return initialDatas;
};

/**
 * Download R package from CRAN_URL and save it in the file system
 * read DESCRIPTION file from zip file
 * @param initialData  initial R packages data
 */
export const getDescriptionData = async (initialData: InitialData) => {
  const fileName = `${initialData.PackageName}_${initialData.Version}.${seekingFormat}`;
  const serverUrl = `${CRAN_URL}/${fileName}`;
  const localPath = `./archives/${fileName}`;
  const descriptionPathInZip = `${initialData.PackageName}/DESCRIPTION`;

  try {
    // download file
    await downloadFile(serverUrl, localPath);

    // read DESCRIPTION file from zip file
    const descriptionData = await new Promise<string>((resolve, reject) => {
      var extract = tar.extract({});
      var data = "";

      extract.on("entry", function (header, stream, cb) {
        stream.on("data", function (chunk) {
          if (header.name == descriptionPathInZip) data += chunk;
        });

        stream.on("end", function () {
          cb();
        });

        stream.resume();
      });

      extract.on("finish", function () {
        resolve(data);
      });

      extract.on("error", function () {
        reject("Error in extracting tar file");
      });

      fs.createReadStream(localPath).pipe(zlib.createGunzip()).pipe(extract);
    });
    return descriptionData;
  } catch (err) {
    throw err;
  }
};

/**
 * Download file from url and save it in the file system
 * if folder is not exist, will create it
 * @param url for download
 * @param localpath for store file
 */
const downloadFile = async (url: string, localpath: string) => {
  const res = await fetch(url);

  fs.mkdirSync(path.dirname(localpath), { recursive: true });
  const fileStream = fs.createWriteStream(localpath);

  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
};
