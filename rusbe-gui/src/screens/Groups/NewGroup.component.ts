import { Component } from '@angular/core';
import { GroupsService } from '../../service/Groups.service'
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-new-group',
    templateUrl: './NewGroup.component.html',
    styleUrls: ['./NewGroup.component.scss']
})
export class NewGroup {
    usersID: string[];
    groupName: string;
    userInfo: any;
    readyToCreate: Boolean;
    constructor(private GroupsService: GroupsService, private alertController: AlertController) { }

    ngOnInit(): void {
        var data = localStorage.getItem("user");
        this.usersID = []
        this.groupName = ''
        this.readyToCreate = false;
        this.userInfo = (data != null && data !== "") ? JSON.parse(data) : {};
    }
    async presentAlert(msg: string, header: string): Promise<void> {
        const alert = await this.alertController.create({
            header: header,
            message: msg,
            id:"alertgroup"
        });
        await alert.present();
    }
    changeGroupName(): void {
        this.groupName = (<HTMLInputElement>document.getElementById('name')).value;
        this.changeReady()
    }
    changeReady(): void {
        if (this.usersID.length > 0 && this.groupName != '')
            this.readyToCreate = true;
        else this.readyToCreate = false;
    }
    backToGroups(): void {
        window.location.href = "/screens/groups"
    }
    async addMember(): Promise<void> {
        const alert = await this.alertController.create({
            header: 'New member',
            inputs: [{
                name: 'userID',
                type: 'text',
                placeholder: 'Please enter the member login',
                id: 'userid'
            }],
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary'
            },
            {
                text: 'OK',
                cssClass: 'confirmuser',
                handler: (alertData) => {
                    this.usersID.push(alertData.userID)
                    this.changeReady()
                }
            }
            ]
        });
        await alert.present();
    }
    async removeUser(index:number){
        const alert = await this.alertController.create({
            header: 'Remove member',
            message: 'Do you want to remove '+ this.usersID[index] + ' from this group?',
            buttons:[{
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                },
                {
                    text: 'OK',
                    handler: ()=>{
                        this.usersID.splice(index,1)
                    }
                }
            ]
        });
        await alert.present();
    }
    createGroup(): void {
        const members = [...this.usersID, this.userInfo.id]
        this.GroupsService.createGroup(members, this.groupName).subscribe(
            data => {
                if (data["missingMembers"]) {
                    const list = data["missingMembers"].join(", ")
                    this.presentAlert('The following users were not found: '+list,'Users not found')
                }
                else {
                    this.presentAlert("Group created with success!", 'New Group')
                    setTimeout(this.backToGroups, 3000)
                }
            },
            err => {
                this.presentAlert(err, 'Error')
            }
        )
    }
}