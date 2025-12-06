# ToyBox

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

## API Documentation

- Local: http://localhost:3000
- Production (choose one): https://toybox.radityaabi.com

| Endpoint       | HTTP     | Description       |
| -------------- | -------- | ----------------- |
| `/toys`        | `GET`    | Get all items     |
| `/toys/{slug}` | `GET`    | Get item by slug  |
| `/toys`        | `POST`   | Add new item      |
| `/toys`        | `DELETE` | Delete all items  |
| `/toys/{id}`   | `DELETE` | Delete item by id |
| `/toys/{id}`   | `PATCH`  | Patch item by id  |
| `/toys/{id}`   | `PUT`    | Update item by id |
