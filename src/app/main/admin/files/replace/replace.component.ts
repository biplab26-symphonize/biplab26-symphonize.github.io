import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { AppConfig, SettingsService, FilesService, CommonService } from 'app/_services';

@Component({
  selector: 'app-replace',
  templateUrl: './replace.component.html',
  styleUrls: ['./replace.component.scss'],
  animations: fuseAnimations
})
export class ReplaceComponent implements OnInit {

  public green_bg_header: any;
  public button: any;
  public accent: any;
  isSubmit: boolean = false;
  editReplaceForm: boolean = true;
  replaceform: FormGroup;
  private _unsubscribeAll: Subject<any>;
  _fileappConfig: any = AppConfig.Settings;
  menuInfo: any;
  documentInfo: any;
  defaultUrl: string = 'download/viewdocument/';
  ViewDocumentUrl: string = '';
  fileUploaderSettings: any = {};
  constructor(
    private _commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private _fileSettings: SettingsService,
    private _fileService: FilesService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    //Form Group
    this.setFormControls();
    this.menuInfo = this.route.snapshot.data.menu.menuinfo;
    //GET DOCUMENT INFO BY MENU ID
    this._fileService.getDocumentByMenuid({ menu_id: this.menuInfo.menu_id }).subscribe(docInfo => {
      this.documentInfo = docInfo.documentsinfo;
      if (this.documentInfo && this.documentInfo.doc_id) {
        this.ViewDocumentUrl = this._fileappConfig.url.apiUrl + this.defaultUrl + this.documentInfo.doc_id + '/' + this.documentInfo.doc_name;
      }
    })

    //Settings
    this._fileSettings.getSetting({ 'meta_key': 'documentsettings' }).then(filesettings => {
      if (filesettings.status == 200) {
        const UploaderSettings = JSON.parse(filesettings.settingsinfo.meta_value) || [];
        this.fileUploaderSettings = UploaderSettings.length > 0 ? UploaderSettings[0] : {};
      }
    });

    // apply theme settings
    let themeData: any = this._commonService.getLocalSettingsJson('themesettings');
    if (typeof themeData == 'string') {
      let currentData = JSON.parse(themeData);
      themeData = currentData[0];
    }
    this.accent = { 'background-color': themeData.admin_navigation_bar_background_color, 'color': themeData.admin_navigation_bar_font_color };
    this.green_bg_header = { 'background-color': themeData.table_header_background_color, 'color': themeData.table_font_color };
    this.button = { 'background-color': themeData.button_background_color, 'font-size': themeData.button_font_size, 'color': themeData.button_font_color };
  }

  /** define form group controls */
  setFormControls() {
    //Declare For fields
    this.replaceform = this._formBuilder.group({
      file: []
    });

  }

  updateMenuUrlInfo($event: Object = {}) {
    console.log($event);
    if ($event['doc_id'] !== '' && $event['doc_id'] !== null) {
      this.documentInfo = $event;
      this.ViewDocumentUrl = this._fileappConfig.url.apiUrl + this.defaultUrl + $event['doc_id'] + '/' + $event['doc_name'];

    }
  }
  /**SAVE FORM DATA */
  onSubmit(formData: any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.replaceform.valid) {
      this.isSubmit = true;

    }
  }

  /** SHOW SNACK BAR */
  showSnackBar(message: string, buttonText: string) {
    this._matSnackBar.open(message, buttonText, {
      verticalPosition: 'top',
      duration: 2000
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}

