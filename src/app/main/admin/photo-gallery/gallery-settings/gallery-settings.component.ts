import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { SettingsService } from 'app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfigService } from '@fuse/services/config.service';
import { CommonUtils } from 'app/_helpers';

@Component({
  selector: 'app-gallery-settings',
  templateUrl: './gallery-settings.component.html',
  styleUrls: ['./gallery-settings.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class GallerySettingsComponent implements OnInit {
  public gallerySettings : FormGroup;


  constructor(private fb : FormBuilder,
              private settingsservices :SettingsService,
              private _fuseConfigService: FuseConfigService,
              private _matSnackBar : MatSnackBar) {
                this._fuseConfigService.config = CommonUtils.setVerticalLayout();
                this._fuseConfigService.defaultConfig = CommonUtils.setVerticalLayout();
              }

  ngOnInit() {

     this.setcontrol()
    let response = this.settingsservices.setting;
    this.patchValue(response)
  }

  setcontrol(){
    this.gallerySettings = this.fb.group({
      galley_sort                               : this.fb.control(''),
      album_sort                                : this.fb.control(''),
      album_thumb_width                         : this.fb.control(''),
      album_thumb_hight                         : this.fb.control(''),
      gallery_thumb_hight                       : this.fb.control(''),
      gallery_thumb_width                       : this.fb.control(''),
      image_thumb_hight                         : this.fb.control(''),
      image_thumb_width                         : this.fb.control(''),
    });
  }
    // settings patch value
   patchValue(data){
      let settingdata  = JSON.parse(data.settingsinfo.meta_value);
      this.gallerySettings.patchValue(settingdata);
      this.gallerySettings.get('album_thumb_width').patchValue(settingdata.album_thumb.album_thumb_width);
      this.gallerySettings.get('album_thumb_hight').patchValue(settingdata.album_thumb.album_thumb_hight);
      this.gallerySettings.get('gallery_thumb_hight').patchValue(settingdata.gallery_thumb.gallery_thumb_hight);
      this.gallerySettings.get('gallery_thumb_width').patchValue(settingdata.gallery_thumb.gallery_thumb_width);
      this.gallerySettings.get('image_thumb_hight').patchValue(settingdata.image_thumb.image_thumb_hight);
      this.gallerySettings.get('image_thumb_width').patchValue(settingdata.image_thumb.image_thumb_width);
    
   }

  //  save the setting data
  SaveSettings(){
     let settingData =  this.gallerySettings.value
     let album_thumb ={
       album_thumb_hight : settingData.album_thumb_hight,
       album_thumb_width  : settingData.album_thumb_width 
     }
     let gallery_thumb ={
      gallery_thumb_hight : settingData.gallery_thumb_hight,
      gallery_thumb_width : settingData.gallery_thumb_width 
    }
    let  image_thumb ={
      image_thumb_hight : settingData.image_thumb_hight,
      image_thumb_width : settingData.image_thumb_width 
    }

     let saveData = {
      meta_type: 'M', 
      meta_key: 'gallery_settings',
      meta_value : JSON.stringify({ galley_sort : settingData.galley_sort,
                                  album_sort : settingData.album_sort,
                                  album_thumb:album_thumb,
                                  gallery_thumb:gallery_thumb,
                                  image_thumb:image_thumb})
    };  
    this.settingsservices.createSetting(saveData)
    .then(response =>
      {
        this._matSnackBar.open(response.message, 'CLOSE', {
          verticalPosition: 'top',
          duration        : 2000
      });
      },
      error => {
        // Show the error message
        this._matSnackBar.open(error.message, 'Retry', {
                verticalPosition: 'top',
                duration        : 2000
        });
    });
  }
  
}