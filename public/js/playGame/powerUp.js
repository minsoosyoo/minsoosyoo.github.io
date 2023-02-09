class PowerUp {
    constructor({position = {x:0, y:0}, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.image = new Image();
        this.image.src = './public/images/lightningBolt.png';
        this.alpha = 1;
        gsap.to(this, {
            alpha: 0,
            duration: 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'linear'
        })
        this.radians = 0;
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha;
        c.translate(this.position.x + this.image.width/2, this.position.y + this.image.height/2);
        c.rotate(this.radians);
        c.translate(-this.position.x - this.image.width/2, -this.position.y - this.image.height/2);
        c.drawImage(this.image, this.position.x, this.position.y);
        c.restore();
    }

    update() {
        this.draw();
        this.radians += 0.01;
        this.position.x += this.velocity.x;
    }
}

function spawnPowerUps(enemy) {
    // if spawn from enemy
    let newPowerUp;
    if (enemy) {
        newPowerUp = new PowerUp({
            position: {
                x: enemy.x,
                y: enemy.y
            },
            velocity: {
                x: 0,
                y: 0
            }
        })
        powerUps.push(newPowerUp);
    } else {
        newPowerUp = new PowerUp({
            position: {
                x: 0,
                y: Math.random()*canvas.height
            },
            velocity: {
                x: Math.random() + 1, 
                y: 0
            },
        })
        powerUps.push(newPowerUp);
    }
    return newPowerUp;    
}


