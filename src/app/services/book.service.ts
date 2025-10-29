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
  quantity: number;
}

export interface BookResponse {
  metaData: { page: number; size: number; total: number };
  results: Book[];
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  /** 🟩 Lấy danh sách tất cả sách */
  getBooks(): Observable<Book[]> {
    return this.http.get<BookResponse>(this.apiUrl).pipe(
      map((res) => res.results)
    );
  }

  /** 🟨 Lấy chi tiết một cuốn sách */
  getBookById(id: number): Observable<Book> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        if (res.result && res.value) {
          return res.value as Book;
        } else {
          throw new Error(res.message || 'Không tìm thấy sách');
        }
      })
    );
  }

  /** 🟦 Thêm mới sách */
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

    return this.http.post(this.apiUrl, formData);
  }

  /** 🟧 Cập nhật sách */
  updateBook(id: number, data: {
    name?: string;
    description?: string;
    unitPrice?: number;
    stock?: number;
    status?: number;
    image?: File | string;
    categoryId?: number;
  }): Observable<any> {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.unitPrice !== undefined)
      formData.append('unitPrice', data.unitPrice.toString());
    if (data.stock !== undefined)
      formData.append('stock', data.stock.toString());
    if (data.status !== undefined)
      formData.append('status', data.status.toString());
    if (data.image instanceof File)
      formData.append('image', data.image);
    if (data.categoryId)
      formData.append('categoryId', data.categoryId.toString());

    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  /** 🟥 Xóa sách */
  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}