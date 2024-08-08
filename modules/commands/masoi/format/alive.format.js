module.exports = (player, index) => {
	if (player.world.items[index].died)
		throw new Error('❎ Người chơi này đã chết');
	return index;
};
