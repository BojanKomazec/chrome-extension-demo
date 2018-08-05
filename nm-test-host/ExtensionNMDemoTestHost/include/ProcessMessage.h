// #pragma once
// #include "stdafx.h"

#include <vector>
#include <string>

bool ExtractRequest(const std::vector<char>& incoming_message, std::string& request);

// The message has the size header trimed, only contains the message body
bool ProcessRequest(const std::string& request, std::vector<char>& response, bool& isExitRequested);