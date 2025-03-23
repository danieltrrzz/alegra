import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from './services/socket/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(
    public toastr: ToastrService,
    private socketService: SocketService,
  ) {}

  ngOnInit(): void {
    const subscribe = this.socketService.listenOrder
      .subscribe({
        next: () => {
          this.toastr.info('¡Actualización de ordenes!', '¡Notificación!');
        },
        complete: () => {
          subscribe.unsubscribe();
        }
      });
  }
}
