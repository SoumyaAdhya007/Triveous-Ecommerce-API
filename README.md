# Triveous-Ecommerce-API

- ```Server``` : [https://triveous-ecommerce-api.onrender.com](https://triveous-ecommerce-api.onrender.com)
- ```swagger API Doc``` : [https://triveous-ecommerce-api.onrender.com/api-docs](https://triveous-ecommerce-api.onrender.com/api-docs)

## Features

- Create a new user account 
- User login with credentials
- Get user details 
- Get user addresses 
- Add a new user address 
- Select a user address 
- Get all categories 
- Add a new category 
- Update a category by ID 
- Remove a category by ID 
- Get all products 
- Add a new product 
- Update a product by ID 
- Remove a product by ID 
- Get user cart 
- Add a product to the cart 
- Get order details by ID 
- Place a new order 
- Request return for an order 
- Cancel an order 


# API Routes Documentation

This document provides details about the API routes, including their HTTP methods, parameters, request body, description, and authorization cookie requirements.

| Route                   | Method | Parameters                                   | Request Body                                             | Description                                             | Authorization Cookie |
|-------------------------|--------|----------------------------------------------|----------------------------------------------------------|---------------------------------------------------------|----------------------|
| /user/signup            | POST   | None                                         | JSON object with name, email, password, and phone        | Create a new user account                               | Not required         |
| /user/login             | POST   | None                                         | JSON object with email and password                      | User login with credentials                             | Not required         |
| /user/details           | GET    | None                                         | None                                                     | Get user details                                        | Required             |
| /user/address           | GET    | None                                         | None                                                     | Get user addresses                                      | Required             |
| /user/address/add       | POST   | None                                         | JSON object with pincode, state, city, road_name, isSelected | Add a new user address                                  | Required             |
| /address/select/:id     | POST   | address id                                   | JSON object with pincode, state, city, road_name, isSelected | Select a user address                                   | Required             |
| /category               | GET    | None                                         | None                                                     | Get all categories                                      | Not required         |
| /category/add           | POST   | None                                         | JSON object with category                                | Add a new category                                      | Not required         |
| /category/change/:id    | PATCH  | id                                           | JSON object with updated category                         | Update a category by ID                                 | Not required         |
| /category/remove/:id    | DELETE | id                                           | None                                                     | Remove a category by ID                                 | Not required         |
| /product                | GET    | None                                         | None                                                     | Get all products                                        | Not required         |
| /product/add            | POST   | None                                         | JSON object with title, price, description, availability, categoryId, images | Add a new product                                       | Not required         |
| /product/change/:id     | PATCH  | id                                           | JSON object with payload                                  | Update a product by ID                                  | Not required         |
| /product/remove/:id     | DELETE | id                                           | None                                                     | Remove a product by ID                                  | Not required         |
| /cart                   | GET    | None                                         | None                                                     | Get user cart                                           | Required             |
| /cart/add               | POST   | None                                         | JSON object with productId and quantity                  | Add a product to the cart                               | Required             |
| /order/details/:id      | GET    | id                                           | None                                                     | Get order details by ID                                 | Required             |
| /order/place/:productId | POST   | productId                                    | None                                                     | Place a new order                                       | Required             |
| /order/return/:orderId  | POST   | orderId                                      | None                                                     | Request return for an order                             | Required             |
| /order/cancel/:orderId  | POST   | orderId                                      | None                                                     | Cancel an order                                         | Required             |

Please note that the "Authorization Cookie" column indicates whether the route requires an authorization cookie. If it says "Required," it means the route expects the user to be authenticated with a valid cookie. If it says "Not required," no authentication cookie is necessary to access the route.
