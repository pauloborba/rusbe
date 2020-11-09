Feature: As a logged user
         I want to vote for the queue status
         So that I can contribute for the queue management
Scenario: Voting for the queue size
Given I am at the home screen page
Given I have the right to vote
When I vote for the "Medium" queue size
Then I can see "Medium" in the queue status

Scenario: Checking the queue wait time
Given I am at the home screen page
When the queue wait time has been loaded
Then I can see the wait time