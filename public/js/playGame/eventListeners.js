// if you tab out
document.addEventListener('visibilitychange', ()=> {
    if (document.hidden) {
        gamePaused = true;
    } else if (gamePaused && pauseModal.style.display === "none") {
        continueGame();
    }    
});

// pause modal
pause.addEventListener("click", ()=>{
    gamedPaused = true;
})

continueBtn.addEventListener("click", ()=> {
    continueGame();
    gsap.to('.pause-modal', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.in',
        onComplete: ()=>{
            pauseModal.style.display = "none";
        }
    });
})

// restart modal
restart.addEventListener("click", ()=>{
    if (!backgroundAudio.playing()) {
        backgroundAudio.play();
    }
    init();
    resetTalent();
    animate(fps);
    spawnEnemies(spawnRate);

    console.log("starting player power: ", player.playerPower.list);
    gsap.to('.restart-modal', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.in',
        onComplete: ()=>{
            restartModal.style.display = "none";
        }
    });
})

// start model
start.addEventListener("click", ()=>{
    if (!backgroundAudio.playing()) {
        backgroundAudio.play();
    }
    init();
    resetTalent();
    animate(60);
    spawnEnemies(spawnRate);
    console.log("starting player power: ", player.playerPower.list);
    gsap.to('.start-modal', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.in',
        onComplete: ()=>{
            startModal.style.display = "none";
        }
    });
})

// if window changes sizes
window.addEventListener('resize', ()=>{
    canvas.width=innerWidth;
    canvas.height=innerHeight;
})

// player shooting skills
addEventListener('click', (e)=> {
    if (player.playerPower.list.includes("shots without click") || !playerCanFire) {
        return;
    }

    playerFire();
})

addEventListener('mousemove', (e)=>{
    mouse.position.x = e.clientX;
    mouse.position.y = e.clientY;
})


addEventListener('mousedown', ()=>{
    if (player && player.playerPower.list.includes("charge-attack") && chargeAttackUseable && !chargeAttackCDStarted) {
        charging = true;
    }
})

addEventListener('mouseup', (e)=>{
    if (player && player.playerPower.list.includes("charge-attack") && charging && chargeAttackUseable && chargeFrames >= player.playerPower.chargeDuration) {
        chargeAttackText.style.color = "white";
        chargeAttackFired = true;
        chargeAttackCDStarted = true;
        chargeAttackCD();
        const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        projectiles.push(new Projectile(player.x, player.y, 100, 'red', velocity, "Linear", null, 80, player.playerPower.bulletSpeed, true));
        charging = false;
        if (!playerCanFire) {
            playerCanFire = true;
        }
        if (!machineGunCDStarted) {
            machineGunUseable = true;
        }
        if (!laserBeamCDStarted) {
            laserBeamUseable = true;
        }
        chargeFrames = 0;
        player.color = "white";
    } else if (player && player.playerPower.list.includes("charge-attack") && charging && chargeAttackUseable && chargeFrames < player.playerPower.chargeDuration) {
        chargeAttackFired = false;
        charging = false;
        if (!playerCanFire) {
            playerCanFire = true;
        }
        if (!machineGunCDStarted) {
            machineGunUseable = true;
        }
        if (!laserBeamCDStarted) {
            laserBeamUseable = true;
        }
        chargeFrames = 0;
        player.color = "white";
    }
})

addEventListener('keydown', function(e) {
    // clear board
    switch(e.key) {
        // clear the board power up
        case 'Enter':
            if (player.autoPower.list.includes("nuclear-bomb") && !nuclearBombEnabled && !nuclearBombCDStarted) {
                explodeAudio.play();
                nuclearBombText.style.color = "white";
                nuclearBombCDStarted = true;
                nuclearBombCD();
                
                c.fillStyle = 'yellow';
                c.fillRect(0, 0, canvas.width, canvas.height);
                for (let index=enemies.length-1; index>=0; index--) {
                    const enemy = enemies[index];
                    for (let i=0; i<Math.floor(enemy.radius/2); i++) {
                        particles.push(new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color, {x: (Math.random()-0.5) * (Math.random()*6), y: (Math.random()-0.5) * (Math.random()*6)}));
                    }
                    if (enemy.radius <= 100) {
                        // increase score
                        createScoreLabel({
                            position: {
                                x: enemy.x,
                                y: enemy.y
                            },
                            score: 100,
                            color: "pink"
                        });
                        score += 100;
                        scoreText.innerHTML = score;                
                        enemies.splice(index, 1);
                    } else if (enemy.radius > 100){
                        createScoreLabel({
                            position: {
                                x: enemy.x,
                                y: enemy.y
                            },
                            score: 50,
                            color: "white"
                        });
                        score += 50;
                        scoreText.innerHTML = score;   
                        enemy.radius = Math.floor(enemy.radius/2); 
                    }
                }
                nuclearBombEnabled = true;
            }
            if (player.autoPower.list.includes("nuclear-bomb") && !nuclearBombEnabled) {
                setTimeout(()=>{
                    c.fillStyle = 'rgba(0,0,0,0.1)';
                    c.fillRect(0, 0, canvas.width, canvas.height);
                }, 2000);
            }
            break;
        // player movement
        case 'd':
            if (player.playerPower.list.includes("player-movement")) {;
                player.velocity.x += player.playerPower.movespeed;
            }
            break;
        case 'a':
            if (player.playerPower.list.includes("player-movement")) {
                player.velocity.x -= player.playerPower.movespeed;
            }
            break;
        case 'w':
            if (player.playerPower.list.includes("player-movement")) {
                player.velocity.y -= player.playerPower.movespeed;
            }
            break;
        case 's':
            if (player.playerPower.list.includes("player-movement")) {
                player.velocity.y += player.playerPower.movespeed;
            }
            break;
       
        case '1':
            if (player.playerPower.list.includes("machine-gun") && machineGunUseable && !machineGunEnabled && !machineGunCDStarted && !gamePaused) {
                machineGunEnabled = true;
                console.log("machineGunEnabled", machineGunEnabled);
                machineGunText.style.color = "white";
                machineGunCDStarted = true;
                machineGunCD();
                chargeAttackUseable = false;
                laserBeamUseable = false;

                setTimeout(()=> {
                    machineGunEnabled = false;
                    console.log("machineGunEnabled", machineGunEnabled);
                    machineGunUseable = false;
                    if (!playerCanFire) {
                        playerCanFire = true;
                    }
                    if (!chargeAttackCDStarted) {
                        chargeAttackUseable = true;
                    }
                    if (!laserBeamCDStarted) {
                        laserBeamUseable = true;
                    }

                    player.color = "white";

                    console.log("machine gun has finished firing!");
                }, player.playerPower.machineGunDuration);   
            }
            break;
        case '2':
            if (player.playerPower.list.includes("laser-beam") && laserBeamUseable && !laserBeamEnabled && !laserBeamCDStarted && !gamePaused) {
                laserBeamEnabled = true;
                laserBeamText.style.color = "white";
                laserBeamCDStarted = true;
                laserBeamCD();  
                chargeAttackUseable = false;
                machineGunUseable = false;

                setTimeout(()=>{
                    laserBeamEnabled = false;
                    laserBeamUseable = false;
                    if (!playerCanFire) {
                        playerCanFire = true;
                    }
                    if (!chargeAttackCDStarted) {
                        chargeAttackUseable = true;
                    }
                    if (!machineGunCDStarted) {
                        machineGunUseable = true;
                    }
                    
                    player.color = "white";

                    console.log("laser beam finished");
                }, player.playerPower.laserBeamDuration);  

            }
            break;
        case '3':
            if (player.shieldPower.list.includes("shield-turret") && !shieldTurretActivated && player.playerPower.turretCharge > 0 && turrets.length <= 10 && !gamePaused) {
                shieldTurretActivated = true;
                player.playerPower.turretCharge--;
                turretsChargeText.innerHTML = `${player.playerPower.turretCharge}`;
                spawnShieldTurret(player.x, player.y);
                setTimeout(()=>{
                    shieldTurretActivated = false;
                }, 1000);
            }
            break;
        case '4':
            if (player.autoPower.list.includes("auto-turret") && !autoTurretActivated && player.playerPower.turretCharge > 0 && turrets.length <= 10 && !gamePaused) {
                autoTurretActivated = true;
                player.playerPower.turretCharge--;
                turretsChargeText.innerHTML = `${player.playerPower.turretCharge}`;
                spawnAutoTurret(player.x, player.y);
                setTimeout(()=>{
                    autoTurretActivated = false;
                }, 1000);
            }
            break;
        case 'p':
            if (!gamePaused) {
                gamePaused = true;
            }
            break; 
        case 'Shift':
            // shiftPressed = true;
            // console.log("shift is pressed", shiftPressed);
            // console.log("one");
            break;
        case 'Escape': {
            if (!gamePaused) {
                gamePaused = true;
            }
            break; 
        }
    }
})

// addEventListener("keyup", function(e) {
//     if (e.key === "Shift") {
//         setTimeout(()=>{
//             shiftPressed = false;
//             console.log("shift is not pressed", !shiftPressed);
//         }, 1000)
//     }
// })
