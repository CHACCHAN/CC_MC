// ヘルプコマンド
const { config, paginationEmbed, messageEmbed } = require('../cc/cc');
const setValues = require('./help.json');

module.exports = (params) => {
    // 6つで1ページになるように分割
    const pages = [];
    const commandNames = Object.keys(setValues.commands);
    var fieldTemp = [];

    commandNames.forEach((commandName, index) => {
        fieldTemp.push({ 
            name: `${config.prefix}${setValues.commands[commandName].usage}`, 
            value: setValues.commands[commandName].description, 
            inline: true 
        });

        // 6つ埋まったら新しくembedを作成
        if((index + 1) % 6 === 0 || index === commandNames.length - 1) {
            pages.push(new messageEmbed(params.msg, {
                setTitle: setValues.paginationTitle,
                addFields: fieldTemp,
            }).build);
            fieldTemp = [];
        }
    });

    const paginate = new paginationEmbed(params.msg, {
        timeout: 60000,
        buttonLabels: ['👈️', '👉️'],
        buttonStyle: 'Primary',
        pages: pages,
    });

    paginate.send();
};