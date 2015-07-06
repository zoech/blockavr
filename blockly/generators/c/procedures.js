//--------------------------------------------------------------------
// procedure blocks translate acomplition
Blockly.C['procedures_defreturn'] = function(block){

  var funcName = Blockly.C.variableDB_.getName(block.getFieldValue('NAME'),Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.C.statementToCode(block, 'STACK');
  
  var returnValue = Blockly.C.valueToCode(block,'RETURN',Blockly.C.ORDER_NONE) || '0';
  returnValue = '  return ' + returnValue + ';\n';
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = 'int ' + Blockly.C.variableDB_.getName(block.arguments_[x],Blockly.Variables.NAME_TYPE);
  }
  var retype = 'int ';
  if ( block.type == 'procedures_defnoreturn' ){
    retype = 'void ';
	returnValue = '';
  }
  var code = retype + funcName + '(' +args.join(', ') + '){\n' + branch + returnValue + '}';
  var fdef = retype + funcName + '(' + args.join(', ') + ');\n';

  code = Blockly.C.scrub_(block, code);
  Blockly.C.funcProcedures_[funcName] = code;
  Blockly.C.definitions_['functions'] += fdef;
 
//  Blockly.C.definitions_[funcName] = 'int '+ funcName + '(){}';
  return null;
}

Blockly.C['procedures_defnoreturn'] = Blockly.C['procedures_defreturn'];

Blockly.C['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.C.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.C.valueToCode(block, 'ARG' + x,
        Blockly.C.ORDER_COMMA) || '0';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.C.ORDER_ATOMIC];
}

Blockly.C['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.C.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.C.valueToCode(block, 'ARG' + x,
        Blockly.C.ORDER_COMMA) || '0';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.C['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.C.valueToCode(block, 'CONDITION',
      Blockly.C.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (block.hasReturnValue_) {
    var value = Blockly.C.valueToCode(block, 'VALUE',
        Blockly.C.ORDER_NONE) || '0';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};
