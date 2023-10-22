const request = require('request');

const smtp = '';
const appkey = '';
const secret = '';

const options = {
	method: 'POST',
	url: 'https://api.emaillabs.net.pl/api/new_sendmail',
	form: {
		smtp_account: smtp,
		to: {
			'pkaspar1@seznam.cz': '',
		},
		subject: 'Just bothering people 6',
		html: '<p>Test</p>',
		txt: 'Test',
		from: 'pkaspar1@seznam.cz',
		from_name: 'Tester'
	},
	headers: {
		'content-type' : 'application/x-www-form-urlencoded',
		'Authorization': 'Basic '+ new Buffer.from(appkey + ":" + secret).toString("base64")
	}
}

request.post(options, function (error, response, body) {
	console.log(body)
});

//'email@domain3.com': [{'email@domain3.com':parseInt(Math.random()*10000,10)+'@domain3.com'}]
