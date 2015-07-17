#define __BLOCK_DEBUG
#include "def.h"
int x = 0;
int y = 0;
int i = 0;


int main(void) {

  arduino_init();

  var_p[0] = &x;
  var_p[1] = &y;
  var_p[2] = &i;
  debug_init(19200);


  block("63");
  x = 0;

  block("51");
  y = 1;

  block("23");
  i = 1;

  block("12");
  int count;
  for (count = 0; count < 10; count++) {

    block("7");
    avr_action_blink( i );

    block("75");
    x = x + i;

    block("84");
    y = y * i;

    block("33");
    i = i + 1;

    block("12");
  }

  block_end();
}
