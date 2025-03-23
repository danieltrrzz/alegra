import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IngredientService } from '../../services/ingredient/ingredient.service';
import { PurchaseService } from '../../services/purchase/purchase.service';
import { SocketService } from '../../services/socket/socket.service';
import { IIngredient } from '../../interfaces/ingredient.interface';
import { IPurchaseHistory } from '../../interfaces/purchase-history.interface';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [],
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.css'
})
export class IngredientsComponent implements OnInit, OnDestroy {

  inventories: IIngredient[] = [];
  purchases: IPurchaseHistory[] = [];

  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(
    public toastr: ToastrService,
    private ingredientService: IngredientService,
    private purchaseService: PurchaseService,
    private socketService: SocketService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.onLoadIngredients();
    this.onLoadPurchases();

    this.socketService.listenOrder
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.onLoadIngredients();
        this.onLoadPurchases();
      });
  }

  /**
   * Cargar los ingredientes
   */
  onLoadIngredients(): void {
    this.ingredientService.Get()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (result: IIngredient[]) => {
          this.inventories = result && result.length ? result : [];
          this.cdRef.detectChanges();
        },
        error: (err) => {
          this.toastr.error(JSON.stringify(err), '¡Error al cargar el inventario de ingredientes!');
        }
      });
  }

  /**
   * Cargar las compras
   */
  onLoadPurchases(): void {
    this.purchaseService.Get()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (result: IPurchaseHistory[]) => {
          this.purchases = result && result.length
            ? result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((purchase) => {
              purchase.createdAt = this.formatDate(purchase.createdAt);
              return purchase;
            })
            : [];

          this.cdRef.detectChanges();
        },
        error: (err) => {
          this.toastr.error(JSON.stringify(err), '¡Error al cargar las compras!');
        }
      });
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
