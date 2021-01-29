import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { GraphQLError } from "https://deno.land/x/oak_graphql@0.6.2/deps.ts";

import { ViajeSchema, CocheSchema } from "../mongo/schema.ts";

import { IContext, IViaje, IUser, ICoche } from "../types.ts";

const User = {
  viaje: async (
    parent: IUser,
    args: any,
    ctx: IContext
  ): Promise<IViaje[] | null> => {
    const db: Database = ctx.db;
    const ViajesCollection = db.collection<ViajeSchema>("ViajesCollection");

    const viajes = await ViajesCollection.find({ conductor: parent.email });
    const viajes = await ViajesCollection.find({ cliente: parent.email });
    return viajes.map((t) => {
      return {
        ...t,
      };
    });
  },

  coche: async (
    parent: IUser,
    args: any,
    ctx: IContext
  ): Promise<ICoche[] | null> => {
    const db: Database = ctx.db;
    const CochesCollection = db.collection<CocheSchema>(
      "CochesCollection"
    );

    const coches = await ComchesCollection.find({ conductor: parent.email });
    return coches.map((t) => {
      return {
        ...t,
      };
    });
  },
};

export { User };
