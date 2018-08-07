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

1. static-site-api
2. screenshot-emailer
3. playback

### Testing Demos

1. intro
2. user-flow
3. accessibility
4. visual-regression
5. memory-leak-by-heap
6. memory-leak-by-prototype
7. code-coverage
8. multi-user
9. multi-user-full
