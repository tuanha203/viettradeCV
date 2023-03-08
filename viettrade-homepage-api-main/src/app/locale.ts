export default class LocaleService {
  i18nProvider: any;
  /**
   *
   * @param i18nProvider The i18n provider
   */
  constructor(i18n: any) {
    this.i18nProvider = i18n;
  }
  /**
   *
   * @returns {string} The current locale code
   */
  getCurrentLocale() {
    return this.i18nProvider.getLocale();
  }
  /**
   *
   * @returns string[] The list of available locale codes
   */
  getLocales() {
    return this.i18nProvider.getLocales();
  }
  /**
   *
   * @param locale The locale to set. Must be from the list of available locales.
   */
  setLocale(locale: string) {
    if (this.getLocales().indexOf(locale) !== -1) {
      this.i18nProvider.setLocale(locale);
    }
  }
  /**
   *
   * @param string String to translate
   * @param args Extra parameters
   * @returns {string} Translated string
   */
  translate(string: string, args = undefined) {
    return this.i18nProvider.__(string, args);
  }
  /**
   *
   * @param phrase Object to translate
   * @param count The plural number
   * @returns {string} Translated string
   */
  translateArrgs(data: { message: string; args: any[] }) {
    let str = this.i18nProvider.__(data.message).toString();
    data.args.map((item, index) => {
      str = str.replace(new RegExp(`%${index + 1}`, 'g'), item);
    });
    return str;
  }
}
