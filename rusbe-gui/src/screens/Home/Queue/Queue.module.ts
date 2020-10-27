import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Queue } from './Queue.component';
import { VotingPopover } from './Voting.popover';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [Queue, VotingPopover]
})
export class QueueModule {}
