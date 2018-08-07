const puppeteer = require('puppeteer');
const pti = require('puppeteer-to-istanbul');
const QUnit = require('qunit');

const {
    module: testModule,
    test
} = QUnit;

const openChat = async (browser) => {
    const page = await browser.newPage();

    await page.coverage.startJSCoverage();
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

const checkA11y = async (assert, page) => {
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/3.0.3/axe.min.js' });
    const results = await page.evaluate(() => axe.run(document));
    assert.equal(results.violations.length, 0);
};

const checkMemory = async (assert, page) => {
    const formDataProto = await page.evaluateHandle(() => FormData.prototype);
    const formDataInstances = await page.queryObjects(formDataProto);
    const count = await page.evaluate(formDatas => formDatas.length, formDataInstances);
    assert.equal(count, 0);
};

const writeCoverage = async (page) => {
    const jsCoverage = await page.coverage.stopJSCoverage();
    pti.write(jsCoverage);
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

        await checkA11y(assert, page1);
        await checkA11y(assert, page2);

        await checkMemory(assert, page1);
        await checkMemory(assert, page2);

        await writeCoverage(page1);
        await writeCoverage(page2);
    });
});