# This is car store server.

### if you want to run in this locally then please follow the procedure

## Step 1

First open terminal clone the link git repo.

```
https://github.com/JPChoyon/car-store-server.git
```

## Step 2

Now open folder in vs code.

## Step 3

Now run this command in terminal.

```cmd
yarn install
```

## Step 4

create .env file in #root and pase the data in that file

```
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://jpchoyonkhan65:ZJUIJYX7bNCmY8JO@cluster1.fycfdwn.mongodb.net/car-store-mongoose?retryWrites=true&w=majority&appName=Cluster1
```

## Step 5

For run the server

```
yarn dev
```

### **Project Implementation Technology:**

- `typescript`, `node js` , `express js`, `mongoose` etc
- Using `zod` for validation data.
- Implement CRUD operations.
- Using Mongoose for schema definition and data operations.

## Examples

### Car routes

- Create car data : `localhost:5000/api/cars`
  method: `post`
- Get all car data : `localhost:5000/api/cars`
  method: `get`
- Get A Car data : `localhost:5000/api/cars/:carId`
  method: `get`
- Update A Car data : `localhost:5000/api/cars/:carId`
  method: `put`
- delete Car data : `localhost:5000/api/cars/:carId`
  method: `delete`

### order routes

- Create order data : `localhost:5000/api/orders`
  method: `post`
- Get all order data : `localhost:5000/api/orders`
  method: `get`
- Get A order data : `localhost:5000/api/orders/:orderId`
  method: `get`
- Update A order data : `localhost:5000/api/orders/:orderId`
  method: `put`
- delete order data : `localhost:5000/api/orders/:carId`
  method: `delete`

### Revenue Routes

- Get Revenue data : `localhost:5000/api/orders/revenue`
  method: `get`
