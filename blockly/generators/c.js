Blockly.C = new Blockly.Generator('C');

Blockly.C.RESERVED_WORDS_ =
    'auto,const,double,float,int,short,struct,unsigned,break,continue,else,for,long,signed,switch,void,case,default,enum,goto,register,sizeof,typedef,volatile,char,do,extern,if,return,static,union,while,asm,dynamic_cast,namespace,reinterpret_cast,try,bool,explicit,new,static_cast,typeid,catch,false,operator,template,typename,class,friend,private,this,using,const_cast,inline,public,throw,virtual,delete,mutable,protected,true,wchar_t';


Blockly.C.ORDER_ATOMIC = 0;
Blockly.C.ORDER_ASSIGNMENT = 1;
Blockly.C.ORDER_FUNCTION_CALL = 2;
Blockly.C.ORDER_COMMA = 98;
Blockly.C.ORDER_NONE = 99;

Blockly.C.DEBUG = 0;

Blockly.C.init = function(workspace) {
  Blockly.C.definitions_ = Object.create(null);
  Blockly.C.functionNames_ = Object.create(null);

  if(!Blockly.C.variableDB_) {
    Blockly.C.variableDB_ =
      new Blockly.Names(Blockly.C.RESERVED_WORDS_);
  }else{
    Blockly.C.variableDB_.reset();
  }

  var defvars = [];
  var variables = Blockly.Variables.allVariables(workspace);
  for (var x = 0;x < variables.length;x++) {
    defvars[x] = 'int ' + Blockly.C.variableDB_.getName(variables[x],
	                      Blockly.Variables.NAME_TYPE) + ' = 0;';
  }

  Blockly.C.definitions_['variables'] = defvars.join('\n');
  Blockly.C.definitions_['functions'] = '';
  Blockly.C.funcProcedures_ = Object.create(null);
}

//-------------------------------------------------------------------
// finishlize
Blockly.C.finish = function(code) {
  var definitions = [];
  for (var name in Blockly.C.definitions_) {
    definitions.push(Blockly.C.definitions_[name]);
  }
  var funcProcedures = [];
  for (var name in Blockly.C.funcProcedures_) {
    funcProcedures.push(Blockly.C.funcProcedures_[name]);
  }

  code = 'int main(void) {\n' + Blockly.C.prefixLines(code,Blockly.C.INDENT) + Blockly.C.prefixLines('\nwhile(1);\n',Blockly.C.INDENT) + '}';
  return definitions.join('\n\n') + '\n' + code + '\n\n\n' + funcProcedures.join('\n\n');
}
//--------------------------------------------------------------------

Blockly.C.scrub_ = function(block,code) {

  // note,we here use recursion to gnerate codes for all blocks
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.C.blockToCode(nextBlock);

  // for each statement,we used block() to accomplish step debug
  var block_step = '// block() is the function to block program\nblock()\n';
  return code + nextCode;
}

Blockly.C.scrubNakedValue = function(line) {
  return line + ';\n';
}

//===========================================================
// blocks generation
Blockly.C['action_move_forward_zz'] = function(block) {
  var arg = Blockly.C.valueToCode(block,'VALUE',Blockly.C.ORDER_NONE) || '0';
//  var arg = '11';
  var code = "move_forward( " + arg + " );\n";
  if( Blockly.C.DEBUG == 1 ) {
    code = 'block();\n' + code +'\n';
  }
  return code;
}

Blockly.C['action_move_backward_zz'] = function(block) {
  var arg = Blockly.C.valueToCode(block,'VALUE',Blockly.C.ORDER_NONE) || '0';
  var code = "move_backward( " + arg + " );\n";
  if( Blockly.C.DEBUG == 1 ) {
    code = 'block();\n' + code +'\n';
  }
  return code;
}

Blockly.C['action_turn_left_zz'] = function(block) {
  var arg = Blockly.C.valueToCode(block,'VALUE',Blockly.C.ORDER_NONE) || '0';
  var code = "turn_left( " + arg + " );\n";
  if( Blockly.C.DEBUG == 1 ) {
    code = 'block();\n' + code +'\n';
  }
  return code;
}

Blockly.C['action_turn_right_zz'] = function(block) {
  var arg = Blockly.C.valueToCode(block,'VALUE',Blockly.C.ORDER_NONE) || '0';
  var code = "turn_right( " + arg + " );\n";
  if( Blockly.C.DEBUG == 1 ) {
    code = 'block();\n' + code +'\n';
  }
  return code;
}

Blockly.C['math_number_zz'] = function(block){
  var code = parseInt(block.getFieldValue('NUM'));
  return [code,Blockly.C.ORDER_ATOMIC];
}

//-------------------------------------------------------------------
// variable blocks translate acomplition
Blockly.C['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.C.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.C.ORDER_ATOMIC];
};

Blockly.C['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.C.valueToCode(block, 'VALUE',
      Blockly.C.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.C.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};

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
  return [code, Blockly.C.ORDER_FUNCTION_CALL];
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
