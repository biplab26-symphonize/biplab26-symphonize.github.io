import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Event as NavigationEvent, NavigationEnd, NavigationStart , Router , RouterLinkActive } from '@angular/router';

import { takeUntil,filter } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { AppConfig } from 'app/_services';
import { FuseNavigationService } from '../../navigation.service';

@Component({
    selector   : 'fuse-nav-horizontal-collapsable',
    templateUrl: './collapsable.component.html',
    styleUrls  : ['./collapsable.component.scss'],
    animations : fuseAnimations
})
export class FuseNavHorizontalCollapsableComponent implements OnInit, OnDestroy
{
    fuseConfig: any;
    isOpen = false;
    activeClass = 'active'
    @HostBinding('class')
    classes = 'nav-collapsable nav-item';
    menuSlug:string='';
    @Input()
    item: any;
    currentnavigation:any[]=[];

    @ViewChildren(RouterLinkActive, { read: ElementRef })
    linkRefs: QueryList<ElementRef>

    // Private
    private _unsubscribeAll: Subject<any>;
    public mediaUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router, 
        private _fuseNavigationService: FuseNavigationService,
        private _fuseConfigService: FuseConfigService,
        private _appConfig: AppConfig
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.router.events
			.pipe(
                filter( ( event: NavigationEvent ) => { 
						return( event instanceof NavigationStart ); 
					}
				),
                takeUntil(this._unsubscribeAll)
			)
			.subscribe(( event: NavigationStart ) => {
                if ( event.restoredState ) { 
                   this.setBackQuickLinks(event);
                }
			});

        this.router.events
            .pipe(
                filter( ( event: NavigationEvent ) => { 
						return( event instanceof NavigationEnd ); 
					}
				),
                takeUntil(this._unsubscribeAll)
			)
            .subscribe((ev) => {
                if (ev instanceof NavigationEnd) {
                    Array.from(document.querySelectorAll('.parent-active')).forEach((el) => el.classList.remove('parent-active'));
                    Array.from(document.querySelectorAll('.main-parent-active')).forEach((el) => el.classList.remove('main-parent-active'));
                    this.ngAfterViewInit();
                }
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.mediaUrl = AppConfig.Settings.url.mediaUrl;
        this.item.external=false;
        if(this.item.url && this.isUrl(this.item.url)){
            this.item.external = true;
        }
        // Subscribe to config changes
        this._fuseConfigService.config
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
            (config) => {
                this.fuseConfig = config;
            });
        //Get Navigation List
        this._appConfig.onMenuLoad
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((menusresponse) => {
            Array.from(document.querySelectorAll('.parent-active')).forEach((el) => el.classList.remove('parent-active'));
            Array.from(document.querySelectorAll('.main-parent-active')).forEach((el) => el.classList.remove('main-parent-active'));
            
            if(menusresponse!==null && menusresponse.menu_parent_id>0){
                let parentMenu = document.getElementById('parent-'+menusresponse.menu_parent_id); 
                parentMenu.classList.add('parent-active');
                //make outer parent active
                if(parentMenu){
                    // Load the navigation either from the input or from the service
                    this.currentnavigation = this._fuseNavigationService.getCurrentNavigation();

                    let mainParentMenu = [];
                    this.currentnavigation.forEach(item=>{
                        if(item.children && item.children.length>0){
                            let mainParentMenuObj = item.children.find(subitem=>{
                               return subitem.menu_id===menusresponse.menu_parent_id
                            });
                            if(mainParentMenuObj){
                                mainParentMenu.push(mainParentMenuObj);
                            }
                        }
                    });
                    let mainMenuArray = mainParentMenu.find(item=>{return item!==undefined});
                    if(mainMenuArray!==null && mainMenuArray!==undefined && mainMenuArray.menu_id>0){
                        
                        let mainMenuArrayActive = document.getElementById('parent-'+mainMenuArray.menu_parent_id); 
                        mainMenuArrayActive.classList.add('main-parent-active');
                    }
                }
            }
        });
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
                        menu_parent_id:activeEl.nativeElement.attributes.menuparentid.value,
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

    isUrl(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(s);
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
     * Open
     */
    @HostListener('mouseenter')
    open(): void
    {
        this.isOpen = true;
    }

    /**
     * Close
     */
    @HostListener('mouseleave')
    close(): void
    {
        this.isOpen = false;
    }
    setBackQuickLinks(backEvent:any){

        // Load the navigation either from the input or from the service
        this.currentnavigation = this._fuseNavigationService.getCurrentNavigation();
        this.menuSlug          = backEvent.url!=='' && backEvent.url ? backEvent.url.slice(1) : ''; 
        if(this.menuSlug!==''){
            let restoredMenu       = this.currentnavigation.find(item=>{return item.menu_url===this.menuSlug});     
            
            //menu found in parent menus
            if(restoredMenu && restoredMenu.menu_title){
                this.sendMenuItemInfo(restoredMenu);
            }
            else{
                let mainParentMenu = [];
                this.currentnavigation.forEach(item=>{
                    if(item.children && item.children.length>0){
                        restoredMenu = item.children.find(subitem=>{
                           return subitem.menu_url===this.menuSlug
                        });
                    }
                    if(restoredMenu){
                        mainParentMenu.push(restoredMenu);
                    }
                });
                let activeQuickMenu = mainParentMenu && mainParentMenu.length>0 ? mainParentMenu[0] : null;
                if(activeQuickMenu && activeQuickMenu.menu_title){
                    this.sendMenuItemInfo(activeQuickMenu);
                }
            } 
            
        }
        
    }
    /**Send MenuInfo to breadcumb */
    sendMenuItemInfo(item:any){
        this._appConfig.onMenuLoaded.next(item);
    }
}
