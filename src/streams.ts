import * as fs from "fs";
import * as util from "util";

import { Writable, Readable } from "stream";

let chunkCount = 1;

class WritableStream extends Writable {
  private writeFile;

  constructor(private path: string) {
    super();

    this.writeFile = util.promisify(fs.writeFile);
  }

  _write(chunk: any, encoding: string, next: (error?: Error) => void) {
    this.writeFile(this.path, chunk)
      .then(() => {
        console.log(
          "13- Write method of custom writable invoked. Should create customWritableExample.txt"
        ); // 13
        next();
      })
      .catch((error) => next(error));
  }
}
function dataCallback(chunk: any) {
  if (chunkCount === 1)
    // Will log false if 'createReadStream' is called with enconding option
    console.log(
      "4- Chunk received from stream is of type buffer?: ",
      chunk instanceof Buffer
    ); // 4

  chunkCount++;
}

function dataExample(path: string) {
  const stream = fs.createReadStream(path, { encoding: "utf-8" });

  console.log("1- Subscribing callback to data event of stream"); // 1
  stream.on("data", dataCallback);

  stream.on("end", () => {
    console.log(`5- Total chunks for file ${path}: ${chunkCount}`); // 5
  });
}

function noDataExample(path: string) {
  console.log("2- Calling no data example. Nothing should be logged from it"); // 2

  const stream = fs.createReadStream(path, { encoding: "utf-8" });

  // All readable stream start in "paused" mode by default.
  // If we call its 'resume' method and thus switch it to
  // 'flowing' mode before attaching a 'data' event listener,
  // data from the stream will be lost
  stream.resume();

  setTimeout(() => {
    stream.on("data", () => {
      console.log("Will not be invoked");
    });
  }, 500);
}

function readableExample() {
  const stream = new Readable();

  stream.push("Line 1 from readable"); // Push data to readable and trigger 'data' event
  stream.push("Line 2 from readable");
  stream.push(null); // Push null to signal stream is done pushing data

  console.log("3- Loggin from readable stream"); // 3

  stream.on("data", (chunk) => {
    console.log(chunk.toString());
  });
}

function streamToStreamExample(path: string) {
  const readableStream = fs.createReadStream(path);
  const writableStream = fs.createWriteStream("./streamToStreamExample.txt");

  console.log(
    "6- Stream to stream example, copying from one file from another..."
  ); // 6
  readableStream.on("data", (chunk) => {
    writableStream.write(chunk);
  });

  readableStream.on("end", () => {
    console.log(
      "7- Reading stream ended. Created streamToStream.txt. Calling destroy method, should trigger 'close' event"
    ); // 7
    readableStream.destroy();
  });

  readableStream.on("close", () => {
    console.log("8- Close event of read stream emmitted"); // 8
  });
}

function pipeExample(path: string) {
  const readableStream = fs.createReadStream(path);
  const writableStream = fs.createWriteStream("pipeExample.txt");

  // When providing a readable stream with a writable one through a pipe,
  // and all data has been transmitted, readable 'end' event is emitted and
  // writable streams closes with the writable.end function

  console.log(
    "9- Piping readable stream through writable stream, should create pipeExample.txt"
  ); // 9
  readableStream.pipe(writableStream);

  writableStream.on("finish", () => {
    console.log(
      "10- Finish event of writable stream emitted after pipe finishing "
    ); // 10
  });
}

function customStreamExample() {
  // The  fs.createWriteStream is not the only way of making a writable stream.
  // We can create our writable stream to understand it better.

  console.log("11- Created read stream to write with custom writable stream"); // 11
  const readable = fs.createReadStream("2lines.txt");
  const writable = new WritableStream("customWritableExample.txt");

  readable.pipe(writable);

  readable.on("data", () => {
    console.log("12- Logging from data event of readable"); // 12
  });
}

function processStdinExample() {
  // The stdin stream is in a paused mode by default.
  // To switch the stdin stream to flowing and make application
  // listen for input we need to resume the stdin.
  // It happens under the hood when attaching the ‘data‘ event listener.

  console.log("14- Attaching handler to stdin data event"); // 15

  let a: number, b: number;

  process.stdin.on("data", (data) => {
    if (!a) a = Number(data.toString());
    else {
      console.log("15- Loggin from handler of event data of process.stdin"); // 16
      b = Number(data.toString());
      console.log(`${a} + ${b} == ${a + b}`);
      process.stdin.pause();

      processStdoutExample();
    }
  });
}

function processStdoutExample() {
  // Process.stdout and .stderr are writable streams used in console.log and .error
  // Writing to them results in text appearing in the console.
  // We can easily make use of that and, for example, log a file.

  console.log(
    "16- Creating an fs.readStream and piping process.stdout. Should log content from file"
  ); // 16

  const readable = fs.createReadStream("2lines.txt");
  readable.pipe(process.stdout);
}

export default function streams(path: string) {
  dataExample(path);
  noDataExample(path);
  readableExample();

  setTimeout(() => {
    streamToStreamExample(path);
  }, 1000);

  setTimeout(() => {
    pipeExample(path);
  }, 2000);

  setTimeout(() => {
    customStreamExample();
  }, 3000);

  setTimeout(() => {
    processStdinExample();
  }, 4000);
}
