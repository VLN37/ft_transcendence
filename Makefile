all: up

up:
	npm --prefix ./back install
	npm --prefix ./front install
	docker-compose -f docker-compose.yml up -d

down:
	docker-compose -f docker-compose.yml down

test:
	make restart \
	&& echo -e "\nsleeping 10 to allow socket to start..." \
	&& sleep 10 && npm --prefix ./back run test

restart:
	make down
	docker-compose -f docker-compose.yml up -d

clean:
	docker-compose -f docker-compose.yml down -v --rmi all --remove-orphans
	rm -rf ./back/node_modules
	rm -rf ./front/node_modules

fclean: clean
	docker system prune --volumes --all --force

re: fclean all

.PHONY: all
