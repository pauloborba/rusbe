import FoodSchema from '../models/food';
import UserSchema from '../models/user';

export class MenuRepository{ 
    async findOneUser(id:string){
        return (
            await UserSchema.findOne({id: id})
        );
    }

    async findOneFood(foodName:string){
        return (
            await FoodSchema.findOne({name: foodName})
        );
    }

    async createFood(foodName : string){
        return (
            await FoodSchema.create({
                name : foodName,
                likes: 0,
                dislikes: 0
            })
        );
    }

    async updateOneUseroptionsVoted(id:string, optionsVoted:string[]){
        return (
            await UserSchema.updateOne({id: id}, {optionsVoted: optionsVoted})
        );
    }

    async updateOneFoodlikes(foodName:string, foodLikes:number, foodDislikes:number, isLike:boolean){
        return (
            await FoodSchema.updateOne({name:foodName}, {likes: foodLikes+(isLike ? 1:0), dislikes: foodDislikes+(isLike ? 0:1)})
        );
    }
}