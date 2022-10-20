# Crawler R Packages

This repository provides a crawler for R packages via Docker-compose.

If you don't prefer to use Docker, please follow back-end/README.md structures.

1. [Install Docker Compose](https://docs.docker.com/compose/install/)

2. Clone the repository
   ```bash
   git clone https://github.com/rahani/crawl_r_packages.git
   ```
3. buil the containers
   ```bash
   docker-compose build
   ```
4. Start the containser
   ```bash
   docker-compose up -d
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

6. Run the crawler
   ```bash
   docker-compose run nodejs dist/commands/RPackagesUpdate
   ```

7. Run Integration tests
   ```bash
    Sorry for the inconvenience, I didn't have time to write unit tests.
   ```
8. Run Unit tests
   ```bash
   Sorry for the inconvenience, I didn't have time to write unit tests.
   ```
9. Close the containers
   ```bash
   docker-compose down
   ```


# Threads
```
set env variable `MAX_UPDATE_THREADS` to change the number of threads.
```

## Data Structure
    {
        PackageName: string;
        Version: string;
        RVersionNeeded?: string;
        Dependencies: string[];
        DateOrPublication: Date;
        Title: string;
        Authors: string[];
        Maintainers: string[];
        License: string;
    }

