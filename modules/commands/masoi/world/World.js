const Ability = require('../ability');
const {FunnyDeaths} = require('../constant');
const {Party, DeathType} = require('../enum');
const Gang = require('../gang');
const {Death} = require('../type');
const {gameConfig, symbols, randomItem, vietsub} = require('../helper');
const History = require('../History');
const Manager = require('../Manager')
const asyncWait = async time => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, time);
	});
};
module.exports = class World extends Manager {
	constructor(options) {
		super();
		const {game} = options;
		this.game = game;
		this.history = new History();
		this.ddAlive = new Array(this.items.length).fill(true);
		this.gangs = [];
		this.isEnd = false;
		this.winners = [];
	}

	// 	 ____ ___  ____  _____
	//  / ___/ _ \|  _ \| ____|
	// | |  | | | | |_) |  _|
	// | |__| |_| |  _ <| |___
	//  \____\___/|_| \_\_____|

	async onNight() {
		this.history.new('night');
		// starting night
		const movementBefore = {};
		for (const gang of this.gangs) {
			movementBefore[gang.constructor.name] = (
				await gang.onNight(movementBefore)
			).flat();
			// .filter(movement => movement.value != null);
			// this.history.add(
			// 	gang.constructor.name,
			// 	await gang.onNight(this.history.last().data)
			// );
		}

		// night ending
		const listDeaths = [];
		// const {data} = this.history.last();
		for (const gang of this.gangs) {
			await gang.nightend(movementBefore[gang.constructor.name], listDeaths);
		}

		// handle death
		for (const death of listDeaths) {
			const player = this.items[death.index];
			if (!player.died) await player.die(death);
		}
	}

	async onMorning() {
		this.history.new('morning');
		const dies = [],
			reborns = [];
		const status = this.items.map(player => !player.died);
		for (let i = 0; i < status.length; i++) {
			if (this.ddAlive[i] != status[i]) {
				status[i] ? reborns.push(i) : dies.push(i);
			}
		}
		this.ddAlive = status;
		await new Promise(resolve => setTimeout(resolve, 5000));
		await this.game.sendMessage(
			'Trời đã sáng ☀️\n' +
				(dies.length > 0
					? `Đã hi sinh (${dies.length} người): ${dies
						.map(index => this.items[index].name)
						.join(', ')}\n`
					: 'Một đêm bình yên và không có ai chết\n')
		);
		await this.game.sendStatus();
		await this.game.sendMessage(
			this.game.timing({
				message: 'Giây phút thảo luận bắt đầu',
				time: gameConfig.timeout.DISCUSS
			})
		);
		await asyncWait(gameConfig.timeout.DISCUSS);
	}

	async onLynch() {
		this.history.new('lynch');
		await this.game.sendMessage(
			this.game.timing({
				message: '⚠️ Đã hết giờ thảo luận, vui lòng kiểm tra inbox vote treo cổ',
				time: gameConfig.timeout.VOTEKILL,
				left: false
			})
		);

		const alives = this.items.filter(player => !player.died);
		const votes = await Promise.all(
			alives.map(player => player.request(Ability.VoteLynch))
		);
		const filteredVotes = votes.filter(vote => vote.value != null);
		const voteChart = [];

		for (const vote of filteredVotes) {
			const votedIndex = Number(vote.value) - 1;
			const index = voteChart.findIndex(item => item.index == votedIndex);
			const roleVote = (this.items[vote.index]).constructor.name
			if (index != -1 && roleVote == 'Mayor') voteChart[index].amount++;
			if(index != -1 && roleVote == 'Pacifist') voteChart[index].amount--
			if (index != -1 && roleVote != 'Pacifist') {
				voteChart[index].amount++;
			}
			else {
				if(roleVote == 'Mayor') {
					voteChart.push({
						index: votedIndex,
						amount: 2
					});
				}
				else if(roleVote == 'Pacifist') {
					voteChart.push({
						index: votedIndex,
						amount: -1
					});
				}
				else {
					voteChart.push({
						index: votedIndex,
						amount: 1
					});
				}
				
			}
		}
		if (voteChart.length == 0) {
			await this.game.sendMessage('📌 Sẽ không có ai bị treo cổ trong hôm nay');
			await new Promise(resolve => setTimeout(resolve, 2000));
			await this.game.sendMessage(`⚠️ Màn đêm buông xuống, đã đến lúc mọi người đi ngủ, hãy cẩn thận vì lũ sói rất tàn nhẫn`);
			return;
		}
		voteChart.sort((a, b) => b.amount - a.amount);

		let replyMsg = '📌 Sau đây là kết quả vote treo cổ: \n';
		for (let i = 0; i < voteChart.length; i++) {
			const vote = voteChart[i];
			if(vote.amount == -1) continue
			replyMsg += `${symbols[i + 1]}. ${this.items[vote.index].name}:  ${
				vote.amount
			}${
				i == 0 && (voteChart.length == 1 || voteChart[1].amount < vote.amount)
					? '💔'
					: ''
			}\n`;
		}
		await this.game.sendMessage(replyMsg);

		if (voteChart.length > 1 && voteChart[0].amount == voteChart[1].amount) {
			await this.game.sendMessage(
				'📌 Sẽ không có ai bị treo cổ trong hôm nay (huề)'
			);
		} else {
			const {index, amount} = voteChart[0];
			const percent = amount / votes.length;
			const player = this.items[index];
			if (percent >= 0.5) {
				await player.die(new Death(filteredVotes, player, DeathType.LYNCH));
				await this.game.sendMessage(
					`📌 Người chơi ${player.name} đã ${randomItem(FunnyDeaths)} 💀`
				);
				await asyncWait(1000);
				await this.game.sendStatus();
			} else {
				const need = Math.ceil(votes.length / 2) - amount;
				await this.game.sendMessage(
					`❎ Không đủ số lượng vote cho ${player.name} hiện tại: ${amount}, cần thêm: ${need} phiếu`
				);
			}
		}
		if(!this.isEnd) 
			await this.game.sendMessage(`⚠️ Màn đêm buông xuống, đã đến lúc mọi người đi ngủ, hãy cẩn thận vì lũ sói rất tàn nhẫn`);
	}

	async startLoop() {
		for (const key in Gang) {
			const gang = new Gang[key]({world: this});
			if (gang.items.length > 0) this.gangs.push(gang);
		}

		const tasks = [this.onNight, this.onMorning, this.onLynch];
		let indexTask = 0;
		let result;
		while (!this.isEnd) {
			try {
				result = await tasks[indexTask].bind(this)(result);
				indexTask++;
				if (indexTask >= tasks.length) indexTask = 0;
			} catch (err) {
				console.log(err);
				this.game.sendMessage(
					`❎ Gặp lỗi trong quá trình xử lí game! Vui lòng xem console`
				);
			}
			const tmp = this.whoWin();
			if (tmp != -1) this.endGame(tmp);
		}

		let rep = 'Trò chơi kết thúc\n';

		if (this.winners.length == 0) {
			// force end
			rep += '📌 Không ai đã giành chiến thắng (buộc dừng)\n';
		} else {
			const parties = this.winners.map(player => player.party);
			const queryParty = parties[0];
			if (
				queryParty != Party.NEUTRAL &&
				parties.filter(party => party == queryParty).length == parties.length
			) {
				for (let partyName in Party) {
					if (queryParty != Party[partyName]) continue;
					rep += `Phe ${partyName} đã giành chiến thắng\n`;
					break;
				}
			} else {
				this.winners.map(player =>
					player.sendMessage(
						'📌 Chúc mừng, bạn đã dành chiến thắng!!\nĐừng quên giải thích với mọi người vì sao thắng nhé!'
					)
				);
				rep += `${this.winners
					.map(player => player.name)
					.join(', ')} đã giành chiến thắng\n`;
			}
		}
		const group = {};
		for (const player of this.items) {
			if (!group[player.constructor.name])
				group[player.constructor.name] = [player.name];
			else {
				group[player.constructor.name].push(player.name);
			}
		}
		let roleReveal = '';
		for (const role in group) {
			roleReveal += `${vietsub(role)}: ${group[role].join(', ')}\n`;
		}
		roleReveal = roleReveal
		rep +=
			'📌 Như chúng ta đã biết, vai trò của từng người là\n' + roleReveal;
		await this.game.sendMessage(rep);
		await global.gameManager.clean(this.game.threadID);
		await this.game.sendMessage('✅ Đã dọn dẹp trò chơi');
	}
	filterP() {
		const out = [];
		for (const player of this.items) {
			if (player.died) out.push(player);
		}
		return this.items.filter(e => e.died);
	}

	whoWin() {
		const winners = [];
		for (const player of this.items) {
			if (player.isWin() === true) winners.push(player);
		}
		return winners.length > 0 ? winners : -1;
	}

	endGame(winners = []) {
		if (this.isEnd) return;
		this.isEnd = true;
		this.winners = winners;
	}
};
