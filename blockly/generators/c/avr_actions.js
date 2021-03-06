//===========================================================
// blocks generation

Blockly.C['avr_action_init'] = function(block) {
  var code = "avr_action_init();\n";
  /*
  if( Blockly.C.DEBUG == 1 ) {
    code = 'block();\n' + code +'\n';
  }
  */
  return code;
}

Blockly.C['avr_action_move_forward'] = function(block) {
  var arg = Blockly.C.valueToCode(block,'VALUE',Blockly.C.ORDER_NONE) || '0';
  var code = "avr_action_forward( " + arg + " );\n";
  return code;
}

Blockly.C['avr_action_move_backward'] = function(block) {
  var arg = Blockly.C.valueToCode(block,'VALUE',Blockly.C.ORDER_NONE) || '0';
  var code = "avr_action_backward( " + arg + " );\n";
  return code;
}

Blockly.C['avr_action_turn_left'] = function(block) {
  var arg = Blockly.C.valueToCode(block,'VALUE',Blockly.C.ORDER_NONE) || '0';
  var code = "avr_action_left( " + arg + " );\n";
  return code;
}

Blockly.C['avr_action_turn_right'] = function(block) {
  var arg = Blockly.C.valueToCode(block,'VALUE',Blockly.C.ORDER_NONE) || '0';
  var code = "avr_action_right( " + arg + " );\n";
  return code;
}

Blockly.C['avr_action_blink'] = function(block) {
  var arg = Blockly.C.valueToCode(block,'VALUE',Blockly.C.ORDER_NONE) || '1';
  var code = "avr_action_blink( " + arg + " );\n";
  return code;
}
