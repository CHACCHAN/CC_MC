// プレイヤーを作成する
const { client } = require('../System/system');
const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require("@discordjs/voice");

module.exports = {
    audioPlayer: class {
        constructor(msg) {
            try {
                this.msg = msg;
                this.queue = [];
                this.status = 'idle';
                this.player = createAudioPlayer();
                this.connection = joinVoiceChannel({
                    channelId: msg.member.voice.channel.id,
                    guildId: msg.guild.id,
                    adapterCreator: msg.guild.voiceAdapterCreator,
                });

            } catch (error) {
                throw new Error(error);
            }
        }

        // 再生する
        play(stream) {
            try {
                // すでに再生中なら停止
                if (this.player.state.status === 'playing') this.player.stop();
                
                // 再生処理
                const resource = createAudioResource(stream); // コンテンツの用意
                this.player.play(resource); // 再生するものをセット
                this.connection.subscribe(this.player); // 予約する(再生開始)

            } catch (error) {
                throw new Error(error);
            }
        }

        // スキップする
        skip() {
            this.player.stop(); // 再生を停止
        }

        // システムの対象接続情報から削除と退出する
        leave(guildId) {
            this.connection.destroy(); // 退出
            client.audios = client.audios.filter(audio => audio.guildId !== guildId); // システムから削除
            this.player.removeAllListeners(); // すべてのリスナーを削除
        }

        // キューをクリアする
        clsQueue(opstions={}) {
            this.queue = []; // キューを空にする
            if(opstions?.stop && this.status === 'playing') this.player.stop(); // 再生を停止
        }

        // キューに追加する
        addQueue(stream, detail) {
            this.queue.push({ stream: stream, detail: detail });
        }

        // キューイング(再生リストを作成と自動再生)
        playQueue(func={}) {
            try {
                // キューが空なら何もしない
                if (this.queue.length === 0) {
                    this.status = 'idle';
                    if(func?.end) func.end?.(); // アナウンス
                    return;
                }

                // キューがあるなら再生
                const stream = this.queue.shift();
                if(func?.next) func.next?.(stream.detail); // アナウンス
                this.play(stream.stream); // 次の曲の処理
                this.status = 'playing';

                // 既存のリスナーを削除
                this.player.removeAllListeners('idle');
                this.player.removeAllListeners('error');

                // 再生が終わったら次の曲を再生
                this.player.once('idle', () => {
                    this.playQueue(func);
                });

                // 再生エラーだったら再試行
                this.player.once('error', () => {
                    if(func?.error) func.error?.(); // アナウンス
                    this.playQueue(func);
                });

            } catch (error) {
                throw new Error(error);
            }
        }
    }
};