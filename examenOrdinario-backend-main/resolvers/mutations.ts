// deno-lint-ignore-file
import { Database } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

import {
  UsuarioSchema,
  CocheSchema,
  ViajeSchema,
} from "../schema/mongoSchema.ts";
import {
  IAddUserArgs,
  IAddCarArgs,
  IContext,
} from "../schema/datatypesSchema.ts";

const Mutation = {
  addUser: async (
    parent: any,
    args: IAddUserArgs,
    ctx: IContext,
    info: any
  ): Promise<boolean> => {
    try {
      const sameRol = await ctx.db
        .collection<UsuarioSchema>("UsersCollection")
        .findOne({ email: args.user.email, rol: args.user.rol });
      if (sameRol) {
        throw new GQLError("User with same rol already in DB");
      }

      await ctx.db.collection<UsuarioSchema>("UsersCollection").insertOne({
        email: args.user.email,
        password: args.user.password,
        rol: args.user.rol,
        token: "",
        viaje: "",
      });
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  addCar: async (
    parent: any,
    args: IAddCarArgs,
    ctx: IContext,
    info: any
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const carsCollection = db.collection<CocheSchema>("CarsCollection");
      const usersCollection = db.collection<UsuarioSchema>("UsersCollection");

      const found = await carsCollection.findOne({
        matricula: args.car.matricula,
      });
      if (found) throw new GQLError("Car already exists");

      const car = {
        matricula: args.car.matricula,
        conductor: ctx.user.email,
        estado: args.car.estado,
      };
      await carsCollection.insertOne(car);

      await usersCollection.updateOne(
        { email: ctx.user.email },
        { $set: { coche: args.car.matricula } }
      );

      return true;
    } catch (e) {
      console.log(e);
      throw new GQLError(e);
    }
  },

  logIn: async (
    parent: any,
    args: { email: string; password: string },
    ctx: IContext,
    info: any
  ): Promise<string> => {
    try {
      const exists = await ctx.db
        .collection<UsuarioSchema>("UsersCollection")
        .findOne({ email: args.email, password: args.password });
      if (exists) {
        const token = v4.generate();
        await ctx.db
          .collection<UsuarioSchema>("UsersCollection")
          .updateOne({ email: args.email }, { $set: { token } });
        return token;
      } else {
        throw new GQLError("Email and password do not match");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },

  logOut: async (
    parent: any,
    args: {},
    ctx: IContext,
    info: any
  ): Promise<boolean> => {
    try {
      const exists = await ctx.db
        .collection<UsuarioSchema>("UsersCollection")
        .findOne({ email: ctx.user.email, token: ctx.user.token });
      if (exists) {
        await ctx.db
          .collection<UsuarioSchema>("UsersCollection")
          .updateOne({ email: ctx.user.email }, { $set: { token: "" } });
        return true;
      } else {
        throw new GQLError("Unexpected error");
      }
    } catch (e) {
      throw new GQLError(e);
    }
  },

  avaliableCar: async (
    parent: any,
    args: {},
    ctx: IContext,
    info: any
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const carsCollection = db.collection<CocheSchema>("CarsCollection");
      const viajesCollection = db.collection<ViajeSchema>("ViajesCollection");
      const usersCollection = db.collection<UsuarioSchema>("UsersCollection");

      const found = await carsCollection.findOne({ estado: true });
      if (!found) throw new GQLError("There are no cars avaliable now.");

      const viajes = await viajesCollection.insertOne({
        id: v4.generate(),
        conductor: found.conductor,
        cliente: ctx.user.email,
        coche: found.matricula,
      });

      /*
      await carsCollection.updateOne(
        { matricula: found.matricula },
        { $set: { viaje: viajes.id } }
      );

      await usersCollection.updateOne(
        { email: ctx.user.email },
        { $set: { viaje: viajes.id } }
      );
      */ 

      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },

  carStatus: async (
    parent: any,
    args: { matricula: string; estado: boolean },
    ctx: IContext,
    info: any
  ): Promise<boolean> => {
    try {
      const db: Database = ctx.db;
      const carsCollection = db.collection<CocheSchema>("CarsCollection");

      const found = await carsCollection.findOne({
        matricula: args.matricula,
        conductor: ctx.user.email,
      });
      if (!found) throw new GQLError("Car does not exist or it is not yours.");

      await carsCollection.updateOne(
        { matricula: args.matricula },
        { $set: { estado: args.estado } }
      );
      return true;
    } catch (e) {
      throw new GQLError(e);
    }
  },
};

export { Mutation as default };
