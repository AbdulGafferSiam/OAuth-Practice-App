### create google+ api

Go to : https://console.developers.google.com/apis
Create project
Create OAuth App
Create credential

### passport package

http://www.passportjs.org/packages/passport-google-oauth20/

### Create mongodb database

### keys.js property


module.exports = {
    google: {
        clientID: '',
        clientSecret: ''
    },
    mongodb: {
        MongoURI: ''
    },
    session: {
        cookieKey: 'AnySecretKey'
    }  
}; 
