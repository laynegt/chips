import Ember from 'ember';
import layout from '../templates/components/poker-chips';

export default Ember.Component.extend({

  layout: layout,

  classNames: ['poker-chips-container'],

  /**
   * Total value represented by the chips. This is the primary interface into
   * the component.
   * @type {Number}
   */
  value: 0,

  _oldValue: 0,

  /**
   * List of default denominations. Using standard casino ones.
   * @type {Array}
   */
  DEFAULT_DENOMINATIONS: [1, 5, 25, 100, 500, 1000, 5000, 25000],

  /**
   * List of possible poker chip denominations. This is customizable
   * @type {Array}
   */
  denominations: null,

  stackHeight: 10,

  // chipDensity?

  init(){
    this._super();
    this.set('denominations', this.get('DEFAULT_DENOMINATIONS'));
  },

  /**
   * Map of chip counts by denomination. This is what primarily drives the
   * visuals.
   * @return {Object}
   */
  addedChips: Ember.computed('value', function(){
    // make marginal changes in chips and then resort
    // TODO how to redistribute?
    var value = this.get('value'),
      oldValue = this.get('_oldValue'),
      diffValue;

    if (oldValue) {
      diffValue = value - oldValue;
    }
    else {
      diffValue = value;
    }
    this.set('_oldValue', value);

    // if no chips, return empty object
    if (!diffValue){
      return [];
    }

    return this.getChipsForValue(diffValue);
  }),

  getChipsForValue(value){
    var chips = [], //chipMap = {},
      remainingValue = value,
      biggestFactorDenomination = null,
      lowestDenomination = this.get('lowestDenomination'),
      highestDenomination = this.get('highestDenomination');

    // get a copy of the sorted denominations, and reverse sort them (in-place)
    // TODO optimize this?
    // TODO stack maximums!?
    this.get('sortedDenominations').slice().reverse().forEach(denom => {
      if (denom > remainingValue) {
        return;
      }
      // skip the biggest possible denomination so we get more chips (unless we
      // are starting at the highest denomination)
      // TODO fix when highest denom removes too many chips
      else if (!biggestFactorDenomination && lowestDenomination !== denom && highestDenomination !== denom) {
        // biggestFactorDenomination = denom;
        // return;
      }

      var numChips = Math.floor(remainingValue / denom);
      for (let i=0; i<numChips; i++){
        chips.push(denom);
      }
      remainingValue = remainingValue % denom;
      // chipMap[denom] = numChips;
    });

    return chips;
  },

  chipArrays: Ember.computed('addedChips', function() {
    var addedChips = this.get('addedChips'),
      stackHeight = this.get('stackHeight'),
      chipArrays = this.get('_oldChipArrays') || Ember.A([]),
      unpushedStack = Ember.isEmpty(chipArrays);

    // find the current stack, either new or from the last add operation
    var currentStack = this.getCurrentStack(),
      stack = currentStack;

    addedChips.forEach(chip => {
      stack.push(chip);
      if (stack.length >= stackHeight) {
        stack.sort((a,b) => (b-a));

        // don't push the stack unless it's new...but you do need to now create a new stack
        if (unpushedStack){
          chipArrays.push(stack);          
        }
        stack = [];

        // just easier to create this
        unpushedStack = true;
      }
    });

    // don't create a new stack w/ remainder if we are reusing a previous stack
    if (unpushedStack && stack.length > 0) {
      stack.sort((a,b) => (b-a));
      chipArrays.push(stack);
    }

    this.set('_oldChipArrays', chipArrays);

    chipArrays.forEach(a => console.log(a));
    console.log('v: ' + this.get('value'));
    console.log('ac: ' + this.get('addedChips'));
    return chipArrays;
  }),

  /**
   * Finds the current stack, either a new one or from the previous add operation
   * @return {Array}
   */
  getCurrentStack() {
    var oldStacks = this.get('_oldChipArrays');

    if (oldStacks){
      var currentStack = oldStacks.get('lastObject');
      if (currentStack.length >= this.get('stackHeight')){
        return [];
      }

      return currentStack;
    }

    return [];
  },

  /**
   * Sort the list of denominations anytime it's updated.
   * @return {Array}
   */
  sortedDenominations: Ember.computed('denominations', function(){
    // NOTE this is an in-place sort
    return this.get('denominations').sort((a,b) => (a-b));
  }),

  lowestDenomination: Ember.computed('sortedDenominations', function(){
    return this.get('sortedDenominations')[0];
  }),

  highestDenomination: Ember.computed('sortedDenominations', function(){
    return this.get('sortedDenominations')[this.get('sortedDenominations.length')-1];
  }),

});
