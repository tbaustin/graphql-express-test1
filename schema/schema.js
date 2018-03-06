import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList
} from 'graphql';
import axios from 'axios';

const baseURL = 'http://localhost:3000';

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`${baseURL}/companies/${parentValue.id}/users`)
          .then(response => response.data);
      }
    }
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`${baseURL}/companies/${parentValue.companyId}`)
          .then(response => response.data);
      }
    }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`${baseURL}/users/${args.id}`)
          .then(response => response.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`${baseURL}/companies/${args.id}`)
          .then(response => response.data);
      }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery
});
