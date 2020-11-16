import { Component, OnInit } from '@angular/core';
import { SuggestionsService } from 'src/service/Suggestions.service';
import Suggestion from '../../../../common/suggestion';
import { v4 as generateId } from 'uuid';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-suggestions',
    templateUrl: './Suggestions.component.html',
    styleUrls: ['./Suggestions.component.scss']
})
export class Suggestions implements OnInit {
    userInfo: any;
    renderPage: boolean;
    suggestions: Suggestion[];

    constructor(
        public suggestionsService: SuggestionsService,
        public toastController: ToastController,
        public alertController: AlertController) {}

    ngOnInit() {
        const data = localStorage.getItem('user');
        this.userInfo = (data != null && data !== '') ? JSON.parse(data) : {};
        this.renderPage = this.userInfo.name !== undefined;

        this.loadUserData();
    }

    async loadUserData() {
        if ('id' in (this.userInfo as any)) {
            this.suggestionsService.getUserSuggestions(this.userInfo.id).subscribe(
                result => {
                    for (const suggestion of result.suggestions) {
                        suggestion.timestamp = new Date(suggestion.timestamp);
                    }
                    this.suggestions = result.suggestions;
                },
                async error => {
                    await this.presentSuggestionLoadErrorToast();
                });
        }
    }

    async presentNewSuggestionPrompt() {
        const alert = await this.alertController.create({
          cssClass: 'new-suggestion-prompt',
          header: 'Add new suggestion',
          inputs: [
            {
              name: 'suggestion',
              id: 'suggestion',
              type: 'textarea',
              placeholder: 'Enter your suggestion here.'
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {}
            }, {
              text: 'Send',
              handler: (data) => {
                const suggestion: Suggestion = {
                    id: generateId(),
                    content: data.suggestion,
                    author: this.userInfo.id,
                    timestamp: new Date()
                };
                this.suggestionsService.newSuggestion(suggestion).subscribe(result => {
                    this.presentSuggestionSentToast();
                    this.loadUserData();
                },
                error => {
                    this.presentSuggestionSentErrorToast();
                });
              }
            }
          ]
        });

        await alert.present();
    }

    async presentSuggestionLoadErrorToast() {
        const toast = await this.toastController.create({
          message: 'Unfortunately, we were unable to load your suggestions.',
          buttons: [
            {
              icon: 'refresh',
              text: 'Try again',
              handler: () => {
                document.location.reload();
              }
            }
          ]
        });
        toast.present();
    }
    async presentSuggestionSentErrorToast() {
        const toast = await this.toastController.create({
          message: 'Unfortunately, we were unable to send your suggestion.',
          buttons: [
            {
              text: 'Ok',
              handler: () => {}
            }
          ]
        });
        toast.present();
    }

    async presentSuggestionSentToast() {
        const toast = await this.toastController.create({
          message: 'Your suggestion was sent!',
          duration: 3000,
          buttons: [
            {
              text: 'Ok',
              handler: () => {}
            }
          ]
        });
        toast.present();
      }

}
