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

// #
describe('When logged in', () => {
  beforeEach(async () => {
    await page.login();
    await page.click('.fixed-action-btn > a');
  });

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('.title > label');
    expect(label).toEqual('Blog Title');
  });

  // a
  describe('And using valid inputs', () => {
    beforeEach(async () => {
      await page.type('.title input', 'My title');
      await page.type('.content input', 'My content');
      await page.click('form button');
    });

    //
    test('Submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('form > h5');
      expect(text).toEqual('Please confirm your entries');
    });

    //
    test('Submitting then saving adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitForSelector('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('.card-content p');

      expect(title).toEqual('My title');
      expect(content).toEqual('My content');
    });
  });

  // b
  describe('And using invalid inputs', () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    //
    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

// #
describe('User is not logged in', () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs',
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'T',
        content: 'C',
      },
    },
  ];

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequest(actions);

    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });

  // // a
  // test('User cannot create blog post', async () => {
  //   const result = await page.post('/api/blogs', { title: 'T', content: 'C' });
  //   expect(result).toEqual({ error: 'You must log in!' });
  // });

  // // b
  // test('User cannot get a list of posts', async () => {
  //   const result = await page.get('/api/blogs');
  //   await expect(result).toEqual({ error: 'You must log in!' });
  // });
});
