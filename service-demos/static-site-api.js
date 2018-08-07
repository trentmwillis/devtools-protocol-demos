const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

const getRandomInt = max => Math.floor(Math.random() * max);

const getRandomPost = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://pretty-okay.com/');

    const postLinks = await page.$$('.post-title > a');
    const postIndex = getRandomInt(postLinks.length);
    const postLink = postLinks[postIndex];

    const navigation = page.waitForNavigation();
    await postLink.click();
    await navigation;

    const title = await page.$eval('.banner-title', title => title.textContent.trim());
    const content = await page.$eval('.article-content', content => content.textContent.trim());
    const permalink = await page.url();

    await browser.close();

    return {
        title,
        content,
        permalink
    };
};

app.get('/post', async (request, response) => {
    response.json(await getRandomPost());
});

app.listen(port, () => console.log(`http://localhost:${port}`));
