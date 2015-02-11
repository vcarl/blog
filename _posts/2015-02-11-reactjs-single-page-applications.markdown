---
layout: post
title:  "Single page applications with React.js and react-router"
date:   2015-02-11
categories: frontend react build-systems
---

Recently I was tasked with writing a single page application from scratch. I did some research on Angular, Backbone, Ember and the like, but the MVC architecture of all those frameworks didn't make sense to me for the project, since I didn't really have data to store and update. The majority of the API calls I was making were either state checks/changes or simple fetch requests that had to be rendered nicely. As such, I chose to use React, but this is my first major SPA. Here's what I learned along the way.

## Build process.

I'd previously started a project using React to replace the view layer of Backbone, combined with Grunt as the build step, but I felt like I had been fighting the tools more than I was writing code. Given a fresh start, I used Browserify to simplify loading dependencies and Gulp for its pipes over Grunt's configuration.

Browserify worked as advertised, allowing me to use node-style require() calls for my dependencies. Great! Now I could separate each of my views and reusable components into separate files, and only load what I needed in each. 

But there were problems as well. I started working on incorporating D3 into a statistics page. D3 is 150kB minified--not exactly bloated, but not tiny. Because browserify bundles everything into a single large glob, that meant I was sending 150kB down the wire for a stats page before there was a chance to log in. 

Additionally, since I was using `require('react')`, the entirety of React was being processed every build--resulting in 2 second builds every time a file was saved, and output that weighed in at around 2MB. I tried minifying the output to save sent, but the options for extracting sourcemaps from Browserify were daunting at best and I wasn't particularly keen on adding steps to my already time consuming build process.

I started looking at alternatives that would allow me to load dependencies on demand rather than all up front. RequireJS sounded nice, but was a little fiddly to set up and still required an awkwardly configured build step to keep views separate while doing the JSX transformation I needed. I'd heard of Webpack as the hot new replacement for Browserify, and it was exactly what I was looking for. 

Webpack feels like it stole the best parts of all the other build tools and dependency managers. It has more powerify configuration that Gulp, but doesn't get as verbose or convoluted as Grunt. It offers all the bundling Browserify can, with the flexibility of RequireJS. Best of all, it doesn't arbitrarily split up features into separate modules. 