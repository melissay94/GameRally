
![GameRally Logo](public/img/GameRallyLogo.png)
# 
Templated from [Express Authentication Project](https://github.com/melissay94/express-authentication)

## Setting up Project

* Run `npm install` to install dependencies
  * Use `npm test` to run tests
* Setup the databases
  * Run `createdb gamerally_dev` to create the development database
  * Run `createdb gamerally_test` to create the test database
  * Run `sequelize db:migrate` to run migrations

## Initial Project Plan

#### Problem Being Addressed
A person is new to an area or just became interested in tabletop games. However, they get anxious at big meet ups and are easily overwhelmed trying to find a group on their own.

#### Solution Idea
GameRally is a social interaction service specifically designed for people looking to create and plan tabletop events for a small group of people. It allows users to find a group of exactly the type of games they want to play, and caps the acceptance once the ideal number of players for that group has joined.

#### Target Audience
People who want to play board games, but get anxious when trying to meet new people, especially in crowded settings with too many choices.

#### Initial Wireframes
###### Landing Page
![Landing Page](/readMeImg/landingWireFrame.png)

###### Events List
![Events List](/readMeImg/eventListWireframe.jpg)

###### Specific Event
![Specific Event](/readMeImg/specificEventInfo.jpg)

###### Groups List
![Groups](/readMeImg/allGroupsWireframe.png)

###### Specific Group
![Specific Group](/readMeImg/specificGroupWireframe.jpg)

###### User Profile
![User Profile](/readMeImg/profileWireframe.png)

###### Edit Info 
![Edit Info](/readMeImg/landingWireFrame.png)

#### MVP:
  * Sign up / Login / Logout **Completed**
  * Create a group **Completed**
  * Join a group **Completed**
  * Leave a group **Completed**
  * Create events for that group **Completed**
  * Look up a board game for that event **Completed**
#### Stretch goals:
  * Add the ability for users to put what type of game types they are interested in on the group page.
  * Be able to filter the game search engine base on things such as game types or player number.
  * Add some suggestions for when events or groups for a user are empty.
  * Filter groups by member or not member
  * RSVP for an event
  * Have global events that have no group association
  * Add events to google calendar via the Google Calendar API
  * Review games played by group
  * Gamification!! - Just site badges and such
#### Completed extras:
  * Add nice custom 404 page for error handling!
  * Added second API to provide random icons for group
  * Added user profile page that lists info and specific groups joined
  * Added Edit pages for groups, events, and profile pages
  * Can delete events and user account
  * Display games played by group in group information
  * Add confirm password check for users
  * Add admin privileges for people who create groups

#### Technology being used:
  * [Board Game Atlas API](https://www.boardgameatlas.com/api/docs)
  * [DiceBear Avatars API](https://avatars.dicebear.com/)
  * JavaScript, HTML, CSS
  * Bootstrap
  * [Teko Font from Google](https://fonts.google.com/specimen/Teko)
  * EJS
  * Express
  * Sequelize
  * Postgres

#### ERDiagram
![ERDiagram](/readMeImg/gameRallyERDiagram.png)

#### Routes
| Method  | Route   | Behavior                   |
|---------|---------|--------------------------- |
| GET     | /       | Render landing page        |
| POST    | /login  | Logs in existing user      |
| POST    | /signup | Creates new user account and logs them in   |
| GET     | /home   | Renders page of events user is going to attend |
| GET     | /home   | Log user out and redirect to `/` on success |
| GET     | /group  | Renders page of all groups on the site |
| GET     | /group/new | Renders page with form for creating new group |
| POST    | /group/new | Creates new group and redirects to `/group/:id` on success |
| GET     | /group/:id | Renders page of a specific group |
| DELETE  | /group/:id | User leaves group, if user is last user in group, delete group, redirects to `/group` on success |
| GET     | /group/:id/edit | Renders page with form for changing group information |
| PUT     | /group/:id/edit | Updates group information and redirects to `/group/:id` on success |
| GET     | /event/new/:groupId | Renders page with form for adding a new event to group |
| POST    | /event/new/:groupId | Creates a new event for the specific group |
| GET     | /game/:eventId   | Renders page with game search engine on it |
| POST    | /game/:eventId   | Creates or finds a new game object and attaches it to an event |
| PUT     | /game/:eventId   | Removes the association between a game object and an event object |
| GET     | /event/:id | Renders page for specific event in specific group |
| DELETE  | /event/:id | Deletes event and redirects to `/group/:id` on success |
| GET     | /event/:id/edit | Renders page with form for updating event information |
| PUT     | /event/:id/edit | Updates event information and redirects to `/event/:id` on success |
| GET     | /profile   | Renders page with user information |
| DELETE  | /profile      | Deletes user account and redirects to `/` on success |
| GET     | /profile/edit | Renders page with form to update user information |
| PUT     | /profile/edit | Updates user information and redirects to `/profile` on success |

#### Site Map
![Site Map](/readMeImg/siteMap.png)

#### Issues and Bugs
* The breadcrumbs at the top are statically defined and not actually defined by the path you game from. I'd like to update that to be more helpful
* Everything to do with Dates. I want to format them better, I would like to keep people from being able to make events in the past, and I would like to pre-fill the date field with the date for the edit event form.
* When something is destroyed, while it's instance is removed from it's specific table in the database, if it has a N:M relationship with another instance in a different table, the instance in the join table is not removed.
* I feel like I have a lot of nested db calls in my controllers, and for some of them I feel like I didn't correctly utilize all sequelize could do, so at some point I'd like to refactor that.
* I started writing test at the beginning of the week, but that fell off pretty fast. I'd like to add more as they did help me find issues pretty early on.
* I used Bootstrap to help with the responsiveness of the site, but haven't really designed with mobile in mind yet, so that could use some tweaking in the future.

#### Implementation 
1. Started with planning out and implementing all of the models that the database would be using. I learned about different types of validations I could add to the models, and spent some time writing some tests. They were extremely useful as I found issues with my models before I even created any controllers.
2. Originally, I planned to go layer by layer and create all the controllers first, then move on to my templating, but this proved challenging for seeing what was effectively working and what wasn't. As such I switch to more of a 'slice' idea, where I completed an entire section such as auth before moving on to the next part.
3. After completing auth, I worked on the Group implementation. This feature definitely took the most time as it was also my first deepdive into different parts of Sequelize and making sure all the different tables were receiving the correct information and sending it back to me.
3. Next came the Event slice, which was pretty straight forward in the beginning since I was able to follow what I had already done for the Group slice. The most challenging part was adding in the axios calls to the board game API.
4. Last of the controllers and pages came the Profile slice, which came with the surprising issue that it was not deleting associations to itself when deleting the user overall. Upon further inspection, none of my N:M associated tables were deleting their associations from join tables, and I still haven't figure out why.
5. Finally, I did my website design and making sure the whole site was cohesive. It was really infuriating to wait all week and make sure that the functionality was there before doing it, but it was definitely the right call! Adding the layout and designs actually helped point out to me features that I had missed and were easily added in as I went since the base structure was already there.

#### Final ScreenShots

###### Landing Page
![Landing Page](/readMeImg/landingPage.jpg)

###### Login Modal
![Login Modal](/readMeImg/loginModal.jpg)

###### Event List
![Event List](/readMeImg/eventsHomePage.jpg)

###### Specific Event
![Specific Event](/readMeImg/specificEvent.jpg)

###### Edit Event
![Edit Event](/readMeImg/editEvent.jpg)

###### Game Search
![Game Search](/readMeImg/gameSearch.jpg)

###### Group List
![Group List](/readMeImg/groupList.jpg)

###### Specific Group
![Specific Group](/readMeImg/specificGroup.jpg)

###### User Profile
![User Profile](/readMeImg/userProfile.jpg)

###### 404 Page
![404 Page](/readMeImg/404page.jpg)
