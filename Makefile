build:
	docker-compose build

clean-build:
	docker-compose build --no-cache

container:
	docker-compose run --rm twitter_bot bash

start:
	npm run start
