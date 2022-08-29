import { IncomingMessage, request, RequestOptions } from "http";

export default function http() {
  const options = {
    host: "jsonplaceholder.typicode.com",
    path: "/todos/1",
    method: "GET",
  };

  const options2 = {
    host: "httpbin.org",
    path: "/post",
    method: "POST",
  };

  makeRequest(options)
    .then((value) => console.log("Response data: ", value))
    .catch((error) => console.log("Error handled: ", error));

  makeRequest(options2, { username: "test", password: "Dani.123" })
    .then((value) => console.log("Response data: ", value))
    .catch((error) => console.log("Error handled: ", error));

  function makeRequest(options: RequestOptions, body?: any) {
    return new Promise((resolve, reject) => {
      function errorHandler(errorMessage: string = "Error") {
        reject(errorMessage);
      }

      const req = request(options, (res: IncomingMessage) => {
        function endHandler() {
          const data = Buffer.concat(chunks).toString();
          resolve(JSON.parse(data));
        }

        res.on("error", errorHandler);

        if (res.statusCode && res.statusCode >= 300)
          errorHandler(res.statusMessage);

        const chunks: any[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", endHandler);
      });

      req.on("error", errorHandler);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }
}
