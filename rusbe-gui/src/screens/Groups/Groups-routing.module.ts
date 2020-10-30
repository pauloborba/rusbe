import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Groups } from './Groups.component';
import { NewGroup} from './NewGroup.component';

const routes: Routes = [
  {
    path: '',
    component: Groups,
  },
  {
    path: 'newgroup',
    component: NewGroup,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule {}
