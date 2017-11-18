World Clock TV
==============

To Do
-----
MVP
 - [x] clock: load locations
 - [x] clock: set map area
 - [x] clock: moment.js
 - [x] picker.html: page to pick from list of system clocks
 - [x] clock: redirect to picker on keypress or mouse click
 - [x] rename timeText -> time_of_day
 - [x] save/load last clock used in cookie
 - [x] server.js: check that clock param is valid
 - [x] partials: meta, navbar, footer  {{> meta-inc}}
 - [x] clock: loading spinner in page background
 - [x] favicon.ico/svg
 
App
 - [x] main screen
 - [x] pop-up menu with list of clocks
 - [x] icons and screenshots [howto](https://developer.amazon.com/public/support/submitting-your-app/tech-docs/taking-screenshots), [guidelines](https://developer.amazon.com/public/support/submitting-your-app/tech-docs/asset-guidelines-for-app-submission)
 - [x] disable sleep
 - [x] button actions
 
MVP2
 - [x] google analytics
 - [x] setup support@ email address
 - [x] more locations in Europe [ref](https://www.timeanddate.com/time/europe/)
 - [ ] more styles
 - [x] app: about screen
 
User-defined clocks
 - [ ] login: [Amazon](https://auth0.com/docs/connections/social/amazon), [Google](https://auth0.com/docs/connections/social/google)
 - [ ] server.js - way to tell if logged in
 - [ ] clock editor
 - [ ] save clock
 - [ ] add user's clock to clocks.json
 
Future
 - [ ] LICENSE.txt
 - [x] FAQ: affiliate link to FireTVs
 - [ ] bounds: exit button
 - [ ] bounds: help button
 - [ ] bounds: copy to clipboard button
 - [ ] bounds: link from ?faq?
 - [ ] bounds: east & west text should be vertical
 - [ ] bounds: truncate lat/lng precision to 3 digits
 - [ ] bounds: enable zoom controls
 - [ ] better spinner (just make default background be blue)
 - [ ] clock: ts parameter to override current time
 - [ ] clock: support for highres-only/lowres-only locations
 - [ ] clock: nighttime opacity parameter (or part of style)
 - [x] beta clocks (app, clocks.json, clock.hbs)
 - [ ] map styles [ref](https://developers.google.com/maps/documentation/javascript/style-reference), [wizard](https://mapstyle.withgoogle.com/)
 - [x] NodePing
 - [ ] clock: time zone boundaries [ref](https://github.com/evansiroky/timezone-boundary-builder)
 - [ ] about.html
 - [ ] option to hide place names on map
 - [ ] credits.html
 - [ ] 404 page
 - [ ] sitemap.xml
 - [ ] register with GWebmaster, Bing
 - [ ] clock schema [json-schema](http://json-schema.org/example1.html)
 - [ ] i18n for time_of_day
 - [ ] show weather
 - [ ] load default based on geolocation
 - [ ] sitemap.xml
 - [ ] bounding method: "auto", calc based on locations
 - [ ] separate clock w/local time
 - [ ] separate clock w/UTC clock

Clocks
 - [ ] Canada
 - [ ] Russia
 - [ ] continental Europe
 - [ ] Indonesia
 - [ ] China
 - [ ] Souteast Asia
 - [ ] Africa
 - [ ] global: Paris, Nairobi, Moscow, Delhi, Sydney, NY, LA, Rio, Moscow, Beijing
 - [ ] financial markets: NY, London, Tokyo, Shanghai, HK,  Toronto, Shenzen, Frankfurt, Bombay, Amsterdam, Stockholm [src](http://www.visualcapitalist.com/20-largest-stock-exchanges-world/)
 - [ ] US inc AK/HI
 - [ ] EU
 - [ ] UK
 - [ ] Continental Europe
 - [ ] Australia/NZ
 - [ ] Time Zones
 
Notes
-----
 - SDK tools are installed in ~/Android/Sdk/platform-tools
 
Credits
-------
 * glitch
 * nodejs
 * express
 * hbs/handlebars
 * Google Maps
 * daynightoverlay
 * icon: Mozilla FirefoxOS
 * momentjs
 * [Olson time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
 * [Lat/Long lookup](http://latitudelongitude.org/)
 
 var uluru = {lat: -25.363, lng: 131.044};
 
 <noscript><meta http-equiv="refresh" content="0; URL=./?/NoScript"/></noscript>
 <!--[if lte IE 8]><meta http-equiv="refresh" content="0; URL=./?/BadBrowser"/><![endif]-->

 var cities = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [-87.650, 41.850]},
          properties: {name: 'Chicago'}
        }, {
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [-149.900, 61.218]},
          properties: {name: 'Anchorage'}
        }, {
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [-99.127, 19.427]},
          properties: {name: 'Mexico City'}
        }, {
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [-0.126, 51.500]},
          properties: {name: 'London'}
        }, {
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [28.045, -26.201]},
          properties: {name: 'Johannesburg'}
        }, {
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [15.322, -4.325]},
          properties: {name: 'Kinshasa'}
        }, {
          type: 'Feature',
          geometry: {type: 'Point', coordinates: [151.207, -33.867]},
          properties: {name: 'Sydney'}
