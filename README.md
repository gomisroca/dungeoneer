<p align="center">
  <img src="banner.png" />
</p>


## About
XIV Dungeoneer is a project meant to keep track of what collectibles you are missing from dungeons, trials or raids in the game Final Fantasy XIV.
You can either store your collection locally or log in and store it on your account. If you decide to log in after using the local collection, you can always sync your collections, so no need to worry.

## Built With
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)  
![tRPC](https://img.shields.io/badge/tRPC-%232596BE.svg?style=for-the-badge&logo=tRPC&logoColor=white)  
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)  
  
## Usage
You can run the project in development mode from the main folder with **npm run dev**.

To initialize the database, run **npm run db:push**. 
Optionally, run **npm run db:seed** to seed the database. This will fetch data from *xivapi* and *ffxivcollect* and attach all collectibles to their corresponding sources.

All necessary environment variables can be found in **.env.example**.

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
