const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page, browser);

    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    // bring your user
    const user = await userFactory();
    // bring cookies from session factory
    const { session, sig } = sessionFactory(user);
    // set-cookies
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    // refresh the page
    await this.page.goto('http://localhost:3000/blogs', {
      waitUntil: 'domcontentloaded',
    });

    // two selectors for the same element, not very important but I'll leave that here
    // const anchorSelector1 = '.right li:nth-child(2) a';
    const anchorSelector = 'a[href="/auth/logout"]';

    await this.page.waitForSelector(anchorSelector);
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }
}

module.exports = CustomPage;
