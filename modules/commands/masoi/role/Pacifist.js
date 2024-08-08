const Villager = require('./Villager');

module.exports = class Pacifist extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}
};
