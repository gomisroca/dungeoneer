<div align="center" id="readme-top">
  <a href="https://github.com/gomisroca/dungeoneer">
    <img src="banner.webp" alt="Logo" width="200" height="130">
  </a>

<h3 align="center">Dungeoneer</h3>

  <p align="center">
  Dungeoneer is a project meant to keep track of what collectibles you are missing from dungeons, trials or raids in the game Final Fantasy XIV. You can either store your collection locally or log in and store it on your account. If you decide to log in after using the local collection, you will be given the option to sync your collections.
    <br />
    <a href="https://github.com/gomisroca/dungeoneer"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://xiv-dungeoneer.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/gomisroca/dungeoneer/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/gomisroca/dungeoneer/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#adjustments">Adjusting the Codebase</a>
      <ul>
        <li><a href="#login-providers">Login Providers</a></li>
        <li><a href="#database-options">Database Options</a></li>
        <li><a href="#image-handling">Image Handling</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
<h2 id="about-the-project">📡 About The Project</h2>

![Dungeoneer Screen Shot](public/screenshot.png)

The project is a web application that allows the tracking of various in-game items in the game Final Fantasy XIV. With this application, you can track of which objects you are missing from dungeons, raids and other types of content, as well as search for specific items.


### Built With
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)  
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Supabase Badge](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff&style=for-the-badge)  
![Zod Badge](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=fff&style=for-the-badge)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)
![Jotai](https://img.shields.io/badge/Jotai-1A202C?style=for-the-badge&logo=jotai&logoColor=white)  
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)  

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- GETTING STARTED -->
<h2 id="getting-started">📋 Getting Started</h2>

Follow these steps to get your own local copy of the project up and running.

<h3 id="prerequisites">Prerequisites</h3>

Make sure you have node.js and npm installed on your machine.
* npm
  ```sh
  npm install npm@latest -g
  ```
Beyond this, if you plan on adjusting the codebase, you might need some knowledge of TypeScript, React, Next.js, Auth.js, Zod or Prisma depending on the changes you want to make.

<h3 id="installation">Installation</h3>

1. Set up your login providers. By default, we use [Discord OAuth](https://discord.com/developers/docs/topics/oauth2). If you want to use different login methods, you will have to adjust the codebase accordingly. More details [here](#login-providers).
2. Set up your database. By default, we use PostgreSQL via Prisma. If you want to use a different database, you will have to adjust the codebase accordingly. More details [here](#database-options).
3. Set up image hosting. By default, we use Supabase Buckets. If you want to use a different image hosting service, you will have to adjust the codebase accordingly. More details [here](#image-hosting).
4. Clone the repo
   ```sh
   git clone https://github.com/gomisroca/dungeoneer.git
   ```
5. Install NPM packages
   ```sh
   npm install
   ```
6. Check `.env.example` and create an `.env` file
   ```js
   DATABASE_URL="postgresql://postgres:password@localhost:5432/dungeoneer"
   DIRECT_URL="postgresql://postgres:password@localhost:5432/dungeoneer"
   etc...
   ```
7. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- USAGE EXAMPLES -->
<h2 id="usage">💠 Usage</h2>

You can run the project in development mode from the main folder with **npm run dev**.  

After initializing the database, run **npm run db:push** to apply the Prisma schema.  
Optionally, run **npm run db:seed** to seed the database with the appropiate ingame data. Please note a very small amount of the data might require adjustments.  

All necessary environment variables can be found in **.env.example**.

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.


<p align="right">[<a href="#readme-top">back to top</a>]</p>


<!-- ADJUSTMENTS -->
<h2 id="adjustments">🔨 Adjusting the Codebase</h2>

  <h3 id="login-providers">🔑 Login Providers</h3>

  By default, we use [Discord OAuth](https://discord.com/developers/docs/topics/oauth2) via [Auth.js](https://authjs.dev).  
  If you wish to keep using Auth.js, you can easily add more login providers to your project. You can read more about how to do this [here](https://authjs.dev/getting-started/installation#configure).  

  However, if you wish to move away from Auth.js, you will have to remove its package and remove *app/api/auth/[...nextauth]* and *server/auth/* (or modify them).
  Then, you can implement your own authentication logic. Depending on the needs of your authentication process, you might need to adjust the database schemas.
  Afterwards, you will want to modify the sign in and out buttons, as well as any instances of 'session' in the codebase.
  
  <h3 id="database-options">💾 Database Options</h3>

  By default, we use PostgreSQL via Prisma. If you wish to use a different relational database, the switch should be mostly trivial, having only to adjust the settings in *prisma/schema.prisma*.

  If you wish to use a non-relational database (e.g. MongoDB), Prisma will help make the transition easier, but you will have to tinker the schema. You can read more about it in this [MongoDB article](https://www.mongodb.com/resources/compare/mongodb-postgresql/dsl-migrating-postgres-to-mongodb) and in the [Prisma documentation](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/mongodb-typescript-mongodb).
  <h3 id="image-handling">🖼️ Image Handling</h3>

  By default we use [Supabase Buckets](https://supabase.com/docs/guides/storage) for image handling. If you want to switch to a different method, you can remove the *prisma/seed_functions/supabase.js* file.

  The implementation of each image hosting method is beyond the scope of this documentation, but easy steps to follow should be provided by the option you choose.

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- ROADMAP -->
<h2 id="roadmap">📍 Roadmap</h2>

- [ ] Improve image optimization
- [ ] Add better filtering options
- [x] Add support for character importing
  - [x] Import what data is available
  - [x] Allow character claiming by logged in users

See the [open issues](https://github.com/gomisroca/dungeoneer/issues) for a full list of proposed features (and known issues).

<p align="right">[<a href="#readme-top">back to top</a>]</p>


<!-- LICENSE -->
<h2 id="license">🔒 License</h2>

Distributed under the MIT License. See `LICENSE.txt` for more information.


<!-- CONTACT -->
<h2 id="contact">📧 Contact</h2>

Adrià Gomis - [@gomisroca](https://github.com/gomisroca) - [gomisroca@gmail.com](mailto:gomisroca@gmail.com)


<p align="right">[<a href="#readme-top">back to top</a>]</p>