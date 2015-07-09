MCU_TARGET    = atmega8

F_CPU         = 16000000L

CC            = avr-gcc
XX            = avr-g++
AR            = avr-ar

INCDIR        = -I./include/arduino -I./include/standard
CFLAGS        = -c -g -Os -w -ffunction-sections -fdata-sections -MMD -mmcu=$(MCU_TARGET) -DF_CPU=$(F_CPU) -DARDUINO=10605 -DARDUINO_AVR_NG -DARDUINO_ARCH_AVR
CPPFLAGS      = -c -g -Os -w -fno-exceptions -ffunction-sections -fdata-sections -fno-threadsafe-statics -MMD -mmcu=$(MCU_TARGET) -DF_CPU=$(F_CPU) -DARDUINO=10605 -DARDUINO_AVR_NG -DARDUINO_ARCH_AVR
SFLAGS        = -c -g -x assembler-with-cpp -mmcu=$(MCU_TARGET) -DF_CPU=$(F_CPU) -DARDUINO=10605 -DARDUINO_AVR_NG -DARDUINO_ARCH_AVR
ARFLAGS       = rcs

LIB           = libard.a

#OBJ           = abi.o HardwareSerial3.o  new.o WInterrupts.o wiring_pulse.o \
                 CDC.o HardwareSerial.o  Print.o wiring_analog.o wiring_shift.o \
                 HardwareSerial0.o  HID.o Stream.o wiring.o WMath.o HardwareSerial1.o \
                 hooks.o Tone.o wiring_digital.o  WString.o HardwareSerial2.o \
                 IPAddress.o USBCore.o wiring_pulse.o

OBJ           = wiring_pulse.S.o wiring_pulse.c.o wiring_analog.c.o WInterrupts.c.o \
                wiring.c.o wiring_shift.c.o wiring_digital.c.o hooks.c.o new.cpp.o \
                HardwareSerial1.cpp.o Tone.cpp.o abi.cpp.o WMath.cpp.o HardwareSerial0.cpp.o \
                IPAddress.cpp.o HardwareSerial3.cpp.o HID.cpp.o WString.cpp.o Print.cpp.o \
                USBCore.cpp.o CDC.cpp.o HardwareSerial.cpp.o Stream.cpp.o HardwareSerial2.cpp.o
all: $(LIB)

$(LIB): $(OBJ)
	$(AR) $(ARFLAGS) $@ $^

del_lib:
	rm -rf $(LIB)

clean:
	rm -rf $(OBJ)
	rm -rf $(subst .o,.d,$(OBJ))

%.S.o: %.S
	$(CC) $(SFLAGS) $(INCDIR) $^ -o $@
#$(AR) $(ARFLAGS) $(LIB) $@

%.c.o: %.c
	$(CC) $(CFLAGS) $(INCDIR) $^ -o $@
#$(AR) $(ARFLAGS) $(LIB) $@

%.cpp.o: %.cpp
	$(XX) $(CPPFLAGS) $(INCDIR) $^ -o $@
#$(AR) $(ARFLAGS) $(LIB) $@
