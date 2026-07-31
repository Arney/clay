'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var fixture = require('../../fixture');

describe('manipulators', function() {

  /**
   * @param {string|Object} itemType
   * @param {*} value
   * @param {*} [expected]
   * @return {void}
   */
  function testSetGet(itemType, value, expected) {
    expected = typeof expected === 'undefined' ? value : expected;

    describe('.set() and .get()', function() {
      it('sets: "' + value + '" and gets: "' + expected + '" then triggers "change"',
      function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayConfig([itemType]).getAllItems()[0];
        clayItem.on('change', handlerSpy);

        clayItem.set(value);
        clayItem.set(value);
        assert.deepEqual(clayItem.get(), expected);
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  /**
   * @param {string|Object} itemType
   * @return {void}
   */
  function testDisable(itemType) {
    describe('.disable()', function() {
      it('disables the field then triggers a "disabled" event', function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('disabled', handlerSpy);
        assert.strictEqual(
          clayItem.$element[0].classList.contains('disabled'),
          false
        );
        clayItem.disable();
        clayItem.disable();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('disabled'),
          true
        );
        assert.strictEqual(clayItem.$manipulatorTarget.get('disabled'), true);
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  /**
   * @param {string|Object} itemType
   * @return {void}
   */
  function testEnable(itemType) {
    describe('.enable()', function() {
      it('enables the field then triggers an "enabled" event', function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('enabled', handlerSpy);

        clayItem.disable();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('disabled'),
          true
        );
        clayItem.enable();
        clayItem.enable();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('disabled'),
          false
        );
        assert.strictEqual(clayItem.$manipulatorTarget.get('disabled'), false);
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  /**
   * @param {string|Object} itemType
   * @return {void}
   */
  function testHide(itemType) {
    describe('.hide()', function() {
      it('hides the field then triggers a "hide" event', function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('hide', handlerSpy);

        assert.strictEqual(
          clayItem.$element[0].classList.contains('hide'),
          false
        );
        clayItem.hide();
        clayItem.hide();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('hide'),
          true
        );
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  /**
   * @param {string|Object} itemType
   * @return {void}
   */
  function testShow(itemType) {
    describe('.show()', function() {
      it('shows the field then triggers a "show" event', function() {
        var handlerSpy = sinon.spy();
        var clayItem = fixture.clayItem(itemType);
        clayItem.on('show', handlerSpy);

        clayItem.hide();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('hide'),
          true
        );
        clayItem.show();
        clayItem.show();
        assert.strictEqual(
          clayItem.$element[0].classList.contains('hide'),
          false
        );
        assert.strictEqual(handlerSpy.callCount, 1, 'handler not called once');
        assert(handlerSpy.calledOn(clayItem), 'handler not called on clayItem');
      });
    });
  }

  describe('html', function() {
    var type = 'text';
    testSetGet(type, 'test123');
    testSetGet(type, '<span>some HTML</span>');
    testShow(type);
    testHide(type);
  });

  describe('button', function() {
    var type = 'button';
    testSetGet(type, 'test123');
    testSetGet(type, '<span>some HTML</span>');
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });

  describe('val', function() {
    let stringInputType = {
      type: 'input',
      serializeValueAs: 'string'
    };

    let integerInputType = {
      type: 'input',
      serializeValueAs: 'integer'
    };

    let stringSelectType = {
      type: 'select',
      defaultValue: 'value-1',
      options: [
        { label: 'label 1', value: '1' },
        { label: 'label 2', value: '2' }],
      serializeValueAs: 'string'
    };

    let integerSelectType = {
      type: 'select',
      defaultValue: 'value-1',
      options: [
        { label: 'label 1', value: '1' },
        { label: 'label 2', value: '2' }],
      serializeValueAs: 'integer'
    };

    testSetGet(stringInputType, 'test321');
    testSetGet(stringInputType, 1234, '1234');
    testSetGet(integerInputType, 'test321', 0);
    testSetGet(integerInputType, 1234);

    testSetGet(stringSelectType, '1');
    testSetGet(stringSelectType, 2, '2');
    testSetGet(integerSelectType, 1);
    testSetGet(integerSelectType, '2', 2);

    testDisable(stringInputType);
    testDisable(integerInputType);
    testDisable(stringSelectType);
    testDisable(integerSelectType);

    testEnable(stringInputType);
    testEnable(integerInputType);
    testEnable(stringSelectType);
    testEnable(integerSelectType);

    testHide(stringInputType);
    testHide(integerInputType);
    testHide(stringSelectType);
    testHide(integerSelectType);

    testShow(stringInputType);
    testShow(integerInputType);
    testShow(stringSelectType);
    testShow(integerSelectType);
  });

  describe('slider', function() {
    var type = {
      type: 'slider',
      min: 0,
      max: 100,
      step: 0.1
    };

    testSetGet(type, '12', 12);
    testSetGet(type, 12);
    testSetGet(type, '12.3', 12.3);
    testSetGet(type, 12.3);
    testSetGet(type, 12.34, 12.3);
    testSetGet(type, '12.34', 12.3);
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });

  describe('checked', function() {
    var type = 'toggle';
    testSetGet({type: type, defaultValue: false}, 1, true);
    testSetGet({type: type, defaultValue: false}, true);
    testSetGet({type: type, defaultValue: true}, 0, false);
    testSetGet({type: type, defaultValue: true}, false);
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });

  describe('radiogroup', function() {
    var stringType = {
      type: 'radiogroup',
      clayId: 1,
      options: [
        { label: '1', value: 'one' },
        { label: '2', value: 'two' },
        { label: '3', value: 'three "quote' },
        { label: '4', value: 4 },
        { label: '5', value: '5 with text after' },
        { label: '5', value: '6.5' }
      ],
      serializeValueAs: 'string'
    };

    var integerType = {
      type: 'radiogroup',
      clayId: 1,
      options: [
        { label: '1', value: 'one' },
        { label: '2', value: 'two' },
        { label: '3', value: 'three "quote' },
        { label: '4', value: 4 },
        { label: '5', value: '5 with text after' },
        { label: '5', value: '6.5' }
      ],
      serializeValueAs: 'integer'
    };

    testSetGet(stringType, 'one');
    testSetGet(stringType, 'two');
    testSetGet(stringType, 'three "quote');
    testSetGet(stringType, '4');
    testSetGet(stringType, '5 with text after');
    testSetGet(stringType, '6.5');
    testSetGet(integerType, 'one', 0);
    testSetGet(integerType, 'two', 0);
    testSetGet(integerType, 'three "quote', 0);
    testSetGet(integerType, 4, 4);
    testSetGet(integerType, '5 with text after', 5);
    testSetGet(integerType, '6.5', 6);
    testDisable(stringType);
    testDisable(integerType);
    testEnable(stringType);
    testEnable(integerType);
    testShow(stringType);
    testShow(integerType);
    testHide(stringType);
    testHide(integerType);
  });

  describe('checkboxgroup', function() {
    var type = {
      type: 'checkboxgroup',
      clayId: 1,
      defaultValue: [true, true, true],
      options: ['First', 'Second', 'Third']
    };
    testSetGet(type, [false, false, true]);
    testSetGet(type, [true, false], [true, false, false]);
    testSetGet(type, [1, 0], [true, false, false]);
    testSetGet(type, [true], [true, false, false]);
    testSetGet(type, [1], [true, false, false]);
    testSetGet(type, [], [false, false, false]);

    // any non-array values should result in all false
    testSetGet(type, false, [false, false, false]);
    testSetGet(type, true, [false, false, false]);
    testSetGet(type, null, [false, false, false]);
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });

  describe('color', function() {
    var type = 'color';
    testSetGet(type, 'FF0000', 0xff0000);
    testSetGet(type, '#FF0000', 0xff0000);
    testSetGet(type, '0xFF0000', 0xff0000);
    testSetGet(type, '#ff0000', 0xff0000);
    testSetGet(type, 0xff0000, 0xff0000);
    testSetGet({type: type, defaultValue: 0x00ff00}, '', 0x000000);
    testSetGet({type: type, defaultValue: 0x00ff00}, false, 0x000000);
    testSetGet({type: type, defaultValue: 0x00ff00}, undefined, 0x000000);
    testDisable(type);
    testEnable(type);
    testShow(type);
    testHide(type);
  });
});
