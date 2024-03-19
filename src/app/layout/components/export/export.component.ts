import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent
{
    public exportOption: string;
    exportList: any = {'.csv':'CSV Format','.xlsx':'Excel Format'};
    /**
     * Constructor
     *
     * @param {MatDialogRef<ExportComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<ExportComponent>
    )
    {
      
    }

}
