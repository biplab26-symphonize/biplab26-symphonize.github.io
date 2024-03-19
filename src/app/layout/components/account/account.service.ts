import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class AccountService
{
    user: any;
    onNotificationUpdates: BehaviorSubject < any > ;
    onlogoutClick: BehaviorSubject < any > ;
    onlogoutDone: BehaviorSubject < any > ;
    /**
     * Constructor
     *
     * 
     */
    constructor(){
        this.onNotificationUpdates 	= new BehaviorSubject(null);
        this.onlogoutClick 	= new BehaviorSubject(null);
        this.onlogoutDone 	= new BehaviorSubject(null);
    }
}
