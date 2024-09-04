const FormData = require("form-data");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const ax = axios.create();
ax.defaults.headers["x-dataupload-key"] = process.env.GIORDANO_FS_API_KEY;

const uploadFile = async (file, dir, subdir) => {
  try {
    let fd = new FormData();
    fd.append("file", file.file.data, file.file.name);
    let res = await ax.post(
      `${process.env.GIORDANO_FS_URL}/api/upload/single`,
      fd,
      {
        headers: fd.getHeaders(),
        params: {
          dir,
          subdir,
        },
      }
    );
    return res.data.filename;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const uploadFiles = async (files, dir, subdir) => {
  try {
    let fd = new FormData();
    files = [files].flat(1);
    
    files.forEach((item) => {
      fd.append("file", item.data, item.name);
    });
    let res = await ax.post(
      `${process.env.GIORDANO_FS_URL}/api/upload/bulk`,
      fd,
      {
        headers: fd.getHeaders(),
        params: {
          dir,
          subdir,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const deleteFile = async (path) => {
  try {
    let res = await ax.delete(`${process.env.GIORDANO_FS_URL}/api/image`, {
      params: { path },
    });
    return res.data;
  } catch (err) {
    return false;
  }
};

module.exports = { uploadFile, uploadFiles, deleteFile };
