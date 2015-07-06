Blockly.Blocks['avr_action_init'] = {
  init: function() {
    //this.setColour(160);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
        .appendField('avr action init');
  }
};

Blockly.Blocks['avr_action_move_forward'] = {
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

Blockly.Blocks['avr_action_move_backward'] = {
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

Blockly.Blocks['avr_action_turn_left'] = {
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

Blockly.Blocks['avr_action_turn_right'] = {
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
