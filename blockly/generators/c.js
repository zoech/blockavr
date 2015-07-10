Blockly.C = new Blockly.Generator('C');

Blockly.C.RESERVED_WORDS_ =
    'auto,const,double,float,int,short,struct,unsigned,break,continue,else,for,long,signed,switch,void,case,default,enum,goto,register,sizeof,typedef,volatile,char,do,extern,if,return,static,union,while,asm,dynamic_cast,namespace,reinterpret_cast,try,bool,explicit,new,static_cast,typeid,catch,false,operator,template,typename,class,friend,private,this,using,const_cast,inline,public,throw,virtual,delete,mutable,protected,true,wchar_t';

Blockly.C.ORDER_ATOMIC = 0;
Blockly.C.ORDER_MEMBER = 1;                   // -> []
Blockly.C.ORDER_LOGIC_NOT = 2;                // !
Blockly.C.ORDER_SELF_ADDICTIVE = 2;           // ++ --
Blockly.C.ORDER_BIT_REVERSE = 2;              // ~
Blockly.C.ORDER_NUMBER_SIGN = 2;              // -
Blockly.C.ORDER_POINTER_ADDRESS = 2;          // *ptr &ptr
Blockly.C.ORDER_MULTIVE = 3;                  // * /
Blockly.C.ORDER_MODULUS = 3;                  // %
Blockly.C.ORDER_ADDITIVE = 4;                // + -
Blockly.C.ORDER_BIT_SHIFT = 5;                // << >>
Blockly.C.ORDER_LOGIC_GT = 6;                 // >
Blockly.C.ORDER_LOGIC_LT = 6;                 // <
Blockly.C.ORDER_LOGIC_GE = 6;                 // >=
Blockly.C.ORDER_LOGIC_LE = 6;                 // <=
Blockly.C.ORDER_LOGIC_EQ = 7;                 // ==
Blockly.C.ORDER_LOGIC_NE = 7;                 // !=
Blockly.C.ORDER_BIT_AND = 8;                  // &
Blockly.C.ORDER_BIT_XOR = 9;                  // ^
Blockly.C.ORDER_BIT_OR = 10;                  // |
Blockly.C.ORDER_LOGIC_AND = 11;               // &&
Blockly.C.ORDER_LOGIC_OR = 12;                // ||
Blockly.C.ORDER_CONDITIONAL = 13;        // ?:
Blockly.C.ORDER_ASSIGNMENT = 14;              // = += -= *= /= &= |= ...
Blockly.C.ORDER_COMMA = 98;                   // ,
Blockly.C.ORDER_NONE = 99;

// use to determin whether put a block() function in the code of a block;
// if Blockly.C.DEBUG == 1,then,the generated code for some blocks 
// would have a block() function in the very begining;this block()
// function is a death loop,and will break when a certain signal is
// receaved; thus the step debug can be achieved;
Blockly.C.DEBUG = 0;

Blockly.C.init = function(workspace) {
  Blockly.C.definitions_ = Object.create(null);
  //Blockly.C.functionNames_ = Object.create(null);
  Blockly.C.funcProcedures_ = Object.create(null);
  Blockly.C.variables_ = [];

  if(!Blockly.C.variableDB_) {
    Blockly.C.variableDB_ =
      new Blockly.Names(Blockly.C.RESERVED_WORDS_);
  }else{
    Blockly.C.variableDB_.reset();
  }

  var defvars = [];
  var variables = Blockly.Variables.allVariables(workspace);
  for (var x = 0;x < variables.length;x++) {
    Blockly.C.variables_[x] = Blockly.C.variableDB_.getName(variables[x],Blockly.Variables.NAME_TYPE);
    defvars[x] = 'int ' + Blockly.C.variables_[x] + ' = 0;';
  }

  Blockly.C.definitions_['variables'] = defvars.join('\n');
  Blockly.C.definitions_['functions'] = '';
}

//-------------------------------------------------------------------
// finishlize
Blockly.C.finish = function(code) {
  var debug_var_trace = 16;
  var definitions = [];
  for (var name in Blockly.C.definitions_) {
    definitions.push(Blockly.C.definitions_[name]);
  }
  var funcProcedures = [];
  for (var name in Blockly.C.funcProcedures_) {
    funcProcedures.push(Blockly.C.funcProcedures_[name]);
  }
  var var_debug_bind = [];
  var varpointer = 'var_p';
  for (var x = 0;x < Blockly.C.variables_.length && x < debug_var_trace;x++){
    var bind = varpointer + '[' + x + '] = &' + Blockly.C.variables_[x] + ';';
	var_debug_bind.push(bind);
  }

  code = Blockly.C.prefixLines(code,Blockly.C.INDENT) + Blockly.C.prefixLines('\nwhile(1);\n',Blockly.C.INDENT) + '}';
  if (Blockly.C.DEBUG == 1) {
    code = Blockly.C.prefixLines(var_debug_bind.join('\n'),Blockly.C.INDENT) + 
                     Blockly.C.prefixLines('debug_init(19200);\n\n',Blockly.C.INDENT) + code;
  }
  code = 'int main(void) {\n\n' + Blockly.C.prefixLines('arduino_init();\n',Blockly.C.INDENT) + '\n' + code;

  code = '#include "def.h"\n' + definitions.join('\n\n') + '\n' + code + '\n\n\n' + funcProcedures.join('\n\n');
  if (Blockly.C.DEBUG == 1) {
    //code = 'int *' + varpointer + '[' + debug_var_trace + '];\n\n' + code;
	code = '#define __BLOCK_DEBUG\n' + code;
  }

  return code;
}
//--------------------------------------------------------------------

Blockly.C.scrub_ = function(block,code) {

  // note,we here use recursion to gnerate codes for all blocks
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.C.blockToCode(nextBlock);

  // for each statement,we used block() to accomplish step debug
  //var block_step = '// block() is the function to block program\nblock()\n';
  return code + nextCode;
}

Blockly.C.scrubNakedValue = function(line) {
  return line + ';\n';
}

