angular
.module('companyApp')
.controller( 'VirtueController', 
    [ '$rootScope', '$scope', '$q', '$Virtue', '$state', '$timeout', '$filter',
    function ( $rootScope, $scope, $q, $Virtue, $state, $timeout, $filter ) {

    $rootScope.virtueProviderHelper = function( data ){
        $timeout(function() {
            $rootScope.pageLoading = data.loaderShow ? true : false;
            $rootScope.pageLoaded = data.loaderShow ? false : true;
        },0);
        switch( data.call ) {
            case 'logout'                               :   logoutVirtue( data );                           break;
            case 'login'                                :   loginVirtue( data );                            break;
            case 'forgotPassword'                       :   forgotPasswordVirtue( data );                   break;

            case 'getCountry'                           :   getCountryVirtue( data );                       break;
            case 'deleteCountry'                        :   deleteCountryVirtue( data );                    break;
            case 'saveCountry'                          :   saveCountryVirtue( data );                      break;
            
            case 'getState'                             :   getStateVirtue( data );                         break;
            case 'deleteState'                          :   deleteStateVirtue( data );                      break;
            case 'getStateOption'                       :   getStateOptionVirtue( data );                   break;
            case 'saveState'                            :   saveStateVirtue( data );                        break;

            case 'getAllergies'                         :   getAllergiesVirtue( data );                     break;
            case 'deleteAllergies'                      :   deleteAllergiesVirtue( data );                  break;
            case 'saveAllergies'                        :   saveAllergiesVirtue( data );                    break;
            case 'getAllergiesOption'                   :   getAllergiesOptionVirtue( data );               break;
        }
    };
    var virtueResponseSender = function( data ){
        switch( data.callBackController ) {
            case 'login'                    :   $rootScope.loginHelper( data );                     break;
            case 'logout'                   :   $rootScope.logoutHelper( data );                    break;
            case 'country'                  :   $rootScope.countryHelper( data );                   break;
            case 'state'                    :   $rootScope.stateHelper( data );                     break;
            case 'allergies'                :   $rootScope.allergiesHelper( data );                 break;
        }
    };

    var regexReplace = function( val ){
        return val
        .replace( '(', '\\(' )
        .replace( ')', '\\)' )
        .replace( '+', '\\+' )
        ;
    };
    var searchQuery = function( query, pagination ){
        angular.forEach( pagination.filter.match, function( v, k ){
            if( angular.isObject( v ) ){
                angular.forEach( v, function( vi, ki ){
                    if( vi !== "" ){ query.matches( k+'.'+ki, '^.*'+regexReplace( vi ) ); }
                });
            }else{
                if( v !== "" ){ query.matches( k, '^.*'+regexReplace( v ) ); }
            }
        });
        angular.forEach( pagination.filter.equal, function( v, k ){
            if( angular.isObject( v ) ){
                angular.forEach( v, function( vi, ki ){
                    if( vi !== "" ){ query.equalTo( k+'.'+ki, parseInt( vi, 10 ) ); }
                });
            }else{
                if( v !== "" ){ query.equalTo( k, parseInt( v, 10 ) ); }
            }
        });
        angular.forEach( pagination.filter.equalStr, function( v, k ){
            if( angular.isObject( v ) ){
                angular.forEach( v, function( vi, ki ){
                    if( vi !== "" ){ query.equalTo( k+'.'+ki, vi ); }
                });
            }else{
                if( v !== "" ){ query.equalTo( k, v ); }
            }
        });
        angular.forEach( pagination.filter.float, function( v, k ){
            if( angular.isObject( v ) ){
                angular.forEach( v, function( vi, ki ){
                    if( vi !== "" ){ query.equalTo( k+'.'+ki, parseFloat( vi ) ); }
                });
            }else{
                if( v !== "" ){ query.equalTo( k, parseFloat( v ) ); }
            }
        });
        angular.forEach( pagination.filter.date, function( v, k ){
            if( angular.isObject( v ) ){
                angular.forEach( v, function( vi, ki ){
                    if( vi !== "" ){ query.matches( k+'.'+ki, '^.*'+$filter('momentDate')( vi, 'MM/DD/YYYY', 'YYYY-MM-DD' ) ); }
                });
            }else{
                if( v !== "" ){ query.matches( k, '^.*'+$filter('momentDate')( v, 'MM/DD/YYYY', 'YYYY-MM-DD' ) ); }
            }
        });
        angular.forEach( pagination.filter.timeMin, function( v, k ){
            if( angular.isObject( v ) ){
                angular.forEach( v, function( vi, ki ){
                    if( vi !== "" ){ query.equalTo( k+'.'+ki, $filter('convertToMin')( vi ) ); }
                });
            }else{
                if( v !== "" ){ query.equalTo( k, $filter('convertToMin')( v ) ); }
            }
        });
        angular.forEach( pagination.filter.matchMulti, function( v, k ){
            var key = angular.copy( k ).replace(/_/g , ".")+Object.keys( v )[0];
            query.matches( key, '^.*'+v[Object.keys( v )[0]]);
        });
        angular.forEach( pagination.filter.matchMultiLevel, function( v, k ){
            var key = angular.copy( k ).replace(/_/g , ".");
            query.matches( key, '^.*'+regexReplace(v));
        });
        angular.forEach( pagination.filter.exist, function( v, k ){
            if( angular.isObject( v ) ){
                angular.forEach( v, function( vi, ki ){
                    if( vi !== "" ){ query.exists( k+'.'+ki, vi ); }
                });
            }else{
                if( v !== "" ){ query.exists( k, v ); }
            }
        });
        query = ( pagination.order.type == 1 ) ? query.ascending( pagination.order.by ) : query.descending( pagination.order.by );
        return query;
    };
    var pagingQuery = function( query, pagination ){
        query.limit = pagination.limit;
        query.skip = pagination.offset;
        return query;
    };
    var getCountAndData = function( data ){
        var result = '';
        var dataStore = $virtue.DataStore.collection( data.callData.collection, $virtue.DataStoreType.Network );
        var query = new $virtue.Query();
        query = searchQuery( query, data.callData.pagination );
        async.series({
            count: function( callback ){
                var stream = dataStore.count( query, data.callData.pagination.param );
                stream.subscribe(function( count ) {
                    callback( null, count );
                });
            },
            result: function( callback ){
                query = pagingQuery( query, data.callData.pagination );
                dataStore.find( query, data.callData.pagination.param ).subscribe(function( kData ){
                    result = kData;
                },function( kError ){
                    callback( kError, null );
                },function(){
                    callback( null, result );
                });
            },
        },function( err, results ){
            if( err !== null){
                data.returnData = { status: 0, content: err };
                virtueResponseSender( data );
            }else{
                data.returnData = { status: 1, content: results };
                virtueResponseSender( data );
            }
        });
    };
    var deleteData = function( data ){
        var dataStore = $virtue.DataStore.collection( data.callData.collection, $virtue.DataStoreType.Network );
        var promise = dataStore.removeById( data.callData.id );
        promise = promise.then(function( result ) {
            data.returnData = { status: 1, content: result };
            virtueResponseSender( data );
        }).catch(function( error ) {
            data.returnData = { status: 0, content: error };
            virtueResponseSender( data );
        });
    };
    var deleteDataAndFile = function( data ){
        if(data.callData.fileId != ""){
            $virtue.Files.removeById( data.callData.fileId )
            .then(function(uResponse) {
                deleteData(data);
            })
            .catch(function( dError ) {
                deleteData(data);
            });
        }else{
            deleteData(data);
        }
    };
    var saveData = function( data ){
        var dataStore = $virtue.DataStore.collection( data.callData.collection, $virtue.DataStoreType.Network );
        if( !angular.isDefined( data.callData.content._id ) ){
            data.callData.content._acl = getACL( data );
        }
        var promise = dataStore.save( data.callData.content ).then(function onSuccess( kData ) {
            data.returnData = { status: 1, content: kData };
            virtueResponseSender( data );
        }).catch(function onError( kError ) {
            data.returnData = { status: 0, content: kError };
            virtueResponseSender( data );
        });
    };
    var uploadAndSaveData = function( data ){
        var processFor = checkUploadProcess(data);
        async.series({
            uploadFile: function( callbackU ){
                if(processFor == '' || processFor == 'nothing'){
                    delete data.callData.content.resetFile;
                    callbackU( null, true );
                }
                if(processFor == 'remove'){
                    $virtue.Files.removeById( getImageFileId(data) )
                    .then(function(uResponse) {
                        data = resetImageFields(data);
                        callbackU( null, uResponse );
                    })
                    .catch(function( dError ) {
                        callbackU( dError, null );
                    });
                }
                if(processFor == 'replace'){
                    $virtue.Files.removeById( getImageFileId(data) )
                    .then(function(uResponse) {
                        var entity = { "_acl": { "gr": true, "groups": { "w": [] } } };
                        var acl = new $virtue.Acl( entity );
                        acl.addWriterGroup('superAdmin');
                        acl.addWriterGroup('virtueProvider');
                        data.callData.content.uImageFileMeta._acl = acl.toPlainObject();
                        data.callData.content.uImageFileMeta.targetCollection = data.callData.collection;

                        $virtue.Files.upload( data.callData.content.uImageFile, data.callData.content.uImageFileMeta )
                        .then(function( uResponse ) {
                            data = setImageFieldValue(data,uResponse);
                            delete data.callData.content.uImageFileMeta;
                            delete data.callData.content.uImageFile;
                            delete data.callData.content.resetFile;
                            callbackU( null, true );
                        })
                        .catch(function( uError ) {
                            delete data.callData.content.uImageFileMeta;
                            delete data.callData.content.uImageFile;
                            delete data.callData.content.resetFile;
                            callbackU( null, true );
                        });
                    })
                    .catch(function( dError ) {
                        delete data.callData.content.uImageFileMeta;
                        delete data.callData.content.uImageFile;
                        delete data.callData.content.resetFile;
                        callbackU( null, true );
                    });
                }

                if(processFor == 'add'){
                    var entity = { "_acl": { "gr": true, "groups": { "w": [] } } };
                    var acl = new $virtue.Acl( entity );
                    acl.addWriterGroup('superAdmin');
                    acl.addWriterGroup('virtueProvider');
                    data.callData.content.uImageFileMeta._acl = acl.toPlainObject();
                    data.callData.content.uImageFileMeta.targetCollection = data.callData.collection;

                    $virtue.Files.upload( data.callData.content.uImageFile, data.callData.content.uImageFileMeta )
                    .then(function( uResponse ) {
                        data = setImageFieldValue(data,uResponse);
                        delete data.callData.content.uImageFileMeta;
                        delete data.callData.content.uImageFile;
                        delete data.callData.content.resetFile;
                        callbackU( null, true );
                    })
                    .catch(function( uError ) {
                        delete data.callData.content.uImageFileMeta;
                        delete data.callData.content.uImageFile;
                        delete data.callData.content.resetFile;
                        callbackU( null, true );
                    });
                }
            }
        },
        function( fileError, fileResults ) {
            saveData(data);
        });
    };
    var customCall = function( data ){
        $virtue.CustomEndpoint.execute( data.callData.customUrl, data.callData.content )
        .then(function( kData ) {
            data.returnData = { status: 1, content: kData };
            virtueResponseSender( data );
        }).catch(function( kError ) {
            data.returnData = { status: 0, content: kError };
            virtueResponseSender( data );
        });
    };
    
    var complexSearchQuery = function( query, arr ){
        angular.forEach( arr.query, function( v, k ){
            if( v.type === 1 ){
                ( v.append == 1 ) ? query.equalTo( v.field, v.value ) : query.or().equalTo( v.field, v.value );
            }
        });
        angular.forEach( arr.order, function( v, k ){
            if( v.value ) query.descending( v.field ); else query.ascending( v.field );
        });
        return query;
    };
    var complexGetData = function( data ){
        var arr = data.callData.content.collections;
        async.map( arr, function( x, callback ){
            var result = '';
            if( x.calledTab.indexOf( data.callData.content.calledFor ) !== -1 ){
                var dataStore = $virtue.DataStore.collection( x.collection, $virtue.DataStoreType.Network );
                var query = new $virtue.Query();
                if( angular.isDefined( x.field ) ){ query.fields = x.field; }
                query = complexSearchQuery( query, x );
                dataStore.find( query ).subscribe(function( kData ){
                    result = ( x.return ) ? kData : kData[0];
                },function( kError ){
                    callback( kError, null );
                },function(){
                    callback( null, result );
                });
            }else{
                callback( null, result );
            }
        },
        function( err, results ){
            if( err !== null){
                data.returnData = { status: 0, content: err };
                virtueResponseSender( data );
            }else{
                data.returnData = { status: 1, content: results };
                virtueResponseSender( data );
            }
        });
    };
    var complexSaveData = function( data ){
        var arr = data.callData.content;
        async.map( arr, function( x, callback ){
            var result = '';
            var dataStore = $virtue.DataStore.collection( x.collection, $virtue.DataStoreType.Network );
            if( !angular.isDefined( x.data._id ) ){
                x.data._acl = complexGetACL( x, data.callData.user );
            }
            var promise = dataStore.save( x.data ).then(function onSuccess( kData ) {
                callback( null, kData );
            }).catch(function onError( kError ) {
                callback( kError, null );
            });
        },
        function( err, results ){
            if( err !== null){
                data.returnData = { status: 0, content: err };
                virtueResponseSender( data );
            }else{
                data.returnData = { status: 1, content: results };
                virtueResponseSender( data );
            }
        });
    };

    var logoutVirtue = function( data ){
        var promiseLogout = $virtue.User.logout();
        promiseLogout = promiseLogout.then(function onSuccess() {
            data.returnData = {status: 1, content: ''};
            virtueResponseSender( data );
        }).catch(function onError( kError ) {
            data.returnData = {status: 0, content: kError};
            virtueResponseSender( kError );
        });
    };
    var loginVirtue = function( data ){
        $virtue.User.login( data.callData )
        .then(function( kData ) {
            data.returnData = {status: 1, content: kData.data};
            virtueResponseSender( data );
        }).catch(function( kError ) {
            data.returnData = {status: 0, content: kError};
            virtueResponseSender( data );
        });
    };
    var forgotPasswordVirtue = function( data ){
        data.callData.isExist = false;
        data.callData.resetPass = false;
        async.series({
            checkUser: function( callback ){
                var promise = $virtue.User.exists( data.callData.username );
                promise.then(function( kData ) {
                    data.callData.isExist = kData;
                    callback( null, data.callData.isExist );
                }, function( kError ) {
                    callback( kError, null );
                });
            },
            resetPassword: function( callback ){
                if( data.callData.isExist == true ){
                    var promise = $virtue.User.resetPassword( data.callData.username );
                    promise = promise.then(function onSuccess( kData ) {
                        data.callData.resetPass = true;
                        callback( null, kData );
                    }).catch(function onError( kError ) {
                        callback( kError, null );
                    });    
                }else{
                    callback( null, data.callData.resetPass );
                }
            },
        },function( err, results ){
            if( err !== null){
                data.returnData = { status: 0, content: err };
                virtueResponseSender( data );
            }else{
                data.returnData = { status: 1, content: results };
                virtueResponseSender( data );
            }
        });
    };
    //==============================
    // Country
    //==============================
    var getCountryVirtue = function( data ){
        data.callData.collection = 'country';
        getCountAndData( data );
    };
    var deleteCountryVirtue = function( data ){
        data.callData.collection = 'country';
        deleteData( data );  
    };
    var saveCountryVirtue = function( data ){
        data.callData.collection = 'country';
        saveData( data );
    };
    //==============================
    // State
    //==============================
    var getStateVirtue = function( data ){
        data.callData.collection = 'state';
        getCountAndData( data );
    };
    var deleteStateVirtue = function( data ){
        data.callData.collection = 'state';
        deleteData( data );  
    };
    var saveStateVirtue = function( data ){
        data.callData.collection = 'state';
        saveData( data );
    };
    var getStateOptionVirtue = function( data ){
        var result = '';
        var dataStore = $virtue.DataStore.collection( 'country', $virtue.DataStoreType.Network );
        var query = new $virtue.Query();
        dataStore.find( query ).subscribe(function( kData ){
            result = kData;
        },function( kError ){
            data.returnData = { status: 0, content: kError };
            virtueResponseSender( data );
        },function(){
            data.returnData = { status: 1, content: result };
            virtueResponseSender( data );
        });
    };
    
    //==============================
    // userOrder
    //==============================
    var getUserOrderVirtue = function( data ){
        data.callData.collection = 'userOrder';
        getCountAndData( data );
    };
    var deleteUserOrderVirtue = function( data ){
        data.callData.collection = 'userOrder';
        deleteData( data );  
    };
    var saveUserOrderVirtue = function( data ){
        data.callData.collection = 'userOrder';
        saveData( data );
    };
    var getUserOrderOptionVirtue = function( data ){
        var result = '';
        var content = angular.copy( data.callData.content );
        async.parallel({
            servicesPrices: function( callback ){
                if( content.servicesPrices==null || angular.isUndefined( content.servicesPrices ) ){
                    content.servicesPrices = [];
                }
                async.times( Object.keys( content.servicesPrices ).length, function( n, callbacks ){
                    var dataStore = $virtue.DataStore.collection( 'servicePrice', $virtue.DataStoreType.Network );
                    var query = new $virtue.Query();
                    query.fields = [ 'price', 'service' ];
                    query.equalTo( '_id', content.servicesPrices[n]._id );
                    dataStore.find( query ).subscribe(function( kData ){
                        content.servicesPrices[n].price = kData[0].price;
                        content.servicesPrices[n].service = kData[0].service;
                        callbacks( null, content.servicesPrices[n].price );
                    },function( kError ){
                        callbacks( kError, null );
                    },function(){
                        callbacks( null, content.servicesPrices[n].price );
                    });
                }, function( iErr, iIntern ) {
                    if( iErr == null ){
                        callback( iErr, iIntern );
                    }else{
                        data.returnData = {status: 0, content: iErr};
                        virtueResponseSender( data );
                    }
                });
            },
            inOfficeServiceSession: function( callback ){
                if( content.inOfficeServiceSession && angular.isDefined( content.inOfficeServiceSession._id ) ){
                    var dataStore = $virtue.DataStore.collection( 'inOfficeServiceSession', $virtue.DataStoreType.Network );
                    var query = new $virtue.Query();
                    query.equalTo( '_id', content.inOfficeServiceSession._id );
                    dataStore.find( query ).subscribe(function( kData ){
                        content.inOfficeServiceSession = kData[0];
                    },function( kError ){
                        callback( kError, null );
                    },function(){
                        callback( null, content.inOfficeServiceSession );
                    });    
                }else{
                    callback( null, content.inOfficeServiceSession );        
                }
            },
            labOrder: function( callback ){
                if( content.labOrder && angular.isDefined( content.labOrder._id ) ){
                    var dataStore = $virtue.DataStore.collection( 'labOrder', $virtue.DataStoreType.Network );
                    var query = new $virtue.Query();
                    query.equalTo( '_id', content.labOrder._id );
                    dataStore.find( query ).subscribe(function( kData ){
                        content.labOrder = kData[0];
                    },function( kError ){
                        callback( kError, null );
                    },function(){
                        callback( null, content.labOrder );
                    });
                }else{
                    callback( null, content.labOrder );
                }
            },
            prescription: function( callback ){
                if( content.prescription && angular.isDefined( content.prescription._id ) ){
                    var dataStore = $virtue.DataStore.collection( 'prescription', $virtue.DataStoreType.Network );
                    var query = new $virtue.Query();
                    query.equalTo( '_id', content.prescription._id );
                    dataStore.find( query ).subscribe(function( kData ){
                        content.prescription = kData[0];
                    },function( kError ){
                        callback( kError, null );
                    },function(){
                        callback( null, content.prescription );
                    });
                }else{
                    callback( null, content.prescription );
                }
            },
            userSubscription: function( callback ){
                if( content.userSubscription && angular.isDefined( content.userSubscription._id ) ){
                    var dataStore = $virtue.DataStore.collection( 'userSubscription', $virtue.DataStoreType.Network );
                    var query = new $virtue.Query();
                    query.equalTo( '_id', data.callData.userSubscription._id );
                    dataStore.find( query ).subscribe(function( kData ){
                        content.userSubscription = kData[0];
                    },function( kError ){
                        callback( kError, null );
                    },function(){
                        callback( null, content.userSubscription );
                    });
                }else{
                    callback( null, content.userSubscription );
                }
            },
        },function( err, results ){
            if( err !== null){
                data.returnData = { status: 0, content: err };
                virtueResponseSender( data );
            }else{
                data.returnData = { status: 1, content: content };
                virtueResponseSender( data );
            }
        });
    };
}]);