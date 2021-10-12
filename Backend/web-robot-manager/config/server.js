const fs = require('fs')

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'a2c2cb103440f556a52acc3a662fb9c4'),
    },
  },
});
