type ResetEntry = {
  codigo: string;
  expiresAt: number;
  tentativas: number;
};

const TTL_MS = 10 * 60 * 1000;
const MAX_TENTATIVAS = 5;

const store = new Map<string, ResetEntry>();

function limparExpirados(): void {
  const agora = Date.now();
  for (const [email, entry] of store.entries()) {
    if (entry.expiresAt <= agora) {
      store.delete(email);
    }
  }
}

export function salvarCodigoRecuperacao(email: string, codigo: string): void {
  limparExpirados();
  store.set(email, {
    codigo,
    expiresAt: Date.now() + TTL_MS,
    tentativas: 0,
  });
}

export function validarCodigoRecuperacao(email: string, codigo: string): boolean {
  limparExpirados();
  const entry = store.get(email);
  if (!entry) {
    return false;
  }

  if (entry.expiresAt <= Date.now()) {
    store.delete(email);
    return false;
  }

  entry.tentativas += 1;
  if (entry.tentativas > MAX_TENTATIVAS) {
    store.delete(email);
    return false;
  }

  if (entry.codigo !== codigo.trim()) {
    return false;
  }

  return true;
}

export function consumirCodigoRecuperacao(email: string): void {
  store.delete(email);
}
