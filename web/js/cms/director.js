angular.module('director', ['ngSanitize'])
 .controller('DirectorController', ['$scope', '$http', function($scope, $http) {
  $scope.groups = [];
  $scope.group = {};
  $scope.presentation = {};
  $scope.scene = {};
  $scope.groupSelected = false;
  $scope.presentationSelected = false;

  $scope.hostname = IS.Configuration['lg.director.hostname'];
  $scope.port     = IS.Configuration['lg.director.port'];

  function DirectorSocket(channel) {
   // Fetch WebSocket URL from LiveActivity configuration.
   resource = IS.Configuration['lg.director.touchscreen.' + channel];
   // TODO: Use a library to consctruct this URL.
   var url = ["ws://",$scope.hostname,':',$scope.port,'/',resource].join("");

   ws = new WebSocket(url);
   ws.onopen = function() {
    console.log("Connected to " + url);
   };
   ws.onmessage = function(message) {
     //console.log("Received data from websocket: " + message.data);
     $scope[channel] = (JSON.parse(message.data));
     $scope.$apply(); // crucial
   };
   return ws;
  };

  function responseHandler(ws) {
   handler = function(data, status, headers, config) {
    data = JSON.stringify(data)
    //console.log(data);
    ws.send(data); };
   return handler;
  }

  var wsScene = new DirectorSocket('scene');
  var wsGroup = new DirectorSocket('group');
  var wsPresentation = new DirectorSocket('presentation');

  $scope.fetch_groups = function() {
   url = $scope.hostname+':'+$scope.port + '/director_api/presentationgroup/';
   $http({method: 'GET', url: url}).success(
    function(data, status, headers, config){
     $scope.groups = data.objects;
     $scope.apply; // may not be needed?
    }
   )
  };

  //TODO Refactor these three functions together.
  $scope.fetch_group = function(resource_uri) {
   url = $scope.host + ':' + $scope.port + '/' + resource_uri;
   console.log("Fetching Group " + url);
   $http({method: 'GET', url: url}).success(responseHandler(wsGroup));
  };
  $scope.$watch('group', function(selected) {
   if (Object.getOwnPropertyNames(selected).length) {
    console.log(selected);
    $scope.groupSelected = true;
   }
  });

  $scope.presentation_back = function() {
   $scope.groupSelected = false;
  }
  $scope.fetch_presentation = function(resource_uri) {
   url = $scope.host + ':' + $scope.port + '/' + resource_uri;
   console.log("Fetching Presentation " + url);
   $http({method: 'GET', url: url}).success(
    responseHandler(wsPresentation));
  };
  $scope.$watch('presentation', function(selected) {
   if (Object.getOwnPropertyNames(selected).length) {
    console.log(selected);
    $scope.presentationSelected = true;
   }
  });

  $scope.scene_back = function() {
   $scope.presentationSelected = false;
  }
  $scope.fetch_scene = function(resource_uri) {
   url = $scope.host + ':' + $scope.port + '/' + resource_uri;
   console.log("Loading Scene " + url);
   $http({method: 'GET', url: url}).success(responseHandler(wsScene));
  };

  $scope.fetch_groups(); // Kick off when loaded to populate screen.
 }]);
