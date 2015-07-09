#ifndef __BLOCKAVR_DEF_H
#define  _BLOCKAVR_DEF_H


#include "Arduino.h"

#ifdef __cplusplus
extern "C" {
#endif

// Declared weak in Arduino.h to allow user redefinitions.
//int atexit(void (* /*func*/ )()) { return 0; }

// Weak empty variant initialization function.
// May be redefined by variant files.
void initVariant() __attribute__((weak));
void initVariant() { }

void arduino_init();

#ifdef __cplusplus
} // end of extern "C"
#endif

#endif
