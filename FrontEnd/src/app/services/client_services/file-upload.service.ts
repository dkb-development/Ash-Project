import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

// Services
import {AuthService} from '../user_services/auth.service';
import { CurrentUserStateService } from '../State Services/current-user-state.service';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private http: HttpClient,
    private AuthService: AuthService,
    private CurrentUserStateService: CurrentUserStateService
    ) { }
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  authHeaders = { headers: new HttpHeaders().set("Authorization", "Bearer " + this.AuthService.getToken()) }

  getpresignedurls(logNamespace: any, fileType: any) {
    let getheaders = new HttpHeaders().set('Accept', 'application/json');
    let params = new HttpParams().set('fileName', logNamespace).set('fileType', fileType);
    return this.http.get<any>(environment.apiBaseUrl + 'generatepresignedurl', { params: params, headers: getheaders });
  }

  getPresignedUrlClientProfilePicture(logNamespace: any){
    if(!this.CurrentUserStateService.getCurrentUser().is_client){
      console.log("Client is NOT uploading")
      return this.getPresignedUrlUserProfilePicture(logNamespace);
    }
    else{
      let getheaders = new HttpHeaders().set('Accept', 'application/json');
      let params = new HttpParams().set('fileName', "Client Profile/"+logNamespace).set('fileType', 'image');
      return this.http.get<any>(environment.apiBaseUrl + 'generatepresignedurl', { params: params, headers: getheaders });
    }
    
  }
  getPresignedUrlUserProfilePicture(logNamespace: any){
    let getheaders = new HttpHeaders().set('Accept', 'application/json');
    let params = new HttpParams().set('fileName', "User Profile/"+logNamespace).set('fileType', 'image');
    return this.http.get<any>(environment.apiBaseUrl + 'generatepresignedurl', { params: params, headers: getheaders });
  }
  uploadfileAWSS3(fileuploadurl: any, contenttype: any, file: any) { 
 
    const headers = new HttpHeaders({ 'Content-Type': contenttype });
    const req = new HttpRequest(
      'PUT',
      fileuploadurl,
      file,
      {
        headers: headers, 
      });
    return this.http.request(req);
  }

  uploadPost(post: any){
    
    try {
      // console.log(this.authHeaders);
      var res = this.http.post(environment.apiBaseUrl + 'client/create_post', post,this.authHeaders);
      return res;
    } 
    catch (error) {
      console.log(error);
      return error;
    }
    
  }

  
}
