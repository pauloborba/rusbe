import {MenuRepository} from "../src/repositories/menu.repository";

describe("The menu repository", () => {
    let repository: MenuRepository;
    let server: any;
    const timeout: number = 3000;
    beforeAll(()=>{
        repository = new MenuRepository();
        server = require('../src/index');
    });

    afterAll(() => {
        server.closeServer();
    });

    it("registers a food" ,async () => {
        const foodName = "Arroz";
        const response = await (await repository.createFood(foodName)).toJSON();
        expect(response.name).toBe(foodName);
        expect(response.likes).toBe(0);
        expect(response.dislikes).toBe(0);
    }, timeout);

    it("gets an existing food from the food's list" ,async ()=> {
        const foodName = "Arroz";
        const response = await (await repository.findOneFood(foodName)).toJSON();
        expect(response.name).toBe(foodName);
    }, timeout);

    it("computes a like on an existing food",async () => {
        const foodName = "Arroz";
        const bfFood = await (await repository.findOneFood(foodName)).toJSON();
        await repository.updateOneFoodlikes(bfFood.name, bfFood.likes, bfFood.dislikes, true);
        const afFood = await (await repository.findOneFood(foodName)).toJSON();
        expect(bfFood.name).toBe(afFood.name);
        expect(bfFood.likes).toBe(afFood.likes-1);
        expect(bfFood.dislikes).toBe(afFood.dislikes);
    }, timeout);

    it("computes a dislike on an existing food",async () => {
        const foodName = "Arroz";
        const bfFood = await (await repository.findOneFood(foodName)).toJSON();
        await repository.updateOneFoodlikes(bfFood.name, bfFood.likes, bfFood.dislikes, false);
        const afFood = await (await repository.findOneFood(foodName)).toJSON();
        expect(bfFood.name).toBe(afFood.name);
        expect(bfFood.likes).toBe(afFood.likes);
        expect(bfFood.dislikes).toBe(afFood.dislikes-1);
    }, timeout);

    it("computes a vote on an existing user",async () => {
        const userID:string = "alpvj", list:string[] = ["Arrozz"];
        await repository.updateOneUseroptionsVoted(userID, list);
        const afUser = await (await repository.findOneUser(userID)).toJSON();
        expect(afUser.optionsVoted).toEqual(list);
    }, timeout);

});