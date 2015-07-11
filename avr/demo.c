#define __BLOCK_DEBUG
#include "def.h"
int i = 0;


int main(void) {

  arduino_init();

  var_p[0] = &i;
  debug_init(19200);


  block("42");
  i = 3;

  block("14");
  int count;
  for (count = 0; count < 3; count++) {

    block("24");
    avr_action_blink( 2 );

    block("34");
    avr_action_blink( i );

    block("14");
  }

  block_end();
}
