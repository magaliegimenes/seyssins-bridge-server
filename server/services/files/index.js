const fs = require('fs');

module.exports.uploadPicture = (model, picture) => {
  return fileToBufferData(picture)
    .then(buffer => {
      model.picture = {
        contentType: picture.mimetype,
        data: buffer
      };
      return deleteTmpFile(picture)
    })
    .then(() => model);
};

module.exports.uploadFile = (req, res) => {

};

module.exports.getFile = (req, res) => {

};

function fileToBufferData(file) {
  return new Promise((resolve, reject) => {
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
