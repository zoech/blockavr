#include "def.h"
#include "Arduino.h"
void block(void){
  while(1)
  {
    if(Serial.available()){
      break;
    }
  }
}
