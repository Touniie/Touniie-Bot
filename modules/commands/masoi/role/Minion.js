const Werewolf = require('./Werewolf');
const Villager = require('./Villager');

module.exports = class Minion extends Werewolf {
	constructor(options) {
		super({
			...options,
			...{
				role: Villager
			}
		});
	}
};
