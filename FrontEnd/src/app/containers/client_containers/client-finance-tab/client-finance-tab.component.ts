import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-finance-tab',
  templateUrl: './client-finance-tab.component.html',
  styleUrls: ['./client-finance-tab.component.css']
})
export class ClientFinanceTabComponent implements OnInit {
  multi: any ;
  multi_all_time: any = [
    {
      "name": "Client Name",
      "series": [
        {
          "name": "2019",
          "value": 73000000
        },
        {
          "name": "2020",
          "value": 62000000
        },
        {
          "name": "2021",
          "value": 89400000
        }
      ]
    },
  ];
  multi_year: any = [
    {
      "name": "Client Name",
      "series": [
        {
          "name": "January",
          "value": 620000
        },
        {
          "name": "February",
          "value": 730000
        },
        {
          "name": "March",
          "value": 894000
        }
      ]
    },
  ];
  multi_month: any = [
    {
      "name": "Client Name",
      "series": [
        {
          "name": "10",
          "value": 7300
        },
        {
          "name": "20",
          "value": 8940
        },
        {
          "name": "29",
          "value": 6200
        }
      ]
    },
  ]
  multi_today: any = [
    {
      "name": "Client Name",
      "series": [
        {
          "name": "06:00",
          "value": 89
        },
        {
          "name": "12:00",
          "value": 62
        },
        {
          "name": "18:00",
          "value": 73
        }
      ]
    },
  ]

  graph_width=600;
  graph_height = 300;
  view:[number,number ] = [this.graph_width, this.graph_height];
  
  constructor() { 
    this.multi = this.multi_all_time;
    Object.assign(this, this.multi);
  }

  ngOnInit(): void {
    this.graph_width = $('.client_earning_graph_analysis').innerWidth();
    this.graph_height = $('.client_earning_graph_analysis').innerHeight();
    console.log(this.graph_width,this.graph_height)
    this.view = [this.graph_width, this.graph_height];





    $("#time_line_menu li div").click(function() {
      if($(this).parent().hasClass('active_timeline_btn')){
        $(this).parent().siblings().removeClass('active_timeline_btn');
      }
      $(this).parent().addClass('active_timeline_btn').siblings().removeClass('active_timeline_btn');
  
      });
  }


  

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Time Line';
  yAxisLabel: string = 'Earning';
  timeline: boolean = true;
  gradients: boolean = true;

  colorScheme = {
    domain: ['#1D3557', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  onSelect(event: any) {
    console.log(event);
  }

  setTimeLineAllTime(){
    this.multi = this.multi_all_time;
  }
  setTimeLineThisYear(){
    this.multi = this.multi_year;
  }
  setTimeLineThisMonth(){
    this.multi = this.multi_month;
  }
  setTimeLineToday(){
    this.multi = this.multi_today;
  }
}
