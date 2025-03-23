import { EventEmitter, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket {

  public listenOrder: EventEmitter<any> = new EventEmitter();
  constructor() {
    super({ url: 'http://localhost:3001' });
    this.listen();
  };

  listen(): void {
    // Listen de ordenes
    this.ioSocket.on('/io/notify-change-event', () => this.listenOrder.emit());
  };
}
