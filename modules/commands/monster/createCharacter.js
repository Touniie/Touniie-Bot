const dataUser = require('./data/datauser.json');
const setData = require('./setData');

function createCharacter({ data }) {
    if (typeof data !== 'object') {
        throw new Error('data must be an object');
    }
    const existingUser = dataUser.find(user => user.id == data.id);
    if (existingUser) return 403;
    return setData.createCharecter({
        data: {
            id: data.id,
            name: data.name,
            level: 1,
            exp: 0,
            hp: 200,
            atk: 50,
            def: 50,
            spd: 500,
            the_luc: 500,
            weapon: null,
            locationID: null,
            bag: [],
            monster: [],
            created: Date.now()
        }
    });
}

module.exports = createCharacter;