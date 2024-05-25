MyJS = (postman) => {
  const jsName = 'MyJS';
  /** postman 的 pm */
  const pm = postman;

  const getErrorMessage = (message) => {
    return jsName + " 方法出錯" + message;
  };

  const emojiMapping = {
    'Request':    '📝',
    'Folder':     '🗂️',
    'Collection': '📦',
  };

  /** 取的 Layer 對應的 Emoji */
  const getLayerEmoji = (layer) =>
    emojiMapping[layer] || '';

  /**
   * postamn log pre-request 和 test 區塊
   * @param {'Request'|'Folder'|'Collection'} layer
   * @param {Function} action - 要執行的動作
   * @param {string} description - 區塊功能描述
   */
  const log = async (layer, action, description) => {
    // #region 檢查參數
    // #region 檢查 layer 值在限定的範圍內
    const validLayers = ['Request', 'Folder', 'Collection'];

    if (!validLayers.includes(layer))
      throw new Error(getErrorMessage(`方法名稱 log， 參數 layer = ${layer}。有效的值為 'Request', 'Folder', 'Collection'.`));
    // #endregion

    // 沒 description 值的話，跳出不 log 區塊
    if (description === '')
      return;

    if (typeof action !== 'function')
      throw new Error(`參數 action 型別必須是 function`);
    // #endregion

    const emojiLayer = getLayerEmoji(layer);
    const emojiStart = '🟢';
    const emojiEnd = '🔴';
    const layerNamePad = 20;
    const layerM = emojiLayer + ' [' + pm.info.requestName.padEnd(layerNamePad, ' ') + ']';
    const progress = `${layerM} => ${pm.info.eventName.padEnd(10, ' ')}`;

    console.log(`${progress} ${emojiStart} ${emojiLayer} ${description}_開始`);

    try {
      await action();

      if(layer === 'Collection' && pm.info.eventName === 'test') {
        console.log("////");
      }
    } catch (err) {
      console.error(err);
    }

    console.log(`${progress} ${emojiEnd} ${emojiLayer} ${description}_結束`);
  };

  /**
   * 檢查 postman 變數並返回其值
   * @param {Function} action - 返回變數值的函數。 () => pm.globals.get('key')
   * @param {boolean} [isBool=false] - 指示變數是否應該解析為布爾值，0 => false， 1 => false。
   * @returns {*} 變數的值。
   * @throws {Error} 如果變數未定義，則拋出錯誤。
   */
  const getVar = (action, isBool = false) => {
    var value = action();
    if (value === undefined) throw new Error(action + '變數尚未設定');

    if(isBool) {
      if (value === '0') return false;
      if (value === '1') return true;
    }

    return value;
  };

  const sendRequest = (req) => {
    return new Promise((resolve, reject) => {
      pm.sendRequest(req, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  };

  /**
   * 取得時間 yyyy-MM-dd HH:mm:ss
   * @param {number} [timestamp=Date.now()] - 時間戳，默認為當前時間。
   * @returns {string} 格式化後的日期時間字符串。
   */
  const formatDate = (timestamp = Date.now()) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };


  const getTestName = (layer, layerName, testDesc) => getLayerEmoji(layer) + layerName + ` > ${testDesc}`;

  return {
    sendRequest,
    getLayerEmoji,
    log,
    getVar,
    formatDate,
    getTestName,
  };
};
