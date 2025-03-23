import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IPurchaseHistory } from '../../interfaces/purchase-history.interface';


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private endPoint: string = '/market';
  constructor(
    private http: HttpClient,
  ) { }

  // HTTP GET
  public Get<T>(id: string = ""): Observable<IPurchaseHistory[]> {
    let url: string = `${environment.API_BASE}${this.endPoint}${id !== "" ? `/${id}` : ''}`;
    return this.http.get<IPurchaseHistory[]>(url);
  }
}
