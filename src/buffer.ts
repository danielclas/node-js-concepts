import { StringDecoder } from "string_decoder";
import * as fs from "fs";

export default function buffer() {
  const buffer = Buffer.alloc(5); // Size of buffer in octates (8-bit bytes)
  console.log("1- Log empty array of bytes", buffer); // 1

  // Assing maximum value for an octate at 1st position
  buffer[0] = 255;
  console.log("2- buffer[0] = 255: ", buffer[0]); //2

  // When assigning a number > 255, number gets divided by 256 and the remainder is stored
  buffer[1] = 256;
  buffer[2] = 257;
  console.log("3- buffer[1] = 256: ", buffer[1]); // 3
  console.log("4- buffer[2] = 257: ", buffer[2]); // 4

  // String buffer
  const stringBuffer = Buffer.from("Hello world");

  // By default, buffers use 'utf-8' encoding
  console.log("5- String buffer: ", stringBuffer.toString()); // 5

  // Some characters, like the 'world' emoji, take more
  // than just one octate/byte
  const bufferArray = [
    Buffer.from("Hello "),
    Buffer.from([0b11110000, 0b10011111]), // '0b' is how you write a binary number in JS
    Buffer.from([0b10001100, 0b10001110]),
    Buffer.from(" world!"),
  ];

  // If we created a string reducing the array above,
  // we wouldn't get our 'world' emoji because the character
  // is spread between different chunks. This could happen when interpreting
  // a big text file and parsing it chunks
  const result = bufferArray.reduce((prev, val) => prev + val.toString(), "");

  console.log(
    "6- Reducing buffer array with .toString() + concatenation: ",
    result
  ); // 6

  // To solve this we can use a string decoder,
  // which provides an API for decoding Buffer objects
  // into strings while preserving multi-byte characters
  const decoder = new StringDecoder("utf-8");

  // The StringDecoder ensures that the decoded string does not contain
  // any incomplete multibyte characters by holding the incomplete character
  // in an internal buffer until the next call to the  decoder.write().
  const decodedResult = bufferArray.reduce(
    (prev, val) => prev + decoder.write(val),
    ""
  );
  console.log("7- Reducing buffer array with string decoder: ", decodedResult); // 7

  // Whean reading a file, if we do not specify an encoding
  // the content we receive from 'readFile' (which reads the whole file at once)
  // is of type Bufer
  fs.readFile("./test.txt", (err, data) => {
    console.log("8- File content is of type buffer: ", data instanceof Buffer); // 8
  });
}
