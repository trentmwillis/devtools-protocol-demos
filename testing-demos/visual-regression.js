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

const fs = require('fs');
const looksSame = require('looks-same');
const screenshot = async (page, title) => {
    if (!fs.existsSync('./.screenshots')) {
        fs.mkdirSync('./.screenshots');
    }
    const filePath = `./.screenshots/${title}.png`;
    if (fs.existsSync(filePath)) {
        const newFilePath = `./.screenshots/${title}-new.png`;
        await page.screenshot({
            path: newFilePath,
            fullPage: true
        });
        const result = await new Promise(resolve => looksSame(filePath, newFilePath, (err, equal) => resolve(equal)));
        fs.unlinkSync(newFilePath);
        return result;
    } else {
        await page.screenshot({
            path: filePath,
            fullPage: true
        });
        return true;
    }
};

testModule('End-To-End Tests', function(hooks) {
    hooks.before(async function() {
         this.browser = await puppeteer.launch();
    });

    hooks.after(async function() {
         await this.browser.close();
    });

    test('application loads, shows number of online users, can send a message, is accessible, and looks correct', async function(assert) {
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

        assert.ok(await screenshot(page, 'demo.4'));

        await page.close();
    });
});
