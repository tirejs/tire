all:
	grunt

test:
	grunt qunit
	
docs:
	curl -X POST --data-urlencode content@docs/tire.md -d 'name=Tire&twitter=frozzare' http://documentup.com/compiled > docs/index.html && open docs/index.html;

.PHONY: all test docs