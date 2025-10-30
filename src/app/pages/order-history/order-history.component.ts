import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = false;

  currentPage = 1;
  totalPages = 1;
  pageSize = 5;
  totalItems = 0;

  sortField = 'createdDate';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(page: number = 1): void {
    this.loading = true;
    this.orderService.getOrders(page, this.pageSize, this.sortField, this.sortDirection).subscribe({
      next: (res) => {
        this.orders = res.results;
        this.currentPage = res.metaData.page;
        this.pageSize = res.metaData.size;
        this.totalItems = res.metaData.total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  changeSort(field: string): void {
    if (this.sortField === field) {
      // Nếu click lại cùng field thì đảo hướng
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Nếu click field khác thì reset sang desc mặc định
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.loadOrders(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.loadOrders(page);
  }

  viewOrderDetail(orderId: number): void {
    this.router.navigate([`/order/${orderId}`]);
  }
}
