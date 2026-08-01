import jwt, { SignOptions } from 'jsonwebtoken';

export type JwtPayload = {
  userId: number;
  email: string;
  isPsicologo: boolean;
  isPaciente: boolean;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET é obrigatório em produção');
    }
    console.warn('⚠️  JWT_SECRET não definido. Usando secret inseguro apenas para desenvolvimento.');
    return 'dev-only-insecure-secret';
  }
  return secret;
}

export function signAccessToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, getJwtSecret(), options);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}
