import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IDish } from '../../interfaces/dish.interface';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  private endPoint: string = '/kitchen';
  constructor(
    private http: HttpClient,
  ) { }

  // HTTP GET
  public Get<T>(id: string = ""): Observable<IDish[]> {
    let url: string = `${environment.API_BASE}${this.endPoint}${id !== "" ? `/${id}` : ''}`;
    return this.http.get<IDish[]>(url);
  }
}
