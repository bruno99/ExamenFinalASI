// deno-lint-ignore-file
import { Database } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

import { UsuarioSchema, ViajeSchema } from "../schema/mongoSchema.ts";
import { IUsuario, IContext, IViaje } from "../schema/datatypesSchema.ts";

const Coche = {
  conductor: async (
    parent: { conductor: string },
    args: any,
    ctx: IContext,
    info: any
  ): Promise<IUsuario | null> => {
    const db: Database = ctx.db;
    const usersCollection = db.collection<UsuarioSchema>("UsersCollection");

    const user = await usersCollection.findOne({ email: parent.conductor });
    return user;
  },

  viajes: async (
    parent: { viajes: string },
    args: any,
    ctx: IContext,
    info: any
  ) => {
    const db: Database = ctx.db;
    const viajesCollection = db.collection<ViajeSchema>("ViajesCollection");

    const viajes = await viajesCollection.find();
    return viajes;
  },
};

export { Coche as default };
