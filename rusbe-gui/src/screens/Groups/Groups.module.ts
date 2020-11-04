import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Groups } from './GroupList.component';
import { NewGroup } from './NewGroup.component'
import { GroupMsgs } from './Group.component'
import { GroupsRoutingModule } from './Groups-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    GroupsRoutingModule
  ],
  declarations: [Groups, NewGroup, GroupMsgs]
})
export class GroupsPageModule {}
