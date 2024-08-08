module.exports = (player, index) => {
	if (player.index == index)
		throw new Error('❎ Bạn không thể chọn bản thân');
	return index;
};
