# Molecule of the Month  
A mobile AR application for displaying a molecule inside the UWA Bayliss building. The molecule on display is expected to change each month.

## Marker-based AR

### Tutorial followed
https://www.youtube.com/watch?v=NIXJJoqM8BQ&t=319s

### Running the Program
1. download node.js from https://nodejs.org/en/download/ on your pc  
or use a package manager such as `apt`, `brew` with `[package-manager] install npm`

2. install the requirements `npm install`

3. When deployed on the internet, some security is involved, some parts of that are not included in this repository. This isn't a problem for local testing, and you can copy `.env example` and rename it to `.env`

4. Run the app with `npm start`

5. If you have an enviroment variable `PORT` it will parse this into a number, otherwise it will default to `8080`

6. go to [http://localhost:PORT](http://localhost:8080) in a browser on a device with a camera (if you want to use it on your phone for the AR experience you can open [http://\<your local network IP\>:PORT](http://192.168.20.30:8080) as the server is listening on `0.0.0.0:8080`)

7. If using the AR application, the marker necessary to track the molecule is located at: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png


    
## CMS/Content Delivery

### Description
This is a website application designed to go alongside the mobile app for viewing 3D molecular models in AR. This component of the project is focused on allowing priveliged users to access a routed website aside from the application to upload the 3D models necessary.

### Features
* An accessible user interface
* Access to authorised individuals (implemented through user authentication)
* The uploading of abstract files
* The storing of files
* Downloading files to a user 

### Usage

Beyond the above steps for running the program, this application requires a session hash that is used to encrypt user passwords. Navigate to the base directory and create a new file '.env' with a single line

`SESSION_SECRET=secret` 

The word secret can be substituted for any word of your choosing.

Once on the landing page, navigate to the login page. From here, you can register a user. Enter in your details and you will be redirected, and able to log in. After logging in, you will be redirected to the submit page, where you can upload a file. Once you choose a file to submit and you submit it, you will see the message, 'File Uploaded', and you will see your file in the 'files' directory in your copy of the repository.
