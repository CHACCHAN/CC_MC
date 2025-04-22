const { messageChannel, messageCommand, voiceCommand, setup, config, client: c, events, scripts, global, messageEmbed, paginationEmbed, buildErrors, inOutManager, buildSuccess } = require('./cc/cc');

const client = setup({ 
    prefix: process.env.PREFIX
});

// 起動時の処理
client.on('ready', async () => {
    console.log(`${client.user.tag} でログインしました!\n停止する場合は[Ctrl+C]を押してください`);

    // ログファイルを監視
    scripts.log_surve();
});

// メッセージ受信時の処理
client.on('messageCreate', async (message) => {
    // ヘルプコマンド
    messageCommand(message, 'help', true, {
        run: (data) => {
            events.help({ msg: message });
        },
        error: () => new buildErrors(message, { detail: global.error.unknown }).isEmbed(),
    });

    // ログ通知チャンネル登録
    messageCommand(message, 'log_entry', true, {
        run: (data) => {
            events.log_entry({ msg: message });
        },
        error: () => new buildErrors(message, { detail: global.error.unknown }).isEmbed(),
    });

    // ログ通知チャンネル解除
    messageCommand(message, 'log_reset', true, {
        run: (data) => {
            events.log_reset({ msg: message });
        },
        error: () => new buildErrors(message, { detail: global.error.unknown }).isEmbed(),
    });

    // コマンド送信
    messageCommand(message, 'cmd', false, {
        run: (data) => {
            message.content = data.parameter;
            events.cmd({ msg: message });
        },
        error: () => new buildErrors(message, { detail: global.error.unknown }).isEmbed(),
    });
});


// クライアントのログイン
client.login(process.env.TOKEN);