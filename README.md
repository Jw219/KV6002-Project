# KV6002-Project
Team TB01 Net Ninja

Due to the size of the module files they could not be directly uploaded as part of the whole system file so they were uploaded sepretaly there are two images Modules1 and Modules2 these are the names of the files the modeules are stored in. These files are both stored in the netninja folder that is located in the public folder of the TeamProject-login folder. The modules need to be added to these folders as shown via the images and stored in the netninja folder for the system to work effectively.

To initialise the project there are some preprocesses neccessary.

Create an OpenAI account navigate to the product section of the website and access the API
key section. You will have to add some money to your account to get an avtive API key. Follow 
the on screen instructions to access your API key and save it to a secure location. As you cant see
it again in the website add your API key to the .env file in the netninja folder where it asks you to add your API key.

For Mail Jet API key create a account and navigate to the developers section of the weboste where you can access the API keys and other neccessary documentation. Add the to the .env file in the userRegistation folder follow the file instructions.

For th MongoDD Atlas create an account and follow the on screen instruction to create your first cluster name it Cluster0. Through the creation it will ask you to create a user for the cluster save the username and password to a secure place you will need the to access the database for read/write functionality. Create a new database within the cluster named user_data and and a collection named userData. The website will have a connect button click on it and then the driver option this is how you will connect to the cluster from the website. You need to choose the json option from the driver screen and copy the MONGO_URI line. Remember to change the sections with user and password with your own credentials. Add this to the .env files that are in the folder these have the URI's already added you need to chsnge them.

Run the requirements.txt files for the python scripts and the package.json files to complete the install of all necessary libraries and dependencies for the nodes.

To initialsie the hole project you need to run the different ports that are required.

Port 3000 for the chatbot run the main.py file it will create a localhost connection for the chatbot.

Registration port 5000 run it from the intergrated temrinal if in VS code right click on the file named TeamProject-userRegistration and open a new terminal with that directory. Then run 'node signupserver.js'.

Login port 5001 run the intergrated terminal as before but ftom the TeamProject-login folder then run 'node logserver.js' 

User managment port 5002 open the intergrated terminal from the netninja file and run 'node userserver.js'


Through this proccess you can local host the entire website.
