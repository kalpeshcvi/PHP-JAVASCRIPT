'use strict';

/**
 * @ngdoc function
 * @name companyApp.controller:SearchController
 * @description
 * # SearchController
 * Controller of the companyApp
 */
angular.module('companyApp')
.controller('SearchController',function ( $rootScope, $scope, $state, $filter, SearchProvider, general, $translate, localStorageService, companySettings, $uibModal, $timeout, getCertificates, getGeneralSettingInfo) {
      
    $rootScope.goToCustomSearchAction = function(data){
        if(data.redirection=='goToRegistration'){ $scope.goToRegistration();}
        else if(data.redirection=='viewProvider'){ $scope.chooseTheProvider(data);}
    };

    $scope.init = function(){
        if(localStorageService.get('fromState') && localStorageService.get('fromState')!=''){
            $scope.jobSearchReporter = true;
        }

        $scope.reporters = {};
        $scope.searchReporter = {};
        var date = new Date();

        $scope.searchOptions = { tabActive : true };

        $scope.search = {};
        $scope.search.location = '';
        $scope.search.address = '';
        $scope.search.distance = 100;
        $scope.search.distanceUnit = '';
        $scope.search.method = [];
        $scope.search.category = [];
        $scope.search.certificates = [];
        $scope.search.contactedFor = 1;
        $scope.search.laptopsToAttorneys = 0;
        $scope.search.tablatesToAttorneys = 0;
        $scope.search.notebooksToAttorneys = 0;
        $scope.search.routersHotspots = false;
        $scope.search.realtimeSoftwares = [];
        $scope.search.videoStreamingSoftware = [];
        $scope.search.catSystem = [];
        $scope.search.certifiedNotaryStates = [];
        $scope.search.deliveryType = 1;
        $scope.search.videoStreaming = false;
        $scope.search.interpreter = false;
        $scope.search.transcribed = false;
        $scope.search.telephonic = false;
        $scope.search.certiOnpAffidavit = false;
        $scope.search.waitTime = false;
        $scope.search.negotiableRate = false;
        $scope.search.internationalDepositions = false;
        $scope.search.speciality = [];
        $scope.search.dates = [{'startTime': $filter('date')(moment().hour(9).minute(0).second(0).toDate(), 'yyyy-MM-dd HH:mm'), 'endTime': $filter('date')(moment().hour(17).minute(0).second(0).toDate(), 'yyyy-MM-dd HH:mm')}];
        $scope.search.favorites = false;
        $scope.search.perPageHour = 50;
        $scope.search.copies = 1;
        $scope.search.page = 1;
        $scope.search.simpleSearchAdvance = 0;
        $scope.search.estSearchAdvance = 0;
        $scope.color = {'0' : 'red', '1' : 'orange', '2' : 'yellow', '3' : 'green', '4' : 'cyan'};
        $scope.certification = [];  
        $scope.selectedCertificate = [];
        $scope.selectedCertificate_ = angular.copy($scope.selectedCertificate);
        $scope.prevPage         = 0;
        $scope.nextPage         = 0;
        $scope.totalPages       = 0;
        $scope.totalRecords     = 0;
        $scope.currentPage      = 1;
        $scope.limit            = 12;
        $scope.currentPaging        = {};
        $scope.currentPaging.select = 1;
        var searchedData = {};
        $scope.reporters = {};
        $scope.totalPages       = 0;
        $scope.totalRecords     = 0;
        $scope.currentPage      = 1;
        $scope.limit            = 12;
        
        if(localStorageService.get('searchData')){
            searchedData = localStorageService.get('searchData');
        }

        $scope.getGeneralSettingInfo = getGeneralSettingInfo.data;
        $scope.getGeneralSettingInfo.roughDrafts.unshift({'id':'', 'name': 'Select One'});
        $scope.getGeneralSettingInfo.realtimeConnections.unshift({'id':'', 'name': 'Select One'});
        $scope.getGeneralSettingInfo.provideRealtime.unshift({'id':'', 'name': 'Select One'});
        $scope.getGeneralSettingInfo.laptopsToAttorneys.unshift({'id':'', 'name': 'Select One'});
        $scope.getGeneralSettingInfo.deliveryType.unshift({'id':'', 'name': 'Select One'});
        $scope.getGeneralSettingInfo.tablatesToAttorneys.unshift({'id':'', 'name': 'Select One'});

        $scope.getGeneralSettingInfo.catSystem.unshift({'id':'', 'name': 'Select All'});
        $scope.getGeneralSettingInfo.contactedFor.unshift({'id':'', 'name': 'Select One'});
        $scope.getGeneralSettingInfo.notary.notaryState.unshift({'id':'', 'name': 'Select All'});
        
        $scope.certification = (getCertificates.data && getCertificates.data.records && getCertificates.data.records.length)?getCertificates.data.records:[];
        
        $scope.search = {
            page                        :   (searchedData.page)?searchedData.page:1,
            address                     :   (searchedData.address)?searchedData.address:'',
            distance                    :   (searchedData.distance)?searchedData.distance:100,
            distanceUnit                :   (searchedData.distanceUnit)?searchedData.distanceUnit:'mi',
            method                      :   (searchedData.method && searchedData.method.length>0)?searchedData.method:[],
            category                    :   (searchedData.category && searchedData.category.length>0)?searchedData.category:[],
            contactedFor                :   (searchedData.contactedFor)?searchedData.contactedFor:1,
            favorites                   :   (searchedData.favorites)?searchedData.favorites:false,
            //basicProfile                :   (searchedData.basicProfile)?searchedData.basicProfile:false,
            certificates                :   (searchedData.certificates && searchedData.certificates.length>0)?searchedData.certificates:[],
            simpleSearchAdvance         :   (searchedData.simpleSearchAdvance)?1:0,
            routersHotspots             :   (searchedData.routersHotspots)?searchedData.routersHotspots:false,
            realtimeSoftwares           :   (searchedData.realtimeSoftwares && searchedData.realtimeSoftwares.length>0)?searchedData.realtimeSoftwares:[],
            videoStreamingSoftware      :   (searchedData.videoStreamingSoftware && searchedData.videoStreamingSoftware.length>0)?searchedData.videoStreamingSoftware:[],
            catSystem                   :   (searchedData.catSystem && !angular.isUndefined(searchedData.catSystem))?searchedData.catSystem:[],
            certifiedNotaryStates       :   (searchedData.certifiedNotaryStates && !angular.isUndefined(searchedData.certifiedNotaryStates))?searchedData.certifiedNotaryStates:[],
            deliveryType                :   (searchedData.deliveryType)?searchedData.deliveryType:1,
            estSearchAdvance            :   (searchedData.estSearchAdvance)?1:0,
            laptopsToAttorneys          :   (searchedData.laptopsToAttorneys)?searchedData.laptopsToAttorneys:0,
            notebooksToAttorneys          :   (searchedData.notebooksToAttorneys)?searchedData.notebooksToAttorneys:0,
            tablatesToAttorneys         :   (searchedData.tablatesToAttorneys)?searchedData.tablatesToAttorneys:0,
            videoStreaming              :   (searchedData.videoStreaming)?searchedData.videoStreaming:false,
            interpreter                 :   (searchedData.interpreter)?searchedData.interpreter:false,
            transcribed                 :   (searchedData.transcribed)?searchedData.transcribed:false,
            telephonic                  :   (searchedData.telephonic)?searchedData.telephonic:false,
            certiOnpAffidavit           :   (searchedData.certiOnpAffidavit)?searchedData.certiOnpAffidavit:false,
            waitTime                    :   (searchedData.waitTime)?searchedData.waitTime:false,
            negotiableRate              :   (searchedData.negotiableRate)?searchedData.negotiableRate:false,
            internationalDepositions    :   (searchedData.internationalDepositions)?searchedData.internationalDepositions:false,
            perPageHour                 :   (searchedData.perPageHour)?searchedData.perPageHour:50,
            copies                      :   (searchedData.copies)?searchedData.copies:1,
            limit                       :   $scope.limit,
            roughDrafts                 :   (searchedData.roughDrafts)?searchedData.roughDrafts:0,
            realtimeConnections         :   (searchedData.realtimeConnections)?searchedData.realtimeConnections:0,
            realtimeConnectionsStream   :   (searchedData.realtimeConnectionsStream)?searchedData.realtimeConnectionsStream:0,
            provideRealtime             :   (searchedData.provideRealtime)?searchedData.provideRealtime:0,
            speciality                  :   (searchedData.speciality && searchedData.speciality.length>0)?searchedData.speciality:[],
            dates                       :   (searchedData.dates && searchedData.dates.length>0 && searchedData.dates[0].startTime != '' && searchedData.dates[0].endTime != '')?searchedData.dates:[{'startTime': $filter('date')(moment().hour(9).minute(0).second(0).toDate(), 'yyyy-MM-dd HH:mm'), 'endTime': $filter('date')(moment().hour(17).minute(0).second(0).toDate(), 'yyyy-MM-dd HH:mm')}],
        };
       
        $scope.jobSearchReporter = (localStorageService.get('fromState') && localStorageService.get('fromState')!='')?true:false;
        $scope.chosenReporterArr = [];
        $scope.alreadychosenReporterArr = [];
        if(localStorageService.get('selectedProviders') && localStorageService.get('selectedProviders')!=''){
            $scope.alreadychosenReporterArr = angular.copy(JSON.parse(localStorageService.get('selectedProviders')));
        }
        $scope.allSelect = 0;
        $scope.color = {'0' : 'red', '1' : 'orange', '2' : 'yellow', '3' : 'green', '4' : 'cyan'};
        
        $scope.distanceUnit     = {'mi': "SEARCH.LAND.INFO.DISTANCE_UNIT.MI", 'yd': "SEARCH.LAND.INFO.DISTANCE_UNIT.YD", 'km' : "SEARCH.LAND.INFO.DISTANCE_UNIT.KM"};
        $scope.searchOptions.sliderDist = { value:50, options: {floor: 0, ceil: 100, step: 1, showSelectionBar: true} };
        $scope.searchOptions.minExp = { value:50, options: {floor: 1, ceil: 100, step: 1} };
        $scope.searchReporterData('search');
    };
    
    $scope.repeatElement = function(){
        if($scope.search.dates.length<5){
            $scope.search.dates.push({'startTime':'','endTime':''});
        }
    };

    $scope.removeElement = function(id){
        $scope.search.dates.splice(id, 1);
    };

    $scope.selectAllRealtimeSoft = function(){
        var selection = angular.copy($scope.getGeneralSettingInfo.realtimeSoftSearch);
        angular.forEach(selection, function(value, key) {
            $scope.search.realtimeSoftwares[value.id] = true;
        });
    };

    $scope.selectAllStreamingVideo = function(){
        var selection = angular.copy($scope.getGeneralSettingInfo.StreamingVideoSearch);
        angular.forEach(selection, function(value, key) {
            $scope.search.videoStreamingSoftware[value.id] = true;
        });
    };

    $scope.deliveryTypeChange = function(){
        if($scope.search.deliveryType.indexOf('') !== -1) {
            var selection = angular.copy($scope.getGeneralSettingInfo.deliveryType);
            selection.splice(0, 1);
            var selectedArr = [];
            angular.forEach(selection, function(value, key) {
                selectedArr.push(value.id);
            });
            $scope.search.deliveryType = selectedArr;
        }
    };

    $scope.contactedForChange = function(){
        if($scope.search.contactedFor.indexOf('') !== -1) {
            var selection = angular.copy($scope.getGeneralSettingInfo.contactedFor);
            selection.splice(0, 1);
            var selectedArr = [];
            angular.forEach(selection, function(value, key) {
                selectedArr.push(value.id);
            });
            $scope.search.contactedFor = selectedArr;
        }
    };

    $scope.catSystemChange = function(){
        if($scope.search.catSystem.indexOf('') !== -1) {
            var selection = angular.copy($scope.getGeneralSettingInfo.catSystem);
            selection.splice(0, 1);
            var selectedArr = [];
            angular.forEach(selection, function(value, key) {
                selectedArr.push(value.id);
            });
            $scope.search.catSystem = selectedArr;
        }
    };

    $scope.notaryStateChange = function(){
        if($scope.search.certifiedNotaryStates.indexOf('') !== -1) {
            var selection = angular.copy($scope.getGeneralSettingInfo.notary.notaryState);
            selection.splice(0, 1);
            var selectedArr = [];
            angular.forEach(selection, function(value, key) {
                selectedArr.push(value.id);
            });
            $scope.search.certifiedNotaryStates = selectedArr;
        }
    };

    $scope.goToRegistration = function(){
        $state.go("home.register");
    };

    $scope.chooseTheProvider = function( reporter ){
        if($scope.jobSearchReporter){
            if(reporter.dispaly){
                $filter('filter')($scope.reportersResult, {id: reporter.id})[0].checked = true;
            }else{
                reporter.checked = (reporter.checked)?false:true;    
            }
            $scope.chosenReporterArr = $filter('filter')($scope.reportersResult, {checked: true});
        }
    };

    $scope.selectAllProviders = function( selectState ){
        if($scope.jobSearchReporter){
            angular.forEach($scope.reportersResult, function(v, k) { v.checked = ($scope.allSelect)?false:true; });
            $scope.allSelect = ($scope.allSelect)?false:true;
        }
        $scope.chosenReporterArr = $filter('filter')($scope.reportersResult, {checked: true});
    };

    $scope.viewProviderPopUp = function ( reporterId ){
        if(!$scope.currentUser){
            var modalIstanceData = angular.copy(companySettings.modalData);
            modalIstanceData.origin = 'searchResult';
            $timeout( function(){ $scope.openModal( modalIstanceData )},10);
        }
        else{
            SearchProvider.providerDetail(reporterId).then(
                function(response){
                    var modalDetail = response.data;
                    var selectedProvider = $filter('filter')($scope.reportersResult, {id: reporterId},true)[0];
                    
                    modalDetail.rate = (selectedProvider.expectedRate)?selectedProvider.expectedRate:0;
                    modalDetail.distance = (selectedProvider.distanceScore)?selectedProvider.distanceScore:0;
                    modalDetail.dispaly = 1;
                    modalDetail.jobSearchFlg = ($scope.jobSearchReporter)?1:0;

                    var modalIstanceData = angular.copy(companySettings.modalData);
                    modalIstanceData.origin = 'viewProvider';
                    modalIstanceData.ctrl   = 'viewProviderModalInstanceController';
                    modalIstanceData.view   = 'viewProvider.html';
                    modalIstanceData.size   = 'lg';
                    modalIstanceData.content= modalDetail;
                    
                    $timeout( function(){ $scope.openModal( modalIstanceData )},10);
                },
                function(error){
                    $state.go('home.search',{},{});
                }
            );
        }
    };

    $scope.registrationPopup = function( reporterId ){
        if(!reporterId && $scope.jobSearchReporter){
            var allChosenProvider = getTotalSelectedProviders();
            if(allChosenProvider.length==1){
                localStorageService.set('chosenReporter', allChosenProvider[0]);
            }else{
                localStorageService.set('chosenReporterArr', allChosenProvider);
            }
            $state.go('user.job',{tab : 'autosearch', subTab : ''},{});
        }else{
            if(!$scope.currentUser){
                var modalIstanceData = angular.copy(companySettings.modalData);
                modalIstanceData.origin = 'searchResult';
                $timeout( function(){ $scope.openModal( modalIstanceData )},10);
            }else if($scope.jobSearchReporter){
                var selectedReporter = $.grep($scope.reportersResult, function(e){ return e.id == reporterId; });
                localStorageService.set('chosenReporter', selectedReporter[0]);
                $state.go('user.job',{tab : 'autosearch', subTab : ''},{});
            }    
        }
    };

    $scope.onStartTimeSet = function(dateKey, newDate, oldDate){
        if(oldDate != newDate){
            $scope.search.dates[dateKey].startTime = $filter('date')(newDate, 'yyyy-MM-dd HH:mm');  
        }
    };

    $scope.onEndTimeSet = function(dateKey, newDate, oldDate){
        if(oldDate != newDate){
          $scope.search.dates[dateKey].endTime  = $filter('date')(newDate, 'yyyy-MM-dd HH:mm');
        }
    };
      
    $scope.searchReporterData = function( searchParam ) {
        $("html, body").animate({ scrollTop: 0 }, 1000);
        if($scope.pageMode){
            $scope.pageMode = false;
            var searchData = localStorageService.get('searchData');
            $scope.search = searchData;
        }else{
            $scope.search.distance = $scope.searchOptions.sliderDist.value;
            if(!searchParam){ $scope.search.page = 1; }
            if(!searchParam && (!$scope.search || !$scope.search.address)){
                $scope.reportersError = 'SEARCH.LAND.ERROR.REQUIRED.ADDRESS';
                $timeout(function(){ delete $scope.reportersError; },5000);  
                return false;
            }else if(!$scope.search || !$scope.search.address){
                return false;
            }
        }
        localStorageService.remove('searchData');
        localStorageService.set('searchData', $scope.search);

        var searchData = angular.copy($scope.search);
       
        searchData.certificates = '';
        Object.keys($scope.search.certificates).map(function(k){ if($scope.search.certificates[k]) searchData.certificates=((searchData.certificates)?searchData.certificates+',':'')+k; });

        searchData.category = '';
        Object.keys($scope.search.category).map(function(k){ if($scope.search.category[k]) searchData.category=((searchData.category)?searchData.category+',':'')+k; });
        
        searchData.method = '';
        Object.keys($scope.search.method).map(function(k){ if($scope.search.method[k]) searchData.method=((searchData.method)?searchData.method+',':'')+k; });

        searchData.realtimeSoftwares = '';
        Object.keys($scope.search.realtimeSoftwares).map(function(k){ if($scope.search.realtimeSoftwares[k]) searchData.realtimeSoftwares=((searchData.realtimeSoftwares)?searchData.realtimeSoftwares+',':'')+k; });

        searchData.videoStreamingSoftware = '';
        Object.keys($scope.search.videoStreamingSoftware).map(function(k){ if($scope.search.videoStreamingSoftware[k]) searchData.videoStreamingSoftware=((searchData.videoStreamingSoftware)?searchData.videoStreamingSoftware+',':'')+k; });

        searchData.speciality = '';
        Object.keys($scope.search.speciality).map(function(k){ if($scope.search.speciality[k]) searchData.speciality=((searchData.speciality)?searchData.speciality+',':'')+k; });

        searchData.dates = JSON.stringify($scope.search.dates,null);

        SearchProvider.searchProvider(searchData).then(
        function(response){
            if(response.status_code == 200) {
                if(!response.data || !response.data.pagination) {
                    $scope.currentPage  = 1;
                    $scope.totalPages   = 1;
                    $scope.totalRecords = 0;
                }else{
                    $scope.currentPage      = parseInt(response.data.pagination.currentPageNumber);
                    $scope.totalPages       = response.data.pagination.totalPages;
                    $scope.totalRecords     = response.data.pagination.totalCount;    
                }
                $scope.reportersResult = response.data.rows;
                $scope.reportersLength = (response.data.rows && response.data.rows.length)?response.data.rows.length:0;
                
                if($scope.jobSearchReporter){
                    var selected = 0;
                    var unselected = 0;
                    
                    var alreadychosenReporterArr = angular.copy($scope.alreadychosenReporterArr);
                    angular.forEach($scope.reportersResult, function(value1, key1) {
                        angular.forEach($scope.alreadychosenReporterArr, function(value2, key2) {
                            if (value1.id == value2.id && value2.checked) {
                                value1.checked = true;
                                alreadychosenReporterArr.splice(key2-selected,1);
                                selected++;
                            }
                        });
                    });
                    $scope.allSelect = (selected==$scope.reportersLength)?1:0;
                }
                
                $scope.reporters = [];
                var row;
                for(var i = 0; i < $scope.reportersLength; i++){
                    if(i % 3 == 0){ // every 3rd one we're going to start a new row
                        if(row instanceof Array) $scope.reporters.push(row); // if the row exists add it to the newList
                        row = [] // initalize new row
                    }
                    row.push(response.data.rows[i]); // add each item to the row
                }
                if(row && row.length > 0) $scope.reporters.push(row);

                localStorageService.remove('selectedProviders');
                localStorageService.set('selectedProviders', angular.toJson(alreadychosenReporterArr));
                $scope.alreadychosenReporterArr = [];
                $scope.chosenReporterArr = $filter('filter')($scope.reportersResult, {checked: true});
            }else if(response.status_code == 400){
                $scope.reportersError = (response.message.address)?response.message.address:'SEARCH.LAND.ERROR.REQUIRED.ADDRESS';
                $timeout(function(){ delete $scope.reportersError; },5000);
            }
        },
        function(error){
            $scope.reportersError = (error.message.address)?error.message.address:'SEARCH.LAND.ERROR.REQUIRED.ADDRESS';
            $timeout(function(){ 
                delete $scope.reportersError;
                $scope.reporters = {};  
                $state.go("home.search");
            },5000);
        });
    }

    $scope.pagination   = function( pageMode ) {
        var searchData = localStorageService.get('searchData');
        if( pageMode == 'prev' ) {
            searchData.page = $scope.currentPage - 1;
        } else if( pageMode == 'next' ) {
            searchData.page = $scope.currentPage + 1;
        }else {
            searchData.page = 1;
        }
        localStorageService.set('searchData', searchData);
        
        if(pageMode) {
            if($scope.jobSearchReporter){ getTotalSelectedProviders(); }
            $scope.pageMode = true;
            $scope.searchReporterData('search');
        }
    };

    $scope.datePickerScroll = function(){
        $("html, body").animate({ scrollTop: 300 }, 1000);
    };

    var getTotalSelectedProviders = function(){
        $scope.chosenReporterArr = $filter('filter')($scope.reportersResult, {checked: true});
        var alreadyChosen = [];
        if(localStorageService.get('selectedProviders') && localStorageService.get('selectedProviders')!=''){
            alreadyChosen = angular.copy(JSON.parse(localStorageService.get('selectedProviders')));
        }
        var selectedProviders = [];
        angular.forEach($scope.chosenReporterArr, function(v, k) { 
            selectedProviders.push({id: v.id, name: v.name, distanceScore: v.distanceScore, expectedRate: v.expectedRate, city: v.city, state_abb: v.state_abb, checked: v.checked, certificates: v.certificates});
        });
        var selectedAllProviders = alreadyChosen.concat(selectedProviders);
        $scope.alreadychosenReporterArr = angular.copy(selectedAllProviders);
        localStorageService.remove('selectedProviders');
        localStorageService.set('selectedProviders', angular.toJson(selectedAllProviders));
        return $scope.alreadychosenReporterArr;
    };

    $scope.openRate = function(){
        var modalIstanceData = {
            'ctrl'      : 'RateModalInstanceController', 
            'view'      : 'RatesContent.html', 
            'size'      : 'lg',
            'origin'    : 'deletePastSchedule',
            'windowClass': 'modal-gray',
        };
        $rootScope.openModal( modalIstanceData );
    };

    $scope.openView = function(){
        var modalIstanceData = {
            'ctrl'      : 'ViewModalInstanceController', 
            'view'      : 'ViewsContent.html', 
            'size'      : 'lg',
            'origin'    : 'deletePastSchedule',
            'windowClass': '',
        };
        $rootScope.openModal( modalIstanceData );
    };

    $timeout(function(){ $scope.init(); },1);
});
