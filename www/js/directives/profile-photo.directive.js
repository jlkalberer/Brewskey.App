﻿angular.module('tappt.directives')
.directive('profilePhoto', [
'$ionicModal', 'Restangular', '$localStorage', 'cache',
function ($ionicModal, rest, storage, cache) {
    return {
        link: function (scope) {
            scope.isUsersProfile = scope.userName === storage.authDetails.userName;
            scope.cache = cache.value;

            $ionicModal.fromTemplateUrl('templates/photo-select.html', {
                scope: scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                scope.modal = modal;
            });

            scope.selectPhoto = function () {
                if (typeof navigator.camera === "undefined") {
                    return;
                }

                navigator.camera.getPicture(function (image) {
                    scope.image = image;
                    scope.$apply();
                }, function (error) {
                    scope.showError = true;
                }, {
                    correctOrientation: true,
                    destinationType: Camera.DestinationType.DATA_URL,
                    cameraDirection: Camera.Direction.FRONT,
                    saveToPhotoAlbum: false,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                });
            }

            scope.openModal = function () {
                scope.modal.show();
            };

            scope.$on('modal.shown', function () {
                scope.selectPhoto();
            });

            scope.savePhoto = function () {
                rest.one("api/profile").customPUT({ photo: scope.image }, "photo").then(function () {
                    cache.reset();
                    scope.cache = cache.value;
                    setTimeout(function () {
                        scope.closeModal();
                    });
                });
            };

            scope.closeModal = function () {
                scope.image = null;
                scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            scope.$on('$destroy', function () {
                scope.modal.remove();
            });
        },
        scope: {
            userName: '=',
        },
        templateUrl: 'templates/profile-photo.html',
    };
}]);


