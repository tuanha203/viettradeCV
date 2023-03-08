const i18n = require('i18n');
import path = require('path');

i18n.configure({
  locales: ['en', 'vi'],
  directory: path.join(__dirname, '..', '..', '..', 'lang'),
  defaultLocale: 'vi'
});
export default i18n;
