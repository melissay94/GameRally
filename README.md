# Game Rally

Templated from [Express Authentication Project](https://github.com/melissay94/express-authentication)

## Initial Project Plan

#### Technology being used:
  * [Board Game Atlas API](https://www.boardgameatlas.com/api/docs)
  * JavaScript, HTML, CSS
  * Materialize
  * EJS
  * Express
  * SQL
  * Postgres

#### MVP:
  * Sign up / Sign In 
  * Create a group
  * Join a group
  * Leave a group
  * Create events for that group
  * Look up a board game for that event
#### Stretch goals:
  * Filter groups by member or not member
  * RSVP for an event
  * Have global events that have no group association
  * Add events to google calendar via the Google Calendar API
  * Add admin privileges for people who create groups
  * Review games played by group
  * Gamification!! - Just site badges and such
  
## Routes
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
| GET     | /group/:id/edit | Renders page with form for changing group information |
| PUT     | /group/:id/edit | Updates group information and redirects to `/group/:id` on success |
| DELETE  | /group/:id | User leaves group, if user is last user in group, delete group, redirects to `/group` on success |
| GET     | /group/:id/event/new | Renders page with form for adding a new event to group |
| POST    | /group/:id/event/new | Creates a new event for the specific group |
| GET     | /group/:id/event/:id | Renders page for specific event in specific group |
| GET     | /group/:id/event/:id/edit | Renders page with form for updating event information |
| PUT     | /group/:id/event/:id/edit | Updates event information and redirects to `/group/:id/event/:id` on success |
| DELETE  | /group/:id/event/:id | Deletes event and redirects to `/group/:id` on success |
| GET     | /profile   | Renders page with user information |
| GET     | /profile/edit | Renders page with form to update user information |
| PUT     | /profile/edit | Updates user information and redirects to `/profile` on success |
| DELETE  | /profile      | Deletes user account and redirects to `/` on success |


## Setting up Project

* Run `npm install` to install dependencies
  * Use `npm test` to run tests
* Setup the databases
  * Run `createdb gamerally_dev` to create the development database
  * Run `createdb gamerally_test` to create the test database
  * Run `sequelize db:migrate` to run migrations
