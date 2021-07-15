const withImages = require('next-images');

module.exports = withImages({
  webpack(config, { isServer }) {
    // Important: return the modified config

    // https://github.com/jsoma/tabletop/issues/158
    if (!isServer) {
      // eslint-disable-next-line no-param-reassign
      config.externals = ['tls', 'net', 'fs'];
    }
    return config;
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://map.data4sdgs.sensors.africa',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
});
