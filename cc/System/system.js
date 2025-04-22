// CCのランタイムシステム
module.exports = {
    client: {
        active: null,
        config: { /* configと同期する */ },
        audios: [/* 想定プロパティ
            {
                mode: 'youtube' or 'voicevox',
                guildId: サーバーID,
                audioPlayer: audioPlayerインスタンス
            }
        */],
        allowChannels: [/* 通常のチャットを通過しても良いチャンネル登録用 */],
        ai: [/* 想定プロパティ (最大10件まで保持)
            {
                guildId: サーバーID,
                channelId: チャンネルID,
                history: [{ role: "user", content: 会話履歴 }, ...]
            }
        */]
    },
    config: {
        prefix: '',
        voicevox: {
            api: '',
            maxRead: 0,
            endRead: '',
        }
    },
    events: {}, // コマンドスクリプト格納用
    scripts: {}, // 汎用スクリプト格納用
}