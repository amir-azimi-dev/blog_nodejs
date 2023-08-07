const { v4: uuidv4 } = require("uuid");
const path = require("path");


exports.getFileInformation = req => {
    if (req.files) {
        const newFileExt = path.extname(req.files.thumbnail.name);
        const newFileName = uuidv4() + newFileExt;

        return { newFileName, newFileExt };
    };

    const newFileExt = null;
    const newFileName = null;
    return { newFileName, newFileExt };
};

exports.upload = (req, res, newFileName) => {
    if (req.files?.thumbnail) {
        let flag = 1;
        const fileNewPath = path.join(process.cwd(), "public", "upload", "thumbnails", newFileName);

        req.files.thumbnail.mv(fileNewPath, (err => {
            console.log(err);
            flag = 0;
        }));
        return flag;
    };
};

exports.hasTheRightExt = (nameExt, nullable = false) => {
    if (nullable && !nameExt) {
        return true;
    };
    const validMimeTypes = [".jpeg", ".jpg", ".png", ".svg"];
    return validMimeTypes.includes(nameExt);
};