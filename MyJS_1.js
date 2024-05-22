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

    LogDivider: (num) => {
      const [isPreRequest, isStart] = num.toString(2).padStart(2, '0');
      const dividerChar = isPreRequest === '0' ? '=' : '-';
      const scriptType = isPreRequest === '0' ? 'Pre-request Script' : 'Tests';
      const scriptState = isStart === '0' ? '開始' : '結束';
      const levels = {
        0: "collection",
        1: "folder",
        2: "request"
      };
      const level = levels[num];
      console.log(`${dividerChar.repeat(120)} [${level}]_${scriptType} ${scriptState}`);
    },
  };
};
