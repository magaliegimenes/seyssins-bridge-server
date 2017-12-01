const fs = require('fs');
const path = require('path');
const Dropbox = require('dropbox');

module.exports.uploadPicture = (model, picture) => {
  return Promise.resolve()
    .then(()=> {
      const filetypes = /jpeg|jpg|png/;
      if (!filetypes.test(file.mimetype) || !filetypes.test(path.extname(file.originalname).toLowerCase())) {
        throw {code: 403, message: 'File extension is not the one waited (jpg, jpeg and png only)'};
      }
      return fileToBufferData(picture)
    })
    .then(buffer => {
      model.picture = {
        contentType: picture.mimetype,
        data: buffer
      };
      return deleteTmpFile(picture)
    })
    .then(() => model);
};

module.exports.uploadFile = (model, file) => {
  const dbx = new Dropbox({accessToken: process.env.DROPBOX_TOKEN});
  return Promise.resolve()
    .then(()=> {
      const filetypes = /pdf/;
      if (!filetypes.test(file.mimetype) || !filetypes.test(path.extname(file.originalname).toLowerCase())) {
        throw {code: 403, message: 'File extension is not the one waited (pdf only)'};
      }
      if (model.dropboxPath) {
        return dbx.filesDelete({path: model.dropboxPath})
          .catch((err) => console.log('file deletion has failed', err));
      }
    })
    .then(() => {
      const buffer = fs.readFileSync(file.path);
      const dropboxFile = {
        contents: buffer,
        path: `/${file.originalname}`,
        mode: {'.tag': 'add'},
        autorename: true,
        mute: true
      };
      return dbx.filesUpload(dropboxFile)
    })
    .then((fileUploaded) => {
      model.dropboxPath = fileUploaded.path_lower;
      return deleteTmpFile(file.path);
    })
    .then(() => model);
};

module.exports.getFile = (model) => {
  const dbx = new Dropbox({accessToken: process.env.DROPBOX_TOKEN});
  return dbx.filesGetTemporaryLink({path: model.dropboxPath})
    .then(({link}) => {
      return {url: link};
    });
};

module.exports.deleteFile = (dropboxPath) => {
  const dbx = new Dropbox({accessToken: process.env.DROPBOX_TOKEN});
  return dbx.filesDelete({path: dropboxPath})
};

function fileToBufferData(file) {
  return new Promise((resolve) => {
    const encImg = fs.readFileSync(file.path).toString('base64');
    resolve(Buffer(encImg, 'base64'))
  });
}

function deleteTmpFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      }
      console.log('successfully deleted ' + filePath);
      resolve();
    });
  })
}
