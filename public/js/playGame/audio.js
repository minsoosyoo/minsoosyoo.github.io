// audio
const shootAudio = new Howl({
    src: './public/audio/Basic_shoot_noise.wav',
    volume: 0.01
});
const damageTakenAudio = new Howl({
    src: './public/audio/Damage_taken.wav',
    volume: 0.05
})
const explodeAudio = new Howl({
    src: './public/audio/Explode.wav',
    volume: 0.1
})
const powerUpAudio = new Howl({
    src: './public/audio/Powerup_noise.wav',
    volume: 0.5
})
const deathAudio = new Howl({
    src: './public/audio/Death.wav',
    volume: 0.5
})
const healAudio = new Howl({
    src: './public/audio/Heal.wav',
    volume: 0.1
})
const laserAudio = new Howl({
    src: './public/audio/Jump.wav',
    volume: 0.1
})
const chargingAudio = new Howl({
    src: './public/audio/Select.wav',
    volume: 0.1
})
const backgroundAudio = new Howl({
    src: './public/audio/Hyper.wav',
    volume: 0.2,
    loop: true
})
