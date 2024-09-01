

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  constructor() {
  }
  getSignLrConnection() {
    if (!this.hubConnection) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(environment.apiUrl + 'HeaderNotifyHub')
        .build();

      this.hubConnection
        .start()
        .then(() => {
          // Do something when the connection is successfully established
        })
        .catch((err) => {});
    }

    return this.hubConnection;
  }
}

