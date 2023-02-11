class Player {
    constructor(x, y, radius, color, health) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.health = health;
        this.velocity = {
            x:0,
            y:0
        }
        this.playerPower = {
            damage: 5, // max 20    upgrade +1 damage (5)
            movespeed: 0.5, // max 1     upgrade + 0.1 (5)
            bulletSpeed: 5, // max 8      upgrade +1 (3)
            bulletSize: 4, // max 8       upgrade +1 (3)
            reload: 20, // max 8       upgrade -2 (6)
            machineGunDuration: 2500, // max 4000      upgrade +500 (5)   
            machineGunReload: 15000, // max 10000     upgrade -1000 (5)
            laserBeamDuration: 1000, // max 3000
            laserBeamReload: 30000, // max 15000      
            chargeDuration: 200, // max 5            upgrade -3 (5)
            chargeReload: 40000, // max 15000  
            turretCharge: 3, // increase turret charge +3     
            list: ["player-movement", "shots without click"] 
            //player-movement, machine-gun, shot-gun, improved-shot-gun, homing-shots, charge-attack, laser-beam, shots without click
        }; 
        this.shieldPower = {
            damage: 10, // max 10
            speed: 0.02, // max 0.1
            size: 3, // max 9
            reload: 600, // max 300
            radianFactor: 200, // max 100
            shieldCharges: 1, // max: 5
            turretSize: 10, // max: 20
            list: [] 
            //shield-center, shield-stationary, shield-moving, shield-turret, shield-extra, shield-both-dir
        }; 
        this.autoPower = {
            damage: 10, // max 10
            speed: 5, // max 10
            size: 3, // size 8
            count: 2, // max 8
            reload: 600, // max: 200
            turretSize: 10, // max: 20
            list: [] 
            //auto-missiles, homing-auto, auto-turrets, nuclear-bomb
        };
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        const friction = 0.98;
        this.velocity.x *= friction;
        this.velocity.y *= friction;

        if (this.x + this.radius + this.velocity.x <= canvas.width && this.x - this.radius + this.velocity.x >= 0) {
            this.x += this.velocity.x;
        } else {
            this.velocity.x = 0;
        }

        if (this.y + this.radius + this.velocity.y <= canvas.height && this.y - this.radius + this.velocity.y >= 0) {
            this.y += this.velocity.y;
        } else {
            this.velocity.y = 0;
        }
    }
}

function playerFire() {
    const angle = Math.atan2(mouse.position.y - player.y, mouse.position.x - player.x);
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    if (player && player.playerPower.list.includes("shot-gun")) {
        // first shot
        projectiles.push(new Projectile(player.x, player.y, player.playerPower.bulletSize, 'white', velocity, "Linear", null, player.playerPower.damage, player.playerPower.bulletSpeed, false));
        // second shot
        const angleTwo = angle + 0.2;
        const velocityTwo = {
            x: Math.cos(angleTwo),
            y: Math.sin(angleTwo)
        }
        projectiles.push(new Projectile(player.x, player.y, player.playerPower.bulletSize, 'white', velocityTwo, "Linear", null, player.playerPower.damage, player.playerPower.bulletSpeed, false));
        // third shot
        const angleThree = angle - 0.2;
        const velocityThree = {
            x: Math.cos(angleThree),
            y: Math.sin(angleThree)
        }
        projectiles.push(new Projectile(player.x, player.y, player.playerPower.bulletSize, 'white', velocityThree, "Linear", null, player.playerPower.damage, player.playerPower.bulletSpeed, false));
        if (player && player.playerPower.list.includes("improved-shot-gun")) {
            // fourth shot
            const angleFour = angle + 0.4;
            const velocityFour = {
                x: Math.cos(angleFour),
                y: Math.sin(angleFour)
            }
            projectiles.push(new Projectile(player.x, player.y, player.playerPower.bulletSize, 'white', velocityFour, "Linear", null, player.playerPower.damage, player.playerPower.bulletSpeed, false));
            // fifth shot
            const angleFive = angle - 0.4;
            const velocityFive = {
                x: Math.cos(angleFive),
                y: Math.sin(angleFive)
            }
            projectiles.push(new Projectile(player.x, player.y, player.playerPower.bulletSize, 'white', velocityFive, "Linear", null, player.playerPower.damage, player.playerPower.bulletSpeed, false));
        }
    } else {
        projectiles.push(new Projectile(player.x, player.y, player.playerPower.bulletSize, 'white', velocity, "Linear", null, player.playerPower.damage, player.playerPower.bulletSpeed, false));
    }  
}