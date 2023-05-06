# Quacker
Quacker is a social networking service to freely share your thoughts.

## Languages used:
- **Node.js+Express**: Backend
- **CSS**: Style sheet language 
- **MongoDB**: Document-oriented database program
- **EJS**: Embedded Javascript Templating

## Libraries and services used:
- **Mongoose**: MongoDB object modeling tool for Node.js 
- **Cloudinary**: Image and video management services
- **Passport.js**: Authentication middleware for Node.js
- **Joi.dev**: Data validator for JavaScript

## Models:

### Post properties:
* **body** (String): The body of the post.
* **author** (ObjectID): Reference to the user that created the post.
* **date** (Date): Date of creation.
* **comments** (Array<ObjectID>): Array of references to the comments made on the post.
* **images**: (Array<{ url: String, filename: String}>): Array of images' filenames and urls.

### Comment properties:
* **body** (String): The body of the comment.
* **author** (ObjectID): Reference to the user that created the comment.
* **date** (Date): Date of creation.

### User properties:
* **email** (String): Email of the user, must be unique.
* Password hash: Encrypted password of the user.

## Routes:

### Post routes ('/posts'):
* **INDEX (GET '/')**: 
    1. Retrieves posts using pagination.

* **CREATE (POST '/')**: 
    1. Checks if the user is logged in.
    2. Validates the body. 
    3. If there are no errors: 
        * Uploads attached images to cloudinary.
        * Creates the post.
        * Uploads the post to the database.

* **GET_CREATE (GET '/new')**: 
    1. Checks if the user is logged in.
    2. If there are no errors:
        * Displays the post creation form.

* **SHOW (GET '/:id')**: 
    1. Validates the ID.
    2. If there are no errors:
        * Retrieves the corresponding post.

* **UPDATE (PUT '/:id')**: 
    1. Validates the ID.
    2. Checks if the user is logged in.
    3. Checks if the user is the author of the post.
    4. Validates the body.
    5. If there are no errors:
        * Uploads attached images to cloudinary.
        * Updates the post in the database.

* **GET_UPDATE (GET '/:id/edit')**:
    1. Validates the ID.
    2. Checks if the user is logged in.
    3. Checks if the user is the author of the post.
    4. If there are no errors:
        * Displays the post update form.

* **DELETE (DELETE '/:id')**: 
    1. Validates the ID.
    2. Checks if the user is logged in.
    3. Checks if the is the author of the post.
    4. If there are no errors:
        * Deletes the corresponding post.

### Comment routes ('/posts/:id/comments'):
* **CREATE (POST '/')**:
    1. Checks if the user is logged in.
    2. Validates the body.
    3. If the are no errors:
        * Creates the commnent.
        * Uploads the comment to the database.

* **DELETE (DELETE '/:commentId')**:
    1. Validates the comment's ID.
    2. Checks if the user is logged in.
    3. Checks if the user is the author of the post.
    4. If there are no errors:
        * Deletes the corresponding post.

### User routes ('/'):
* **GET_REGISTER (GET '/register')**:
    1.  Displays the signup form. 

* **REGISTER (POST '/register')**:
    1. Validates the body.
    2. If there are no errors:
        * Creates the user.
        * Uploads the user to the database.
        * Logs the user.

* **GET_LOGIN (GET '/login')**:
    1. Displays the login form.

* **LOGIN (POST '/login')**:
    1. Authenticates the user using Passport.
    2. If there are no errors:
        * Redirects the user to the index view.

* **LOGOUT (GET '/logout')**:
    1. Logs out the user.

---
This is greatly inspired by Colt Steele's **The Web Developer Bootcamp 2021**.
