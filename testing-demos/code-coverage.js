const puppeteer = require('puppeteer');
const pti = require('puppeteer-to-istanbul');
const QUnit = require('qunit');

const {
    module: testModule,
    test
} = QUnit;

const waitAndGetText = async (page, selector) => {
    const element = await page.waitFor(selector);
    return await page.evaluate(element => element.textContent.trim(), element);
};

const sendMessage = async (page, messageText) => {
    await page.type('#message', messageText);
    await page.click('#send');
    await page.waitForXPath(`//*/li[@class="message sender"][text()="${messageText}"]`);
};

testModule('End-To-End Tests', function(hooks) {
    hooks.before(async function() {
         this.browser = await puppeteer.launch();
    });

    hooks.after(async function() {
         await this.browser.close();
    });

    test('application loads, shows number of online users, can send a message, and reports JS usage', async function(assert) {
        const page = await this.browser.newPage();

        await page.coverage.startJSCoverage();

        await page.goto('https://chitchat.glitch.me/');

        const numClients = await waitAndGetText(page, '#num-clients:not(:empty)');
        assert.equal(numClients, '1');
        await sendMessage(page, 'Hello!');

        const jsCoverage = await page.coverage.stopJSCoverage();
        pti.write(jsCoverage);

        await page.close();
    });
});
