# Backend Architecture for Meme Gallery

| Planned/Protected Routes |  |
|---|---|
| POST /auth/register | create a new user with username and password, hashes password and saves both username and password to database |
| POST /auth/login | authenticate and return JWT |
| POST /memes | add a new meme (protected) |
| POST /memes/:id/like | like/unlike a meme (protected) |
| UPDATE /memes/:id | update meme (protected) |
| DELETE /memes/:id | delete meme (protected) |


| Models |  |
|---|---|
| User | id, username, password (hashed), role (admin/regular) |
| Meme | id, title, url, userId |
| UserLikesMeme | id, userId, memeId |

## Authentication Flow

1. new users register with username/password

    ```
    Username: memelover22 
    Password: passW0rd11
    ```

 2. passwords are hashed before saving

    ```
    password: passW0rd11 ---> hash function ---> hashed password: $2b$10$eYd0srg8ZhEcf9XbdFKGp.WadQod2z0wzj10P/SX/6KGd.Za9x.9C
    ```

 3. login return JWT with the user’s ID and role encoded

    ```
    {
    "id": 4,
    "username": "memelover22",
    "password": "$2b$10$eYd0srg8ZhEcf9XbdFKGp.WadQod2z0wzj10P/SX/6KGd.Za9x.9C"
    }
    ```

    ```
    Regular users: can create, update, delete their own memes; like/unlike memes.
    Admin users: can delete any meme or user.

    ```

    4. protected routes require: 
    ``` 
    Authorization: Bearer <token> 
    ```
