import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { RouterLinkActive } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationItem } from '@fuse/types';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { AppConfig,OptionsList, AuthService } from 'app/_services';

@Component({
    selector   : 'fuse-nav-vertical-item',
    templateUrl: './item.component.html',
    styleUrls  : ['./item.component.scss']
})
export class FuseNavVerticalItemComponent implements OnInit, OnDestroy
{
    activeClass = 'active'
    @HostBinding('class')
    classes = 'nav-item';

    sourceMenu:boolean = false;
    @Input()
    item: any;
    public signageUrl: string = '';
    public authToken : string = '';
    roleId: any;
    showMenu: boolean=false;   
    // Private
    private _unsubscribeAll: Subject<any>;

    @ViewChildren(RouterLinkActive, { read: ElementRef })
    linkRefs: QueryList<ElementRef>
    
    /**
     * Constructor
     */

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _authService: AuthService,
        private _appConfig: AppConfig
    )
    {
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
        if(this.item.id=='digital-signage'){
            this.signageUrl = AppConfig.Settings.url.signageUrl;
            this.authToken  = this._authService.currentUserValue.tokenstring;
        }
        this.sourceMenu = this.item && this.item.menu_source ? true : false;

        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
         .subscribe(() => {
             // Mark for check
             this._changeDetectorRef.markForCheck();
         });

         //Extra Changes
         //this.roleId = this._authService.currentUserValue.token.role || 0;
         let userStorage  =  JSON.parse(localStorage.getItem('token'));
         this.roleId      = userStorage!==null && userStorage!==undefined ? userStorage['role_id'] : 0 ;

         if(this.roleId >0 && this.item.roles!==undefined){
            this.item.hidden = this.item.roles.includes(this.roleId) ? false : true;
         }
    }
    ngAfterViewInit() {
        setTimeout(() => {
            const activeEl = this.findActiveLink();
            if(activeEl && activeEl.nativeElement.attributes && activeEl.nativeElement.attributes.menutitle){
                this._appConfig.onMenuLoaded.next(
                    {
                        menu_title:activeEl.nativeElement.attributes.menutitle.value,
                        page_title:activeEl.nativeElement.attributes.pagetitle.value,
                        show_page_title:activeEl.nativeElement.attributes.showpagetitle.value,
                        media:{
                            image:activeEl.nativeElement.attributes.pagetitleimg.value,
                        },
                        // children:this.item.children,
                        menuroles:this.item.menuroles,
                        
                    });
            }            
        }, 0);
    }
    findActiveLink = (): ElementRef | undefined => {
        return this.linkRefs.toArray()
            .find(e => e.nativeElement.classList.contains(this.activeClass))
    }
    /**Send MenuInfo to breadcumb */
    sendMenuItemInfo(item:any){
        this._appConfig.onMenuLoaded.next(item);
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
}
