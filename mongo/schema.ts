export interface CocheSchema {
  _id: { $oid: string };
  matricula: string;
  conductor: string;
  status: string;//-True/false
  viajes: string[];//lista de viajes
}

export interface UserSchema {
  _id: { $oid: string };
  email: string;
  tipo: string; //cliente/conductor/admin
  token: string;
  password: string;
  viajes: string[];//lista de viajes
}

export interface ViajeSchema {
  _id: { $oid: string };
  cliente: string;
  conductor: string;
  coche: string;
}
