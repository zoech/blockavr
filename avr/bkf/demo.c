#include "vcode.h"
#include "base.h"


int main(void){

    unsigned char cmd[CMD_BYTES];

    while(1){

        if( /* online */ ){
            /* read from bluetooth */
        }
        else{
            /* read from eeprom */
        }

        /* switch case */
        switch(cmd[CMD_BYTE]){
            case LANG_SETVAR:
                break;
            /* ... */
            default:
                /* unkwnow CMD handle */
                break;
        }

        if( /* online */ ){
        /* send back excute imformation */
        }
    }
}
