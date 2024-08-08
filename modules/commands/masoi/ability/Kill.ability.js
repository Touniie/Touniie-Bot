const Format = require('../format');
const Ability = require('./Ability');

module.exports = class Kill extends Ability {
	static question(player) {
		return (
			'Bạn muốn giết ai trong danh sách:\n' + player.world.game.listPlayer({died: false})
		)
	}

	static check(player, value) {
		const index = player.format(
			value,
			Format.validIndex,
			Format.alive,
			Format.notSelf
		);
		const {name} = player.world.items[index];
		player.sendMessage(`✅ Bạn đã chọn giết ${name}`);
		return index;
	}

	static async nightend(player, index, listDeaths) {
		if (index == null) return;
		return index;
	}
};
