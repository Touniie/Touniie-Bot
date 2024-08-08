const {DeathType} = require('../enum');
const Villager = require('./Villager');

module.exports = class Tanner extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}

	async die(death) {
		await super.die(death);
		if (death.type == DeathType.LYNCH) {
			this.world.endGame([this]);
		}
	}
};
