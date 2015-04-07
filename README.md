# SSU Student Information API

This application is a server for an API meant for use by an arbitrary number
of clients. The purpose of the API and its clients is to display aggregated
and organized student data for the Department Chairs at SSU.

This repository contains code for the API and a web client.

## Project Discussion/Planning

Project discussion, planning, and notes should reside in the [Issues](https://github.com/kjanssen/ssu-api/issues)
section of this repository. Issues are easily tagged and filtered, which
helps with organization. If there is no issue for a particular topic or
feature, there is probably no work being done on it. Likewise, if there is
work being done on some topic or feature, an issue should be created for
it as a place to discuss it.

## Dependencies
- [Node.js](nodejs.org) - The command is `nodejs` on Linux, but I make a link `/usr/bin/node -> /usr/bin/nodejs`
    Installing node should also install `npm`, node's package manager. For development,
    you'll need to install the `gulp` and `forever` packages globally, using
    `npm install -g gulp forever`
- [MongoDB](mongodb.org) - Installation instructions:
    [Ubuntu](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/),
    [OSX](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)

## Getting Started

1. Once you have cloned the repository, run `npm install`. This will install the
node modules listed as dependencies in `package.json` necessary to run the app.

2. Once you have a MongoDB service running, run `node populateDatabase.js`. This will
populate the database using the CSV files in `/data`, which contain all of the course
information for SSU, some course requisite information, and four semesters' worth of
(fake) student enrollment information.

3. Start the server with `npm start`. This will run the server using [Forever](https://github.com/foreverjs/forever),
which will restart the server if it crashes or if you change its source files.

4. Test to see if the server is working by navigating to [localhost:8080/api/v0/students](http://localhost:8080/api/v0/students).
You should see a JSON listing of all the `student` entries in the database. If you
are looking at raw JSON and are using Chrome, I recommend the [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en)
Chrome extension. You can also use [Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en)
to generate http requests of any type, which will be more helpful when this api
uses more than just GET requests.

5. The client application UI is built using Facebook's React library. To build it, run
`gulp`. This will combine the source files for the client into a bunle that lives in
`/public`, from which the server will serve static files. The client will be located at
[localhost:8080/#/](localhost:8080/#/).
