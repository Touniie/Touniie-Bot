const {Party} = require('../enum');
/* {
	score: ,
	party: Party.,
	description: '',
	advice: ''
} */
//new Diseased, Mayor, Minion
module.exports = {
	Apprentice: {
		score: +3,
		party: Party.VILLAGER,
		description: 'Apprentice trở thành Goodseer nếu Goodseer chết',
		advice: 'Cố gắng giết hết phe Sói',
		image: __dirname + "/image/Apprentice.png"
	},
	Diseased: {
		score: +3,
		party: Party.VILLAGER,
		description: 'Nếu Người bệnh bị Sói cắn, thì Sói sẽ không thể cắn người nào vào đêm tiếp theo do bị bệnh.',
		advice: 'Hi sinh cho sói cắn để kìm hãm sự hung bạo của lũ sói',
		image: __dirname + "/image/Diseased.png"
	},
	Pacifist: {
		score: -1,
		party: Party.VILLAGER,
		description: 'Người Yêu hòa bình luôn vote cho người chơi được sống.',
		advice: 'Hãy tin vào bản thân và vote cứu người',
		image: __dirname + "/image/Pacifist.png"
	},
	Mayor: {
		score: +2,
		party: Party.VILLAGER,
		description: 'Phiếu biểu quyết của Thị trường được tính là 2 phiếu khi biểu quyết treo cổ.',
		advice: 'Suy nghĩ thật kĩ trước khi vote',
		image: __dirname + "/image/Mayor.png"
	},
	Minion: {
		score: +6,
		party: Party.WEREWOLF,
		description: 'Phản bội thức dậy cùng Sói và biết Sói là ai. Tham gia cùng Sói để giết Dân làng. Tuy nhiên Tiên tri khi soi vào Phản bội thì vẫn ra dân làng.',
		advice: 'Cố gắng giết hết dân làng',
		image: __dirname + "/image/Minion.png"
	},
	Bodyguard: {
		score: +3,
		party: Party.VILLAGER,
		description:
			'Mỗi đêm, Bodyguard sẽ chọn một người bất kì để bảo vệ, nếu người đó bị Sói cắn, sẽ không bị chết vào sáng hôm sau',
		advice: 'Cố gắng quan sát để cứu được người bị hại',
		image: __dirname + "/image/Bodyguard.png"
	},
	Cupid: {
		score: -3,
		party: Party.VILLAGER,
		description:
			'Cupid thức dậy đêm đầu và chọn 2 người trở thành cặp đôi của nhau và sẽ biết người kia chức năng là gì. Nếu 1 người chết đi, người kia sẽ chết ngay lập tức',
		advice: '(Không có)',
		image: __dirname + "/image/Cupid.png"
	},
	Evilseer: {
		score: -6,
		party: Party.WEREWOLF,
		description:
			'Mỗi đêm, Evilseer sẽ chọn 1 người chơi để xem vai trò và trở thành Werewolf khi không còn một con sói nào',
		advice: 'Cố gắng quan sát để tìm ra những kẻ quan trọng',
		image: __dirname + "/image/Evilseer.png"
	},
	Fruitbrute: {
		score: -3,
		party: Party.WEREWOLF,
		description:
			'Hằng đêm, thức dậy cùng những con Sói khác. Nếu bạn là con Sói cuối cùng còn sống, bạn không thể chọn người chơi nào để ăn thịt',
		advice: 'Cố gắng giết hết dân làng',
		image: __dirname + "/image/Fruitbrute.png"
	},
	Goodseer: {
		score: +7,
		party: Party.VILLAGER,
		description: 'Mỗi đêm, Nhà tiên tri sẽ chọn 1 người chơi để đoán phe',
		advice:
			'Cố gắng quan sát để tìm ra sói trong đêm, ban ngày cố gắng thuyết phục mọi người',
		image: __dirname + "/image/Goodseer.png"
	},
	Hunter: {
		score: +3,
		party: Party.VILLAGER,
		description:
			'Nếu Thợ Săn chết bởi bất kì lí do gì, hắn vẫn có thể bắn 1 người chơi khác',
		advice: 'Chăm chú tìm ra Sói để bắn',
		image: __dirname + "/image/Hunter.png"
	},
	Investigator: {
		score: +7,
		party: Party.VILLAGER,
		description:
			'Mỗi đêm, Investigator sẽ chọn 3 người và sẽ được cho biết rằng có ít nhất 1 sói trong 3 người đó!',
		advice: 'Đây là vai trò rất mạnh, hãy tận dụng nó!',
		image: __dirname + "/image/Investigator.png"
	},
	Lycan: {
		score: -1,
		party: Party.VILLAGER,
		description:
			'Lycan mang trong mình dòng máu của loài sói và được xem như là Sói nếu như bị Goodseer soi mặc dù không phải',
		advice: 'Dễ bị làng hiểu lầm, hãy giải thích họ rõ ràng',
		image: __dirname + "/image/Lycan.png"
	},
	Oldman: {
		score: 0,
		party: Party.VILLAGER,
		description:
			'Oldman sẽ chết vào đêm X (X = số lượng sói hiện tại trong game +1)',
		advice: '(Không có)',
		image: __dirname + "/image/Oldman.png"
	},
	Tanner: {
		score: +1,
		party: Party.NEUTRAL,
		description: 'Chán Đời chỉ thắng khi anh ta bị treo cổ',
		advice: 'Hãy bị treo cổ :D',
		image: __dirname + "/image/Tanner.png"
	},
	Villager: {
		score: +1,
		party: Party.VILLAGER,
		description:
			'Dân làng cùng với những người có chức năng tìm cách lập luận và suy đoán ra đâu là Sói đang ẩn mình dưới lớp người',
		advice:
			'Đừng để vai trò dân làng của bạn trở nên vô ích, bạn có thể treo cổ Sói mà!',
		image: __dirname + "/image/Villager.png"
	},
	Werewolf: {
		score: -6,
		party: Party.WEREWOLF,
		description:
			'Sói sẽ được biết những con khác vào đêm đầu tiên. Mỗi đêm sau đêm đầu, Sói phải thống nhất 1 nạn nhân để giết',
		advice: 'Cố gắng giết hết phe Dân Làng',
		image: __dirname + "/image/Werewolf.png"
	},
	Witch: {
		score: +4,
		party: Party.VILLAGER,
		description:
			'Phù Thủy có 2 chức năng đó là chọn 1 người sắp chết để cứu sống và giết chết 1 người mà Phù Thủy muốn',
		advice: 'Có quyền năng trong tay nên cần sử dụng khôn ngoan nhất có thể',
		image: __dirname + "/image/Witch.png"
	}
};
