// 完了メッセージを生成するモジュール
const { build } = require('./build');

module.exports = {
    // ビルドタイプ別に格納
    buildSuccess: class extends build {
        constructor(msg, options={}) {
            super(msg, {
                setColor: '#00FF00',
                setTitle: 'Success',
                setDescription: options?.detail || null,
            });
        }
    }
};