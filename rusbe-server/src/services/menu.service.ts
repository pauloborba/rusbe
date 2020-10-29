import Router from 'express';
import {MenuApi} from './menuAPI.service';

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
                let foodObject = {name: foodName, likes: 0, dislikes: 0};
                dailymenu[meal][kind].push(foodObject);
            }
        }
    }


    res.send(dailymenu);
})

export default menuService