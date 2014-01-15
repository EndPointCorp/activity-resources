/*
 ** Copyright 2013 Google Inc.
 **
 ** Licensed under the Apache License, Version 2.0 (the "License");
 ** you may not use this file except in compliance with the License.
 ** You may obtain a copy of the License at
 **
 **    http://www.apache.org/licenses/LICENSE-2.0
 **
 ** Unless required by applicable law or agreed to in writing, software
 ** distributed under the License is distributed on an "AS IS" BASIS,
 ** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ** See the License for the specific language governing permissions and
 ** limitations under the License.
 */

define([], function() {
  var validate = {
    number: function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },

    // validate a Google panoid
    panoid: function(panoid) {
      if (panoid.match(/^[\w-]{22}$/) != null)
        return true;
      else
        return false;
    },

    // validate google.maps.StreetViewPov
    pov: function(pov) {
      if (this.number(pov.heading) && this.number(pov.pitch))
        return true;
      else
        return false;
    },

    // validate a pov string coming from a websocket
    povString: function(povString) {
      if (povString.match(/^[0-9](\.[0-9])?,[0-9](\.[0-9])?$/) != null)
        return true;
      else
        return false;
    },

    // validate an angular field of view object
    fov: function(fov) {
      if (this.number(fov.hfov) && this.number(fov.vfov))
        return true;
      else
        return false;
    }
  };

  return validate;
});
