import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { HttpClient,HttpBackend } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { IconsFakeDb } from 'app/_staticdb/icons';
import { FontAwesomeIcons } from 'app/_staticdb/fa-icons';

@Component({
    selector   : 'icons',
    templateUrl: './icons.component.html',
    styleUrls  : ['./icons.component.scss']
})
export class IconsComponent implements OnInit, OnDestroy
{
    icons: any[];
    type: string = 'material';
    filteredIcons: any[];
    searchKey: string="";
    loading: boolean;
    private http: HttpClient;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     *@param {MatDialogRef<IconsComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<IconsComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any)
    {
        // Set the defaults
        this.loading = true;
        this.type    = this.dialogData.type;   
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        if(this.type=='material'){
            this.icons = IconsFakeDb.icons;
            this.filteredIcons = this.icons;
        }
        else{
            this.icons = FontAwesomeIcons.icons;
            this.filteredIcons = this.icons;
        }
    }
    /**Hideloader */
    ngAfterViewChecked(): void
    {
        setTimeout(() => {
            this.loading = false;
        },1000);
        
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter icons
     *
     * @param event
     */
    filterIcons(event): void
    {
        this.searchKey = event.target.value;
        if(this.type=='material'){
            this.filteredIcons = this.icons.filter(icon => {
                return icon.name.includes(this.searchKey) || icon.tags.includes(this.searchKey);
            });
        }
        else{
            this.filteredIcons = this.icons.filter(icon => {
                return icon.includes(this.searchKey);
            });
        }
    }
}
