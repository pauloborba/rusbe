Feature: As a logged user
         I want to see my groups         
         So that I can create new groups
         And post my avaialable times 
         And remove my avaialable times


Scenario: Create a group with existing users
Given I am logged in to "heitor81" user account
Given I am at the "Groups" page
When I select the option to create a new group
When I select the name "Amigos da UFPE" as the name of the group
When I select "totonio", "gil97", "Rob" as the members of the group
When I select the option to finish creating the group
Then I can see an alert containing "Group created with success!"
Then I can see "Amigos da UFPE" listed in the groups

Scenario: Try to create a group with non-existing users
Given I am logged in to "heitor81" user account
Given I am at the "Groups" page
When I select the option to create a new group
When I select the name "Turma do almoço" as the name of the group
When I select "totonio", "gil97", "Robert" as the members of the group
When I select the option to finish creating the group
Then I can see an alert containing "The following users were not found: Robert"
Then I cannot see "Turma do almoço" listed in the groups

Scenario: Post my available time to a group
Given I am logged in to "heitor81" user account
Given I am at the "Groups" page
When I select the "Amigos da UFPE" group
When I select the option to add available time
When I select the "Lunch" meal
When I select from "12:00" to "13:00"
Then I can see an alert containing "You just posted your time for lunch"

Scenario: Remove my available time to a group
Given I am logged in to "heitor81" user account
Given I am at the "Groups" page
When I select the "Amigos da UFPE" group
When I select the option to remove available time
When I remove the "Lunch" meal
Then I can see an alert containing "You just removed your time for lunch"