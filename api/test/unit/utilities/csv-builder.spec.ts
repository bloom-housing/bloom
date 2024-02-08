import {
  buildFromIdIndex,
  escapeDoubleQuotes,
  formatValue,
} from '../../../src/utilities/csv-builder';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

describe('Testing csv builder helpers', () => {
  it('should not change a string with no double quotes', () => {
    expect(escapeDoubleQuotes('abcdef')).toEqual('abcdef');
  });

  it('should escape string with double quotes', () => {
    expect(escapeDoubleQuotes(`\"abcdef\"`)).toEqual('"abcdef"');
  });

  it('should return "" for undefined value', () => {
    expect(formatValue(undefined)).toEqual('');
  });

  it('should return "" for null value', () => {
    expect(formatValue(null)).toEqual('');
  });

  it('should return unchanged for simple string value', () => {
    expect(formatValue('abcdef')).toEqual(`\"abcdef\"`);
  });

  it('should return formatted string for complex value', () => {
    expect(
      formatValue({
        a: '"this is a field"',
        b: 17,
        c: [
          {
            d: 'yes',
            e: true,
          },
          {
            f: {
              g: 1,
              h: '"spaghetti',
            },
          },
        ],
      }),
    ).toEqual(
      `{\"a\":\"\"\"this is a field\"\"\",\"b\":17,\"c\":[{\"d\":\"yes\",\"e\":true},{\"f\":{\"g\":1,\"h\":\"\"\"spaghetti\"}}]}`,
    );
  });

  it('should return empty string when no keys present', () => {
    expect(buildFromIdIndex({})).toEqual('');
  });

  it('should parsed string when set of user data is passed in', () => {
    const date = new Date();
    const formattedDate = dayjs(date).format('MM-DD-YYYY HH:mmZ[Z]');

    const headerRow = `\"First Name\",\"Last Name\",\"Email\",\"Role\",\"Date Created\",\"Status\",\"Listing Names\",\"Listing Ids\",\"Last Logged In\"`;
    const dataRow = `\"fName\",\"LName\",\"Email\",\"Administrator\",\"${formattedDate}\",\"Confirmed\",\"Name 1, Name 2\",\"Id 1, Id 2\",\"${formattedDate}\"`;
    const data = {
      [randomUUID()]: {
        'First Name': 'fName',
        'Last Name': 'LName',
        Email: 'Email',
        Role: 'Administrator',
        'Date Created': formattedDate,
        Status: 'Confirmed',
        'Listing Names': 'Name 1, Name 2',
        'Listing Ids': 'Id 1, Id 2',
        'Last Logged In': formattedDate,
      },
    };
    expect(buildFromIdIndex(data)).toEqual(`${headerRow}\n${dataRow}\n`);
  });
});
