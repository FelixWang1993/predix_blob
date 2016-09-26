define(['angular', './sample-module'], function(angular, sampleModule,dropzone) {
		    'use strict';
		    return sampleModule.controller('HistoryFileCtrl', ['$scope','$http', function($scope,$http,$stateParams) {
		    	 var updateLatheStatus = function(){
		    	 	$http.get('/api/blob/v1/blob').success(function(data){
                    $scope.bimages=data;
                    $scope.allBimages=data;
              });
		    	 };

		    	 setInterval(function(){
            $scope.$apply(updateLatheStatus);
        },300000);

        updateLatheStatus();
        $scope.alertShow=false;
        $scope.deleteFile=function(bimage){ 
            if(confirm('comfirm to delete'+bimage+"?")){
              var bimageName = bimage.toString(); 
              bimageName=bimageName.replace(".","@#$");   
              $http({
                 url: '/api/blob/v1/blob/'+bimage,
                 headers: {'Content-Type':undefined},
                 method: 'DELETE',
              }).success( function (){
                  angular.forEach($scope.bimages,function(data,index){
                    if(data.key!=null&&data.key==bimage){
                        $scope.bimages.splice(index,1);
                      }
              });
                alert('Successfully deleted file:' + bimage);
               }).error( function (){
                  alert('Error deleting file: ' + bimage);
                  console.log(request.responseText);
               });
              }
            else{
              return; 
            }
            
        };
        $scope.uploadFile=function(){
            var file = document.querySelector('input[type=file]').files[0];
            var fd = new FormData();
            fd.append("file", file, file.name);

           $http({
               url: 'api/blob/v1/blob',
               data: fd,
               headers: {'Content-Type':undefined},
               transformRequest: angular.identity,
               method: 'POST',
               
           }).success( function ()
             {
              alert('Successfully uploaded file: ' + file.name);

              $scope.bimages.push({"key":file.name});
             }).error( function ()
             {
               alert('Error uploading file: ' + file.name);
               console.log(request.responseText);
             });
        };
        $scope.searchFiles=function(){
          if($scope.bimages.length>0&&$scope.myValue!=""){
              var arrSearchRes=[];
              $scope.bimages.forEach(function(data,index,array){
                  var strFileName=data.key.toString().toLowerCase();
                  if(strFileName.indexOf($scope.myValue.toLowerCase())!=-1){
                      arrSearchRes.push(array[index]);
                  }
              });
              if(arrSearchRes.length>0){
                $scope.alertShow=false;
                $scope.bimages=arrSearchRes;
              }
              else{
                $scope.alertShow=true;
              }
          }
          else{
            $scope.alertShow=false;
            $scope.bimages=$scope.allBimages;
          }
        };
        // $scope.searchFiles=function(){
        //   var searchText=$scope.myValue;
        //   if(searchText!=""){
        //     $http({
        //          url: 'api/blob/v1/blob/'+searchText,
        //          method: 'GET'
        //     }).success( function (data)
        //       { 
        //         console.log(data)
        //         if(data.length>0){
        //           $scope.alertShow=false;
        //           $scope.bimages=data;
        //         }
        //         else{
        //           $scope.alertShow=true;
        //         }
        //       });
        //   }
        //   else{
        //     $scope.$apply(updateLatheStatus);
        //   }
        // };
		  }]);
		});