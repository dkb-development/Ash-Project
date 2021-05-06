import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route, ChildrenOutletContexts } from '@angular/router';
import { User_auth_routes } from './routing/user/user_routing';

// Client Routes
import { Client_routes } from './routing/client_routes/client_routes';
import { UserHomeComponent } from './containers/user_containers/user-home/user-home.component';


// var routes:Routes[] = [];
var routes: Route[] = [
  { path: '', component: UserHomeComponent },
  
]

// Adding User Authentication Routes
routes = routes.concat(User_auth_routes);
routes = routes.concat(Client_routes);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
