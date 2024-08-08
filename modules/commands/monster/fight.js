const fight = (playerPow, monsterPow) => {
    var log = [];
    var turn = 0;
    var playerTurns =  Math.floor(playerPow.SPD / monsterPow.SPD);
    var monsterTurns = Math.floor(monsterPow.SPD / playerPow.SPD);

    const getFirstAttack = () => {
        if (playerPow.SPD >= monsterPow.SPD) {
            return "player";
        } else {
            return "monster";
        }
    };

    const getDamageMultiplier = (attacker) => {
        if (attacker.Mana >= 100) {
            attacker.Mana = 0;
            return 1.5;
        } else {
            return 1;
        }
    };

    const calculateDamage = (attacker, defender) => {
        var damageMultiplier = getDamageMultiplier(attacker);
        var reducedDef = defender.DEF * 0.75;
        var damage = Math.max((attacker.ATK - reducedDef) * damageMultiplier, 1);
        reducedDef = attacker.ATK - damage
        return {
            damage: Math.round(damage),
            defender: reducedDef
        }
    };
    
    let currentTurn = getFirstAttack();

    while (playerPow.HP > 0 && monsterPow.HP > 0) {

        const attacker =
            currentTurn === "player" ? playerPow : monsterPow;
        const defender =
            currentTurn === "player" ? monsterPow : playerPow;

        if (currentTurn === "player") {
            playerPow.Mana += 25;
        }
        else {
            monsterPow.Mana += 25;
        }
        const data = calculateDamage(attacker, defender);
        const damage = data.damage;
        const defenderDef = data.defender;
        defender.HP -= damage;

        const logEntry = {
            turn: turn,
            playerPow: {
                ...playerPow
            },
            monsterPow: {
                ...monsterPow
            },
            damage: damage,
            defenderDef: defenderDef,
            attacker: currentTurn === "player" ? "player" : "monster",
            skill: attacker.Mana == 0 ? "skill" : "normal"
        };
        log.push(logEntry);
        turn++;

        if (currentTurn === "player") {
            playerTurns = playerTurns-1;
            if (playerTurns <= 0) {
                currentTurn = "monster";
                playerTurns = 0
                monsterTurns = Math.floor(monsterPow.SPD / playerPow.SPD);
                if(monsterTurns <= 0) monsterTurns = 1;
            }
        } else {
            monsterTurns = monsterTurns-1;
            if (monsterTurns <= 0) {
                currentTurn = "player";
                monsterTurns = 0;
                playerTurns = Math.floor(playerPow.SPD / monsterPow.SPD);
                if (playerTurns <= 0) playerTurns = 1;
            }
        }       
    }
    if (playerPow.HP <= 0) {
        return {
            winner: false,
            log: log,
            playerPow: playerPow
        }
    } else {
        return {
            winner: true,
            log: log,
            playerPow: playerPow
        }
    }
};


module.exports = {
    fight
}