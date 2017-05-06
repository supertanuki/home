install:
	yarn install
	make build-assets

build-assets:
	node_modules/.bin/webpack
