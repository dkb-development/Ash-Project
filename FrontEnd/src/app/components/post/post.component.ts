import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input()
  post_details: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.post_details.media);
  }

}
