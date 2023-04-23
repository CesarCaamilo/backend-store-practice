// Config de las variables de entorno
import environment from './environments';

if (process.env.NODE_ENV !== 'production') {
    const env = environment;
}
// clave del token
export const SECRET_KEY = process.env.SECRET || 'servidordeprueba';

export enum COLLECTIONS {
    USERS = 'users'
}

export enum MESSAGES {
    TOKEN_VERIFICATION_FAILED = 'Token Invalido o caducado'
}
// Tiempo de caducidad token
export enum EXPIRETIME{
    H1 = 60 * 60,
    H24 = 24 * H1,
    M15 = H1 / 4,
    M20 = H1 / 3,
    D5 = H24 * 5
}