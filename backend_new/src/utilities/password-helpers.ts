import { randomBytes, scrypt } from 'crypto';
const SCRYPT_KEYLEN = 64;
const SALT_SIZE = SCRYPT_KEYLEN;

export const isPasswordValid = async (
  storedPasswordHash: string,
  incomingPassword: string,
): Promise<boolean> => {
  const [salt, savedPasswordHash] = storedPasswordHash.split('#');
  const verifyPasswordHash = await hashPassword(
    incomingPassword,
    Buffer.from(salt, 'hex'),
  );
  return savedPasswordHash === verifyPasswordHash;
};

export const hashPassword = async (
  password: string,
  salt: Buffer,
): Promise<string> => {
  return new Promise<string>((resolve, reject) =>
    scrypt(password, salt, SCRYPT_KEYLEN, (err, key) =>
      err ? reject(err) : resolve(key.toString('hex')),
    ),
  );
};

export const passwordToHash = async (password: string): Promise<string> => {
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  // TODO: redo how we append the salt to the hash
  return `${salt.toString('hex')}#${hash}`;
};

export const generateSalt = (size = SALT_SIZE) => {
  return randomBytes(size);
};
