export const pow_initiate = function(threads, worker_path): Worker[] {
	if (typeof worker_path == 'undefined') { worker_path = ''; }
	if (isNaN(threads)) { threads = self.navigator.hardwareConcurrency - 1; }
	var workers = [];
	for (let i = 0; i < threads; i++) {
		workers[i] = new Worker(worker_path + 'thread.js');
	}
	return workers;
}

export const pow_terminate = function(workers: Worker[]) {
	var threads = workers.length;
	for (let i = 0; i < threads; i++) {
		workers[i].terminate();
	}
}

export const pow_callback = function(workers: Worker[], hash: string, target: string, ready: () => void, callback: (string) => void) {
	if (hash.length == 64) {
		var threads = workers.length;
		for (let i = 0; i < threads; i++) {
			workers[i].onmessage = function(e) {
				let result = e.data;
				if(result == 'ready') {
				    workers[i].postMessage({
						hash: hash,
						target: target,
					});
				    ready();
				} else if (result !== false && result != "0000000000000000") {
					pow_terminate (workers);
					callback (result); 
				} else workers[i].postMessage({
					hash: hash,
					target: target,
				});
			}
		}
	}
}