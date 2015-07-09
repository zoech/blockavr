#define __BLOCK_DEBUG
#include "def.h"

static void blink(int times);
int main(void) {

  arduino_init();
  debug_init(19200);

  //while(!Serial.available());
  //while(Serial.read() != -1);

  DDRB |= 1<<5;
  while(1){
    block("2");
    blink(2);

    block("250");
    blink(5);

    block("666");
    blink(1);
  }
  while(1);
}

static void blink(int times){
  int i = 0;
  for(; i < times; ++i){
    PORTB |= 1<<5;
    delay(300);
    PORTB &= ~(1<<5);
    delay(300);
  }
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
