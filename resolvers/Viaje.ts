import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { GraphQLError } from "https://deno.land/x/oak_graphql@0.6.2/deps.ts";

import { UserSchema, CocheSchema } from "../mongo/schema.ts";

import { IUser, ICoche, IViaje, IContext } from "../types.ts";

const Viaje = {
  conductor: async (
    parent: { conductor: string },
    args: any,
    ctx: IContext
  ): Promise<IUser | null> => {
    const db: Database = ctx.db;
    const UsersCollection = db.collection<UserSchema>("UsersCollection");

    const user = await UsersCollection.findOne({ email: parent.conductor });
    return user;
  },

  cliente: async (
    parent: { cliente: string },
    args: any,
    ctx: IContext
  ):Promise<IUser | null> => {
    const db: Database = ctx.db;
    const UsersCollection = db.collection<UserSchema>("UsersCollection");

    const user = await UsersCollection.findOne({ email: parent.cliente });
    return user;
  },
  coche: async (
    parent: { coche: string },
    args: any,
    ctx: IContext
  ):Promise<ICoche | null> => {
    const db: Database = ctx.db;
    const CochesCollection = db.collection<CocheSchema>("CochesCollection");

    const coche = await CochesCollection.findOne({ matricula: parent.coche });
    return coche;
  },

};

export { Viaje };
