// Ionic Starter App

angular.module('brewskey.services').factory('utils', [
  'kegSize',
  function(kegSize) {
    return {
      filterErrors: function(error) {
        if (error && error.data && error.data.ModelState) {
          return _.mapValues(error.data.ModelState, function(values, key) {
            return _.uniq(values);
          });
        } else if (error && error.data && error.data['error_description']) {
          return { generic: error.data['error_description'] };
        } else if (error && error.data && error.data['Message']) {
          return { generic: error.data['Message'] };
        } else {
          return {
            generic:
              "Whoa! Brewskey had an error.  We'll try to get it fixed soon."
          };
        }
      },

      getPercentLeft: function(keg) {
        var startingOunces = kegSize[keg.kegType];

        return Math.max(
          0,
          ((startingOunces - keg.maxOunces - keg.ounces) / startingOunces) * 100
        );
      },

      shouldShowStartPour: true
    };
  }
]);
