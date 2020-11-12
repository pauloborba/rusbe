import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

let currentUser = async () => {
    var data = <string> await browser.executeScript('return window.localStorage.getItem("user");');
    return (data!=null&&data!=="") ? JSON.parse(data) : {id:"", optionsVoted:[]};
};

let currentUserId = async () => {
    return (await currentUser()).id||"";
};

let currentUserOptionsVoted = async () => {
    return (await currentUser()).optionsVoted||[];
};

let checkElementInArray = <bool> (key:string, arr:string|[string]) => {
    return arr.indexOf(key)!=-1;;
};

let goToPage = async (url) => {
    await browser.get(url);
};

defineSupportCode(function ({ Given, When, Then }) {

    Given(/^I am at the "([^\"]*)" page$/, async (pageName : string) => {
        const url = "http://localhost:4200/screens/"+pageName.toLowerCase();
        await goToPage(url);
        await browser.sleep(1500);//Espera pelo get do MongoDB
        await expect(browser.getCurrentUrl()).to.eventually.equal(url);
    });

    Given(/^I am logged in to "([^\"]*)" user account$/, async (login : string) => {
        const url = "http://localhost:4200/screens/login";
        await goToPage(url);
        await expect (browser.getCurrentUrl()).to.eventually.equal(url);
        await element(by.name('uname')).sendKeys(<string> login);
        await element(by.name('form')).submit();
        await browser.sleep(2000);//Precisa fazer autenticação pelo MongoDB
        var userId : string = await currentUserId();
        await expect(userId).equal(login);
    });

    Given(/^I can see "([^\"]*)" as the current meal for the menu$/, async (meal) => {
        const currentmeal = await element(by.name('currentmeal')).getText();
        await expect(currentmeal).equal(meal);
    });

    Then(/^I can see "([^\"]*)", "([^\"]*)", "([^\"]*)", "([^\"]*)" listed$/, async (food0:string,food1:string,food2:string,food3:string) => {
        const foodOptions = await element.all(by.name('foodname')).getText();
        var allTrue : boolean = 
            checkElementInArray(food0, foodOptions) &&
            checkElementInArray(food1, foodOptions) &&
            checkElementInArray(food2, foodOptions) &&
            checkElementInArray(food3, foodOptions);
        await expect(allTrue).equal(true);
    });

    When(/^I submit to go to the previous the page$/, async () => {
        await element(by.name('prevoptionbtn')).click();
    });
    
    Given(/^I can see "([^\"]*)" at the menu$/, async (food:string) => {
        const foodOptions = await element.all(by.name('foodname')).getText();
        const foundFood = checkElementInArray(food, foodOptions);
        await expect(foundFood).equal(true);
    });

    Given(/^I have not voted for "([^\"]*)"$/, async (food:string) => {
        const votedFood = await currentUserOptionsVoted();
        const foundFood = checkElementInArray(food, votedFood);
        await expect(foundFood).equal(false);
    });

    When(/^I evaluate "([^\"]*)" as a "([^\"]*)"$/, async (food:string,option:string) => {
        await element(by.id(option+food)).click();
        await browser.sleep(1500);//Precisa computar o voto no MongoDB
    });

    Then(/^"([^\"]*)" is at the list of evaluated foods$/, async (food:string) => {
        const votedFood = await currentUserOptionsVoted();
        const foundFood = checkElementInArray(food, votedFood);
        await expect(foundFood).equal(true);
    });

    Then(/^I can see the evaluation for "([^\"]*)"$/, async (food:string) => {
        await expect(element(by.id('evaluation'+food)).isPresent()).to.eventually.equal(true);
    });
})