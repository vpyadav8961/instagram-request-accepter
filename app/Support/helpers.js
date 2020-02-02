'use strict';
const _ = require('underscore');

let Helpers = {};

Helpers.isJSON = (data)=>{
    try{
        var a = JSON.parse(data);
        return true;
    } catch(e){
        return false
    }
}

module.exports = Helpers;