import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  get<T>(
    endpoint: string,
    params?: Record<string, string | number>,
    options?: { context?: HttpContext }
  ): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        httpParams = httpParams.set(k, String(v));
      }
    }
    return this.http.get<T>(`${environment.API_URL}/${endpoint}`, {
      params: httpParams,
      context: options?.context
    });
  }

  post<T>(
    endpoint: string,
    body: unknown,
    options?: { context?: HttpContext }
  ): Observable<T> {
    return this.http.post<T>(`${environment.API_URL}/${endpoint}`, body, {
      context: options?.context
    });
  }
}
