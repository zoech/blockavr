//#include "def.h"
#include "Arduino.h"
#include "def.h"
//#include <util/delay.h>
//

static char c = 'k';
extern "C" void block_init(){
  Serial.begin(9600);
}
extern "C" void block(){
  while(1)
  {
/*
    if(Serial.available()){
      break;
    }
*/
    if(Serial.available())
      c = Serial.read();
    Serial.println(c);
    
    
    //_delay_ms(1000);
  }
}
