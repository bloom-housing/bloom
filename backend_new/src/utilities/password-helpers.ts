import { randomBytes, scrypt } from 'crypto';
const SCRYPT_KEYLEN = 64;
const SALT_SIZE = SCRYPT_KEYLEN;

/*
  verifies that the hash of the incoming password matches the stored password hash
*/
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

/*
  hashes the incoming password with the incoming salt
*/
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

/*
  hashes and salts the incoming password
*/
export const passwordToHash = async (password: string): Promise<string> => {
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  // TODO: redo how we append the salt to the hash
  return `${salt.toString('hex')}#${hash}`;
};

/*
  generates a random salt
*/
export const generateSalt = (size = SALT_SIZE) => {
  return randomBytes(size);
};

/*
  verifies the password's TTL is still valid
*/
export const isPasswordOutdated = (
  passwordValidForDays: number,
  passwordUpdatedAt: Date,
): boolean => {
  return (
    new Date(
      passwordUpdatedAt.getTime() + passwordValidForDays * 24 * 60 * 60 * 1000,
    ) < new Date()
  );
};
