```shell
query FullQuery {
  getAllMembers {
    id
    name
    email
    address
    password 
    orders {
      orderItems {
        item {
          name
          stockQuantity
          category
        }
        count
        orderPrice        
      }
      buyer {
        name
      }
      delivery {
        address
        deliveryStatus
      }
      createdAt
    }
    createdAt
  }
}
```

```shell
query Login {
  login (
    input: {
       email: "example10@email.com"
       password: "password10"
    }
  ){
    accessToken
  }
}
```

```shell
query GetMyOrders{
  getMyOrders {
    id
    orderItems {
      id
      count
      orderPrice
      stockQuantity
      createdAt
      item {
        name
        category
      }
    }
    buyer {
      email
      name
    }
    delivery {
      address
      deliveryStatus
    }
    createdAt
  }
}
```

```shell
mutation PlaceOrder {
  placeOrder (
    input:  {
      address: "배송지14"
      email: "example1@email.com"
      orderItems:  [
        { itemId: 1, orderQuantity: 1 },
        { itemId: 3, orderQuantity: 1 }
      ]
    }
  ){
    buyer {
      name
      address
      email
      password
    }
    delivery {
      address
      deliveryStatus
    }
  }
}
```

```shell
query GetItems {
  getAllItems {
    id
    name
    price
    stockQuantity
    category
  }
}
```

```shell
mutation JoinMember {
  joinMember (
    input:  {
      email: "example6@example.com"
      password: "example6"
      address: "example6 Address"
    }
  ){
   email
   password
   address
  }
}
```

```shell
mutation RegisterItem {
  registerItem (
    input:  {
      name: "item4"
      price: 40000
      category: "category4"
    }
  ){
    name
    price
    category
  }
}
```