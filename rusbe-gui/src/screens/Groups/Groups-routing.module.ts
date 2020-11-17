import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Groups } from './GroupList.component';
import { NewGroup} from './NewGroup.component';
import { GroupMsgs } from './Group.component'

const routes: Routes = [
  {
    path: '',
    component: Groups,
  },
  {
    path: 'newgroup',
    component: NewGroup,
  },
  {
    path: 'groupmsgs/:groupId',
    component: GroupMsgs,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule {}
