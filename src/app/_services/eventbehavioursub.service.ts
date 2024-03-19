import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventbehavioursubService {
  public typeChange                 : BehaviorSubject<any> = new BehaviorSubject<any>('');
  public dateFormula                : BehaviorSubject<any> = new BehaviorSubject<string>('N');
  public eventstartdateChange       : BehaviorSubject<any> = new BehaviorSubject<any>('');
  public eventenddateChange         : BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onRequireRegChange         : BehaviorSubject<any> = new BehaviorSubject<any>('');
  public dateRangeChange            : BehaviorSubject<any> = new BehaviorSubject<any>('');
  public regStartEnd                : BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public isRecurringChange          : BehaviorSubject<any> = new BehaviorSubject<any>('');
  public isBookingRecurringChange   : BehaviorSubject<any> = new BehaviorSubject<any>('');
  
  //RunTime Change Variable
  public RunTimeChange              : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  public EnableRecurringModal       : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  //RegisterForm Changes
  public RegistrationValues         : BehaviorSubject<any> = new BehaviorSubject<any>('');
  //Validate UserMeta Form Fields
  public userMetaValidate           : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  //Validate Manual Form Field
  public manualRecValidate          : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);

  //Page Builder Variables
  public onElementAdded             : BehaviorSubject<any> = new BehaviorSubject<any>('');
  //On List Form Fields Validte
  public listFieldsValidate         : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  //list field validate on load
  public listFieldsLoaded           : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  //validate checkboxes on edit entry
  public checkFieldsValidate           : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  //validate checkbox on load edit entry
  public checkFieldsLoaded           : BehaviorSubject<any> = new BehaviorSubject<boolean>(false);
  
  public clearMetaFields             : BehaviorSubject<any> = new BehaviorSubject<any>(null); 

  public restrictFormEdit             : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 

  constructor() { }
  
}
