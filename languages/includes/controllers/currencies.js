module.exports = function ({ models }) {
	const Currencies = models.use('Currencies');
  
	async function getAll(...data) {
		var where, attributes;
		for (const i of data) {
      if(i.includes('money')) i.push('data')
			if (typeof i != 'object') throw global.getText("currencies", "needObjectOrArray");
			if (Array.isArray(i)) attributes = i;
			else where = i;
		}
		try { 
      const user = (await Currencies.findAll({ where, attributes })).map(e => e.get({ plain: true }))
      for(const e of user){
      if(!e.data) e.data = {}
      if(!e.data.money){
          e.data.money = '0'
        }
        if(e.money >= 0){
          if(e.data.money === '[object Object]') e.data.money = '0'
          e.money = BigInt(e.data.money)
        } 
        delete e.data
      }
     return user
    }
		catch (error) {
			console.error(error);
			throw new Error(error);
		};
	}

	async function getData(userID) {
		try {
			const data = await Currencies.findOne({ where: { userID }});
      
			if (data) {
        const user = data.get({ plain: true });
        if(!user.data) user.data = {}
        if(!user.data.money){
          user.data.money = '0'
        }
        if(user.money >= 0){
          if(user.data.money === '[object Object]') user.data.money = '0'
          user.money = BigInt(user.data.money || 0)
        }
        
        return user
      }
        
			else return false;
		} 
		catch (error) {
			console.error(error);
			throw new Error(error);
		};
	}

	async function setData(userID, options = {}) {
		if (typeof options != 'object' && !Array.isArray(options)) throw global.getText("currencies", "needObject");
		try {
      if(options.money !== undefined){
      const useri = (await getData(userID)).data
       options.data = useri
       options.data.money = String(options.money)
      }
        
			(await Currencies.findOne({ where: { userID } })).update(options);
			return true;
		} 
		catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	async function delData(userID) {
		try {
			(await Currencies.findOne({ where: { userID } })).destroy();
			return true;
		}
		catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	async function createData(userID, defaults = {}) {
		if (typeof defaults != 'object' && !Array.isArray(defaults)) throw global.getText("currencies", "needObject");
		try {
			await Currencies.findOrCreate({ where: { userID }, defaults });
			return true;
		}
		catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	async function increaseMoney(userID, money) {
		if (typeof money !== 'number' && typeof money !== 'string'){
      throw global.getText("currencies", "needNumber");
    } 
		try {
      
			let balance = (await getData(userID)).money;
      if(balance !== undefined){
      const tong = BigInt(balance) + BigInt(money)
			await setData(userID, { money: tong +''});
			return true;
      }
      return false
		}
		catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	async function decreaseMoney(userID, money) {
    
		if (typeof money != 'number' && typeof money != 'string') throw global.getText("currencies", "needNumber");
		try {
			let balance = (await getData(userID)).money;
			//if (balance < money) return false;
      const hieu = BigInt(balance) - BigInt(money)
			await setData(userID, { money: hieu+''});
			return true;
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}

	return {
		getAll,
		getData,
		setData,
		delData,
		createData,
		increaseMoney,
		decreaseMoney
	};
};