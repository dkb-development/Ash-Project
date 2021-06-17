import { RouterModule, Routes, Route } from '@angular/router';
import { ClientDashboardComponent } from 'src/app/containers/client_containers/client-dashboard/client-dashboard.component';
import { ClientFansTabComponent } from 'src/app/containers/client_containers/client-fans-tab/client-fans-tab.component';
import { ClientFinanceTabComponent } from 'src/app/containers/client_containers/client-finance-tab/client-finance-tab.component';
import { ClientHomeComponent } from 'src/app/containers/client_containers/client-home/client-home.component';
import { ClientMessagingComponent } from 'src/app/containers/client_containers/client-messaging/client-messaging.component';
import { ClientProfileComponent } from 'src/app/containers/client_containers/client-profile/client-profile.component';
import { ClientUploadComponent } from 'src/app/containers/client_containers/client-upload/client-upload.component';


export var Client_routes: Route[] = [
    { 
        path: 'client',
        component: ClientDashboardComponent ,
        children: [
          { path: 'home', component: ClientHomeComponent },
          { path: 'upload', component: ClientUploadComponent },
          { path: 'messaging', component: ClientMessagingComponent },
          { path: 'fans_tab', component: ClientFansTabComponent },
          { path: 'finance', component: ClientFinanceTabComponent },
          { path: 'profile', component: ClientProfileComponent },
          { path: '**', redirectTo: 'home' }, 
        ]

    },
    // {
    //    path: '*', redirectTo: 'client/home' , 
    // }
];


