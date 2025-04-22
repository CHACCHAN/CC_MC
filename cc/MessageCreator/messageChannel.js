// 特定のチャンネルのメッセージは通過させるモジュール
const { client } = require('../System/system');

module.exports = {
    // 受信したメッセージからチャンネルを取得し、処理を行う
    messageChannel: (msg, callbacks={}) => {
        try {
            callbacks.run?.(msg.content);

        } catch (error) {
            callbacks.error?.();
        }
    }
};