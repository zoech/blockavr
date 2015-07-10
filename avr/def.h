#ifndef __BLOCKAVR_DEF_H
#define __BLOCKAVR_DEF_H

#ifdef __cplusplus
extern "C" {
#endif

// Declared weak in Arduino.h to allow user redefinitions.
//int atexit(void (* /*func*/ )()) { return 0; }

// Weak empty variant initialization function.
// May be redefined by variant files.
extern void initVariant() __attribute__((weak));
extern void initVariant() { }

extern void arduino_init();

#ifdef __BLOCK_DEBUG
extern void debug_init(long baud);
extern void block(char *id);
int *var_p[16];
#endif

#ifdef __cplusplus
} // end of extern "C"
#endif

#include "Arduino.h"

#endif
