const fs = require('fs');

const puppeteer = require('puppeteer-core');
require('lodash.product');
const _ = require('lodash');

(async () => {
  const browser = await puppeteer.launch({executablePath: "/usr/bin/google-chrome", headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 675, height: 600 });

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const arr_letters = letters.split('');
  const success = [];
  let product = _.product(...Array(2).fill(arr_letters));
  let usernames = product.map(x => x.join(''));

  await page.goto('https://github.com');
  const USERNAME_SELECTOR = '.home-hero-signup > .form-group > dd > auto-check > input';
  await page.click(USERNAME_SELECTOR);

  for (let i of usernames) {
    await page.keyboard.type(i);
    await page.waitFor(3000);
    let result = await page.$('.is-autocheck-successful');
  
    if (!result){
      console.log('errored ' + i);
    } else {
      success.push(i);
      console.log('successful ' + i);
    }

    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
  }
 
  await browser.close();
  
  fs.writeFile('successful.txt', success, (err) => {
    if (err) throw err;
    console.log('successful username saved!');
  });

})();