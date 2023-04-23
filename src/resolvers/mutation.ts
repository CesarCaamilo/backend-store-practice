import { COLLECTIONS } from '../config/constants';
import { IResolvers } from '@graphql-tools/utils';
import bcrypt from 'bcrypt';

const resolversMutation: IResolvers = {
    Mutation: {
        async register(_, { user }, { db }) {
            const userCheck = await db.collection(COLLECTIONS.USERS).
            findOne({email: user.email});

            if(userCheck !== null){
                return {
                    status: false,
                    message: `El email ${user.email} ya esta registrado`,
                    user: null
                };
            }
            const lastUser = await db
                .collection(COLLECTIONS.USERS)
                .find()
                .limit(1)
                .sort({ registerdate: -1 })
                .toArray();
            if (lastUser.length === 0) {
                user.id = 1;
            } else {
                user.id = lastUser[0].id + 1;
            }
            user.registerdate = new Date().toISOString();
            user.password = bcrypt.hashSync(user.password, 10);

            // Guardar los datos en mongoDB
            return await db
                .collection(COLLECTIONS.USERS)
                .insertOne(user)
                .then(async () => {
                    return {
                        status: true,
                        message: `Bienvenido ${user.email} te has registrado correctamente`,
                        user
                    };

                })
                .catch((err: Error) => {
                    console.log(err.message);
                    return {
                        status: false,
                        message: 'Error al hacer el registro ',
                        user: null
                    };
                });
        },
    },
};

export default resolversMutation;