const Ability = require('../ability');
const Goodseer = require('./Goodseer');
const Villager = require('./Villager');

module.exports = class Apprentice extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}

	async onNight() {
		if(this.died) return []
		return this.isAlone() ? [await this.request(Ability.Seer)] : [];
	}

	isAlone() {
		const seers = this.world.items.filter(player => player.role == Goodseer);
		const alives = seers.filter(seer => !seer.died);
		return alives.length <= 0;
	}
};
