import enTranslations from '../i18n/en.json';

// Type for the translations object structure (nested object with string values)
type TranslationsObject = {
  [key: string]: TranslationsObject | string;
};

// Type for interpolation variables
type InterpolationVars = {
  [key: string]: string | number;
};

class I18nService {
  private currentLanguage: string = 'en';
  private translations: Record<string, TranslationsObject> = {
    en: enTranslations as unknown as TranslationsObject
  };

  /**
   * Get the current language code
   * @returns The current language code (e.g., 'en')
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Set the current language
   * @param langCode - The language code to set (e.g., 'en', 'es', 'fr')
   */
  setLanguage(langCode: string): void {
    if (this.translations[langCode]) {
      this.currentLanguage = langCode;
    } else {
      console.warn(`Language '${langCode}' not loaded. Falling back to '${this.currentLanguage}'.`);
    }
  }

  /**
   * Load translations for a specific language
   * @param langCode - The language code (e.g., 'en', 'es', 'fr')
   * @param translations - The translations object
   */
  loadTranslations(langCode: string, translations: TranslationsObject): void {
    this.translations[langCode] = translations;
    console.log(`Loaded translations for '${langCode}'`);
  }

  /**
   * Get a nested value from an object using a dot-notation path
   * @param obj - The object to traverse
   * @param path - The dot-notation path (e.g., 'auth.login.title')
   * @returns The value at the path or undefined if not found
   */
  private getNestedValue(obj: TranslationsObject, path: string): string | undefined {
    const keys = path.split('.');
    let current: any = obj;

    for (const key of keys) {
      if (current === undefined || current === null) return undefined;
      current = current[key];
    }

    return typeof current === 'string' ? current : undefined;
  }

  /**
   * Replace placeholders in a string with values
   * @param text - The text containing placeholders like {name}
   * @param vars - Object with key-value pairs for replacement
   * @returns The text with placeholders replaced by values
   */
  private interpolate(text: string, vars?: InterpolationVars): string {
    if (!vars) return text;
    
    return text.replace(/{([^{}]*)}/g, (match, key) => {
      const value = vars[key];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Translate a key with optional variable interpolation
   * @param key - The translation key in dot notation (e.g., 'auth.login.title')
   * @param vars - Optional variables for interpolation
   * @returns The translated string or the key itself if translation not found
   */
  translate(key: string, vars?: InterpolationVars): string {
    // Get translations for current language
    const translations = this.translations[this.currentLanguage];
    if (!translations) {
      console.warn(`No translations found for language '${this.currentLanguage}'`);
      return key;
    }

    // Get the translation
    const translation = this.getNestedValue(translations, key);
    
    // Return the key if translation not found
    if (!translation) {
      console.warn(`Translation key not found: '${key}'`);
      return key;
    }

    // Return the translation with variables interpolated
    return this.interpolate(translation, vars);
  }

  /**
   * Shorthand for translate
   * @param key - The translation key
   * @param vars - Optional variables for interpolation
   * @returns The translated string
   */
  t(key: string, vars?: InterpolationVars): string {
    return this.translate(key, vars);
  }
}

// Create and export a singleton instance
const i18n = new I18nService();
export default i18n;

// Export a shorthand function for convenience
export const t = (key: string, vars?: InterpolationVars): string => i18n.translate(key, vars);
