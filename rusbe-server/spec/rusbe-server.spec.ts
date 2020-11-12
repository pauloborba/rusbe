import request = require('request-promise');
import User from '../../common/user';
import QueueVote from '../../common/queueVote';
import {QueueStatusEnum} from "../../common/QueueStatus.enum";

const baseUrl = "http://localhost:3333/"

describe("The rusbe server", () => {
    let server: any;
    let user: User;
    const userId = "marconi";
    const userName = "mgrf";
    const password = "123";

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

    /**
     * Builds and returns a QueueVote instance with the given state and validity.
     */
    function buildVote(state: QueueStatusEnum, validity: number): QueueVote {
        const vote = new QueueVote();
        vote.state = state;
        vote.validity = validity;

        return vote;
    }

    beforeAll(() => {
        server = require('../src/index');
        user = setupUser();
    });

    afterAll(() => {
        server.closeServer();
    });

    it("initially has the queue status as small", () => {
        return request.get(baseUrl + "queue").then(body => {
            expect(body).toEqual("{\"status\":\"" +  QueueStatusEnum.SMALL + "\"}");
        }).catch(e => {
            expect(e).toEqual(null);
        });
    });

    it("gets the voteRight for a user correctly", () => {
        const options = {body: {id: userId, password: password}, json: true};
        return request.post(baseUrl + "queue/voteRight", options).then(body => {
            expect(body).toEqual(true);
        }).catch(e => {
            expect(e).toEqual(null);
        })
    })

    it("receives the vote of a user correctly", () => {
        const options = {body: {user: user, vote: buildVote(QueueStatusEnum.MEDIUM, new Date().getTime())}, json: true};
        return request.post(baseUrl + "queue/vote", options).then(body => {
            expect(body).toEqual(true);
        }).catch(e => {
            expect(e).toEqual(null);
        })
    })
});
