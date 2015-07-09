#include "Arduino.h"

#define __BLOCK_DEBUG
#include "def.h"

/* codes the down machine would recieve */
#define NEXT_STEP        's'
#define GET_VAR          'v'
#define GET_REG          'r'

/* codes the up machine would recieve */
#define CODE_UNKNOW      "N/A"
#define HEAVY_LATENCY    "L/T"

#ifdef __cplusplus
extern "C" {
#endif

void debug_init(long baud){
  Serial.begin(baud);
  while(1){
    /* NOTE the first time come here,this write means nothing.
     * it's used to send back "bad code" when the below read()
     * don't meat their demanding byte and enter next turn 
     * using continue */
    Serial.write(CODE_UNKNOW);
    while(!Serial.available());
    if (Serial.read() != 'D') continue;
    if (Serial.read() != 'E') continue;
    if (Serial.read() != 'B') continue;
    if (Serial.read() != 'U') continue;
    if (Serial.read() != 'G') continue;

    break;
  }
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
      if (para == -1) {
        Serial.write(HEAVY_LATENCY);
        continue;
      }

      switch(code){
        case GET_VAR:
          /* write value of required variable to the serial */
          break;
        case GET_REG:
          /* write value of required register to the serial */
          break;

        default:
          Serial.write(CODE_UNKNOW);
          break;
      } /* end of switch */
    } /* end of if(Serial.available()) */
  } /* end of while */
}

#ifdef __cplusplus
} // end of extern "C"
#endif
