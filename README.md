# Server

> Server middleware for Expresso

## Summary

- [Server](#server)
  - [Summary](#summary)
  - [What is this](#what-is-this)
  - [Basic usage](#basic-usage)
  - [API](#api)
    - [Options](#options)
    - [Transformers](#transformers)
  - [Envs](#envs)

## What is this

Expresso is opinionated, so this means we export our own server with our own configs, which are basically none. This package exposes a single simple Node HTTP Server in order to bind express to it.

## Basic usage

Install it:

```sh
$ npm i @expresso/server
```

Import and use:

```ts
import { privKey } from './config'
import expresso from '@expresso/app'
import server from '@expresso/server'
import { IExpressoConfigOptions } from '@expresso/app'

interface IAppConfig extends IAuthConfig, IExpressoConfigOptions {}

const appFactory = expresso((app, config: IAppConfig, environment) => {
 // your expresso app
})

server.start(appFactory, { name: 'appname', jwt: { algorithms: ['HS256'], audience: 'audience', issuer: 'your-issuer', secret: privKey } })
```

## API

The server exposes a single `start` method with the following signature:

```ts
async function start<TConfig extends IServerConfig> (appFactory: IExpressoAppFactory<TConfig>, options: TConfig, serverTransformer?: IServerTransformer)
```

The `appFactory` is your expresso app.

### Options

The options object follows this signature:

```ts
export interface IServerConfig {
  name: string
  server?: {
    printOnListening?: boolean
    binding?: {
      ip: string
      port: number
    }
  }
}
```

- **Name:** Server or app name
- **Server (optional)**:
  - **printOnListening (boolean):** Enables or disables the informative text line `Expresso server listening on...`
  - **binding:**
    - **ip (string):** The IP on which the server will bind to
    - **port (number):** The port the server will listen to

### Transformers

The server exposes a `serverTransformer` parameter, this is made in order to allow you to change and customize your server on on the fly. It is a function with the following signature:

```ts
(server: http.Server, config: Required<IServerConfig>): Promise<void>
```

In this function you can modify the `server` object to bind, include or change whatever configuration you need. Since objects are passed as references to functions in JS, there's no need to return it

## Envs

You can also set envs to change the default `PORT` and `HOST` of the server.

- `SERVER_BINDING_PORT` or `PORT`: Will have the same effect as adding `{ server: { binding: { port: xxxx } } }` to your config file
- `SERVER_BINDING_IP` or `HOST`: Will have the same effect as adding `{ server: { binding: { ip: 'xxx.xxx.xxx.xxx' } } }` to your config file
