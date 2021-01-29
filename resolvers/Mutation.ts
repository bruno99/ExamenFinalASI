import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

import { CocheSchema, UserSchema, ViajeSchema } from "../mongo/schema.ts";
import { IContext, IViaje, ICoche, IUser } from "../types.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

interface IStartViajeArgs {
  viaje: {
    id: string;
    cliente: string;
    conductor: string;
    coche: number;
  };
}
interface IChangeStatusArgs {
  coche: {
    id: string;
    conductor: string;
    status: string;
  };
}


const Mutation = {
  startViaje: async (
    parent: any,
    args: IStartViajeArgs,
    ctx: IContext
  ): Promise<boolean> => {
    try {
      console.log("Estoy aquí");
      const db: Database = ctx.db;
      const viajesCollection: Collection<ViajeSchema> = db.collection<ViajeSchema>(
        "Viajes"
      );

      console.log(`id: ${args.viajes.id}`);
      const found = await viajesCollection.findOne({ id: args.viajes.id });
      if (found) throw new GQLError("viaje con id que ya existe en la DB");

      const {id, cliente, conductor, coche } = args.viaje;
      const viaje = {
        id,
        cliente: ctx.user.email,
        conductor: ctx.user.email,
      };
      await viajesCollection.insertOne(viaje);
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },
 
  changeStatus: async (
    parent: any,
    args: IChangeStatusArgs,
    ctx: IContext
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const cocheCollection: Collection<CocheSchema> = db.collection<CocheSchema>(
        "Coches"
      );

      const found = await cochesCollection.find({ id: args.coche.id });
      if (!found) throw new GQLError("coche no existe");

      const { id, conductor, status } = args.task;
      const coche = {
        id,
        conductor: ctx.user.email,
        status,
      };
 if(args.coche.status == "FALSE){//si no estaba disponible se pone disponible
  await tasksCollection.updateOne({ id: args.id }, { status: "TRUE" });
  }else{//si estaba disponible se pone no disponible
  await tasksCollection.updateOne({ id: args.id }, { status: "FALSE" });
  }
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  

  signin: async (
    parent: any,
    args: { email: string; password: string },
    ctx: IContext
  ):Promise<Boolean> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("Users")
        .findOne({ email: args.email });
      if (exists) {
        throw new GQLError(`User with email ${args.email} already exists`);
      }
      await ctx.db
        .collection<UserSchema>("Users")
        .insertOne({ email: args.email, password: args.password, token: "" });
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  login: async (
    parent: any,
    args: { email: string; password: string },
    ctx: IContext
  ): Promise<string> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("Users")
        .findOne({ email: args.email, password: args.password });
      if (exists) {
        const token = v4.generate();
        await ctx.db
          .collection<UserSchema>("Users")
          .updateOne({ email: args.email }, { $set: { token } });
        setTimeout(() => {
          ctx.db
            .collection<UserSchema>("Users")
            .updateOne({ email: args.email }, { $set: { token: "" } });
        }, 60 * 60 * 1000);
        return token;
      } else {
        throw new GQLError("User and password do not match");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },

  logout: async (parent: any, args: {}, ctx: IContext): Promise<boolean> => {
    try {
      const exists = await ctx.db
        .collection<UserSchema>("Users")
        .findOne({ email: ctx.user.email, token: ctx.user.token });
      if (exists) {
        await ctx.db
          .collection<UserSchema>("Users")
          .updateOne({ email: ctx.user.email }, { $set: { token: "" } });
        return true;
      } else {
        throw new GQLError("Unexpected error");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },


};

export {Mutation }
