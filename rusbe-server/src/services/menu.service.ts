import Router from 'express';
import {MenuApi} from './menuAPI.service';
import {MenuRepository} from '../repositories/menu.repository';
import User from '../../../common/user';
import Food from '../../../common/food';

const menuService = Router();
const api = new MenuApi();
const rep = new MenuRepository();

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
                let foodObject = await rep.findOneFood(foodName);
                if (foodObject==null || !foodObject){
                    await rep.createFood(foodName);
                }
                dailymenu[meal][kind].push(foodObject || {name: foodName, likes: 0, dislikes: 0});
            }
        }
    }

    res.send(dailymenu);
})

menuService.post('/menu/vote', async(req, res)=>{
    const {id, foodName, isLike} = req.body;
    let user : User = (await rep.findOneUser(id))?.toJSON() || null;
    let food : Food = (await rep.findOneFood(foodName))?.toJSON() || null;
    if (user==null || food==null){
        res.status(404).send({err: "User or Food not found"});
        return;
    }
    var localOptionsVoted : string[] = (user.optionsVoted || []).concat([foodName]);
    
    let userUpdateStatus = await rep.updateOneUseroptionsVoted(id, localOptionsVoted);
    let foodUpdateStatus = await rep.updateOneFoodlikes(foodName, food.likes, food.dislikes, isLike);

    if (userUpdateStatus && foodUpdateStatus){
        res.send({msg: "Success"});
    }else{
        res.send({err: "Failed to update"});
    }
})

export default menuService