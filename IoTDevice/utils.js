function getRandomNumber(min, max) {
    const ceil = Math.ceil(min);
    const floor = Math.floor(max);
    return Math.floor(Math.random() * (ceil - floor + 1)) + floor;
}

function getTimestampInSeconds() {
    return Math.floor(Date.now() / 1000)
}

module.exports = {
    getRandomNumber,
    getTimestampInSeconds
}