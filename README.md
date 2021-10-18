# Molecule of the Month  
A mobile AR application for displaying a molecule inside the UWA Bayliss building. The molecule on display is expected to change each month.

## Marker-based AR

### Running the Program
1. download [node.js](https://nodejs.org/en/download/) onto your pc  
or use a package manager such as `apt`, `brew` with `[package-manager] install npm`

2. install the requirements `npm install`

3. When deployed on the internet, some security is involved, therefore some secrets are not included in this repository. For local testing you can fake these secrets by copying `.env example` and renaming it to `.env`

4. Run the app with `npm start`

5. If you have an enviroment variable `PORT` it will parse this into a number, otherwise it will default to `8080`

6. go to [http://localhost:PORT](http://localhost:8080) in a browser on a device with a camera (if you want to use it on your phone for the AR experience you can open [http://\<your local network IP\>:PORT](http://192.168.nnn.nnn:8080) as the server is listening on `0.0.0.0:8080`)

7. If using the AR application, the marker necessary to track the molecule is located at: [Hiro Marker](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png)


    
## CMS/Content Delivery

### Description
This is a website application designed to go alongside the mobile app for viewing 3D molecular models in AR. This component of the project is focused on allowing priveliged users to access a routed website aside from the application to upload the 3D models necessary.

### Features
* An accessible user interface
* Access to authorised individuals (implemented through user authentication)
* The uploading of abstract files
* The storing of files in a queue system
* Downloading files to a user 

### Usage

Beyond the above steps for running the program:
This application requires a session hash that is used to encrypt user passwords. Navigate to the base directory and inside '.env example' check the following:

`SESSION_SECRET=secret` 

The word secret can be substituted for any word of your choosing.

`BAYLISS_FEATURE_CMS=true`

The `true` tag here enables CMS functionality.

And at the end, add

`DATABASE_URL=[...]`

Where `[...]` corresponds to the current heroku database URI. This can be accessed from the heroku dyno posgresql configuration settings tab, and will enable your local to connect to the online database.

Once on the landing page, navigate to the login page. From here, you can register a user. Enter in your details and you will be redirected, and able to log in. After logging in, you will be redirected to the submit page, where you can upload a file. Once you choose a file to submit and you submit it, you will see the message, 'File Uploaded', and you will see your file in the 'files' directory in your copy of the repository with the corresponding year/month naming convention. Navigating to `/download` will allow you to download the file for the current month if one is available. Otherwise, it returns an error. This functionality is non-effectual on the heroku deployment as it times server directories and is a feature intended to be used long term on a more robust server deployment.

## Conversion

### Local Conversion

* Place a .pdb file of your choosing in the /static/examples folder
* In the .env file set the MOLECULEPDB file to the name of the .pdb file (name only, not the full path)
* You can change the MOLECULESCALE which my be necessary for some larger molecules
* Restart the server and your molecule will be served at /molecule


### References
- [Video tutorial on AR.js](https://www.youtube.com/watch?v=NIXJJoqM8BQ&t=319s)
