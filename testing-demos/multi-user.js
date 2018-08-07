const puppeteer = require('puppeteer');
const QUnit = require('qunit');

const {
    module: testModule,
    test
} = QUnit;

const openChat = async (browser) => {
    const page = await browser.newPage();
    await page.goto('https://chitchat.glitch.me/');

    await page.waitFor('#num-clients:not(:empty)');

    return page;
};

const sendMessage = async (page, messageText) => {
    await page.bringToFront();
    await page.type('#message', messageText, { delay: 50 });
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

    test('application loads and can send and receive messages with another user', async function(assert) {
        const page1 = await openChat(this.browser);
        const page2 = await openChat(this.browser);

        await sendMessage(page1, 'Hello, Nordic.js!');
        await sendMessage(page2, 'Hello, Trent!');

        await page1.waitForXPath(`//*/li[@class="message recipient"][text()="Hello, Trent!"]`);
        await page2.waitForXPath(`//*/li[@class="message recipient"][text()="Hello, Nordic.js!"]`);

        assert.ok(true);
    });
});