// ExtensionVpnTestHost.cpp : Defines the entry point for the console application.
//
#include <array>
#include <fcntl.h>
#include <fstream>
#include <io.h>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <vector>
#include "include/ProcessMessage.h"

// Define union to read the message size easily
typedef union {
    unsigned long u32;
    unsigned char u8[4];
} U32_U8;

// On Windows, the default I / O mode is O_TEXT.Set this to O_BINARY
// to avoid unwanted modifications of the input / output streams.
int SetBinaryMode(FILE* file)
{
    int result;

    result = _setmode(_fileno(file), _O_BINARY);
    if (result == -1)
    {
        perror("Cannot set mode");
        return result;
    }
    // set do not use buffer
    result = setvbuf(file, NULL, _IONBF, 0);
    if (result != 0)
    {
        perror("Cannot set zero buffer");
        return result;
    }

    return 0;
}

// unsigned int is in memory (on PCs) in little endian (LSB comes first)
// Example: 0x0a0b0c0d has 4 bytes, 0x0a is MSB and 0x0d is LSB. 
// In memory they are ordered like this: 0x0d 0x0c 0x0b 0x0a.
// (Memory addresses increase from left to right)
// We want to order them so MSB goes first: 0x0a 0x0b 0x0c 0x0d.
// When assigning 4 byte type to a 1 byte type, the last byte is copied.
// If we assign unsigned int to unsigned char (on PCs) the last byte 
// is MSB and it will be copied.
std::vector<unsigned char> intToBytesBigEndian(unsigned int value)
{
    std::vector<unsigned char> result;
    // set LSB to the byte at the lowest address (Little Endian)
    result.push_back(value);
    result.push_back(value >> 8);
    result.push_back(value >> 16);
    result.push_back(value >> 24);
    return result;
}

bool Send(std::vector<char> message) {
    bool is_success = false;

    //std::array<char, 4> message_length;
    auto output_message_size = message.size();
    auto message_length = intToBytesBigEndian(output_message_size);
    auto written_elements_count = fwrite(&message_length[0], sizeof(unsigned char), message_length.size(), stdout);
    if (written_elements_count == message_length.size()) {
        written_elements_count = fwrite(&message[0], 1, output_message_size, stdout);
        if (written_elements_count == output_message_size) {
            fflush(stdout);
            is_success = true;
        }
        else {
            //OutputDebugString(L"ERROR: fwrite() failed to send message.");
        }
    }
    else {
        //OutputDebugString(L"ERROR: fwrite() failed to send message length.");
    }

    return is_success;
}

void log(const std::string &text)
{
    std::ofstream log_file("ExtensionNmDemoTestHost.log", std::ios_base::out | std::ios_base::app );
    log_file << text << std::endl;
}

// main logic
int main(int argc, char* argv[]) {
    //OutputDebugString(L"_tmain()");
    log("main()");

    if (SetBinaryMode(stdin) != 0) {
        return -1;
    }

    if (SetBinaryMode(stdout) != 0) {
        return -1;
    }

    bool isExitRequested = false;

    while (!isExitRequested) {
        // The format of raw message received from the stdin
        // IIIISSSSS...SS
        // IIII is a 4bytes integer in binary format. It is the lenth of the following json message.
        // SSSSS...SS is the json message immidiatlly follows the 4 bytes header. 
        // Each message is serialized using JSON, UTF-8 encoded and is preceded with 32-bit message length in native byte order.
        // You can send message back to chromium plugin by writing the same formated IIIISSSSS...SS to stdout.

        U32_U8 lenBuf;
        lenBuf.u32 = 0;
        //char* jsonMsg = NULL; // a json message encoded in utf-8 
        //std::cout.setf(std::ios_base::unitbuf);

        size_t items_read_count = fread(lenBuf.u8, 1, 4, stdin);

        if (items_read_count == 4) {
            int iLen = (int)lenBuf.u32;
            // now read the message
            if (iLen > 0) {
                std::vector<char> incoming_message; // a json message encoded in utf-8 
                // jsonMsg = (char*)malloc(8 * iLen);
                incoming_message.resize(8 * iLen);

                // items_read_count = fread(jsonMsg, 1, iLen, stdin);
                fread(&incoming_message[0], 1, iLen, stdin);

                std::string request;
                if (ExtractRequest(incoming_message, request)) {
                    std::vector<char> output_message;
                    if (ProcessRequest(request, output_message, isExitRequested)) {
                        Send(output_message);
                    }
                }
            }

            //uncomment it to debug the messaging 
            /*FILE* log = fopen("D:\\native.txt", "w");
            fwrite((void*)lenBuf.u8, 1, 4, log);
            fwrite(utf8Buffer, 1, iLen, log);
            fclose(log);*/
        } 
        else {
            // There is no need to introduce a special type of request (e.g. 'exit')
            // sent from the extension in order to make host app breaking the fread() 
            // loop and terminating the process. When extension popup closes it 
            // terminates the port connection rendering EOF in the stdin on the 
            // host app's side. So it is enough detecting EOF on the fread().
            // 'exit' message (in the extension) can be kept if we want to cause 
            // host app to terminate by sending this message rather than closing the 
            // (local) port.
            //
            if (feof(stdin)) {
                //OutputDebugString(L"fread() reached EOF.");
            }

            if (ferror(stdin)) {
                //OutputDebugString(L"fread() failed.");
            }

            //isExitRequested = true;
        }
    }
}