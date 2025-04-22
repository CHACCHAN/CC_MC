// エラーメッセージを生成するモジュール
const { build } = require('./build');

module.exports = {
    // ビルドタイプ別に格納
    buildErrors: class extends build {
        constructor(msg, options={}) {
            super(msg, {
                setColor: '#FF0000',
                setTitle: 'Error',
                setDescription: options?.detail || null,
            });
        }
    }
};