zz_generator = {};

zz_generator.workspaceToCode = function(workspace) {
  if (!workspace) {
    // Backwards compatability from before there could be multiple workspaces.
    console.warn('No workspace specified in workspaceToCode call.  Guessing.');
    workspace = Blockly.getMainWorkspace();
  }
  var code = [];
  //this.init(workspace);
  var blocks = workspace.getTopBlocks(true);
  for (var x = 0, block; block = blocks[x]; x++) {
    var line = this.blockToCode(block);
    if (goog.isArray(line)) {
      // Value blocks return tuples of code and operator order.
      // Top-level blocks don't care about operator order.
      line = line[0];
    }
    if (line) {
      if (block.outputConnection && this.scrubNakedValue) {
        // This block is a naked value.  Ask the language's code generator if
        // it wants to append a semicolon, or something.
        line = this.scrubNakedValue(line);
      }
      code.push(line);
    }
  }
  code = code.join('\n');  // Blank line between each section.
  //code = this.finish(code);
  // Final scrubbing of whitespace.
  code = code.replace(/^\s+\n/, '');
  code = code.replace(/\n\s+$/, '\n');
  code = code.replace(/[ \t]+\n/g, '\n');
  return code;
};

zz_generator.prefixLines = function(text, prefix) {
  return prefix + text.replace(/\n(.)/g, '\n' + prefix + '$1');
};

zz_generator.blockToCode = function(block) {
  if (!block) {
    return '';
  }
  if (block.disabled) {
    // Skip past this block if it is disabled.
    return this.blockToCode(block.getNextBlock());
  }

  var func = this[block.type];
  if (!func) {
    throw 'Language "' + this.name_ + '" does not know how to generate code ' +
        'for block type "' + block.type + '".';
  }
  // First argument to func.call is the value of 'this' in the generator.
  // Prior to 24 September 2013 'this' was the only way to access the block.
  // The current prefered method of accessing the block is through the second
  // argument to func.call, which becomes the first parameter to the generator.
  var code = func.call(block, block);
  if (goog.isArray(code)) {
    // Value blocks return tuples of code and operator order.
    return [this.scrub_(block, code[0]), code[1]];
  } else if (goog.isString(code)) {
    if (this.STATEMENT_PREFIX) {
      code = this.STATEMENT_PREFIX.replace(/%1/g, '\'' + block.id + '\'') +
          code;
    }
    return this.scrub_(block, code);
  } else if (code === null) {
    // Block has handled code generation itself.
    return '';
  } else {
    throw 'Invalid code generated: ' + code;
  }
};

zz_generator.valueToCode = function(block, name, order) {
  if (isNaN(order)) {
    throw 'Expecting valid order from block "' + block.type + '".';
  }
  var targetBlock = block.getInputTargetBlock(name);
  if (!targetBlock) {
    return '';
  }
  var tuple = this.blockToCode(targetBlock);
  if (tuple === '') {
    // Disabled block.
    return '';
  }
  if (!goog.isArray(tuple)) {
    // Value blocks must return code and order of operations info.
    // Statement blocks must only return code.
    throw 'Expecting tuple from value block "' + targetBlock.type + '".';
  }
  var code = tuple[0];
  var innerOrder = tuple[1];
  if (isNaN(innerOrder)) {
    throw 'Expecting valid order from value block "' + targetBlock.type + '".';
  }
  if (code && order <= innerOrder) {
    if (order == innerOrder && (order == 0 || order == 99)) {
      // Don't generate parens around NONE-NONE and ATOMIC-ATOMIC pairs.
      // 0 is the atomic order, 99 is the none order.  No parentheses needed.
      // In all known languages multiple such code blocks are not order
      // sensitive.  In fact in Python ('a' 'b') 'c' would fail.
    } else {
      // The operators outside this code are stonger than the operators
      // inside this code.  To prevent the code from being pulled apart,
      // wrap the code in parentheses.
      // Technically, this should be handled on a language-by-language basis.
      // However all known (sane) languages use parentheses for grouping.
      code = '(' + code + ')';
    }
  }
  return code;
};

zz_generator.statementToCode = function(block, name) {
  var targetBlock = block.getInputTargetBlock(name);
  var code = this.blockToCode(targetBlock);
  if (!goog.isString(code)) {
    // Value blocks must return code and order of operations info.
    // Statement blocks must only return code.
    throw 'Expecting code from statement block "' + targetBlock.type + '".';
  }
  if (code) {
    code = this.prefixLines(/** @type {string} */ (code), this.INDENT);
  }
  return code;
};

zz_generator.scrub_ = function(block,code) {
  return code;
}

zz_generator.ORDER_ATOMIC = 0;
zz_generator.ORDER_MULTI = 1;
zz_generator.ORDER_ADDITI = 2;
zz_generator.ORDER_NONE = 3;


zz_generator['action_move_forward_zz'] = function(block) {
  var arg = zz_generator.valueToCode(block,'VALUE',zz_generator.ORDER_ATOMIC) || '0';
  //var arg = '11';
  var code = "go forward " + arg + " cm";
  return code;
}

zz_generator['action_move_backward_zz'] = function(block) {
  var arg = zz_generator.valueToCode(block,'VALUE',zz_generator.ORDER_ATOMIC) || '0';
  var code = "go backward " + arg + " cm";
  return code;
}

zz_generator['action_turn_left_zz'] = function(block) {
  var arg = zz_generator.valueToCode(block,'VALUE',zz_generator.ORDER_ATOMIC) || '0';
  var code = "turn left " + arg + " degree";
  return code;
}

zz_generator['action_turn_right_zz'] = function(block) {
  var arg = zz_generator.valueToCode(block,'VALUE',zz_generator.ORDER_ATOMIC) || '0';
  var code = "turn right " + arg + " degree";
  return code;
}

zz_generator['math_number_zz'] = function(block){
  var code = parseInt(block.getFieldValue('NUM'));
  return [code,zz_generator.ORDER_ATOMIC];
}
