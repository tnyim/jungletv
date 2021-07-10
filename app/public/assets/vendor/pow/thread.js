self.importScripts('pow.js');

var ready = false;

Module['onRuntimeInitialized'] = function() {
    postMessage('ready');
}

onmessage = function(ev)
{
    var PoW = Module.cwrap("launchPoW", 'string', ['string', 'string']);
    var hash = ev.data.hash;
	var target = ev.data.target;
	let generate = PoW(hash, target);
	
	if (generate != undefined && generate != null && generate != "0000000000000000") {
		postMessage(generate); // Worker return
	}
	else
	{
	    postMessage(false);
	}
}
