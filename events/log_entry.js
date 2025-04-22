// ヘルプコマンド
const { buildErrors, buildSuccess } = require('../cc/cc');
const setValues = require('./log_entry.json');
const dbPath = 'cc/System/log_channels.json';
const fs = require('fs');

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
                    throw new Error(error);
                }
            }

            // **サーバーIDごとの配列を作成（なければ新規作成）**
            if (!data[params.msg.guild.id]) {
                data[params.msg.guild.id] = [];
            }

            // **すでに存在するチャンネルIDなら追加しない**
            if (data[params.msg.guild.id].includes(params.msg.channel.id)) {
                new buildErrors(params.msg, { detail: setValues.already }).isEmbed();
                return;
            }

            // **チャンネルIDを追加**
            data[params.msg.guild.id].push(params.msg.channel.id);

            // **JSONデータをファイルに保存**
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');

            resolve(data);
            
        } catch (error) {
            reject(error);
        }
    })
    .then(() => {
        new buildSuccess(params.msg, { detail: setValues.completed }).isEmbed();
    })
    .catch(() => {
        new buildErrors(params.msg, { detail: global.error.unknown }).isEmbed();
    });
};