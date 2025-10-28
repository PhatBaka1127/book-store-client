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
  error: string | null = null;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res.results;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Can`t not load order.';
        this.loading = false;
      },
    });
  }

  viewOrderDetail(orderId: number): void {
    this.router.navigate([`/order/${orderId}`]);
  }
}
