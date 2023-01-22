const path = require('path');

export const getImage = async (req, res, next) => {
  const options = {
    root: path.join(__dirname, '/../../images'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
      'Content-Security-Policy': "default-src"
    }
  };

  const fileName = req.params.name
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
};
