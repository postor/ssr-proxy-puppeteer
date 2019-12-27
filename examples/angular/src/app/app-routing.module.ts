import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FooComponent } from './foo/foo.component'
import { BarComponent } from './bar/bar.component'
import { IndexComponent } from './index/index.component'

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'foo', component: FooComponent },
  { path: 'bar', component: BarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
