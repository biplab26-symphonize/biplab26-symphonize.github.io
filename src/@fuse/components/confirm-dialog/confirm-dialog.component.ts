import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil,first } from 'rxjs/operators';
import { CommonService } from 'app/_services';

@Component({
    selector   : 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class FuseConfirmDialogComponent
{
    public confirmMessage: string;
    public confirmType:string = '';
    public itemId:number=null;
    public type:string = '';
    public userId:number=null;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseConfirmDialogComponent>} dialogRef
     */
    constructor(
        private _commonService:CommonService,
        public dialogRef: MatDialogRef<FuseConfirmDialogComponent>
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    discardChanges(){
        this._commonService.discardChanges({record_id:this.itemId,type:this.type,user_id:this.userId})
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response=>{
            if(response.status==200){
                this.dialogRef.close(true);
            }
            else{
                this.dialogRef.close(false);
            }
        })
    }

}
