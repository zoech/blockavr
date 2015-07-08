#include <avr/io.h>
#include <util/delay.h>

#include "def.h"

//#define F_CPU 8000000

// MoTor direction _$(Left|Right)MT_$(Forward|Backward)
#define AVR_ACTION_LMT_F (PORTD = PORTD | (1<<7))
#define AVR_ACTION_LMT_B (PORTD = PORTD & ~(1<<7))
#define AVR_ACTION_RMT_F (PORTB = PORTB | (1<<0))
#define AVR_ACTION_RMT_B (PORTB = PORTB & ~(1<<0))

// MoTor power _$(Left|Right)MT_$(Up|Down)
#define AVR_ACTION_LMT_U (PORTB = PORTB | (1<<1))
#define AVR_ACTION_LMT_D (PORTB = PORTB & ~(1<<1))
#define AVR_ACTION_RMT_U (PORTB = PORTB | (1<<2))
#define AVR_ACTION_RMT_D (PORTB = PORTB & ~(1<<2))

static action_delay(int ms){
  int i = 0;
  for(;i<ms;++i)
    _delay_ms(1);
}

void avr_action_init(void){
  //DDRD = 0xff;
  //DDRD = DDRD & ~(1<<4);
  DDRD = DDRD | (1<<7);
  DDRB = DDRB | (1<<0) | (1<<1) | (1<<2);
  //PORTD = PORTD | (1<<4);
  // test -----------------------------
  //DDRB = DDRB | (1<<5);
  //PORTB = PORTB & ~(1<<5);
  //PORTD = PORTD | (1<<2);
  // end test ------------------------
  
}

void avr_action_forward(int dist){
  AVR_ACTION_LMT_F;
  AVR_ACTION_RMT_F;
  AVR_ACTION_LMT_U;
  AVR_ACTION_RMT_U;
  action_delay(dist*100);
  AVR_ACTION_LMT_D;
  AVR_ACTION_RMT_D;
}

void avr_action_backward(int dist){
  AVR_ACTION_LMT_B;
  AVR_ACTION_RMT_B;
  AVR_ACTION_LMT_U;
  AVR_ACTION_RMT_U;
  action_delay(dist*100);
  AVR_ACTION_LMT_D;
  AVR_ACTION_RMT_D;
}

void avr_action_left(int deg){
  AVR_ACTION_LMT_B;
  AVR_ACTION_RMT_F;
  AVR_ACTION_LMT_U;
  AVR_ACTION_RMT_U;
  action_delay(deg*50);
  AVR_ACTION_LMT_D;
  AVR_ACTION_RMT_D;
}

void avr_action_right(int deg){
  AVR_ACTION_LMT_F;
  AVR_ACTION_RMT_B;
  AVR_ACTION_LMT_U;
  AVR_ACTION_RMT_U;
  action_delay(deg*50);
  AVR_ACTION_LMT_D;
  AVR_ACTION_RMT_D;
}
