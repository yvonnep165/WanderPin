# Team Member

Yaqi Lyu, Shiqing Pan

# Data Model and Collections

Top level collections  
collection 1: Journals  
collection 2: Notes  
collection 3: Lists  
collection 4: Users

# Necessary Settings

1. firebase index  
   firestore database index - firebase database setting
   (1)Collection id: journals; Fields indexed: visibility ascending, date descending, \_name\_ descending; query scope: Collection
   (2)Collection id: journals; Fields indexed: user ascending, date descending, \_name\_ descending; query scope: Collection

   Note: We've tried to manully make the index first in the firebase database, but it didn't work.  
    The current effective method for us is to run the program first and wait for the Firebase index error to occur. Upon encountering the error, click the URL provided in the error message, and it will automatically generate the required index. Just the save the generated index. This program requires two indexes.

2. google api  
need enable Geocoding api and Places api in Google maps

3. firestore database rules  
   service cloud.firestore {  
     match /databases/{database}/documents {  
       match /{document=**} {  
       	allow read, write: if request.auth != null;  
         allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.user;  
       }  
      
    match /users/{users} {  
    	allow write: if request.auth != null && request.auth.id == resource.data;  
    }  
      
    match /journals/{journal}{  
    allow write, read: if request.auth != null;  
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.user;  
    }  
  }  
}  

# Current State of the application·

screenshot:
https://ibb.co/f2dWgzq

# Individual Contribution

Iteration #1:  
Shiqing Pan:  
completed the Wishlist, WishNote, AddToList and CustomList screens with CRUD operations  
completed layouts for these screens  
implemented navigation for these screens  
created other reusable components

Yaqi Lyu:  
completed the Visited, Visited Journal, Explore screens with CRUD operations  
completed the Profile screen  
completed basic layouts for these screens  
implemented navigation for home and these screens

Iteration #2:  
Shiqing Pan:  
Completed functionalities for the Map screen to get user location and allow user select location on the map  
Allowed transformation between address and coordinates  
Allowed list selection to show on the map further  
Allowed location information passed to wishnote and journalnote  

Yaqi Lyu:  
Completed functions using cameras in the visited notes  
Allowed users to add photos or take photos using their cameras  
Set the first photo of the note as the thumbnail of note

Iteration #3:  
Shiqing Pan:  
Completed the functionalities for authentication and notification  
Updated the rules in firebase and adjusted the firebase helper functions  
Updated styling for wishNote, Add to List and CustomList  
Designed and add a welcome page for the app  

Yaqi Lyu:  
Updated the features for the Profile Screen  
Updated styling for navigation, Visited Journal and Explore cards  
Implemented the process of fetching data from the weather API, saving, updating and displaying weather information  
Updated all user-related features, providing distinct actions based on different user roles

# Link to the Demo Video:  
https://youtu.be/bkJYNCjTLV4
