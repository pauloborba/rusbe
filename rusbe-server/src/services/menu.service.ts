import Router from 'express';
import {MenuApi} from './menuAPI.service';
import FoodSchema from '../models/food';

const menuService = Router();
const api = new MenuApi();

menuService.get('/menu/dailymenu',async(req,res)=>{
    var menuFromApi = api.getDailyMenu();
    var dailymenu = {
        breakfast: {protein: [], carbs: [], desert: [], drink: []},
        lunch: {protein: [], carbs: [], desert: [], drink: []},
        dinner: {protein: [], carbs: [], desert: [], drink: []}
    }

    for (let meal in menuFromApi){
        for (let kind in menuFromApi[meal]){
            for (let foodName of menuFromApi[meal][kind]){
                let foodObject = await FoodSchema.findOne({name:foodName});
                if (foodObject==null || !foodObject){
                    await FoodSchema.create({
                        name : foodName,
                        likes: 0,
                        dislikes: 0
                    })
                }
                dailymenu[meal][kind].push(foodObject || {name: foodName, likes: 0, dislikes: 0});
            }
        }
    }


    res.send(dailymenu);
})

export default menuService