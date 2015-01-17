PATH := $(PWD)/node_modules/.bin:$(PATH)

.PHONY: bundle clean relink disc

bundle: build/bundle.min.js build/splash.min.js

clean:
	rm -rf build/*.js build/*.json data/*.md

disc:
	browserify src/index.js src/splash.js --full-paths | uglifyjs -c | discify --open

start: relink build/examples.json
	wzrd src/index.js:build/bundle.min.js \
	     src/splash.js:build/splash.min.js

relink:
	district stackgl splash-grid

postinstall: relink
	scoped-bulk stackgl npm install
	npm dedupe

build/:
	mkdir build

build/bundle.min.js: build/ build/examples.json
	browserify src/index.js | uglifyjs -c > build/bundle.min.js

build/splash.min.js: build/ build/examples.json
	browserify src/splash.js | uglifyjs -c > build/splash.min.js

build/examples.json: build/ data/examples.md
	node data/regenerate

data/examples.md: build/
	node data/sync
