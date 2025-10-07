import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Destino } from '../models/destino.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DestinosService {

  constructor(private api: ApiService) {}

  getDestinos(): Observable<Destino[]> {
    return this.api.get<Destino[]>('destinos');
  }
}
