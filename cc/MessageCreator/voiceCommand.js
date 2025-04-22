// ボイス関連のメッセージコマンドの処理を行うモジュール
const { client } = require('../System/system');
const { replacePrefix } = require('./messageConversion');

module.exports = {
    // 受信したメッセージからコマンドを取得し、必要箇所の処理を行う
    voiceCommand: (msg, cmd, cmdOnlyChk=false, callbacks={}) => {
        const result = replacePrefix(msg.content);

        // 関数を定義
        const voiceFunc = () => {
            if(!msg.member.voice.channel) {
                callbacks.noVoiceChannel?.(); // ボイスチャンネルに接続していない場合
                return;
            }

            callbacks.voiceChannel?.(); // ボイスチャンネルに接続している場合

            // 受信したサーバーのプレイヤーを探す
            var audio = client.audios.find(audio => audio.guildId === msg.guild.id);
            if(!audio) {
                callbacks.noPlayer?.(); // プレイヤーが存在しない場合
                return;
            }

            callbacks.player?.(audio); // プレイヤーが存在する場合
        }

        // メインルーチン
        // コマンド形式であるか、指定コマンド通りか確認して処理を行う
        if(result && result?.command === cmd) {
            // パラメータ抜きのコマンドのみであれば処理を行う
            if(cmdOnlyChk && !result.parameter) voiceFunc();
            else if(cmdOnlyChk && result.parameter) {
                callbacks.error?.(); // パラメータを含んでいるエラー
                return;
            }

            // パラメータを含んでいるコマンドであれば処理を行う
            if(!cmdOnlyChk && result.parameter) voiceFunc();
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