import {Component, OnInit} from '@angular/core';
import { MenuService } from '../../../service/Menu.service';
import User from '../../../../../common/user';

@Component({
    selector: 'app-menu',
    templateUrl: './Menu.component.html',
    styleUrls: ['./Menu.component.scss']
})
export class Menu implements OnInit {

    dailyMenu: any;
    dailyMenuOption: number;
    user: User;

    constructor(private menu: MenuService){}

    ngOnInit(): void {
        let data = localStorage.getItem("user");
        this.user = (data!=null&&data!=="") ? JSON.parse(data) : {};
        let h = (new Date()).getHours();
        this.dailyMenuOption = (h>=10 ? 1 : 0) + (h>=15 ? 1 : 0);
        this.menu.getDailyMenu().subscribe(
            data => {
                this.dailyMenu = data;
            },
            err => {
                console.log(err.error);
                this.dailyMenu = null;
            }
        );
    }

    canVoteOption(foodName:string): boolean{
        for (let name of (this.user.optionsVoted || [])){
            if (name==foodName) return false;
        }
        return true;
    }

    computeVote(foodName:string, isLike:boolean){
        this.menu.doVote(this.user.id, foodName, isLike).subscribe(
            data => {
                if (data.msg=="Success"){
                    this.user.optionsVoted.push(foodName);
                    localStorage.setItem("user", JSON.stringify(this.user));
                    for (let meal in this.dailyMenu){
                        for (let kind in this.dailyMenu[meal]){
                            for (let [index, food] of this.dailyMenu[meal][kind].entries()){
                                if (food.name!=foodName) continue;
                                this.dailyMenu[meal][kind][index].likes += isLike?1:0;
                                this.dailyMenu[meal][kind][index].dislikes += isLike?0:1;
                            }
                        }
                    }
                }else{
                    console.log(data.msg);
                }
            },
            err => {
                console.log(err.error);
            }
        );
    }

    nextOption(k:number): void{
        let v = this.dailyMenuOption+k;
        this.dailyMenuOption = (v<0) ? 2 : v%3;
    }
}
