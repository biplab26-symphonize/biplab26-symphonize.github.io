import { Component, HostBinding, Input, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { AppConfig } from 'app/_services';
import { Event as NavigationEvent, NavigationEnd, NavigationStart, Router, RouterLinkActive } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AccountService } from 'app/layout/components/account/account.service';

@Component({
    selector: 'fuse-nav-horizontal-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class FuseNavHorizontalItemComponent implements OnInit {
    @HostBinding('class')
    classes = 'nav-item';
    activeClass = 'active'
    private _unsubscribeAll: Subject<any>;
    @Input()
    item: any;

    @ViewChildren(RouterLinkActive, { read: ElementRef })
    linkRefs: QueryList<ElementRef>

    /**
     * Constructor
     */
    constructor(
        private router: Router,
        private _accountService: AccountService,
        private _appConfig: AppConfig
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

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
                this.ngAfterViewInit();
            }
        });
    }
    ngOnInit() {
        this.item.external = false;
        if (this.item.url && this.isUrl(this.item.url)) {
            this.item.external = true;
        }

        //Get Navigation List
        this._appConfig.onMenuLoad
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((menusresponse) => {
                if (menusresponse !== null && menusresponse.menu_parent_id > 0) {
                    Array.from(document.querySelectorAll('.parent-active')).forEach((el) => el.classList.remove('parent-active'));

                    let parentMenu = document.getElementById('parent-' + menusresponse.menu_parent_id);
                    if(parentMenu){
                        parentMenu.classList.add('parent-active');
                    }
                }
            });
    }
    ngAfterViewInit() {
        setTimeout(() => {
            const activeEl = this.findActiveLink();
            if (activeEl) {
                if (activeEl.nativeElement.attributes.menuparent && activeEl.nativeElement.attributes.menuparent.value) {
                    let parentMenu = document.getElementById('parent-' + activeEl.nativeElement.attributes.menuparent.value);
                    if(parentMenu){
                        parentMenu.classList.add('parent-active');
                    }
                    
                }
                this._appConfig.onMenuLoaded.next(
                    {
                        menu_title: activeEl.nativeElement.attributes.menutitle.value,
                        page_title: activeEl.nativeElement.attributes.pagetitle.value,
                        show_page_title: activeEl.nativeElement.attributes.showpagetitle.value,
                        menu_parent_id:activeEl.nativeElement.attributes.menuparentid.value,
                        media: {
                            image: activeEl.nativeElement.attributes.pagetitleimg.value,
                        },
                        // children:this.item.children,
                        menuroles: this.item.menuroles,

                    });
            }
        }, 0);
    }
    findActiveLink = (): ElementRef | undefined => {
        return this.linkRefs.toArray()
            .find(e => e.nativeElement.classList.contains(this.activeClass))
    }
    /**Send MenuInfo to breadcumb */
    sendMenuItemInfo(item: any) {
        this._appConfig.onMenuLoaded.next(item);
    }
    isUrl(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(s);
    }
    //Open logout dialog on logout menu clicked
    logout() {
        this._accountService.onlogoutClick.next(true);
    }
}
