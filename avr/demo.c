#define __BLOCK_DEBUG
#include "def.h"
int item = 0;
int i = 0;


int main(void) {

  arduino_init();

  var_p[0] = &item;
  var_p[1] = &i;
  debug_init(19200);


  block("5");
  int count;
  for (count = 0; count < 5; count++) {

    block("11");
    item = item + 24;

    block("23");
    i = i - 17;

    block("5");
  }

  block_end();
}
