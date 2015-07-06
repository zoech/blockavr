Blockly.Blocks['action_move_forward_zz'] = {
  init: function() {
    this.setColour(160);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
        .appendField('move forward');
    this.appendValueInput('VALUE')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('cm');
  }
};

Blockly.Blocks['action_move_backward_zz'] = {
  init: function() {
    this.setColour(160);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
        .appendField('move backward');
    this.appendValueInput('VALUE')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('cm');
  }
};

Blockly.Blocks['action_turn_left_zz'] = {
  init: function() {
    this.setColour(160);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
        .appendField('turn left');
    this.appendValueInput('VALUE')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('deg');
  }
};

Blockly.Blocks['action_turn_right_zz'] = {
  init: function() {
    this.setColour(160);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
        .appendField('turn right');
    this.appendValueInput('VALUE')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('deg');
  }
};

Blockly.Blocks['math_number_zz'] = {
  init: function() {
    this.setColour(Blockly.Blocks.math.HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('0',
        Blockly.FieldTextInput.numberValidator),'NUM');
    this.setOutput(true,'Number');
  }
}

Blockly.Blocks['tmp_zz'] = {
  init: function() {
    //this.setColour(Blockly.Blocks.math.HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('0',
        Blockly.FieldTextInput.numberValidator),'NUM');
    this.setOutput(true,'zz');
  }
}
