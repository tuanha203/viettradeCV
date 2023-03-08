"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LocaleService {
    /**
     *
     * @param i18nProvider The i18n provider
     */
    constructor(i18n) {
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
    setLocale(locale) {
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
    translate(string, args = undefined) {
        return this.i18nProvider.__(string, args);
    }
    /**
     *
     * @param phrase Object to translate
     * @param count The plural number
     * @returns {string} Translated string
     */
    translateArrgs(data) {
        let str = this.i18nProvider.__(data.message).toString();
        data.args.map((item, index) => {
            str = str.replace(new RegExp(`%${index + 1}`, 'g'), item);
        });
        return str;
    }
}
exports.default = LocaleService;
//# sourceMappingURL=locale.js.map