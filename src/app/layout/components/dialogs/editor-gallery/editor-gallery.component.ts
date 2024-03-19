import { Component, OnInit, EventEmitter, Output, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaComponent } from 'app/layout/components/page-editor/media/media.component';

@Component({
  selector: 'editor-gallery',
  templateUrl: './editor-gallery.component.html',
  styleUrls: ['./editor-gallery.component.scss']
})
export class EditorGalleryComponent implements OnInit {
  @Input() controlName  : any;
  @Output() onMediaSelect    = new EventEmitter<any>();
  galleryDialogref: MatDialogRef<MediaComponent>;

  constructor(
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<EditorGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  OpenGallery(){
    this.galleryDialogref = this._matDialog.open(MediaComponent, {
      disableClose: false,
      panelClass: 'full-screen-dialog',
      data:{blank:true}
    });
    this.galleryDialogref.afterClosed()
      .subscribe(result => {
          if ( result && result.url ){
            let imageElement  = '<img src="'+result.url+'" class="tiny-image" alt="'+this.controlName+'" />' 
            const mediaData = {controlName:this.controlName,element:imageElement}
            this.onMediaSelect.emit(mediaData);
          }
          this.galleryDialogref = null;
    });
  }
}
