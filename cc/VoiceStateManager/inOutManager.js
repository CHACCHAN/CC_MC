// VC参加時のメンバーの参加状況に対応
const { client } = require('../System/system');
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
    // 自分自身が参加済みで、メンバーが参加したときの処理、退出したときの処理を行う
    inOutManager: (oldState, newState, callbacks={}) => {
        const oldChannel = oldState.channel;
        const oldMember = oldState.member;
        const newChannel = newState.channel;
        const newMember = newState.member;

        // 自分自身が参加していなかったら無視
        if(!!!getVoiceConnection(oldState.guild.id)) return;

        // 入室時の処理
        if (!oldChannel && newChannel) {
            const members = newChannel.members.filter(member => !member.user.bot).map(member => member.user.tag);
            
        }

        // 退出時の処理
        if (oldChannel && !newChannel) {
            const members = oldChannel.members.filter(member => !member.user.bot).map(member => member.user.tag);

            // 手動で強制退出させられた場合
            if(oldMember.id === client.active?.user.id) {
                callbacks.forcedEjection?.();
                return;
            }

            // 参加者がボット以外退出してしまった場合
            if(members.length === 0) {
                callbacks.allLeave?.();
                return;
            }
        }
    }
}