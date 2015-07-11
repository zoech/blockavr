#define __BLOCK_DEBUG
#include "def.h"



int main(void) {

  arduino_init();

    debug_init(19200);


  block("7");
  avr_action_blink( 8 );

  block("14");
  avr_action_blink( 2 );

  block("21");
  avr_action_blink( 3 );

  block("28");
  avr_action_blink( 1 );

  while(1);
}
