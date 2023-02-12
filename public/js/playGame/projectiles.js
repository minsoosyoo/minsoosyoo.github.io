class Projectile {
    constructor(x, y, radius, color, velocity, type, enemy, damage=10, speed=2, isALaser=false) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.type = type;
        if (enemy) {
            this.target = enemy;
        }
        this.damage = damage;
        this.speed = speed;
        this.isALaser = isALaser;
        this.didDamage = false;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        if (this.type === "Linear") {
            this.x = this.x + this.velocity.x * this.speed;
            this.y = this.y + this.velocity.y * this.speed;
        } else if (enemies.includes(this.target) && this.type === "Homing") {
            const angle = Math.atan2(this.target.y-this.y, this.target.x-this.x);
            this.velocity.x = Math.cos(angle);
            this.velocity.y = Math.sin(angle);
            this.x = this.x + this.velocity.x * this.speed;
            this.y = this.y + this.velocity.y * this.speed;      
        } else {
            this.x = this.x + this.velocity.x * this.speed;
            this.y = this.y + this.velocity.y * this.speed;
        }
    }
}

// auto projectiles that shoot from player
function spawnAutoProjectiles(start, shots, type) {
    for (let index=enemies.length-1; index>=enemies.length - 1 - shots; index--) {
        const enemy = enemies[index];
        const angle = Math.atan2(enemy.y - start.y, enemy.x - start.x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        autoProjectiles.push(new Projectile(start.x, start.y, player.autoPower.size, 'yellow', velocity, type, enemy, player.autoPower.damage, player.autoPower.speed));
    }    
}

