const Format = require('../format');
const Ability = require('./Ability');

module.exports = class RoleReveal extends Ability {
	static question(player) {
		return (
			'📌 Bạn muốn xem vai trò của ai trong danh sách:\n' +
			player.world.game.listPlayer()
		);
	}

	static check(player, value) {
		const index = player.format(value, Format.validIndex, Format.notSelf);
		player.sendMessage(
			`✅ Bạn đã chọn xem vai trò của người chơi ${player.world.items[index].name}`
		);
		return index;
	}

	static async nightend(player, index, listDeaths) {
		if (index == null) return;
		const target = player.world.items[index];
		await player.sendMessage(
			`📌 Vai trò của ${target.name} là ${target.role.name}`
		);
	}
};
