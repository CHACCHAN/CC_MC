// ビルドの基本ソース
const { messageEmbed } = require('../EmbedCreator/messageEmbed');

module.exports = {
    build: class {
        constructor(msg, options={}) {
            this.msg = msg;
            this.setColor = options?.setColor || null;
            this.setTitle = options?.setTitle || null;
            this.setDescription = options?.setDescription || null;
        }

        // embed形式で送信までする
        async isEmbed() {
            const embed = new messageEmbed(this.msg, {
                setColor: this.setColor,
                setTitle: this.setTitle,
                setDescription: this.setDescription,
            });

            await embed.send();
        }

        // reply形式で送信までする
        async isReply() {
            await this.msg.reply(`${this.setTitle}: ${this.setDescription}`);
        }
    }
}