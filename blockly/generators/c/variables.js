//-------------------------------------------------------------------
// variable blocks translate acomplition
Blockly.C['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.C.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.C.ORDER_ATOMIC];
};

Blockly.C['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.C.valueToCode(block, 'VALUE',
      Blockly.C.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.C.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};
