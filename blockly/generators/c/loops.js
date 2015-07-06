Blockly.C['controls_repeat_ext'] = function(block) {
  // Repeat n times (external number).
  var repeats = Blockly.C.valueToCode(block, 'TIMES',
      Blockly.C.ORDER_ASSIGNMENT) || '0';
  var branch = Blockly.C.statementToCode(block, 'DO');
  branch = Blockly.C.addLoopTrap(branch, block.id);
  var code = '';
  var loopVar = Blockly.C.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var endVar = repeats;
  code += 'int ' + loopVar + ';\n';
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.C.variableDB_.getDistinctName(
        'repeat_end', Blockly.Variables.NAME_TYPE);
    code += 'int ' + endVar + ' = ' + repeats + ';\n';
  }
  code += 'for (' + loopVar + ' = 0; ' +
      loopVar + ' < ' + endVar + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
  return code;
};

Blockly.C['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.C.valueToCode(block, 'BOOL',
      until ? Blockly.C.ORDER_LOGICAL_NOT :
      Blockly.C.ORDER_NONE) || 'false';
  var branch = Blockly.C.statementToCode(block, 'DO');
  branch = Blockly.C.addLoopTrap(branch, block.id);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.C['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.C.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.C.valueToCode(block, 'FROM',
      Blockly.C.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.C.valueToCode(block, 'TO',
      Blockly.C.ORDER_LOGIC_LE) || '0';
      //Blockly.C.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.C.valueToCode(block, 'BY',
      Blockly.C.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.C.statementToCode(block, 'DO');
  branch = Blockly.C.addLoopTrap(branch, block.id);
  var code;
  if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
      Blockly.isNumber(increment)) {
    // All arguments are simple numbers.
    var up = parseFloat(argument0) <= parseFloat(argument1);
    code = 'for (' + variable0 + ' = ' + argument0 + '; ' +
        variable0 + (up ? ' <= ' : ' >= ') + argument1 + '; ' +
        variable0;
    var step = Math.abs(parseFloat(increment));
    if (step == 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += ') {\n' + branch + '}\n';
  } else {
    code = '';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var startVar = argument0;
    if (!argument0.match(/^\w+$/) && !Blockly.isNumber(argument0)) {
      startVar = Blockly.C.variableDB_.getDistinctName(
          variable0 + '_start', Blockly.Variables.NAME_TYPE);
      code += 'int ' + startVar + ' = ' + argument0 + ';\n';
    }
    var endVar = argument1;
    if (!argument1.match(/^\w+$/) && !Blockly.isNumber(argument1)) {
      var endVar = Blockly.C.variableDB_.getDistinctName(
          variable0 + '_end', Blockly.Variables.NAME_TYPE);
      code += 'int ' + endVar + ' = ' + argument1 + ';\n';
    }
    // Determine loop direction at start, in case one of the bounds
    // changes during loop execution.
    var incVar = Blockly.C.variableDB_.getDistinctName(
        variable0 + '_inc', Blockly.Variables.NAME_TYPE);
    code += 'int ' + incVar + ' = ' + increment + ';\n';
    code += 'if ( ' + incVar + ' < 0 ){\n' +
          Blockly.C.INDENT + incVar + ' = -' + incVar + ';\n}\n';

    var ltgVar = Blockly.C.variableDB_.getDistinctName(
        'ltg_flag', Blockly.Variables.NAME_TYPE);
    code += 'int ' + ltgVar + ' = 1;\n';

    code += 'if (' + startVar + ' > ' + endVar + ') {\n';
    code += Blockly.C.INDENT + incVar + ' = -' + incVar + ';\n';
    code += Blockly.C.INDENT + ltgVar + ' = 0;\n';
    code += '}\n' + variable0 + ' = ' + startVar
                    + ';\n';
    code +=               'while(1) {\n' +
         Blockly.C.INDENT + 'if(' + ltgVar + ' == 0 && ' +
                variable0 + ' < ' + endVar + ')break;\n' +
         Blockly.C.INDENT + 'if(' + ltgVar + ' == 1 && ' +
                variable0 + ' > ' + endVar + ')break;\n' +
         Blockly.C.INDENT + variable0 + ' += ' + incVar + ';\n' +
                branch + '}\n';

      code = '//++++++++++++++++++++++++++++\n' +
             '// loops block +++++++++++++++\n' + code +
             '// end loops block +++++++++++\n' +
             '//++++++++++++++++++++++++++++\n';
  }
  return code;
};

Blockly.C['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw 'Unknown flow statement.';
};
