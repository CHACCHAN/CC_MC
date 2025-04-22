const { client, events, global, messageEmbed, buildErrors } = require('../cc/cc');
const fs = require('fs');
const dbPath = 'cc/System/log_channels.json';
const logFile = process.env.LOG_FILE;

module.exports = (params) => {
    let cache = null;
    let lastLine = '';
    let isProcessing = false;
    let submitChannels = {};

    // チャンネル設定ファイルの更新を監視
    const watchDb = fs.watch(dbPath, (eventType) => {
        if (eventType === 'change') {
            try {
                submitChannels = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            } catch (err) {
                console.error('設定ファイルの読み込みエラー:', err);
            }
        }
    });

    // 初期読み込み
    try {
        submitChannels = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (err) {
        console.error('初期設定ファイル読み込みエラー:', err);
        watchDb.close();
        return;
    }

    // 0.5秒おきに監視
    const interval = setInterval(async () => {
        if (isProcessing) return;
        isProcessing = true;

        try {
            // ログファイルを読み込み
            const data = await fs.promises.readFile(logFile, 'utf8');
            const lines = data.split(/\r?\n/).filter(line => line.trim());
            const newLastLine = lines[lines.length - 1] || '';

            if (cache !== newLastLine && newLastLine) {
                lastLine = newLastLine;
                cache = newLastLine;

                // 設定済みのチャンネルに送信
                for (const [guildId, channelIds] of Object.entries(submitChannels)) {
                    for (const channelId of channelIds) {
                        try {
                            const channel = await client.active.channels.fetch(channelId);
                            if (channel?.isTextBased()) {
                                await channel.send({ content: lastLine });
                            }
                        } catch (channelError) {
                            console.error(`チャンネル送信エラー [${channelId}]:`, channelError);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('ログ監視エラー:', err);
        } finally {
            isProcessing = false;
        }
    }, 500);

    // クリーンアップ用
    return () => {
        clearInterval(interval);
        watchDb.close();
    };
};