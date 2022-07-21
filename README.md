
# Link Shrink

An API to shrink your links and makes your url intact.




## API Reference

#### Shrink your URL

```http
  POST /shrink
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body` | `json` |  {url: "your url here" } |

#### Stretch your short URL

```http
  GET /stretch/${shortUrl}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `shortUrl`      | `string` |  shortUrl to convert to absolute |



## Run Locally

You need to install mongoDB driver locally 

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

