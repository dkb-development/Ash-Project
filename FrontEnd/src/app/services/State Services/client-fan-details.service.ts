import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientFanDetailsService {

  private readonly _fan_list = new BehaviorSubject<any>([]);
  public fan_list$ = this._fan_list.asObservable();
  
  constructor() { }

  setFanList(fan_list: any){
    this._fan_list.next(fan_list);
  }
  getFanList(){
    return this._fan_list.getValue();
  }
  updateFanDetails(fan_details: any){
    var fan_list = this._fan_list.getValue();
    for(var fan of fan_list){
      if(fan._id == fan_details._id){
        fan.is_restricted = fan_details.is_restricted;
        break;
      }
    }

    this._fan_list.next(fan_list);
  }
  
}
