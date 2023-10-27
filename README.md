# Welcome to Impact Tracker by the Helgitas 👵

## Presentation

The Helgitas is a group of dedicated people who took several weeks to help the foundation [Pro Juventute](https://www.projuventute.ch/fr/home) whose aim is to support parents and assist children and young people so that the latter can become self-reliant and responsible individuals.

The result is a web application: **Impact Tracker**, that helps you define KPIs and follow their progress.

## How to build and run the app
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In order to run the app on your local machine you just have to clone this project an the run the following commands:
### `npm install`
### `npm start`
And that's it!

## Users flow

What you can do with this app depends on the role you have: economist or gatekeeper:
* Gatekeepers
  * can define KPIs and associate them with circles.
  * can edit a specific KPI
  * can delete a KPI
  * can access Users page where they can see the table with all users and change their role
* Economists
  *  can see a table with KPIs to which values must be added
  * can add a value to a KPI by opening the form which has clear explanations, validations and information for them to add the correct value
  * once the value was submitted, the KPI will be added to the second table which is "KPIs History Record" where economists can see all the KPIs added in the past
  * see the Tableau charts for the history record table

## References

The web application uses the following technologies:

* [React](https://react.dev/) library
* [AntDesign](https://ant.design/) (and its third-party libraries), a React UI framework
* [Redux Toolkit](https://redux-toolkit.js.org/)
* Supabase SSO

And we used the help of ChatGPT from time to time.
