import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Destino } from './destino.model';
import { ApiService } from '../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class DestinosService {

  constructor(private api: ApiService) {}

  getDestinos(): Observable<Destino[]> {
    return this.api.get<Destino[]>('destinos');
  }
}
