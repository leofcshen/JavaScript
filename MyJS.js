MyJS = {
  LogDivider: (num) => {
    const [isPreRequest, isStart] = num.toString(2).padStart(2, '0');
    const dividerChar = isPreRequest === '0' ? '=' : '-';
    const scriptType = isPreRequest === '0' ? 'Pre-request Script' : 'Tests';
    const scriptState = isStart === '0' ? '開始' : '結束';
    const level = pm.globals.get("script_level")
    console.log(`${dividerChar.repeat(120)} [${level}]_${scriptType} ${scriptState}`);
  },

  SetEnvironmentLevel: (num) => {
    const levels = {
      0: "collection",
      1: "folder",
      2: "request"
    };

    pm.globals.set("script_level", levels[num]);
  },

  Exit: () => pm.globals.unset("script_level"),

  GetVariablesAndCheck: (layer, key) => {
    const layerMapping = {
      [VariablesLayer.Globals]: pm.globals,
      [VariablesLayer.CollectionVariables]: pm.collectionVariables,
      [VariablesLayer.Environment]: pm.environment
    };

    const valueSource = layerMapping[layer];
    if (!valueSource) {
      throw new Error(`未知的 ${layer} 層`);
    }

    let value = valueSource.get(key);

    if (typeof value === "undefined") {
      throw new Error(`${layer} 層 ${key} 尚未設定值`);
    }

    if (typeof value === "string") {
      value = value.trim();
    }

    return value;
  },

  // 依類型取得變數
  getV: (type, key, isBool = false) => {
    const typeString = {
      [pm.globals]: "pm.globals",
      [pm.collectionVariables]: "pm.collectionVariables",
      [pm.environment]: "pm.environment"
    };
    const typeName = typeString[type] || JSON.stringify(type);

    if(!type.has(key)) {
      throw new Error(`${typeName} 尚未設定變數 ${key}`);
    }

    let value = type.get(key)

    if (typeof value === 'string') {
      value = value.trim();
    }

    if (isBool) {
      if (value === '0') return false;
      if (value === '1') return true;
    }

    return value;
  },

  logPreTest: async (type, name, eventName, action) => {
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
    const progress = `${layer} => ${pm.info.eventName.padEnd(10, " ")}`;

    console.log(`${progress} ${emojiStart}`);

    // 有傳入 function 的話執行
    if (action && typeof action === 'function') await action();

    console.log(`${progress} ${emojiEnd}`);
  },

  GetArrayObj: (data) => {
    if (!(Array.isArray(data))) {
      throw new Error("data 不是 Array");
    }

    let keys = data[0];
    var arrayObj = data.slice(1).map(item => {
      let obj = {};

      for (let i = 0; i < item.length; i++) {
        obj[keys[i]] = item[i];
      }

      return obj;
    });

    return arrayObj;
  },

  sendRequest: async (req) => {
		console.log(pm.info.requestName);
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

function GetArrayObj(data) {
  if (!(Array.isArray(dataArray))) {
    throw new Eooro("data 不是 Array");
  }

  let keys = dataArray[0];
  var list = dataArray.slice(1).map(item => {
    let obj = {};

    for (let i = 0; i < item.length; i++) {
      obj[keys[i]] = item[i];
    }

    return obj;
  });
  return list;
};
