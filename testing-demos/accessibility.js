const puppeteer = require('puppeteer');
const QUnit = require('qunit');

const {
    module: testModule,
    test
} = QUnit;

const waitAndGetText = async (page, selector) => {
    const element = await page.waitFor(selector);
    return await page.evaluate(element => element.textContent.trim(), element);
};

testModule('End-To-End Tests', function(hooks) {
    hooks.before(async function() {
         this.browser = await puppeteer.launch();
    });

    hooks.after(async function() {
         await this.browser.close();
    });

    test('application loads, shows number of online users, can send a message, and is accessible', async function(assert) {
        const page = await this.browser.newPage();
        await page.goto('https://chitchat.glitch.me/');

        const numClients = await waitAndGetText(page, '#num-clients:not(:empty)');
        assert.equal(numClients, '1');

        const message = 'Hello, Nordic.js!';
        await page.type('#message', message);
        await page.click('#send');

        const displayedText = await waitAndGetText(page, '.message');
        assert.equal(displayedText, message);

        await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/3.0.3/axe.min.js' });
        const results = await page.evaluate(() => axe.run(document));

        assert.equal(results.violations.length, 0);

        await page.close();
    });
});
