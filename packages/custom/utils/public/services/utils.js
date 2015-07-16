'use strict';

//Utils module definition. Used to define whatever util service used on whole backend
var utilapp = angular.module('mean.utils',['ui.bootstrap.datetimepicker','textAngular']);


utilapp.config(['$provide', function($provide){
    $provide.decorator('taTools', ['$delegate', function(taTools){
        taTools.bold.iconclass = 'glyphicon glyphicon-bold';
        taTools.italics.iconclass = 'glyphicon glyphicon-italic';
        delete taTools.underline.iconclass;
        delete taTools.strikeThrough.iconclass;
        taTools.underline.buttontext = 'Underl.';
        taTools.strikeThrough.buttontext = 'Strike';
        taTools.ul.iconclass = 'glyphicon glyphicon-list';
        delete taTools.ol.iconclass;
        taTools.ol.buttontext= 'Numb. list';
        taTools.undo.iconclass = 'glyphicon glyphicon-circle-arrow-left';
        taTools.redo.iconclass = 'glyphicon glyphicon-repeat';
        taTools.justifyLeft.iconclass = 'glyphicon glyphicon-align-left';
        taTools.justifyRight.iconclass = 'glyphicon glyphicon-align-right';
        taTools.justifyCenter.iconclass = 'glyphicon glyphicon-align-center';
        taTools.indent.iconclass = 'glyphicon glyphicon-indent-left';
        taTools.outdent.iconclass = 'glyphicon glyphicon-indent-right';
        taTools.clear.iconclass = 'glyphicon glyphicon-erase';
        taTools.insertLink.iconclass = 'glyphicon glyphicon-link';
        taTools.insertLink.iconclass = 'glyphicon glyphicon-link';
        taTools.insertImage.iconclass = 'glyphicon glyphicon-picture';
        taTools.insertVideo.iconclass = 'glyphicon glyphicon-facetime-video';
        delete taTools.html.iconclass;
        taTools.html.buttontext = 'HTML';
        // there is no quote icon in old font-awesome so we change to text as follows
        delete taTools.quote.iconclass;
        taTools.quote.buttontext = 'Quot.';
        return taTools;
    }]);
}]);
