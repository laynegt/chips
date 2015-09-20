import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('x-times', 'Integration | Component | x times', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  this.render(hbs`{{x-times}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#x-times}}
      template block text
    {{/x-times}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
