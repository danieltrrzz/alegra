import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IOrder } from '../../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private secretKey: string = 'Fr33LunchD4y';
  private endPoint: string = '/order';
  constructor(
    private http: HttpClient,
  ) { }

  // HTTP GET
  public Get<T>(id: string = ""): Observable<IOrder[]> {
    let url: string = `${environment.API_BASE}${this.endPoint}${id !== "" ? `/${id}` : ''}`;
    return this.http.get<IOrder[]>(url);
  }

  // HTTP POST
  public Post<T>(): Observable<T> {
    let url: string = `${environment.API_BASE}${this.endPoint}`;
    return this.http.post<T>(url, { secretKey: this.secretKey });
  }
}
