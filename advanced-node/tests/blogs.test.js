const mongoose = require('mongoose');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

// disconnect mongoose or jest will not exit
afterAll(() => {
  mongoose.connection.close();
});

describe('When logged in', () => {
  beforeEach(async () => {
    await page.login();
    await page.click('.fixed-action-btn > a');
  });

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('.title > label');
    expect(label).toEqual('Blog Title');
  });
});
