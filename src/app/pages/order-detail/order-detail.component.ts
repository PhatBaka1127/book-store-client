import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  orderId!: number;
  order: any = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder();
  }

  loadOrder(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (res) => {
        if (res.result) {
          this.order = res.value;
        } else {
          this.error = 'Order not found';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Cannot load order detail.';
        this.loading = false;
      },
    });
  }
}
