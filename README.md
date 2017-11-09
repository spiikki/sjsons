# Simple JSON [database] Server

(c) 2017 Petteri sPiiKKi Sillanpää

## HowTo

Run `docker-compose up`. Open http://localhost:[8080|8082]/api on browser.

You can apply filter with GET-parameters. `api?type=car`

Add items by POSTing a valid JSON-element.

Delete items by DELETE with matching JSON-element.