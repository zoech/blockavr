#define __BLOCK_DEBUG
#include "def.h"
int i = 0;
int j = 0;
int count = 0;


int main(void) {

  arduino_init();

  var_p[0] = &i;
  var_p[1] = &j;
  var_p[2] = &count;
  debug_init(19200);


  block("5");
  i = 4;

  block("15");
  j = 8;

  block("29");
  while (count < 6) {

    block("53");
    avr_action_blink( 1 );

    block("29");
  }

  block_end();
}
