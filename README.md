# DevTools Protocol Demos

Demos of the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) for various testing/automation techniques. For simplicity, these demos use [Puppeteer](https://github.com/GoogleChrome/puppeteer) to interact with the Chrome DevTools Protocol.

## Setup

In order to setup the demos for use, run the following commands (assuming you have [git](https://git-scm.com/) and [npm](https://www.npmjs.com/get-npm) installed):

1. `git clone https://github.com/trentmwillis/devtools-protocol-demos.git`
2. `cd devtools-protocol-demos`
3. `npm install`

From there you can run the various demos using `npm run` and then the corresponding script name as documented below.

## Demos

There are two types of demos in this repository:

1. **[Service Demos](./service-demos)** - These are demos that use Puppeteer to power an API service to automate some workflow.
2. **[Testing Demos](./testing-demos)** - These are demos that use Puppeteer to test some aspect of a web application.

### Service Demos

The Service Demos showcase Puppeteer-powered APIs. You can run them with `npm run service<name>`.

1. `static-site-api` - Creates a RESTful API for getting content from a statically generated site. After starting the service, go to `http://localhost:3000` to get a random post from my blog.
2. `screenshot-emailer` - Creates a service where you can email a screenshot of a webpage to someone. You'll need a Gmail account in order for this demo to work.
3. `playback` - Creates a service where you can post a series of commands and Puppeteer will "playback" those commands. After starting the service, you can run `service-demos/playback-demo-script.js` in the browser to see it work.

### Testing Demos

The Testing Demos showcase testing various aspects of the [ChitChat](https://chitchat.glitch.me/) web application. You can run them with `npm run test:<name>`.

1. `intro` - A basic introduction showing launching the browser, visiting a page, and checking for an element's text.
2. `user-flow` - Builds on the `intro` demo and runs through a user flow for sending messages in the app.
3. `accessibility` - Builds on the `user-flow` demo and checks the accessibility of the page using [`axe-core`](https://www.deque.com/axe/).
4. `visual-regression` - Builds on the `accessibility` demo and checks the visual appearance of the app by using screenshots.
5. `memory-leak-by-heap` - Demonstrates a simple approach to detecting memory leaks by looking at the JS heap size of the app before and after a series of actions.
6. `memory-leak-by-prototype` - Demonstrates detecting memory leaks by checking for objects of a specific prototype in the app's memory.
7. `code-coverage` - Shows how to get code coverage (usage) reports for the assets used by a web app. Runs a test and then uses [Istanbul](https://github.com/istanbuljs/nyc) to generate the report.
8. `multi-user` - Demonstrates how to launch multiple instances of an application to test multi-user interactions.
9. `multi-user-full` - Demonstrates how to launch multiple instances of an application to test multi-user interactions with accessibility, memory, and code coverage checks as well.
