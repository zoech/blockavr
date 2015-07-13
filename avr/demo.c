#define __BLOCK_DEBUG
#include "def.h"
int i = 0;
int j = 0;
int k = 0;


int main(void) {

  arduino_init();

  var_p[0] = &i;
  var_p[1] = &j;
  var_p[2] = &k;
  debug_init(19200);


  block("3");
  i = -4467;

  block("6");
  j = 0;

  block("9");
  k = 66;

  block("25");
  while (i < 0) {

    block("77");
    k = k - 3;

    block("53");
    j = k + 2;

    block("105");
    i = i + 1036;

    block("25");
  }

  block_end();
}
