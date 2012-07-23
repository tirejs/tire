all:
	grunt

test:
	node server.js
	
docs:
	curl -X POST --data-urlencode content@docs/tire.md -d 'name=Tire&twitter=frozzare' http://documentup.com/compiled > docs/index.html;
	node docs/docs.js;
	open docs/index.html;

.PHONY: all test docs