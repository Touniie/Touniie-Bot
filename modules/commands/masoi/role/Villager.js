const {Party} = require('../enum');
const Role = require('./Role');

module.exports = class Villager extends Role {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}

	isWin() {
		const werewolfCount = this.world.items.filter(
			player => !player.died && player.party == Party.WEREWOLF
		).length;
		return werewolfCount <= 0;
	}
};
