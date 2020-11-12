import {QueueRepository} from "../src/repositories/queue.repository";
import {QueueStatusEnum} from "../../common/QueueStatus.enum";
import QueueVote from "../../common/queueVote";
import User from "../../common/user";
import UserScheama from "../src/models/user";

describe("The queue repository", () => {
    let repository: QueueRepository;
    let user: User;
    const userName = "mgrf";
    const userId = "marconi"

    /**
     * Builds and returns a QueueVote instance with the given state and validity.
     */
    function buildVote(state: QueueStatusEnum, validity: number): QueueVote {
        const vote = new QueueVote();
        vote.state = state;
        vote.validity = validity;

        return vote;
    }

    /**
     * Sets up and returns an user using the class attributes.
     */
    function setupUser(): User {
        const rusbeUser = new User();
        rusbeUser.voteRight = true;
        rusbeUser.id = userId;
        rusbeUser.name = userName
        rusbeUser.optionsVoted = [];
        rusbeUser.likes = [];

        return rusbeUser;
    }

    beforeEach(() => {
        repository = new QueueRepository();
        user = setupUser();
    });

    afterAll(async () => {
        user.voteRight = true;
        const id = userId;
        await UserScheama.findOneAndUpdate({id}, user, {});
    });

    it("initializes correctly", () => {
        expect(repository.THIRTY_MINUTES).toEqual(1800000);
        expect(repository.FIVE_MINUTES).toEqual(300000);
        expect(repository.votes).toEqual([]);
        expect(repository.usersWithVoteTimeout).toEqual([]);
        expect(repository.state).toEqual(QueueStatusEnum.SMALL);
    });

    it("stores votes correctly", () => {
        const smallVote = buildVote(QueueStatusEnum.SMALL, new Date().getTime());
        const mediumVote = buildVote(QueueStatusEnum.MEDIUM, new Date().getTime());
        const largeVote = buildVote(QueueStatusEnum.LARGE, new Date().getTime());

        repository.doVote(smallVote, user);
        repository.doVote(mediumVote, user);
        repository.doVote(largeVote, user);

        expect(repository.votes.includes(smallVote)).toEqual(true);
        expect(repository.votes.includes(mediumVote)).toEqual(true);
        expect(repository.votes.includes(largeVote)).toEqual(true);
    });

    it("backs off an user when it votes", () => {
        repository.doVote(buildVote(QueueStatusEnum.SMALL, new Date().getTime()), user);

        expect(repository.usersWithVoteTimeout.length).toEqual(1);
        expect(repository.usersWithVoteTimeout.pop().userId).toEqual(userId);
    });

    it("defines the queue status correctly", () => {
        // With one vote that is not small
        repository.doVote(buildVote(QueueStatusEnum.MEDIUM, new Date().getTime()), user);
        expect(repository.getQueueStatus()).toEqual(QueueStatusEnum.MEDIUM);

        // With two votes different than the previous vote
        repository.doVote(buildVote(QueueStatusEnum.LARGE, new Date().getTime()), user);
        repository.doVote(buildVote(QueueStatusEnum.LARGE, new Date().getTime()), user);
        expect(repository.getQueueStatus()).toEqual(QueueStatusEnum.LARGE);

        // With more votes of a status than the existents
        repository.doVote(buildVote(QueueStatusEnum.SMALL, new Date().getTime()), user);
        repository.doVote(buildVote(QueueStatusEnum.SMALL, new Date().getTime()), user);
        repository.doVote(buildVote(QueueStatusEnum.SMALL, new Date().getTime()), user);
        expect(repository.getQueueStatus()).toEqual(QueueStatusEnum.SMALL);
    });
});
