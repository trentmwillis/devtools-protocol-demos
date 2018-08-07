const puppeteer = require('puppeteer');
const QUnit = require('qunit');

const {
    module: testModule,
    test
} = QUnit;

testModule('End-To-End Tests', function(hooks) {
    hooks.before(async function() {
         this.browser = await puppeteer.launch();
    });

    hooks.after(async function() {
         await this.browser.close();
    });

    test('application loads and shows number of online users', async function(assert) {
        const page = await this.browser.newPage();
        await page.goto('https://chitchat.glitch.me/');

        const numClientsEl = await page.waitFor('#num-clients:not(:empty)');
        const numClients = await page.evaluate(element => element.textContent.trim(), numClientsEl);
        assert.equal(numClients, '1');

        await page.close();
    });
});
