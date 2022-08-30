import { createServer, IncomingMessage, ServerResponse } from "http";
import { Readable } from "stream";
import * as mp from "multiparty";
import * as fs from "fs";
import * as util from "util";

// Data
const posts = [{ title: "Title of post", content: "Content of post" }];

export default function server() {
  const port = 3000;
  const server = createServer(serverHandler);

  server.listen(port);
}

// Server handler
function serverHandler(req: IncomingMessage, res: ServerResponse) {
  const url = req.url;
  const method = req.method;

  switch (url) {
    case "/posts": {
      if (method === "GET") {
        getPosts().then((data) => {
          res.setHeader("Content-type", "application/json");
          res.end(JSON.stringify(data));
        });
      }

      if (method === "POST") {
        addPost(req).then(() => {
          res.statusCode = 201; // Created
          res.end();
        });
      }
      break;
    }
    case "/files": {
      if (method === "POST") {
        saveFile(req);
        res.statusCode = 201; // Created
        res.end();
      }
      break;
    }
    default: {
      res.statusCode = 404; // Not found
      res.end();
    }
  }
}

// Save file
function saveFile(req: IncomingMessage) {
  const form = new mp.Form();
  form.parse(req);

  const fields = new Map<string, string>();
  let filename: string;
  let photo: Buffer;

  form.on("part", async (part: mp.Part) => {
    const data = await getDataFromStream(part);

    if (part.filename) {
      filename = part.filename;
      photo = data;
    } else {
      fields.set(part.name, data.toString());
    }

    part.resume();
  });

  form.on("close", async () => {
    const path = `./${fields.get("firstName")}-${fields.get(
      "lastName"
    )}-${filename}`;

    fs.writeFile(path, photo, () => {
      console.log("File uploaded!");
    });
  });
}

// Get posts
function getPosts() {
  return new Promise((resolve) => resolve(posts));
}

// Add post
function addPost(req: IncomingMessage): Promise<void> {
  return new Promise(async (resolve) => {
    const data = await getDataFromStream(req);
    const post = JSON.parse(data.toString());

    posts.push(post);

    resolve();
  });
}

// Helpers
function getDataFromStream(stream: Readable): Promise<Buffer> {
  return new Promise((resolve) => {
    const chunks: any[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));

    stream.on("end", () => {
      const result = Buffer.concat(chunks);
      resolve(result);
    });
  });
}
