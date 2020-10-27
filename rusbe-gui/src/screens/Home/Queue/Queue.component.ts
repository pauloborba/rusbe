import {Component, OnInit} from '@angular/core';
import {QueueStatusEnum} from '../../../../../common/QueueStatus.enum';
import {PopoverController} from '@ionic/angular';
import {VotingPopover} from './Voting.popover';
import QueueVote from '../../../../../common/queueVote';

@Component({
    selector: 'app-queue',
    templateUrl: './Queue.component.html',
    styleUrls: ['./Queue.component.scss']
})
export class Queue implements OnInit {
    loadersShow: object = {
        gettingStatus: false,
        gettingWaitTime: false,
        gettingVoteRight: false
    };
    voteRight: boolean;
    voteButtonLabel: string;
    voteButtonIcon: string;
    queueStatus: string;
    iconAmount: Array<number>;
    waitTime: string;

    constructor(public popoverController: PopoverController) { }

    async presentPopover() {
        const popover = await this.popoverController.create({
            component: VotingPopover,
            cssClass: 'capable-width'
        });

        await popover.present();

        const voteOption = await popover.onDidDismiss();

        if (voteOption.data) {
            this.doVote(voteOption.data);
        }
    }

    ngOnInit(): void {
        this.getQueueStatus();
        this.getVoteRight();
        this.getIconAmount();
        this.getWaitTime();
    }

    getQueueStatus(): void {
        this.queueStatus = QueueStatusEnum.MEDIUM;
    }

    getVoteRight(): void {
        this.voteRight = true;
        this.updateButtonInfo();
    }

    updateButtonInfo(): void {
        if (this.voteRight) {
            this.voteButtonIcon = 'file-tray-full-outline';
            this.voteButtonLabel = 'VOTE';
        }
        else {
            this.voteButtonIcon = 'checkmark-outline';
            this.voteButtonLabel = 'VOTED';
        }
    }

    getIconAmount(): void {
        if (this.queueStatus === QueueStatusEnum.SMALL) {
            this.iconAmount = Array(1);
        } else if (this.queueStatus === QueueStatusEnum.MEDIUM) {
            this.iconAmount = Array(2);
        } else if (this.queueStatus === QueueStatusEnum.LARGE) {
            this.iconAmount = Array(3);
        }
    }

    getWaitTime(): void {
        this.waitTime = '30m';
    }

    getStatusColor(): string {
        if (this.queueStatus === QueueStatusEnum.LARGE) {
            return 'red';
        } else if (this.queueStatus === QueueStatusEnum.MEDIUM) {
            return 'yellow';
        } else {
            return 'green';
        }
    }

    doVote(voteOption): void {
        const userVote = new QueueVote();
        userVote.state = QueueStatusEnum[voteOption];
        userVote.validity = this.getVoteValidityFromNow();

        this.voteRight = false;
        this.updateButtonInfo();
    }

    getVoteValidityFromNow(): number {
        const now = Math.floor(new Date().getTime() / 1000);
        const thirtyMinutes = 1800;

        return now + thirtyMinutes;
    }
}
