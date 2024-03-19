import { ChangeDetectorRef, Component, HostBinding, HostListener, Input, OnDestroy, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { NavigationEnd, Router } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { FuseNavigationItem } from '@fuse/types';
import { fuseAnimations } from '@fuse/animations';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { AuthService, AppConfig } from 'app/_services';

@Component({
    selector   : 'fuse-nav-vertical-collapsable',
    templateUrl: './collapsable.component.html',
    styleUrls  : ['./collapsable.component.scss'],
    animations : fuseAnimations
})
export class FuseNavVerticalCollapsableComponent implements OnInit, OnDestroy
{
    @Input()
    item: any;

    @HostBinding('class')
    classes = 'nav-collapsable nav-item';
    activeClass = 'active';
    @HostBinding('class.open')
    public isOpen = false;

    // Private
    private _unsubscribeAll: Subject<any>;
    roleId: any;
    showMenu: boolean=false;

    @ViewChildren(RouterLinkActive, { read: ElementRef })
    linkRefs: QueryList<ElementRef>
    
    /**
     * Constructor
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {Router} _router
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _router: Router,
        private _authService:AuthService,
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
        // Listen for router events
        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((event: NavigationEnd) => {

                // Check if the url can be found in
                // one of the children of this item
                if ( this.isUrlInChildren(this.item, event.urlAfterRedirects) )
                {
                    this.expand();
                }
                else
                {
                    this.collapse();
                }
            });

        // Listen for collapsing of any navigation item
        this._fuseNavigationService.onItemCollapsed
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (clickedItem) => {
                    if ( clickedItem && clickedItem.children )
                    {
                        // Check if the clicked item is one
                        // of the children of this item
                        if ( this.isChildrenOf(this.item, clickedItem) )
                        {
                            return;
                        }

                        // Check if the url can be found in
                        // one of the children of this item
                        if ( this.isUrlInChildren(this.item, this._router.url) )
                        {
                            return;
                        }

                        // If the clicked item is not this item, collapse...
                        if ( this.item !== clickedItem )
                        {
                            this.collapse();
                        }
                    }
                }
            );

        // Check if the url can be found in
        // one of the children of this item
        if ( this.isUrlInChildren(this.item, this._router.url) )
        {
            this.expand();
        }
        else
        {
            this.collapse();
        }

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
            if(activeEl){
                this._appConfig.onMenuLoaded.next(
                    {
                        menu_title:activeEl.nativeElement.attributes.menutitle.value,
                        page_title:activeEl.nativeElement.attributes.pagetitle.value,
                        show_page_title:activeEl.nativeElement.attributes.showpagetitle.value,
                        media:{
                            image:activeEl.nativeElement.attributes.pagetitleimg.value,
                        },
                        children:this.item.children,
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle collapse
     *
     * @param ev
     */
    toggleOpen(ev): void
    {
        ev.preventDefault();

        this.isOpen = !this.isOpen;

        // Navigation collapse toggled...
        this._fuseNavigationService.onItemCollapsed.next(this.item);
        this._fuseNavigationService.onItemCollapseToggled.next();
    }

    /**
     * Expand the collapsable navigation
     */
    expand(): void
    {
        if ( this.isOpen )
        {
            return;
        }

        this.isOpen = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        this._fuseNavigationService.onItemCollapseToggled.next();
    }

    /**
     * Collapse the collapsable navigation
     */
    collapse(): void
    {
        if ( !this.isOpen )
        {
            return;
        }

        this.isOpen = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        this._fuseNavigationService.onItemCollapseToggled.next();
    }

    /**
     * Check if the given parent has the
     * given item in one of its children
     *
     * @param parent
     * @param item
     * @returns {boolean}
     */
    isChildrenOf(parent, item): boolean
    {
        const children = parent.children;

        if ( !children )
        {
            return false;
        }

        if ( children.indexOf(item) > -1 )
        {
            return true;
        }

        for ( const child of children )
        {
            if ( child.children )
            {
                if ( this.isChildrenOf(child, item) )
                {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if the given url can be found
     * in one of the given parent's children
     *
     * @param parent
     * @param url
     * @returns {boolean}
     */
    isUrlInChildren(parent, url): boolean
    {
        const children = parent.children;

        if ( !children )
        {
            return false;
        }

        for ( const child of children )
        {
            if ( child.children )
            {
                if ( this.isUrlInChildren(child, url) )
                {
                    return true;
                }
            }

            if ( child.url === url || url.includes(child.url) )
            {
                return true;
            }
        }

        return false;
    }

}
