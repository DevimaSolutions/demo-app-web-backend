export const env = {
  string<T extends string = string>(key: string, defaultValue?: T): T {
    const value = process.env[key.trim()];
    return (value || defaultValue || '') as T;
  },
  boolean(key: string, defaultValue = false): boolean {
    const stringValue = this.string(key);
    if (stringValue !== '') {
      return stringValue?.toLowerCase() === 'true';
    }

    return defaultValue;
  },
  number(key: string, defaultValue: number): number {
    const stringValue = this.string(key);
    if (stringValue !== '') {
      return Number.isNaN(Number(stringValue)) ? defaultValue : Number(stringValue);
    }

    return defaultValue;
  },
  array(key: string, delimiter = ','): string[] {
    const stringValue = this.string(key);
    return stringValue.split(delimiter).filter(Boolean);
  },
};
