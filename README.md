# FullStack Project 6

React client + NodeJS/Express server + MySQL database for a jsonplaceholder-style REST API.

## Project Structure

- `client/` - React + Vite client.
- `server/` - Express REST API and MySQL query layer.
- `server/db/sql/` - database setup scripts. Run them in order from `01_init.sql` to `07_albums_photos.sql`.

## Setup

1. Create the MySQL database and tables using the SQL files in `server/db/sql/`.
2. Copy `server/.env.example` to `server/.env` and fill in the local MySQL credentials.
3. Install dependencies in both folders if needed:

```bash
cd client
npm install

cd ../server
npm install
```

## Run

Start the server:

```bash
cd server
npm run dev
```

Start the client in a second terminal:

```bash
cd client
npm run dev
```

The client uses `http://localhost:3000` as the API base URL.
