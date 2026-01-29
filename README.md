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
| `/toys/{id}`   | `DELETE` | Delete toy by id |
| `/toys/{id}`   | `PATCH`  | Patch toy by id  |
| `/toys/{id}`   | `PUT`    | Update toy by id |
| `/categories`        | `GET`    | Get all categories     |
| `/categories/{slug}` | `GET`    | Get category by slug  |
| `/categories`        | `POST`   | Add new category      |
| `/categories/{id}`   | `DELETE` | Delete category by id |
| `/brands`        | `GET`    | Get all brands     |
| `/brands/{slug}` | `GET`    | Get brand by slug  |
| `/brands`        | `POST`   | Add new brand      |
| `/brands/{id}`   | `DELETE` | Delete brand by id |

![ERD](/src/asset/toybox-erd.png)
