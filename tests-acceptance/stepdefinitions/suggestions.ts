import { defineSupportCode } from "cucumber";
import { browser, $, element, by, ExpectedConditions, ElementFinder } from "protractor";
import { ProtractorLocator } from "protractor/built/locators";
let chai = require('chai').use(require('chai-as-promised'))
let expect = chai.expect;
let suggestionCount = 0;

const baseUrl = 'http://localhost:8100';

let options = {
    'New Suggestion': {
        id: 'new-suggestion-button'
    }
}

async function waitForElement(element: ElementFinder) {
    await browser.wait(ExpectedConditions.presenceOf(element), 10000);
    return await element;
}

async function assertToastMessage(message: string) {
    const toastMessageElement = await element(by.css('.toast-message'));
    await expect(await toastMessageElement.getText()).to.be.equal(message);
}

async function preincludeSuggestion(suggestion: string) {
    await browser.get(`${baseUrl}/screens/suggestions`);
    await browser.wait(ExpectedConditions.urlContains(`screens/suggestions`), 10000)
    await expect(browser.getTitle()).to.eventually.equal('Ionic App');
    await browser.waitForAngular();

    const desiredOption = await waitForElement(element(by.id(options['New Suggestion'].id)));
    await desiredOption.click();
    await browser.waitForAngular();

    const input = await waitForElement(element(by.tagName('textarea')));
    await input.sendKeys(suggestion);
    const sendButton = await waitForElement(element(by.buttonText('Send')));
    await sendButton.click();
    
    await browser.waitForAngular();
}

defineSupportCode(function({ Given, When, Then}) {
    Given(/^I am logged in as "([^\"]*)"$/, async(username) => {
        await browser.get(baseUrl);
        await expect(browser.getTitle()).to.eventually.equal('Ionic App');

        await $("input[name='uname']").sendKeys(username as string);
        await $("input[name='psw']").sendKeys('passwd');
        await element(by.buttonText('Login')).click();

        await browser.sleep(2000);
    });

    Given(/^I am at the "([^\"]*)" page$/, async(pageName) => {
        await browser.get(`${baseUrl}/screens/${(pageName as string).toLowerCase()}`);
        await browser.wait(ExpectedConditions.urlContains(`screens/${(pageName as string).toLowerCase()}`), 10000)
        await expect(browser.getTitle()).to.eventually.equal('Ionic App');
        await browser.waitForAngular();
    });

    Given(/^I sent the suggestions "([^\"]*)" and "([^\"]*)"$/, async(suggestionA, suggestionB) => {
        await preincludeSuggestion(suggestionA as string);
        await preincludeSuggestion(suggestionB as string);
    });

    When(/^I select the "([^\"]*)" option$/, async(option) => {
        const desiredOption = await waitForElement(element(by.id(options[option as string].id)));
        await desiredOption.click();
        await browser.waitForAngular();
    });

    When(/^I enter "([^\"]*)" page$/, async(pageName) => {
        await browser.get(`${baseUrl}/screens/${(pageName as string).toLowerCase()}`);
        await expect(browser.getTitle()).to.eventually.equal('Ionic App');
        await browser.waitForAngular();

        suggestionCount = await element.all(by.className('suggestion-card')).count();
    });

    When(/^I enter "([^\"]*)"$/, async(enteredText) => {
        const input = await waitForElement(element(by.tagName('textarea')));
        await input.sendKeys(enteredText);
        const sendButton = await waitForElement(element(by.buttonText('Send')));
        await sendButton.click();
    });

    Then(/^I can see an error message$/, async() => {
        await assertToastMessage('Unfortunately, we were unable to send your suggestion.');
    });

    Then(/^I can see a confirmation message$/, async() => {
        await assertToastMessage('Your suggestion was sent!');
    });

    Then(/^I can see no changes in the "([^\"]*)" page$/, async(pageName) => {
        let newSuggestionCount = await element.all(by.className('suggestion-content')).count();
        expect(newSuggestionCount).to.equal(suggestionCount);
    });

    Then(/^I can see the suggestion "([^\"]*)"$/, async(suggestion) => {
        let suggestions = await element.all(by.className('suggestion-content'));
        let foundSuggestion = suggestions.find(async element => await element.getText().includes(suggestion));
        expect(foundSuggestion).to.exist;
    });

    Then(/^I can see two suggestions: "([^\"]*)" and "([^\"]*)"$/, async(suggestionA, suggestionB) => {
        let suggestions = await element.all(by.repeater('suggestion-content'));
        let foundSuggestionA = suggestions.find(async element => await element.getText().includes(suggestionA));
        let foundSuggestionB = suggestions.find(async element => await element.getText().includes(suggestionB));
        expect(foundSuggestionA).to.exist;
        expect(foundSuggestionB).to.exist;
    });

});
