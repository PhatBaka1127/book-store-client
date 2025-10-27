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
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<BookResponse>(`${this.apiUrl}/books`).pipe(
      map(res => res.results) // lấy mảng books từ results
    );
  }
}
