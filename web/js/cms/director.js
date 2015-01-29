var director = angular.module('director', ['ngSanitize']);

director.factory('DirectorService',
 ['$rootScope', '$http', function($rootScope, $http) {
  var groups = [];
  var group = {};
  var presentation = {};
  var scene = {};
  var groupSelected = false;
  var presentationSelected = false;

  var hostname = IS.Configuration['lg.director.hostname'];
  var port     = IS.Configuration['lg.director.port'];

  function DirectorSocket(channel) {
   // Fetch WebSocket URL from LiveActivity configuration.
   resource = IS.Configuration['lg.director.touchscreen.' + channel];
   // TODO: Use a library to consctruct this URL.
   var url = ["ws://",hostname,':',port,'/',resource].join("");

   ws = new WebSocket(url);
   ws.onopen = function() {
    console.log("Connected to " + url);
   };
   ws.onmessage = function(message) {
     console.log("Received data from websocket: " + message.data);
     $rootScope.$broadcast(channel, (JSON.parse(message.data)));
     //$scope.$apply(); // still crucial?
   };
   return ws;
  };

  function responseHandler(ws) {
   handler = function(data, status, headers, config) {
    data = JSON.stringify(data)
    console.log(data);
    ws.send(data); };
   return handler;
  }

  var wsScene = new DirectorSocket('scene');
  var wsGroup = new DirectorSocket('group');
  var wsPresentation = new DirectorSocket('presentation');

  function fetch_groups() {
   url = 'http://' + hostname + ':' + port + '/director_api/presentationgroup/';
   $http({method: 'GET', url: url}).success(
    function(data, status, headers, config){
     console.log(data.objects);
     $rootScope.$broadcast('groups', data.objects);
     $rootScope.apply; // may not be needed?
    }
   )
  };

  //TODO Refactor these three functions together.
  function fetch_group(resource_uri) {
   url = host + ':' + port + '/' + resource_uri;
   console.log("Fetching Group " + url);
   $http({method: 'GET', url: url}).success(responseHandler(wsGroup));
  };
/*
  $scope.$watch('group', function(selected) {
   if (Object.getOwnPropertyNames(selected).length) {
    console.log(selected);
    $scope.groupSelected = true;
   }
  });
*/

/*
  $scope.presentation_back = function() {
   $scope.groupSelected = false;
  }
*/
  function fetch_presentation(resource_uri) {
   url = host + ':' + port + '/' + resource_uri;
   console.log("Fetching Presentation " + url);
   $http({method: 'GET', url: url}).success(
    responseHandler(wsPresentation));
  };
/*
  $scope.$watch('presentation', function(selected) {
   if (Object.getOwnPropertyNames(selected).length) {
    console.log(selected);
    $scope.presentationSelected = true;
   }
  });
*/

/*
  function scene_back() {
   $scope.presentationSelected = false;
  }
*/

  function fetch_scene(resource_uri) {
   url = host + ':' + port + '/' + resource_uri;
   console.log("Loading Scene " + url);
   $http({method: 'GET', url: url}).success(responseHandler(wsScene));
  };

  fetch_groups(); // Kick off when loaded to populate screen.
 }]);
