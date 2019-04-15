const fs = require('fs');

const puppeteer = require('puppeteer-core');
require('lodash.product');
const _ = require('lodash');

(async () => {
  const browser = await puppeteer.launch({executablePath: "/usr/bin/google-chrome", headless: true});
  const page = await browser.newPage();
  await page.setViewport({ width: 675, height: 600 });

  const letters = "abcdefghijklmnopqrstuvwxyz";
  const arr_letters = letters.split('');
  const length = 4;
  let product = _.product(...Array(length).fill(arr_letters));
  let usernames = product.map(x => x.join(''));

  await page.goto('https://github.com');
  const USERNAME_SELECTOR = '.home-hero-signup > .form-group > dd > auto-check > input';
  await page.click(USERNAME_SELECTOR);

  for (let i of usernames) {
    await page.keyboard.type(i);
    await page.waitFor(3000);
    let result = await page.$('.is-autocheck-successful');

    if (result){
      console.log('Successful: ' + i);
      fs.appendFile('logs/successful.txt', `${i}\n`, function (err) {
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

  await browser.close();

})();