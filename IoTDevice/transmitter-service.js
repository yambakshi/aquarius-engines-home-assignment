const http = require('http');

function transmitSignal(signal) {
    const options = {
        host: 'localhost',
        path: '/api/iotsignals',
        method: 'POST',
        port: 7095,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    const data = JSON.stringify(signal);

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

module.exports = {
    transmitSignal
}