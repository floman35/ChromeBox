'use strict';
angular.module('chromeBox')
  .run(function($rootScope, Indexddb) {
    $rootScope.websites=[];
    var DB = Indexddb.createIndexeddb();
    DB.then(function(){
      console.log('Indexeddb initialized');
      Indexddb.getWebsites().then(function(savedPages){
        angular.copy(savedPages, $rootScope.websites);
      });
    });
  });
