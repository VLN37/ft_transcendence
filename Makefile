all: up

up: install
	docker-compose -f docker-compose.yml up -d

install:
	npm --prefix ./back install
	npm --prefix ./front install

down:
	docker-compose -f docker-compose.yml down

test:
	make restart \
	&& docker-compose -f docker-compose.test.yml up -d \
	&& echo -e "\nsleeping 10 to allow socket to start..." \
	&& sleep 10 && npm --prefix ./back run test friends
	docker-compose -f docker-compose.test.yml down

restart:
	make down
	docker-compose -f docker-compose.yml up -d

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
