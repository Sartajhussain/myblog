import multer from "multer";

const storage = multer.memoryStorage();
export const singleUploads = multer({ storage }).single("file");


