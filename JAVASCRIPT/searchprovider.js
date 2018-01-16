'use strict';

/**
 * @ngdoc service
 * @name companyApp.auth
 * @description
 * # SearchProvider
 * Service in the companyApp.
 */
angular.module('companyApp')
    .factory('SearchProviderResolve', function($rootScope, $http, $q, SearchProvider) {
        return { 
            data : {},
            providerDetail : function(providerId) {
                var defer = $q.defer();
                var data = this.data;
                SearchProvider.providerDetail(providerId).then(function(data) {
                    defer.resolve(data);
                },function(responseError){ 
                    
                });
                return defer.promise;
            }
        }
    })
    .service('SearchProvider', function( $rootScope, $http, transformRequestAsFormPost, handleApiResult, companySettings ) {

        var searchProvider   = function( params ) {
            var request = $http({
                method          : "POST",
                url             : companySettings.apiUrl + '/api/search',
                transformRequest: transformRequestAsFormPost,
                data            : params
            });
            return( request.then( handleApiResult.succ, handleApiResult.err ) );
        };

        var getCertificate   = function( params ) {
            var request = $http({
                method          : "GET",
                url             : companySettings.apiUrl + '/secure/api/certificates',
            });
            return( request.then( handleApiResult.succ, handleApiResult.err ) );
        };

        var providerDetail   = function( providerId ) {
            var request = $http({
                method          : "GET",
                url             : companySettings.apiUrl + '/secure/api/provider/view/'+providerId,
            });
            return( request.then( handleApiResult.succ, handleApiResult.err ) );
        };
        
        return({
            searchProvider       : searchProvider,
            getCertificate       : getCertificate,
            providerDetail       : providerDetail
        });
    }
);
