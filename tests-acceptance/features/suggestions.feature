Feature: As a logged user
         I want to see my suggestions
         So that I can check the suggestions I sent
         And send new suggestions

Scenario: Send a new valid suggestion
Given I am logged in as "eaor"
Given I am at the "Suggestions" page
When I select the "New Suggestion" option
When I enter "It would be great to have the option of chili among the condiments."
Then I can see a confirmation message 
Then I can see the suggestion "It would be great to have the option of chili among the condiments."

Scenario: Send a new suggestion with no content
Given I am logged in as "eaor"
Given I am at the "Suggestions" page
When I select the "New Suggestion" option
When I enter ""
Then I can see an error message
Then I can see no changes in the "Suggestions" page

Scenario: See suggestions page with my sent suggestions
Given I am logged in as "eaor"
Given I sent the suggestions "It would be great to have the option of chili among the condiments." and "Allow the use of personal cups to avoid the use of disposable cups."
When I enter "Suggestion" page
Then I can see two suggestions: "It would be great to have the option of chili among the condiments." and "Allow the use of personal cups to avoid the use of disposable cups."
