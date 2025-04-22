// VOICEVOXから音源を取得する
const { config } = require('../System/system');
const { audioPlayer } = require('./audioPlayer');
const axios = require('axios');
const { Readable } = require('stream');

module.exports = {
    voicevox: class extends audioPlayer {
        constructor(msg) {
            super(msg);
        }

        // VoiceVox(アプリAPI)にリクエストして音声を取得
        async download(query, options={}) {
            try {
                // リクエストクライアント準備
                const rpc = axios.create({
                    baseURL: config.voicevox.api,
                    proxy: false,
                });
                // 話者の選択クエリを生成
                if(query.length > config.voicevox.maxRead) {
                    query = `${query.slice(0, config.voicevox.maxRead)}${config.voicevox.endRead}`; // 省略が必要だったら
                }
                
                const audioQuery = await rpc.post(`audio_query?text=${query}&speaker=${options?.speaker || 3}`, {
                    headers: { 'accept' : 'application/json' },
                });
                // クエリを使用してバイナリデータをダウンロード
                const synthesis = await rpc.post(`synthesis?speaker=${options?.speaker || 3}`, JSON.stringify(audioQuery.data), {
                    responseType: 'arraybuffer',
                    headers: {
                        'accept' : 'audio/wav',
                        'Content-Type' : 'application/json'
                    }
                });
                // ストリームデータに格納
                const stream = Readable.from(synthesis.data);

                return stream;

            } catch(error) {
                throw new Error(error);
            }
        }

        // VoiceVox話者一覧を取得
        async speakers() {
            try {
                // リクエストクライアント準備
                const rpc = axios.create({
                    baseURL: config.voicevox.api,
                    proxy: false,
                });
                // 一覧データを取得
                const response = await rpc.get('speakers', {
                    headers:{ 'accept' : 'application/json' },
                });

                return response.data;

            } catch(error) {
                throw new Error(error);
            }
        }
    }
};