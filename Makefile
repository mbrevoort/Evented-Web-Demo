test:
	./support/expresso/bin/expresso -I lib test/*.js
	
deploy:
	git push joyent HEAD:master	
	
restart:
	ssh node@mbrevoort.no.de 'node-service-restart'
	
log:
	ssh node@mbrevoort.no.de 'node-service-log'
    
.PHONY: test
