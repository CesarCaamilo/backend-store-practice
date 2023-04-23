import 'graphql-import-node';
import typeDefs from './schema.graphql';
import resolvers from './../resolvers';
const { makeExecutableSchema } = require('@graphql-tools/schema');
import { GraphQLSchema } from 'graphql';


//Schema.graphql
const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;