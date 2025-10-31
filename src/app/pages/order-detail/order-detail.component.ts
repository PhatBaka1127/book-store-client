import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OrderService } from "../../services/order.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: "app-order-detail",
  templateUrl: "./order-detail.component.html",
  styleUrls: ["./order-detail.component.scss"],
})
export class OrderDetailComponent implements OnInit {
  orderId!: number;
  order: any = null;
  loading = false;
  orderStatuses = [
    { value: 0, label: "ORDERED" },
    { value: 1, label: "DELIVERING" },
    { value: 2, label: "DELIVERED" },
    { value: 3, label: "FAILED" },
  ];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get("id"));
    this.loadOrder();
  }

  loadOrder(): void {
    this.loading = true;

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (res) => {
        if (res.result) {
          this.order = res.value;
        }
        this.loading = false;
      },
      error: (res) => {
        console.error(res);
        this.toastService.showMessage(res.error.message, false, 2000);
        this.loading = false;
      },
    });
  }

  updateStatus(item: any, newStatus: string) {
    const payload = [
      {
        bookId: item.bookId,
        status: newStatus,
      },
    ]; // <-- bọc trong mảng

    this.orderService.updateOrderDetail(this.orderId, payload).subscribe({
      next: (res) => {
        if (res) {
          item.status = newStatus;
          this.toastService.showMessage(
            "Update status successfully",
            true,
            2000
          );
        }
      },
      error: (err) => {
        console.error(err);
        this.toastService.showMessage("Update status failed", false, 2000);
      },
    });
  }
}
