import dataUriParser from "datauri/parser.js";
const parser = new dataUriParser();
import path from "path";

export const getDataUri = (file) => {
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};
