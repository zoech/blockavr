#define __BLOCK_DEBUG
#include "def.h"
int c = 0;
int j = 0;
int i = 0;


int main(void) {

  arduino_init();

  var_p[0] = &c;
  var_p[1] = &j;
  var_p[2] = &i;
  debug_init(19200);


  block("15");
  avr_action_init();

  block("18");
  c = 1;

  block("69");
  j = 1;

  block("5");
  int count;
  for (count = 0; count < 10; count++) {

    block("28");
    avr_action_forward( c );

    block("40");
    avr_action_backward( c );

    block("52");
    avr_action_right( 90 );

    block("62");
    i = i + c;

    block("102");
    j = j * c;

    block("138");
    c = c + 1;

    block("5");
  }

  block_end();
}
