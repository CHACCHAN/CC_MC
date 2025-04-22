// Embedのメッセージ処理を行うモジュール
const { EmbedBuilder } = require('discord.js');

module.exports = {
    messageEmbed: class {
        // オプションを適用
        constructor(msg, options={}) {
            try {
                this.msg = msg;
                this.setColor = options?.setColor || null;
                this.setTitle = options?.setTitle || null;
                this.setURL = options?.setURL || null;
                this.setDescription = options?.setDescription || null;
                this.setFooter = options?.setFooter || null;
                this.setThumbnail = options?.setThumbnail || null;
                this.setImage = options?.setImage || null;
                this.setAuthor = options?.setAuthor || null;
                this.setTimestamp = options?.setTimestamp || null;
                this.addFields = options?.addFields || [];
                this.buildEmbed = {};

            } catch (error) {
                throw error instanceof Error ? error : new Error(error);
            }
        }

        // Embedを送信
        async send() {
            try {
                const message = await this.msg.channel.send({ embeds: [this.build] });
                return message;

            } catch (error) {
                throw error instanceof Error ? error : new Error(error);
            }
        }

        // Embedデータを出力
        get build() {
            try {
                this.buildEmbed = new EmbedBuilder();

                if (this.setColor) this.buildEmbed.setColor(this.setColor);
                if (this.setTitle) this.buildEmbed.setTitle(this.setTitle);
                if (this.setURL) this.buildEmbed.setURL(this.setURL);
                if (this.setDescription) this.buildEmbed.setDescription(this.setDescription);
                if (this.setFooter) this.buildEmbed.setFooter(this.setFooter);
                if (this.setThumbnail) this.buildEmbed.setThumbnail(this.setThumbnail);
                if (this.setImage) this.buildEmbed.setImage(this.setImage);
                if (this.setAuthor) this.buildEmbed.setAuthor(this.setAuthor);
                if (this.setTimestamp) this.buildEmbed.setTimestamp(this.setTimestamp);
                if (this.addFields && this.addFields.length > 0) this.buildEmbed.addFields(this.addFields);
    
                return this.buildEmbed;

            } catch (error) {
                throw new Error(error);
            }
        }
    }
};