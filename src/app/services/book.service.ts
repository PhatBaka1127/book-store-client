import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Book {
  id: number;
  name: string;
  description: string;
  unitPrice: number;
  stock: number;
  status: number;
  image?: string;
  sellerId: number;
  sellerName?: string;
  categoryId: number;
  categoryName: string;
}

export interface BookResponse {
  metaData: { page: number; size: number; total: number };
  results: Book[];
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<BookResponse>(`${this.apiUrl}/books`).pipe(
      map((res) => res.results) // lấy mảng books từ results
    );
  }

  createBook(data: {
    name: string;
    description?: string;
    unitPrice?: number;
    stock?: number;
    status?: number;
    image?: File;
    categoryId?: number;
  }): Observable<any> {
    const formData = new FormData();

    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.unitPrice) formData.append('unitPrice', data.unitPrice.toString());
    if (data.stock) formData.append('stock', data.stock.toString());
    if (data.status) formData.append('status', data.status.toString());
    if (data.image) formData.append('image', data.image);
    if (data.categoryId)
      formData.append('categoryId', data.categoryId.toString());

    return this.http.post(`${this.apiUrl}/books`, formData);
  }
}
