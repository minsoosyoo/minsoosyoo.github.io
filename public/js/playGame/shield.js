class Shield {
    constructor(x, y, radius, color, radians, radianFactor, type, damage, spinRate, shieldCharges) {
        this.x = x;
        this.y = y;
        this.center = {
            x: x,
            y: y
        }
        this.radius = radius;
        this.color = color;
        this.radians = radians;
        this.radianFactor = radianFactor;
        this.damage = damage;
        if (player.shieldPower.list.includes("shield-both-dir")) {
            this.spinRate = Math.random() < 0.5 ? 0-spinRate : spinRate;
        } else {
            this.spinRate = spinRate;
        }
        this.type = type;
        this.gotHit = false;
        this.shieldCharges = shieldCharges;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    update() {
        // center
        this.draw();

        if (this.type === 'shield-center') {
            this.center.x = canvas.width/2;
            this.center.y = canvas.height/2;
            this.radians += this.spinRate;
            this.x = this.center.x + Math.cos(this.radians) * this.radianFactor;
            this.y = this.center.y + Math.sin(this.radians) * this.radianFactor;
        } else if (this.type === 'shield-stationary') {
            this.radians += this.spinRate;
            this.x = this.center.x + Math.cos(this.radians) * this.radianFactor;
            this.y = this.center.y + Math.sin(this.radians) * this.radianFactor;
        } else if (this.type === 'shield-moving') {
            this.radians += this.spinRate;
            this.x = player.x + Math.cos(this.radians) * this.radianFactor;
            this.y = player.y + Math.sin(this.radians) * this.radianFactor;
        }
    }
}

// shield projectile around player
function spawnShield(x, y, type) {
    const radians = 0;
    if (shields.length <= 10) {
        shields.push(new Shield(x, y, player.shieldPower.size, 'blue', radians, player.shieldPower.radianFactor, type, player.shieldPower.damage, player.shieldPower.speed, player.shieldPower.shieldCharges));
    }
}