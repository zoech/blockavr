#include "def.h"
void block(void){
  while(1){
    if( (PIND & (1<<4)) == 0 )
      break;
  }
}
