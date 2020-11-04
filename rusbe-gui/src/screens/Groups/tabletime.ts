const timesString=[8,10,12,15,17,19]
const timesDate = timesString.map(time=>{
    let date = new Date()
    date.setHours(time)
    date.setMinutes(0);
    (time==10||time==15||time==19)?date.setSeconds(59):date.setSeconds(0)
    if(date< new Date())date.setDate(date.getDate()+1)
    return date
})
interface meals{
    "breakfast":{
        "from":Date,
        "to":Date
    },
    "lunch":{
        "from":Date,
        "to":Date
    },
    "dinner":{
        "from":Date,
        "to":Date
    }
}
const table : meals = {
    "breakfast":{
        "from":timesDate[0],
        "to":timesDate[1]
    },
    "lunch":{
        "from":timesDate[2],
        "to":timesDate[3]
    },
    "dinner":{
        "from":timesDate[4],
        "to":timesDate[5]
    }
}
export default table