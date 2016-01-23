/**
 * @fileoverview A wrapper for dicts.
 */

goog.provide('ee.Dictionary');

goog.require('ee.ApiFunction');
goog.require('ee.ComputedObject');
goog.require('ee.Types');



/**
 * Constructs a new Dictionary.
 *
 * @param {Object|ee.ComputedObject=} dict An object to convert to a dictionary.
 *    This constructor accepts the following types:
 *      1) Another dictionary.
 *      2) A list of key/value pairs.
 *      3) A null or no argument (producing an empty dictionary)
 *
 * @constructor
 * @extends {ee.ComputedObject}
 * @export
 */
ee.Dictionary = function(dict) {
  // Constructor safety.
  if (!(this instanceof ee.Dictionary)) {
    return ee.ComputedObject.construct(ee.Dictionary, arguments);
  } else if (dict instanceof ee.Dictionary) {
    return dict;
  }

  ee.Dictionary.initialize();

  /**
   * The internal rerpresentation of this dictionary.
   *
   * @type {Object}
   * @private
   */
  this.dict_;

  if (ee.Types.isRegularObject(dict)) {
    // Cast to a dictionary.
    goog.base(this, null, null);
    this.dict_ = /** @type {Object} */ (dict);
  } else {
    if (dict instanceof ee.ComputedObject && dict.func &&
        dict.func.getSignature()['returns'] == 'Dictionary') {
      // If it's a call that's already returning a Dictionary, just cast.
      goog.base(this, dict.func, dict.args, dict.varName);
    } else {
      // Delegate everything else to the server-side constructor.
      goog.base(this, new ee.ApiFunction('Dictionary'), {'input': dict}, null);
    }
    this.dict_ = null;
  }
};
goog.inherits(ee.Dictionary, ee.ComputedObject);


/**
 * Whether the class has been initialized with API functions.
 * @type {boolean}
 * @private
 */
ee.Dictionary.initialized_ = false;


/** Imports API functions to this class. */
ee.Dictionary.initialize = function() {
  if (!ee.Dictionary.initialized_) {
    ee.ApiFunction.importApi(ee.Dictionary, 'Dictionary', 'Dictionary');
    ee.Dictionary.initialized_ = true;
  }
};


/** Removes imported API functions from this class. */
ee.Dictionary.reset = function() {
  ee.ApiFunction.clearApi(ee.Dictionary);
  ee.Dictionary.initialized_ = false;
};


/**
 * @override
 */
ee.Dictionary.prototype.encode = function(encoder) {
  if (!goog.isNull(this.dict_)) {
    return encoder(this.dict_);
  } else {
    return goog.base(this, 'encode', encoder);
  }
};


/**
 * @override
 */
ee.Dictionary.prototype.name = function() {
  return 'Dictionary';
};
