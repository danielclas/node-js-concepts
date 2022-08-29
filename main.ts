import touch from "./src/utils/touch";
import cat from "./src/utils/cat";
import events from "./src/events";
import buffer from "./src/buffer";
import streams from "./src/streams";
import http from "./src/http";

console.clear();

// Create --help
const command = process.argv[2]; // First argument is command
const args = process.argv.splice(3); // > second argument is ...args
const map = new Map<string, any>();

const cb = (fn: any) => map.set(fn.name, fn);
[cat, touch, events, buffer, streams, http].forEach(cb);

const fn = map.get(command);
if (typeof fn === "function") {
  fn(...args);
} else console.log("Command missing or not found");
