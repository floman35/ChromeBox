'use strict';
angular.module('chromeBox')
  .controller('popupCtrl', function($q, $scope, $rootScope, $window, $timeout, Indexddb, pdfmakerService) {
    // current webpage var
      $scope.webpage={
        url:'',
        status:status,
        date:null,
        title:'',
        logo:'',
        header:{},
        page:[]
      };

    // Current page handling
      $scope.currentPage={
        getData:function(){
          chrome.tabs.query({'active': true},
          function (tabs) {
            if (tabs.length > 0){
              console.dir('About to get page information');
              chrome.tabs.sendMessage(tabs[0].id, { 'action': 'getData' }, function (response) {
                console.dir(response);
                // Save current page detail in $scope.webpage var
                  $scope.webpage.url=response.page.URL;
                  $scope.webpage.status='saved';
                  $scope.webpage.date=new Date();
                  $scope.webpage.title=response.page.title;
                  $scope.webpage.logo=response.page.logo;
                  angular.copy(response.titles, $scope.webpage.page);
                  $scope.$apply();
                  Indexddb.uniqueURL(response.page.URL).then(function(idCurrentPage){
                    console.dir(idCurrentPage);
                    if(idCurrentPage!==null){
                      console.log('page existing!');
                      $scope.handler.notifyMe('Alert',  'Webpage existing!');
                      $scope.webpage.id=idCurrentPage;
                    }
                  });
                });
              }
          });
        },
        saveData:function(){
          if($scope.webpage.page.lenght!==0){
            var that=this;
            console.dir($scope.webpage);
            Indexddb.saveWebsite($scope.webpage).then(function(){
              if($scope.webpage.id.lenght!==0){
                $scope.handler.notifyMe('Success',  'Webpage was updated!');
              }
              else{
                $scope.handler.notifyMe('Success',  'Webpage was saved in indexedDB !');
              }
              that.init();
            });
          }
        },
        print:function(){
          pdfmakerService.printPDF($scope.webpage);
          $scope.webpage.status='printed';
        },
        init:function(){
          $scope.webpage={
            url:'',
            status:null,
            date:null,
            title:'',
            logo:'',
            header:{},
            page:[]
          };
        }
      };

    // Saved pages handling (indexedDB)
      $scope.handler={
        savedPagesShow:false,
        printedPagesShow:false,
        archivedPagesShow:false,
        notify:{
          show:false,
          title:null,
          text:null
        },
        showSaved:function(){
          this.savedPagesShow=!this.savedPagesShow;
          this.printedPagesShow=false;
          this.archivedPagesShow=false;
        },
        showPrinted:function(){
          this.savedPagesShow=false;
          this.printedPagesShow=!this.printedPagesShow;
          this.archivedPagesShow=false;
        },
        showArchived:function(){
          this.savedPagesShow=false;
          this.printedPagesShow=false;
          this.archivedPagesShow=!this.archivedPagesShow;
        },
        openLink:function(url){
           $window.open(url, '_blank');
        },
        deletePage:function(id){
          Indexddb.deletePage(id).then(function(){
            $scope.handler.notifyMe('Success',  'Webpage deleted from indexedDB');
            console.log('page deleted!');
          });
        },
        changeStatus:function(id, status){
          Indexddb.changeStatus(id, status).then(function(page){
            if(status==='printed'){
              pdfmakerService.printPDF(page);
            }
            if(status==='archived'){
              $scope.handler.notifyMe('Success',  'Webpage is archived');
            }
          });
        },
        notifyMe:function(title, text){
          this.notify.title=title;
          this.notify.text=text;
          this.notify.show=true;
          $timeout(function(){
            $scope.handler.notify.show=false;
           }, 3000);
        }
      };
  });
