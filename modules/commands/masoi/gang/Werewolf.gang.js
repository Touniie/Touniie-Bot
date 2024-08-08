const BiteAbility = require('../ability/Bite.ability');
const {DeathType} = require('../enum');
const {Death} = require('../type');
const Gang = require('./Gang');

module.exports = class Werewolf extends Gang {
	async onNight(movementBefore) {
		return [
			...(this.world.history.items.length == 1 // đêm đầu không cắn
				? []
				: await Promise.all(this.items.map(player => player.voteBite()))),
			...(await super.onNight(movementBefore))
		];
	}

	async nightend(movements, listDeaths) {
		const result = this.constructor.resultVoting(
			movements.filter(movement => movement.ability == BiteAbility),
			this.world.items.length
		);

		if (result.indexKill != -1)
			listDeaths.push(
				new Death(this, this.world.items[result.indexKill], DeathType.GANG)
			);
		return await super.nightend(movements, listDeaths);
	}

	static resultVoting(movements, playerAmount) {
		let max = -1;
		let indexKill = -1;
		const markArray = new Array(playerAmount).fill(0);
		for (const movement of movements) {
			if (!movement.value) continue;
			const voteIndex = movement.value - 1;
			markArray[voteIndex]++;
			if (max < markArray[voteIndex]) {
				indexKill = voteIndex;
				max = markArray[voteIndex];
			}
		}
		const sorted = [...markArray].sort((a, b) => b - a);
		if (sorted[0] == sorted[1]) indexKill = -1;
		return {
			markArray,
			indexKill
		};
	}
};
