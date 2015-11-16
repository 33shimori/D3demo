describe('classifier', function (){
var calssifier, sampledata;
beforeEach(module('main'));
beforeEach (inject(function (_classifier_){
	classifier = _classifier_;
	sample = [{a:1}, {a:2}, {a:3}];
}));

it('should group the data', function (){
	var grouped = classifier(sample, function (d){
		return d.a;
  });
	expect(grouped[0].y).to.equal(1);
	expect(grouped[1].y).to.equal(1);
	expect(grouped[2].y).to.equal(1);
});
it('should group the data in an interval', function (){
	var grouped = classifier(sample, function (d){
		var coeff = 2;
		return Math.round(d.a / coeff) * coeff;
  });
	expect(grouped[0].y).to.equal(2);
	expect(grouped[1].y).to.equal(1);
});
});

/*
describe('springParser', function() {
	var stringParser, logString;
	beforeEach (module("main"));
	beforeEach (inject(function (_stringParser_){
		stringParser = _stringParser_;
	}));
	logString = '::ffff:127.0.0.1 - - [13/Nov/2015:06:00:19 +0000] "GET /files/access.log HTTP/1.1" 200 - "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36"';

	it('should parse the data', function () {
		var parsed= stringParser(logString);
		var mapped = parsed.map(function(d){
			return {
				ip: d[0], time: d[2], request: d[3], status: d[4], agent: d[9]
			};
		})
		//console.log(mapped[0]);
		expect(mapped[0].ip).to.equal('::ffff:127.0.0.1');
		expect(mapped[0].time).to.equal('13/Nov/2015:06:00:19 +0000');
		expect(mapped[0].request).to.equal('GET /files/access.log HTTP/1.1');
		expect(mapped[0].status).to.equal('200');
		expect(mapped[0].agent).to.equal('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36')
	});
});


describe ('simpleHttpLoader', function (){
	var simpleHttpLoader, $httpBackend;

	beforeEach(module('main'));
	beforeEach(inject(function (_simpleHttpLoader_, _$httpBackend_){
		simpleHttpLoader = _simpleHttpLoader_;
		$httpBackend = _$httpBackend_;
		$httpBackend.expect('GET', 'files/access.log')
		.respond('::ffff:127.0.0.1 - - [13/Nov/2015:06:00:19 +0000] "GET /files/access.log HTTP/1.1" 200 - "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36"');
	}));

	afterEach(function () {
		$httpBackend.flush();
	});

	it('#get', function (){
		var accessApacheRegExp = /[0-9]{0,3}\.[0-9]{0,3}\.[0-9]{0,3}\.[0-9]{0,3}\s*-(.*?)-\s*\[(.*?)\]\s*"(.*?)"(.*?)\s*"-"\s*"(.*?)"/gi;

		simpleHttpLoader('files/access.log').then(function(response){
			//console.log(response.data);
			expect(response.data).to.match(accessApacheRegExp);});
	});
});



describe('simpleD3Loader', function () {
	var simpleD3Loader;
	beforeEach (module('main'));

	beforeEach (inject(function(_simpleD3Loader_){
		simpleD3Loader = _simpleD3Loader_;
	}));

	it('exists', function (){
		expect(simpleD3Loader).to.exists;
	});


	it('AccessApacheRegExp', function (done) {
		var accessApacheRegExp = /[0-9]{0,3}\.[0-9]{0,3}\.[0-9]{0,3}\.[0-9]{0,3}\s*-(.*?)-\s*\[(.*?)\]\s*"(.*?)"(.*?)\s*"-"\s*"(.*?)"/gi;
		var resolvedValue;

		simpleD3Loader('/base/test/ng/access.log', function(error, data){
				console.log(data);
			 resolvedValue = data;
			expect(resolvedValue).to.match(accessApacheRegExp);
			done();
		});

	});

});

*/
