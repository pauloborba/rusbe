import Group from '../../../common/groups'
import UserSchema from '../models/user'
import GroupSchema from '../models/group'

export default class GroupsRepository{
    async createGroup(group: Group){
        return await GroupSchema.create({
            id: group.id,
            name: group.name,
            messagesID: [],
            usersID: group.usersID,
            meal_times:[]
        })
    }
    async getUserGroups(id: string){
        return await GroupSchema.find({"usersID":id})
    }
}