export interface Movimiento {
  tipoDocumento: string;
  idMovimiento: number;
  fechaMovimiento: string;
  cuentaMovimiento: string;
  observacion: string;
  idTercero: number;
  tercero: string;
  valorMovimiento: number;
}

export interface MovimientosResponse {
  nombrePosgrado: string;
  fechaInicio: string;
  fechaFin: string;
  movimientos: Movimiento[];
}
