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
    loadersShow: any = {
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

    /**
     * Presents the popover for the user to vote about the queue status.
     */
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

    /**
     * Initial function to get the queue information.
     */
    ngOnInit(): void {
        this.getQueueStatus();
        this.getVoteRight();
    }

    /**
     * Gets the queue status from the server.
     * In case of failure an alert is presented showing the reason of failure.
     */
    getQueueStatus(): void {
        this.loadersShow.gettingStatus = true;

        this.queueService.getQueueStatus().subscribe(
            value => {
                this.queueStatus = value;
                this.loadersShow.gettingStatus = false;
                this.getIconAmount();
                this.calculateWaitTime();
            },
            async error => {
                const alert = await this.alertController.create({
                    header: 'Error!',
                    message: error.message,
                });

                await alert.present();
            }
        );

        this.queueStatus = QueueStatusEnum.MEDIUM;
    }

    /**
     * Gets the user vote right from the server.
     * In case of failure an alert is presented showing the reason of failure.
     */
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

    /**
     * Gets the current logged user and returns it.
     */
    getCurrentUser(): object {
        return JSON.parse(localStorage.getItem('user'));
    }

    /**
     * Updates the vote button icon and text based on the current user vote right.
     */
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

    /**
     * Updates the amount of icons to be shown based on the current status of the queue.
     */
    getIconAmount(): void {
        if (this.queueStatus === QueueStatusEnum.SMALL) {
            this.iconAmount = Array(1);
        } else if (this.queueStatus === QueueStatusEnum.MEDIUM) {
            this.iconAmount = Array(2);
        } else if (this.queueStatus === QueueStatusEnum.LARGE) {
            this.iconAmount = Array(3);
        }
    }

    /**
     * Calculates the current wait time based on the current status of the queue.
     */
    calculateWaitTime(): void {
        if (this.queueStatus === QueueStatusEnum.SMALL) {
            this.waitTime = '7m';
        } else if (this.queueStatus === QueueStatusEnum.MEDIUM) {
            this.waitTime = '15m';
        } else if (this.queueStatus === QueueStatusEnum.LARGE) {
            this.waitTime = '45m';
        }
    }

    /**
     * Returns the CSS class to be applied on the queue status and icons based on the current queue status value.
     */
    getStatusColor(): string {
        if (this.queueStatus === QueueStatusEnum.LARGE) {
            return 'red';
        } else if (this.queueStatus === QueueStatusEnum.MEDIUM) {
            return 'yellow';
        } else {
            return 'green';
        }
    }

    /**
     * Builds and sends to the server the necessary votation object of the queue.
     * In case of success the user right to vote is blocked and the button information is updated.
     * In case of failure an alert is presented showing the reason of failure.
     * @param voteOption The user option about the queue status to compose the votation object.
     */
    doVote(voteOption): void {
        const votationObject = this.buildVotationObject(voteOption);
        this.voteRight = false;

        this.queueService.doVote(votationObject).subscribe(
            value => {
                if (typeof value === 'boolean') {
                    this.getVoteRight();
                    this.getQueueStatus();
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

    /**
     * Builds and returns a votation object.
     * Such object is composed by the current user and its vote.
     * @param voteOption The option of the user about the queue status to compose the votation object.
     */
    buildVotationObject(voteOption): object {
        const votationObject = {
            vote: this.buildUserVote(voteOption),
            user: this.getCurrentUser()
        };

        return votationObject;
    }

    /**
     * Builds and returns a QueueVote object.
     * Such object has the user vote about the queue status and a validity timestamp.
     * @param voteOption The user vote about the queue status.
     */
    buildUserVote(voteOption): QueueVote {
        const vote = new QueueVote();
        vote.state = QueueStatusEnum[voteOption];
        vote.validity = this.getVoteValidityFromNow();

        return vote;
    }

    /**
     * Gets and returns a correct validity timestamp for composing the user vote.
     * A vote is considered valid from the moment of its creation up to 30 minutes, such time calculation is done here.
     */
    getVoteValidityFromNow(): number {
        const now = new Date().getTime();
        const thirtyMinutes = 1800000;

        return now + thirtyMinutes;
    }
}
