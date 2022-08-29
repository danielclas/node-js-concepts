import * as fs from "fs";
import * as util from "util";

const fsWriteFile = util.promisify(fs.writeFile);

export default function touch(path: string, content: string) {
  return fsWriteFile(path, content)
    .then(() => {
      console.log("File created!");
    })
    .catch((error) => {
      console.log(error);
    });
}
