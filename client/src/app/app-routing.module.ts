import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { UsersResolver } from '@resolvers/users.resolver';

const routes: Routes = [{
  path: '',
  resolve: { resolverResponse: UsersResolver },
  component: HomePageComponent
},
{
  path: '404',
  component: PageNotFoundComponent
},
{ path: '**', pathMatch: 'full', redirectTo: '404' }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
