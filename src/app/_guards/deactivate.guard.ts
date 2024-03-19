/**
 * Created by SINGH on 3/4/2017.
 */
import {CanDeactivate} from "@angular/router";
import {Injectable} from "@angular/core";

import {AddComponent} from "app/main/admin/pages/add/add.component";
import {Observable} from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import {of} from 'rxjs'

@Injectable()
export class DeactivateGuard implements CanDeactivate<AddComponent>{


  constructor(
    public dialog: MatDialog,
  )
  {

  }
  canDeactivate(component: AddComponent): Observable<boolean> {
    if (!component.changesSaved) {
      return component.confirmDialog();      
    }
    return of(true);
  }
}