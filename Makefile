all:
	@node_modules/grunt-cli/bin/grunt

docs:
	curl -X POST --data-urlencode content@docs/tire.md -d 'name=Tire&google_analytics=UA-20991800-7' http://documentup.com/compiled > docs/index.html;
	node docs/docs.js;

test:
	@node_modules/grunt-cli/bin/grunt
	@node server.js &
	@echo "\n\033[32mRunning tests\033[39m"
	@echo "-----------------------------------------"
	@phantomjs test/lib/qunit/run-qunit.js "http://localhost:3000/test/index.html"
	@kill -9 `cat test/pid.txt`
	@rm test/pid.txt

release:
	@node_modules/grunt-cli/bin/grunt release

.PHONY: all docs test release
