const express = require('express');
const { spawn } = require('child_process');
const app = express();
const colors = require('colors');
const path = require('path');

const port = process.env.PORT || 3000;
let botProcess;

const config = require('./config.json');
const User = require("./database/users");
const Thread = require("./database/threads");

let users = [];
let threads = [];

async function onBot() {
    botProcess = spawn('node', ['main.js'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    botProcess.on('close', (code) => {
        if (code === 2) {
            console.log('Restarting BotBee...'.red);
            onBot();
        } else if (code !== 0) {
            console.error(`Bot process exited with code ${code}`);
        }
    });
}

onBot();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard-data', async (req, res) => {
    try {
        const uptime = process.uptime();
        const dashboardData = {
            botName: config.botName,
            prefix: config.prefix,
            adminName: config.adminName,
            totalUsers: users.length,
            totalThreads: threads.length,
            uptime
        };
        res.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`.cyan);
});
