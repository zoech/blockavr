PRG            = demo
OBJ            = demo.o block.o arduino_init.o avr_action.o
ARDUINO_LIBS   = lib/libard.a

MCU_TARGET     = atmega8
OPTIMIZE       = -O2

F_CPU          = 16000000L
DEFS           =
LIBS           = $(ARDUINO_LIBS) -L./lib -lm

# You should not have to change anything below here.

CC             = avr-gcc
XX             = avr-g++
#CC             = /usr/share/arduino/hardware/tools/avr/bin/avr-gcc
#XX             = /usr/share/arduino/hardware/tools/avr/bin/avr-g++

# Override is only needed by avr-lib build system.

CFLAGS         = -c -g -Os -w -ffunction-sections -fdata-sections -MMD -mmcu=$(MCU_TARGET) -DF_CPU=$(F_CPU) -DARDUINO=10605 -DARDUINO_AVR_NG -DARDUINO_ARCH_AVR
CPPFLAGS       = -c -g -Os -w -fno-exceptions -ffunction-sections -fdata-sections -fno-threadsafe-statics -MMD -mmcu=$(MCU_TARGET) -DF_CPU=$(F_CPU) -DARDUINO=10605 -DARDUINO_AVR_NG -DARDUINO_ARCH_AVR 
INCDIR         = -I./lib/include/arduino/ -I./lib/include/standard/
LDFLAGS        = -w -Os -mmcu=$(MCU_TARGET) -Wl,--gc-sections

OBJCOPY        = avr-objcopy
OBJDUMP        = avr-objdump
#OBJCOPY        = /usr/share/arduino/hardware/tools/avr/bin/avr-objcopy

all: $(PRG).elf lst text eeprom

download: $(PRG).hex
	#avrdude -p atmega8 -c arduino -b 19200 -P /dev/ttyUSB0 -e -U flash:w:$^
	avrdude -v -patmega8 -carduino -P/dev/rfcomm0 -b19200 -D -Uflash:w:$^:i

$(PRG).elf: $(OBJ) $(ARDUINO_LIBS)
	$(CC) $(LDFLAGS) -o $@ $^ $(LIBS)

# dependency:
%.o: %.c
	$(CC) $(CFLAGS) $(INCDIR) $^ -o $@

%.o: %.cpp
	$(XX) $(CPPFLAGS) $(INCDIR) $^ -o $@

$(ARDUINO_LIBS):
	make -C ./lib

clean:
	rm -rf *.o $(PRG).elf *.eps *.png *.pdf *.bak 
	rm -rf *.eep
	rm -rf *.lst *.map $(EXTRA_CLEAN_FILES)
	rm -rf $(subst .o,.d,$(OBJ))

lst:  $(PRG).lst

%.lst: %.elf
	$(OBJDUMP) -h -S $< > $@

# Rules for building the .text rom images

text: hex bin srec

hex:  $(PRG).hex
bin:  $(PRG).bin
srec: $(PRG).srec

%.hex: %.elf
	#$(OBJCOPY) -j .text -j .data -O ihex $< $@
	$(OBJCOPY) -O ihex -R .eeprom $< $@

%.srec: %.elf
	$(OBJCOPY) -j .text -j .data -O srec $< $@

%.bin: %.elf
	$(OBJCOPY) -j .text -j .data -O binary $< $@

# Rules for building the .eeprom rom images

eeprom: ehex ebin esrec

ehex:  $(PRG)_eeprom.hex
ebin:  $(PRG)_eeprom.bin
esrec: $(PRG)_eeprom.srec

%_eeprom.hex: %.elf
	$(OBJCOPY) -j .eeprom --change-section-lma .eeprom=0 -O ihex $< $@ \
	|| { echo empty $@ not generated; exit 0; }

%_eeprom.srec: %.elf
	$(OBJCOPY) -j .eeprom --change-section-lma .eeprom=0 -O srec $< $@ \
	|| { echo empty $@ not generated; exit 0; }

%_eeprom.bin: %.elf
	$(OBJCOPY) -j .eeprom --change-section-lma .eeprom=0 -O binary $< $@ \
	|| { echo empty $@ not generated; exit 0; }

# Every thing below here is used by avr-libc's build system and can be ignored
# by the casual user.

FIG2DEV                 = fig2dev
EXTRA_CLEAN_FILES       = *.hex *.bin *.srec

dox: eps png pdf

eps: $(PRG).eps
png: $(PRG).png
pdf: $(PRG).pdf

%.eps: %.fig
	$(FIG2DEV) -L eps $< $@

%.pdf: %.fig
	$(FIG2DEV) -L pdf $< $@

%.png: %.fig
	$(FIG2DEV) -L png $< $@

