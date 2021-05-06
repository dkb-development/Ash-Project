import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-client-fans-tab',
  templateUrl: './client-fans-tab.component.html',
  styleUrls: ['./client-fans-tab.component.css']
})
export class ClientFansTabComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // $(document).ready(function () {
    //   $('#dtBasicExample').DataTable();
    //   $('.dataTables_length').addClass('bs-select');
    // });
  }

}
