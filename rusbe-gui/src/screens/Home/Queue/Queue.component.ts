import {Component, OnInit} from '@angular/core';
import { QueueStatusEnum } from './QueueStatus.enum';

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
    voteButtonLabel = 'VOTE';
    queueStatus: string;
    iconAmount: Array<number>;
    waitTime: string;

    ngOnInit(): void {
        this.getQueueStatus();
        this.getIconAmount();
        this.getWaitTime();
    }

    getQueueStatus(): void {
        this.queueStatus = QueueStatusEnum.MEDIUM;
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
}
