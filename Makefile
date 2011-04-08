test:
	./support/expresso/bin/expresso -I lib test/*.js
	
deploy:
	git push joyent HEAD:master	

.PHONY: test
