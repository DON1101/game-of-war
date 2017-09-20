gameApp
.factory("gameWorkerService", ['$q', function($q){

    var worker = new Worker(URL.createObjectURL(new Blob(
        [workJs],
        {type: 'application/javascript'}
    )));
    var defer = $q.defer();
    worker.addEventListener('message', function(e) {
      console.log('Worker said: ', e.data);
      defer.resolve(e.data);
    }, false);

    return {
        doWork : function(myData){
            defer = $q.defer();
            worker.postMessage(myData); // Send data to our worker. 
            return defer.promise;
        }
    };

}]);