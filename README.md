# Project Title: Northcoders News API

## Description
This project is a Node.js API for the **Northcoders News** platform. It serves as a backend service, mimicking a real-world application like Reddit, and provides access to various data, including topics, articles, and comments. The API is built using Express, Node.js, and PostgreSQL, allowing users to interact with and manipulate data programmatically.

## Hosted Version
Check out the live version of the API [here](https://nc-news-905s.onrender.com/api).

## Features
- Retrieve a list of all topics available on the platform.
- Get a list of articles with various filters like topic and author.
- Fetch individual articles with detailed information, including comments and votes.
- Post, update, and delete comments on articles.
- Vote on articles to change their vote count.
- Fully tested API endpoints with error handling.

## Steps to Clone and Run Locally

 **Clone the repository**

    git clone https://github.com/Unamta/Nc-News.git
    cd nc-news-api

## Installation & Setup

Install dependencies

    npm install

Set up the local environment
To connect to both databases locally please create two files in the root directory, one called env.test in this file add PGDATABASE=nc_news_test and the other file called env.development in this file add PGDATABASE=nc_new

.env: For general environment configuration.

    PGDATABASE=nc_new

.env.test: For testing configuration.

    PGDATABASE=nc_news_test
    
Seed the database

    npm run setup-dbs 
    npm run seed

Testing

Testing is done using Jest and Supertest. You can run the tests with:

     npm run test-seed


### Minimum Versions
- **Node.js (v14.0.0 or higher)**
- **PostgreSQL (v12.0 or higher)**

### Acknowledgements

This project was built as part of the Northcoders bootcamp
