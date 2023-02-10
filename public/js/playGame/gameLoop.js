// end game when conditions met
function endGame() {
    console.log("game has ended");
    cancelAnimationFrame(animationId);
    clearInterval(enemyIntervalId);
    clearInterval(machineGunCDId);
    clearInterval(laserBeamCDId);
    clearInterval(chargeAttackCDId);
    clearInterval(nuclearBombCDId);
    restartModal.style.display = "block";
    skillTree.style.display = "none";
    gsap.fromTo('.restart-modal', {
        scale: 0.8,
        opacity: 0
    }, {
        scale: 1,
        opacity: 1,
        ease: 'expo'
    })
    modalScore.innerHTML = score;
}

function continueGame(){
    if (gamePaused) {
        console.log("game continuing");
        gamePaused = false;
        spawnEnemies(spawnRate);
        animate(fps);
        machineGunCD();
        laserBeamCD();
        chargeAttackCD();
        nuclearBombCD();
    }
}

function pauseGame() {
    console.log("game paused");
    cancelAnimationFrame(animationId);
    clearInterval(enemyIntervalId);
    clearInterval(machineGunCDId);
    clearInterval(laserBeamCDId);
    clearInterval(chargeAttackCDId);
    clearInterval(nuclearBombCDId);
    pauseModal.style.display = "block";
    gsap.fromTo('.pause-modal', {
        scale: 0.8,
        opacity: 0
    }, {
        scale: 1,
        opacity: 1,
        ease: 'expo'
    })
    pauseModalScore.innerHTML = score;  
}

// main game loop
function animate(fps) {
    setTimeout(()=>{

        animationId = requestAnimationFrame(animate);
    
        frames++;
        c.fillStyle = 'rgba(0,0,0,0.1)';
        c.fillRect(0, 0, canvas.width, canvas.height);
    
        // game end condition

        backgroundParticles.forEach((backgroundParticle) => {
            backgroundParticle.draw();

            const dist = Math.hypot(
                player.x - backgroundParticle.position.x, 
                player.y - backgroundParticle.position.y
            );

            if (dist < 100) {
                backgroundParticle.alpha = 0;
                
                if (dist > 70) {
                    backgroundParticle.alpha = 0.5;
                }
            } else if (dist > 100 && backgroundParticle.alpha < 0.1) {
                backgroundParticle.alpha += 0.01;
            } else if (dist > 100 && backgroundParticle.alpha > 0.1) {
                backgroundParticle.alpha -= 0.01;
            }
        });

        player.update();
        if (player.radius < 10) {
            deathAudio.play();
            for (let i=0; i<player.radius; i++) {
                particles.push(new Particle(player.x, player.y, Math.random() * 2, player.color, {x: (Math.random()-0.5) * (Math.random()*6), y: (Math.random()-0.5) * (Math.random()*6)}));
            }
            endGame();
        }
    
        // pause game
        if (gamePaused) {
            pauseGame();
        }
    
        // power up
        if (frames > 0 && frames % 20000 === 0 & powerUpDropChance > 0.02) {
            powerUpDropChance -= 0.01;
        }
    
        if (frames > 0 && frames % 10000 === 0 && Math.random() < powerUpDropChance && !powerUpDropped) {
            console.log("spawning power");
            powerUpDropped = true;
            spawnPowerUps();
            // open power-up selection modal
            setTimeout(()=>{
                powerUpDropped = false;
            }, 5000);
        }
        if (frames % 2500 === 0 && frames > 0 && !justPoweredUp) {
            powerUpMessage.innerHTML = `Reward for Your Persistence!`;
            justPoweredUp = true;
            choosePowerUp();
        }
    
        for(let i=powerUps.length-1; i>=0; i--) {
            const powerUp = powerUps[i];
            if (powerUp.position.x > canvas.width) {
                powerUps.splice(i, 1);
            } else {
                powerUp.update();
            }
    
            const dist = Math.hypot(player.x-powerUp.position.x, player.y-powerUp.position.y);
            if (dist < powerUp.image.height/2 + player.radius && !justPoweredUp) {
                powerUpAudio.play();
                justPoweredUp = true;
                createScoreLabel({
                    position: {
                        x: player.x,
                        y: player.y
                    },
                    score: "Powered Up",
                    color: "yellow"
                });
                powerUps.splice(i, 1);
                powerUpMessage.innerHTML = `You Hit Lightning in a Bottle!`;
                choosePowerUp();
            }
        }
    
        // ENEMY: n rate as time increases
        if (frames > 0 && frames % 5000 === 0) {
            if (powerUpDropChance >= 0.05) {
                powerUpDropChance -= 0.01;
            }
            if (enemyRadiusMax < 110) {
                enemyRadiusMax+=10;
            }
            if (spawnRate > 500) {
                clearInterval(enemyIntervalId);
                spawnRate -= 50;
                spawnEnemies(spawnRate);
            }
        }
        // ENEMY: enemy speed increase over time
        if (frames > 0 && frames % 10000 === 0 && enemySpeedIncrease < 1.1) {
            enemySpeedIncrease+=0.1;
        }
        // ENEMY: enemy types increase over time
        if (frames > 0 && frames % 5000 === 0 && numEnemyTypes < 4) {
            numEnemyTypes++;
        }
        if (frames > 100000) {
            numEnemyTypes === 5;
        }
    
        // ENEMY: spawn a Boss
        if (frames > 0 && frames % 2000 === 0) {
            spawnBoss();
        }
    
        // PLAYER POWER: shots without click
        if (player.playerPower.list.includes("shots without click") && playerCanFire) {
            if (frames % player.playerPower.reload === 0) {
                shootAudio.play();
                playerFire();
            }
        }
        
        // PLAYER POWER: machine gun
        if (machineGunEnabled && player.playerPower.list.includes("machine-gun")) {
            playerCanFire = false;
            console.log("machine gun firing");
            
            player.color = "yellow";
    
            const angle = Math.atan2(mouse.position.y - player.y, mouse.position.x - player.x);
            const velocity = {
                x: Math.cos(angle)*5,
                y: Math.sin(angle)*5
            }
            if (frames % 4 === 0) {
                shootAudio.play();
                projectiles.push(new Projectile(player.x, player.y, 5, "yellow", velocity, "Linear", null, player.playerPower.damage+10, player.playerPower.bulletSpeed, false));
            }
        }
    
        // PLAYER POWER: laser beam
        if (laserBeamEnabled && player.playerPower.list.includes("laser-beam")) {
            playerCanFire = false;
            console.log("laser beam firing");
            
            player.color = "orange";
            
            const angle = Math.atan2(mouse.position.y - player.y, mouse.position.x - player.x);
            const velocity = {
                x: Math.cos(angle)*0.8,
                y: Math.sin(angle)*0.8
            }
            if (frames % 2 === 0) {
                laserAudio.play();
                projectiles.push(new Projectile(player.x, player.y, 5, "orange", velocity, "Linear", null, player.playerPower.damage+8, player.playerPower.bulletSpeed + 5, true));
            }
        }
    
        // PLAYER POWER: charge attack
        if (player.playerPower.list.includes("charge-attack") && charging && chargeAttackUseable) {
            playerCanFire = false;
            if (chargeFrames%40===0) {
                chargingAudio.play()
            }
            chargeFrames++;
            laserBeamUseable = false;
            machineGunUseable = false;
            if (chargeFrames > 0 && chargeFrames < 40) {
                player.color = "#FEF001";
            } else if (chargeFrames >= 40 && chargeFrames < 80) {
                player.color = "#FFCE03";
            } else if (chargeFrames >= 80 && chargeFrames < 120) {
                player.color = "#FD9A01";
            } else if (chargeFrames >= 120 && chargeFrames < 160) {
                player.color = "#FD6104";
            } else if (chargeFrames >= 160 && chargeFrames < 200) {
                player.color = "#FF2C05";
            } else if (chargeFrames >= 200) {
                player.color = "red";
            }
        }
    
        // UPDATE: particle explosion
        for(let index=particles.length-1; index>=0; index--) {
            const particle = particles[index];
            if (particle.alpha <= 0) {
                particles.splice(index, 1);
            } else {
                particle.update();
            }
        }    
        // UPDATE: projectiles created by player on click
        for(let index=projectiles.length-1; index>=0; index--) {
            const projectile = projectiles[index];
            projectile.update();
            // remove from edges of screen
            if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
                projectiles.splice(index, 1);   
            }
        }
        // UPDATE: auto projectiles spawned
        for(let index=autoProjectiles.length-1; index>=0; index--) {
            const projectile = autoProjectiles[index];
            projectile.update();
            // remove from edges of screen
            if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
                autoProjectiles.splice(index, 1);
            }
        }
        // UPDATE: shield spawned
        for(let index=shields.length-1; index>=0; index--) {
            const shield = shields[index];
            shield.update();
        }
    
        // UPDATE: turret spawned
        for(let index=turrets.length-1; index>=0; index--) {
            const turret = turrets[index];
            turret.update();
        }
    
        // UPDATE: fire shield projectiles
        if (player.shieldPower.list.includes("shield-moving") && frames % player.shieldPower.reload === 0) {
            laserAudio.play();
            spawnShield(player.x, player.y, "shield-moving");
        } else if (player.shieldPower.list.includes("shield-stationary") && frames % player.shieldPower.reload === 0) {
            laserAudio.play();
            spawnShield(player.x, player.y, "shield-stationary");
        } else if (player.shieldPower.list.includes("shield-center") && frames % player.shieldPower.reload === 0) {
            laserAudio.play();
            spawnShield(player.x, player.y,"shield-center");
        }
    
        // enemies randomly spawn on the edges of the screen
        for (let index=enemies.length-1; index>=0; index--) {
            const enemy = enemies[index];
            enemy.update();
            if (enemy.radius < 3) {
                if (Math.random() < powerUpDropChance && !powerUpDropped) {
                    healAudio.play();
                    spawnPowerUps(enemy);
                    powerUpDropped = true;
                    setTimeout(()=>{
                        powerUpDropped = false;
                    }, 5000);
                }
                enemies.splice(index, 1);
                score += 50;
            }
            // game over condition
            const dist = Math.hypot(player.x-enemy.x, player.y-enemy.y);
            if (dist - enemy.radius - player.radius < 1) {
                // end game
                for (let i=0; i<Math.floor(player.radius/2); i++) {
                    particles.push(new Particle(player.x, player.y, Math.random() * 2, player.color, {x: (Math.random()-0.5) * (Math.random()*6), y: (Math.random()-0.5) * (Math.random()*6)}));
                }
                if (player.radius > 10) {
                    damageTakenAudio.play();
                    gsap.to(player, {
                        radius: player.radius - 2
                    });
                } else {
                    deathAudio.play();
                    endGame();
                }
            }
            // projectiles fired by players
            for (let pIndex=projectiles.length-1; pIndex>=0; pIndex--) {
                const projectile = projectiles[pIndex];
                const dist = Math.hypot(projectile.x-enemy.x, projectile.y-enemy.y);
                // when projectile and enemy touch
                if (dist - enemy.radius - projectile.radius < 1) {
                    // create explosion
                    if (enemy.radius < 20) {
                        for (let i=0; i<Math.floor(enemy.radius/2); i++) {
                            particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: (Math.random()-0.5) * (Math.random()*6), y: (Math.random()-0.5) * (Math.random()*6)}));
                        }
                    }
                    if (enemy.radius - projectile.damage > 5 && !projectile.didDamage) {
                        damageTakenAudio.play();
                        // increase score
                        setTimeout(()=>{
                            projectile.didDamage = true;
                        }, 1500);
                        score += 100;
                        createScoreLabel({
                            position: {
                                x: projectile.x,
                                y: projectile.y
                            },
                            score: 100,
                            color: "white"
                            });
                        scoreText.innerHTML = score;
                        gsap.to(enemy, {
                            radius: enemy.radius - projectile.damage
                        })
                        if (!projectile.isALaser) {
                            projectiles.splice(pIndex, 1);
                        }
                    } else {
                        // increase score
                        createScoreLabel({
                            position: {
                                x: projectile.x,
                                y: projectile.y
                            },
                            score: 200,
                            color: "yellow"
                        });
                        score += 200;
                        scoreText.innerHTML = score;
                        if (Math.random() < powerUpDropChance && !powerUpDropped) {
                            
                            // let indexOfPowerUp = (element) => element === spawnPowerUps(enemy);
                            let = newPowerUp = spawnPowerUps(enemy);
                            let indexOfPowerUp = (element) => element === newPowerUp;
                            // console.log("indexOfPowerUP", indexOfPowerUp);
                            healAudio.play();
                            powerUpDropped = true;
                            setTimeout(()=>{
                                if (powerUps[powerUps.findIndex(indexOfPowerUp)]) {
                                    powerUps.splice(powerUps.findIndex(indexOfPowerUp), 1);
                                }
                                powerUpDropped = false;
                            }, 5000);
                        }
                        explodeAudio.play();
                        enemies.splice(index, 1);
                        if (!projectile.isALaser) {
                            projectiles.splice(pIndex, 1);
                        }
                    }
                }
            }
    
            // fire auto projectiles
            if (player.autoPower.list.includes("auto-missiles") && frames % player.autoPower.reload === 0) {
                shootAudio.play();
                spawnAutoProjectiles(player, enemy, player.autoPower.count, "Linear");
            } else if (player.autoPower.list.includes("homing-auto") && frames % player.autoPower.reload === 0) {
                shootAudio.play();
                spawnAutoProjectiles(player, enemy, player.autoPower.count, "Homing");
            }
    
            for (let pIndex=autoProjectiles.length-1; pIndex>=0; pIndex--) {
                const projectile = autoProjectiles[pIndex];
                const dist = Math.hypot(projectile.x-enemy.x, projectile.y-enemy.y);
                if (dist - enemy.radius - projectile.radius < 1) {
                    // create explosion
                    if (enemy.radius < 20) {
                        for (let i=0; i<Math.floor(enemy.radius/2); i++) {
                            particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: (Math.random()-0.5) * (Math.random()*6), y: (Math.random()-0.5) * (Math.random()*6)}));
                        }
                    }
                    if (enemy.radius - projectile.damage > 5) {
                        // increase score
                        damageTakenAudio.play();
                        createScoreLabel({
                            position: {
                                x: projectile.x,
                                y: projectile.y
                            },
                            score: 100,
                            color: "white"
                        });
                        score += 100;
                        scoreText.innerHTML = score;
                        gsap.to(enemy, {
                            radius: enemy.radius - projectile.damage
                        })
                        autoProjectiles.splice(pIndex, 1);
                    } else {
                        // increase score
                        score += 200;
                        scoreText.innerHTML = score;
                        createScoreLabel({
                            position: {
                                x: projectile.x,
                                y: projectile.y
                            },
                            score: 200,
                            color: "yellow"
                        });
                        if (Math.random() < powerUpDropChance && !powerUpDropped) {
                            spawnPowerUps(enemy);
                            healAudio.play();
                            powerUpDropped = true;
                            setTimeout(()=>{
                                powerUpDropped = false;
                            }, 10000);
                        }
                        explodeAudio.play();
                        enemies.splice(index, 1);
                        autoProjectiles.splice(pIndex, 1);
                    }
                }
            }
            
            //  shield collision
            for (let sIndex=shields.length-1; sIndex>=0; sIndex--) {
                const shield = shields[sIndex];
                const dist = Math.hypot(shield.x-enemy.x, shield.y-enemy.y);
                // when shield and enemy touch
                if (dist - enemy.radius - shield.radius < 5) {
                    shield.gotHit = true;
                    if (shield.gotHit) {
                        setTimeout(()=>{
                            shield.shieldCharges--;
                        }, 1000);
                    }
                    if (enemy.radius < 20) {
                        for (let i=0; i<Math.floor(enemy.radius/2); i++) {
                            particles.push(new Particle(shield.x, shield.y, Math.random() * 2, enemy.color, {x: (Math.random()-0.5) * (Math.random()*6), y: (Math.random()-0.5) * (Math.random()*6)}));
                        }
                    }
                    if (shield.gotHit && enemy.radius - shield.damage > 5) {
                        damageTakenAudio.play();
                        if (shield.shieldCharges <= 1) {
                            shields.splice(sIndex, 1);
                        }
                        createScoreLabel({
                            position: {
                                x: shield.x,
                                y: shield.y
                            },
                            score: 100,
                            color: "white"
                        });
                        score += 100;
                        scoreText.innerHTML = score;
                        gsap.to(enemy, {
                            radius: enemy.radius - shield.damage
                        })
                    } else if (shield.gotHit){
                        if (shield.shieldCharges <= 1) {
                            shields.splice(sIndex, 1);
                        }
                        createScoreLabel({
                            position: {
                                x: shield.x,
                                y: shield.y
                            },
                            score: 200,
                            color: "yellow"
                        });
                        score += 200;
                        scoreText.innerHTML = score;
                        if (Math.random() < powerUpDropChance && !powerUpDropped) {
                            healAudio.play();
                            spawnPowerUps(enemy);
                            powerUpDropped = true;
                            setTimeout(()=>{
                                powerUpDropped = false;
                            }, 10000);
                        }
                        explodeAudio.play();
                        enemies.splice(index, 1);
                        shields.splice(sIndex, 1);
                    }
                    shield.gotHit = false;
                }
            }
            
            for (let tIndex=turrets.length-1; tIndex>=0; tIndex--) {
                const turret = turrets[tIndex];
                const dist = Math.hypot(turret.x-enemy.x, turret.y-enemy.y);
                if (dist - enemy.radius - turret.radius < 1) {
                    for (let i=0; i<turret.radius; i++) {
                        particles.push(new Particle(turret.x, turret.y, Math.random() * 2, turret.color, {x: (Math.random()-0.5) * (Math.random()*6), y: (Math.random()-0.5) * (Math.random()*6)}));
                    }
                    if (turret.radius > 5) {
                        damageTakenAudio.play();
                        gsap.to(turret, {
                            radius: turret.radius - 2
                        });
                        gsap.to(enemy, {
                            radius: enemy.radius - 2
                        });
                        score += 10;
                    } else {
                        if (Math.random() < powerUpDropChance && !powerUpDropped) {
                            healAudio.play();
                            spawnPowerUps(enemy);
                            powerUpDropped = true;
                            setTimeout(()=>{
                                powerUpDropped = false;
                            }, 10000);
                        }
                        deathAudio.play();
                        enemies.splice(index, 1);
                        turrets.splice(tIndex, 1);
                        score += 20;
                    }
                }
            }
        }
    }, 1000/fps);
}
