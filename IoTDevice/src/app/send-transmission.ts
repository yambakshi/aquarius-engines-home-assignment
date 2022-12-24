import http from 'http';
import { Transmission } from './models/transmission';

export function sendTransmission(transmission: Transmission): Promise<any> {
    const options = {
        host: 'localhost',
        path: '/api/monitor',
        method: 'POST',
        port: 7095,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    const data = JSON.stringify(transmission);

    return new Promise((resolve, reject) => {
        const request = http.request(options);
        request.on('response', res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            })

            res.on('end', () => {
                resolve(data);
            })
        })

        request.on('error', (err) => {
            reject(err);
        })

        request.write(data);
        request.end();
    })
}