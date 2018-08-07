const parser = require('body-parser');
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

const playback = async (commands) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    while (commands.length) {
        const command = commands.shift();
        await page[command.action](...command.args);
    }

    await browser.close();

    return {
        message: 'Success!'
    };
};

app.use(parser.json());

app.post('/playback', async (request, response) => {
    const commands = request.body.commands;

    if (!Array.isArray(commands) || commands.length === 0) {
        return response.status(400).send({
            message: 'Must provide an array of commands to playback'
        });
    } else if (!commands.every(command => command.action && command.args)) {
        return response.status(400).send({
            message: 'Every command must define an action to perform and arguments for it to operate on'
        });
    }

    response.json(await playback(commands));
});

app.listen(port, () => console.log(`http://localhost:${port}`));
