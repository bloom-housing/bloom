/**
 * @param data string data
 * @returns a string where double quotes (") are escaped properly for csv export
 */
export const escapeDoubleQuotes = (data: string): string => {
  return data.replace(/\\"/g, `""`);
};

/**
 * @param value the value that we want to format for csv export
 * @returns escaped json stringified version of the incoming value
 */
export const formatValue = (value: any): string => {
  return value !== undefined && value !== null
    ? escapeDoubleQuotes(JSON.stringify(value))
    : '';
};

export interface KeyNumber {
  [key: string]: number;
}

/**
 * Builds the csv from the incoming data
 * @param obj the key should be the Id of the record coming in, and the value is the field(s)
 * @returns csv formatted string
 */
export const buildFromIdIndex = (
  obj: { [key: string]: any },
  extraHeaders?: { [key: string]: number },
  extraGroupKeys?: (
    group: string,
    obj?: { [key: string]: any },
  ) => { nested: boolean; keys: string[] },
): string => {
  const headerIndex: { [key: string]: number } = {};
  const rootKeys = Object.keys(obj);

  if (rootKeys.length === 0) return '';

  const initialKeys = obj[rootKeys[0]];
  let index = 0;

  Object.keys(initialKeys).forEach((key) => {
    // if the key is in extra headers, we want to group them all together
    if (extraHeaders && extraHeaders[key] && extraGroupKeys) {
      const groupKeys = extraGroupKeys(key, initialKeys);
      for (let i = 1; i < extraHeaders[key] + 1; i++) {
        const headerGroup = groupKeys.nested ? `${key} (${i})` : key;
        groupKeys.keys.forEach((groupKey) => {
          headerIndex[`${headerGroup} ${groupKey}`] = index;
          index++;
        });
      }
    } else {
      headerIndex[key] = index;
      index++;
    }
  });
  const headers = Object.keys(headerIndex);

  // init arrays to insert data
  const rows = Array.from({ length: rootKeys.length }, () =>
    Array(headers.length),
  );

  // set rows data
  rootKeys.forEach((id, rowNumber) => {
    const record = obj[id];
    Object.keys(record).forEach((key) => {
      const val = record[key];
      const groupKeys = extraGroupKeys && extraGroupKeys(key, initialKeys);
      if (extraHeaders && extraHeaders[key] && groupKeys) {
        const ids = Object.keys(val);
        if (groupKeys.nested && ids.length) {
          Object.keys(val).forEach((sub_id, i) => {
            const headerGroup = `${key} (${i + 1})`;
            groupKeys.keys.forEach((groupKey) => {
              const column = headerIndex[`${headerGroup} ${groupKey}`];
              rows[rowNumber][column] = formatValue(val[sub_id][groupKey]);
            });
          });
        } else if (groupKeys.nested === false) {
          Object.keys(val).forEach((sub_key) => {
            const column = headerIndex[`${key} ${sub_key}`];
            rows[rowNumber][column] = formatValue(val[sub_key]);
          });
        }
      } else {
        const column = headerIndex[key];
        let value;
        if (Array.isArray(val)) {
          value = val.join(', ');
        } else if (val instanceof Object) {
          value = Object.keys(val)
            .map((key) => val[key])
            .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
            .join(', ');
        } else {
          value = val;
        }
        rows[rowNumber][column] = formatValue(value);
      }
    });
  });

  let csvString = headers.reduce((accumulator, curr) => {
    return `${accumulator}${accumulator.length ? ',' : ''}"${escapeDoubleQuotes(
      curr,
    )}"`;
  }, '');
  csvString += '\n';

  // turn rows into csv format
  rows.forEach((row) => {
    if (row.length) {
      csvString += row.join(',');
      csvString += '\n';
    }
  });

  return csvString;
};
