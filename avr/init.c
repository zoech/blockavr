#include <avr/io.h>

void init(void){
  DDRD = 0xff;
  DDRD = DDRD & ~(1<<4);
  DDRD = DDRD | (1<<7);
  DDRB = DDRB | (1<<1);
  PORTD = PORTD | (1<<4);


  // test -----------------------------
  DDRB = DDRB | (1<<5);
  PORTB = PORTB & ~(1<<5);
  //PORTD = PORTD | (1<<2);
  // end test ------------------------
  
}
