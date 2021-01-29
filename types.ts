import { Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";

export interface IUser {
  email: string;
  tipo: string;
  token: string;
  password: string;
  viajes: string[];
}

export interface IViaje {
  cliente: string;
  conductor: string;
  coche: string;
}

export interface ICoche {
  matricula: string;
  conductor: string;
  viajes: string[];
}

export interface IContext {
  db: Database;
  user: IUser;
  coche: ICoche;
  viaje: IViaje;
}
