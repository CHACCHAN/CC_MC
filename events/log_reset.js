// ログチャンネル登録解除コマンド
const { client, global, buildErrors, buildSuccess } = require('../cc/cc');
const setValues = require('./log_reset.json');
const fs = require('fs');
const dbPath = 'cc/System/log_channels.json';

module.exports = (params) => {
    new Promise((resolve, reject) => {
        try {
            let data = {};

            // 既存のJSONデータを読み込む
            if (fs.existsSync(dbPath)) {
                const rawData = fs.readFileSync(dbPath, 'utf8');
                try {
                    data = JSON.parse(rawData);

                    // **データがオブジェクトでない場合は修正**
                    if (typeof data !== 'object' || data === null) {
                        console.warn("データ形式が不正です。修正します。");
                        data = {};
                    }
                } catch (error) {
                    throw new Error("JSONの解析に失敗しました: " + error.message);
                }
            }

            // **サーバーIDが存在しない場合**
            if (!data[params.msg.guild.id]) {
                new buildErrors(params.msg, { detail: setValues.noEntry }).isEmbed();
                return;
            }

            // **チャンネルIDが登録されていない場合**
            if (!data[params.msg.guild.id].includes(params.msg.channel.id)) {
                new buildErrors(params.msg, { detail: setValues.noEntry }).isEmbed();
                return;
            }

            // **チャンネルIDを削除**
            data[params.msg.guild.id] = data[params.msg.guild.id].filter(id => id !== params.msg.channel.id);

            // **チャンネルリストが空なら、サーバーIDも削除**
            if (data[params.msg.guild.id].length === 0) {
                delete data[params.msg.guild.id];
            }

            // **JSONデータをファイルに保存**
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');

            resolve();

        } catch (error) {
            reject(error);
        }
    })
    .then(() => {
        new buildSuccess(params.msg, { detail: setValues.removed }).isEmbed();
    })
    .catch(() => {
        new buildErrors(params.msg, { detail: global.error.unknown }).isEmbed();
    });
};
