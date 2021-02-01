// deno-lint-ignore-file
import { Database } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

import { CocheSchema, ViajeSchema } from "../schema/mongoSchema.ts";
import {
  IContext,
  IUsuario,
  ICoche,
  IViaje
} from "../schema/datatypesSchema.ts";

const Usuario = {
  coche: async (
    parent: IUsuario,
    args: any,
    ctx: IContext,
    info: any
  ): Promise<ICoche[] | null> => {
    const db: Database = ctx.db;
    const carsCollection = db.collection<CocheSchema>("CarsCollection");

    const conductor = await carsCollection.find({ conductor: parent.email });
    return conductor.map((t) => {
      return {
        ...t,
      };
    });
  },

  viajes: async (
    parent: IUsuario,
    args: any,
    ctx: IContext,
    info: any
  ): Promise<IViaje[] | null> => {
    const db: Database = ctx.db;
    const viajesCollection = db.collection<ViajeSchema>("ViajesCollection");

    const conductor = await viajesCollection.find({ conductor: parent.email });
    return conductor.map((t) => {
      return {
        ...t,
      };
    });

    const cliente = await viajesCollection.find({ cliente: parent.email });
    return cliente.map((t) => {
      return {
        ...t,
      };
    });
  },

};

export { Usuario as default };
