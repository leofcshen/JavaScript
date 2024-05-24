const MyJS = (postman) => {
  /** postman 的 pm */
  const pm = postman;

  const emojiMapping = {
    'Request':    '📝',
    'Folder':     '🗂️',
    'Collection': '📦',
  };

  /** 取的 Layer 對應的 Emoji */
  const getLayerEmoji = (layer) =>
    emojiMapping[layer] || '';

  /** 取得 pm.test 前綴 */
  const getPostmanTestLayer = (layer, layerName) => getLayerEmoji(layer) + layerName;

  /**
   * postamn log pre-request 和 test 區塊
   * @param {'Request'|'Folder'|'Collection'} type
   * @param {Function} action - 要執行的動作
   * @param {string} description - 區塊功能描述
   */
  const logPreTest = async (type, action, description) => {
    const validTypes = ['Request', 'Folder', 'Collection'];

    // 檢查 type 值
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid type in function logPreTest: ${type}. Valid types are 'Request', 'Folder', 'Collection'.`);
    }

    // 沒 description 值的話，跳出不記錄區塊
    if (description === '') {
      return;
    }

    const emojiType = getLayerEmoji(type);
    const emojiStart = '🟢';
    const emojiEnd = '🔴';
    const layerNamePad = 20;
    const layer = emojiType + " [" + pm.info.requestName.padEnd(layerNamePad, " ") + "]";
    const progress = `${layer} => ${pm.info.eventName.padEnd(10, " ")}`;

    console.log(`${progress} ${emojiStart} ${emojiType} ${description}_開始`);

    if (typeof action === 'function') {
      await action();
    }

    console.log(`${progress} ${emojiEnd} ${emojiType} ${description}_結束`);
  };

  /**
   * 檢查 postman 變數並返回其值
   * @param {Function} action - 返回變數值的函數。 () => pm.globals.get("key")
   * @param {boolean} [isBool=false] - 指示變數是否應該解析為布爾值，0 => false， 1 => false。
   * @returns {*} 變數的值。
   * @throws {Error} 如果變數未定義，則拋出錯誤。
   */
  const getVar = (action, isBool = false) => {
    var value = action();
    if (value === undefined) throw new Error(action + "變數尚未設定");

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

  return {
    sendRequest,
    getLayerEmoji,
    getPostmanTestLayer,
    logPreTest,
    getVar,
    formatDate,
  };
};
