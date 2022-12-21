import { getRandomNumber } from './utils';

export function generateSineSignal() {
    const signal = getRandomNumber(0, 32);
    return signal;
}

export function generateStateSignal() {
    const signal = getRandomNumber(256, 4095);
    return signal;
}