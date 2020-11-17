import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by, ElementFinder } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;
/*
Scenario: Create a group with existing users
Given I am logged in to "hss2" user account
Given I am at the "Groups" page
When I select the option to create a new group
When select the name "Amigos da UFPE" as the name of the group
When select "totonio", "gil97", "Rob" as the members of the groups
When select the option to finish creating the groups
Then I can see a "Group created with success!" alert
Then I can se "Amigos da UFPE" listed in the groups */

defineSupportCode(function ({ Given, When, Then }) {

    Given(/^I am logged in to "([^\"]*)" user account$/, async (login: string) => {
        const urlLogin = "http://localhost:4200/screens/login";
        await browser.get(urlLogin);
        await expect(browser.getCurrentUrl()).to.eventually.equal(urlLogin);
        await element(by.name('uname')).sendKeys(<string>login);
        await element(by.name('form')).submit();
        await browser.sleep(1500);//Precisa fazer autenticação pelo MongoDB
        var data = <string>await browser.executeScript('return window.localStorage.getItem("user");');
        data = (data != null && data !== "") ? JSON.parse(data).id : "";
        await expect(data).equal(login);
    });

    Given(/^I am at the "([^\"]*)" page$/, async (pageName: string) => {
        const url = "http://localhost:4200/screens/" + pageName.toLowerCase();
        await browser.get(url);
        await browser.sleep(1500);//Precisa fazer requisição das comidas pelo MongoDB
        await expect(browser.getCurrentUrl()).to.eventually.equal(url);
    });

    When(/^I select the option to create a new group$/, async () => {
        await element(by.name('newgroup')).click()
        await browser.sleep(1500)
        await expect(browser.getCurrentUrl()).to.eventually.equal("http://localhost:4200/screens/groups/newgroup");
    });
    When(/^I select the name "([^\"]*)" as the name of the group$/, async (groupName: string) => {
       const ionInput : ElementArrayFinder  = element.all(by.name('groupname'))
       ionInput.get(1).sendKeys(groupName)
    });
    When(/^I select "([^\"]*)", "([^\"]*)", "([^\"]*)" as the members of the group$/,async(fsUser: string, snUser:string, thUser:string)=>{
        await element(by.name('addmember')).click()
        await element(by.id('userid')).sendKeys(fsUser);
        await element.all(by.className('alert-button-inner')).get(1).click();
        await browser.sleep(1000)
        await element(by.name('addmember')).click()
        await element(by.id('userid')).sendKeys(snUser);
        await element.all(by.className('alert-button-inner')).get(1).click();
        await browser.sleep(1000)
        await element(by.name('addmember')).click()
        await element(by.id('userid')).sendKeys(thUser);
        await element.all(by.className('alert-button-inner')).get(1).click();
        await browser.sleep(1000)
    });
    When(/^I select the option to finish creating the group$/,async()=>{
        await element(by.name('creategroup')).click()
        await browser.sleep(2000)
    });
    Then(/^I can see an alert containing "([^\"]*)"$/,async(msg:string)=>{
        await browser.sleep(1000)
        const alert: ElementFinder = await element(by.id('alertgroup'))
        const text = await alert.getText()
        expect(text).to.include(msg)
        await browser.sleep(2000)
    });
    Then(/^I can see "([^\"]*)" listed in the groups$/,async(groupName:string)=>{
        await browser.sleep(2000)
        const groups = await element.all(by.name('groupname')).getText();
        expect(groups).to.include(groupName)
    });
    Then(/^I cannot see "([^\"]*)" listed in the groups$/,async(groupName:string)=>{
        const groups = await element.all(by.name('groupname')).getText();
        expect(groups).to.not.include(groupName)
    });
    When(/^I select the "([^\"]*)" group$/,async(groupName: string)=>{
        await browser.sleep(2000)
        const groups = Array.from(await element.all(by.name('groupname')).getText());
        console.log(groups)
        const index= groups.findIndex(group=>group.startsWith(groupName))
        await element.all(by.name('groupname')).get(index).click()
        await browser.sleep(2000)
    });
    When(/^I select the option to add available time$/, async()=>{
        await browser.sleep(2000)
        await element(by.name('showpopover')).click();
        await element(by.name('addtime')).click()
        await browser.sleep(2000)
    });
    When(/^I select the "([^\"]*)" meal$/,async(meal:string)=>{
        await browser.sleep(2000)
        await element(by.id(meal)).click();
        await browser.sleep(2000)
        await element.all(by.className('alert-button-inner')).get(4).click();
    })
    When(/^I select from "([^\"]*)" to "([^\"]*)"$/,async(fromTime:string, toTime:string)=>{
        await browser.sleep(4000)
        await element(by.id('fromtime')).sendKeys(fromTime);
        await element(by.id('totime')).sendKeys(toTime);
        await element.all(by.className('alert-button-inner')).get(1).click();
    })
    When(/^I select the option to remove available time$/,async()=>{
        await element(by.name('showpopover')).click();
        await browser.sleep(2000)
        await element(by.name('rmvtime')).click()
        await browser.sleep(2000)
    })
    When(/^I remove the "([^\"]*)" meal$/, async(meal:string)=>{
        await browser.sleep(2000)
        await element(by.id(meal.toLowerCase())).click();
        const len = (await element.all(by.className('alert-button-inner'))).length
        await await element.all(by.className('alert-button-inner')).get(len-1).click()
    })
})