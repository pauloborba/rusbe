import {Component, OnInit} from '@angular/core';
import {QueueStatusEnum} from '../../../../../common/QueueStatus.enum';
import {AlertController, PopoverController} from '@ionic/angular';
import {VotingPopover} from './Voting.popover';
import QueueVote from '../../../../../common/queueVote';
import {QueueService} from '../../../service/Queue.service';
import user from '../../../../../rusbe-server/src/models/user';

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

    constructor(public popoverController: PopoverController,
                private queueService: QueueService,
                private alertController: AlertController) { }

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
        const userInfo = this.getCurrentUser();

        this.queueService.canVote(userInfo).subscribe(
            value => {
                if (typeof value === 'boolean') {
                    this.voteRight = value;
                    this.updateButtonInfo();
                }
            },
            async error => {
                this.updateButtonInfo();

                const alert = await this.alertController.create({
                    header: 'Error!',
                    message: error.message,
                });

                await alert.present();
            }
        );
    }

    getCurrentUser(): object {
        return JSON.parse(localStorage.getItem('user'));
    }

    updateButtonInfo(): void {
        if (this.voteRight === true) {
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
        const votationObject = this.buildVotationObject(voteOption);

        this.queueService.doVote(votationObject).subscribe(
            value => {
                if (typeof value === 'boolean') {
                    this.getVoteRight();
                }
            },
            async error => {
                this.voteRight = false;
                this.updateButtonInfo();

                const alert = await this.alertController.create({
                    header: 'Error!',
                    message: error.message,
                });
                await alert.present();
            }
        );

        this.voteRight = false;
        this.updateButtonInfo();
    }

    buildVotationObject(voteOption): object {
        const votationObject = {
            vote: this.buildUserVote(voteOption),
            user: this.getCurrentUser()
        };

        return votationObject;
    }

    buildUserVote(voteOption): QueueVote {
        const vote = new QueueVote();
        vote.state = QueueStatusEnum[voteOption];
        vote.validity = this.getVoteValidityFromNow();

        return vote;
    }

    getVoteValidityFromNow(): number {
        const now = new Date().getTime();
        const thirtyMinutes = 1800000;

        return now + 60000;
    }
}
