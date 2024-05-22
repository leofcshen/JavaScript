MyJS = (postman) => {
  const pm = postman;

  return {
    sendRequest: (req) => {
      return new Promise((resolve, reject) => {
        pm.sendRequest(req, (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
      });
    },

    logPreTest: async (type, action) => {
      const emojiMapping = {
        'Request': '😀',
        'Folder': '📁',
        'Collection': '📦',
      };

      const emojiType = emojiMapping[type] || '';
      const emojiStart = '🟢';
      const emojiEnd = '🔴';
      const layerNamePad = 20;
      const layer = emojiType + " [" + pm.info.requestName.padEnd(layerNamePad, " ") + "]";
      const progress = `${layer} => ${pm.info.eventName.padEnd(10, " ")}`;

      console.log(`${progress} ${emojiStart} ${emojiType}`);

      // 有傳入 function 的話執行
      if (action && typeof action === 'function') await action();

      console.log(`${progress} ${emojiEnd} ${emojiType}`);
    },
  };
};
