const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = user => {
  // create your session object
  const sessionObject = {
    passport: {
      user: user._id,
    },
  };

  // session: encode to base64
  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

  // sig: sign the session with your cookie key
  // 'session=' is completely arbitrary, you can check the cookie-session lib
  const sig = keygrip.sign('session=' + session);

  return { session, sig };
};
