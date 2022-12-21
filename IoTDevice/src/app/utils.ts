export function getRandomNumber(min: number, max: number): number {
    const ceil = Math.ceil(min);
    const floor = Math.floor(max);
    return Math.floor(Math.random() * (ceil - floor + 1)) + floor;
}

export function getTimestampInSeconds(): number {
    return Math.floor(Date.now() / 1000)
}