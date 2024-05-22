MyJS = (pm) => {
  const MyPM = pm;

  return {
    sendRequest: (req) => {
      return new Promise((resolve, reject) => {
        MyPM.sendRequest(req, (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
      });
    },

    logPreTest: async (type, name, action) => {
      const emojiMapping = {
        'Request': '😀',
        'Folder': '📁',
        'Collection': '📦',
      };

      const emojiType = emojiMapping[type] || '';
      const emojiStart = '🟢';
      const emojiEnd = '🔴';
      const layerNamePad = 20;
      const layer = emojiType + " " + name.padEnd(layerNamePad, " ");
      const progress = `${layer} => ${MyPM.info.eventName.padEnd(10, " ")}`;

      console.log(`${progress} ${emojiStart}`);

      // 有傳入 function 的話執行
      if (action && typeof action === 'function') await action();

      console.log(`${progress} ${emojiEnd}`);
    },
  };
};
