import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserPaymentService {

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  authHeaders = { headers: new HttpHeaders().set("Authorization", "Bearer " + this.AuthService.getToken()) }
  
  private pay_to_unlock_post = new BehaviorSubject(null);
  private pay_to_unlock_post_amount = new BehaviorSubject(0);
  // pay_to_unlock_post$: Observable<any> = this.pay_to_unlock_post.asObservable();
  constructor(
    private AuthService: AuthService,
    private http : HttpClient,
  ) { }
  // get_pay_to_unlock_amount(){
  //   if(this.pay_to_unlock_post != null){
  //     return this.pay_to_unlock_post.value.post_info.tip_to_unlock.asObservable();
  //   }
  //   var tmp=0;
  //   return tmp.asObservable();
  //   // return this.pay_to_unlock_post.value.post_info.tip_to_unlock.asObservable();
  // }
  get_pay_to_unlock_post_amount(){
    return this.pay_to_unlock_post_amount.asObservable();
  }
  get_pay_to_unlock_post(){
    return this.pay_to_unlock_post.value;
  }
  set_pay_to_unlock_post(pay_to_unlock_post: any){
    this.pay_to_unlock_post.next(pay_to_unlock_post);
    this.pay_to_unlock_post_amount.next(this.pay_to_unlock_post.value.post_info.tip_to_unlock);
  }
  reset_pay_to_unlock_post(){
    this.pay_to_unlock_post.next(null);
    this.pay_to_unlock_post_amount.next(0);
  }


  public subscription_fee_per_month_subject = new BehaviorSubject<number>(0);
  public subscription_fee_per_month = this.subscription_fee_per_month_subject.asObservable();
  get_subscription_fee_from_db(){
    this.http.get<any>(environment.apiBaseUrl + 'get_subscription_fee', this.authHeaders).subscribe(
      (res: any)=>{
        this.subscription_fee_per_month_subject.next(res.subscription_fee_per_month);
        
      },
      (err: any)=>{
        console.log(err);
      }
    );
  }
  get_subscription_fee(){
    this.get_subscription_fee_from_db();
    return this.subscription_fee_per_month_subject;
  }


  pay_to_subscribe(){
    return this.http.post<any>(environment.apiBaseUrl + 'pay_to_subscribe',{}, this.authHeaders);
  }
  
}
