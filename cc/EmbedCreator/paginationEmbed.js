// ページネーションを作成する
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    paginationEmbed: class {
        // オプションを適用
        constructor(msg, options={}) {
            try {
                this.pages = options?.pages || [];
                this.timeout = options?.timeout || 10000;
                this.current = 0;
                this.msg = msg;
                this.buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev' + this.msg.id)
                            .setLabel(options.buttonLabels[0] || '⏪')
                            .setStyle(ButtonStyle[options.buttonStyle || 'Primary'])
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('next' + this.msg.id)
                            .setLabel(options.buttonLabels[1] || '⏩')
                            .setStyle(ButtonStyle[options.buttonStyle || 'Primary'])
                    );
    
            } catch (error) {
                throw new Error(error);
            }
        }

        // ページネーションを送信
        async send() {
            const msgContent = await this.msg.channel.send({
                embeds: [this.pages[this.current]],
                components: [this.buttons],
            });

            const filter = (interaction) => {
                return interaction.isButton() && interaction.message.id === msgContent.id;
            };
            
            // インタラクションのリスナー
            const collector = this.msg.channel.createMessageComponentCollector({ filter, time: this.timeout });

            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'prev' + this.msg.id) {
                    this.current = Math.max(this.current - 1, 0);
                } else if (interaction.customId === 'next' + this.msg.id) {
                    this.current = Math.min(this.current + 1, this.pages.length - 1);
                }
    
                // ボタンの状態を更新
                this.buttons.components[0].setDisabled(this.current === 0);
                this.buttons.components[1].setDisabled(this.current === this.pages.length - 1);
    
                // メッセージを編集
                await interaction.update({
                    embeds: [this.pages[this.current]],
                    components: [this.buttons],
                });
            });
    
            collector.on('end', () => {
                // 終了時にボタンを無効化
                this.buttons.components.forEach(button => button.setDisabled(true));
                msgContent.edit({ components: [this.buttons] }).catch(console.error);
            });
        }
    },
}