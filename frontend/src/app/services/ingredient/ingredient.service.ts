import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IIngredient } from '../../interfaces/ingredient.interface';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  private endPoint: string = '/inventory';
  constructor(
    private http: HttpClient,
  ) { }

  // HTTP GET
  public Get<T>(id: string = ""): Observable<IIngredient[]> {
    let url: string = `${environment.API_BASE}${this.endPoint}${id !== "" ? `/${id}` : ''}`;
    return this.http.get<IIngredient[]>(url);
  }
}
