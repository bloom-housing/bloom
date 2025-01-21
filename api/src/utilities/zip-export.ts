import { StreamableFile } from '@nestjs/common';
import archiver from 'archiver';
import fs, { createReadStream, ReadStream } from 'fs';
import { join } from 'path';

/**
 *
 * @param readStream
 * @param zipFilename
 * @param filename
 * @param isSpreadsheet
 * @returns a promise containing a streamable file
 */
export const zipExport = (
  readStream: ReadStream,
  zipFilename: string,
  filename: string,
  isSpreadsheet: boolean,
): Promise<StreamableFile> => {
  const zipFilePath = join(process.cwd(), `src/temp/${zipFilename}.zip`);

  return new Promise((resolve) => {
    // Create a writable stream to the zip file
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });
    output.on('close', () => {
      const zipFile = createReadStream(zipFilePath);
      resolve(new StreamableFile(zipFile));
    });

    archive.pipe(output);
    archive.append(readStream, {
      name: `${filename}.${isSpreadsheet ? 'xlsx' : 'csv'}`,
    });
    archive.finalize();
  });
};
