import {
  Application,
  Router,
  RouterContext,
} from "https://deno.land/x/oak@v6.3.2/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import { applyGraphQL } from "https://deno.land/x/oak_graphql/mod.ts";

import Schema from "./schema/gqlSchema.ts";
import Query from "./resolvers/queries.ts";
import Mutation from "./resolvers/mutations.ts";
import Coche from "./resolvers/coche.ts";
import Usuario from "./resolvers/usuario.ts";
import { UsuarioSchema } from "./schema/mongoSchema.ts";

const resolvers = {
  Query,
  Mutation,
  Coche,
  Usuario,
};

try {
  // connect to Mongo DB
  const DB_URL = Deno.env.get("DB_URL");
  const DB_NAME = Deno.env.get("DB_NAME");

  if (!DB_URL || !DB_NAME) {
    throw Error("Please define DB_URL and DB_NAME on .env file");
  }

  const client = new MongoClient();
  client.connectWithUri(DB_URL);
  const db = client.database(DB_NAME);

  const app = new Application();

  app.use(async (ctx, next) => {
    const value = await ctx.request.body().value;
    // it allows launching of graphql playground
    if (!value || value.operationName === "IntrospectionQuery") {
      await next();
    } else {
      const noAuthResolvers = ["addUser", "logIn"];
      if (noAuthResolvers.some((elem) => value.query.includes(elem))) {
        await next();
      } else {
        const token = ctx.request.headers.get("token") || "none";
        const rol = ctx.request.headers.get("rol") || "none";
        console.log(token);
        const user = await db
          .collection<UsuarioSchema>("UsersCollection")
          .findOne({ token, rol });
        if (user) {
          ctx.state.user = user;

          let resolvers = [""];
          if (rol === "cliente") resolvers = ["availableCar", "logOut"];
          if (rol === "conductor") resolvers = ["addCar", "carStatus, logOut"];
          if (rol === "admin")
            resolvers = [
              "getCoches",
              "getClientes",
              "getConductores",
              "getViajes",
              "logOut",
            ];

          if (resolvers.some((elem) => value.query.includes(elem))) {
            await next();
          } else {
            ctx.response.status = 403;
            ctx.response.body = { error: "Unauthorized User" };
          }
        } else {
          ctx.response.status = 401;
          ctx.response.body = { error: "Authentication Error" };
        }
      }
    }
  });

  const GraphQLService = await applyGraphQL<Router>({
    Router,
    path: "/graphql",
    typeDefs: Schema,
    resolvers: resolvers,
    context: (ctx: RouterContext) => {
      return {
        ctx,
        db,
        user: ctx.state.user,
      };
    },
  });

  app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

  const PORT: number = Number(Deno.env.get("PORT")) || 4000;
  console.log(`Listening on port ${PORT}...`);
  await app.listen({ port: PORT });
} catch (e) {
  console.error(e);
}
