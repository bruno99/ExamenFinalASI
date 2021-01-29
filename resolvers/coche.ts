import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { GraphQLError } from "https://deno.land/x/oak_graphql@0.6.2/deps.ts";

import { ViajeSchema, UserSchema } from "../mongo/schema.ts";

import { IContext, IViaje, IUser, ICoche } from "../types.ts";

const Coche = {
  viaje: async (
    parent: ICoche,
    args: any,
    ctx: IContext
  ): Promise<IViaje[] | null> => {
    const db: Database = ctx.db;
    const ViajesCollection = db.collection<ViajeSchema>("ViajesCollection");

    const viajes = await ViajesCollection.find({ coche: parent.email });
    return viajes.map((t) => {
      return {
        ...t,
      };
    });
  },

};

export { Coche };
