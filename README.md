# Quacker
Quacker is a social networking service to freely share your thoughts.

## Languages used:
- **Node.js+Express**: Backend
- **CSS**: Style sheet language 
- **MongoDB**: Document-oriented database program
- **EJS**: Embedded Javascript Templating

## Libraries used:
- **Mongoose**: MongoDB object modeling tool for Node.js 
- **Cloudinary**: Image and video management services
- **Passport.js**: Authentication middleware for Node.js
- **Joi.dev**: Data validator for JavaScript

## Routes:

### Post routes ('/posts'):
* **INDEX (GET '/')**: 
    1. Retrieves posts using pagination.
* **CREATE (POST '/')**: 
    1. Checks if the user is logged in.
    2. Validates the body. 
    3. If there are no errors: 
        * Uploads attached images to cloudinary.
        * Uploads the body to the database.
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
        * Uploads the body to the database.
* **GET_UPDATE (GET '/:id/edit'):
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

---
This is greatly inspired by Colt Steele's **The Web Developer Bootcamp 2021**.
