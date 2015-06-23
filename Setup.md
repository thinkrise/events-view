Setup Instructions
------------------

After build has been produced, and tests have passed correctly, the following steps should happen.

 - Redirect nginx traffic to holding page, (should happen automatically when Node.js is down).
 - Shut down Node.js.
 - Shut down Java EE.
 - Shut down Postgres.
 - Deploy to Tiffin (front-end).
   - Run gulp.
   - What other built assets do we deploy?
   - What do we run on the server? Do we re-install node_modules or deploy?
   - How do we deploy? Recommend Python script for this process.
 - Start Node.js.
 - Redirect nginx traffic to front-end.
 - Deploy to Shortbread (service).
 - Start Java EE.
 - Update database.
 - Start Postgres.
=======
## General Setup

Yirga's front-end service is an [Express.js](http://expressjs.com) app, to setup the project on your development machine you will need to have Node.js installed at version 0.10.24 or above. Once you cloned the repository onto your machine install all the required packaged by defaut runninig ```npm install```. This command will install your development modules too.

## Assets Compilation

We are using the [SASS](http://sass-lang.com/) preprocessor to compile CSS and [Browserify](http://browserify.org/) for neatly including JS modules in the browser. This approach let's us have a very modular-oriented project that's easy to maintain and scale. Prior to running Express server you will have to compile all the assets using Gulp task runner.

There are three main tasks that are part of the assets' build process:

- **sass**; compiles the **main.scss** file in the **/app/assets/sass** directory. Every new SCSS file or a module should be imported into the main file using ```@import "file";``` declaration.
- **scripts**; runs node-browserify to compile require all depending JS modules into the **main.js** file. In the future this task will also minify and version the file.
- **sprites**; it creates an SVG spritesheet by including every **.svg** file inside the **/app/assets/svg/** folder and puts the **spritesheet.svg** file inside the **/app/views/partials/** folder to be included by the Express app.

## Asset Caching

**Coming soon**; General idea is to name the asset files with with a timestamp .e.g. main.786gg4.css and set the maximum expiry date in the headers of responses, every newly compiles asset will break the cache-chain.

## Node.js Production Deployment

Currently, the deployment of the node app happens using the [node-deploy](https://github.com/martinrue/node-deploy) package. It manages the nginx setup, creates an upstart script and pulls the latest code from a stated git branch (master, by default). The config folder lies inside **etc/deploy** and this directoy has to be specified when running the ```nd``` command.

To deploy to the production simply run ```nd deploy -b etc/deploy``` command. If you are deploying a specific brand use the  **-b brand-name** option.
