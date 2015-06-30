/* virtual code
 * definition of the avr virtual code,
 * ( or the instruction of the virtual machine )
 */

// the number of bytes of a single CMD
#define CMD_BYTES           4

// the position of cmd code in a CMD
#define CMD_BYTE            0

// program language emulation
#define LANG_SETVAR
#define LANG_PLUS
#define LANG_DIV
#define LAGN_MUL
#define LANG_SUB

#define LANG_IF
#define LANG_ELIF
#define LANG_ELSE
#define LANG_ENDIF

#define LANG_LOOP
#define LANG_ENDLOOP

// straight instruction
#define MOVE_FORWARD        0x20
#define MOVE_BACKWARD       0x21 
#define MOVE_LEFT           0x22
#define MOVE_RIGHT          0x23

