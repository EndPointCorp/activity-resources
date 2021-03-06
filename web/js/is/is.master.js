/*
 * Copyright (C) 2014 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * Check for the IS.Configuration object.
 */
if (!IS || !IS.Configuration) {
  console.error("IS.MasterModule depends upon IS.Configuration. Add a WebConfigHandler to your live activity's WebServer and load it before this module.");
}

/**
 * A module for interacting with the IS master.
 * 
 * Depends on the IS.Configuration object served by WebConfigHandler.
 */
angular.module('IS.MasterModule', [])

/**
 * Configuration and constants for the IS master service.
 */
.value('MasterHTTP', {
  Uri: IS.Configuration['lg.master.api.uri'],
  ObjectTypes: {
    LiveActivity: 'liveactivity',
    LiveActivityGroup: 'liveactivitygroup'
  },
  Fields: {
    Result: 'result',
    Data: 'data',
    Message: 'message',
    Name: 'name'
  },
  Results: {
    Success: 'success'
  },
  Commands: {
    List: 'all',
    Startup: 'startup',
    Shutdown: 'shutdown',
    Activate: 'activate',
    Deactivate: 'deactivate'
  }
})

/**
 * A service for sending commands to the IS master.
 * 
 * @author Matt Vollrath <matt@endpoint.com>
 */
.factory('MasterService', ['$http', 'MasterHTTP', function($http, MasterHTTP) {
  /** 
   * Makes a cached HTTP request.
   */
  function makeRequest(uri, callback, opts) {
    callback = callback || null;
    opts = opts || {};

    $http.get(uri, opts)

    .success(function(response, stat) {
      if (response[MasterHTTP.Fields.Result] == MasterHTTP.Results.Success) {
        if (callback) {
          callback(response[MasterHTTP.Fields.Data]);
        }
      } else {
        console.error('Interactive Spaces error from', uri);
        console.error(reponse[MasterHTTP.Fields.Message]);
      }
    })

    .error(function(response, stat) {
      console.error('failed request for', uri);
    });
  }

  /**
   * Get a uri to the master API with the given relative path.
   */
  function uri(path) {
    return MasterHTTP.Uri + '/' + path;
  }

  /**
   * Makes a request for a list of IS objects.
   */
  function getObjects(type, callback) {
    makeRequest(
      uri([type, MasterHTTP.Commands.List+'.json'].join('/')),
      callback,
      { cache: true }
    );
  }

  /**
   * Find an IS object by its name and run the callback if found.
   * 
   * Only the first object with the provided name is processed.
   */
  function getObjectByName(name, type, callback) {
    getObjects(type, function(objects) {
      for (var i in objects) {
        var object = objects[i];

        if (object[MasterHTTP.Fields.Name] == name) {
          callback(object);
          break;
        }
      }
    });
  }

  /**
   * Sends a command to an IS object.
   */
  function sendCommandToObject(object, type, command) {
    makeRequest(
      uri([type, object.id, command+'.json'].join('/'))
    );
  }

  /**
   * Send a command to an IS object by name.
   */
  function sendCommandToObjectByName(name, type, command) {
    getObjectByName(name, type, function(object) {
      sendCommandToObject(object, type, command);
    });
  }

  /**
   * Methods for controlling activities.
   */

  function startupLiveActivityByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivity;
    var command = MasterHTTP.Commands.Startup;

    sendCommandToObjectByName(name, type, command);
  }

  function shutdownLiveActivityByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivity;
    var command = MasterHTTP.Commands.Shutdown;

    sendCommandToObjectByName(name, type, command);
  }

  function activateLiveActivityByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivity;
    var command = MasterHTTP.Commands.Activate;

    sendCommandToObjectByName(name, type, command);
  }

  function deactivateLiveActivityByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivity;
    var command = MasterHTTP.Commands.Deactivate;

    sendCommandToObjectByName(name, type, command);
  }

  function startupLiveActivityGroupByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivityGroup;
    var command = MasterHTTP.Commands.Startup;

    sendCommandToObjectByName(name, type, command);
  }

  function shutdownLiveActivityGroupByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivityGroup;
    var command = MasterHTTP.Commands.Shutdown;

    sendCommandToObjectByName(name, type, command);
  }

  function activateLiveActivityGroupByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivityGroup;
    var command = MasterHTTP.Commands.Activate;

    sendCommandToObjectByName(name, type, command);
  }

  function deactivateLiveActivityGroupByName(name) {
    var type = MasterHTTP.ObjectTypes.LiveActivityGroup;
    var command = MasterHTTP.Commands.Deactivate;

    sendCommandToObjectByName(name, type, command);
  }

  /**
   * Public interface.
   */
  return {
    startupLiveActivityByName: startupLiveActivityByName,
    shutdownLiveActivityByName: shutdownLiveActivityByName,
    activateLiveActivityByName: activateLiveActivityByName,
    deactivateLiveActivityByName: deactivateLiveActivityByName,

    startupLiveActivityGroupByName: startupLiveActivityGroupByName,
    shutdownLiveActivityGroupByName: shutdownLiveActivityGroupByName,
    activateLiveActivityGroupByName: activateLiveActivityGroupByName,
    deactivateLiveActivityGroupByName: deactivateLiveActivityGroupByName
  };
}]);