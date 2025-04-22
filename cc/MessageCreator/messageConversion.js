// 文字列を変換する関数を定義
const { config, client } = require('../System/system');

module.exports = {
    // 頭文字を除いたメッセージに変換
    replacePrefix: (inPrefixContent) => {
        const regex = new RegExp(`^(?<prefix>${config.prefix})(?<command>\\w+)\\s*(?<parameter>.*)?$`);
        const match = inPrefixContent.match(regex);
    
        if (match && match.groups) {
            return {
                prefix: match.groups.prefix,
                command: match.groups.command,
                parameter: match.groups.parameter || null
            };
            
        } else {
            return null;
        }
    }
};