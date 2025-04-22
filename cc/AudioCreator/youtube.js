// YouTubeから音声を再生する
const { audioPlayer } = require('./audioPlayer');
const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');

module.exports = {
    youtube: class extends audioPlayer {
        constructor(msg) {
            super(msg);
        }

        // YouTubeから音声をダウンロード
        download(url) {
            try {
                const stream = ytdl(url, {
                    quality: 'highestaudio', 
                    filter: 'audioonly',
                    highWaterMark: 1 << 25,
                    liveBuffer: 1 << 25,
                    dlChunkSize: 1024 * 1024,
                    opusEncoded: true,
                });

                return stream;

            } catch (error) {
                throw new Error(error);
            }
        }

        // YouTubeから検索してURLを取得
        async search(query) {
            try {
                const result = await yts(query);
                
                return result.all;

            } catch (error) {
                throw new Error(error);
            }
        }
    }
};