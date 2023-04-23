import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import environments from './config/environments';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import { IContext } from './interfaces/context.interface';
// Variables de entorno
if(process.env.NODE_ENV !== 'production'){
    const env = environments;
    console.log(env);
}

async function init() {
    const app = express();
    app.use(cors());
    app.use(compression());

    const database = new Database();
    const db = await database.init();
    const context = async({req, connection}: IContext) => {
        const token = (req) ? req.headers.authorization : connection.authorization;
        return { db, token };
    };

    // Apollo server
    const server = new ApolloServer({
        schema,
        introspection: true,
        context
    });

    // apollo
    await server.start();
    server.applyMiddleware({app});
    app.get('/',expressPlayground({
        endpoint: 'graphql'
    }));

    const httpServer = createServer(app);
    const PORT =process.env.PORT || 8000;

    httpServer.listen(
        {
            port: PORT
        },
        () => console.log(`Server running at http://localhost:${PORT}`)
    );
}
init();
