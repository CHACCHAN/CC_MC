// クライアントセットアップ
const { Client, GatewayIntentBits, IntentsBitField } = require('discord.js');
const system = require('./system');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config();

module.exports = {
    // セットアップ関数
    setup: (config={}) => {
        try {
            const eventsPath = path.join(__dirname, '../../events'); // イベントフォルダのパス
            const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js')); // イベントフォルダのJSファイルを取得
            const scriptsPath = path.join(__dirname, '../../scripts'); // スクリプトフォルダのパス
            const scriptFiles = fs.readdirSync(scriptsPath).filter(file => file.endsWith('.js')); // スクリプトフォルダのJSファイルを取得

            // 環境変数の用意
            system.config.prefix = config?.prefix || '!'; // 頭文字を設定
            system.config.voicevox.api = config?.voicevox?.api || ''; // VOICEVOXAPIを設定
            system.config.voicevox.maxRead = config?.voicevox?.maxRead || 0; // VOICEVOX読み上げ最大値を設定
            system.config.voicevox.endRead = config?.voicevox?.endRead || ''; // VOICEVOX省略部の読み上げ文章を設定

            system.client.active = new Client({ intents: new IntentsBitField(Object.values(GatewayIntentBits)) }); // クライアントを生成
            system.client.config = system.config; // クライアントに設定を追加
            system.client.ai = []; // AIの会話履歴保管用

            // イベントの読み込み
            for(const file of eventFiles) {
                const filePath = path.join(eventsPath, file);
                const event = require(filePath);
                
                system.events[file.replace('.js', '')] = event;
            }

            // スクリプトの読み込み
            for(const file of scriptFiles) {
                const filePath = path.join(scriptsPath, file);
                const script = require(filePath);
                
                system.scripts[file.replace('.js', '')] = script;
            }

            return system.client.active;

        } catch(error) {
            throw new Error(error);
        }
    }
};