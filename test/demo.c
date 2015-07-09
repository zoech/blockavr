//#include <avr/io.h>
//#include <util/delay.h>
//#include "def.h"
#include "Arduino.h"
#include "def.h"

void block();
void searial_begin(int baud);

//extern void block();

int main(void) {

  arduino_init();
  serial_begin(19200);

  DDRB |= 1<<5;
  PORTB |= (1<<5);

//  Serial.begin(19200);

  block();
/*
//  char c;
  while(1){
    //Serial.println(c);
	PORTB &= ~(1<<5);
    Serial.println("a");
    delay(500);
	PORTB |= (1<<5);
    Serial.println("b");
	delay(500);
  }
*/
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
