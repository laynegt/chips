import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('poker-chips', 'Integration | Component | poker chips', {
  integration: true
});

test('parameter-less', function(assert) {
  assert.expect(2);

  this.render(hbs`{{poker-chips}}`);

  assert.equal(this.$('.poker-chips-container').length, 1);
  assert.equal(this.$('.chip-stack').length, 0);
});

test('1 chip', function(assert) {
  assert.expect(4);

  this.render(hbs`{{poker-chips value=1}}`);

  assert.equal(this.$('.poker-chips-container').length, 1);
  assert.equal(this.$('.chip-stack').length, 1);
  assert.equal(this.$('.poker-chip.d-1').length, 1);
  assert.equal(this.$('.chip-fragment.d-1').length, 10);
});

test('chip distribution - min chips/most efficient', function(assert){
  // 2 chips
  this.render(hbs`{{poker-chips value=2}}`);

  assert.equal(this.$('.chip-stack').length, 1);
  assert.equal(this.$('.poker-chip').length, 2);
  assert.equal(this.$('.poker-chip.d-1').length, 2);

  // skip highest denomination
  this.render(hbs`{{poker-chips value=6}}`);

  assert.equal(this.$('.chip-stack').length, 1);
  assert.equal(this.$('.poker-chip').length, 2);
  assert.equal(this.$('.poker-chip.d-1').length, 1);
  assert.equal(this.$('.poker-chip.d-5').length, 1);

  // 2 used denominations, 1 skipped
  this.render(hbs`{{poker-chips value=31}}`);

  assert.equal(this.$('.chip-stack').length, 1);
  assert.equal(this.$('.poker-chip').length, 3);
  assert.equal(this.$('.poker-chip.d-1').length, 1);
  assert.equal(this.$('.poker-chip.d-5').length, 1);
  assert.equal(this.$('.poker-chip.d-25').length, 1);

  // max denomination, 1 chip
  this.render(hbs`{{poker-chips value=25}}`);

  assert.equal(this.$('.chip-stack').length, 1);
  assert.equal(this.$('.poker-chip').length, 1);
  assert.equal(this.$('.poker-chip.d-25').length, 1);
});

test('add chips incrementally', function(assert){
  this.set('v', 1);
  this.render(hbs`{{poker-chips value=v}}`);

  this.set('v', 5);
  assert.equal(this.$('.chip-stack').length, 1);
  assert.equal(this.$('.poker-chip').length, 5);
  assert.equal(this.$('.poker-chip.d-1').length, 5);
});

test('add chips incrementally, multiple stacks', function(assert){
  this.set('v', 1);
  this.render(hbs`{{poker-chips value=v stackHeight=2}}`);

  this.set('v', 5);
  assert.equal(this.$('.chip-stack').length, 3);
  assert.equal(this.$('.poker-chip').length, 5);
  assert.equal(this.$('.chip-stack:eq(0) .poker-chip').length, 2);
  assert.equal(this.$('.chip-stack:eq(1) .poker-chip').length, 2);
  assert.equal(this.$('.chip-stack:eq(2) .poker-chip').length, 1);

});


// stackHeight tests

// denominations tests
