# SSU Student Information API

This application is a server for an API meant for use by an arbitrary number
of clients. The purpose of the API and its clients is to display aggregated
and organized student data for the Department Chairs at SSU.

This is one part of a three part project:

- A back-end API to serve the data
- A web-based client
- An iOS client targeting iPad

## Project Discussion/Planning

Project discussion, planning, and notes should reside in the [Issues](https://github.com/kjanssen/ssu-api/issues)
section of this repository. Issues are easily tagged and filtered, which
helps with organization. If there is no issue for a particular topic or
feature, there is probably no work being done on it. Likewise, if there is
work being done on some topic or feature, an issue should be created for
it as a place to discuss it.

## Dependencies
- [Node.js](nodejs.org) - The command is `nodejs` on Linux, but I make a link `/usr/bin/node -> /usr/bin/nodejs`
- [MongoDB](mongodb.org) - Installation instructions:
    [Ubuntu](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/),
    [OSX](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)

## Getting Started

1. Once you have cloned the repository, run `npm install`. This will install the
node modules listed as dependencies in `package.json` necessary to run the server.

2. Once you have a MongoDB service running, run `node mockData.js`. This will
inject some student data into the database with random names and student IDs.
Note that this is just fake data, and only populates the student table. To test
the whole application, you'll need to use some actual sample data.

3. Start the server with `npm start`. This will run the server using [Forever](https://github.com/foreverjs/forever),
which will restart the server if it crashes or if you change its source files.

4. Test to see if the server is working by navigating to [localhost:8080/api/v0/students](http://localhost:8080/api/v0/students).
You should see a JSON listing of all the `student` entries in the database. If you
are looking at raw JSON and are using Chrome, I recommend the [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en)
Chrome extension. You can also use [Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en)
to generate http requests of any type, which will be more helpful when this api
uses more than just GET requests.
