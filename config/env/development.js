'use strict';

module.exports =
{"root":"/home/alex/projects/udlapp/demoapi/mobile-backend","http":{"port":3000},"https":{"port":false},"ssl":{"key":"","cert":""},"db":"mongodb://localhost/mean-dev","templateEngine":"swig","sessionSecret":"MEAN","sessionCollection":"sessions","sessionCookie":{"path":"/","httpOnly":true,"secure":false,"maxAge":null},"sessionName":"connect.sid","debug":true,"logging":{"format":"tiny"},"aggregate":false,"mongoose":{"debug":false},"app":{"name":"UdL Mobile app Center"},"facebook":{"clientID":"DEFAULT_APP_ID","clientSecret":"APP_SECRET","callbackURL":"http://localhost:3000/auth/facebook/callback"},"twitter":{"clientID":"DEFAULT_CONSUMER_KEY","clientSecret":"CONSUMER_SECRET","callbackURL":"http://localhost:3000/auth/twitter/callback"},"github":{"clientID":"DEFAULT_APP_ID","clientSecret":"APP_SECRET","callbackURL":"http://localhost:3000/auth/github/callback"},"google":{"clientID":"DEFAULT_APP_ID","clientSecret":"APP_SECRET","callbackURL":"http://localhost:3000/auth/google/callback"},"linkedin":{"clientID":"DEFAULT_API_KEY","clientSecret":"SECRET_KEY","callbackURL":"http://localhost:3000/auth/linkedin/callback"},"emailFrom":"SENDER EMAIL ADDRESS","mailer":{"service":"SERVICE_PROVIDER"},"auth":{"user":"EMAIL_ID","pass":"PASSWORD"}};

/*'use strict';

module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',
  debug: true,
  logging: {
    format: 'tiny'
  },
  //  aggregate: 'whatever that is not false, because boolean false value turns aggregation off', //false
  aggregate: false,
  mongoose: {
    debug: false
  },
  app: {
    name: 'MEAN - FullStack JS - Development'
  },
  facebook: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: 'DEFAULT_CONSUMER_KEY',
    clientSecret: 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  github: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: 'DEFAULT_API_KEY',
    clientSecret: 'SECRET_KEY',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  emailFrom: 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'SERVICE_PROVIDER', // Gmail, SMTP
    auth: {
      user: 'EMAIL_ID',
      pass: 'PASSWORD'
    }
  }
};*/
