import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfig, OptionsList } from 'app/_services';
import { AuthService } from './auth.service';

//UPLOAD FILE DATA OPTION HEADERS
const HttpUploadOptions = {
  headers: new HttpHeaders({  "Accept":"multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  albums: any;
  medias:any[]=[];
  globelmedia: any[]=[];
  galleries: any;
  settings: any = [];
  album: any = {};
  gallery: any = {};
  onAlbumsChanged: BehaviorSubject<any>;
  onMediasChanged: BehaviorSubject<any>;
  onAlbumChanged: BehaviorSubject<any>;
  appConfig: any;
  optionsList: any;
  galleryfilters: object = {};
  /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
      private _httpClient: HttpClient,
      private authenticationService: AuthService
  ) {
      // Set the defaults
      this.onAlbumsChanged = new BehaviorSubject({});
      this.onMediasChanged = new BehaviorSubject({});
      this.onAlbumChanged = new BehaviorSubject({});
      this.appConfig = AppConfig.Settings;
      this.optionsList = OptionsList.Options;
      this.galleryfilters = this.optionsList.tables.pagination.filters;
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

        //call functions on route path values
        if ((route.routeConfig.path == 'admin/albums/edit/:galleryid/:id' || route.routeConfig.path == 'admin/view/album/:id') && route.params.id > 0) {
            funArray = [
              this.getAlbum(route.params.id),
              this.getMedia({category_id:route.params.id})
            ];
        }else if(route.routeConfig.path =='/admin/album/list'){
          funArray = [this.getAlbums(this.galleryfilters)];
        }
        else if ((route.routeConfig.path == 'admin/gallery/edit/:id' || route.routeConfig.path == 'admin/gallery/view/:id') && route.params.id > 0) {
          funArray = [this.getGallery(route.params.id)];
        }
        else {
            this.galleryfilters['id'] = '';
            this.galleryfilters['category_type'] = 'G';
            //Set sorting for ID
            this.galleryfilters['column'] = 'id';
            this.galleryfilters['direction'] = 'desc';
            //Set Trash From Router If Present
            this.galleryfilters['trash'] = route.data.trash ? route.data.trash : '';
            if(route.routeConfig.path == 'admin/galleries/list' || route.routeConfig.path == 'admin/galleries/trash'){
              this.galleryfilters['parent_id'] = 0;
              funArray = [this.getGalleries(this.galleryfilters)];
            }
            else{
              if(route.routeConfig.path == 'admin/albums/edit/:galleryid/:id' || route.routeConfig.path == 'admin/view/album/:id' || route.routeConfig.path == 'admin/trash/gallery/:id'){
                // this.galleryfilters['column'] = 'media_id';
                this.galleryfilters['column'] = 'id';
                funArray = [this.getAlbums(this.galleryfilters)];
              }
              this.galleryfilters['parent_id'] = route.params && route.params.id>0 ? route.params.id :'';
              funArray = [this.getAlbums(this.galleryfilters)];
            }            
        }

        Promise.all(funArray).then(
            () => {
                resolve();
            },
            reject
        );
    });
  }
  // Get Galleries
  getGalleries(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
        this._httpClient.get(`${this.appConfig.url.apiUrl}list/albums`, { params: filters })
            .subscribe((response: any) => {
                this.galleries = response;
                this.onAlbumsChanged.next(this.galleries);
                resolve(response);
            }, reject);
    });
  }

  // Get Gallery
  getGallery(albumId: number): Promise<any> {
    return new Promise((resolve, reject) => {
        let params = new HttpParams();
        params = params.set('id', albumId.toString());
        this._httpClient.get(`${this.appConfig.url.apiUrl}view/albums`, { params: params })
          .subscribe((response: any) => {
            this.gallery = response.albuminfo;
            this.onAlbumChanged.next(this.gallery);
            resolve(response);
          }, reject);
    });
  }
  
  /**
   * Get albums
   *
   * @returns {Promise<any>}
   */
  getAlbums(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
        this._httpClient.get(`${this.appConfig.url.apiUrl}list/albums`, { params: filters })
            .subscribe((response: any) => {
                this.albums = response;
                this.onAlbumsChanged.next(this.albums);
                resolve(response);
            }, reject);
    });
  }
  
  /**
   * Get Single User
   *
   * @returns {Promise<any>}
   */
  getAlbum(albumId: number): Promise<any> {
    return new Promise((resolve, reject) => {
        let params = new HttpParams();
        params = params.set('id', albumId.toString());
        this._httpClient.get(`${this.appConfig.url.apiUrl}view/albums`, { params: params })
          .subscribe((response: any) => {
            this.album = response.albuminfo;
            this.onAlbumChanged.next(this.album);
            resolve(response);
          }, reject);
    });
  }
  /**
   * Get medias
   *
   * @returns {Promise<any>}
   */
  getMedia(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
        this._httpClient.get(`${this.appConfig.url.apiUrl}media/list`, { params: filters })
            .subscribe((response: any) => {
              if(response.media){
                this.medias = response.media;
                this.onMediasChanged.next(this.medias);
                resolve(response);
              }
            }, reject);
    });
  }

  getGlobelMedia(filters: any): Promise<any> {
    return new Promise((resolve, reject) => {
        this._httpClient.get(`${this.appConfig.url.apiUrl}media/list`, { params: filters })
            .subscribe((response: any) => {
              if(response.media){
                this.globelmedia = response.media;
                this.onMediasChanged.next(this.globelmedia);
                resolve(response);
              }
            }, reject);
    });
  }
  /** SAVE USER */
  saveAlbum(albumInfo: any, update: boolean = false): Observable<any> {
      //set api endpoint accroding edit or add view 
      let apiendpoint = update == true ? 'update/categories' : 'create/categories';
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, albumInfo)
          .pipe(catchError(this.errorHandler));
  }
  /** DELETE USERS */
  deleteAlbums(deleteInfo: any): Observable<any> {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/categories`, deleteInfo)
        .pipe(catchError(this.errorHandler));
  }
  /** DELETE MEDIA */
  deleteMedia(deleteInfo: any): Observable<any> {
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}media/delete`, deleteInfo)
        .pipe(catchError(this.errorHandler));
  }
  /**Upload multiple documents for file uploader archive menu */
  saveMultipleMedia(mediaInfo:any){     
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}media/albums`, mediaInfo, HttpUploadOptions)
      .pipe(catchError(this.errorHandler));    
  }

  // edit the view album page 
  editviewalbum(albumInfo: any, update: boolean = false): Observable<any> {
    let apiendpoint = 'update/media';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, albumInfo)
        .pipe(catchError(this.errorHandler));
}
  // upload the selected media in media list of view album
  UploadSelectedMedia(albumInfo: any, update: boolean = false): Observable<any> {
    let apiendpoint = 'media/existingmediaupload';
    return this._httpClient.post<any>(`${this.appConfig.url.apiUrl + apiendpoint}`, albumInfo)
        .pipe(catchError(this.errorHandler));
}

//Get List
getWidgetImages(requestInfo: any): Observable<any> {
  return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/getalbumsimages`, { params: requestInfo })
      .pipe(catchError(this.errorHandler));
}



  /** HANDLE HTTP ERROR */
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message);
  }
}
