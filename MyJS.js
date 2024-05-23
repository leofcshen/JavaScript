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

    logPreTest: async (type, action, description) => {
      const emojiMapping = {
        'Request':    '📝',
        'Folder':     '🗂️',
        'Collection': '📦',
      };

      const emojiType = emojiMapping[type] || '';
      const emojiStart = '🟢';
      const emojiEnd = '🔴';
      const layerNamePad = 20;
      const layer = emojiType + " [" + pm.info.requestName.padEnd(layerNamePad, " ") + "]";
      const progress = `${layer} => ${pm.info.eventName.padEnd(10, " ")}`;

      console.log(`${progress} ${emojiStart} ${emojiType} ${description}_開始`);

      // 有傳入 function 的話執行
      if (action && typeof action === 'function') await action();

      console.log(`${progress} ${emojiEnd} ${emojiType} ${description}_結束`);
    },

    // 依類型取得變數
    // todo const request = myScript.getV("collection", "request_Twitch_oauth2/token"); 有錯誤
    getV: (type, key, isBool = false) => {
      const typeString = {
        "globals": "pm.globals",
        "collection": "pm.collectionVariables",
        "environment": "pm.environment",
      };

      const typeName = typeString[type] || JSON.stringify(type);

      if(!pm[type].has(key)) {
        throw new Error(`${typeName} 尚未設定變數 ${key}`);
      }

      let value = pm[type].get(key)

      if (typeof value === 'string') {
        value = value.trim();
      }

      if (isBool) {
        if (value === '0') return false;
        if (value === '1') return true;
      }

      return value;
    },

    checkV: (action) => {
      var value = action();
      console.log(value);
      if (value === undefined) throw new Error("變數尚未設定");
      return value;
    }
  };
};
