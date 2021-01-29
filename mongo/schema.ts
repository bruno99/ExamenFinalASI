export interface CocheSchema {
  _matricula: { $oid: string };
  conductor: string;
  viajes: string[];//lista de viajes
}

export interface UserSchema {
  _email: { $oid: string };
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
