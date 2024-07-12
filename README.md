# React Native Bike Rental App

This project is part of the take-home assessment for the SWE role at Sirdab.

The app uses React Native, Expo, Clerk for authentication, and Firebase for backend services.

## Features

- **User Authentication**: Integrated with Clerk for secure sign-up, sign-in, and user management.
- **Bicycle Management**: Managers can create, read, update, and delete bicycles.
- **Booking System**: Users can book bicycles based on availability, date, and preferences.
- **Filtering**: Users can filter bicycles based on model, color, location, and ratings.
- **Role-based Access**: The app supports different user roles, providing admin functionality for managers through Clerk publicMetaData.

## Environmental Requirements
To ensure functionality, you need to configure several environment variables:
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key.
- `EXPO_PUBLIC_MANAGER_PASSWORD`: A temporary solution to restricting admin sign up using a secret password.
- `CLERK_SECRET_KEY`: The secret key from Clerk used for server-side operations.
- `FIREBASE_CONFIG`: JSON configuration for Firebase, should include apiKey, authDomain, databaseUrl, projecteId, storageBucket, messagingSenderId, and appId.
- `serviceAccountKey`: Firebase service account credentials for performing secure Firebase operations.
## Installation
1. Clone the Repository
```
git clone https://github.com/mustafataibah/sirdab-app.git
```
2. Install Dependencies
```
cd sirdab-app
npm install
```
3. Start the Application on Ios
```
npm run ios
```
4. Install Server dependencies (Open a new terminal tab and navigate to the sirdab-app/server directory
```
cd server
npm install
```
5. Start the Server
```
npm start
```

## Future Improvements
- **Enhance Security**: Implement a more robust security measure for API interactions
- **UI/UX Enhancements**: Improve the user interface
- **Performance Optimization**: Optimize application for large datasets through sharding and pageinations
- **Cleaning Up**: Divide files into smaller components with some refactoring and possible abstractions

  

