// メッセージコマンドの処理を行うモジュール(スラッシュではない)
const { replacePrefix } = require('./messageConversion');

module.exports = {
    // 受信したメッセージからコマンドを取得し、処理を行う
    messageCommand: (msg, cmd, cmdOnlyChk=false, callbacks={}) => {
        const result = replacePrefix(msg.content);

        // コマンド形式であるか、指定コマンド通りか確認して処理を行う
        if(result && result?.command === cmd) {
            // パラメータ抜きのコマンドのみであれば処理を行う
            if(cmdOnlyChk && !result.parameter) callbacks.run?.(result);
            else if(cmdOnlyChk && result.parameter) {
                callbacks.error?.(); // パラメータを含んでいるエラー
                return;
            }

            // パラメータを含んでいるコマンドであれば処理を行う
            if(!cmdOnlyChk && result.parameter) callbacks.run?.(result);
            else if(!cmdOnlyChk && !result.parameter) {
                callbacks.error?.(); // パラメータが無いエラー
                return;
            }

            return;

        } else {
            return;
        }
    }
};