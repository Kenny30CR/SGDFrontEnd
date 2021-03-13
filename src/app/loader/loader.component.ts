import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../shared/services/loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  isLoading: Subject<boolean>= this.loaderSrv.isLoading;
  constructor(private loaderSrv: LoaderService) { }

  ngOnInit(): void {
  }

}
 