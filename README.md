# microservices-architectured-app
An event-driven asynchronous communication based microservices architectured e-commerce app created using express, typescript, nats-streaming and next.js

# What is this ?

It's an e-commerce web app based on micreoservices architecture. The app is broken down into multiple individual services that talk to each other through
publishing events via an event bus. Each service is responsible for handling and implementing a specific feature of the app like auth service handles authentication,
orders service handles orders, payments service implements user payments and all these services work and communicate asynchronously through an event bus(nats-streaming)
to run the entire app

# Why microservices ?

Using microservices pattern and not relying on the monoloith pattern makes the app more durable, fault tolerant, highly available and increases the up time of the app.
So if one of the services crashes, other parts of the app will be functional and available to the users. Microservices and distributed systems is the heart of modren
software and backend engineering.


# Technologies used

- **`Next.js`** for server side rendering and building frontend
- **`Express.js`** is used for building backend
- **`Mongodb`** as database
- **`Mongoose`** as an ORM
- **`Typescript`** , backend is written entirely in typescript to prevent headaches you get when infinte number of events are flowing around with no hints
- **`Stripe`** for handling payments
- **`Jest and Supertest`** for testing 
- **`Docker`** for containerization
- **`Kubernetes`** for conatiner orchestration
- **`Skaffold`** command line tool that facilitates continuous development for Kubernetes-native applications. Makes working with and managing kubernetes 
                  and different kubernetes services and deploymets a lot easier.
- **`NATS Streaming`** is used as an event bus for publisihing and handling the events emiited by different services.
- **`Bull.js`** is a fast and robust queue system. It is used to implement the payment expiration timer.


# App Architecture

The app is divided into 7 services that handle and implement a specific feature and functionality of app:

- `auth` handles the entire app authentication and authorization. JWT and cookie based authentication is used.
- `expiration` handles the payment expiration timer to make sure user pays within a specified time frame. 
- `orders` for handling user orders
- `payments` for handling stripe payments
- `tickets` for handling tickets(creating, updating, fetching). Istead of sellling products, this e-commerce app sells tickets of different live events happening around the city.
- `common` all the common functionality like requireAuth, error handling, and other middlewares and functions shared by different services are grouped together. 
            This service is published as an npm package and installed in other services to be used. 
- `client` handles and implements the frontend of the app.
