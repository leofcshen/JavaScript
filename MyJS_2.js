MyJS = {
  logD: () => {
    console.log(pm.info.requestName);
  },

  sendRequest: (req, pm) => {
    return new Promise((resolve, reject) => {
      pm.sendRequest(req, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  },
};

const emojiMapping = {
  'Request':    '📝',
  'Folder':     '🗂️',
  'Collection': '📦',
};

function getLayerEmoji(layer) {
  return emojiMapping[layer] || '';
};

function logE() {
  console.log(pm.info.requestName);
};
