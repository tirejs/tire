all:
	grunt

test:
	node server.js
	
docs:
	curl -X POST --data-urlencode content@docs/tire.md -d 'name=Tire' http://documentup.com/compiled > docs/index.html;
	node docs/docs.js;

.PHONY: all test docs