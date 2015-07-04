'use strict';

goog.provide('Blockly.Zz');

goog.require('Blockly.Generator');

Blockly.Zz = new Blockly.Generator('Zz');

Blockly.Zz.ORDER_ATOMIC = 0;
Blockly.Zz.ORDER_MULTI = 1;
Blockly.Zz.ORDER_ADDITI = 2;
Blockly.Zz.ORDER_NONE = 3;

Blockly.Zz.init = function(workspace) {}
Blockly.Zz.finish = function(code) {
  return code;
}

Blockly.Zz.scrub_ = function(block,code) {

  // note,we here use recursion to gnerate codes for all blocks
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.Zz.blockToCode(nextBlock);
  return code + nextCode;
}

Blockly.Zz.scrubNakedValue = function(line) {
  return line + '\n';
}



//===========================================================
// blocks generation
Blockly.Zz['action_move_forward_zz'] = function(block) {
  var arg = Blockly.Zz.valueToCode(block,'VALUE',Blockly.Zz.ORDER_ATOMIC) || '0';
//  var arg = '11';
  var code = "go forward " + arg + " cm\n";
  return code;
}

Blockly.Zz['action_move_backward_zz'] = function(block) {
  var arg = Blockly.Zz.valueToCode(block,'VALUE',Blockly.Zz.ORDER_ATOMIC) || '0';
  var code = "go backward " + arg + " cm\n";
  return code;
}

Blockly.Zz['action_turn_left_zz'] = function(block) {
  var arg = Blockly.Zz.valueToCode(block,'VALUE',Blockly.Zz.ORDER_ATOMIC) || '0';
  var code = "turn left " + arg + " degree\n";
  return code;
}

Blockly.Zz['action_turn_right_zz'] = function(block) {
  var arg = Blockly.Zz.valueToCode(block,'VALUE',Blockly.Zz.ORDER_ATOMIC) || '0';
  var code = "turn right " + arg + " degree\n";
  return code;
}

Blockly.Zz['math_number_zz'] = function(block){
  var code = parseInt(block.getFieldValue('NUM'));
  return [code,Blockly.Zz.ORDER_ATOMIC];
}
