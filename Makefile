all: up

up: install
	docker-compose -f docker-compose.yml up -d

install:
	npm --prefix ./back install
	npm --prefix ./front install

down:
	docker-compose -f docker-compose.yml down

test:
	docker-compose -f docker-compose.test.yml up -d
	npm --prefix ./back run test:e2e
	docker-compose -f docker-compose.test.yml down

restart:
	make down
	docker-compose -f docker-compose.yml up -d

seed:
	npm --prefix ./back run db:seed

pauloburro:
	rm -rf ./node_modules/
	rm -rf ./package.json
	rm -rf ./package-lock.json

clean:
	docker-compose -f docker-compose.yml down -v --rmi all --remove-orphans
	rm -rf ./back/node_modules ./back/dist
	rm -rf ./front/node_modules ./front/dist

fclean: clean
	docker system prune --volumes --all --force

re: fclean all

.PHONY: all
