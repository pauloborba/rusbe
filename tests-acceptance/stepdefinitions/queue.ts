import { defineSupportCode } from "cucumber";
import { browser, $, element, ElementArrayFinder, by } from "protractor";
let chai = require('chai').use(require('chai-as-promised'))
let expect = chai.expect;

const DISABLED_ATTRIBUTE = 'disabled';
const QUEUE_STATUS_ID = 'queueStatus';
const VOTE_BUTTON_ID = 'voteButton';
const SUBMIT_VOTE_BUTTON_ID = 'submitVote';

defineSupportCode(function({ Given, When, Then}) {
    Given(/^I am at the home screen page$/, async() => {
        await browser.get("http://localhost:4200");
        await expect(browser.getTitle()).to.eventually.equal('Ionic App');

        await $("input[name='uname']").sendKeys("marconi");
        await $("input[name='psw']").sendKeys("123");
        await $("button[name='login']").click();

        let queueComponent = await element(by.id('queueComponent'))
        await expect(queueComponent).to.not.equal(undefined);
    });

    Given(/^I have the right to vote$/, async() => {
        await browser.waitForAngular();
        let voteButton = await element(by.id(VOTE_BUTTON_ID));
        await expect(await voteButton.getAttribute(DISABLED_ATTRIBUTE)).to.equal(null);
        await element(by.id(VOTE_BUTTON_ID)).click();
    });

    When(/^I vote for the "([^\"]*)" queue size$/, async(queueOption) => {
        let submitVoteButton = await element(by.id(SUBMIT_VOTE_BUTTON_ID));
        await expect(await submitVoteButton.getAttribute(DISABLED_ATTRIBUTE)).to.equal('true');

        let optionId = queueOption + "Option";
        let desiredOption = await element(by.id(optionId));
        await desiredOption.click();

        await expect(await submitVoteButton.getAttribute(DISABLED_ATTRIBUTE)).to.equal(null);
        await submitVoteButton.click();
    });

    Then(/^I can see "([^\"]*)" in the queue status$/, async(queueStatus) => {
        await browser.sleep(1000);
        let queueCurrentStatus = await element(by.id(QUEUE_STATUS_ID));
        await expect(await queueCurrentStatus.getText()).to.be.equal(queueStatus);
    });

    When(/^The queue wait time has been loaded$/, async() => {
        await element(by.id(QUEUE_STATUS_ID));
    });

    Then(/^I can see the wait time$/, async() => {
        let queueCurrentStatus = await element(by.id(QUEUE_STATUS_ID));
        await expect(await queueCurrentStatus.getText()).to.not.be.equal(null);
    });
});
