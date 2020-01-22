# Test challenge

Steps to run:

1. Install `mongodb` and companion software. To check data, I used MongoDB Compass Community Edition.

2. Install run-rs:

```bash
   sudo npm install run-rs -g
```

and shut up the mongod service if it runs:

```bash
   sudo /etc/init.d/mongod stop
```

or

```bash
sudo systemctl stop mongodb
```

and run that:

```bash
run-rs --mongod
```

This command execution creates a development cluster and shows connection string you will need to replace in `.env` or `.env.production`. I guess, the last thing will be unnecessary due to default settings should be the same.

Note: By the way, `run-rs` allows to install mongodb, see it's documentations for details.

3. Run the project in dev mode

```bash
yarn start
```

or in production mode

```bash
yarn build && yarn start:prod
```

4. You can check the tests contained in the project. There aren't a lot of them, but the existed cover the bottlenecks. Run

```bash
yarn test
```

5. If you execute **MongoDB Compass**, you will see database named `test_users` with a single collection `users`, and its content. There are only twelve records in it because of the using source of the data, got from API of [https://reqres.in/](reqres.in API).

6. In the project I've used **transactions**, the service method for **periodically updating** the database with the data from an outer resource, the naive approach (but it does present here) for **preventing injection attacks** against the application on both the frontend and the backend, the self-made **form validation** and I guess, the most possible needed that should be taken into account and deal with while developing an application using data.
