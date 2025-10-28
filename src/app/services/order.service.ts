import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Order {
  id: number;
  createdDate: string;
  quantity: number;
  totalPrice: number;
  status: string;
}

export interface OrderResponse {
  metaData: {
    page: number;
    size: number;
    total: number;
  };
  results: Order[];
}

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

  getOrders(page: number = 1, size: number = 20): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}?page=${page}&size=${size}`);
  }
}