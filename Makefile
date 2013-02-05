all:
	@node_modules/grunt/bin/grunt

test:
	node server.js

docs:
	curl -X POST --data-urlencode content@docs/tire.md -d 'name=Tire&google_analytics=UA-20991800-7' http://documentup.com/compiled > docs/index.html;
	node docs/docs.js;

.PHONY: all test docs
