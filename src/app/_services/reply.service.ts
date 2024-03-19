import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient,HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfig,OptionsList } from 'app/_services';

@Injectable()
export class ReplyService implements Resolve<any>
{
    replies: any;
    reply: any={};
    onRepliesChanged: BehaviorSubject<any>;
    onReplyChanged: BehaviorSubject<any>;
    appConfig: any;
    optionsList: any;
    replyfilters: object={};
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onRepliesChanged = new BehaviorSubject({});
        this.onReplyChanged  = new BehaviorSubject({});
        this.appConfig      = AppConfig.Settings;
        this.optionsList    = OptionsList.Options;
        this.replyfilters    = this.optionsList.tables.pagination.filters;
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            
            let funArray:any[];
            //call functions on route path values
            if(route.routeConfig.path=='admin/forums/replies/edit/:id' && route.params.id>0){
                funArray = [this.getReply(route.params.id)];
            }
            else{
                //Set sorting for ID
                this.replyfilters['topic_id']   = route.params.topic_id>0 ? route.params.topic_id : '';
                this.replyfilters['column']     = 'reply_id';
                this.replyfilters['direction']  = 'desc';
                this.replyfilters['front']      = 0;
                //Set Trash From Router If Present
                this.replyfilters['trash'] = route.data.trash ? route.data.trash : '';
                funArray = [this.getReplies(this.replyfilters)];
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
     * Get Replies
     *
     * @returns {Promise<any>}
     */
    getReplies(filters:any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${this.appConfig.url.apiUrl}list/replies`,{params:filters})
                .subscribe((response: any) => {
                    this.replies = response.contentrepliesinfo;
                    this.onRepliesChanged.next(this.replies);
                    resolve(response);
                }, reject);
        });
    }
    /**
     * Get Single Reply
     *
     * @returns {Promise<any>}
     */
    getReply(id:number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let params = new HttpParams();
            params = params.set('reply_id', id.toString());
            this._httpClient.get(`${this.appConfig.url.apiUrl}view/replies`,{params:params})
                .subscribe((response: any) => {
                    this.reply = response.replyinfo;
                    this.onReplyChanged.next(this.reply);
                    resolve(response);
                }, reject);
        });
    }
    
    /** SAVE REPLY */
    saveReply(replyInfo:any,update:boolean=false): Observable<any>{
        //set api endpoint accroding edit or add view 
        let apiendpoint = update == true ? 'update/replies' : 'create/replies';
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl+apiendpoint}`,replyInfo)
                .pipe(catchError(this.errorHandler));
    }
    /** DELETE REPLY */
    deleteReply(deleteInfo:any): Observable<any>{
        return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/replies`,deleteInfo)
                .pipe(catchError(this.errorHandler));
    }
    /** HANDLE HTTP ERROR */
    errorHandler(error: HttpErrorResponse){
     return Observable.throw(error.message);
    }
}
