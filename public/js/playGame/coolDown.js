function machineGunCD() {
    if (machineGunCDStarted) {
        machineGunCDId = setInterval(()=>{
            machineGunCDText.innerHTML = `${machineGunCountDown/1000}`;
            machineGunCountDown-=1000;
            if (machineGunCountDown <= 0) {
                machineGunCDStarted = false;
                clearInterval(machineGunCDId);
                machineGunCountDown = player.playerPower.machineGunReload;
                machineGunUseable = true;
                machineGunText.style.color = "yellow"
                machineGunCDText.innerHTML = "Ready";
            }
        }, 1000);
    }
}

function laserBeamCD() {
    if (laserBeamCDStarted) {
        laserBeamCDId = setInterval(()=>{
            laserBeamCDText.innerHTML = `${laserBeamCountDown/1000}`;
            laserBeamCountDown-=1000;
            if (laserBeamCountDown <= 0) {
                laserBeamCDStarted = false;
                clearInterval(laserBeamCDId);
                laserBeamCountDown = player.playerPower.laserBeamReload;
                laserBeamUseable = true;
                laserBeamText.style.color = "orange";
                laserBeamCDText.innerHTML = "Ready";
            }
        }, 1000);
    }
}

function chargeAttackCD() {
    if (chargeAttackCDStarted) {
        chargeAttackCDId = setInterval(()=>{
            chargeAttackCDText.innerHTML = `${chargeAttackCountDown/1000}`;
            chargeAttackCountDown-=1000;
            if (chargeAttackCountDown <= 0) {
                chargeAttackCDStarted = false;
                clearInterval(chargeAttackCDId);
                chargeAttackCountDown = player.playerPower.chargeReload;
                chargeAttackFired = false;
                chargeAttackUseable = true;
                chargeAttackText.style.color = "red";
                chargeAttackCDText.innerHTML = "Ready";
            }
        }, 1000);
    }
}

function nuclearBombCD() {
    if (nuclearBombCDStarted) {
        nuclearBombCDId = setInterval(()=>{
            nuclearBombCDText.innerHTML = `${nuclearBombCountDown/1000}`;
            nuclearBombCountDown-=1000;
            if (nuclearBombCountDown <= 0) {
                clearInterval(nuclearBombCDId);
                nuclearBombCountDown = 60000;
                nuclearBombCDStarted = false;
                nuclearBombEnabled = false;
                nuclearBombText.style.color = "pink";
                nuclearBombCDText.innerHTML = "Ready";
            }
        }, 1000);
    }
}
