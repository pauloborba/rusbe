import Router from 'express'
import User from '../../../common/user'
import GroupRepository from '../repositories/groups.repository'
import Group from '../../../common/groups'
import UserSchema from '../models/user'

const groupsService = Router()
const repGroup = new GroupRepository()

groupsService.get('/groups',async(req,res)=>{
    res.send({msg:"Olá"})
})
groupsService.get('/usergroups', async(req, res)=>{
    const userID = req.query.id as string
    let userGroups = await repGroup.getUserGroups(userID);
    userGroups = userGroups.map(group => group.toJSON())
    res.send({"groups": userGroups})
})
groupsService.post('/creategroup', async (req, res)=>{
    const usersID: string[] = req.body.members;
    const groupName: string = req.body.name;
    let group:Group;
    group = new Group(groupName, usersID)
    let groupCreated = await repGroup.createGroup(group);
    res.send({"group": groupCreated})
})
export default groupsService