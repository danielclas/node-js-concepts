import * as fs from "fs";
import * as util from "util";

const readFile = util.promisify(fs.readFile);

export default function cat(path: string) {
  readFile(path, { encoding: "utf-8" })
    .then((content) => {
      console.log(content);
    })
    .catch((error) => {
      console.log(error);
    });
}
