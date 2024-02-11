
Introduction
============
A sample program that uses the following technologies:
- [ ] nodejs
- [ ] graphql
- [ ] sequelize (sqlite)
- [ ] jwt
- [ ] react
- [ ] eslint

Installation
------------

- Clone the repository to your machine
- Install **Node 18**
- Install yarn
```
npm install -g yarn
```

Setup and run the client
------------
- Install the node modules

```
cd client
yarn install
yarn web
```

Setup server
------------
On a new terminal
- Install the node modules

```
cd server
yarn
```
- Setup and seed data in database

```
yarn migrate
yarn seed:all
```

- Run the server

```
yarn start
```
