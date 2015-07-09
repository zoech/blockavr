#include "Arduino.h"
#include "def.h"

#ifdef __cplusplus
extern "C" {
#endif

void arduino_init(){
  init();
  initVariant();

#if defined(USBCON)
    USBDevice.attach();
#endif
  return;
}

#ifdef __cplusplus
} // end of extern "C"
#endif
