// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  const articles = await page.$$eval(".athing", (items) => {
    return items.slice(0, 100).map(item => {
      const title = item.querySelector(".titleline a") ? item.querySelector(".titleline a").textContent : "No Title";
      const timestamp = item.querySelector(".age") ? item.querySelector(".age").textContent : "No Timestamp";
      return { title, timestamp };
    });
  });

  let previousTimestamp = null;

  for (let i = 0; i < articles.length; i++) {
    const currentTimestamp = articles[i].timestamp;

    if (previousTimestamp && currentTimestamp < previousTimestamp) {
      console.log(`Articles are not sorted correctly!`);
      console.log(`Article at position ${i + 1} is out of order: ${articles[i].title}`);
      await browser.close();
      return;
    }
    previousTimestamp = currentTimestamp;
  }

  console.log("Articles are correctly sorted from newest to oldest.");

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
