import { Component, OnInit } from '@angular/core';

// Servies
import { FileUploadService } from '../../../services/client_services/file-upload.service';
import { AuthService } from '../../../services/user_services/auth.service';
import { CurrentUserStateService } from '../../../services/State Services/current-user-state.service'

@Component({
  selector: 'app-client-change-profile-picture-modal',
  templateUrl: './client-change-profile-picture-modal.component.html',
  styleUrls: ['./client-change-profile-picture-modal.component.css']
})
export class ClientChangeProfilePictureModalComponent implements OnInit {

  constructor(
    private FileUploadService: FileUploadService,
    private AuthService: AuthService,
    private CurrentUserStateService: CurrentUserStateService
  ) { }

  ngOnInit(): void {



    $('#inputGroupFile02').on('change',function(){
      //get the file name
      var fileName: any = $(this).val();
      //replace the "Choose a file" label
      $(this).next('.custom-file-label').html(fileName);
    })
  }

  server_error: any = null;
  update_profile_picture_spinner = false;
  selectedFileTOUpload: any;
  addFile(event: any){
    this.selectedFileTOUpload = event.target.files[0];
  }
  uploadNewProfilePicture(new_profile_image_info: any){
    this.update_profile_picture_spinner = true;
    // console.log(new_profile_image_info.type.split('/')[0]);
    var filename = new_profile_image_info.replace(/^.*[\\\/]/, '')
    this.FileUploadService.getPresignedUrlClientProfilePicture(filename).subscribe(
      (res: any)=>{
        const fileuploadurl = res.urls[0];
        this.FileUploadService.uploadfileAWSS3(fileuploadurl, 'image', this.selectedFileTOUpload).subscribe(
          (res: any)=>{
            console.log(res);
            var media_url = res.url;
            var status = res.status;
            if(status == 200){
              this.AuthService.updateProfilePicture(media_url).subscribe(
                (res: any)=>{
                  this.CurrentUserStateService.updateCurrentUser(res);
                  this.update_profile_picture_spinner = false;
                  this.server_error = null;
                  $('#clientChangeProfilePictureModal').modal('hide');
                },
                (err: any)=>{
                  this.update_profile_picture_spinner = false;
                }
              )
            }
          },
          (err: any)=>{
            this.update_profile_picture_spinner = false;
            console.log(err);
          }
        )
      },
      (err: any)=>{
        this.update_profile_picture_spinner = false;
        console.log(err);
      }
    )
  }
}
