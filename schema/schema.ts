import { gql } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

const Schema = gql`
  type User {
    email: String!
    tipo: String!
    token: String!
    viajes: [viajes!]!
  }
  type Viaje {
    cliente: String!
    conductor: String!
    coche: User!
  }
  type Coche {
    matricula: String!
    status: String!
    conductor: [User!]!
    viajes: [viajes!]!
  }
  input ViajeInput {
    cliente: String!
    conductor: String
    coche: String
  }

  type Query {
    getCoches: [Coche!]!
    getClients(tipo: String!): [User!]!
    getConductores(tipo: String!): [User!]!
    getViajes: [Viaje!]!
    getCoche(id: String!): Coche
    getStatus(status: String!): [Coche!]!
  }
  type Mutation {
    signIn(name: String!, password: String!): Boolean!
    logIn(email: String!, password: String!): String!
    logOut: Boolean!    
  }
`;

export { Schema };
