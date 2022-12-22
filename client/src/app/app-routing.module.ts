import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { SignalsResolver } from '@resolvers/iot-signal.resolver';
import { AlarmsPageComponent } from '@components/alarms-page/alarms-page.component';

const routes: Routes = [{
  path: '',
  resolve: { resolverResponse: SignalsResolver },
  component: HomePageComponent
},
{
  path: 'alarms',
  resolve: { resolverResponse: SignalsResolver },
  component: AlarmsPageComponent
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
