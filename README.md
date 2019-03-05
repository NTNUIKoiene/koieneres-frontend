# KoieneRes Frontend

KoieneRes Frontend is the frontend application for the new reservation system for NTNUI Koiene. For the backend see the [here](https://github.com/NTNUIKoiene/koieneres-backend). An instance of the backend is running on [here](<[https://koieneres-api-dev.appspot.com/](https://koieneres-api-dev.appspot.com/api/)>). Swagger docs can be found [here](https://koieneres-api-dev.appspot.com/swagger/).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Workflow

This project uses GitHub Issues and Projects for task management. Work is done on feature braches with the following naming convention: `[ISSUENUMBER]/[ISSUEDESCRIPTION]`. Features are merged into the protected master branch using pull requests. All pull requests should be reviewed by one other developer.

When creating a commit the code is automatically prettified using [Husky](https://github.com/typicode/husky).

Commits to the master branch are built and deployed by CircleCI. Note that build with warnings (such as unused variables) will fail.

## CSS Modules

This project uses CSS modules to prevent naming conflicts.

## Staging

To test the most recent version of the master build, visit [https://koieneres.koiene.no/](https://koieneres.koiene.no/).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## The Team

- [Espen Meidell](https://github.com/espenmeidell), Lead Architect
- [Markus Andresen](https://github.com/SleipRecx), Hipster Developer
