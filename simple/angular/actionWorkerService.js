gameApp
.factory("actionWorkerService", ['$q', function($q){

    var worker = new Worker(URL.createObjectURL(new Blob(
        [soldierJs + robotJs + playerJs + workJs],
        {type: 'application/javascript'}
    )));

    return {
        start : function(callback){
            worker.postMessage(null); 
            worker.addEventListener('message', function(e) {
                callback(e.data);
            });
        }
    };

}]);