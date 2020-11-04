import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupsService } from '../../service/Groups.service'
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import tabletime from './tabletime'
import Message from '../../../../common/message'

interface Meal{userID:String, meal: String, fromTime: Date, toTime:Date}

@Component({
    template: `
    <ion-list>
        <ion-item (click)="handleClick('add')">
            Add available time
        </ion-item>
    </ion-list>`
})
class PopoverPage {
    constructor(private pop: PopoverController) { }
    handleClick(option: string): void {this.pop.dismiss({ "option": option })}
}
@Component({
    selector: 'app-groups-msgs',
    templateUrl: './Group.component.html',
    styleUrls: ['./Group.component.scss']
})
export class GroupMsgs {
    userInfo: any;
    msgs: Message[];
    renderPage: Boolean;
    groupId: string;
    groupName: string;
    myMealsTimes: Meal[];

    constructor(private GroupsService: GroupsService, private alertController: AlertController,
        private popoverController: PopoverController, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.updateLocalUser()
        this.renderPage = this.userInfo.name !== undefined;
        this.updateGroupId()
        this.GroupsService.getInfoGroup(this.groupId).subscribe(
            data => {
                this.msgs = data["msgs"];
                this.groupName = data["name"]
                this.myMealsTimes = data["my_times"]
            },
            async err => {
                await this.presentAlert("Error",err.error.message);})
    }
    updateLocalUser(): any {
        const data = localStorage.getItem("user");
        this.userInfo =  (data != null && data !== "") ? JSON.parse(data) : {};
    }
    updateGroupId(): void{
        this.route.paramMap.subscribe(param=>this.groupId=param.get('groupId'))
    }
    async presentAlert(header: string, msg: string, inputs?: any, buttons?: any) {
        const alert = await this.alertController.create({header: header,message: msg,inputs: inputs,buttons: buttons});
        await alert.present();
    }
    async showPopover(): Promise<void> {
        const popover = await this.popoverController.create({component: PopoverPage,componentProps:
            { popoverController: this.popoverController },translucent: true});
        await popover.present();
        return popover.onDidDismiss().then(data => {if (data["data"]["option"] == "add") this.addTimeModal();})
    }
    createAlertInput(name: string, type: string, label: string, value: string, checked?: boolean):any{
        return {
            name,
            type,
            label,
            value,
            checked
        }
    }
    createAddTimeButtons():any{
        return [
            { text: 'Cancel' }, 
            { text: 'OK', handler: async (meal: "breakfast" | "lunch" | "dinner") => {
                if(this.arealdySetTime(meal))
                    await this.presentAlert("Error", "You already set time for this meal")
                else 
                    this.chooseTimeModal(meal) 
            }}
        ]
    }
    async addTimeModal(): Promise<void> {
        const [header, msg] = ['Add my time', 'choose the meal']
        const inputs = [
            this.createAlertInput('bkft', 'radio','Breakfast','breakfast',true),
            this.createAlertInput('lch', 'radio','Lunch','lunch', false),
            this.createAlertInput('dnn', 'radio','Dinner','dinner',false),
        ]
        const buttons = this.createAddTimeButtons()
        await this.presentAlert(header, msg, inputs, buttons)
    }

    arealdySetTime(meal:"breakfast" | "lunch" | "dinner"):boolean{
        return this.myMealsTimes.filter(slot=>slot.meal==meal).length>0
    }
    createFullDate(hours, minutes, secs): Date{
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes)
        date.setSeconds(secs)
        if(date<new Date())
            date.setDate(date.getDate()+1)
        return date
    }
    createChooseTimeButtons(meal):any{
        return [
            { text: 'Cancel' }, 
            { text: 'OK', handler: (data) => {
                const [fromAr, toAr] = [data["from"].split(':'),data["to"].split(':')]
                const from = this.createFullDate(fromAr[0], fromAr[1], 59)
                const to = this.createFullDate(toAr[0],toAr[1],0)

                if (from < tabletime[meal].from || to > tabletime[meal].to) {
                    this.presentAlert("Error", meal+ " occurs from " + tabletime[meal].from.getHours()
                        .toLocaleString() + " to " + tabletime[meal].to.getHours().toLocaleString())
                }
                else if (from > to)
                    this.presentAlert("Error", "You cannot time travel")
                else {
                    const msg = new Message(this.userInfo.id + " is avaialble for " + meal + " from " +
                        data["from"] + " to " + data["to"]+ " on the " + (from.getMonth()+1)+'/'+from.getDate(), this.userInfo.id, "meal-time")
                    this.msgs.push(msg)
                    this.myMealsTimes.push({userID:this.userInfo.id,meal,fromTime:from,toTime:to})
                    this.GroupsService.postMyTime(this.groupId,{userId:this.userInfo.id,meal,fromTime:from,toTime:to}, msg).subscribe(
                        data=>this.presentAlert("Success","You just posted your time for "+meal),
                        err=>this.presentAlert("Error", err.error))
                }
            }
        }]
    }
    async chooseTimeModal(meal: "breakfast" | "lunch" | "dinner") {
        const inputs = [
            this.createAlertInput('from', 'time','', '00:00'),
            this.createAlertInput('to','time','','00:00')
        ]
        const buttons = this.createChooseTimeButtons(meal)
        this.presentAlert('Add my time','choose you available time for '+meal+'. From HH:MM to HH:MM', inputs, buttons)
    }
    backToGroups(): void {
        window.location.href = "/screens/groups"
    }
}