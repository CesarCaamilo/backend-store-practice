import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constants';
import { IResolvers } from '@graphql-tools/utils';
import JWT from '../lib/jwt';
import bcrypt from 'bcrypt';

const resolversQuery: IResolvers = {
    Query: {
        async users(_, __, { db }) {
            try {
                return {
                    status: true,
                    message: 'Lista cargada',
                    users: await db.collection(COLLECTIONS.USERS).find().toArray(),
                };
            } catch (error) {
                console.log(error);
                return {
                    status: false,
                    message: 'Error al cargar los datos',
                    users: [],
                };
            }
        },
        async login(_, { email, password }, { db }) {
            try {
                // Metodo para verificar si el usuario existe
                const user = await db
                    .collection(COLLECTIONS.USERS)
                    .findOne({ email });
                if (user === null) {
                    return {
                        status: false,
                        message: ' El usuario no existe',
                        token: null,
                    };
                }
                const passwordCheck = bcrypt.compareSync(password, user.password);

                if(passwordCheck !== null){
                    delete user.birthday;
                    delete user.password;
                    delete user.registerdate;
                }
                return {
                    status: true,
                    message:
                        !passwordCheck
                            ? 'Usuario y contrasena incorrectos'
                            : 'Inicio de sesion exitoso',
                    token:
                        !passwordCheck
                            ? null
                            : new JWT().sign({ user }, EXPIRETIME.H24),
                };
            } catch (error) {
                console.log(error);
                return {
                    status: false,
                    message: 'Error al cargar la informacion del usuario',
                    token: null,
                };
            }
        },
        me(_, __, { token }) {
            let info = new JWT().verify(token);
            if (info === MESSAGES.TOKEN_VERIFICATION_FAILED) {
                return {
                    status: false,
                    message: info,
                    user: null
                };
            }
            return {
                status: true,
                message: 'Se verifico el usuario correctamente con el token',
                user: Object.values(info)[0]
            };
        }
    },
};

export default resolversQuery;