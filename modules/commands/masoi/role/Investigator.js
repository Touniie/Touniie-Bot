const Ability = require('../ability');
const Villager = require('./Villager');

module.exports = class Investigator extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}

	async onNight() {
		if(this.died) return []
		return [await this.request(Ability.Investigator)];
	}
};
