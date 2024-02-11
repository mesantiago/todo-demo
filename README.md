Introduction
============
A sample program that uses the following technologies:
- [] nodejs
- [] graphql
- [] sequelize (sqlite)
- [] jwt
- [] react
- [] eslint

Installation
------------

- Clone to your machine
- Install Node 18
- Install yarn
```
npm install -g yarn
```

Setup client
------------
- Install the node modules

```
cd client
yarn

```

Setup server
------------
- Install the node modules

```
cd server
yarn

```

Running the program
------------
- Setup and seed data in database

```
cd server
yarn migrate
yarn seed:all
```

- Run the server

```
cd server
yarn start
```

- Run the client

```
cd client
yarn web
```
