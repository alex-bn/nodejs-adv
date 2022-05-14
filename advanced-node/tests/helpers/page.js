const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
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

  get(path) {
    return this.page.evaluate(_path => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => response.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          // whenever we call post, we pass in the path and some object, data.
          // data gets provided to the evaluate call, data gets turned into a string, it gets communicated over to our chromium instance, it gets turned back into an object, and then is provided as the second argument to our inner function right here, which we are calling _data
          // we then take _data, we turn it into a json, and we included with our actual post req
          body: JSON.stringify(_data),
        }).then(response => response.json());
      },
      path,
      data
    );
  }

  execRequest(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
