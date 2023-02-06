import { unlink } from "fs";
import path from "path";

const clearImage = (filePath:string) => {
	filePath = path.join(__dirname, '..', filePath);
	unlink(filePath, (err) => {
		if (err) {
      console.log(err);
      throw err
		}
	});
};

export default clearImage;