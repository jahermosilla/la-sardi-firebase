export default {
    sounds: {},

    play(id) {
        const audio = this.sounds[id];
        
        if (!audio) {
            return console.warn(`Audio '${id}' not found. Skipping reproduction.`);
        }

        audio.currentTime = 0;

        audio.play();
    },

    stop(id) {
        const audio = this.sounds[id];

        if (!audio) {
            return console.warn(`Audio '${id}' not found. Skipping stop.`);
        }

        audio.play();
    },

    stopAll() {
        Object.keys(this.sounds).forEach(audio => audio.stop());
    },

    addSound(id, soundPath) {
        this.sounds[id] = new Audio(soundPath);
        this.sounds[id].autoplay = true;
    }
}