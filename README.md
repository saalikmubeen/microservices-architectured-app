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
- `infra`  manages all the kubernets deployment and service .yaml files that run run the app


# Kubernetes and Docker Architecture

Each service, mogongodb database and nats-streaming server is dockerized as a docker container. The docker conatiners are managed and orchestrated by their respective kubernetes deployment.yaml files inside infra directory. The communication between different kuberentes deployments is governed by service ObjectType.
Finally ingress-service, uses ingress-nginx, an Ingress controller for Kubernetes using NGINX as a reverse proxy to proxy or direct incoming requests to their
respective services under the `ticketing.dev` hostname. Skaffold is used to get all the kubernetes deployments and services up and running with a single command 
`skaffold dev` which uses skaffold.yaml.


#  Installation 

Getting this project up and running on your local machine is a notoriously dfficult task. It requires some knowlege of docker and kubernetes ecosystem. If you 
are still up for challenge, or if you don't have a life, try getting it work. Make sure you have docker, kubernetes and skaffold installed. Set the required envirenmental variables and run the following command:

```
skaffold dev
```

And boom app will be up and running, extra setup and dependencies required.

To delete any resources deployed by Skaffold and stop all the deployments, services and containers run 

```
skaffold delete
```

# ⚡WARNING⚡

Try running and testing it locally only if you consider yourself a senior developer 👍. Otherwise I'm not the one to blame for you scratching your head 😫
while trying to understand this microservices mess of event-driven communication between the services 😑
