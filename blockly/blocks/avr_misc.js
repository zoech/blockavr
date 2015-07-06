Blockly.Blocks['avr_misc_init'] = {
  init: function() {
    //this.setColour(160);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
        .appendField('avr libarary init');
  }
};
