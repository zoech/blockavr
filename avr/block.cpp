#include "Arduino.h"

#define __BLOCK_DEBUG
#include "def.h"

#define NEXT_STEP        's'
#define GET_VAR          'v'
#define GET_REG          'r'

#ifdef __cplusplus
extern "C" {
#endif

void debug_init(long baud){
  Serial.begin(baud);
}

void block(char* id){
  /* tell the upper machine where here is */
  Serial.write(id); 

  /* block the process if no NEXT_STEP code in Serial.
   * and here in this while we may handle some extra 
   * tasks,like sending back variables and registers
   * value. */
  while(1){
    if(Serial.available()){
      char code;
      char para;
      if( (code = Serial.read()) == NEXT_STEP ) break;


      /* the command only depend on the first "code" byte
	   * should play above. the following case would use
	   * the second comming byte "para". */

      /*****************************************************/

      //while( !Serial.available() );
      para = Serial.read();
	  /* if no following comming byte, we simply treat
	   * it as transport error and ignore it. */
      if (para == -1) continue;

      switch(code){
        case GET_VAR:
          /* write value of required variable to the serial */
          break;
        case GET_REG:
          /* write value of required register to the serial */
          break;

        default:
          break;
      } /* end of switch */
    } /* end of if(Serial.available()) */
  } /* end of while */
}

#ifdef __cplusplus
} // end of extern "C"
#endif
