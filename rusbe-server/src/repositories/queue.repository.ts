import UserSchema from "../models/user";
import User from "../../../common/user";

export class QueueRepository{

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
