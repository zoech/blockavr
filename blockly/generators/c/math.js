Blockly.C['math_number'] = function(block) {
  // Numeric value.
  var code = parseInt(block.getFieldValue('NUM'));
  var order = code < 0 ? Blockly.C.ORDER_NUMBER_SIGN :
              Blockly.C.ORDER_ATOMIC;
  return [code, order];
};

Blockly.C['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.C.ORDER_ADDITIVE],
    'MINUS': [' - ', Blockly.C.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', Blockly.C.ORDER_MULTIVE],
    'DIVIDE': [' / ', Blockly.C.ORDER_MULTIVE],
    'POWER': [' ** ', Blockly.C.ORDER_NONE]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.C.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.C.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
  // In case of 'DIVIDE', division between integers returns different results
  // guarantee identical results in all languages.  To do otherwise would
  // require every operator to be wrapped in a function call.  This would kill
  // legibility of the generated code.
};
