import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

export default gql`
  type Usuario {
    email: String!
    rol: String!
    token: String!
    viajes: [Viaje!]!
    coche: Coche
  }

  type Coche {
    matricula: String!
    conductor: Usuario!
    viajes: [Viaje!]!
    estado: Boolean
  }

  type Viaje {
    id: String!
    conductor: Usuario!
    cliente: Usuario!
    coche: Coche!
  }

  input UserInput {
    email: String!
    password: String!
    rol: String!
    coche: String
  }

  input CarInput {
    matricula: String!
    estado: Boolean!
  }

  type Query {
    getCoches: [Coche!]!
    getClientes: [Usuario!]!
    getConductores: [Usuario!]!
    getViajes: [Viaje!]!
  }

  type Mutation {
    addUser(user: UserInput!): Boolean!
    addCar(car: CarInput!): Boolean!
    logIn(email: String!, password: String!): String!
    logOut: Boolean!
    avaliableCar: Boolean!
    carStatus(matricula: String!): Boolean!
  }
`;
