import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AppConfig } from 'app/_services';

//UPLOAD FILE DATA OPTION HEADERS
const HttpUploadOptions = {
  headers: new HttpHeaders({  "Accept":"multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  appConfig: any;
    usersettings:any;
    constructor(
        private _httpClient : HttpClient,
        private _appConfig:AppConfig) {
        this.appConfig      = AppConfig.Settings;
    }
    /**  
    * Get Documents List
    */
    getDocuments(documentInfo:any){
      return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/documents`, {params:documentInfo})
      .pipe(catchError(this.errorHandler));
    }
    /** GET DOCUMENT OBJECT BY MENUID */
    getDocumentByMenuid(documentInfo:any){
      return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}view/menudocument`, {params:documentInfo})
      .pipe(catchError(this.errorHandler));
    }
    /** Upload Multiple Documents for archive types */
    saveSorting(sortingInfo:any){
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}actions/documentsorting`, sortingInfo, HttpUploadOptions)
        .pipe(catchError(this.errorHandler));    
    }
    /** Upload Multiple Documents for archive types */
    saveDocuments(documentInfo:any){
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}create/documents`, documentInfo, HttpUploadOptions)
        .pipe(catchError(this.errorHandler));    
    }
    /** UPLOAD Single PDF For File Uploader Url menu */
    saveSingleDocument(documentInfo:any){
     
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}create/createdocument`, documentInfo, HttpUploadOptions)
        .pipe(catchError(this.errorHandler));    
    }
    /**Upload multiple documents for file uploader archive menu */
    saveMultipleDocument(documentInfo:any){
     
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}create/createdocuments`, documentInfo, HttpUploadOptions)
        .pipe(catchError(this.errorHandler));    
    }
    /** Update Single Document with name / category / file(optional) */
    editSingleDocument(documentInfo:any){
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/updatedocument`, documentInfo, HttpUploadOptions)
        .pipe(catchError(this.errorHandler));    
    }
    /** APPLY CATWGORY ON MULTIPLE DOCUMENTS */
    applyCategory(documentInfo:any){
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}update/documentcategory`, documentInfo, HttpUploadOptions)
        .pipe(catchError(this.errorHandler));    
    }
    /** DELETE USERS */
    deleteDocument(deleteInfo:any): Observable<any>{
      return this._httpClient.post<any>(`${this.appConfig.url.apiUrl}delete/documents`,deleteInfo)
        .pipe(catchError(this.errorHandler));
    }
     /** ARCHIEVE DOCUMENT */
    archieveDocument(Info:any): Observable<any>{
      return this._httpClient.get<any>(`${this.appConfig.url.apiUrl}list/categorydocuments`,{params :Info})
        .pipe(catchError(this.errorHandler));
    }
    errorHandler(error: HttpErrorResponse){
      return Observable.throw(error.message);
    }
}
