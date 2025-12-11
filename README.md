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
- Production : https://toybox.radityaabi.com

| Endpoint       | HTTP     | Description      |
| -------------- | -------- | ---------------- |
| `/toys`        | `GET`    | Get all toys     |
| `/toys/{slug}` | `GET`    | Get toy by slug  |
| `/toys`        | `POST`   | Add new toy      |
| `/toys`        | `DELETE` | Delete all toys  |
| `/toys/{id}`   | `DELETE` | Delete toy by id |
| `/toys/{id}`   | `PATCH`  | Patch toy by id  |
| `/toys/{id}`   | `PUT`    | Update toy by id |
