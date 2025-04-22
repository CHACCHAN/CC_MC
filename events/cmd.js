// コマンド送信コマンド
const { config, global, messageEmbed, buildErrors } = require('../cc/cc');
const { Rcon } = require('rcon-client');
const fs = require('fs');
const setValues = require('./cmd.json');
const { parseArgs } = require('util');
const { error } = require('console');
const dbPath = 'cc/System/log_channels.json';

var rcon = null;

module.exports = (params) => {
    // 登録済みのチャンネル以外なら終了
    let data = {};
    try {
        const rawData = fs.readFileSync(dbPath, 'utf8');
        data = JSON.parse(rawData);

    } catch (error) {
        new buildErrors(params.msg, { detail: global.error.unknown }).isEmbed();
    }

    if (!data[params.msg.guild.id] || !data[params.msg.guild.id].includes(params.msg.channel.id)) return;

    // 禁止コマンドの場合無視
    for(const ban of setValues.bans) {
        if(ban === params.msg.content) return;
    }

    // embed定型文
    const sendCompleteEmbed = () => {
        new messageEmbed(params.msg, {
            setAuthor: {
                name: params.msg.author.globalName,
                iconURL: params.msg.author.displayAvatarURL(),
            },
            setTitle: setValues.title,
            setDescription: `/${params.msg.content}`,
            setTimestamp: new Date(),
        }).send();
    }

    // サーバーにコマンドを送信する
    new Promise(async (resolve, rejects) => {
        try {
            rcon = await Rcon.connect({
                host: process.env.RCON_HOST || 'localhost',
                port: process.env.RCON_PORT || 25575,
                password: process.env.RCON_PASSWORD || null
            });

            resolve(rcon);

        } catch (error) {
            rejects(error);
        }
    }).then(async (rcon) => {
        const response = await rcon.send(params.msg.content);

        sendCompleteEmbed();

        new messageEmbed(params.msg, {
            setAuthor: {
                name: params.msg.author.globalName,
                iconURL: params.msg.author.displayAvatarURL(),
            },
            setTitle: setValues.serverMessage,
            setDescription: response,
            setTimestamp: new Date(),
        }).send();

    }).catch((error) => {
        if (error.message.includes('Timeout')) {
            sendCompleteEmbed();
            
        } else {
            new buildErrors(params.msg, { detail: global.error.unknown }).isEmbed();
        }

    }).finally(() => {
        if(rcon) rcon.end();
    });
};