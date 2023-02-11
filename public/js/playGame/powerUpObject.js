class PowerUpClass {
    constructor() {
        this.universal = [{playerPower: {damage: 2}, num: 8, message: "+2 damage per bullet"}, 
        {playerPower: {movespeed: 0.1}, num: 5, message: "movement speed increased"}, 
        {playerPower: {bulletSpeed: 1}, num: 5, message: "bullets travel faster"}, 
        {playerPower: {bulletSize: 1}, num: 5, message: "bullet size increased"}, 
        {playerPower: {reload: -2}, num: 5, message: "your bullets fire more frequently"},
        {playerPower: {machineGunDuration: 500}, num: 5, message: "machine gun lasts +0.5 seconds"},
        {playerPower: {machineGunReload: -1000}, num: 5, message: "machine gun cooldown -1 second"}, 
        {playerPower: {laserBeamDuration: 1000}, num: 5, message: "laser beam lasts +0.5 seconds"}, 
        {playerPower: {laserBeamReload: -3000}, num: 5, message: "laser beam cooldown -5 seconds"},
        {playerPower: {turretCharge: 3}, num: 100, message: "turret charge +3"},
        {shieldPower: {turretSize: 5}, num: 10, message: "shield turret size increased"},
        {shieldPower: {damage: 2}, num: 5, message: "shield damage +2"}, 
        {shieldPower: {speed: 0.02}, num: 5, message: "shield rotates faster"},
        {shieldPower: {size: 2}, num: 5, message: "shield size increased"},
        {shieldPower: {reload: -100}, num: 5, message: "shield spawns faster"},
        {shieldPower: {radianFactor: -20}, num: 5, message: "shield rotation is tighter"},
        {shieldPower: {shieldCharges: 1}, num: 5, message: "shield can hit +1 time extra"},
        {autoPower: {turretSize: 5}, num: 5, message: "auto turret size increased"},
        {autoPower: {damage: 2}, num: 5, message: "auto shot damage +2"},
        {autoPower: {speed: 1}, num: 5, message: "auto shots travel faster"},
        {autoPower: {size: 1}, num: 5, message: "auto shot bullet size increased"},
        {autoPower: {count: 2}, num: 5, message: "+2 auto shots are fired"},
        {autoPower: {reload: -100}, num: 5, message: "auto shots are fired more frequently"}]

        this.playerPower = ["shot-gun", 
        "machine-gun",  
        "charge-attack", 
        "laser-beam",
        "improved-shot-gun"]

        this.shieldPower = ["shield-center", 
        "shield-stationary",
        "shield-moving",
        "shield-turret",
        "shield-both-dir"];

        this.autoPower = ["auto-missiles",
        "auto-turret",
        "nuclear-bomb",
        "homing-auto"]
    }
}

const getRandomNumber = (max, min=0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

function powerUpSelection(powerUpObject) {
    powerUpChoices = [];
    let powerOne = chooseUniversal(powerUpObject);

    let powerTwo = choosePlayer(powerUpObject);
    if (!powerTwo) {
        powerTwo = chooseUniversal(powerUpObject);
    }

    let powerThree = chooseShield(powerUpObject);
    if (!powerThree) {
        powerThree = chooseUniversal(powerUpObject);
    }

    let powerFour = chooseAuto(powerUpObject);
    if (!powerFour) {
        powerFour = chooseUniversal(powerUpObject);
    }

    powerUpChoices = [powerOne, powerTwo, powerThree, powerFour];
    powerUpChoices = powerUpChoices.filter(powerUp => (powerUp !== undefined || powerUp !== null));
    console.log("power up choices: ", powerUpChoices);
    powerUpChoices = shuffle(powerUpChoices);
    return powerUpChoices;
}

function chooseUniversal(powerUpObject) {
    if (powerUpObject.universal.length > 0) {
        let randNumUni;
        let num;
        
        randNumUni = getRandomNumber(powerUpObject.universal.length-1);
        num = powerUpObject.universal[randNumUni].num

        let choiceUni = powerUpObject.universal[randNumUni];
        let firstKey = Object.keys(choiceUni)[0];

        if ((firstKey === "shieldPower" && powerUpObject.shieldPower.includes("shield-center")) || (firstKey === "auto" && powerUpObject.autoPower.includes("auto"))) {
            chooseUniversal(powerUpObject);
        }

        let secondKey = Object.keys(Object.values(choiceUni)[0])[0];
        let powerValue = Object.values(Object.values(choiceUni)[0])[0];
        let message = powerUpObject.universal[randNumUni].message;
        let choice = {
            type: "universal",
            firstKey: firstKey,
            secondKey: secondKey,
            powerValue: powerValue,
            num: num,
            message: message,
            index: randNumUni
        }
        return choice;
    } else {
        return null;
    }
}

function choosePlayer(powerUpObject) {
    let choice = {};
    if (powerUpObject.playerPower.length > 0) {
        let randNumPlayer = getRandomNumber(powerUpObject.playerPower.length-1);
        let choicePlayer = powerUpObject.playerPower[randNumPlayer];

        if (choicePlayer === "improved-shot-gun" && powerUpObject.playerPower.includes("shot-gun")) {
            choice = {
                type: "player",
                power: powerUpObject.playerPower[0],
                index: 0
            }
            return choice;    
        }

        choice = {
            type: "player",
            power: choicePlayer,
            index: randNumPlayer
        }
        return choice;
    } else {
        return null;
    }
}

function chooseShield(powerUpObject) {
    let choice = {};
    if (powerUpObject.shieldPower[0] === "shield-center") {
        choice = {
            type: "shield",
            power: powerUpObject.shieldPower[0],
            index: 0
        }
        return choice;
    } else if (powerUpObject.shieldPower.length > 0) {
        let randNumShield = getRandomNumber(powerUpObject.shieldPower.length-1);
        let choiceShield =  powerUpObject.shieldPower[randNumShield];

        if (powerUpObject.shieldPower[randNumShield] === "shield-moving" && powerUpObject.shieldPower.includes("shield-stationary")) {
            chooseShield(powerUpObject);
        }
        choice = {
            type: "shield",
            power: choiceShield,
            index: randNumShield
        };
        return choice;
    } else {
        return null;
    }
}

function chooseAuto(powerUpObject) {
    let choice = {};
    if (powerUpObject.autoPower[0] === "auto-missiles") {
        choice = {
            type: "auto",
            power: powerUpObject.autoPower[0],
            index: 0
        }
        return choice;
    } else if (powerUpObject.autoPower.length > 0) {
        let randNumAuto = getRandomNumber(powerUpObject.autoPower.length-1);
        let choiceAuto = powerUpObject.autoPower[randNumAuto];
        choice = {
            type: "auto",
            power: choiceAuto,
            index: randNumAuto
        }
        return choice;
    } else {
        return null;
    }
}

function choosePowerUp() {
    powerUpChoices = powerUpSelection(powerUpObject);
    powerUpOne = powerUpChoices[0];
    powerUpTwo = powerUpChoices[1];
    powerUpThree = powerUpChoices[2];

    skillTree.style.display = "flex";
    gsap.fromTo('.skill-tree-modal', {
        scale: 0.8,
        opacity: 0
    }, {
        scale: 1,
        opacity: 1,
        ease: 'expo'
    })

    if (powerUpOne) {
        powerOne.style.display = "flex";
        if (powerUpOne.type === "universal") {
            powerOne.innerHTML = `${powerUpOne.message}`;
        } else {
            powerOne.innerHTML = `${powerUpOne.power}`;
        }
    } else {
        powerOne.style.display = "none";
    }

    if (powerUpTwo) {
        powerTwo.style.display = "flex";
        if (powerUpTwo.type === "universal") {
            powerTwo.innerHTML = `${powerUpTwo.message}`;
        } else {
            powerTwo.innerHTML = `${powerUpTwo.power}`;
        }
    } else {
        powerTwo.style.display = "none";
    }

    if (powerUpThree) {
        powerThree.style.display = "flex";
        if (powerUpThree.type === "universal") {
            powerThree.innerHTML = `${powerUpThree.message}`;
        } else {
            powerThree.innerHTML = `${powerUpThree.power}`;
        }
    } else {
        powerTwo.style.display = "none";
    }
}

function choosePowerOne() {
    let chosenPower;
    if (powerUpOne.type === "universal") {
        powerUpObject.universal[powerUpOne.index].num--
        player[`${powerUpOne.firstKey}`][`${powerUpOne.secondKey}`] += powerUpOne.powerValue;
        if (powerUpTwo.secondKey === "turretCharge") {
            turretsChargeText.innerHTML = `${player.playerPower.turretCharge}`;
        }
        if (powerUpObject.universal[powerUpOne.index].num < 1) {
            powerUpObject.universal.splice(powerUpOne.index, 1);
        }
    } else if (powerUpOne.type === "player" ) {
        chosenPower = powerUpOne.power;
        player.playerPower.list.push(`${powerUpOne.power}`);
        powerUpObject.playerPower.splice(powerUpOne.index, 1);
    } else if (powerUpOne.type === "shield") {
        chosenPower = powerUpOne.power;
        player.shieldPower.list.push(`${powerUpOne.power}`);
        powerUpObject.shieldPower.splice(powerUpOne.index, 1);
    } else if (powerUpOne.type === "auto") {
        chosenPower = powerUpOne.power;
        player.autoPower.list.push(`${powerUpOne.power}`);
        powerUpObject.autoPower.splice(powerUpOne.index, 1);
    }

    gsap.to('.skill-tree-modal', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.in',
        onComplete: ()=>{
            skillTree.style.display = "none";
        }
    });

    setTimeout (()=>{
        justPoweredUp = false;
    }, 3000);

    return chosenPower;
}

function choosePowerTwo() {
    let chosenPower;
    if (powerUpTwo.type === "universal") {
        powerUpObject.universal[powerUpTwo.index].num--;
        player[`${powerUpTwo.firstKey}`][`${powerUpTwo.secondKey}`] += powerUpTwo.powerValue;
        if (powerUpTwo.secondKey === "turretCharge") {
            turretsChargeText.innerHTML = `${player.playerPower.turretCharge}`;
        }
        if (powerUpObject.universal[powerUpTwo.index].num < 1) {
            powerUpObject.universal.splice(powerUpTwo.index, 1);
        }
    } else if (powerUpTwo.type === "player" ) {
        chosenPower = powerUpTwo.power;
        player.playerPower.list.push(`${powerUpTwo.power}`);
        powerUpObject.playerPower.splice(powerUpTwo.index, 1);
    } else if (powerUpTwo.type === "shield") {
        chosenPower = powerUpTwo.power;
        player.shieldPower.list.push(`${powerUpTwo.power}`);
        powerUpObject.shieldPower.splice(powerUpTwo.index, 1);
    } else if (powerUpTwo.type === "auto") {
        chosenPower = powerUpTwo.power;
        player.autoPower.list.push(`${powerUpTwo.power}`);
        powerUpObject.autoPower.splice(powerUpTwo.index, 1);
    } 
    
    gsap.to('.skill-tree-modal', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.in',
        onComplete: ()=>{
            skillTree.style.display = "none";
        }
    });

    setTimeout (()=>{
        justPoweredUp = false;
    }, 3000);

    return chosenPower;
}

function choosePowerThree() {
    let chosenPower;
    if (powerUpThree.type === "universal") {
        powerUpObject.universal[powerUpThree.index].num--
        player[`${powerUpThree.firstKey}`][`${powerUpThree.secondKey}`] += powerUpThree.powerValue;
        if (powerUpOne.secondKey === "turretCharge") {
            turretsChargeText.innerHTML = `${player.playerPower.turretCharge}`;
        }
        if (powerUpObject.universal[powerUpThree.index].num < 1) {
            powerUpObject.universal.splice(powerUpThree.index, 1);
        }
    } else if (powerUpThree.type === "player" ) {
        chosenPower = powerUpThree.power;
        player.playerPower.list.push(`${powerUpThree.power}`);
        powerUpObject.playerPower.splice(powerUpThree.index, 1);
    } else if (powerUpThree.type === "shield") {
        chosenPower = powerUpThree.power;
        player.shieldPower.list.push(`${powerUpThree.power}`);
        powerUpObject.shieldPower.splice(powerUpThree.index, 1);
    } else if (powerUpThree.type === "auto") {
        chosenPower = powerUpThree.power;
        player.autoPower.list.push(`${powerUpThree.power}`);
        powerUpObject.autoPower.splice(powerUpThree.index, 1);
    }
    

    gsap.to('.skill-tree-modal', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.in',
        onComplete: ()=>{
            skillTree.style.display = "none";
        }
    });

    setTimeout (()=>{
        justPoweredUp = false;
    }, 3000);

   return chosenPower;
}

powerOne.addEventListener("click", ()=>{
    let chosenPower = choosePowerOne();
    console.log("clicked power", chosenPower);
    if (chosenPower === "machine-gun"){
        machineGunText.style.color = "yellow";
        machineGunCDText.innerHTML = "Ready";
    } else if (chosenPower === "laser-beam") {
        laserBeamText.style.color = "orange";
        laserBeamCDText.innerHTML = "Ready";
    } else if (chosenPower === "charge-attack") {
        chargeAttackText.style.color = "red";
        chargeAttackCDText.innerHTML = "Ready";
    } else if (chosenPower === "nuclear-bomb") {
        nuclearBombText.style.color = "pink";
        nuclearBombCDText.innerHTML = "Ready";
    } 
});

powerTwo.addEventListener("click", ()=>{
    let chosenPower = choosePowerTwo();
    console.log("clicked power", chosenPower);
    if (chosenPower === "machine-gun"){
        machineGunText.style.color = "yellow";
        machineGunCDText.innerHTML = "Ready";
    } else if (chosenPower === "laser-beam") {
        laserBeamText.style.color = "orange";
        laserBeamCDText.innerHTML = "Ready";
    } else if (chosenPower === "charge-attack") {
        chargeAttackText.style.color = "red";
        chargeAttackCDText.innerHTML = "Ready";
    } else if (chosenPower === "nuclear-bomb") {
        nuclearBombText.style.color = "pink";
        nuclearBombCDText.innerHTML = "Ready";
    } 
});

powerThree.addEventListener("click", ()=>{
    let chosenPower = choosePowerThree();
    console.log("clicked power", chosenPower);
    if (chosenPower === "machine-gun"){
        machineGunText.style.color = "yellow";
        machineGunCDText.innerHTML = "Ready";
    } else if (chosenPower === "laser-beam") {
        laserBeamText.style.color = "orange";
        laserBeamCDText.innerHTML = "Ready";
    } else if (chosenPower === "charge-attack") {
        chargeAttackText.style.color = "red";
        chargeAttackCDText.innerHTML = "Ready";
    } else if (chosenPower === "nuclear-bomb") {
        nuclearBombText.style.color = "pink";
        nuclearBombCDText.innerHTML = "Ready";
    } 
});
