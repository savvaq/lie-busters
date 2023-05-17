import path from 'node:path';

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    localePath: path.resolve('./public/locales'),
  },
};
