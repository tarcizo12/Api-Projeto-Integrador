type RecordWithPassword = Record<string, unknown> & { senha?: unknown };

function toPlainObject(user: unknown): RecordWithPassword {
  if (!user || typeof user !== 'object') {
    return {};
  }

  const maybeModel = user as { get?: (options?: { plain: boolean }) => RecordWithPassword };
  if (typeof maybeModel.get === 'function') {
    return maybeModel.get({ plain: true });
  }

  return { ...(user as RecordWithPassword) };
}

export function sanitizeUser<T>(user: T): Omit<T, 'senha'> {
  const plain = toPlainObject(user);
  const { senha: _senha, ...safeUser } = plain;
  return safeUser as Omit<T, 'senha'>;
}
