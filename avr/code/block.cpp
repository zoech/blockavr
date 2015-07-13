#include "Arduino.h"
#include <avr/wdt.h>

#define debug_reset() {wdt_enable(WDTO_120MS);while(1){}}
//#define debug_reset() {}

#define __BLOCK_DEBUG
#include "def.h"

/* codes the down machine would recieve */
#define NEXT_STEP        's'
#define GET_VAR          'v'
#define GET_REG          'r'
#define RESET            'z'

/* codes the up machine would recieve */
#define CODE_UNKNOW      "N/A"
#define HEAVY_LATENCY    "L/T"
#define RESPON_END       "\n"
#define PRO_END          "END"

#ifdef __cplusplus
extern "C" {
#endif

void debug_init(long baud){
  Serial.begin(baud);
  
  while(1){
    char c;
    /* NOTE the first time come here,this write means nothing.
     * it's used to send back "bad code" when the below read()
     * don't meat their demanding byte and enter next turn 
     * using continue */
    //Serial.write(CODE_UNKNOW);
    while(!Serial.available());
    /*
    if (Serial.read() != 'D') continue;
    if (Serial.read() != 'E') continue;
    if (Serial.read() != 'B') continue;
    if (Serial.read() != 'U') continue;
    if (Serial.read() != 'G') continue;
    */

    if ( (c = Serial.read()) == RESET )
      debug_reset();
    if (c == NEXT_STEP) break;
  }
}

void block(char* id){
  /* tell the upper machine where here is */
  Serial.write(id);
  Serial.write(RESPON_END);

  /* block the process if no NEXT_STEP code in Serial.
   * and here in this while we may handle some extra 
   * tasks,like sending back variables and registers
   * value. */
  while(1){
    if(Serial.available()){
      char code;
      char para;
      if( (code = Serial.read()) == NEXT_STEP ) break;
      if( code == RESET )
        debug_reset();
        /* reset() */;


      /* the command only depend on the first "code" byte
       * should play above. the following case would use
       * the second comming byte "para". */

      /*****************************************************/

      //while( !Serial.available() );
      while( (para = Serial.read()) == -1 );

      switch(code){
        case GET_VAR:
          int num;
		  num = (int)(para - 'a');
          int i;
          for(i = 0;i < num; ++i){
            char c;
            c = (char)(((*var_p[i]) >> 8) & 0x00ff);
            Serial.write(c);
            c = (char)((*var_p[i]) & 0x00ff);
            Serial.write(c);
          }
          Serial.write(RESPON_END);
          /* write value of required variable to the serial */
          break;
        case GET_REG:
          /* write value of required register to the serial */
          break;

        default:
          Serial.write(CODE_UNKNOW);
          Serial.write(RESPON_END);
          break;
      } /* end of switch */
    } /* end of if(Serial.available()) */
  } /* end of while */
}

void block_end(){
  while(1) {
    block(PRO_END);
  }
}

#ifdef __cplusplus
} // end of extern "C"
#endif
