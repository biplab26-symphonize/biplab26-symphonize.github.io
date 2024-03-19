import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OptionsList, AppConfig } from '.';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    media;
    onMediaChanged: BehaviorSubject<any>;
    appConfig: any;
    optionsList: any;
    mediafilters: object = {};
    onSingleMediaChanged: BehaviorSubject<any>;
    singlemedia: any;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onMediaChanged = new BehaviorSubject({});
        this.appConfig = AppConfig.Settings;
        this.optionsList = OptionsList.Options;
        this.mediafilters = this.optionsList.tables.pagination.filters;
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            let funArray: any[];
            if (route.routeConfig.path == 'admin/media/edit/:id') {
                funArray = [this.getSingleMedia(route.params.id)];
            }
            else {
                //Set Trash From Router If Present
                this.mediafilters['column']='media_id';
                this.mediafilters['type'] ='globalmedia,document';
                funArray = [this.getMediaList(this.mediafilters)];
            }

            Promise.all(funArray).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get users
     *
     * @returns {Promise<any>}
     */
    getMediaList(mediafilters: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}media/list`, { params: mediafilters })
                .subscribe((response: any) => {
                    this.media = response;
                    this.onMediaChanged.next(this.media);
                    resolve(response);
                }, reject);
        });
    }
    getMediaListForTinymac(mediafilters: any): Observable<any> {

        return this._httpClient.get(`${this.appConfig.url.apiUrl}media/list`, { params: mediafilters });

    }

    ConvertBase64(mediafilters: any): Observable<any> {

        return this._httpClient.get(`${this.appConfig.url.apiUrl}media/getbaseimage`, { params: mediafilters });

    }

    GetAllDate(): Observable<any> {

        return this._httpClient.get(`${this.appConfig.url.apiUrl}media/getfilterdates`);

    }

    getSingleMedia(id: number) {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}view/mediaview`, { params: { 'media_id': id.toString() } })
                .subscribe((response: any) => {
                    this.singlemedia = response.mediainfo;
                    resolve(response);
                }, reject);
        });
    }
}