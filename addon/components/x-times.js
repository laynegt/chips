import Ember from 'ember';
import layout from '../templates/components/x-times';

export default Ember.Component.extend({

  layout: layout,

  times: 1,

  timesArray: Ember.computed('times', function(){
    var a = [], times = this.get('times');
    for (var i=0; i<times; i++){
      a.push(1);
    }
    return a;
  })

});
