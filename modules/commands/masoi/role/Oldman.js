const Werewolf = require('./Werewolf');
const Villager = require('./Villager');

module.exports = class Oldman extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
		this.dayPassed = 0;
	}

	async nightend() {
		const wwAmount = this.world.items.filter(
			player => player.constructor == Werewolf
		).length;
		if (++this.dayPassed >= wwAmount + 1) {
			return this.index;
		}
	}
};
