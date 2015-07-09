#include "Arduino.h"

#ifdef __cplusplus
extern "C" {
#endif

void serial_begin(int baud){
  Serial.begin(baud);
}

void block(){
  while(1){
	  Serial.println("a");
	  PORTB |= (1<<5);
	  delay(200);

	  //PORTB &= ~(1<<5);
	  Serial.println("z");
	  delay(200);
  }
}

#ifdef __cplusplus
} // end of extern "C"
#endif
