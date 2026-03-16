import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: signalR.HubConnection;
  private notificationSubject = new BehaviorSubject<string>('');
  
  public currentNotification = this.notificationSubject.asObservable();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5207/notificationHub')
      .withAutomaticReconnect()
      .build();

    this.startConnection();
    this.addReceiveNotificationListener();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection established'))
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  private addReceiveNotificationListener(): void {
    this.hubConnection.on('ReceiveNotification', (message: string) => {
      this.notificationSubject.next(message);
      
      // Clear notification after 5 seconds automatically for toast fade out
      setTimeout(() => {
        this.notificationSubject.next('');
      }, 5000);
    });
  }
}
