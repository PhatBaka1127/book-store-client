import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreateOrderDetailDTO {
  bookId: number;
  quantity: number;
}

export interface CreateOrderDTO {
  phone: string;
  address: string;
  createOrderDetailDTOs: CreateOrderDetailDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }
}
