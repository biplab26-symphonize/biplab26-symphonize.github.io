import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'element-content-boxes',
  templateUrl: './content-boxes.component.html',
  styleUrls: ['./content-boxes.component.scss']
})
export class ContentBoxesComponent implements OnInit {
  @Input() element:any;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }


}
