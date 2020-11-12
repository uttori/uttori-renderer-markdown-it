[toc]

## Internal Registers

| Mnemonic | Friendly Name | Description |
| -------- | ------------- | ----------- |
| A    | Accumulator   | The accumulator. This is the math register. It stores one of two operands or the result of most arithmetic and logical operations.
| X, Y | Index         | The index registers. These can be used to reference memory, to pass data to memory, or as counters for loops.
| S    | Stack Pointer | The stack pointer, points to the next available(unused) location on the stack.
| DBR / DB | Data Bank | Data bank register, holds the default bank for memory transfers.
| D / DP | Direct Page | Direct page register, used for direct page addressing modes. Holds the memory bank address of the data the CPU is accessing.
| PB / PBR | Program Bank | Program Bank, holds the bank address of all instruction fetches.
| P | Processor Status | Holds various important flags, results of tests and 65816 processing states. See below.
| PC | Program Counter | Holds the memory address of the current CPU instruction

### Flags stored in P Register

| Mnemonic | Value | Binary Value | Description |
| -------- | ----- | ------------ | ----------- |
| N | #$80 | 10000000 | Negative |
| V | #$40 | 01000000 | Overflow |
| M | #$20 | 00100000 | Accumulator register size (native mode only)<br/>(0 = 16-bit, 1 = 8-bit) |
| X | #$10 | 00010000 | Index register size (native mode only)<br/>(0 = 16-bit, 1 = 8-bit) |
| D | #$08 | 00001000 | Decimal |
| I | #$04 | 00000100 | IRQ disable |
| Z | #$02 | 00000010 | Zero |
| C | #$01 | 00000001 | Carry |
| E |  |  | 6502 emulation mode |
| B | #$10 | 00010000 | Break (emulation mode only) |

## Addressing Modes

| Mode | Example |
| ---- | ------- |
| Implied | PHB |
| Immediate[MemoryFlag] | AND #1 or 2 bytes |
| Immediate[IndexFlag] | LDX #1 or 2 bytes |
| Immediate[8-Bit] | SEP #byte |
| Relative | BEQ byte (signed) |
| Relative long | BRL 2 bytes (signed) |
| Direct | AND byte |
| Direct indexed (with X) | AND byte, x |
| Direct indexed (with Y) | AND byte, y |
| Direct indirect | AND (byte) |
| Direct indexed indirect | AND (byte, x) |
| Direct indirect indexed | AND (byte), y |
| Direct indirect long | AND \[byte\] |
| Direct indirect indexed long | AND \[byte\], y |
| Absolute | AND 2bytes |
| Absolute indexed (with X) | AND 2bytes, x |
| Absolute indexed (with Y) | AND 2bytes, y |
| Absolute long | AND 3bytes |
| Absolute indexed long | AND 3bytes, x |
| Stack relative | AND byte, s |
| Stack relative indirect indexed | AND (byte, s), y |
| Absolute indirect | JMP (2bytes) |
| Absolute indirect long | JML \[2bytes] |
| Absolute indexed indirect | JMP/JSR (2bytes,x) |
| Implied accumulator | INC |
| Block move | MVN/MVP byte, byte |

## Instructions
Instructions are a breakdown of machine code. For the SNES, they consist of a 1-byte opcode followed by a 0-3 byte operand. Full instructions may be known as words. For example, the instruction `ADC $3a` occupies 2 bytes in memory, and if assembled, it would be stored as `E6 3A`.

Most instructions that are at least 2 bytes long have more than one addressing mode. Addressing modes are put in place so basic instructions may be interpreted correctly given a wide range of operands.

| Assembler Example  | Alias | Proper Name                                         | HEX | Addressing Mode               | Flags Set | Bytes | Cycles |
| ------------------ | ----- | --------------------------------------------------- | --- | ----------------------------- | --------- | ----- | ------ |
| ADC (_dp_,X)       |       | Add With Carry                                      |  61 | DP Indexed Indirect,X         | NV----ZC  |     2 | 6[^1][^2] |
| ADC _sr_,S         |       | Add With Carry                                      |  63 | Stack Relative                | NV----ZC  |     2 | 4[^1] |
| ADC _dp_           |       | Add With Carry                                      |  65 | Direct Page                   | NV----ZC  |     2 | 3[^1][^2] |
| ADC \[_dp_\]       |       | Add With Carry                                      |  67 | DP Indirect Long              | NV----ZC  |     2 | 6[^1][^2] |
| ADC _#const_       |       | Add With Carry                                      |  69 | Immediate                     | NV----ZC  |     2[^12] | 2[^1] |
| ADC _addr_         |       | Add With Carry                                      |  6D | Absolute                      | NV----ZC  |     3 | 4[^1] |
| ADC _long_         |       | Add With Carry                                      |  6F | Absolute Long                 | NV----ZC  |     4 | 5[^1] |
| ADC ( _dp_),Y      |       | Add With Carry                                      |  71 | DP Indirect Indexed, Y        | NV----ZC  |     2 | 5[^1][^2][^3] |
| ADC (_dp_)         |       | Add With Carry                                      |  72 | DP Indirect                   | NV----ZC  |     2 | 5[^1][^2] |
| ADC (_sr_,S),Y     |       | Add With Carry                                      |  73 | SR Indirect Indexed,Y         | NV----ZC  |     2 | 7[^1] |
| ADC _dp_,X         |       | Add With Carry                                      |  75 | DP Indexed,X                  | NV----ZC  |     2 | 4[^1][^2] |
| ADC \[_dp_\],Y     |       | Add With Carry                                      |  77 | DP Indirect Long Indexed, Y   | NV----ZC  |     2 | 6[^1][^2] |
| ADC _addr_,Y       |       | Add With Carry                                      |  79 | Absolute Indexed,Y            | NV----ZC  |     3 | 4[^1][^3] |
| ADC _addr_,X       |       | Add With Carry                                      |  7D | Absolute Indexed,X            | NV----ZC  |     3 | 4[^1][^3] |
| ADC  _long_,X      |       | Add With Carry                                      |  7F | Absolute Long Indexed,X       | NV----ZC  |     4 | 5[^1] |
| AND (_dp,_X)       |       | AND Accumulator with Memory                         |  21 | DP Indexed Indirect,X         | N-----Z-  |     2 | 6[^1][^2] |
| AND _sr,S_         |       | AND Accumulator with Memory                         |  23 | Stack Relative                | N-----Z-  |     2 | 4[^1] |
| AND _dp_           |       | AND Accumulator with Memory                         |  25 | Direct Page                   | N-----Z-  |     2 | 3[^1][^2] |
| AND \[_dp_\]       |       | AND Accumulator with Memory                         |  27 | DP Indirect Long              | N-----Z-  |     2 | 6[^1][^2] |
| AND _#const_       |       | AND Accumulator with Memory                         |  29 | Immediate                     | N-----Z-  |     2[^12] | 2[^1] |
| AND _addr_         |       | AND Accumulator with Memory                         |  2D | Absolute                      | N-----Z-  |     3 | 4[^1] |
| AND _long_         |       | AND Accumulator with Memory                         |  2F | Absolute Long                 | N-----Z-  |     4 | 5[^1] |
| AND (_dp_),Y       |       | AND Accumulator with Memory                         |  31 | DP Indirect Indexed, Y        | N-----Z-  |     2 | 5[^1][^2][^3] |
| AND (_dp_)         |       | AND Accumulator with Memory                         |  32 | DP Indirect                   | N-----Z-  |     2 | 5[^1][^2] |
| AND (_sr_,S),Y     |       | AND Accumulator with Memory                         |  33 | SR Indirect Indexed,Y         | N-----Z-  |     2 | 7[^1] |
| AND _dp_,X         |       | AND Accumulator with Memory                         |  35 | DP Indexed,X                  | N-----Z-  |     2 | 4[^1][^2] |
| AND \[_dp_\],Y     |       | AND Accumulator with Memory                         |  37 | DP Indirect Long Indexed, Y   | N-----Z-  |     2 | 6[^1][^2] |
| AND _addr_,Y       |       | AND Accumulator with Memory                         |  39 | Absolute Indexed,Y            | N-----Z-  |     3 | 4[^1][^3] |
| AND _addr_,X       |       | AND Accumulator with Memory                         |  3D | Absolute Indexed,X            | N-----Z-  |     3 | 4[^1][^3] |
| AND  _long_,X      |       | AND Accumulator with Memory                         |  3F | Absolute Long Indexed,X       | N-----Z-  |     4 | 5[^1] |
| ASL _dp_           |       | Arithmetic Shift Left                               |  06 | Direct Page                   | N-----ZC  |     2 | 5[^2][^4] |
| ASL A              |       | Arithmetic Shift Left                               |  0A | Accumulator                   | N-----ZC  |     1 | 2 |
| ASL _addr_         |       | Arithmetic Shift Left                               |  0E | Absolute                      | N-----ZC  |     3 | 6[^4] |
| ASL _dp_,X         |       | Arithmetic Shift Left                               |  16 | DP Indexed,X                  | N-----ZC  |     2 | 6[^2][^4] |
| ASL _addr_,X       |       | Arithmetic Shift Left                               |  1E | Absolute Indexed,X            | N-----ZC  |     3 | 7[^4] |
| BCC _nearlabel_    | BLT   | Branch if Carry Clear                               |  90 | Program Counter Relative      |           |     2 | 2[^5][^6] |
| BCS _nearlabel_    | BGE   | Branch if Carry Set                                 |  B0 | Program Counter Relative      |           |     2 | 2[^5][^6] |
| BEQ _nearlabel_    |       | Branch if Equal                                     |  F0 | Program Counter Relative      |           |     2 | 2[^5][^6] |
| BIT _dp_           |       | Test Bits                                           |  24 | Direct Page                   | NV----Z-  |     2 | 3[^1][^2] |
| BIT _addr_         |       | Test Bits                                           |  2C | Absolute                      | NV----Z-  |     3 | 4[^1] |
| BIT _dp_,X         |       | Test Bits                                           |  34 | DP Indexed,X                  | NV----Z-  |     2 | 4[^1][^2] |
| BIT _addr_,X       |       | Test Bits                                           |  3C | Absolute Indexed,X            | NV----Z-  |     3 | 4[^1][^3] |
| BIT _#const_       |       | Test Bits                                           |  89 | Immediate                     | ------Z-  |     2[^12] | 2[^1] |
| BMI _nearlabel_    |       | Branch if Minus                                     |  30 | Program Counter Relative      |           |     2 | 2[^5][^6] |
| BNE _nearlabel_    |       | Branch if Not Equal                                 |  D0 | Program Counter Relative      |           |     2 | 2[^5][^6] |
| BPL _nearlabel_    |       | Branch if Plus                                      |  10 | Program Counter Relative      |           |     2 | 2[^5][^6] |
| BRA _nearlabel_    |       | Branch Always                                       |  80 | Program Counter Relative      |           |     2 | 3[^6] |
| BRK                |       | Break                                               |  00 | Stack/Interrupt               | ----DI--  |     2[^13]  | 7[^7] |
| BRL _label_        |       | Branch Long Always                                  |  82 | Program Counter Relative Long |           |     3 | 4 |
| BVC _nearlabel_    |       | Branch if Overflow Clear                            |  50 | Program Counter Relative      |           |     2 | 2[^5][^6] |
| BVS _nearlabel_    |       | Branch if Overflow Set                              |  70 | Program Counter Relative      |           |     2 | 2[^5][^6] |
| CLC                |       | Clear Carry                                         |  18 | Implied                       | -------C  |     1 | 2 |
| CLD                |       | Clear Decimal Mode Flag                             |  D8 | Implied                       | ----D---  |     1 | 2 |
| CLI                |       | Clear Interrupt Disable Flag                        |  58 | Implied                       | -----I--  |     1 | 2 |
| CLV                |       | Clear Overflow Flag                                 |  B8 | Implied                       | -V------  |     1 | 2 |
| CMP (_dp,_X)       |       | Compare Accumulator with Memory                     |  C1 | DP Indexed Indirect,X         | N-----ZC  |     2 | 6[^1][^2] |
| CMP _sr_,S         |       | Compare Accumulator with Memory                     |  C3 | Stack Relative                | N-----ZC  |     2 | 4[^1] |
| CMP _dp_           |       | Compare Accumulator with Memory                     |  C5 | Direct Page                   | N-----ZC  |     2 | 3[^1][^2] |
| CMP \[_dp_\]       |       | Compare Accumulator with Memory                     |  C7 | DP Indirect Long              | N-----ZC  |     2 | 6[^1][^2] |
| CMP _#const_       |       | Compare Accumulator with Memory                     |  C9 | Immediate                     | N-----ZC  |     2[^12] | 2[^1] |
| CMP _addr_         |       | Compare Accumulator with Memory                     |  CD | Absolute                      | N-----ZC  |     3 | 4[^1] |
| CMP _long_         |       | Compare Accumulator with Memory                     |  CF | Absolute Long                 | N-----ZC  |     4 | 5[^1] |
| CMP (_dp_),Y       |       | Compare Accumulator with Memory                     |  D1 | DP Indirect Indexed, Y        | N-----ZC  |     2 | 5[^1][^2][^3] |
| CMP (_dp_)         |       | Compare Accumulator with Memory                     |  D2 | DP Indirect                   | N-----ZC  |     2 | 5[^1][^2] |
| CMP (_sr_,S),Y     |       | Compare Accumulator with Memory                     |  D3 | SR Indirect Indexed,Y         | N-----ZC  |     2 | 7[^1] |
| CMP _dp_,X         |       | Compare Accumulator with Memory                     |  D5 | DP Indexed,X                  | N-----ZC  |     2 | 4[^1][^2] |
| CMP \[_dp_\],Y     |       | Compare Accumulator with Memory                     |  D7 | DP Indirect Long Indexed, Y   | N-----ZC  |     2 | 6[^1][^2] |
| CMP _addr_,Y       |       | Compare Accumulator with Memory                     |  D9 | Absolute Indexed,Y            | N-----ZC  |     3 | 4[^1][^3] |
| CMP _addr_,X       |       | Compare Accumulator with Memory                     |  DD | Absolute Indexed,X            | N-----ZC  |     3 | 4[^1][^3] |
| CMP  _long_,X      |       | Compare Accumulator with Memory                     |  DF | Absolute Long Indexed,X       | N-----ZC  |     4 | 5[^1] |
| COP _const_        |       | Co-Processor Enable                                 |  02 | Stack/Interrupt               | ----DI--  |     2[^13]  | 7[^7] |
| CPX _#const_       |       | Compare Index Register X with Memory                |  E0 | Immediate                     | N-----ZC  |     2[^14]  | 2[^8] |
| CPX _dp_           |       | Compare Index Register X with Memory                |  E4 | Direct Page                   | N-----ZC  |     2 | 3[^2][^8] |
| CPX _addr_         |       | Compare Index Register X with Memory                |  EC | Absolute                      | N-----ZC  |     3 | 4[^8] |
| CPY _#const_       |       | Compare Index Register Y with Memory                |  C0 | Immediate                     | N-----ZC  |     2[^14]  | 2[^8] |
| CPY _dp_           |       | Compare Index Register Y with Memory                |  C4 | Direct Page                   | N-----ZC  |     2 | 3[^2][^8] |
| CPY _addr_         |       | Compare Index Register Y with Memory                |  CC | Absolute                      | N-----ZC  |     3 | 4[^8] |
| DEC A              | DEA   | Decrement                                           |  3A | Accumulator                   | N-----Z-  |     1 | 2 |
| DEC _dp_           |       | Decrement                                           |  C6 | Direct Page                   | N-----Z-  |     2 | 5[^2][^4] |
| DEC _addr_         |       | Decrement                                           |  CE | Absolute                      | N-----Z-  |     3 | 6[^4] |
| DEC _dp_,X         |       | Decrement                                           |  D6 | DP Indexed,X                  | N-----Z-  |     2 | 6[^2][^4] |
| DEC _addr_,X       |       | Decrement                                           |  DE | Absolute Indexed,X            | N-----Z-  |     3 | 7[^4] |
| DEX                |       | Decrement Index Register X                          |  CA | Implied                       | N-----Z-  |     1 | 2 |
| DEY                |       | Decrement Index Register Y                          |  88 | Implied                       | N-----Z-  |     1 | 2 |
| EOR (_dp,_X)       |       | Exclusive-OR Accumulator with Memory                |  41 | DP Indexed Indirect,X         | N-----Z-  |     2 | 6[^1][^2] |
| EOR _sr_,S         |       | Exclusive-OR Accumulator with Memory                |  43 | Stack Relative                | N-----Z-  |     2 | 4[^1] |
| EOR _dp_           |       | Exclusive-OR Accumulator with Memory                |  45 | Direct Page                   | N-----Z-  |     2 | 3[^1][^2] |
| EOR \[_dp_\]       |       | Exclusive-OR Accumulator with Memory                |  47 | DP Indirect Long              | N-----Z-  |     2 | 6[^1][^2] |
| EOR _#const_       |       | Exclusive-OR Accumulator with Memory                |  49 | Immediate                     | N-----Z-  |     2[^12] | 2[^1] |
| EOR _addr_         |       | Exclusive-OR Accumulator with Memory                |  4D | Absolute                      | N-----Z-  |     3 | 4[^1] |
| EOR _long_         |       | Exclusive-OR Accumulator with Memory                |  4F | Absolute Long                 | N-----Z-  |     4 | 5[^1] |
| EOR (_dp_),Y       |       | Exclusive-OR Accumulator with Memory                |  51 | DP Indirect Indexed, Y        | N-----Z-  |     2 | 5[^1][^2][^3] |
| EOR (_dp_)         |       | Exclusive-OR Accumulator with Memory                |  52 | DP Indirect                   | N-----Z-  |     2 | 5[^1][^2] |
| EOR (_sr_,S),Y     |       | Exclusive-OR Accumulator with Memory                |  53 | SR Indirect Indexed,Y         | N-----Z-  |     2 | 7[^1] |
| EOR _dp_,X         |       | Exclusive-OR Accumulator with Memory                |  55 | DP Indexed,X                  | N-----Z-  |     2 | 4[^1][^2] |
| EOR \[_dp_\],Y     |       | Exclusive-OR Accumulator with Memory                |  57 | DP Indirect Long Indexed, Y   | N-----Z-  |     2 | 6[^1][^2] |
| EOR _addr_,Y       |       | Exclusive-OR Accumulator with Memory                |  59 | Absolute Indexed,Y            | N-----Z-  |     3 | 4[^1][^3] |
| EOR _addr_,X       |       | Exclusive-OR Accumulator with Memory                |  5D | Absolute Indexed,X            | N-----Z-  |     3 | 4[^1][^3] |
| EOR  _long_,X      |       | Exclusive-OR Accumulator with Memory                |  5F | Absolute Long Indexed,X       | N-----Z-  |     4 | 5[^1] |
| INC A              | INA   | Increment                                           |  1A | Accumulator                   | N-----Z-  |     1 | 2 |
| INC _dp_           |       | Increment                                           |  E6 | Direct Page                   | N-----Z-  |     2 | 5[^2][^4] |
| INC _addr_         |       | Increment                                           |  EE | Absolute                      | N-----Z-  |     3 | 6[^4] |
| INC _dp_,X         |       | Increment                                           |  F6 | DP Indexed,X                  | N-----Z-  |     2 | 6[^2][^4] |
| INC _addr_,X       |       | Increment                                           |  FE | Absolute Indexed,X            | N-----Z-  |     3 | 7[^4] |
| INX                |       | Increment Index Register X                          |  E8 | Implied                       | N-----Z-  |     1 | 2 |
| INY                |       | Increment Index Register Y                          |  C8 | Implied                       | N-----Z-  |     1 | 2 |
| JMP _addr_         |       | Jump                                                |  4C | Absolute                      |           |     3 | 3 |
| JMP _long_         | JML   | Jump                                                |  5C | Absolute Long                 |           |     4 | 4 |
| JMP (_addr_)       |       | Jump                                                |  6C | Absolute Indirect             |           |     3 | 5 |
| JMP (_addr,X_)     |       | Jump                                                |  7C | Absolute Indexed Indirect     |           |     3 | 6 |
| JMP _\[addr\]_     | JML   | Jump                                                |  DC | Absolute Indirect Long        |           |     3 | 6 |
| JSR _addr_         |       | Jump to Subroutine                                  |  20 | Absolute                      |           |     3 | 6 |
| JSR _long_         | JSL   | Jump to Subroutine                                  |  22 | Absolute Long                 |           |     4 | 8 |
| JSR _(addr,X)_)    |       | Jump to Subroutine                                  |  FC | Absolute Indexed Indirect     |           |     3 | 8 |
| LDA (_dp,_X)       |       | Load Accumulator from Memory                        |  A1 | DP Indexed Indirect,X         | N-----Z-  |     2 | 6[^1][^2] |
| LDA _sr,S_         |       | Load Accumulator from Memory                        |  A3 | Stack Relative                | N-----Z-  |     2 | 4[^1] |
| LDA _dp_           |       | Load Accumulator from Memory                        |  A5 | Direct Page                   | N-----Z-  |     2 | 3[^1][^2] |
| LDA \[_dp_\]       |       | Load Accumulator from Memory                        |  A7 | DP Indirect Long              | N-----Z-  |     2 | 6[^1][^2] |
| LDA _#const_       |       | Load Accumulator from Memory                        |  A9 | Immediate                     | N-----Z-  |     2[^12] | 2[^1] |
| LDA _addr_         |       | Load Accumulator from Memory                        |  AD | Absolute                      | N-----Z-  |     3 | 4[^1] |
| LDA _long_         |       | Load Accumulator from Memory                        |  AF | Absolute Long                 | N-----Z-  |     4 | 5[^1] |
| LDA (_dp_),Y       |       | Load Accumulator from Memory                        |  B1 | DP Indirect Indexed, Y        | N-----Z-  |     2 | 5[^1][^2][^3] |
| LDA (_dp_)         |       | Load Accumulator from Memory                        |  B2 | DP Indirect                   | N-----Z-  |     2 | 5[^1][^2] |
| LDA (_sr_,S),Y     |       | Load Accumulator from Memory                        |  B3 | SR Indirect Indexed,Y         | N-----Z-  |     2 | 7[^1] |
| LDA _dp_,X         |       | Load Accumulator from Memory                        |  B5 | DP Indexed,X                  | N-----Z-  |     2 | 4[^1][^2] |
| LDA \[_dp_\],Y     |       | Load Accumulator from Memory                        |  B7 | DP Indirect Long Indexed, Y   | N-----Z-  |     2 | 6[^1][^2] |
| LDA _addr_,Y       |       | Load Accumulator from Memory                        |  B9 | Absolute Indexed,Y            | N-----Z-  |     3 | 4[^1][^3] |
| LDA _addr_,X       |       | Load Accumulator from Memory                        |  BD | Absolute Indexed,X            | N-----Z-  |     3 | 4[^1][^3] |
| LDA  _long_,X      |       | Load Accumulator from Memory                        |  BF | Absolute Long Indexed,X       | N-----Z-  |     4 | 5[^1] |
| LDX _#const_       |       | Load Index Register X from Memory                   |  A2 | Immediate                     | N-----Z-  |     2[^14] | 2[^8] |
| LDX _dp_           |       | Load Index Register X from Memory                   |  A6 | Direct Page                   | N-----Z-  |     2 | 3[^2][^8] |
| LDX _addr_         |       | Load Index Register X from Memory                   |  AE | Absolute                      | N-----Z-  |     3 | 4[^8] |
| LDX _dp_,Y         |       | Load Index Register X from Memory                   |  B6 | DP Indexed,Y                  | N-----Z-  |     2 | 4[^2][^8] |
| LDX _addr_,Y       |       | Load Index Register X from Memory                   |  BE | Absolute Indexed,Y            | N-----Z-  |     3 | 4[^3][^8] |
| LDY _#const_       |       | Load Index Register Y from Memory                   |  A0 | Immediate                     | N-----Z-  |     2[^14]  | 2[^8] |
| LDY _dp_           |       | Load Index Register Y from Memory                   |  A4 | Direct Page                   | N-----Z-  |     2 | 3[^2][^8] |
| LDY _addr_         |       | Load Index Register Y from Memory                   |  AC | Absolute                      | N-----Z-  |     3 | 4[^8] |
| LDY _dp_,X         |       | Load Index Register Y from Memory                   |  B4 | DP Indexed,X                  | N-----Z-  |     2 | 4[^2][^8] |
| LDY _addr_,X       |       | Load Index Register Y from Memory                   |  BC | Absolute Indexed,X            | N-----Z-  |     3 | 4[^3][^8] |
| LSR _dp_           |       | Logical Shift Memory or Accumulator Right           |  46 | Direct Page                   | N-----ZC  |     2 | 5[^2][^4] |
| LSR A              |       | Logical Shift Memory or Accumulator Right           |  4A | Accumulator                   | N-----ZC  |     1 | 2 |
| LSR _addr_         |       | Logical Shift Memory or Accumulator Right           |  4E | Absolute                      | N-----ZC  |     3 | 6[^4] |
| LSR _dp_,X         |       | Logical Shift Memory or Accumulator Right           |  56 | DP Indexed,X                  | N-----ZC  |     2 | 6[^2][^4] |
| LSR _addr_,X       |       | Logical Shift Memory or Accumulator Right           |  5E | Absolute Indexed,X            | N-----ZC  |     3 | 7[^4] |
| MVN _srcbk,destbk_ |       | Block Move Negative                                 |  54 | Block Move                    |           |     3 | 1[^3] |
| MVP _srcbk,destbk_ |       | Block Move Positive                                 |  44 | Block Move                    |           |     3 | 1[^3] |
| NOP                |       | No Operation                                        |  EA | Implied                       |           |     1 | 2 |
| ORA (_dp_,X)       |       | OR Accumulator with Memory                          |  01 | DP Indexed Indirect,X         | N-----Z-  |     2 | 6[^1][^2] |
| ORA _sr_,S         |       | OR Accumulator with Memory                          |  03 | Stack Relative                | N-----Z-  |     2 | 4[^1] |
| ORA _dp_           |       | OR Accumulator with Memory                          |  05 | Direct Page                   | N-----Z-  |     2 | 3[^1][^2] |
| ORA \[_dp_\]       |       | OR Accumulator with Memory                          |  07 | DP Indirect Long              | N-----Z-  |     2 | 6[^1][^2] |
| ORA _#const_       |       | OR Accumulator with Memory                          |  09 | Immediate                     | N-----Z-  |     2[^12] | 2[^1] |
| ORA _addr_         |       | OR Accumulator with Memory                          |  0D | Absolute                      | N-----Z-  |     3 | 4[^1] |
| ORA _long_         |       | OR Accumulator with Memory                          |  0F | Absolute Long                 | N-----Z-  |     4 | 5[^1] |
| ORA (_dp_),Y       |       | OR Accumulator with Memory                          |  11 | DP Indirect Indexed, Y        | N-----Z-  |     2 | 5[^1][^2][^3] |
| ORA (_dp_)         |       | OR Accumulator with Memory                          |  12 | DP Indirect                   | N-----Z-  |     2 | 5[^1][^2] |
| ORA (_sr_,S),Y     |       | OR Accumulator with Memory                          |  13 | SR Indirect Indexed,Y         | N-----Z-  |     2 | 7[^1] |
| ORA _dp_,X         |       | OR Accumulator with Memory                          |  15 | DP Indexed,X                  | N-----Z-  |     2 | 4[^1][^2] |
| ORA \[_dp_\],Y     |       | OR Accumulator with Memory                          |  17 | DP Indirect Long Indexed, Y   | N-----Z-  |     2 | 6[^1][^2] |
| ORA _addr_,Y       |       | OR Accumulator with Memory                          |  19 | Absolute Indexed,Y            | N-----Z-  |     3 | 4[^1][^3] |
| ORA _addr_,X       |       | OR Accumulator with Memory                          |  1D | Absolute Indexed,X            | N-----Z-  |     3 | 4[^1][^3] |
| ORA  _long_,X      |       | OR Accumulator with Memory                          |  1F | Absolute Long Indexed,X       | N-----Z-  |     4 | 5[^1] |
| PEA _addr_         |       | Push Effective Absolute Address                     |  F4 | Stack (Absolute)              |           |     3 | 5 |
| PEI _(dp)_         |       | Push Effective Indirect Address                     |  D4 | Stack (DP Indirect)           |           |     2 | 6[^2] |
| PER _label_        |       | Push Effective PC Relative Indirect Address         |  62 | Stack (PC Relative Long)      |           |     3 | 6 |
| PHA                |       | Push Accumulator                                    |  48 | Stack (Push)                  |           |     1 | 3[^1] |
| PHB                |       | Push Data Bank Register                             |  8B | Stack (Push)                  |           |     1 | 3 |
| PHD                |       | Push Direct Page Register                           |  0B | Stack (Push)                  |           |     1 | 4 |
| PHK                |       | Push Program Bank Register                          |  4B | Stack (Push)                  |           |     1 | 3 |
| [PHP](/php)        |       | Push Processor Status Register                      |  08 | Stack (Push)                  |           |     1 | 3 |
| PHX                |       | Push Index Register X                               |  DA | Stack (Push)                  |           |     1 | 3[^8] |
| PHY                |       | Push Index Register Y                               |  5A | Stack (Push)                  |           |     1 | 3[^8] |
| PLA                |       | Pull Accumulator                                    |  68 | Stack (Pull)                  | N-----Z-  |     1 | 4[^1] |
| PLB                |       | Pull Data Bank Register                             |  AB | Stack (Pull)                  | N-----Z-  |     1 | 4 |
| PLD                |       | Pull Direct Page Register                           |  2B | Stack (Pull)                  | N-----Z-  |     1 | 5 |
| PLP                |       | Pull Processor Status Register                      |  28 | Stack (Pull)                  | NVMXDIZC  |     1 | 4 |
| PLX                |       | Pull Index Register X                               |  FA | Stack (Pull)                  | N-----Z-  |     1 | 4[^8] |
| PLY                |       | Pull Index Register Y                               |  7A | Stack (Pull)                  | N-----Z-  |     1 | 4[^8] |
| REP _#const_       |       | Reset Processor Status Bits                         |  C2 | Immediate                     | NVMXDIZC  |     2 | 3 |
| ROL _dp_           |       | Rotate Memory or Accumulator Left                   |  26 | Direct Page                   | N-----ZC  |     2 | 5[^2][^4] |
| ROL A              |       | Rotate Memory or Accumulator Left                   |  2A | Accumulator                   | N-----ZC  |     1 | 2 |
| ROL _addr_         |       | Rotate Memory or Accumulator Left                   |  2E | Absolute                      | N-----ZC  |     3 | 6[^4] |
| ROL _dp_,X         |       | Rotate Memory or Accumulator Left                   |  36 | DP Indexed,X                  | N-----ZC  |     2 | 6[^2][^4] |
| ROL _addr_,X       |       | Rotate Memory or Accumulator Left                   |  3E | Absolute Indexed,X            | N-----ZC  |     3 | 7[^4] |
| ROR _dp_           |       | Rotate Memory or Accumulator Right                  |  66 | Direct Page                   | N-----ZC  |     2 | 5[^2][^4] |
| ROR A              |       | Rotate Memory or Accumulator Right                  |  6A | Accumulator                   | N-----ZC  |     1 | 2 |
| ROR _addr_         |       | Rotate Memory or Accumulator Right                  |  6E | Absolute                      | N-----ZC  |     3 | 6[^4] |
| ROR _dp_,X         |       | Rotate Memory or Accumulator Right                  |  76 | DP Indexed,X                  | N-----ZC  |     2 | 6[^2][^4] |
| ROR _addr_,X       |       | Rotate Memory or Accumulator Right                  |  7E | Absolute Indexed,X            | N-----ZC  |     3 | 7[^4] |
| RTI                |       | Return from Interrupt                               |  40 | Stack (RTI)                   | NVMXDIZC  |     1 | 6[^7] |
| RTL                |       | Return from Subroutine Long                         |  6B | Stack (RTL)                   |           |     1 | 6 |
| RTS                |       | Return from Subroutine                              |  60 | Stack (RTS)                   |           |     1 | 6 |
| SBC (_dp,_X)       |       | Subtract with Borrow from Accumulator               |  E1 | DP Indexed Indirect,X         | NV----ZC  |     2 | 6[^1][^2] |
| SBC _sr_,S         |       | Subtract with Borrow from Accumulator               |  E3 | Stack Relative                | NV----ZC  |     2 | 4[^1] |
| SBC _dp_           |       | Subtract with Borrow from Accumulator               |  E5 | Direct Page                   | NV----ZC  |     2 | 3[^1][^2] |
| SBC \[_dp_\]       |       | Subtract with Borrow from Accumulator               |  E7 | DP Indirect Long              | NV----ZC  |     2 | 6[^1][^2] |
| SBC _#const_       |       | Subtract with Borrow from Accumulator               |  E9 | Immediate                     | NV----ZC  |     2[^12] | 2[^1] |
| SBC _addr_         |       | Subtract with Borrow from Accumulator               |  ED | Absolute                      | NV----ZC  |     3 | 4[^1] |
| SBC _long_         |       | Subtract with Borrow from Accumulator               |  EF | Absolute Long                 | NV----ZC  |     4 | 5[^1] |
| SBC (_dp_),Y       |       | Subtract with Borrow from Accumulator               |  F1 | DP Indirect Indexed, Y        | NV----ZC  |     2 | 5[^1][^2][^3] |
| SBC (_dp_)         |       | Subtract with Borrow from Accumulator               |  F2 | DP Indirect                   | NV----ZC  |     2 | 5[^1][^2] |
| SBC (_sr_,S),Y     |       | Subtract with Borrow from Accumulator               |  F3 | SR Indirect Indexed,Y         | NV----ZC  |     2 | 7[^1] |
| SBC _dp_,X         |       | Subtract with Borrow from Accumulator               |  F5 | DP Indexed,X                  | NV----ZC  |     2 | 4[^1][^2] |
| SBC \[_dp_\],Y     |       | Subtract with Borrow from Accumulator               |  F7 | DP Indirect Long Indexed, Y   | NV----ZC  |     2 | 6[^1][^2] |
| SBC _addr_,Y       |       | Subtract with Borrow from Accumulator               |  F9 | Absolute Indexed,Y            | NV----ZC  |     3 | 4[^1][^3] |
| SBC _addr_,X       |       | Subtract with Borrow from Accumulator               |  FD | Absolute Indexed,X            | NV----ZC  |     3 | 4[^1][^3] |
| SBC  _long_,X      |       | Subtract with Borrow from Accumulator               |  FF | Absolute Long Indexed,X       | NV----ZC  |     4 | 5[^1] |
| SEC                |       | Set Carry Flag                                      |  38 | Implied                       | -------C  |     1 | 2 |
| SED                |       | Set Decimal Flag                                    |  F8 | Implied                       | ----D---  |     1 | 2 |
| SEI                |       | Set Interrupt Disable Flag                          |  78 | Implied                       | -----I--  |     1 | 2 |
| SEP _#const_       |       | Set Processor Status Bits                         |  E2 | Immediate                     | NVMXDIZC  |     2 | 3 |
| STA (_dp,_X)       |       | Store Accumulator to Memory                         |  81 | DP Indexed Indirect,X         |           |     2 | 6[^1][^2] |
| STA _sr_,S         |       | Store Accumulator to Memory                         |  83 | Stack Relative                |           |     2 | 4[^1] |
| STA _dp_           |       | Store Accumulator to Memory                         |  85 | Direct Page                   |           |     2 | 3[^1][^2] |
| STA \[_dp_\]       |       | Store Accumulator to Memory                         |  87 | DP Indirect Long              |           |     2 | 6[^1][^2] |
| STA _addr_         |       | Store Accumulator to Memory                         |  8D | Absolute                      |           |     3 | 4[^1] |
| STA _long_         |       | Store Accumulator to Memory                         |  8F | Absolute Long                 |           |     4 | 5[^1] |
| STA (_dp_),Y       |       | Store Accumulator to Memory                         |  91 | DP Indirect Indexed, Y        |           |     2 | 6[^1][^2] |
| STA (_dp_)         |       | Store Accumulator to Memory                         |  92 | DP Indirect                   |           |     2 | 5[^1][^2] |
| STA (_sr_,S),Y     |       | Store Accumulator to Memory                         |  93 | SR Indirect Indexed,Y         |           |     2 | 7[^1] |
| STA _dp_X          |       | Store Accumulator to Memory                         |  95 | DP Indexed,X                  |           |     2 | 4[^1][^2] |
| STA \[_dp_\],Y     |       | Store Accumulator to Memory                         |  97 | DP Indirect Long Indexed, Y   |           |     2 | 6[^1][^2] |
| STA _addr_,Y       |       | Store Accumulator to Memory                         |  99 | Absolute Indexed,Y            |           |     3 | 5[^1] |
| STA _addr_,X       |       | Store Accumulator to Memory                         |  9D | Absolute Indexed,X            |           |     3 | 5[^1] |
| STA  _long_,X      |       | Store Accumulator to Memory                         |  9F | Absolute Long Indexed,X       |           |     4 | 5[^1] |
| STP                |       | Stop Processor                                      |  DB | Implied                       |           |     1 | 3[^9] |
| STX _dp_           |       | Store Index Register X to Memory                    |  86 | Direct Page                   |           |     2 | 3[^2][^8] |
| STX _addr_         |       | Store Index Register X to Memory                    |  8E | Absolute                      |           |     3 | 4[^8] |
| STX _dp_,Y         |       | Store Index Register X to Memory                    |  96 | DP Indexed,Y                  |           |     2 | 4[^2][^8] |
| STY _dp_           |       | Store Index Register Y to Memory                    |  84 | Direct Page                   |           |     2 | 3[^2][^8] |
| STY _addr_         |       | Store Index Register Y to Memory                    |  8C | Absolute                      |           |     3 | 4[^8] |
| STY _dp_,X         |       | Store Index Register Y to Memory                    |  94 | DP Indexed,X                  |           |     2 | 4[^2][^8] |
| STZ _dp_           |       | Store Zero to Memory                                |  64 | Direct Page                   |           |     2 | 3[^1][^2] |
| STZ _dp_,X         |       | Store Zero to Memory                                |  74 | DP Indexed,X                  |           |     2 | 4[^1][^2] |
| STZ _addr_         |       | Store Zero to Memory                                |  9C | Absolute                      |           |     3 | 4[^1] |
| STZ _addr_,X       |       | Store Zero to Memory                                |  9E | Absolute Indexed,X            |           |     3 | 5[^1] |
| TAX                |       | Transfer Accumulator to Index Register X            |  AA | Implied                       | N-----Z-  |     1 | 2 |
| TAY                |       | Transfer Accumulator to Index Register Y            |  A8 | Implied                       | N-----Z-  |     1 | 2 |
| TCD                |       | Transfer 16-bit Accumulator to Direct Page Register |  5B | Implied                       | N-----Z-  |     1 | 2 |
| TCS                |       | Transfer 16-bit Accumulator to Stack Pointer        |  1B | Implied                       |           |     1 | 2 |
| TDC                |       | Transfer Direct Page Register to 16-bit Accumulator |  7B | Implied                       | N-----Z-  |     1 | 2 |
| TRB _dp_           |       | Test and Reset Memory Bits Against Accumulator      |  14 | Direct Page                   | ------Z-  |     2 | 5[^2][^4] |
| TRB _addr_         |       | Test and Reset Memory Bits Against Accumulator      |  1C | Absolute                      | ------Z-  |     3 | 6[^3] |
| TSB _dp_           |       | Test and Set Memory Bits Against Accumulator        |  04 | Direct Page                   | ------Z-  |     2 | 5[^2][^4] |
| TSB _addr_         |       | Test and Set Memory Bits Against Accumulator        |  0C | Absolute                      | ------Z-  |     3 | 6[^4] |
| TSC                |       | Transfer Stack Pointer to 16-bit Accumulator        |  3B | Implied                       | N-----Z-  |     1 | 2 |
| TSX                |       | Transfer Stack Pointer to Index Register X          |  BA | Implied                       | N-----Z-  |     1 | 2 |
| TXA                |       | Transfer Index Register X to Accumulator            |  8A | Implied                       | N-----Z-  |     1 | 2 |
| TXS                |       | Transfer Index Register X to Stack Pointer          |  9A | Implied                       |           |     1 | 2 |
| TXY                |       | Transfer Index Register X to Index Register Y       |  9B | Implied                       | N-----Z-  |     1 | 2 |
| TYA                |       | Transfer Index Register Y to Accumulator            |  98 | Implied                       | N-----Z-  |     1 | 2 |
| TYX                |       | Transfer Index Register Y to Index Register X       |  BB | Implied                       | N-----Z-  |     1 | 2 |
| WAI                |       | Wait for Interrupt                                  |  CB | Implied                       |           |     1 | 3[^10] |
| WDM                |       | _Reserved for Future Expansion_                     |  42 |                               |           |     2 | 0[^11] |
| [XBA](/xba)        |       | Exchange B and A 8-bit Accumulators                 |  EB | Implied                       | N-----Z-  |     1 | 3 |
| XCE                |       | Exchange Carry and Emulation Flags                  |  FB | Implied                       | --MX---CE |     1 | 2 |

[^1]: Add 1 cycle if m=0 (16-bit memory/accumulator)

[^2]: Add 1 cycle if low byte of Direct Page Register is non-zero

[^3]: Add 1 cycle if adding index crosses a page boundary or x=0 (16-bit index registers)

[^4]: Add 2 cycles if m=0 (16-bit memory/accumulator)

[^5]: Add 1 cycle if branch is taken

[^6]: Add 1 cycle if branch taken crosses page boundary in emulation mode (e=1)

[^7]: Add 1 cycle for 65816 native mode (e=0)

[^8]: Add 1 cycle if x=0 (16-bit index registers)

[^9]: Uses 3 cycles to shut the processor down: additional cycles are required by reset to restart it

[^10]: Uses 3 cycles to shut the processor down: additional cycles are required by interrupt to restart it

[^11]: Byte and cycle counts subject to change in future processors which expand WDM into 2-byte opcode portions of instructions of varying lengths

[^12]: Add 1 byte if m=0 (16-bit memory/accumulator)

[^13]: Opcode is 1 byte, but program counter value pushed onto stack is incremented by 2 allowing for optional signature byte

[^14]: Add 1 byte if x=0 (16-bit index registers)

### Instruction Usage

#### ADC - Add with carry
Adds operand to the Accumulator; adds an additional 1 if carry is set.

    A: 0010    adc #$50    ; adds $50 to accumulator or 51 if carry is set
    A: 0060            ; result

#### AND - Perform AND to Accumulator
The operand is "AND"ed to the Accumulator. eg.

    A: 0010    and #$80    ; "AND"s $80 to accumulator
    A: 0000

#### ASL - Left shifts Accumulator, Memory
Shifts Memory or Accumulator left one bit. eg.

    A: 0010    asl A    ; Shift left by 1: 0x10 << 1
    A: 0020

#### BCC - Branch if carry clear
Jump to a new location within the -128 to 127 range if the carry flag is clear. Useful for comparing two numbers, branching if the second number less than the first. eg.

    P: --mxdi--        bcc next    ; since the carry flag is clear, it'll jump to next
                       lda #$00    ; this will not be executed
              next:    lda #$40

#### BCS - Branch if carry set
Like BCC, but only when carry is set. Good for branching "if greater than or equal to" in a comparison.

#### BEQ - Branch if equal
Branches is zero flag is set. This is useful for comparing numbers. eg.

     cpx #$50    ; if X is = $50, the zero flag is set
     beq next    ; branches to next if X = $50
     lda #$44
    next:
     lda #$00

#### BIT - Bit Test
Performs AND except only the flags are modified. eg.

    A: 0010    bit #$80    ; "AND"s $80 to accumulator but result not stored
    A: 0010

#### BMI - Branch if Minus
Branches if negative flag is set.

#### BNE - Branch if not equal
Branches if zero flag clear. Good when used with comparison. You can branch if the number it not equal to.

#### BPL - Branch if plus
Branches if negative flag clear.

#### BRA - Branch always
Branch to location PC + n where n is the difference between the current PC and the label we want to branch to.

#### BRK - Break to instruction
Causes a software break. The PC is loaded from a vector table from somewhere around `$FFE6`.

#### BRL - Branch Relative Long
Like BRA but with longer range (-32768 to 32767).

#### BVC - Branch if Overflow Clear
Branches if overflow flag is clear.

#### BVS - Branch if Overflow Set
Opposite of BVC.

#### CLC - Clear Carry Flag
Clears the carry flag.

#### CLD - Clear Decimal Flag
Clears the decimal flag.

#### CLI - Clear Interrupt Flag
Clears the interrupt Flag.

#### CLV - Clear Overflow Flag
Clears the Overflow flag.

#### CMP - Compare Accumulator with memory
#### CPX - Compare X with memory
#### CPY - Compare Y with memory
Compares Accumulator, X or Y with the operand. The `n-----zc` flags are affected by the comparison. If the result is negative, the n flag is set. If the result is zero (or equal), the z flag is set. Carry is clear when borrow is required; that is, if the register is less than the operand. eg.

    A: 0020 P: --mx-i--        cmp #$20    ; compare accumulator with $20, if equal, z flag is set
    A: 0020 P: --mx-iz-        beq next    ; branch if equal

#### COP - Coprocessor Empowerment
Causes a software interrupt using a vector.

#### DEC - Decrement Accumulator
#### DEX - Decrement X
#### DEY - Decrement Y
Subtracts 1 from A, X or Y. eg.

    Y: 0001    dey
    Y: 0000

#### EOR - Exclusive OR accumulator
Also known as "XOR".  Performs XOR to the Accumulator. eg.

    A: FFFF    eor #$DDDD
    A: 2222

#### INC - Increment Accumulator
#### INX - Increment X
#### INY - Increment Y
Adds 1 to A, X or Y. eg.

    A: 0000    inc
    A: 0001

#### JMP - Jump to location
#### JML - Jump long
The JMP command will jump to a location within the bank. The JML will jump to places out of the current bank. eg.

    PBR: $80    jmp $5500      ; jumps to $80:5500
    PBR: $80    jml $908000    ; jumps to $90:8000
    PBR: $90                   ; the PBR is updated in long jump

#### JSR - Jump Subroutine
#### JSL - Jump Subroutine Long
If you already know a programming language, this is basically calling a function. This performs the same as JMP except the address of the current program counter is saved. In subroutines, the RTS and RTL are used to return back to the saved address.

#### LDA - Load Accumulator with memory
#### LDX - Load X with memory
#### LDY - Load Y with memory
Loads the Accumulator, X, Y with a value.

#### LSR - Shift Right Accumulator, Memory
Shifts Memory or Accumulator right one bit. eg.

    A: 0080    lsr A    ; Shift right by 1: 0x80 >> 1
    A: 0040

#### MVN - Block move negative
#### MVP - Block move positive
A should hold the number of bytes to transfer minus one, meaning that a value of zero will transfer one byte. X and Y are the source and destination addresses, respectively, leaving out the banks. The banks are passed as the two operands of the instruction.

In MVN, X and Y are the bottom bytes of the source and destination blocks. After a byte is copied, both X and Y are incremented and A is decremented until A reaches $FFFF (after decrementing $0000), meaning that bytes from X to X + A were copied to the range from Y to Y + A.

In MVP, X and Y are the top bytes of the source and destination blocks. X, Y and A are decremented after each byte is copied, until A reaches $FFFF, so bytes from X to X - A are copied to the range from Y to Y - A.

Usually, MVN is used when the destination range is in a lower address than the source, otherwise MVP is used. This is a rule that avoids problems when the two address ranges overlap, assuring that every overlapping byte is read before being overwritten. However, as long as the programmer is aware of the consequences, it is possible to get useful results using the instructions the other way.

                               ; This example follows the rule of thumb: (src < dest) -> mvp
                               ; So it copies the memory as expected
    X: ???? Y: ???? A: ????    rep #$30     ; Make Accumulator and index 16-bit
    X: ???? Y: ???? A: ????    ldx #$1100   ; Set X to $1100
    X: 1100 Y: ???? A: ????    ldy #$1180   ; Set Y to $1180
    X: 1100 Y: 1180 A: ????    lda #$00FF   ; Set A to $00FF
    X: 1100 Y: 1180 A: 00FF    mvp $7E,$7E  ; Block move $100 bytes from $7E:1001-1100 -> $7E:1081-1180
    X: 1000 Y: 1080 A: FFFF    ...

                               ; This example does not follow the rule
                               ; (taken from Bushi Seiryuuden, 808B2F-808B3A)
                               ; In this case, two bytes are repeated over and over
    X: ???? Y: ???? A: ????    ldx #$28C0   ; Set X to $28C0
    X: 28C0 Y: ???? A: ????    ldy #$28C2   ; Set Y to $28C2
    X: 28C0 Y: 28C2 A: ????    lda #$013D   ; Set A to $013D
    X: 28C0 Y: 28C2 A: 013D    mvn $7E,$7E  ; The values at $7E:28C0-28C1 are repeated for $013E bytes
    X: 29FE Y: 2A00 A: FFFF    ...

#### NOP - No operation
Does nothing but take up 2 cycles.

#### ORA - OR Accumulator with memory
Performs "OR" to Accumulator. eg.

    A: 005F    ora #$7F    ; 0x5F | 0x7F
    A: 007F

#### PEA - Push Effective Address
Pushes a 16-bit operand onto the stack. The instruction is very misleading because you are really pushing an immediate onto the stack. eg.

    S: 1FFF    pea $FFFF    ; Pushes $FFFF onto the stack
    S: 1FFD                 ; stack decrements by 2

#### PEI - Push Effective Indirect Address
Pushes a 16-bit value from the indirect address of the operand. eg.

    Memory Dump:
    0000: 23 33 45 22 DD C7 FF 8D
    0001: 99 99 90 88 DD FF CC 67
    S: 1FFF    pei ($01)    ; push $4533 on the stack
    S: 1FFD

#### PER - Push Program Counter Relative
Pushes a 16-bit from that address taken by the current PC added to the operand. The range must be within (`0-65535`).

#### PHA - Push Accumulator
#### PHD - Push Direct Page Register
#### PHK - Push Program Bank
#### PHX - Push X
#### PHY - Push Y
Pushes the operand onto the stack.

#### PLA - Pull Accumulator
#### PLD - Pull Direct Page Register
#### PLP - Pull Flags
#### PLX - Pull X
#### PLY - Pull Y
Pops a value off the stack and stores it in the operand.

#### REP - Reset Flag
Clears the bits specified in the operands of the flag. eg.

    rep #$30    ; Clears bit 4 & 5 to make A, X, Y 16-bits

#### ROL - Rotate Bit Left
Equivalent to ASL, except the carry flag rather than a zero is shifted into the least significant bit. This operation acts as a 9-bit rotation in 8-bit mode or a 17-bit rotation in 16-bit mode.

    A: 8000    rol A    ; rotate 1 left
    A: 0001

#### ROR - Rotate Bit Right
Equivalent to LSR, except the carry flag rather than a zero is shifted into the most significant bit rather than a zero. This operation acts as a 9-bit rotation in 8-bit mode or a 17-bit rotation in 16-bit mode.

    A: 0001    ror A    ; rotate 1 right
    A: 8000

#### RTI - Return from Interrupt
Used to return from a interrupt handler.

#### RTS - Return from Subroutine
#### RTL - Return from Subroutine Long
Return the PC to the saved address caused by the JSR and JSL command. eg.

        jsl sub    ; jump to subroutine at label "sub"
        .
        .
        .
    sub:
        lda #$0000    ; some code
        rtl        ; return

#### SBC - Subtract with Carry
Subtracts operand from the Accumulator; subtracts an additional 1 if carry is **clear**.

#### SEC - Set Carry Flag
Sets the carry flag.

#### SED - Set Decimal Flag
Sets the decimal flag.

#### SEI - Set Interrupt Flag
Sets the interrupt flag.

#### SEP - Set Flag
Sets certain bits of the flag depending on the operand. eg.

    sep #$20    ; set bit 5 of P to make A 8-bits

#### STA - Store Accumulator to memory
#### STX - Store X to memory
#### STY - Store Y to memory
Stores the Accumulator, X or Y to a memory location. eg.

    A: 000F    sep #$20    ; 8-bit A
    A: 000F    sta $2100    ; Stores $0F to $2100

#### STP - Stop the clock
Dies.

#### STZ - Store zero to memory
Stores zero to a memory location. eg.

    stz $2101    ; store 0 to $2101

#### TAX - Transfer Accumulator to X
#### TAY - Transfer Accumulator to Y
#### TCD - Transfer Accumulator to Direct Page
sets the direct page to whatever is in A

    lda #$0000    ;the C refers to 16bit A
    tcd
    lda $34       ;same as lda $0034

#### TCS - Transfer Accumulator to Stack
#### TDC - Transfer Direct Page to Accumulator
if direct page is 0 then this functions to clear out 16bit A

    lda.w #$0000  ;3 bytes, 3 cycles
    tdc           ;1 byte, 2 cycles

#### TSC - Transfer Stack to Accumulator
#### TSX - Transfer stack to X
#### TXA - Transfer X to Accumulator
#### TXS - Transfer X to Stack
#### TXY - Transfer X to Y
#### TYA - Transfer Y to Accumulator
#### TYX - Transfer Y to X
Copies the content of one register to another. eg.

    A: 0099 X: 1FFF Y:5656 D:0020 S: FFFF    rep #$30
    A: 0099 X: 1FFF Y:5656 D:0020 S: FFFF    lda #$0000    ; load A with 0
    A: 0000 X: 1FFF Y:5656 D:0020 S: FFFF    tcd           ; transfer A -> D
    A: 0000 X: 1FFF Y:5656 D:0000 S: FFFF    txa           ; X -> A
    A: 1FFF X: 1FFF Y:5656 D:0000 S: FFFF    tcs           ; A -> S
    A: 1FFF X: 1FFF Y:5656 D:0000 S: 1FFF

You get the idea.

#### TRB - Test and Reset Bit
Tests the bit similarly to "AND", and clears it, while affecting the flags.

#### TSB - Test and Set Bit
Tests the bit similarly to "AND", and sets it, while affecting the flags.

#### WAI - Wait for Interrupt
Waits until a hardware interrupt is triggered.

#### XCE - Exchange Carry with Emulation
Well, the 65816 has actually 2 modes. Native and (6502) emulation mode. This tutorial deals with native only. The emulation bit shares the same bit as the carry flag so to put ourselves in native mode, we can only set the emulation flag via the carry and exchanging it. For native mode, the emulation flag must be off. To switch to native mode, we must clear the carry and exchange it. eg.

    clc
    xce

_Instruction usage adapted from [Jay's ASM Tutorial](/jay's-asm-tutorial)_

## Datasheets, Manuals etc.
Western Design Center Inc. has documentation on the 65816 [here](http://westerndesigncenter.com/wdc/documentation.cfm).

Of particular interest would be the [assembly-programming-manual-for-w65c816.pdf](/uploads/assembly-programming-manual-for-w65c816.pdf) aka "Programming the 65816 including the 6502, 65C02, and 65802" by David Eyes and Ron Lichty.
