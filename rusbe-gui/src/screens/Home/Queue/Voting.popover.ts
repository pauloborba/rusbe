import { Component, Input } from '@angular/core';
import { QueueStatusEnum } from '../../../../../common/QueueStatus.enum';
import {PopoverController} from '@ionic/angular';

@Component({
    selector: 'voting-popover',
    templateUrl: './Voting.popover.html',
    styleUrls: ['./Queue.component.scss']
})

export class VotingPopover {
    constructor(public popoverController: PopoverController) {}

    options = Object.values(QueueStatusEnum);
    selectedOption: string;

    getIconAmount(option: QueueStatusEnum): Array<number> {
        if (option === QueueStatusEnum.LARGE) {
            return Array(3);
        } else if (option === QueueStatusEnum.MEDIUM) {
            return Array(2);
        } else {
            return Array(1);
        }
    }

    setSelectedOptionValue(event: any) {
        this.selectedOption = event.detail.value;
    }

    async createVote() {
        await this.popoverController.dismiss(this.selectedOption);
    }
}
