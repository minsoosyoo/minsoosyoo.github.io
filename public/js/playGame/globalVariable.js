// canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

// mouse position
const mouse = {
    position: {
        x: 0,
        y: 0
    }
}

// game UI
const scoreText = document.querySelector('#score-number');

// restart modal
const restartModal = document.querySelector(".restart-modal");
const modalScore = document.querySelector(".modal-score");
const restart = document.querySelector("#restart");

// start modal
const startModal = document.querySelector(".start-modal");
const start = document.querySelector("#start");

// pause button and modal
const pause = document.querySelector("#pause");
const pauseModal = document.querySelector(".pause-modal");
const pauseModalScore = document.querySelector(".pause-score");
const continueGame = document.querySelector("#continue");

// player power list
let machineGunText = document.querySelector(".machine-gun");
let machineGunCDText = document.querySelector("#machine-gun-cd");

let laserBeamText = document.querySelector(".laser-beam");
let laserBeamCDText = document.querySelector("#laser-beam-cd");

let chargeAttackText = document.querySelector(".charge-attack");
let chargeAttackCDText = document.querySelector("#charge-attack-cd");

let nuclearBombText = document.querySelector(".nuclear-bomb");
let nuclearBombCDText = document.querySelector("#nuclear-bomb-cd");

let turretsText = document.querySelector(".turrets");
let turretsChargeText = document.querySelector("#turret-charges-count");

// skill tree modal
const skillTree = document.querySelector(".skill-tree-modal");
let powerOne = document.querySelector(".power-one");
let powerTwo = document.querySelector(".power-two");
let powerThree = document.querySelector(".power-three");
let powerUpMessage = document.querySelector(".power-up-message");

// game global variables
let player;
let projectiles = [];
let autoProjectiles = [];
let enemies = [];
let enemyTypes = ["Linear", "Homing", "Spinning", "Homing Spinning", "Boss"];
let numEnemyTypes = 1;
let enemyRadiusMax = 30;
let enemySpeedIncrease = 0;
let particles = [];
let shields = [];
let turrets = []; 
let powerUps = [];
let frames = 0;
let animationId;
let enemyIntervalId;
let spawnRate = 1000;
let powerUpDropChance = 0.5
let score = 0;
let mousedown = false;
let gamePaused = false;
let chargeColor;

//shift
let shiftPressed = false;

// player-power
let chosenPower;
let powerUpAvailable = true;
let powerUpDropped = false;
let playerCanFire = true;
let machineGunEnabled = false;
let machineGunUseable = true;
let laserBeamEnabled = false;
let laserBeamUseable = true;
let chargeAttackUseable = true;
let chargeAttackFired=false;
let charging = false;
let shieldTurretActivated = false;
let autoTurretActivated = false;
let nuclearBombEnabled = false;

// cooldowns condition
let machineGunCDStarted = false;
let laserBeamCDStarted = false;
let chargeAttackCDStarted = false;
let nuclearBombCDStarted = false;

// cooldown interval ID
let machineGunCDId;
let laserBeamCDId;
let chargeAttackCDId;
let nuclearBombCDId;

// cooldown declaration
let machineGunCountDown;
let laserBeamCountDown;
let chargeAttackCountDown;
let nuclearBombCountDown;

// power-ups
let powerUpObject;
let powerUpChoices = [];
let powerUpOne;
let powerUpTwo;
let powerUpThree;

let canPowerUp = true;
let justPoweredUp = false;

// reset function
function init() {
    console.log("New Game");
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    player = new Player(x, y, 30, 'white');
    enemies = [];
    enemyTypes = ["Linear", "Homing", "Spinning", "Homing Spinning", "Boss"];
    numEnemyTypes = 1;
    enemyRadiusMax = 30;
    enemySpeedIncrease = 0
    projectiles = [];
    autoProjectiles = [];
    particles = [];
    shields = [];
    turrets = [];
    powerUps = [];
    frames = 0;
    animationId;
    enemyIntervalId;
    chargeFrames = 0;
    spawnRate = 1000;
    powerUpDropChance = 0.2;
    score = 0;
    scoreText.innerHTML = `${score}`;
    mousedown = false;
    gamePaused = false;
    chargeColor = "white";
    machineGunCDText.innerHTML = "N/A";
    laserBeamCDText.innerHTML = "N/A";
    chargeAttackCDText.innerHTML = "N/A";
    nuclearBombCDText.innerHTML = "N/A";
    turretsChargeText.innerHTML = player.playerPower.turretCharge;
    machineGunText.style.color = "white";
    laserBeamText.style.color = "white";
    chargeAttackText.style.color = "white";
    nuclearBombText.style.color = "white";
    shiftPressed = false;
}

// clear all power ups
function resetTalent() {
    // player-power
    chosenPower;
    powerUpAvailable = true;
    powerUpDropped = false;

    // player shots without click
    playerCanFire = true;
    // nuclear bomb
    nuclearBombEnabled = false;
    // machine gun
    machineGunEnabled = false;
    machineGunUseable = true;
    // laser beam
    laserBeamEnabled = false;
    laserBeamUseable = true;
    // charge attack
    chargeAttackUseable = true;
    chargeAttackFired=false;
    charging = false;
    // turrets
    shieldTurretActivated = false;
    autoTurretActivated = false;

    // cooldowns reset
    machineGunCDStarted = false;
    laserBeamCDStarted = false;
    chargeAttackCDStarted = false;
    nuclearBombCDStarted = false;

    // cooldowns init
    machineGunCountDown = player.playerPower.machineGunReload;
    laserBeamCountDown = player.playerPower.laserBeamReload;
    chargeAttackCountDown = player.playerPower.chargeReload;
    nuclearBombCountDown = 60000;

    // power up selection
    powerUpChoices = {};
    
    // power up object to randomly select
    powerUpObject = new PowerUpClass();
    powerUpChoices = [];
    powerUpOne = null;
    powerUpTwo = null;
    powerUpThree = null;

    canPowerUp = true;
    justPoweredUp = false;
}


