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

    test('application loads, shows number of online users, and does not retain FormData after sending messages', async function(assert) {
        const page = await this.browser.newPage();
        await page.goto('https://chitchat.glitch.me/');

        const numClients = await waitAndGetText(page, '#num-clients:not(:empty)');
        assert.equal(numClients, '1');

        for (let i = 0; i < 20; i++) {
            await sendMessage(page, `Message #${i}`);
        }

        const formDataProto = await page.evaluateHandle(() => FormData.prototype);
        const formDataInstances = await page.queryObjects(formDataProto);
        const count = await page.evaluate(formDatas => formDatas.length, formDataInstances);
        assert.equal(count, 0);

        await page.close();
    });
});
