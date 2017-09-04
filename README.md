# golum-client
The client-side for Golum


You will have to edit some setup variables for sure, i think that most (if not all) of the things that need to be edited are located either in the 2 HTML files in `www/` or the JS files from the `www/js/` directory (i would say the most important of these setup variables is the variable that declares the path to the server from `www/js/generic_functions.js`).

If you plan on testing the app with build.phonegap.com, you will have to generate some keystores. The steps to do that aren't very hard and can be fonud on the internet with a simple Google search.
	
The app has only ver been tested on Android devices. I did plan to test on IOS as well, but to do that i would need an IOS dev account and an IPhone device, neither of which i could afford. I am therefore certain that many features of the app won't work on IOS devices. 
	
The app has been designed for webviews that use Chrome version ~60 or something around that (or any other webview that is as sophisticated as these versions of Chrome).
	
The app has not been designed for devices with screens larger than that of the IPhone 6 Plus or similar phones, therefore i can't and don't guarantee that everything will work or look good on larger devices. This app was designed for mobile only.
	
In order for Google sign-in to work, you will have to generate the proper credentials in the Google APIs console and replace the ones used in the `www/js/external_login.js` file with those. 
	
Note that while developing this app, i faced some bugs that were a bit hard to describe and explain using comments, so instead, i created the `bugs.txt` file and instead of explaining those hard-to-explain bugs in the comments in my JS files, i merely added a comment that says "bugs.txt #8" or something like that so that i can have the privilege of explaining the logic or the architecture that led to those bugs in a comfortable manner.

	
