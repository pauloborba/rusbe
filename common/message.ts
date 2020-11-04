export default class Message{
    id: string;
    content: string;
    author: string;
    timestamp: Date;
    type: string;
    constructor(content: string, author: string, type: string){
        this.id = this.generateId()
        this.content = content;
        this.author= author;
        this.timestamp= new Date();
        this.type = type;
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