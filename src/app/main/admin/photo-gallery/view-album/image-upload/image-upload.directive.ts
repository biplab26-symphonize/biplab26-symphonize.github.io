import {
    Directive,
    HostBinding,
    HostListener,
    Output,
    EventEmitter,
    Input
  } from "@angular/core";
  import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
  
  export interface FileHandle {
    file: File
  }
  
  @Directive({
    selector: "[imageDragDrop]"
  })
  export class ImageUploadDirective {
    @Input() multiple: boolean=false;
    @Input() fileLimit: number=2;
    @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();
    //Invalid file
    @Output() invalidFile: EventEmitter<any> = new EventEmitter();
  
    @HostBinding("style.background") private background = "#eee";
    imageTypes: any[]=['image/png','image/jpeg','image/jpg','image/bmp','image/gif','image/svg'];
    constructor(private sanitizer: DomSanitizer) { }
  
    @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = "#999";
    }
  
    @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = "#eee";
    }
  
    @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#eee';
    
      let files: FileHandle[] = [];
      let length = this.multiple==true ? evt.dataTransfer.files.length : 1;
      for (let i = 0; i < length; i++) {
        const file = evt.dataTransfer.files[i];
        const fileSize = file.size;
        let maxfileSize = 1024 * (this.fileLimit * 1024);
        if(this.imageTypes.includes(file.type) && fileSize<=maxfileSize){        
          files.push({ file });
        }
        else{
          var invalidMsg = file.type!=="application/pdf" ? file.name + ' has an invalid extension. Valid extension(s): pdf.' : 'Allowed file size is '+this.fileLimit+' MB'; 
          this.invalidFile.emit({message:invalidMsg,buttonText:'OK'});
        }
      }
      if (files.length > 0) {
        this.files.emit(files);
      }
    }
  }
  