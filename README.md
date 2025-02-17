# Food Scanner Android Application
This project was created as a starting version of an idea I had for a personal tool.
I have gluten intolerance and it is a lot of effort to read through the ingredients of every new thing that I buy to check if there is anything containing gluten. I had the thought "I wish I could just scan the ingredients with my phone to check".
I tried existing android apps but my phone would crash when using them, so for my final project of a second year mobile applications programming course, I worked on creating this app. The intention was to let a user take a picture of an ingredients label, use OCR to read the ingredients into a string, then compare that against a list of ingredients that contain gluten.
I could not get the OCR working in the time I had to create the project, but the rest of the functionality is there (along with some bugs).


## Instructions to compile
In the root of the project (the directory that should contain this README.md file), there should be some batch scripts. These scripts and files will be used to compile the project.
There are some environment prerequisites to compile this project into an APK file however, due to the way it was developed.
When developing this project I was using:
- Gradle 7.3.3
- OpenJDK-8u432
- Cordova 11.0.0
- NodeJS v22.11.0
- Android Studio with Android Virtual Device manager to emulate a phone

With this environment the project should be able to compile and be launched on an android emulator in android studio. The only real phone the resulting APK was tested on was a Samsung S10e.
### Steps
1. With the above environment, open Android Studio to the root directory of the project. This should be the name of the repository and should contain the scripts mentioned above.
2. Start a virtual android device in the device manager and ensure it is running. The project targets API version 30 so any device running that or above should work.
3. Open a command prompt instance in the terminal window of Android Studio. If you need to configure environment variables to change your JAVA_HOME path or add/change your gradle path, you can customize this in settings here.
4. Run the command `cd FoodScannerApp-Final` to navigate into that folder, then run the command `npm install` to restore the packages required to build the app.
5. Once this has finished, run `cd ..` to return to the root of the project. From here, run the command `build.bat FoodScannerApp-Final` to initiate the script that will build the angular app, convert it into a mobile application, then install it onto the android emulator.
6. This may result in errors about unsupported java class versions or certain things not being valid commands. If you run into these errors, please ensure you are using the above configuration for your environment.
7. If the script finishes successfully you should have an app-debug.apk file in the `FoodScannerApp-Final\mobile\platforms\android\app\build\outputs\apk\debug` directory. This is your compiled apk for the app.

## License Choice
I selected a BSD 3-Clause License for this project, because it is simple but effective and covers all the things I think should be neccessary for this simple of a project.
Redistribution of the source code or binary compiled code must include my copyright notice, which to my understanding should prevent other students or programmers from having permission to take my code and present it as their own, whether that be in an assignment or as a standalone project. Because this was a simple project made for an assignment, my main concern for this code would be other studens finding and copying my work while I'm still in college and getting an academic offense because somebody copied and submitted it as their own. That being said, I have no issue with people taking and using this code because it is nothing special to me and is laregly simple basic functionality.
This license seemed to allow those permissions while preventing others from "stealing" my work, so it fit the project's needs.
