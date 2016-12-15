#!/usr/bin/env node
'use strict';

const ghpages = require('gh-pages');
const path = require('path');

ghpages.publish(path.join(process.cwd(), 'docs'), (err) =>
{
		console.log("Publishing Docs folder to gh-pages branch...\n" );
    if (err)
    {
        console.log(err);
        process.exit(1);

        return;
    }
    console.log("Done!")
    process.exit(0);
});