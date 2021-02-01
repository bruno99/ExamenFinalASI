export interface UsuarioSchema {
  _id: { $oid: string };
  email: string;
  rol: string;
  token: string;
  password: string;
  viaje: string;
  coche?: string;
}

export interface CocheSchema {
  _id: { $oid: string };
  matricula: string;
  conductor: string;
  viaje: string;
  estado: boolean;
}

export interface ViajeSchema {
  _id: { $oid: string };
  id: string;
  conductor: string;
  cliente: string;
  coche: string;
}
