  
import {
  Database
} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import {
  GQLError,
} from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { CocheSchema, UserSchema, ViajeSchema } from "../mongo/schema.ts";

import { IContext, IViaje, ICoche, IUser } from "../types.ts";

interface IGetCocheArgs {
  id: string;
}

interface IGetStatusArgs {
  status: string;
}


const Query = {

  getCoche: async (
    parent: any,
    args: IGetCocheArgs,
    ctx: IContext
  ): Promise<ICoche | null> => {
    try {
      const db: Database = ctx.db;
      const coches = db.collection<CocheSchema>("Coches");
      const coche: CocheSchema | null = await coches.findOne({ id: args.id });

      let status: string;
      if (coche) {
        matricula = coche.matricula.toString();
        return {
          ...coche,
          matricula,
        };
      }

      return null;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  getCoches: async (parent: any, args: any, ctx: IContext) => {
    try {
      const db: Database = ctx.db;
      const cochesCollection = db.collection<CocheSchema>("Coches");
      const coches = await cochesCollection.find();
      const result = coches.map((t) => {
        return {
          ...t,
          matricula: t.matricula.toString(),
        };
      });
      return result;
    } catch (e) {
      throw new GQLError(e);
    }
  },
   getClients: async (parent: any, args: any, ctx: IContext) => {
    try {
      const db: Database = ctx.db;
      const usersCollection = db.collection<UserSchema>("Users");
      const user: UserSchema | null = await users.findOne({ tipo: "cliente" });
      const result = users.map((t) => {
        return {
          ...t,
          tipo: t.tipo.toString(),
        };
      });
      return result;
    } catch (e) {
      throw new GQLError(e);
    }
  },
   getConductores: async (parent: any, args: any, ctx: IContext) => {
   try {
   const db: Database = ctx.db;
      const usersCollection = db.collection<UserSchema>("Users");
      const user: UserSchema | null = await users.findOne({ tipo: "conductor" });
      const result = users.map((t) => {
        return {
          ...t,
          tipo: t.tipo.toString(),
        };
      });
      return result;
    } catch (e) {
      throw new GQLError(e);
    }
  },
   getViajes: async (parent: any, args: any, ctx: IContext) => {
    try {
      const db: Database = ctx.db;
      const viajesCollection = db.collection<ViajeSchema>("Viajes");
      const viajes = await viajesCollection.find();
      const result = viajes.map((t) => {
        return {
          ...t,
          id: t.id.toString(),
        };
      });
      return result;
    } catch (e) {
      throw new GQLError(e);
    }
  },

 

  getStatus: async (
    parent: any,
    args: IGetCocheArgs,
    ctx: IContext
  ): Promise<ICoche | null> => {
    try {
      const db: Database = ctx.db;
      const coches = db.collection<CocheSchema>("Coches");
      const coche: CocheSchema | null = await coches.findOne({ status: args.status });

      let status: string;
      if (coche) {
        status = coche.status.toString();
        return {
          ...coche,
          status,
        };
      }

      return null;
    } catch (e) {
      throw new GQLError(e);
    }
  },


  
};

export {Query}
