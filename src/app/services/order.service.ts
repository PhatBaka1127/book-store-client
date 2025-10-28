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

export interface OrderDetail {
  orderId: number;
  bookId: number;
  bookName: string;
  bookImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderValue {
  id: number;
  createdDate: string;
  quantity: number;
  totalPrice: number;
  status: string;
  phone: string,
  address: string,
  orderDetails: OrderDetail[];
}

export interface OrderByIdResponse {
  message: string;
  result: boolean;
  value: OrderValue;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }

  getOrders(page: number = 1, size: number = 20): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(
      `${this.apiUrl}?page=${page}&size=${size}`
    );
  }

  getOrderById(orderId: number) {
    return this.http.get<OrderByIdResponse>(`${this.apiUrl}/${orderId}`);
  }
}
