// deno-lint-ignore-file
import { Database } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { UsuarioSchema, CocheSchema, ViajeSchema } from "../schema/mongoSchema.ts";
import { IUsuario, ICoche, IViaje, IContext } from "../schema/datatypesSchema.ts";

const Query = {
  getCoches: async (parent: any, args: any, ctx: IContext, info: any) => {
    try {
      const db: Database = ctx.db;
      const carsCollection = db.collection<CocheSchema>("CarsCollection");
      const cars = await carsCollection.find();
      const result = cars.map((t) => {
        return {
          ...t,
        };
      });
      return result;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  getClientes: async (parent: any, args: any, ctx: IContext, info: any) => {
    try {
      const db: Database = ctx.db;
      const usersCollection = db.collection<UsuarioSchema>("UsersCollection");
      const clientes = await usersCollection.find({rol: "cliente"});
      const result = clientes.map((t) => {
        return {
          ...t,
        };
      });
      return result;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  getConductores: async (parent: any, args: any, ctx: IContext, info: any) => {
    try {
      const db: Database = ctx.db;
      const usersCollection = db.collection<UsuarioSchema>("UsersCollection");
      const conductores = await usersCollection.find({rol: "conductor"});
      const result = conductores.map((t) => {
        return {
          ...t,
        };
      });
      return result;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  getViajes: async (parent: any, args: any, ctx: IContext, info: any) => {
    try {
      const db: Database = ctx.db;
      const viajesCollection = db.collection<ViajeSchema>("ViajesCollection");
      const viajes = await viajesCollection.find();
      const result = viajes.map((t) => {
        return {
          ...t,
        };
      });
      return result;
    } catch (e) {
      throw new GQLError(e);
    }
  },
};

export { Query as default };