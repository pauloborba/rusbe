import GroupRepository from "../src/repositories/groups.repository";
import Group from '../../common/groups'
import Message from '../../common/message'

export function generateLogin() {
    const names = ["Heitor", "André", "Lucas", "Maria", "Clara", "Stéfane", "João"];
    let chs = []
    let id = ''
    for (let i = 97; i < 123; i++) {
        chs.push(String.fromCharCode(i))
    }
    for (let i = 0; i < 5; i++) {
        id = id.concat(chs[Math.floor(Math.random() * 26)])
    }
    return names[Math.floor(Math.random() * 7)].concat(id)
}

describe("The group repository", () => {
    let repository: GroupRepository;
    let server: any;
    const timeout: number = 5000;
    let userId: string = generateLogin()
    beforeAll(() => {
        server = require("../src/index")
        repository = new GroupRepository();
    });
    it("registers a group", async () => {
        const [name, users] = ["Grupo do CIn", ["totonio", "gil97", "hss2"]]
        const group = new Group(name, users)
        const response = await (await repository.createGroup(group)).toJSON();
        expect(response.name).toBe(name);
        expect(response.usersId).toEqual(users)
        expect(response.messagesID).toEqual([]);
        expect(response.meal_times).toEqual(undefined);
    }, timeout);

    it("gets an user's group list", async () => {
        let [name, users] = ["Janta com Amigos", [userId, "Rob", "Luke"]]
        let [name2, users2] = ["RU time", [userId, "hss2", "absn2"]]
        let group = new Group(name, users)
        let group2 = new Group(name2, users2)
        await repository.createGroup(group);
        await repository.createGroup(group2);
        let groupNames = await repository.getUserGroups(userId)
        groupNames = groupNames.map(group => group.name);
        expect(groupNames).toEqual(["Janta com Amigos", "RU time"]);
    }, timeout);

    it("posts user's available time for meal", async () => {
        const meal = { userId: userId, meal: "lunch", fromTime: new Date(), toTime: new Date() }
        let mygroups = await repository.getUserGroups(userId)
        const groupId = mygroups[0].id
        const response = await repository.postUserTime(groupId, meal)
        expect(response).toEqual("Success to post time")
    }, timeout);

    it("posts user's message", async () => {
        const msg = new Message(userId + " is avaialble for lunch from 12:00 to 13:00 on the 11/10", userId, "meal-time")
        let mygroups = await repository.getUserGroups(userId)
        const groupId = mygroups[0].id
        const response = await repository.postNewMsg(groupId, msg)
        expect(response).toEqual("Success to post message")
    }, timeout);

    it("gets group info", async () => {
        let [name, users] = ["Grupo do café", [userId, "hss2", "absn2"]]
        let group = new Group(name, users)
        let groupCreated = await repository.createGroup(group)
        groupCreated = groupCreated.toJSON();
        let groupInfo = await repository.getInfoGroup(groupCreated.id)
        expect(groupCreated.name).toEqual(groupInfo.name)
        expect(groupCreated.usersId).toEqual(groupInfo.usersId)
    }, timeout);
});