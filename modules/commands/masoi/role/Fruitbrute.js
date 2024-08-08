const Gang = require('../gang');
const Werewolf = require('./Werewolf');

module.exports = class Fruitbrute extends Werewolf {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}

	async voteBite() {
		return this.isAlone() ? [] : await super.voteBite();
	}

	isAlone() {
		const werewolfs = this.world.items.filter(
			player => player.role == Werewolf
		);
		const alives = werewolfs.filter(werewolf => !werewolf.died);
		return alives.length <= 0;
	}
};
