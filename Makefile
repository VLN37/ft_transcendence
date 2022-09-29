all: up

up:
	npm --prefix ./back install
	npm --prefix ./front install
	npm --prefix ./svelte-typescript-app install
	docker-compose -f docker-compose.yml up -d

down:
	docker-compose -f docker-compose.yml down

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
