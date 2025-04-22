// ここで使用するクラス、関数を定義

module.exports = {
    client: require('./System/system').client,
    config: require('./System/system').config,
    events: require('./System/system').events,
    scripts: require('./System/system').scripts,
    global: require('../global.json'),
    allowChannels: require('./System/system').allowChannels,
    setup: require('./System/setup').setup,
    messageChannel: require('./MessageCreator/messageChannel').messageChannel,
    messageCommand: require('./MessageCreator/messageCommand').messageCommand,
    replacePrefix: require('./MessageCreator/messageConversion').replacePrefix,
    voiceCommand: require('./MessageCreator/voiceCommand').voiceCommand,
    messageEmbed: require('./EmbedCreator/messageEmbed').messageEmbed,
    paginationEmbed: require('./EmbedCreator/paginationEmbed').paginationEmbed,
    audioPlayer: require('./AudioCreator/audioPlayer').audioPlayer,
    youtube: require('./AudioCreator/youtube').youtube,
    voicevox: require('./AudioCreator/voicevox').voicevox,
    buildErrors: require('./BuildCreator/buildError').buildErrors,
    buildSuccess: require('./BuildCreator/buildSuccess').buildSuccess,
    inOutManager: require('./VoiceStateManager/inOutManager').inOutManager,
};