all: up

up:
	docker-compose -f docker-compose.yml up -d --build

prod_up:
	docker-compose -f docker-compose.prod.yml up -d --build

install:
	npm --prefix ./back install
	npm --prefix ./front install

down:
	docker-compose -f docker-compose.yml down

prod_down:
	docker-compose -f docker-compose.prod.yml down

test:
	docker-compose -f docker-compose.test.yml up -d
	npm --prefix ./back run test:e2e
	docker kill database-test && docker rm database-test

restart:
	make down
	rm -rf ./back/dist
	rm -rf ./front/dist
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

prod_clean:
	docker-compose -f docker-compose.prod.yml down -v --rmi all --remove-orphans

fclean: clean
	docker system prune --volumes --all --force

rebuild:
	sudo docker-compose -f docker-compose.yml build --no-cache

re: fclean all

.PHONY: all
