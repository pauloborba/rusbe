export default class Group{
    id: string;
    name: string;
    messagesID: string[];
    usersId: string[];
    meals_times: {userId:String, meal: String, fromTime: Date, toTime:Date}[];
    constructor(name: string,users: string[]){
        this.id = this.generateId()
        this.name = name;
        this.messagesID =[];
        this.usersId = users;
        this.meals_times = []
    }
    generateId(): string{
        let chs = []
        let id =''
        for(let i=97;i<123;i++){
            chs.push(String.fromCharCode(i))
        }
        for(let i=0;i<10;i++){
            id = id.concat(chs[Math.floor(Math.random() * 26)])
        }
        return id
    }
}