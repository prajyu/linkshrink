# Link Shrink

An API to shrink your links and makes your url intact.

**[DEMO APP](https://shrinkinglinks.web.app/)**

## API Reference

#### Shrink your URL

```http
  POST /shrink
```

| Parameter | Type   | Description             |
| :-------- | :----- | :---------------------- |
| `body`    | `json` | {url: "your url here" } |

#### Stretch your short URL

```http
  GET /s/${shortUrl}
```

| Parameter  | Type     | Description                     |
| :--------- | :------- | :------------------------------ |
| `shortUrl` | `string` | shortUrl to convert to absolute |

## Run Locally

You need to install mongoDB driver locally or add .env file and credentials of db

```
USER=username
PASSWORD=password
DATABASE=database name
```

Clone the project

```bash
  git clone https://github.com/prajyu/linkshrink.git
```

Go to the project directory

```bash
  cd linkshrink
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## How to build this API 

**[Tutorial](https://dev.to/prajyu/how-to-make-a-url-shortner-1a20)**
