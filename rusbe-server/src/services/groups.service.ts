import Router from 'express'
import GroupRepository, {Meal}from '../repositories/groups.repository'
import Group from '../../../common/groups'
import Message from '../../../common/message'
import UserSchema from '../models/user'

const groupsService = Router()
const repGroup = new GroupRepository()

groupsService.get('/groups/usergroups', async (req, res) => {
    const userID = req.query.id as string
    const userGroups: Group[] = await repGroup.getUserGroups(userID);
    let times= await repGroup.getUserGroupsNextMealTimes(userID)
    res.send({ "groups": userGroups, "times": times })
})
groupsService.post('/groups/creategroup', async (req, res) => {
    const usersID: string[] = req.body.members;
    const groupName: string = req.body.name;
    let group: Group;
    let missingMembers = []
    for (let id of usersID) {
        let member = await UserSchema.findOne({ id });
        if (member == null) missingMembers.push(id)
    }
    if (missingMembers.length) {
        res.send({"missingMembers": missingMembers})
    }
    else {
        group = new Group(groupName, usersID)
        let groupCreated = await repGroup.createGroup(group);
        res.send({ "group": groupCreated })
    }
})
groupsService.get('/groups/groupinfo',async(req,res)=>{
    const groupId: string = req.query.id as string
    const userId: string = req.query.userId as string
    const msgs = await repGroup.getGroupMessages(groupId);
    const info: Group = await repGroup.getInfoGroup(groupId)
    const userMealsTimes = await repGroup.getUserNextMealTimes(groupId, userId)
    res.send({"name":info.name,"msgs":msgs,"my_times":userMealsTimes})
})
groupsService.post('/groups/postmytime',async(req,res)=>{
    const groupId: string = req.body.groupId as string
    const meal_time:Meal =req.body.meal_time;
    const msg: Message = req.body.msg
    const data = await repGroup.postUserTime(groupId, meal_time)
    await repGroup.postNewMsg(groupId, msg);
    res.send({data:data})
})
groupsService.put('/groups/deletemytime',async(req,res)=>{
    const groupId: string = req.body.groupId as string
    const userId: string = req.body.userId as string
    const meal:string =req.body.meal as string;
    const msg: Message = req.body.msg
    const data = await repGroup.deleteMyTime(groupId, meal, userId)
    await repGroup.postNewMsg(groupId, msg);
    res.send({data:data})
})
export default groupsService