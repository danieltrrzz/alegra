import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DishService } from '../../services/dish/dish.service';
import { OrderService } from '../../services/order/order.service';
import { IDish } from '../../interfaces/dish.interface';
import { IOrder, IOrderBoard } from '../../interfaces/order.interface';
import { SocketService } from '../../services/socket/socket.service';
import { OrderStatus } from '../../enums/order-status.enum';

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit, OnDestroy {

  dishes: IDish[] = [];
  ordersBoard: IOrderBoard = {
    PREPARATION: [],
    KITCHEN: [],
    FINISHED: [],
    DELIVERED: [],
  };

  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(
    public toastr: ToastrService,
    private dishService: DishService,
    private orderService: OrderService,
    private socketService: SocketService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.onLoadDishes();
    this.onLoadOrders();

    this.socketService.listenOrder
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.onLoadOrders();
      });
  }

  /**
   * Cargo los platos
   */
  onLoadDishes(): void {
    this.dishService.Get()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (result: IDish[]) => {
          this.dishes = result && result.length ? result : [];
          this.cdRef.detectChanges();
        },
        error: (err) => {
          this.toastr.error(JSON.stringify(err), '¡Error al cargar los platos!');
        }
      });
  }

  /**
   * Cargar las ordenes
   */
  onLoadOrders(): void {
    this.orderService.Get()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (result: IOrder[]) => {
          if (result && result.length) {
            result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => {
              order.createdAt = this.formatDate(order.createdAt);
              return order;
            });
            this.ordersBoard = {
              PREPARATION: result.filter((order) => order.status === OrderStatus.PREPARATION),
              KITCHEN: result.filter((order) => order.status === OrderStatus.KITCHEN),
              FINISHED: result.filter((order) => order.status === OrderStatus.FINISHED),
              DELIVERED: result.filter((order) => order.status === OrderStatus.DELIVERED),
            };
          } else {
            this.ordersBoard = {
              PREPARATION: [],
              KITCHEN: [],
              FINISHED: [],
              DELIVERED: [],
            };
          }
          this.cdRef.detectChanges();
        },
        error: (err) => {
          this.toastr.error(JSON.stringify(err), '¡Error al cargar las ordenes!');
        }
      });
  }

  /**
   * Enviar la orden
   */
  onSubmitOrder(): void {
    this.orderService.Post()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (result: any) => {
          this.toastr.success('¡Orden enviada con éxito!');
        },
        error: (err) => {
          this.toastr.error(JSON.stringify(err), '¡Error al enviar la orden!');
        }
      })
  }

  /**
   * Formatear la fecha
   * @param dateString
   * @returns
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // La hora '0' debe ser '12'

    const strTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${ampm}`;
    return `${day} de ${month} de ${year}, ${strTime}`;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete()
  }
}
