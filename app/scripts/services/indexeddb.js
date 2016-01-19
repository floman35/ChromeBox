'use strict';
angular.module('chromeBox')
  .service('Indexddb', function($q, $rootScope) {
    var db;

    // CREATION/UPDATE OF LOCAL DATA BASE
      this.createIndexeddb = function(){
          var deferred = $q.defer();
          var openRequest = indexedDB.open('chromeBox',3);

          openRequest.onupgradeneeded = function(e) {
              console.log('running onupgradeneeded');
              var thisDB = e.target.result;
              e.target.transaction.onerror = indexedDB.onerror;

              if(!thisDB.objectStoreNames.contains('website')) {
                  var objectStore=thisDB.createObjectStore('website', {keyPath: 'id', autoIncrement: true });
                  objectStore.createIndex('url','url', {unique:true});
                  objectStore.createIndex('status','status', {unique:false});
                  objectStore.createIndex('title','title', {unique:false});
                  objectStore.createIndex('date','date', {unique:false});
              }
          };

          openRequest.onsuccess = function(e) {
              console.log('Connected to local database!');
              db = e.target.result;
              deferred.resolve();
          };

          openRequest.onerror = function(e) {
              deferred.reject();
              console.log('Error while connecting to local database');
              console.dir(e);
          };

          return deferred.promise;
      };

    // Get all records
      this.getWebsites = function(){
        var d = $q.defer();
        var transaction = db.transaction(['website'],'readonly');
        var store = transaction.objectStore('website');
        var savedPages=[];
        var site={};

        store.openCursor(null, 'prev').onsuccess = function(e) {
            var cursor = e.target.result;
            if(cursor) {
                site={
                    id:cursor.value.id,
                    url:cursor.value.url,
                    title:cursor.value.title,
                    status:cursor.value.status,
                    date:cursor.value.date
                };
                savedPages.push(site);
                cursor.continue();
            }
        };
        transaction.oncomplete = function () {
            d.resolve(savedPages);
        };
        return d.promise;
      };

    // Check if page's Url is existing
      this.uniqueURL=function(url){
        // Set indexedDB transaction on URL Index
          var t = db.transaction(['website'],'readwrite').objectStore('website'),
              d = $q.defer(),
              checkRequest=t.index('url').get(url);
        // Successfull request
          checkRequest.onsuccess = function(e) {
            var result = e.target.result;
            if(result) {
              // URL not existing - id sent
                console.log('URL existing');
                var key=result.id;
                d.resolve(key);
            }
            else{
              // URL not existing - Null sent
                console.log('URL not existing');
                d.reject(null);
            }
          };
        // Unsuccessfull request
          checkRequest.onerror = function(e) {
            console.log('Error while checking if existing job');
            d.reject(null);
          };
        //Return promise
          return d.promise;
      };

    // Save or update website data
      this.saveWebsite=function(site){
        // Set indexedDB transaction on URL Index
          var d = $q.defer(),
              index=null;

        // Check if Url exists in Local DB
          var unique=this.uniqueURL(site.url);

          unique.then(
          // Url existing
            function(existingId){
              // Init request
                console.log('url existing id: ' + existingId);
                index=findWithAttr($rootScope.websites, 'id', existingId);
                site.id=existingId;
                var t = db.transaction(['website'],'readwrite').objectStore('website'),
                request=t.put(site);

              // Updating site
                request.onsuccess = function() {
                  $rootScope.websites[index]=site;
                  console.log('updated');
                  d.resolve();
                };
          // URL not existing
            },function(){
              var t = db.transaction(['website'],'readwrite').objectStore('website'),
              request=t.add(site);

              // Adding site
                request.onsuccess = function(e) {
                  var IndexedDBdbId=e.srcElement.result;
                  site.id=IndexedDBdbId;
                  console.dir(site);
                  $rootScope.websites.push(site);
                  console.log('Added');
                  d.resolve();
                };
            });

          return d.promise;
      };

    // Change page status (printed/archived)
      this.changeStatus=function(indexedDBId, newStatus){
        //Init
          var d = $q.defer();
          console.log('About to change status on page id: '+indexedDBId +' to '+ newStatus);

        // Define indexedDB
          var transaction = db.transaction(['website'],'readwrite');
          var store = transaction.objectStore('website');

        // fetch page
          store.get(indexedDBId).onsuccess = function(e) {
            // edit status
              var requestedPage = e.target.result;
              requestedPage.status=newStatus;

            // update request
              var request = store.put(requestedPage);

               request.onsuccess = function(e) {
                  var pageIndex=findWithAttr($rootScope.websites, 'id', indexedDBId);
                  $rootScope.websites[pageIndex].status=newStatus;
                  d.resolve(requestedPage);
               };
               request.onerror = function(e) {
                  console.log(e.value);
                  d.reject();
               };

          };

        //Return promise
          return d.promise;
      };

    // Delete page from database
      this.deletePage=function(indexedDBId){
        //Init
          console.log('About to delete page id: '+indexedDBId);
          var deferred = $q.defer();

        // Define delete request
          var transaction = db.transaction(['website'],'readwrite');
          var store = transaction.objectStore('website');
          var request = store.delete(indexedDBId);

        // Execute request - Success
          request.onsuccess = function() {
            console.log('Website id '+indexedDBId+' has been deleted with success');
            var pageIndex=findWithAttr($rootScope.websites, 'id', indexedDBId);
            $rootScope.websites.splice(pageIndex, 1);
            deferred.resolve();
          };

        // Execute request - Error
          request.onerror = function(e) {
              deferred.reject();
              console.log('Error while connecting to local database');
              console.dir(e);
          };

        return deferred.promise;
      };

    // Get object's index from $rootScope.website by attribute value
      function findWithAttr(array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
      }

});
