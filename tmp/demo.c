#include <avr/io.h>
#include <util/delay.h>
#include "def.h"

int main(void) {

  block_init();

  block();
  avr_action_init();

  block();
  avr_action_forward( 300 );

  block();
  avr_action_left( 90 );

  block();
  avr_action_right( 90 );

  block();
  avr_action_forward( 200 );

  block();
  avr_action_backward( 300 );


  while(1);
}


/*
int main(void){

//  init();
//  while(1){
//    block();
//    PORTB = PORTB | (1<<1);
//    _delay_ms(10000);
//    PORTB = PORTB & ~(1<<1);
//  }


  DDRB = DDRB | (1<<5);

  PORTB = PORTB | (1<<5);
  _delay_ms(5000);
  PORTB = PORTB & ~(1<<5);

  avr_action_init();

  avr_action_forward(66);
  block();

  avr_action_left(90);
  block();

  avr_action_forward(50);
  block();

  avr_action_right(90);
  block();

  avr_action_backward(88);
  block();

  PORTB = PORTB | (1<<5);
  while(1);
}
*/
