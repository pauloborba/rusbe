Feature: As a logged user
         I want to see the daily menu         
         So that I can evaluate each food on the menu
         And check it's respective evaluation results


Scenario: See the daily menu
Given I am logged in to "alpvj" user account
Given I am at the "Home" page
Given I can see "Almoço" as the current meal for the menu
Then I can see "Arroz", "Goiabada", "Suco", "Bife" listed

Scenario: See evaluation for a food
Given I am logged in to "alpvj" user account
Given I am at the "Home" page
Given I can see "Goiabada" at the menu
Then I can see the evaluation for "Goiabada"

Scenario: Change between meals
Given I am logged in to "alpvj" user account
Given I am at the "Home" page
Given I can see "Almoço" as the current meal for the menu
When I submit to go to the previous the page
Then I can see "Desjejum" as the current meal for the menu
Then I can see "Cuzcuz", "Frutas", "Leite", "Salsicha" listed

Scenario: Evaluate a food
Given I am logged in to "alpvj" user account
Given I am at the "Home" page
Given I can see "Arroz" at the menu
Given I have not voted for "Arroz"
When I evaluate "Arroz" as a "like"
Then "Arroz" is at the list of evaluated foods