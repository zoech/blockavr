Blockly.Blocks['custom_test'] = {
  init: function() {
    this.setColour(160);
    this.appendValueInput('VALUE')
        .setCheck('String')
        .appendField('length of');
	this.appendDummyInput()
	    .appendField('shit');
    this.setOutput(true, 'Number');
  }
};

Blockly.Blocks['shit'] = {
  init: function() {
    this.setOutput(true,'Number');
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('0',Blockly.FieldTextInput.numberValidator),'NUM');
	//this.setPreviousStatement(true);
	this.setNextStatement(true);
  }
};
