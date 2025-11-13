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
    { value: "ORDERED", label: "ORDERED" },
    { value: "DELIVERING", label: "DELIVERING" },
    { value: "DELIVERED", label: "DELIVERED" },
    { value: "FAILED", label: "FAILED" },
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
    ];

    this.orderService.updateOrderDetail(this.orderId, payload).subscribe({
      next: () => {
        item.status = newStatus;
        item.updatedDate = new Date();
        this.toastService.showMessage("Update status successfully", true, 2000);
      },
      error: () => {
        this.toastService.showMessage("Update status failed", false, 2000);
      },
    });
  }

  getStatusLabel(status: string) {
    const s = this.orderStatuses.find((x) => x.value === status);
    return s ? s.label : "";
  }
}
