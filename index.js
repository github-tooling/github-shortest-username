const fs = require('fs');
const readLastLines = require('read-last-lines');

const puppeteer = require('puppeteer-core');
const { getPlatform } = require('chrome-launcher/dist/utils.js');
const chromeFinder = require('chrome-launcher/dist/chrome-finder.js');
require('lodash.product');
const _ = require('lodash');

(async () => {
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (await(chromeFinder)[getPlatform()]())[0];
  if (!executablePath) {
    throw new Error('Chrome / Chromium is not installed.');
  }

  const browser = await puppeteer.launch({executablePath, headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 675, height: 600 });

  const letters = "abcdefghijklmnopqrstuvwxyz";
  const arr_letters = letters.split('');
  const length = 4;
  let product = _.product(...Array(length).fill(arr_letters));
  let usernames = product.map(x => x.join(''));

  await page.goto('https://github.com');
  const USERNAME_SELECTOR = '#user\\[login\\]';
  await page.click(USERNAME_SELECTOR);

  await readLastLines.read('logs/successful.txt', 1)
    .then( async (line) => {

      if (line === '') line = usernames[0];

      usernames = usernames.splice(usernames.indexOf(line) + 1);

      for (let i of usernames) {
        await page.keyboard.type(i);
        await page.waitFor(3000);
        let result = await page.$('.is-autocheck-successful');

        if (result){
          console.log('Successful: ' + i);
          fs.appendFile('logs/successful.txt', `\n${i}`, function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
        } else {
          console.log('Error: ' + i);
        }

        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
      }

    });

  // await browser.close();

})();
