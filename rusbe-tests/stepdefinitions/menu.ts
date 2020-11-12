import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;


defineSupportCode(function ({ Given, When, Then }) {

    Given(/^I am at the "([^\"]*)" page$/, async (pageName : string) => {
        //TODO: Botar isso no before all
        const url = "http://localhost:4200/screens/"+pageName.toLowerCase();
        await browser.get(url);
        await browser.sleep(1500);//Precisa fazer requisição das comidas pelo MongoDB
        //ate aqui
        await expect(browser.getCurrentUrl()).to.eventually.equal(url);
    });

    Given(/^I am logged in to "([^\"]*)" user account$/, async (login : string) => {
        //TODO: Botar isso no before all
        const urlLogin = "http://localhost:4200/screens/login";
        await browser.get(urlLogin);
        await expect (browser.getCurrentUrl()).to.eventually.equal(urlLogin);
        await element(by.name('uname')).sendKeys(<string> login);
        await element(by.name('form')).submit();
        await browser.sleep(1500);//Precisa fazer autenticação pelo MongoDB
        //ate aqui
        var data = <string> await browser.executeScript('return window.localStorage.getItem("user");');
        data = (data!=null&&data!=="") ? JSON.parse(data).id : "";
        await expect(data).equal(login);
    });

    Given(/^I can see "([^\"]*)" as the current meal for the menu$/, async (meal) => {
        const currentmeal = await element(by.name('currentmeal')).getText();
        await expect(currentmeal).equal(meal);
    });

    Then(/^I can see "([^\"]*)", "([^\"]*)", "([^\"]*)", "([^\"]*)" listed$/, async (food0:string,food1:string,food2:string,food3:string) => {
        const foodOptions = await element.all(by.name('foodname')).getText();
        const booleanArray = [
            foodOptions.indexOf(food0)!=-1,
            foodOptions.indexOf(food1)!=-1,
            foodOptions.indexOf(food2)!=-1,
            foodOptions.indexOf(food3)!=-1
        ];
        var allTrue : boolean = true;
        for (let d of booleanArray) allTrue = allTrue&&d;
        await expect(allTrue).equal(true);
    });

    When(/^I submit to go to the previous the page$/, async () => {
        await element(by.name('prevoptionbtn')).click();
    });
    
    Given(/^I can see "([^\"]*)" at the menu$/, async (food:string) => {
        const foodOptions = await element.all(by.name('foodname')).getText();
        const foundFood = foodOptions.indexOf(food)!=-1;
        await expect(foundFood).equal(true);
    });

    Given(/^I have not voted for "([^\"]*)"$/, async (food:string) => {
        var votedFood = <string> await browser.executeScript('return window.localStorage.getItem("user");');
        votedFood = (votedFood!=null&&votedFood!=="") ? JSON.parse(votedFood).optionsVoted : [];
        const foundFood = votedFood.indexOf(food)!=-1;
        await expect(foundFood).equal(false);
    });

    When(/^I evaluate "([^\"]*)" as a "([^\"]*)"$/, async (food:string,option:string) => {
        await element(by.id(option+food)).click();
        await browser.sleep(1500);//Precisa computar o voto no MongoDB
    });

    Then(/^"([^\"]*)" is at the list of evaluated foods$/, async (food:string) => {
        var votedFood = <string> await browser.executeScript('return window.localStorage.getItem("user");');
        votedFood = (votedFood!=null&&votedFood!=="") ? JSON.parse(votedFood).optionsVoted : [];
        console.log(votedFood);
        const foundFood = votedFood.indexOf(food)!=-1;
        await expect(foundFood).equal(true);
    });

    Then(/^I can see the evaluation for "([^\"]*)"$/, async (food:string) => {
        await expect(element(by.id('evaluation'+food)).isPresent()).to.eventually.equal(true);
    });
})