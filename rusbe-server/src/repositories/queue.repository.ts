import UserSchema from "../models/user";
import User from "../../../common/user";
import QueueVote from "../../../common/queueVote";
import {QueueStatusEnum} from "../../../common/QueueStatus.enum";
import {interval} from 'rxjs';

export class QueueRepository{
    usersWithVoteTimeout: any[];
    votes: QueueVote[];
    state: QueueStatusEnum;
    FIVE_MINUTES = 300000;
    THIRTY_MINUTES = 1800000;

    constructor() {
        this.votes = [];
        this.usersWithVoteTimeout = [];
        this.state = QueueStatusEnum.SMALL;

        interval(this.FIVE_MINUTES).subscribe(() => {
            this.refreshQueueStatus();
            this.refreshUserRights();
        });
    }


    /**
     * Refreshes periodically the queue status by removing the expired votes.
     * A vote is considered expired if 30 minutes had passed since its creation when related to the moment of check.
     */
    async refreshQueueStatus(): Promise<void> {
        const now = new Date().getTime();

        for(const [i, vote] of this.votes.entries()) {
            if (vote.validity <= now) {
                this.votes.splice(i, 1);
            }
        }
    }

    /**
     * Iterates over the array of user ids and expirations.
     * If the validity for a user has passed the current time, the user will be updated to have the right to vote again.
     */
    async refreshUserRights(): Promise<void> {
        const now = new Date().getTime();

        for(const [i, timedOutUser] of this.usersWithVoteTimeout.entries()) {
            if (timedOutUser.validity <= now) {
                const id = timedOutUser.userId;
                const user = await UserSchema.findOne({id}) as unknown as User;
                user.voteRight = true;

                await UserSchema.findOneAndUpdate({id}, user,{});
                this.usersWithVoteTimeout.splice(i, 1);
            }
        }
    }

    getQueueStatus(): QueueStatusEnum {
        let currentStatus = QueueStatusEnum.SMALL;
        let smallVotes = 0;
        let mediumVotes = 0;
        let largeVotes = 0;

        for(const vote of this.votes) {
            if (vote.state === QueueStatusEnum.LARGE) { largeVotes += 1; }
            else if (vote.state === QueueStatusEnum.MEDIUM) { mediumVotes += 1; }
            else if (vote.state === QueueStatusEnum.SMALL) { smallVotes += 1; }
        }

        if (largeVotes === 0 && mediumVotes === 0 && smallVotes === 0) { return QueueStatusEnum.SMALL; }

        if (largeVotes > mediumVotes && largeVotes > smallVotes) { currentStatus = QueueStatusEnum.LARGE; }
        else if (smallVotes > largeVotes && smallVotes > mediumVotes) { currentStatus = QueueStatusEnum.SMALL; }
        else if (mediumVotes >= largeVotes && mediumVotes >= smallVotes) {currentStatus = QueueStatusEnum.MEDIUM; }

        return  currentStatus;
    }

    /**
     * Registers the user vote on the array and updates user information.
     *
     * @param userVote The vote from the user.
     * @param user The user that voted.
     */
    async doVote(userVote: QueueVote, user: User): Promise<boolean> {
        try {
            this.votes.push(userVote);

            await this.updateUserInfo(user);
            await this.refreshQueueStatus();

            return true;
        } catch(error) {
            throw new Error(error.message);
        }
    }

    /**
     * Updates the user info denying its right to vote and adding it to the vote timeout array.
     * @param user The user to have the information updated.
     */
    async updateUserInfo(user: User): Promise<void> {
        const now = new Date().getTime() + this.THIRTY_MINUTES;
        const id = user.id;
        this.usersWithVoteTimeout.push({validity: now, userId: id})

        user.voteRight = false;
        await UserSchema.findOneAndUpdate({id}, user,{});
    }

    /**
     * Gets right to vote for the queue size by the given userId and password.
     * @param userId The ID of the user to search the right to vote.
     * @param password The password of the user to search the right to vote.
     * @returns A boolean, true if the user has the right to vote, false otherwise.
     */
    async canVote(userId, password): Promise<boolean> {
        try {
            const user = await this.getUserInfo(userId, password);
            return user.voteRight;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Gets the User by its id and returns it.
     * @param id The ID of the user to be searched.
     * @param password The password of the user to be searched.
     * @returns A user if found.
     */
    async getUserInfo(id, password): Promise<User> {
        try {
            const user = await UserSchema.findOne({id, password});
            return user as unknown as User;
        } catch (error) {
            throw new Error('User not found!')
        }
    }
}
