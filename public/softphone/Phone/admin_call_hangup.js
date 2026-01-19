// admin_call_hangup.js

const net = require('net');
const express = require('express');
const app = express();
const port = 3000; // Change if needed

// Optional: Set your timezone if required via process.env.TZ
process.env.TZ = 'Asia/Kolkata'; // Match your PHP timezone if necessary

app.get('/admin_call_hangup', (req, res) => {
    const channel = req.query.channel;
    const host = '127.0.0.1';
    const portAMI = 5038;
    const username = 'cron';
    const password = '1234';

    const response = {};

    let socket = new net.Socket();
    let buffer = '';
    let loginSuccess = false;
    let hangupSuccess = false;

    socket.connect(portAMI, host, () => {
        // Send AMI login
        socket.write(`Action: Login\r\nUsername: ${username}\r\nSecret: ${password}\r\n\r\n`);
    });

    socket.on('data', (data) => {
        buffer += data.toString();

        // Handle login response
        if (!loginSuccess) {
            if (buffer.includes('Response: Success')) {
                loginSuccess = true;

                // Send hangup action
                socket.write(`Action: Hangup\r\nChannel: ${channel}\r\n\r\n`);
            } else if (buffer.includes('Response: Error')) {
                socket.end();
                return res.json({
                    status: 'error',
                    message: 'Login Failed'
                });
            }
        } else {
            // Handle hangup response
            if (buffer.includes('Response: Success')) {
                hangupSuccess = true;

                // Send logoff
                socket.write('Action: Logoff\r\n\r\n');
                socket.end();

                return res.json({
                    status: 'success',
                    message: `Channel ${channel} hung up successfully.`
                });
            }

            if (buffer.includes('Response: Error')) {
                socket.write('Action: Logoff\r\n\r\n');
                socket.end();

                return res.json({
                    status: 'error',
                    message: `Failed to hang up channel. Raw response: ${buffer}`
                });
            }
        }
    });

    socket.on('error', (err) => {
        return res.json({
            status: 'error',
            message: `Socket Error: ${err.message}`
        });
    });

    socket.on('end', () => {
        if (!hangupSuccess && loginSuccess) {
            return res.json({
                status: 'error',
                message: `Failed to hang up channel. Raw response: ${buffer}`
            });
        }
    });
});

app.listen(port, () => {
    console.log(`AMI Hangup API running at http://localhost:${port}/admin_call_hangup`);
});
