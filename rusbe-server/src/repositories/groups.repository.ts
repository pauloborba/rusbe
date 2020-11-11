import Group from '../../../common/groups'
import Message from '../../../common/message'
import GroupSchema from '../models/group'
import MsgSchema from '../models/msg'

export interface Meal { userId: string, meal: string, fromTime: Date, toTime: Date }

export default class GroupsRepository {
    public async createGroup(group: Group): Promise<any> {
        return await GroupSchema.create({
            id: group.id,
            name: group.name,
            messagesID: [],
            usersId: group.usersId,
            meal_times: []
        })
    }
    private createTime(userId, meal, fromTime, toTime) {
        return { userId: userId, meal: meal, fromTime: fromTime, toTime: toTime }
    }
    public async getUserGroups(id: string): Promise<any> {
        const groups = await GroupSchema.find({ "usersId": id })
        return groups.map((gp) => gp.toJSON())
    }
    public async getUserGroupsNextMealTimes(id: string): Promise<string[]> {
        const groups = await this.getUserGroups(id)
        let times = []
        for (let group of groups) {
            let newTime = await this.getBestTimeNextMeal(group.id)
            times.push(newTime)
        }
        return times;
    }
    public async getInfoGroup(id: string): Promise<any> {
        const group = await GroupSchema.findOne({ id })
        return group.toJSON()
    }
    public async getGroupMessages(id: string): Promise<Message[]> {
        const group = await GroupSchema.findOne({ id })
        const msgs = []
        for (let msg of group.toJSON().messagesID) {
            let newMsg = await MsgSchema.findOne({ id: msg })
            msgs.push(newMsg)
        }
        return msgs
    }
    public async getUserNextMealTimes(groupId: string, userId: string): Promise<any> {
        const info = await this.getInfoGroup(groupId)
        let userMealsTimes: Meal[] = info.meals_times
        userMealsTimes = userMealsTimes.filter(userSlot =>
            userSlot.userId == userId && new Date(userSlot.fromTime) > new Date())
        return userMealsTimes
    }
    public async postUserTime(groupId: string, meal_time: Meal): Promise<any> {
        const group = await GroupSchema.findOne({ id: groupId })
        let meals: Meal[] = group.toJSON().meals_times
        meals.push(meal_time)
        return await GroupSchema.updateOne({ id: groupId }, { $set: { meals_times: meals } })
    }
    private async getNextMealTimes(groupId: string): Promise<any> {
        const info = await this.getInfoGroup(groupId)
        let mealsTimes: Meal[] = info.meals_times
        mealsTimes = mealsTimes.filter(userSlot => new Date(userSlot.fromTime) > new Date())
        return mealsTimes
    }

    private voteTime(meal: 'breakfast' | 'lunch' | 'dinner', slots: number[], nextTimes: Meal[]): void {
        nextTimes = nextTimes.filter(userSlot=> userSlot.meal==meal)
        nextTimes.map(userSlot => {
            const hour = userSlot.fromTime.getHours()
            slots[hour]++
        })
    }
    private getNextMeal(nextTimes: Meal[]) {
        let minTime = nextTimes.reduce((p, c) => {
            return new Date(p.fromTime)< new Date(c.fromTime) ? p: c 
        })
        return minTime.meal
    }
    private getTimeFormat(hour: number, minutes: string) {
        return ('0' + hour).slice(-2) + ':' + minutes
    }
    private async getBestTimeNextMeal(groupId: string): Promise<string> {
        const nexTimes: Meal[] = await this.getNextMealTimes(groupId)
        if (!nexTimes.length) return undefined//no meal scheduled
        const slots = Array(23).fill(0)
        const nextMeal = this.getNextMeal(nexTimes) as 'breakfast'|'lunch'|'dinner'
        this.voteTime(nextMeal, slots, nexTimes)
        const slotMostVoted = slots.reduce((p, c) => Math.max(p, c))
        const slotMostVotedIndex = slots.findIndex(val => val == slotMostVoted)
        let j = slotMostVotedIndex;
        let [intervalSize, bestIntervalSize, start, end] = [0, 0, 0, 0]
        while (j < 23) {
            let i = j
            if (slots[j] == slotMostVoted) {
                while (j < 23 && slots[j] == slotMostVoted) j++;
                intervalSize = j - i + 1
                if (intervalSize > bestIntervalSize) {
                    bestIntervalSize = intervalSize
                    start = i
                    end = j
                }
            }
            j++;
        }
        let timeStart = this.getTimeFormat(start, '00')
        let timeEnd = this.getTimeFormat(end, '00')
        return timeStart + '-' + timeEnd
    }
    async deleteMyTime(groupId: string, meal: string, userId: string){
        const group = await GroupSchema.findOne({ id: groupId })
        let meals: Meal[] = group.toJSON().meals_times
        meals = meals.filter(slot=> 
            !(slot.userId==userId && slot.meal==meal && new Date(slot.fromTime)> new Date())
        )
        return await GroupSchema.updateOne({ id: groupId }, { $set: { meals_times: meals } })
    }
    async postNewMsg(groupId: string, msg: Message): Promise<any> {
        let group = await GroupSchema.findOne({ id: groupId })
        let msgs = group.toJSON().messagesID
        msgs.push(msg.id)
        group = await GroupSchema.updateOne({ id: groupId }, { $set: { messagesID: msgs } })
        let msgDoc = await MsgSchema.create({
            id: msg.id,
            content: msg.content,
            author: msg.author,
            timestamp: msg.timestamp,
            type: msg.type
        })
        return msgDoc
    }
}