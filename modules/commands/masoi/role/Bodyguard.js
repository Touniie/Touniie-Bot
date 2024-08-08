const Ability = require('../ability');
const Villager = require('./Villager');

module.exports = class Bodyguard extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
		this.lastProtectIndex = -1;
	}

	async onNight() {
		if(this.died) return []
		return [await this.request(Ability.Protect)];
	}
};
