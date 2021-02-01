import { Database } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

export interface IUsuario {
  email: string;
  rol: string;
  token: string;
  password: string;
  viaje: string;
  coche?: string;
}

export interface ICoche {
  matricula: string;
  conductor: string;
  viaje: string;
  estado: boolean;
}

export interface IViaje {
  id: string;
  conductor: string;
  cliente: string;
  coche: string;
}

export interface IAddUserArgs {
  user: {
    email: string;
    password: string;
    rol: string;
    coche?: string;
  };
}

export interface IAddCarArgs {
  car: {
    matricula: string;
    conductor: string;
    estado: boolean;
  };
}

export interface IContext {
  db: Database;
  user: IUsuario;
}
