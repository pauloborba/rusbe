import { Component } from '@angular/core';
import { GroupsService } from '../../service/Groups.service'
import { AlertController } from '@ionic/angular';
import Group from '../../../../common/groups'
@Component({
    selector: 'app-groups',
    templateUrl: './GroupList.component.html',
    styleUrls: ['./GroupList.component.scss']
})
export class Groups {
    userInfo: any;
    renderPage: Boolean;
    groups: Group[];
    times: string[]
    constructor(private GroupsService: GroupsService, private alertController: AlertController) { }
    ngOnInit(): void {
        var data = localStorage.getItem("user");
        this.userInfo = (data != null && data !== "") ? JSON.parse(data) : {};
        this.renderPage = this.userInfo.name !== undefined;
        this.GroupsService.getUserGroups(this.userInfo.id).subscribe(
            data => {
                this.groups = data["groups"];
                this.times = data["times"]
            },
            async err => {
                console.log('disgraçaaaa')
                await this.presentAlert(err.error.message);
            }
        )
    }
    async presentAlert(msg: string) {
        const alert = await this.alertController.create({
            //cssClass: 'my-custom-class',
            header: 'Erro',
            message: msg,
        });

        await alert.present();
    }
    newGroup(){
        window.location.href="/screens/groups/newgroup"
    }
}