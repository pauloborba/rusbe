import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Groups } from './Groups.component';
import { NewGroup } from './NewGroup.component'

import { GroupsRoutingModule } from './Groups-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    GroupsRoutingModule
  ],
  declarations: [Groups, NewGroup]
})
export class GroupsPageModule {}
