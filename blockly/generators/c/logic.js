Blockly.C['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.C.valueToCode(block, 'IF' + n,
      Blockly.C.ORDER_NONE) || 'false';
  argument = '( ' + argument + ' )';
  var branch = Blockly.C.statementToCode(block, 'DO' + n) || '';
  var code = 'if ' + argument + '{\n' + branch + '}\n';
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.C.valueToCode(block, 'IF' + n,
        Blockly.C.ORDER_NONE) || 'false';
    argument = '( ' + argument + ' )';
    branch = Blockly.C.statementToCode(block, 'DO' + n) || '';
    code += 'else if ' + argument + '{\n' + branch + '}\n';
  }
  if (block.elseCount_) {
    branch = Blockly.C.statementToCode(block, 'ELSE') || '';
    code += 'else{\n' + branch + '}\n';
  }
  return code;
};

Blockly.C['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': ['==', Blockly.C.ORDER_LOGIC_EQ],
    'NEQ': ['!=', Blockly.C.ORDER_LOGIC_NE],
    'LT': ['<', Blockly.C.ORDER_LOGIC_LT],
    'LTE': ['<=', Blockly.C.ORDER_LOGIC_LE],
    'GT': ['>', Blockly.C.ORDER_LOGIC_GT],
    'GTE': ['>=', Blockly.C.ORDER_LOGIC_GE]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.C.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.C.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.C['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.C.ORDER_LOGIC_AND :
      Blockly.C.ORDER_LOGIC_OR;
  var argument0 = Blockly.C.valueToCode(block, 'A', order);
  var argument1 = Blockly.C.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.C['logic_negate'] = function(block) {
  // Negation.
  var argument0 = Blockly.C.valueToCode(block, 'BOOL',
      Blockly.C.ORDER_LOGIC_NOT) || 'true';
  var code = '!' + argument0;
  return [code, Blockly.C.ORDER_LOGIC_NOT];
};

Blockly.C['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.C.ORDER_ATOMIC];
};

Blockly.C['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.C.ORDER_ATOMIC];
};

Blockly.C['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.C.valueToCode(block, 'IF',
      Blockly.C.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.C.valueToCode(block, 'THEN',
      Blockly.C.ORDER_CONDITIONAL) || '0';
  var value_else = Blockly.C.valueToCode(block, 'ELSE',
      Blockly.C.ORDER_CONDITIONAL) || '0';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.C.ORDER_CONDITIONAL];
};
