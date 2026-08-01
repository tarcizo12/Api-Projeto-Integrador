import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

function normalizeHash(storedPassword: string): string {
  // htpasswd/PHP usam $2y$; o bcrypt do Node espera $2a$/$2b$.
  return storedPassword.replace(/^\$2y\$/, '$2a$');
}

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(
  plainPassword: string,
  storedPassword: string
): Promise<boolean> {
  if (!storedPassword) {
    return false;
  }

  if (storedPassword.startsWith('$2')) {
    return bcrypt.compare(plainPassword, normalizeHash(storedPassword));
  }

  return plainPassword === storedPassword;
}

export function isPasswordHashed(storedPassword: string): boolean {
  return storedPassword.startsWith('$2');
}
