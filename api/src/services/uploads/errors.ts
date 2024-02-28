export class ConfigItemMissingError extends Error {
  constructor(item: string) {
    super(`Missing expected config item "${item}"`);
  }
}

export class ConfigInvalidValueError extends Error {
  constructor(item: string, format: string = null) {
    let msg = `Invalid value for config item "${item}"`;

    if (format) {
      msg += `; expected format is [${format}]`;
    }

    super(msg);
  }
}

export class ConfigInvalidEnumError extends Error {
  constructor(item: string, accepted: Array<string>) {
    super(
      `Invalid value for config item ${item}; accepted values are [${accepted.join(
        ',',
      )}]`,
    );
  }
}
